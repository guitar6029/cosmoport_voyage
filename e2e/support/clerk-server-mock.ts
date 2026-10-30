// Standard Playwright guest-flow tests disable @clerk/nuxt and do not supply
// Clerk credentials. Alias the server entry point too, so Nitro never loads
// Clerk's Nuxt runtime (which depends on Nuxt's #imports virtual module).
export function clerkClient(): never {
  throw new Error("Clerk server client is unavailable in Playwright guest-flow test mode");
}
