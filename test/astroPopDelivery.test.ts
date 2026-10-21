import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import AstroPopDeliverySection from "../app/components/AstroPopDeliverySection.vue";

describe("AstroPop delivery section", () => {
  it("renders its heading, delivery hero image, and View Plans CTA", async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(AstroPopDeliverySection) }),
    );

    expect(html).toContain("AstroPop Delivers!");
    expect(html).toContain(
      "/images/astro-pop/delivery/AstroPop%20Delivers_%20Retro%20Soda%20Adventure.png",
    );
    expect(html).toContain("View Plans");
    expect(html).toContain('href="#astropop-delivery-plans"');
  });
});
