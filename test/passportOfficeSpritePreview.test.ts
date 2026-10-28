import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import PassportOfficeSpritePreview from "../app/pages/passport-office/sprite-preview.vue";

const NuxtLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup: (props, { slots }) => () => h("a", { href: props.to }, slots.default?.()),
});

describe("Passport Office Stella sprite preview", () => {
  it("renders Stella's exact versioned CDN object with preview controls", async () => {
    const app = createSSRApp(PassportOfficeSpritePreview);
    app.component("NuxtLink", NuxtLink);
    const html = await renderToString(app);

    expect(html).toContain('src="https://media.cosmos-universe.com/passport-office/stella/v0/stella-blink.webp"');
    expect(html).toContain('alt="Stella, the Passport Office attendant, blinking"');
    expect(html).toContain("Use dark background");
    expect(html).toContain('href="/"');
    expect(html).toContain("Back to the Universe");
  });
});
