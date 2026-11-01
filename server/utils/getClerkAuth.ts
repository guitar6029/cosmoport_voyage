import type { ClerkAuth } from "@clerk/nuxt/server";

type ClerkAuthEvent = {
  context: unknown;
};

/**
 * Accepts Nuxt RequestEvent and legacy H3Event without coupling callers
 * to either framework's event-context type.
 */
export function getClerkAuth(event: ClerkAuthEvent): ClerkAuth {
  const context = event.context;

  if (typeof context !== "object" || context === null || !("auth" in context)) {
    throw new Error("Clerk authentication context unavailable");
  }

  const auth = context.auth;

  if (typeof auth !== "function") {
    throw new Error("Clerk authentication context unavailable");
  }

  return (auth as () => ClerkAuth)();
}
