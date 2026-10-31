export default defineNuxtRouteMiddleware(async (to) => {

    const { isSignedIn } = useAuth();

    if (!isSignedIn.value) return;

    try {
        const response = await useRequestFetch()<{
            authorized: boolean
        }>('/api/admin/access')

        const isAdmin = response.authorized === true
        if (!isAdmin) {
            //redirect to home
            return navigateTo("/");
        }
    } catch {
        // redirect to home
        return navigateTo("/");
    }
})
