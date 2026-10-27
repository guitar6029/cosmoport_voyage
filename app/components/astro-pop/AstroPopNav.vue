<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ASTRO_POP_MEDIA } from "../../data/astroPopMedia";
import { useAstroPopCrateStore } from "../../stores/astroPopCrate";

const route = useRoute();
const crateStore = useAstroPopCrateStore();
const isHomepage = computed(() => route.path === "/astro-pop");
const isMenuOpen = ref(false);
const isMobileMenu = ref(true);
const menuTrigger = ref<HTMLButtonElement>();
const closeButton = ref<HTMLButtonElement>();
const drawer = ref<HTMLElement>();
let previousBodyOverflow = "";
let mobileQuery: MediaQueryList | undefined;

const isMobileNavigation = () => isMobileMenu.value;

const scrollToTop = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
};

const closeMenu = (returnFocus = true) => {
  isMenuOpen.value = false;

  if (returnFocus) {
    nextTick(() => menuTrigger.value?.focus());
  }
};

const handleCapClick = () => {
  if (isMobileNavigation()) {
    isMenuOpen.value = true;
    return;
  }

  scrollToTop();
};

const handleMobileQueryChange = (event: MediaQueryListEvent) => {
  isMobileMenu.value = event.matches;
  if (!event.matches && isMenuOpen.value) {
    closeMenu(false);
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isMenuOpen.value) {
    event.preventDefault();
    closeMenu();
    return;
  }

  if (event.key !== "Tab" || !isMenuOpen.value || !drawer.value) {
    return;
  }

  const focusableElements = Array.from(
    drawer.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);

  if (!firstElement || !lastElement) {
    return;
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

onMounted(() => {
  crateStore.restoreFromStorage();
  document.addEventListener("keydown", handleKeydown);
  mobileQuery = window.matchMedia("(max-width: 700px)");
  isMobileMenu.value = mobileQuery.matches;
  mobileQuery.addEventListener("change", handleMobileQueryChange);
});

watch(isMenuOpen, async (isOpen) => {
  if (typeof document === "undefined") {
    return;
  }

  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    await nextTick();
    closeButton.value?.focus();
  } else {
    document.body.style.overflow = previousBodyOverflow;
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
  mobileQuery?.removeEventListener("change", handleMobileQueryChange);
  document.body.style.overflow = previousBodyOverflow;
});
</script>

<template>
  <nav class="navigation" aria-label="AstroPop navigation">
    <NuxtLink
      v-if="!isHomepage && !isMobileNavigation()"
      class="navigation__cap"
      to="/astro-pop"
      aria-label="Astro Pop home"
    >
      <img :src="ASTRO_POP_MEDIA.sodaCap" alt="" aria-hidden="true" />
    </NuxtLink>
    <button
      v-else
      ref="menuTrigger"
      class="navigation__cap"
      type="button"
      :aria-expanded="isMobileNavigation() ? isMenuOpen : undefined"
      :aria-controls="isMobileNavigation() ? 'astropop-mobile-menu' : undefined"
      :aria-label="isMobileNavigation() ? 'Open navigation menu' : 'Back to top'"
      @click="handleCapClick"
    >
      <img :src="ASTRO_POP_MEDIA.sodaCap" alt="" aria-hidden="true" />
    </button>

    <div class="navigation__links" aria-label="AstroPop sections">
      <template v-if="isHomepage">
        <a href="#astropop-flavors-title">Flavors</a>
        <a href="#pack-your-pop-title">Pack Your Pop</a>
        <a href="#astropop-delivery-plans">Delivery</a>
        <a href="#astropop-delivery-testimonials">Reviews</a>
      </template>
      <NuxtLink v-else to="/astro-pop/#astropop-flavors-title">Shop Flavors</NuxtLink>
    </div>

    <NuxtLink to="/astro-pop/cart" class="navigation__cart" :aria-label="`Cart, ${crateStore.totalBottles} bottles`">
      <img :src="ASTRO_POP_MEDIA.cartCrate" alt="" aria-hidden="true" loading="lazy" />
      <span class="navigation__cart-count" aria-hidden="true">{{ crateStore.totalBottles }}</span>
    </NuxtLink>
  </nav>

  <Teleport to="body">
    <div v-if="isMenuOpen" class="navigation-drawer-wrap">
      <button class="navigation-drawer__backdrop" type="button" aria-label="Close navigation menu" @click="closeMenu()" />
      <aside id="astropop-mobile-menu" ref="drawer" class="navigation-drawer" role="dialog" aria-modal="true" aria-label="AstroPop navigation menu">
        <div class="navigation-drawer__header">
          <NuxtLink
            v-if="!isHomepage"
            class="navigation-drawer__home-link"
            to="/astro-pop"
            aria-label="Astro Pop home"
            @click="closeMenu(false)"
          >
            <img :src="ASTRO_POP_MEDIA.sodaCap" alt="" aria-hidden="true" />
          </NuxtLink>
          <img v-else :src="ASTRO_POP_MEDIA.sodaCap" alt="" aria-hidden="true" />
          <button ref="closeButton" class="navigation-drawer__close" type="button" @click="closeMenu()">
            <span aria-hidden="true">×</span><span>Close menu</span>
          </button>
        </div>
        <nav aria-label="AstroPop mobile sections">
          <template v-if="isHomepage">
            <a href="#astropop-flavors-title" @click="closeMenu(false)">Flavors</a>
            <a href="#pack-your-pop-title" @click="closeMenu(false)">Pack Your Pop</a>
            <a href="#astropop-delivery-plans" @click="closeMenu(false)">Delivery</a>
            <a href="#astropop-delivery-testimonials" @click="closeMenu(false)">Reviews</a>
            <a href="#astropop-title" @click="closeMenu(false)">Back to Top</a>
          </template>
          <NuxtLink v-else to="/astro-pop/#astropop-flavors-title" @click="closeMenu(false)">Shop Flavors</NuxtLink>
        </nav>
      </aside>
    </div>
  </Teleport>
</template>

<style scoped>
.navigation {
  display: flex;
  align-items: center;
  gap: clamp(0.65rem, 1.8vw, 1.2rem);
  width: 100%;
  min-height: 3.5rem;
  border: 2px solid var(--astropop-ink, #3a2c35);
  border-radius: 999px;
  padding: 0.35rem 0.7rem 0.35rem 0.45rem;
  background: #fff3d6;
  box-shadow: 0.18rem 0.2rem 0 var(--astropop-ink, #3a2c35);
  color: var(--astropop-ink, #3a2c35);
  font-family: var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  font-size: clamp(0.78rem, 1.4vw, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.navigation__cap {
  display: grid;
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  width: clamp(4rem, 6vw, 4.75rem);
  height: clamp(4rem, 6vw, 4.75rem);
  place-items: center;
  margin: -0.9rem 0 -0.9rem -0.75rem;
  border: 0;
  border-radius: 50%;
  padding: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.navigation__cap img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.navigation__links {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: clamp(0.75rem, 2.2vw, 2rem);
  min-width: 0;
}

.navigation a,
.navigation__cap {
  text-decoration: none;
}

.navigation a:hover,
.navigation__cap:hover,
.navigation a:focus-visible,
.navigation__cap:focus-visible {
  color: var(--astropop-red, #a83f2e);
}

.navigation a:focus-visible,
.navigation__cap:focus-visible,
.navigation-drawer a:focus-visible,
.navigation-drawer button:focus-visible {
  outline: 3px solid var(--astropop-focus-ring, #167c89);
  outline-offset: 3px;
}

.navigation__cart {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
  color: inherit;
}

.navigation__cart img {
  display: block;
  width: 2.75rem;
  height: 2.1rem;
  object-fit: contain;
}

.navigation__cart-count {
  display: inline-flex;
  min-width: 1.5rem;
  height: 1.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 0.3rem;
  background: #b64235;
  color: #fff3d6;
  font-size: 0.95rem;
}

.navigation-drawer-wrap {
  position: fixed;
  z-index: 50;
  inset: 0;
}

.navigation-drawer__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(58, 44, 53, 0.44);
  cursor: default;
}

.navigation-drawer {
  position: relative;
  width: min(20rem, calc(100% - 2.5rem));
  min-height: 100%;
  border-right: 3px solid var(--astropop-ink, #3a2c35);
  padding: 1rem;
  background:
    radial-gradient(circle at 85% 14%, rgba(255, 248, 229, 0.78), transparent 22%),
    #e8d3ad;
  box-shadow: 0.25rem 0 0 var(--astropop-ink, #3a2c35);
  animation: navigation-drawer-in 180ms ease-out;
}

.navigation-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--astropop-ink, #3a2c35);
  padding-bottom: 1rem;
}

.navigation-drawer__header img {
  width: 3.5rem;
  height: 3.5rem;
}

.navigation-drawer__home-link {
  display: inline-flex;
  border-radius: 50%;
}

.navigation-drawer__close {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 2px solid var(--astropop-ink, #3a2c35);
  border-radius: 999px;
  padding: 0.45rem 0.7rem;
  background: #fff3d6;
  color: var(--astropop-ink, #3a2c35);
  font: 700 0.8rem/1 var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.navigation-drawer__close span:first-child {
  font-size: 1.4rem;
  line-height: 0.65;
}

.navigation-drawer nav {
  display: grid;
  gap: 0.55rem;
  margin-top: 1.5rem;
}

.navigation-drawer a {
  border: 2px solid var(--astropop-ink, #3a2c35);
  border-radius: 0.8rem 0.25rem 0.8rem 0.25rem;
  padding: 0.8rem 1rem;
  background: #fff3d6;
  box-shadow: 0.14rem 0.16rem 0 var(--astropop-ink, #3a2c35);
  color: var(--astropop-ink, #3a2c35);
  font: 700 1.1rem/1 var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.navigation-drawer a:hover,
.navigation-drawer a:focus-visible,
.navigation-drawer__close:hover {
  background: #9bd4cb;
}

@keyframes navigation-drawer-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@media (max-width: 700px) {
  .navigation { min-height: 3.35rem; }
  .navigation__links { display: none; }
  .navigation__cart { margin-left: auto; }
}

@media (prefers-reduced-motion: reduce) {
  .navigation-drawer { animation: none; }
}
</style>
