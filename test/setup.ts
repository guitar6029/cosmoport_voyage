import { ref } from "vue";
import { vi } from "vitest";

// Standalone Vue tests do not run Nuxt's Clerk auto-import registration.
// Individual tests can override this default with vi.stubGlobal as needed.
vi.stubGlobal("useAuth", () => ({
  isLoaded: ref(true),
  isSignedIn: ref(false),
  signOut: vi.fn(),
}));
