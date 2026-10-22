import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { createPinia } from "pinia";
import { describe, expect, it } from "vitest";
import { ASTROPOP_FLAVORS } from "../app/data/astroPopFlavors";
import AstroPopCartPage from "../app/pages/astro-pop/cart.vue";
import { useAstroPopCrateStore } from "../app/stores/astroPopCrate";

const renderCart = async (addBottles = false) => {
  const pinia = createPinia();
  const app = createSSRApp({ render: () => h(AstroPopCartPage) });
  app.use(pinia);
  app.component("NuxtLink", defineComponent({
    props: { to: { type: String, required: true } },
    setup(props, { slots }) {
      return () => h("a", { href: props.to }, slots.default?.());
    },
  }));

  if (addBottles) {
    useAstroPopCrateStore(pinia).addItem(ASTROPOP_FLAVORS[0].id, 2);
  }

  return renderToString(app);
};

describe("AstroPop cart page", () => {
  it("shows a friendly empty-cart state with a flavor-selection link", async () => {
    const html = await renderCart();

    expect(html).toContain("Your rocket crate is ready for liftoff.");
    expect(html).toContain("Choose your flavors");
    expect(html).toContain('href="/astro-pop"');
    expect(html).toContain('href="/astro-pop#pack-your-pop-title"');
    expect(html).not.toContain("Bottle roster");
  });

  it("renders selected bottles, capacity, and disabled future checkout", async () => {
    const html = await renderCart(true);

    expect(html).toContain(ASTROPOP_FLAVORS[0].name);
    expect(html).toContain(ASTROPOP_FLAVORS[0].bottleImage);
    expect(html).toContain("2 of 6 bottles");
    expect(html).toContain("Checkout · Coming soon");
    expect(html).toContain("disabled");
    expect(html).toContain('href="/astro-pop#pack-your-pop-title"');
  });
});
