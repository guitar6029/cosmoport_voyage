import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import { dialogueFor, openingDialogueStep, PASSPORT_OFFICE_DIALOGUE } from "../app/data/passportOfficeDialogue";
import { PASSPORT_OFFICE_MEDIA, PASSPORT_OFFICE_MEDIA_BASE_URL } from "../app/data/passportOfficeMedia";
import PassportOfficePage from "../app/pages/passport-office/index.vue";
import PassportOfficeRegistration from "../app/components/passport-office/PassportOfficeRegistration.vue";

const NuxtLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup: (props, { slots }) => () => h("a", { href: props.to }, slots.default?.()),
});

describe("Passport Office scene", () => {
  it("maps only the approved background and Stella CDN objects", () => {
    expect(PASSPORT_OFFICE_MEDIA_BASE_URL).toBe("https://media.cosmos-universe.com/passport-office");
    expect(PASSPORT_OFFICE_MEDIA.background).toContain("retro-spaceport-passport-bureau.png");
    expect(PASSPORT_OFFICE_MEDIA.stella).toMatchObject({
      idle: expect.stringContaining("stella-idle-blink.webp"),
      talking: expect.stringContaining("stella-talking-test.webp"),
      happy: expect.stringContaining("stella-happy.webp"),
      welcome: expect.stringContaining("stella-welcome.webp"),
    });
  });

  it("renders the continuous background, Stella, dialogue choices, and an accessible exit", async () => {
    const app = createSSRApp(PassportOfficePage);
    app.component("NuxtLink", NuxtLink);
    app.component("PassportOfficeRegistration", PassportOfficeRegistration);
    const html = await renderToString(app);

    expect(html).toContain(PASSPORT_OFFICE_MEDIA.background);
    expect(html).toContain(PASSPORT_OFFICE_MEDIA.stella.welcome);
    expect(html).toContain("I&#39;d like to apply for a passport!");
    expect(html).toContain('href="/"');
    expect(html).toContain("Exit Office");
    expect(html).toContain('role="status"');
  });

  it("uses Clerk's Vue computed setActive ref and custom email-code methods", async () => {
    const source = await readFile(resolve(process.cwd(), "app/components/passport-office/PassportOfficeRegistration.vue"), "utf8");
    expect(source).toContain("setActive.value");
    expect(source).toContain("prepareEmailAddressVerification({ strategy: \"email_code\" })");
    expect(source).toContain("attemptEmailAddressVerification");
    expect(source).toContain("emit(\"complete\")");
  });

  it("keeps dialogue branching data-driven and provides restart navigation", () => {
    expect(PASSPORT_OFFICE_DIALOGUE.apply.lines.join(" ")).toContain("application counter is being prepared");
    expect(PASSPORT_OFFICE_DIALOGUE.returning.lines.join(" ")).toContain("later story");
    expect(PASSPORT_OFFICE_DIALOGUE.browse.lines.join(" ")).toContain("paperwork robot");
    expect(PASSPORT_OFFICE_DIALOGUE.apply.stella).toBe("happy");
    expect(dialogueFor("apply").lines[0]).toContain("Splendid");
    expect(dialogueFor(openingDialogueStep()).choices).toHaveLength(3);
  });

  it("uses a static reduced-motion portrait and graceful CDN fallbacks", async () => {
    const source = await readFile(resolve(process.cwd(), "app/pages/passport-office/index.vue"), "utf8");
    expect(source).toContain("prefers-reduced-motion: reduce");
    expect(source).toContain("if (reducedMotion.value) return PASSPORT_OFFICE_MEDIA.stella.happy");
    expect(source).toContain("handleImageError");
    expect(source).toContain("Stella will be right back.");
    expect(source).toContain("backgroundFailed = ref(false)");
    expect(source).toContain("passport-office__background-fallback");
    expect(source).toContain("@error=\"backgroundFailed = true\"");
    expect(source).toContain("@media (max-width: 44rem)");
    expect(source).toContain("grid-template-columns: 1fr");
  });
});
