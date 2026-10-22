import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import DecorativeImage from "../app/components/shared/DecorativeImage.vue";

describe("DecorativeImage", () => {
  it("renders a decorative image with accessible defaults", async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(DecorativeImage, {
            src: "/images/astro-pop/bottles/Vintage AstroPop Soda Cap.png",
          }),
      }),
    );

    expect(html).toContain("decorative-image");
    expect(html).toContain(
      "/images/astro-pop/bottles/Vintage AstroPop Soda Cap.png",
    );
    expect(html).toContain('alt aria-hidden="true"');
  });
});
