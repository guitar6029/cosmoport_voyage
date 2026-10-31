import { z } from "zod";
import { updateCosmoportAppStatus } from "../../../utils/cosmoportCoreDatabase";

const appIdSchema = z.string().min(1).max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const updateAppSchema = z.strictObject({
    enabled: z.boolean(),
});

export default defineEventHandler(async (event) => {

    await requireSuperAdmin(event);

    const result = appIdSchema.safeParse(
        getRouterParam(event, "id"),

    );

    if (!result.success) {
        throw createError({
            status: 400,
            statusText: "Invalid app ID",
        });
    }

    const body = await readBody(event);

    const bodyResult = updateAppSchema.safeParse(body);

    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid request body",
        });
    }

    const appId = result.data;
    const enabledStatus = bodyResult.data.enabled;
    const updatedApp = await updateCosmoportAppStatus(appId, enabledStatus);

    if (!updatedApp) {
        throw createError({
            statusCode: 404,
            statusMessage: "App not found",
        });
    }

    return { app: updatedApp };

});
