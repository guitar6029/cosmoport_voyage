// @vitest-environment jsdom
import { createSSRApp, h, ref } from "vue";
import { createApp, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ASTROPOP_FLAVORS } from "../app/data/astroPopFlavors";
import AstroPopBottleSelectionCard from "../app/components/astro-pop/AstroPopBottleSelectionCard.vue";
import AstroPopPackYourPopSection from "../app/components/astro-pop/AstroPopPackYourPopSection.vue";
import { useAstroPopCrateStore } from "../app/stores/astroPopCrate";

const renderComponent = (component: typeof AstroPopBottleSelectionCard, props = {}) =>
  renderToString(createSSRApp({ render: () => h(component, props) }));

describe("AstroPop bottle selection card", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the card, bottle image, flavor title, and disabled Add Bottle button", async () => {
    const flavor = ASTROPOP_FLAVORS[0];
    const html = await renderComponent(AstroPopBottleSelectionCard, { flavor });

    expect(html).toContain("bottle-selection-card");
    expect(html).toContain(flavor.bottleImage);
    expect(html).toContain(`alt=\"${flavor.name} AstroPop bottle\"`);
    expect(html).toContain(flavor.name.split(" ")[0]);
    expect(html).toContain(flavor.name.split(" ").slice(1).join(" "));
    expect(html).toContain("Add Bottle");
    expect(html).not.toContain("disabled");
  });

  it("emits the selected flavor ID when Add Bottle is clicked", async () => {
    const flavor = ASTROPOP_FLAVORS[0];
    const emittedFlavorIds: string[] = [];
    const container = document.createElement("div");
    const app = createApp(AstroPopBottleSelectionCard, {
      flavor,
      onAdd: (flavorId: string) => emittedFlavorIds.push(flavorId),
    });

    document.body.appendChild(container);
    app.mount(container);
    (container.querySelector("button") as HTMLButtonElement).click();
    await nextTick();

    expect(emittedFlavorIds).toEqual([flavor.id]);
    app.unmount();
    container.remove();
  });

  it("shows and restarts the added confirmation when its success token changes", async () => {
    vi.useFakeTimers();
    const flavor = ASTROPOP_FLAVORS[0];
    const successToken = ref(0);
    const container = document.createElement("div");
    const app = createApp({
      setup: () => () => h(AstroPopBottleSelectionCard, { flavor, successToken: successToken.value }),
    });

    document.body.appendChild(container);
    app.mount(container);

    successToken.value += 1;
    await nextTick();
    expect(container.querySelector("button")?.textContent).toContain("✓ ADDED!");

    vi.advanceTimersByTime(750);
    successToken.value += 1;
    await nextTick();
    vi.advanceTimersByTime(750);
    expect(container.querySelector("button")?.textContent).toContain("✓ ADDED!");

    vi.advanceTimersByTime(50);
    await nextTick();
    expect(container.querySelector("button")?.textContent).toContain("Add Bottle");

    app.unmount();
    container.remove();
  });
});

describe("AstroPop Pack Your Pop section", () => {
  it("renders one selection card for every AstroPop flavor", async () => {
    setActivePinia(createPinia());
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

  it("adds bottles through Pinia and disables buttons at capacity", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const crateStore = useAstroPopCrateStore(pinia);
    const container = document.createElement("div");
    const app = createApp(AstroPopPackYourPopSection);

    app.use(pinia);
    document.body.appendChild(container);
    app.mount(container);

    const buttons = Array.from(
      container.querySelectorAll<HTMLButtonElement>("button"),
    );

    buttons[0]?.click();
    buttons[0]?.click();
    buttons[1]?.click();
    buttons[0]?.click();
    buttons[0]?.click();
    buttons[0]?.click();
    await nextTick();

    expect(crateStore.items).toEqual([
      { flavorId: ASTROPOP_FLAVORS[0].id, quantity: 5 },
      { flavorId: ASTROPOP_FLAVORS[1].id, quantity: 1 },
    ]);
    expect(crateStore.totalBottles).toBe(6);
    expect(buttons.every((button) => button.disabled)).toBe(true);
    expect(container.textContent).toContain("Atomic Cherry Fizz added · 6 of 6 bottles");

    buttons[2]?.click();
    await nextTick();
    expect(crateStore.totalBottles).toBe(6);

    app.unmount();
    container.remove();
  });
});
