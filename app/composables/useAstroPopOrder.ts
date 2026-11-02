import type { AstroPopOrderDetail } from "../../server/types/astro-pop.types";

export function useAstroPopOrder(orderId: string) {
  const result = useFetch<AstroPopOrderDetail>(`/api/astro-pop/account/orders/${orderId}`, {
    key: `astro-pop-account-order-${orderId}`,
    headers: { Accept: "application/json" },
    lazy: true,
  });

  return {
    order: result.data,
    pending: result.pending,
    error: result.error,
    refresh: result.refresh,
  };
}
