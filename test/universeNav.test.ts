import { createSSRApp, defineComponent, h, ref } from "vue";
import { renderToString } from "vue/server-renderer";
import { readFile } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import UniverseNav from "../app/components/universe/UniverseNav.vue";
import UniverseHomePage from "../app/pages/index.vue";

type AccountState = "signed-in" | "signed-out" | "loading";

const signOut = vi.fn();
const authState = ref<AccountState>("loading");
const user = ref<{ fullName?: string; imageUrl?: string } | null>(null);

vi.stubGlobal("useAuth", () => ({
  isLoaded: ref(authState.value !== "loading"),
  isSignedIn: ref(authState.value === "signed-in"),
  signOut,
}));
vi.stubGlobal("useUser", () => ({ user }));

const NuxtLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup: (props, { slots }) => () => h("a", { href: props.to }, slots.default?.()),
});

const renderWithAccountState = (component: typeof UniverseNav | typeof UniverseHomePage, accountState: AccountState) => {
  authState.value = accountState;
  user.value = accountState === "signed-in" ? { fullName: "Nova Ray", imageUrl: "https://example.test/nova.png" } : null;
  const app = createSSRApp({ render: () => h(component) });
  app.component("NuxtLink", NuxtLink);
  app.component("UniverseNav", UniverseNav);
  return renderToString(app);
};

describe("CosmoPort Universe navigation", () => {
  it("shows unavailable custom sign-in and registration controls to signed-out visitors", async () => {
    const html = await renderWithAccountState(UniverseNav, "signed-out");

    expect(html).toContain('aria-label="CosmoPort Universe"');
    expect(html).toContain("CosmoPort");
    expect(html).toContain("Universe");
    expect(html).toContain("Sign In");
    expect(html).toContain("Register");
    expect(html).toContain("disabled");
    expect(html).toContain("Passport Office opens");
    expect(html).not.toContain("UserButton");
  });

  it("shows a custom Clerk-image avatar and sign-out control to signed-in visitors", async () => {
    const html = await renderWithAccountState(UniverseNav, "signed-in");

    expect(html).toContain('src="https://example.test/nova.png"');
    expect(html).toContain('alt="Nova Ray profile image"');
    expect(html).toContain("Sign Out");
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

  it("keeps account controls pending until Clerk finishes loading", async () => {
    const html = await renderWithAccountState(UniverseNav, "loading");

    expect(html).toContain("Loading account controls");
    expect(html).not.toContain("Sign In");
    expect(html).not.toContain("Register");
    expect(html).not.toContain("Avatar");
  });

  it("renders the navigation on the Universe root while preserving both world links", async () => {
    const html = await renderWithAccountState(UniverseHomePage, "signed-out");

    expect(html).toContain('aria-label="CosmoPort Universe"');
    expect(html).toContain('aria-label="Experiences"');
    expect(html).toContain('href="/cosmoport-voyage"');
    expect(html).toContain('href="/astro-pop"');
  });

  it("is integrated only by the Universe root page", async () => {
    const [rootPage, appShell, astroPopPage, voyagePage] = await Promise.all([
      readFile(new URL("../app/pages/index.vue", import.meta.url), "utf8"),
      readFile(new URL("../app/app.vue", import.meta.url), "utf8"),
      readFile(new URL("../app/pages/astro-pop/index.vue", import.meta.url), "utf8"),
      readFile(new URL("../app/pages/cosmoport-voyage.vue", import.meta.url), "utf8"),
    ]);

    expect(rootPage).toContain("<UniverseNav />");
    expect(appShell).not.toContain("UniverseNav");
    expect(astroPopPage).not.toContain("UniverseNav");
    expect(voyagePage).not.toContain("UniverseNav");
  });

  it("uses Clerk composables and an SDK sign-out redirect without prebuilt Clerk UI", async () => {
    const source = await readFile(new URL("../app/components/universe/UniverseNav.vue", import.meta.url), "utf8");

    expect(source).toContain("useAuth()");
    expect(source).toContain("useUser()");
    expect(source).toContain('signOut({ redirectUrl: "/" })');
    expect(source).not.toContain("SignInButton");
    expect(source).not.toContain("SignUpButton");
    expect(source).not.toContain("UserButton");
  });
});
