import { defineEventHandler, setResponseHeader } from "h3";
import { requireSuperAdmin } from "../../utils/requireSuperAdmin";

export default defineEventHandler(async (event) => {
  // Authorization responses must never be shared or retained by intermediaries.
  setResponseHeader(event, "Cache-Control", "no-store");
  await requireSuperAdmin(event);

  return { authorized: true };
});
