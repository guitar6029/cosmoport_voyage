import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { dialogueFor, openingDialogueStep, PASSPORT_OFFICE_DIALOGUE } from "../app/data/passportOfficeDialogue";
import { PASSPORT_OFFICE_MEDIA, PASSPORT_OFFICE_MEDIA_BASE_URL } from "../app/data/passportOfficeMedia";
import PassportOfficePage from "../app/pages/passport-office/index.vue";
import PassportOfficeRegistration from "../app/components/passport-office/PassportOfficeRegistration.vue";

const NuxtLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup: (props, { slots }) => () => h("a", { href: props.to }, slots.default?.()),
});

describe("Passport Office", () => {
  it("maps the approved Passport Bureau background and registration interior", () => {
    expect(PASSPORT_OFFICE_MEDIA_BASE_URL).toBe("https://media.cosmos-universe.com/passport-office");
    expect(PASSPORT_OFFICE_MEDIA.background).toContain("retro-spaceport-passport-bureau.png");
    expect(PASSPORT_OFFICE_MEDIA.passportCover).toContain("cosmoport-passport-cover.png");
    expect(PASSPORT_OFFICE_MEDIA.passportInterior).toContain("cosmoport-passport-inside.png");
  });

  it("renders the continuous background, Stella's dialogue, choices, and an accessible exit", async () => {
    vi.stubGlobal("useAuth", () => ({ isSignedIn: ref(false) }));
    const app = createSSRApp(PassportOfficePage);
    app.component("NuxtLink", NuxtLink);
    app.component("PassportOfficeRegistration", PassportOfficeRegistration);
    const html = await renderToString(app);

    expect(html).toContain(PASSPORT_OFFICE_MEDIA.background);
    expect(html).toContain("A message from Stella Starling");
    expect(html).toContain("I&#39;d like to apply for a passport!");
    expect(html).toContain('href="/"');
    expect(html).toContain("Exit Office");
    expect(html).toContain('role="status"');
  });

  it("uses Clerk's Vue computed setActive ref and custom email-code methods", async () => {
    const source = await readFile(resolve(process.cwd(), "app/composables/usePassportOfficeRegistration.ts"), "utf8");
    expect(source).toContain("setActive.value");
    expect(source).toContain("prepareEmailAddressVerification({ strategy: \"email_code\" })");
    expect(source).toContain("attemptEmailAddressVerification");
    expect(source).toContain("complete();");
  });

  it("keeps dialogue branching data-driven and provides restart navigation", () => {
    expect(PASSPORT_OFFICE_DIALOGUE.apply.lines.join(" ")).toContain("application counter is being prepared");
    expect(PASSPORT_OFFICE_DIALOGUE.returning.lines.join(" ")).toContain("later story");
    expect(PASSPORT_OFFICE_DIALOGUE.browse.lines.join(" ")).toContain("paperwork robot");
    expect(dialogueFor("apply").lines[0]).toContain("Splendid");
    expect(dialogueFor(openingDialogueStep()).choices).toHaveLength(3);
  });

  it("keeps the interface responsive, motion-safe, and retains the background CDN fallback", async () => {
    const source = await readFile(resolve(process.cwd(), "app/pages/passport-office/index.vue"), "utf8");
    expect(source).toContain("prefers-reduced-motion: reduce");
    expect(source).toContain("backgroundFailed = ref(false)");
    expect(source).toContain("passport-office__background-fallback");
    expect(source).toContain("@error=\"backgroundFailed = true\"");
    expect(source).toContain("@media (max-width: 44rem)");
    expect(source).toContain("grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr))");
    expect(source).not.toContain("PASSPORT_OFFICE_MEDIA.stella");
    expect(source).not.toContain("handleImageError");
  });

  it("uses native password-manager fields, a password-safe review, and a full-bleed passport interior", async () => {
    const source = await readFile(resolve(process.cwd(), "app/components/passport-office/PassportOfficeRegistration.vue"), "utf8");
    expect(source).toContain('name="firstName"');
    expect(source).toContain('name="lastName"');
    expect(source).toContain('name="emailAddress"');
    expect(source).toContain('name="password"');
    expect(source).toContain('autocomplete="new-password"');
    expect(source).toContain("Review application");
    expect(source).toContain("Make corrections");
    expect(source).toContain("will not be displayed here");
    expect(source).toContain("PASSPORT_OFFICE_MEDIA.passportInterior");
    expect(source).toContain("object-fit:cover");
    expect(source).not.toContain("border:2px dashed");
    expect(source).toContain("Given Name (First Name)");
    expect(source).toContain("Family Name (Last Name)");
    expect(source).toContain("Contact Signal (Email Address)");
    expect(source).toContain("Secure Launch Phrase (Password)");
    expect(source).toContain("passportCoverFailed = true");
    expect(source).toContain("@media (max-width:44rem)");
  });

  it("keeps Stella's introduction on the main office screen and isolates registration from her dialogue", async () => {
    const source = await readFile(resolve(process.cwd(), "app/pages/passport-office/index.vue"), "utf8");
    expect(source).toContain('v-if="isRegistering" class="passport-office__registration-shell"');
    expect(source).toContain("CosmoPort traveler registration");
    expect(source).toContain("A message from Stella Starling");
    expect(source).not.toContain('v-if="isRegistering">Wonderful');
  });
});
