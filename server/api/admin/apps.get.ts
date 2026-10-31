import { defineEventHandler, setResponseHeader } from "h3";
import { requireSuperAdmin } from "../../utils/requireSuperAdmin";
import { getCosmoportApps } from "../../utils/cosmoportCoreDatabase";

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");
  await requireSuperAdmin(event);

  const apps = await getCosmoportApps();
  return { apps };
});
