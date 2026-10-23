import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { ASTROPOP_FLAVORS } from "../app/data/astroPopFlavors";
import { useAstroPopCrateStore } from "../app/stores/astroPopCrate";

const [cherryFlavor, citrusFlavor, limeFlavor] = ASTROPOP_FLAVORS;

describe("AstroPop crate store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts empty", () => {
    const store = useAstroPopCrateStore();

    expect(store.items).toEqual([]);
    expect(store.totalBottles).toBe(0);
    expect(store.remainingCapacity).toBe(6);
    expect(store.isFull).toBe(false);
    expect(store.isEmpty).toBe(true);
  });

  it("adds one bottle", () => {
    const store = useAstroPopCrateStore();

    expect(store.addItem(cherryFlavor.id)).toBe(true);
    expect(store.items).toEqual([{ flavorId: cherryFlavor.id, quantity: 1 }]);
    expect(store.totalBottles).toBe(1);
  });

  it("adds multiple bottles of the same flavor without duplicate entries", () => {
    const store = useAstroPopCrateStore();

    expect(store.addItem(cherryFlavor.id, 2)).toBe(true);
    expect(store.addItem(cherryFlavor.id, 3)).toBe(true);

    expect(store.items).toEqual([{ flavorId: cherryFlavor.id, quantity: 5 }]);
  });

  it("adds different flavors", () => {
    const store = useAstroPopCrateStore();

    store.addItem(cherryFlavor.id, 2);
    store.addItem(citrusFlavor.id, 1);

    expect(store.items).toEqual([
      { flavorId: cherryFlavor.id, quantity: 2 },
      { flavorId: citrusFlavor.id, quantity: 1 },
    ]);
    expect(store.totalBottles).toBe(3);
  });

  it("enforces the six-bottle capacity atomically", () => {
    const store = useAstroPopCrateStore();

    expect(store.addItem(cherryFlavor.id, 6)).toBe(true);
    expect(store.isFull).toBe(true);
    expect(store.remainingCapacity).toBe(0);
    expect(store.addItem(citrusFlavor.id)).toBe(false);
    expect(store.items).toEqual([{ flavorId: cherryFlavor.id, quantity: 6 }]);
  });

  it("rejects invalid flavors and quantities", () => {
    const store = useAstroPopCrateStore();
    const invalidFlavor = "not-a-flavor" as typeof cherryFlavor.id;

    expect(store.addItem(invalidFlavor)).toBe(false);
    expect(store.addItem(cherryFlavor.id, 0)).toBe(false);
    expect(store.addItem(cherryFlavor.id, -1)).toBe(false);
    expect(store.addItem(cherryFlavor.id, 1.5)).toBe(false);
    expect(store.items).toEqual([]);
  });

  it("decrements quantities and removes the item at zero", () => {
    const store = useAstroPopCrateStore();

    store.addItem(cherryFlavor.id, 2);

    expect(store.decrementItem(cherryFlavor.id)).toBe(true);
    expect(store.items).toEqual([{ flavorId: cherryFlavor.id, quantity: 1 }]);
    expect(store.decrementItem(cherryFlavor.id)).toBe(true);
    expect(store.items).toEqual([]);
    expect(store.decrementItem(cherryFlavor.id)).toBe(false);
  });

  it("removes a flavor entirely", () => {
    const store = useAstroPopCrateStore();

    store.addItem(cherryFlavor.id, 2);
    store.addItem(limeFlavor.id, 1);

    expect(store.removeItem(cherryFlavor.id)).toBe(true);
    expect(store.items).toEqual([{ flavorId: limeFlavor.id, quantity: 1 }]);
    expect(store.removeItem(cherryFlavor.id)).toBe(false);
  });

  it("clears the crate", () => {
    const store = useAstroPopCrateStore();

    store.addItem(cherryFlavor.id, 2);
    store.addItem(citrusFlavor.id, 1);

    expect(store.clearCrate()).toBe(true);
    expect(store.items).toEqual([]);
    expect(store.isEmpty).toBe(true);
    expect(store.clearCrate()).toBe(false);
  });

  it("updates computed state after each operation", () => {
    const store = useAstroPopCrateStore();

    store.addItem(cherryFlavor.id, 4);
    expect(store.totalBottles).toBe(4);
    expect(store.remainingCapacity).toBe(2);
    expect(store.isFull).toBe(false);
    expect(store.isEmpty).toBe(false);

    store.addItem(citrusFlavor.id, 2);
    expect(store.totalBottles).toBe(6);
    expect(store.remainingCapacity).toBe(0);
    expect(store.isFull).toBe(true);

    store.decrementItem(cherryFlavor.id);
    expect(store.totalBottles).toBe(5);
    expect(store.remainingCapacity).toBe(1);
    expect(store.isFull).toBe(false);
  });

  it("sets quantities through manual entry without exceeding the shared capacity", () => {
    const store = useAstroPopCrateStore();

    store.addItem(cherryFlavor.id, 2);
    store.addItem(citrusFlavor.id, 2);

    expect(store.setItemQuantity(cherryFlavor.id, 4)).toBe(true);
    expect(store.totalBottles).toBe(6);
    expect(store.setItemQuantity(citrusFlavor.id, 3)).toBe(false);
    expect(store.setItemQuantity(citrusFlavor.id, -1)).toBe(false);
    expect(store.setItemQuantity(citrusFlavor.id, 1.5)).toBe(false);
    expect(store.items).toEqual([
      { flavorId: cherryFlavor.id, quantity: 4 },
      { flavorId: citrusFlavor.id, quantity: 2 },
    ]);

    expect(store.setItemQuantity(cherryFlavor.id, 0)).toBe(true);
    expect(store.items).toEqual([{ flavorId: citrusFlavor.id, quantity: 2 }]);
    expect(store.remainingCapacity).toBe(4);
  });

  it("rejects cart mutations while checkout initialization is locked", () => {
    const store = useAstroPopCrateStore();
    store.addItem(cherryFlavor.id, 2);

    expect(store.lockCheckout()).toBe(true);
    expect(store.lockCheckout()).toBe(false);
    expect(store.addItem(citrusFlavor.id)).toBe(false);
    expect(store.decrementItem(cherryFlavor.id)).toBe(false);
    expect(store.removeItem(cherryFlavor.id)).toBe(false);
    expect(store.setItemQuantity(cherryFlavor.id, 1)).toBe(false);
    expect(store.clearCrate()).toBe(false);
    expect(store.items).toEqual([{ flavorId: cherryFlavor.id, quantity: 2 }]);

    store.unlockCheckout();
    expect(store.addItem(citrusFlavor.id)).toBe(true);
    expect(store.isCheckoutLocked).toBe(false);
  });
});
