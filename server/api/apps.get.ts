import { getCosmoportApps } from "../utils/cosmoportCoreDatabase"

export default defineEventHandler(async (event) => {
    setResponseHeader(event, "Cache-Control", "no-store");

    const apps = await getCosmoportApps();

    return { apps }
})
