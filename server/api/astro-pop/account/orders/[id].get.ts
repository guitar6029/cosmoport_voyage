import { createError, defineEventHandler, getRouterParam, setResponseHeader } from "h3";
import { getAstroPopOrderByIdForUser } from "../../../../utils/astroPopDatabase";
import { getClerkAuth } from "../../../../utils/getClerkAuth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "private, no-store");

  const auth = getClerkAuth(event);
  if (
    auth.isAuthenticated !== true ||
    typeof auth.userId !== "string" ||
    auth.userId.trim().length === 0
  ) {
    throw createError({ status: 401, statusText: "Unauthorized" });
  }

  const orderId = getRouterParam(event, "id");
  if (typeof orderId !== "string" || !UUID_PATTERN.test(orderId)) {
    throw createError({ status: 404, statusText: "Order not found" });
  }

  const order = await getAstroPopOrderByIdForUser(orderId, auth.userId);
  if (!order) {
    // Identical response prevents disclosure of another customer's order IDs.
    throw createError({ status: 404, statusText: "Order not found" });
  }

  return order;
});
