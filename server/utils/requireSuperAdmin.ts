import { clerkClient } from "@clerk/nuxt/server";
import { createError, setResponseHeader, type H3Event } from "h3";

type ClerkAuth = {
  userId?: string | null;
};

function deny(event: H3Event, statusCode: 401 | 403 | 503, statusMessage: string): never {
  setResponseHeader(event, "Cache-Control", "no-store");
  throw createError({ statusCode, statusMessage });
}

function hasSuperAdminRole(privateMetadata: unknown): boolean {
  return (
    typeof privateMetadata === "object" &&
    privateMetadata !== null &&
    !Array.isArray(privateMetadata) &&
    (privateMetadata as Record<string, unknown>).role === "super_admin"
  );
}

/**
 * Requires a current Clerk session whose user has the super_admin private role.
 * The Backend API lookup is deliberately performed for every request so role
 * revocations apply immediately and client-controlled data is never trusted.
 */
export async function requireSuperAdmin(event: H3Event): Promise<void> {
  const auth = (event.context as { auth?: () => ClerkAuth }).auth?.();
  const userId = auth?.userId;

  if (!userId) {
    deny(event, 401, "Unauthorized");
  }

  let user: { privateMetadata: unknown };

  try {
    user = await clerkClient(event as Parameters<typeof clerkClient>[0]).users.getUser(userId);
  } catch {
    // Fail closed: authorization cannot be established while Clerk is unavailable.
    deny(event, 503, "Authorization service unavailable");
  }

  if (!hasSuperAdminRole(user.privateMetadata)) {
    deny(event, 403, "Forbidden");
  }
}
