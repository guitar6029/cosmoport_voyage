export default defineNuxtRouteMiddleware(async () => {
  try {
    // The server endpoint checks the current Clerk session and private role.
    // useRequestFetch forwards the incoming cookies during SSR.
    const { authorized } = await useRequestFetch()<{
      authorized: boolean;
    }>("/api/admin/access");

    if (authorized === true) return;
  } catch {
    // A failed access check must not allow navigation.
  }

  return navigateTo("/");
});
