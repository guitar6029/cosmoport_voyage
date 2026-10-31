import { getCosmoportAppEnabled } from "../../utils/cosmoportCoreDatabase";

export default defineEventHandler(async (event) => {
    const appId = getRouterParam(event, "id");

    if (!appId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing app ID",
        });
    }

    const enabled = await getCosmoportAppEnabled(appId);

    return { enabled };
});
