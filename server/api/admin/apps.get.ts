import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {

    await requireSuperAdmin(event);

    const apps = await getCosmoportApps();

    return { apps };

})
