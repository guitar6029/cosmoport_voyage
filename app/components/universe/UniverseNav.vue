<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

const { isLoaded, isSignedIn, signOut } = useAuth();
const { user } = useUser();
const isSigningOut = ref(false);
const signOutError = ref("");
const accountMenuOpen = ref(false);

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

function closeAccountMenu() {
  accountMenuOpen.value = false;
}

function handleAccountKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeAccountMenu();
  }
}

onBeforeUnmount(closeAccountMenu);
</script>

<template>
  <nav class="universe-nav" aria-label="CosmoPort Universe">
    <NuxtLink class="universe-nav__brand" to="/">
      <span class="universe-nav__brand-overline">CosmoPort</span>
      <span class="universe-nav__brand-name">Universe</span>
    </NuxtLink>

    <div class="universe-nav__links">
      <NuxtLink class="universe-nav__link" to="/about">About</NuxtLink>
    </div>

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
            aria-haspopup="menu"
            :aria-expanded="accountMenuOpen"
            aria-controls="universe-account-menu"
            @click="accountMenuOpen = !accountMenuOpen"
          >
            <img v-if="user?.imageUrl" class="universe-nav__avatar" :src="user.imageUrl" alt="" />
            <span v-else class="universe-nav__avatar universe-nav__avatar--fallback" aria-hidden="true">{{ fallbackInitials }}</span>
            <span>Account</span>
            <span class="universe-nav__sr-only">for {{ userName }}</span>
          </button>
          <div v-if="accountMenuOpen" id="universe-account-menu" class="universe-nav__account-menu" role="menu" aria-label="Account menu">
            <p class="universe-nav__account-name">{{ userName }}</p>
            <p class="universe-nav__account-email">{{ userEmail }}</p>
            <button class="universe-nav__menu-sign-out" type="button" role="menuitem" :disabled="isSigningOut" @click="handleSignOut">
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
  gap: 1rem;
  width: min(100% - 2rem, 72rem);
  margin: 0 auto;
  padding: 1rem 0;
  color: #183d4a;
}

.universe-nav__brand {
  display: grid;
  gap: 0.02rem;
  color: inherit;
  line-height: 1;
  text-decoration: none;
}

.universe-nav__brand-overline {
  color: #b44d32;
  font-size: 0.63rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.universe-nav__brand-name {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.universe-nav__links,
.universe-nav__account {
  display: flex;
  align-items: center;
}

.universe-nav__links {
  margin-left: auto;
}

.universe-nav__link {
  border-bottom: 2px solid transparent;
  padding: 0.45rem 0.15rem;
  color: #183d4a;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
}

.universe-nav__link:hover,
.universe-nav__link:focus-visible,
.universe-nav__link.router-link-exact-active {
  border-color: #b44d32;
  color: #b44d32;
}

.universe-nav__account {
  justify-content: flex-end;
  gap: 0.55rem;
  min-width: 10.5rem;
  min-height: 2.75rem;
}

.universe-nav__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  border: 2px solid #183d4a;
  border-radius: 999px;
  padding: 0.5rem 0.9rem;
  background: #183d4a;
  color: #fff8e8;
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
  color: #183d4a;
}

.universe-nav__button:hover {
  background: #b44d32;
  border-color: #b44d32;
}

.universe-nav__button--quiet:hover {
  background: #fff8e8;
  color: #b44d32;
}

.universe-nav__brand:focus-visible,
.universe-nav__link:focus-visible,
.universe-nav__button:focus-visible {
  outline: 3px solid #b44d32;
  outline-offset: 4px;
}

.universe-nav__loading {
  color: #49656d;
  font-size: 0.82rem;
  font-weight: 700;
}

.universe-nav__profile {
  display: flex;
  position: relative;
  align-items: center;
  gap: 0.55rem;
}

.universe-nav__controls {
  display: flex;
  gap: 0.55rem;
}

.universe-nav__account-toggle {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  border: 2px solid #183d4a;
  border-radius: 999px;
  padding: .2rem .7rem .2rem .2rem;
  background: #fff8e8;
  color: #183d4a;
  font: inherit;
  font-size: .82rem;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  cursor: pointer;
}

.universe-nav__account-toggle:hover,
.universe-nav__account-toggle[aria-expanded="true"] {
  border-color: #b44d32;
  color: #b44d32;
}

.universe-nav__account-toggle:focus-visible,
.universe-nav__menu-sign-out:focus-visible {
  outline: 3px solid #b44d32;
  outline-offset: 4px;
}

.universe-nav__account-menu {
  position: absolute;
  z-index: 2;
  right: 0;
  top: calc(100% + .5rem);
  display: grid;
  width: min(18rem, 80vw);
  gap: .35rem;
  border: 2px solid #183d4a;
  border-radius: .65rem;
  padding: .8rem;
  background: #fff8e8;
  box-shadow: .3rem .3rem 0 rgb(180 77 50 / .32);
}

.universe-nav__account-name,
.universe-nav__account-email {
  margin: 0;
  overflow-wrap: anywhere;
}

.universe-nav__account-name { font-weight: 800; }
.universe-nav__account-email { color: #49656d; font-size: .78rem; }

.universe-nav__menu-sign-out {
  margin-top: .35rem;
  border: 2px solid #183d4a;
  border-radius: .45rem;
  padding: .55rem .7rem;
  background: #183d4a;
  color: #fff8e8;
  font: inherit;
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  cursor: pointer;
}

.universe-nav__menu-sign-out:hover:not(:disabled) {
  border-color: #b44d32;
  background: #b44d32;
}

.universe-nav__sign-out-error {
  position: absolute;
  right: 0;
  top: calc(100% + 0.35rem);
  width: min(18rem, 80vw);
  margin: 0;
  border: 1px solid #b44d32;
  border-radius: 0.35rem;
  padding: 0.5rem 0.65rem;
  background: #fff8e8;
  color: #8d301e;
  font-size: 0.74rem;
  font-weight: 700;
  line-height: 1.25;
}

.universe-nav__avatar {
  display: block;
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid #183d4a;
  border-radius: 50%;
  object-fit: cover;
}

.universe-nav__avatar--fallback {
  display: grid;
  place-items: center;
  background: #b44d32;
  color: #fff8e8;
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
    width: min(100% - 1.5rem, 72rem);
    gap: 0.6rem;
  }

  .universe-nav__account {
    gap: 0.35rem;
    min-width: 0;
  }

  .universe-nav__links {
    margin-left: 0;
  }

  .universe-nav__link {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
  }

  .universe-nav__controls {
    gap: 0.35rem;
  }

  .universe-nav__button {
    padding-inline: 0.7rem;
    font-size: 0.73rem;
  }
}
</style>
