/** Validate the current session on both server and client before entering the account. */
export default defineNuxtRouteMiddleware(async () => {
  try {
    const result = await useRequestFetch()<{ authenticated: boolean }>(
      "/api/astro-pop/account/session",
    );
    if (result.authenticated === true) return;
  } catch {
    // Failed/unavailable session checks must not grant access.
  }
  return navigateTo("/");
});
