type ClerkSessionAuth = {
  isAuthenticated?: boolean;
  userId?: string | null;
};

type AuthEvent = {
  context: unknown;
};

export function getClerkAuth(event: AuthEvent): ClerkSessionAuth {
  const context = event.context;

  if (
    typeof context !== "object" ||
    context === null ||
    !("auth" in context) ||
    typeof context.auth !== "function"
  ) {
    throw new Error("Clerk authentication context unavailable");
  }

  return (context.auth as () => ClerkSessionAuth)();
}
