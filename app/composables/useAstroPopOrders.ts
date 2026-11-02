import type { AstroPopOrderHistory } from "../../server/types/astro-pop.types";

/**
 * Shared read-only order history state.
 * Can also be consumed by the Universe account dashboard later.
 */
export function useAstroPopOrders() {
  const result = useFetch<AstroPopOrderHistory[]>("/api/astro-pop/account/orders", {
    key: "astro-pop-account-orders",
    default: () => [],
    headers: { Accept: "application/json" },
    lazy: true,
  });

  return {
    orders: result.data,
    pending: result.pending,
    error: result.error,
    refresh: result.refresh,
  };
}
