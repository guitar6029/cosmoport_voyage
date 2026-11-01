import { createError, defineEventHandler } from "nuxt/server";
import { getClerkAuth } from "../../../utils/getClerkAuth";

/** Auth-only probe for route middleware; never returns customer information. */
export default defineEventHandler((event) => {
  event.res.headers.set("Cache-Control", "private, no-store");
  const auth = getClerkAuth(event);
  if (
    auth.isAuthenticated !== true ||
    typeof auth.userId !== "string" ||
    auth.userId.trim().length === 0
  ) {
    throw createError({ status: 401, statusText: "Unauthorized" });
  }
  return { authenticated: true };
});
