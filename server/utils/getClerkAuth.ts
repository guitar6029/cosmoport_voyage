import type { ClerkAuth } from "@clerk/nuxt/server";

type ClerkAuthEvent = {
  context: {
    auth?: unknown;
  };
};

/** Works with both Nuxt RequestEvent and legacy H3Event contexts. */
export function getClerkAuth(event: ClerkAuthEvent): ClerkAuth {
  const auth = event.context.auth;

  if (typeof auth !== "function") {
    throw new Error("Clerk authentication context unavailable");
  }

  return (auth as () => ClerkAuth)();
}
