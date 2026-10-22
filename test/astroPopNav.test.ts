import { createSSRApp, defineComponent, h } from "vue";
import { createPinia } from "pinia";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import AstroPopNav from "../app/components/astro-pop/AstroPopNav.vue";
import { ASTROPOP_FLAVORS } from "../app/data/astroPopFlavors";
import { useAstroPopCrateStore } from "../app/stores/astroPopCrate";

const renderNavigation = async (bottles = 0) => {
  const pinia = createPinia();
  const app = createSSRApp({ render: () => h(AstroPopNav) });
  app.use(pinia);
  app.component("NuxtLink", defineComponent({
    props: { to: { type: String, required: true } },
    setup(props, { slots }) {
      return () => h("a", { href: props.to }, slots.default?.());
    },
  }));

  if (bottles > 0) {
    useAstroPopCrateStore(pinia).addItem(ASTROPOP_FLAVORS[0].id, bottles);
  }

  return renderToString(app);
};

describe("AstroPop navigation", () => {
  it("renders section links, the cap control, and the accessible cart quantity", async () => {
    const html = await renderNavigation();
    expect(html).toContain('aria-label="AstroPop navigation"');
    expect(html).toContain("Open navigation menu");
    expect(html).toContain('href="#astropop-flavors-title"');
    expect(html).toContain('href="#pack-your-pop-title"');
    expect(html).toContain('href="#astropop-delivery-plans"');
    expect(html).toContain('href="#astropop-delivery-testimonials"');
    expect(html).toContain('href="/astro-pop/cart"');
    expect(html).toContain("Cart, 0 bottles");
  });

  it("uses the current Pinia crate quantity in the cart label", async () => {
    const html = await renderNavigation(2);

    expect(html).toContain("Cart, 2 bottles");
    expect(html).toContain(">2</span>");
  });
});
