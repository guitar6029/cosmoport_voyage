export default defineNuxtRouteMiddleware(async (to) => {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded.value) {
        return;
    }

    if (!isSignedIn.value) {
        return navigateTo("/")
    }
})
