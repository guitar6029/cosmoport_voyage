import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import AstroPopDeliveryPlansSection from "../app/components/AstroPopDeliveryPlansSection.vue";

describe("AstroPop delivery plans section", () => {
  it("renders its heading and supporting copy", async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(AstroPopDeliveryPlansSection) }),
    );

    expect(html).toContain('id="astropop-delivery-plans"');
    expect(html).toContain("The Astro Delivery Plans");
    expect(html).toContain("As much AstroPop as your heart desires!");
  });
});
