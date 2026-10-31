import { setResponseHeader, defineEventHandler } from "h3";
import { getCosmoportApps } from "../../utils/cosmoportCoreDatabase";
import { getE2eApps } from "../../utils/e2eAppRegistry";

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");
  // The existing Playwright development server does not connect to Neon.
  if (import.meta.dev && process.env.PLAYWRIGHT_TEST === "true") {
    return { apps: getE2eApps() };
  }
  return { apps: await getCosmoportApps() };
});
