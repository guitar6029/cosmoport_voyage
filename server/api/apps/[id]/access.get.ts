import { createError, defineEventHandler, getRouterParam, setResponseHeader } from "h3";
import { getCosmoportAppEnabled } from "../../../utils/cosmoportCoreDatabase";
import { getE2eAppEnabled } from "../../../utils/e2eAppRegistry";

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const id = getRouterParam(event, "id");

  if (!id || id.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid app ID" });
  }

  try {
    const enabled = import.meta.dev && process.env.PLAYWRIGHT_TEST === "true"
      ? getE2eAppEnabled(id)
      : await getCosmoportAppEnabled(id);
    return { enabled };
  } catch {
    throw createError({ statusCode: 503, statusMessage: "Application availability unavailable" });
  }
});
