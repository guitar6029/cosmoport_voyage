<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";

const { isLoaded, isSignedIn, signOut } = useAuth();
const { user } = useUser();
const isSigningOut = ref(false);
const signOutError = ref("");
const accountMenuOpen = ref(false);
const accountToggle = ref<HTMLButtonElement>();
const signOutButton = ref<HTMLButtonElement>();

withDefaults(defineProps<{
  presentation?: "overlay" | "surface";
}>(), {
  presentation: "overlay",
});

const userName = computed(() => (
  user.value?.fullName
  || user.value?.username
  || user.value?.primaryEmailAddress?.emailAddress
  || "CosmoPort traveler"
));

const fallbackInitials = computed(() => userName.value
  .split(/[\s@._-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join("") || "CP");

const userEmail = computed(() => user.value?.primaryEmailAddress?.emailAddress || "No email address on file");

const handleSignOut = async () => {
  if (isSigningOut.value) {
    return;
  }

  signOutError.value = "";
  accountMenuOpen.value = true;
  isSigningOut.value = true;

  try {
    await signOut.value({ redirectUrl: "/" });
  } catch {
    signOutError.value = "We couldn't sign you out. Please try again.";
  } finally {
    isSigningOut.value = false;
  }
};

function closeAccountMenu(restoreFocus = false) {
  accountMenuOpen.value = false;

  if (restoreFocus) {
    void nextTick(() => accountToggle.value?.focus());
  }
}

function openAccountMenu() {
  accountMenuOpen.value = true;
  void nextTick(() => signOutButton.value?.focus());
}

function toggleAccountMenu() {
  if (accountMenuOpen.value) {
    closeAccountMenu(true);
    return;
  }

  openAccountMenu();
}

function handleAccountKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && accountMenuOpen.value) {
    event.preventDefault();
    closeAccountMenu(true);
  }
}

onBeforeUnmount(closeAccountMenu);
</script>

<template>
  <nav class="universe-nav" :class="`universe-nav--${presentation}`" aria-label="CosmoPort Universe">
    <NuxtLink class="universe-nav__link" to="/">Home</NuxtLink>

    <div class="universe-nav__account" aria-live="polite">
      <template v-if="!isLoaded">
        <span class="universe-nav__loading" role="status">Loading account controls</span>
      </template>

      <template v-else-if="!isSignedIn">
        <div class="universe-nav__controls">
          <NuxtLink class="universe-nav__button universe-nav__button--quiet" to="/passport-office?intent=sign-in">Sign In</NuxtLink>
          <NuxtLink class="universe-nav__button" to="/passport-office?intent=register">Register</NuxtLink>
        </div>
      </template>

      <template v-else>
        <div class="universe-nav__profile" @keydown="handleAccountKeydown">
          <button
            class="universe-nav__account-toggle"
            type="button"
            :aria-expanded="accountMenuOpen"
            aria-controls="universe-account-menu"
            ref="accountToggle"
            @click="toggleAccountMenu"
          >
            <img v-if="user?.imageUrl" class="universe-nav__avatar" :src="user.imageUrl" alt="" />
            <span v-else class="universe-nav__avatar universe-nav__avatar--fallback" aria-hidden="true">{{ fallbackInitials }}</span>
            <span>Account</span>
            <span class="universe-nav__sr-only">for {{ userName }}</span>
          </button>
          <div v-if="accountMenuOpen" id="universe-account-menu" class="universe-nav__account-menu" role="group" aria-label="Account details">
            <p class="universe-nav__account-name">{{ userName }}</p>
            <p class="universe-nav__account-email">{{ userEmail }}</p>
            <button ref="signOutButton" class="universe-nav__menu-sign-out" type="button" :disabled="isSigningOut" @click="handleSignOut">
              {{ isSigningOut ? "Signing Out" : "Sign Out" }}
            </button>
          </div>
          <p v-if="signOutError" class="universe-nav__sign-out-error" role="alert">{{ signOutError }}</p>
        </div>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.universe-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: min(100% - 1.5rem, var(--cp-universe-plaque-width));
  min-height: 3.75rem;
  margin: 0 auto;
  border: 1px solid var(--cp-universe-gold);
  border-radius: var(--cp-universe-plaque-radius);
  padding: 0.4rem 0.5rem 0.4rem 0.85rem;
  background: var(--cp-universe-space-teal);
  box-shadow: var(--cp-universe-plaque-shadow);
  color: var(--cp-universe-cream);
}

.universe-nav__account {
  display: flex;
  align-items: center;
}

.universe-nav__link {
  border-bottom: 2px solid transparent;
  padding: 0.45rem 0.15rem;
  color: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
}

.universe-nav__link:hover,
.universe-nav__link:focus-visible,
.universe-nav__link.router-link-exact-active {
  border-color: var(--cp-universe-gold);
  color: var(--cp-universe-gold);
}

.universe-nav__account {
  justify-content: flex-end;
  gap: 0.45rem;
  min-width: 0;
  min-height: 2.75rem;
}

.universe-nav__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  border: 1px solid var(--cp-universe-gold);
  border-radius: 0.4rem;
  padding: 0.5rem 0.9rem;
  background: var(--cp-universe-gold);
  color: var(--cp-universe-space-teal-deep);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
}

.universe-nav__button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.universe-nav__button--quiet {
  background: transparent;
  color: var(--cp-universe-cream);
}

.universe-nav__button:hover {
  border-color: var(--cp-universe-cream);
  background: var(--cp-universe-cream);
}

.universe-nav__button--quiet:hover {
  background: var(--cp-universe-gold);
  color: var(--cp-universe-space-teal-deep);
}

.universe-nav__link:focus-visible,
.universe-nav__button:focus-visible {
  outline: 3px solid var(--cp-universe-cream);
  outline-offset: 3px;
}

.universe-nav__loading {
  color: var(--cp-universe-muted-teal);
  font-size: 0.82rem;
  font-weight: 700;
}

.universe-nav__profile {
  display: flex;
  position: relative;
  align-items: center;
  gap: 0.45rem;
}

.universe-nav__controls {
  display: flex;
  gap: 0.4rem;
}

.universe-nav__account-toggle {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  border: 1px solid var(--cp-universe-gold);
  border-radius: 0.4rem;
  padding: .2rem .7rem .2rem .2rem;
  background: var(--cp-universe-cream);
  color: var(--cp-universe-space-teal-deep);
  font: inherit;
  font-size: .82rem;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  cursor: pointer;
}

.universe-nav__account-toggle:hover,
.universe-nav__account-toggle[aria-expanded="true"] {
  border-color: var(--cp-universe-cream);
  background: var(--cp-universe-gold);
}

.universe-nav__account-toggle:focus-visible,
.universe-nav__menu-sign-out:focus-visible {
  outline: 3px solid var(--cp-universe-cream);
  outline-offset: 3px;
}

.universe-nav__account-menu {
  position: absolute;
  z-index: 2;
  right: 0;
  top: calc(100% + .5rem);
  display: grid;
  width: min(18rem, 80vw);
  gap: .35rem;
  border: 1px solid var(--cp-universe-gold);
  border-radius: var(--cp-universe-plaque-radius);
  padding: .8rem;
  background: var(--cp-universe-space-teal);
  box-shadow: var(--cp-universe-plaque-shadow);
  color: var(--cp-universe-cream);
}

.universe-nav__account-name,
.universe-nav__account-email {
  margin: 0;
  overflow-wrap: anywhere;
}

.universe-nav__account-name { font-weight: 800; }
.universe-nav__account-email { color: var(--cp-universe-muted-teal); font-size: .78rem; }

.universe-nav__menu-sign-out {
  margin-top: .35rem;
  border: 1px solid var(--cp-universe-gold);
  border-radius: .45rem;
  padding: .55rem .7rem;
  background: var(--cp-universe-gold);
  color: var(--cp-universe-space-teal-deep);
  font: inherit;
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  cursor: pointer;
}

.universe-nav__menu-sign-out:hover:not(:disabled) {
  border-color: var(--cp-universe-cream);
  background: var(--cp-universe-cream);
}

.universe-nav__sign-out-error {
  position: absolute;
  right: 0;
  top: calc(100% + 0.35rem);
  width: min(18rem, 80vw);
  margin: 0;
  border: 1px solid var(--cp-universe-rust);
  border-radius: 0.35rem;
  padding: 0.5rem 0.65rem;
  background: var(--cp-universe-cream);
  color: #8d301e;
  font-size: 0.74rem;
  font-weight: 700;
  line-height: 1.25;
}

.universe-nav__avatar {
  display: block;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--cp-universe-space-teal-deep);
  border-radius: 50%;
  object-fit: cover;
}

.universe-nav__avatar--fallback {
  display: grid;
  place-items: center;
  background: var(--cp-universe-rust);
  color: var(--cp-universe-cream);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.78rem;
  font-weight: 700;
}

.universe-nav__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 28rem) {
  .universe-nav {
    width: min(100% - 1rem, var(--cp-universe-plaque-width));
    gap: 0.45rem;
    padding-inline: 0.55rem;
  }

  .universe-nav__account {
    gap: 0.35rem;
    min-width: 0;
  }

  .universe-nav__link {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
  }

  .universe-nav__controls {
    gap: 0.35rem;
  }

  .universe-nav__button {
    padding-inline: 0.6rem;
    font-size: 0.73rem;
  }
}
</style>
