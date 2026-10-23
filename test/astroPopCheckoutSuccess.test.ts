// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { ASTROPOP_FLAVORS } from "../app/data/astroPopFlavors";
import { useAstroPopCrateStore } from "../app/stores/astroPopCrate";
import {
  PENDING_ASTROPOP_CHECKOUT_STORAGE_KEY,
  completeVerifiedAstroPopCheckout,
  getPendingAstroPopCheckout,
  savePendingAstroPopCheckout,
} from "../app/utils/astroPopCheckout";

describe("AstroPop checkout success", () => {
  const sessionId = "cs_test_astro_pop_123";
  const checkoutItems = [{ flavorId: ASTROPOP_FLAVORS[0].id, quantity: 2 }];

  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    setActivePinia(createPinia());
  });

  it("matches a browser return to the pending checkout session", () => {
    savePendingAstroPopCheckout(sessionId, checkoutItems);

    expect(getPendingAstroPopCheckout()).toEqual({
      sessionId,
      cartItems: checkoutItems,
    });
  });

  it("clears the restored Pinia cart and local storage after verification", () => {
    window.localStorage.setItem("astropop-crate", JSON.stringify(checkoutItems));
    savePendingAstroPopCheckout(sessionId, checkoutItems);
    const store = useAstroPopCrateStore();
    const pendingCheckout = getPendingAstroPopCheckout();

    expect(pendingCheckout).not.toBeNull();
    expect(
      completeVerifiedAstroPopCheckout(store, pendingCheckout!, {
        sessionId,
        verified: true,
      }),
    ).toBe(true);
    expect(store.items).toEqual([]);
    expect(window.localStorage.getItem("astropop-crate")).toBeNull();
    expect(window.sessionStorage.getItem(PENDING_ASTROPOP_CHECKOUT_STORAGE_KEY)).toBeNull();
  });

  it("preserves the cart when verification fails or the cart changed", () => {
    window.localStorage.setItem("astropop-crate", JSON.stringify(checkoutItems));
    savePendingAstroPopCheckout(sessionId, checkoutItems);
    const store = useAstroPopCrateStore();
    const pendingCheckout = getPendingAstroPopCheckout();

    expect(
      completeVerifiedAstroPopCheckout(store, pendingCheckout!, {
        sessionId,
        verified: false,
      }),
    ).toBe(false);
    expect(window.localStorage.getItem("astropop-crate")).toEqual(JSON.stringify(checkoutItems));

    store.restoreFromStorage();
    store.addItem(ASTROPOP_FLAVORS[1].id);
    expect(
      completeVerifiedAstroPopCheckout(store, pendingCheckout!, {
        sessionId,
        verified: true,
      }),
    ).toBe(false);
    expect(store.items).toHaveLength(2);
  });
});
