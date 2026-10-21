import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { ASTROPOP_FLAVORS } from "../data/astroPopFlavors";

export type AstroPopFlavorId = (typeof ASTROPOP_FLAVORS)[number]["id"];

export interface AstroPopCrateItem {
  flavorId: AstroPopFlavorId;
  quantity: number;
}

const CRATE_CAPACITY = 6;
const flavorIds = new Set<AstroPopFlavorId>(
  ASTROPOP_FLAVORS.map((flavor) => flavor.id),
);

const isValidFlavorId = (flavorId: AstroPopFlavorId) =>
  flavorIds.has(flavorId);

const isValidQuantity = (quantity: number) =>
  Number.isInteger(quantity) && quantity > 0;

export const useAstroPopCrateStore = defineStore("astroPopCrate", () => {
  const items = ref<AstroPopCrateItem[]>([]);

  const totalBottles = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0),
  );

  const remainingCapacity = computed(() => CRATE_CAPACITY - totalBottles.value);
  const isFull = computed(() => totalBottles.value === CRATE_CAPACITY);
  const isEmpty = computed(() => items.value.length === 0);

  const addItem = (flavorId: AstroPopFlavorId, quantity = 1): boolean => {
    if (!isValidFlavorId(flavorId) || !isValidQuantity(quantity)) {
      return false;
    }

    if (quantity > remainingCapacity.value) {
      return false;
    }

    const existingItem = items.value.find(
      (item) => item.flavorId === flavorId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({ flavorId, quantity });
    }

    return true;
  };

  const decrementItem = (flavorId: AstroPopFlavorId): boolean => {
    const itemIndex = items.value.findIndex(
      (item) => item.flavorId === flavorId,
    );

    if (itemIndex === -1) {
      return false;
    }

    const item = items.value[itemIndex];

    if (!item) {
      return false;
    }

    if (item.quantity === 1) {
      items.value.splice(itemIndex, 1);
    } else {
      item.quantity -= 1;
    }

    return true;
  };

  const removeItem = (flavorId: AstroPopFlavorId): boolean => {
    const itemIndex = items.value.findIndex(
      (item) => item.flavorId === flavorId,
    );

    if (itemIndex === -1) {
      return false;
    }

    items.value.splice(itemIndex, 1);
    return true;
  };

  const clearCrate = (): boolean => {
    if (isEmpty.value) {
      return false;
    }

    items.value.splice(0);
    return true;
  };

  return {
    items,
    totalBottles,
    remainingCapacity,
    isFull,
    isEmpty,
    addItem,
    decrementItem,
    removeItem,
    clearCrate,
  };
});
