import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import { ASTROPOP_FLAVORS } from "../app/data/astroPopFlavors";
import AstroPopBottleSelectionCard from "../app/components/AstroPopBottleSelectionCard.vue";
import AstroPopPackYourPopSection from "../app/components/AstroPopPackYourPopSection.vue";

const renderComponent = (component: typeof AstroPopBottleSelectionCard, props = {}) =>
  renderToString(createSSRApp({ render: () => h(component, props) }));

describe("AstroPop bottle selection card", () => {
  it("renders the card, bottle image, flavor title, and disabled Add Bottle button", async () => {
    const flavor = ASTROPOP_FLAVORS[0];
    const html = await renderComponent(AstroPopBottleSelectionCard, { flavor });

    expect(html).toContain("bottle-selection-card");
    expect(html).toContain(flavor.bottleImage);
    expect(html).toContain(`alt=\"${flavor.name} AstroPop bottle\"`);
    expect(html).toContain(flavor.name.split(" ")[0]);
    expect(html).toContain(flavor.name.split(" ").slice(1).join(" "));
    expect(html).toContain("Add Bottle");
    expect(html).toContain("disabled");
  });
});

describe("AstroPop Pack Your Pop section", () => {
  it("renders one selection card for every AstroPop flavor", async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(AstroPopPackYourPopSection) }),
    );

    expect(html.match(/class="bottle-selection-card /g)).toHaveLength(
      ASTROPOP_FLAVORS.length,
    );

    for (const flavor of ASTROPOP_FLAVORS) {
      expect(html).toContain(flavor.name);
      expect(html).toContain(flavor.bottleImage);
    }
  });
});
