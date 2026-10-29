// @vitest-environment jsdom
import { createApp, createSSRApp, defineComponent, h, nextTick, ref } from "vue";
import { renderToString } from "vue/server-renderer";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import UniverseNav from "../app/components/universe/UniverseNav.vue";
import UniverseMultiverseCollage from "../app/components/universe/UniverseMultiverseCollage.vue";
import UniverseHomePage from "../app/pages/index.vue";
import UniverseAboutPage from "../app/pages/about.vue";

type AccountState = "signed-in" | "signed-out" | "loading";

const signOut = vi.fn();
const authState = ref<AccountState>("loading");
const user = ref<{ fullName?: string; imageUrl?: string; primaryEmailAddress?: { emailAddress: string } } | null>(null);

vi.stubGlobal("useAuth", () => ({
  isLoaded: ref(authState.value !== "loading"),
  isSignedIn: ref(authState.value === "signed-in"),
  signOut: ref(signOut),
}));
vi.stubGlobal("useUser", () => ({ user }));
vi.stubGlobal("useSeoMeta", vi.fn());

const mountSignedInNavigation = () => {
  authState.value = "signed-in";
  user.value = { fullName: "Nova Ray", imageUrl: "https://example.test/nova.png", primaryEmailAddress: { emailAddress: "nova@example.test" } };
  const container = document.createElement("div");
  const app = createApp(UniverseNav);

  app.component("NuxtLink", NuxtLink);
  document.body.appendChild(container);
  app.mount(container);

  return { app, container };
};

const flushSignOut = async () => {
  await Promise.resolve();
  await nextTick();
};

const NuxtLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup: (props, { slots }) => () => h("a", { href: props.to }, slots.default?.()),
});

const renderWithAccountState = (component: typeof UniverseNav | typeof UniverseHomePage | typeof UniverseAboutPage, accountState: AccountState) => {
  authState.value = accountState;
  user.value = accountState === "signed-in" ? { fullName: "Nova Ray", imageUrl: "https://example.test/nova.png", primaryEmailAddress: { emailAddress: "nova@example.test" } } : null;
  const app = createSSRApp({ render: () => h(component) });
  app.component("NuxtLink", NuxtLink);
  app.component("UniverseNav", UniverseNav);
  app.component("UniverseMultiverseCollage", UniverseMultiverseCollage);
  return renderToString(app);
};

describe("CosmoPort Universe navigation", () => {
  afterEach(() => {
    vi.clearAllMocks();
    document.body.replaceChildren();
  });
  it("links signed-out visitors directly to the custom sign-in and registration flows", async () => {
    const html = await renderWithAccountState(UniverseNav, "signed-out");

    expect(html).toContain('aria-label="CosmoPort Universe"');
    expect(html).toContain("CosmoPort");
    expect(html).toContain("Universe");
    expect(html).toContain("Sign In");
    expect(html).toContain("Register");
    expect(html).toContain('href="/passport-office?intent=sign-in"');
    expect(html).toContain('href="/passport-office?intent=register"');
    expect(html).not.toContain("UserButton");
  });

  it("shows a custom Clerk-image Account control to signed-in visitors", async () => {
    const html = await renderWithAccountState(UniverseNav, "signed-in");

    expect(html).toContain('src="https://example.test/nova.png"');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain("Account");
    expect(html).not.toContain("Sign Out");
    expect(html).not.toContain("Sign In");
    expect(html).not.toContain("Register");
  });

  it("uses a branded fallback avatar when Clerk has no image", async () => {
    authState.value = "signed-in";
    user.value = { fullName: "Nova Ray" };
    const app = createSSRApp({ render: () => h(UniverseNav) });
    app.component("NuxtLink", NuxtLink);
    const html = await renderToString(app);

    expect(html).toContain("NR");
    expect(html).toContain("universe-nav__avatar--fallback");
  });

  it("opens an Account menu with identity details and requests a Clerk sign-out to the Universe root", async () => {
    signOut.mockResolvedValue(undefined);
    const { app, container } = mountSignedInNavigation();
    const accountButton = container.querySelector<HTMLButtonElement>(".universe-nav__account-toggle");
    accountButton?.click();
    await nextTick();
    expect(container.querySelector('[role="menu"]')?.textContent).toContain("Nova Ray");
    expect(container.querySelector('[role="menu"]')?.textContent).toContain("nova@example.test");
    const button = container.querySelector<HTMLButtonElement>(".universe-nav__menu-sign-out");

    button?.click();
    await flushSignOut();

    expect(signOut).toHaveBeenCalledWith({ redirectUrl: "/" });
    expect(button?.disabled).toBe(false);
    expect(container.querySelector('[role="alert"]')).toBeNull();

    app.unmount();
  });

  it("shows a safe error after sign-out fails, resets loading, and permits a retry", async () => {
    let rejectSignOut: (reason?: unknown) => void = () => undefined;
    signOut.mockImplementationOnce(() => new Promise<void>((_resolve, reject) => {
      rejectSignOut = reject;
    }));
    signOut.mockResolvedValueOnce(undefined);
    const { app, container } = mountSignedInNavigation();
    container.querySelector<HTMLButtonElement>(".universe-nav__account-toggle")?.click();
    await nextTick();
    const button = container.querySelector<HTMLButtonElement>(".universe-nav__menu-sign-out");

    button?.click();
    button?.click();
    await nextTick();
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(button?.disabled).toBe(true);
    expect(button?.textContent).toContain("Signing Out");

    rejectSignOut(new Error("Sensitive provider failure"));
    await flushSignOut();

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain("We couldn't sign you out. Please try again.");
    expect(alert?.textContent).not.toContain("Sensitive provider failure");
    expect(button?.disabled).toBe(false);
    expect(button?.textContent).toContain("Sign Out");

    button?.click();
    await flushSignOut();
    expect(signOut).toHaveBeenCalledTimes(2);
    expect(container.querySelector('[role="alert"]')).toBeNull();

    app.unmount();
  });

  it("keeps account controls pending until Clerk finishes loading", async () => {
    const html = await renderWithAccountState(UniverseNav, "loading");

    expect(html).toContain("Loading account controls");
    expect(html).not.toContain("Sign In");
    expect(html).not.toContain("Register");
    expect(html).not.toContain("Avatar");
  });

  it("closes the Account menu with Escape", async () => {
    const { app, container } = mountSignedInNavigation();
    const button = container.querySelector<HTMLButtonElement>(".universe-nav__account-toggle");
    button?.click();
    await nextTick();
    expect(container.querySelector('[role="menu"]')).not.toBeNull();
    button?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(container.querySelector('[role="menu"]')).toBeNull();
    app.unmount();
  });

  it("renders the navigation on the Universe root while preserving both world links", async () => {
    const html = await renderWithAccountState(UniverseHomePage, "signed-out");

    expect(html).toContain('aria-label="CosmoPort Universe"');
    expect(html).toContain('aria-label="Experiences"');
    expect(html).toContain('href="/cosmoport-voyage"');
    expect(html).toContain('href="/astro-pop"');
    expect(html).toContain('href="/passport-office"');
    expect(html).toContain("Visit the Passport Office");
    expect(html).not.toContain("preview");
    expect(html).toContain('href="/about"');
  });

  it("renders the Universe About page with its destinations, engineering story, and home CTA", async () => {
    const html = await renderWithAccountState(UniverseAboutPage, "signed-out");

    expect(html).toContain("One Universe.");
    expect(html).toContain("Endless Possibilities.");
    expect(html).toContain("Astro Pop");
    expect(html).toContain('href="/astro-pop"');
    expect(html).toContain("In development");
    expect(html).toContain("The Engineering");
    expect(html).toContain("Cloudflare");
    expect(html).toContain("Built with curiosity.");
    expect(html).toContain('href="/"');
    expect(html.match(/<img/g)).toHaveLength(6);
  });

  it("is integrated only by the Universe root page", async () => {
    const [rootPage, appShell, astroPopPage, voyagePage] = await Promise.all([
      readFile(resolve(process.cwd(), "app/pages/index.vue"), "utf8"),
      readFile(resolve(process.cwd(), "app/app.vue"), "utf8"),
      readFile(resolve(process.cwd(), "app/pages/astro-pop/index.vue"), "utf8"),
      readFile(resolve(process.cwd(), "app/pages/cosmoport-voyage.vue"), "utf8"),
    ]);

    expect(rootPage).toContain("<UniverseNav />");
    expect(appShell).not.toContain("UniverseNav");
    expect(astroPopPage).not.toContain("UniverseNav");
    expect(voyagePage).not.toContain("UniverseNav");
  });

  it("uses Clerk composables and an SDK sign-out redirect without prebuilt Clerk UI", async () => {
    const source = await readFile(resolve(process.cwd(), "app/components/universe/UniverseNav.vue"), "utf8");

    expect(source).toContain("useAuth()");
    expect(source).toContain("useUser()");
    expect(source).toContain('signOut.value({ redirectUrl: "/" })');
    expect(source).toContain('to="/passport-office?intent=sign-in"');
    expect(source).toContain('to="/passport-office?intent=register"');
    expect(source).toContain('aria-haspopup="menu"');
    expect(source).not.toContain('to="/account"');
    expect(source).not.toContain("SignInButton");
    expect(source).not.toContain("SignUpButton");
    expect(source).not.toContain("UserButton");
  });
});
