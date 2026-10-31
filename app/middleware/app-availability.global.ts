export default defineNuxtRouteMiddleware(async (to) => {
    const appId = to.path.split("/")[1];

    if (!appId) {
        return;
    }

    console.log("App Availability", appId);

    const { enabled } = await useRequestFetch()<{
        enabled: boolean | null;
    }>(`/api/apps/${encodeURIComponent(appId)}`);

    console.log("Application:", appId);
    console.log("Enabled:", enabled);

})
