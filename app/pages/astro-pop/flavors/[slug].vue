<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ASTROPOP_FLAVORS } from "../../../data/astroPopFlavors";
import { useAstroPopCrateStore } from "../../../stores/astroPopCrate";

const route = useRoute();
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;
const flavor = ASTROPOP_FLAVORS.find((candidate) => candidate.id === slug);

if (!flavor) {
  throw createError({
    statusCode: 404,
    statusMessage: "AstroPop flavor not found",
  });
}

useHead({
  title: `${flavor.name} | AstroPop Soda Co.`,
});

const crateStore = useAstroPopCrateStore();
const announcement = ref("");
const hasAddedBottle = ref(false);

onMounted(() => {
  crateStore.restoreFromStorage();
});

const addBottle = () => {
  if (crateStore.addItem(flavor.id)) {
    hasAddedBottle.value = true;
    announcement.value = `${flavor.name} added to your order manifest. ${crateStore.totalBottles} of 6 bottles selected.`;
  }
};
</script>

<template>
  <main
    class="astropop-flavor-detail-page"
    :class="`astropop-flavor-detail-page--${flavor.theme}`"
  >
    <section class="astropop-flavor-hero" :aria-labelledby="`${flavor.id}-title`">
      <NuxtLink class="astropop-flavor-hero__back-link" to="/astro-pop">
        <span aria-hidden="true">←</span> Back to AstroPop
      </NuxtLink>

      <div class="astropop-flavor-hero__panel">
        <div class="astropop-flavor-hero__orbit astropop-flavor-hero__orbit--one" aria-hidden="true" />
        <div class="astropop-flavor-hero__orbit astropop-flavor-hero__orbit--two" aria-hidden="true" />

        <div class="astropop-flavor-hero__bottle-stage">
          <span class="astropop-flavor-hero__burst" aria-hidden="true">✦</span>
          <img
            class="astropop-flavor-hero__bottle"
            :src="flavor.bottleImage"
            :alt="`${flavor.name} AstroPop bottle`"
          />
        </div>

        <div class="astropop-flavor-hero__content">
          <p class="astropop-flavor-hero__eyebrow">AstroPop Soda Co. presents</p>
          <h1 :id="`${flavor.id}-title`" class="astropop-flavor-hero__title">
            <span v-for="word in flavor.name.split(' ')" :key="word">{{ word }}</span>
          </h1>
          <p class="astropop-flavor-hero__slogan">{{ flavor.slogan }}</p>
          <p class="astropop-flavor-hero__description">{{ flavor.description }}</p>

          <div class="astropop-flavor-hero__actions">
            <button
              class="astropop-flavor-hero__add-button"
              type="button"
              :disabled="crateStore.isFull || crateStore.isCheckoutLocked"
              @click="addBottle"
            >
              Add Bottle <span aria-hidden="true">✦</span>
            </button>
            <p v-if="hasAddedBottle" class="astropop-flavor-hero__confirmation" aria-hidden="true">
              Added to your manifest · {{ crateStore.totalBottles }} of 6
            </p>
          </div>
        </div>
      </div>
      <p class="sr-only" aria-live="polite">{{ announcement }}</p>
    </section>
  </main>
</template>

<style scoped>
.astropop-flavor-detail-page {
  --hero-ink: #5e2730;
  --hero-accent: #b63a3c;
  --hero-paper: #fff0d2;
  --hero-panel: #e9a99c;
  min-height: 100vh;
  min-height: 100svh;
  overflow-x: clip;
  padding: clamp(1rem, 3vw, 2rem);
  background:
    radial-gradient(circle at 85% 8%, rgba(255, 248, 229, 0.72), transparent 22rem),
    var(--hero-paper);
  color: var(--hero-ink);
}

.astropop-flavor-detail-page--solar-citrus {
  --hero-ink: #75431e;
  --hero-accent: #d97b1f;
  --hero-paper: #fff1bd;
  --hero-panel: #f3c65e;
}

.astropop-flavor-detail-page--lunar-lime {
  --hero-ink: #285748;
  --hero-accent: #4f9470;
  --hero-paper: #eaf1c9;
  --hero-panel: #aad59a;
}

.astropop-flavor-detail-page--neptune-berry {
  --hero-ink: #174d5a;
  --hero-accent: #167c89;
  --hero-paper: #dff1e8;
  --hero-panel: #8bcac4;
}

.astropop-flavor-hero {
  width: min(100%, 84rem);
  margin: 0 auto;
}

.astropop-flavor-hero__back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 1rem;
  color: var(--hero-ink);
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.astropop-flavor-hero__back-link:hover,
.astropop-flavor-hero__back-link:focus-visible {
  color: var(--hero-accent);
  text-decoration: underline;
}

.astropop-flavor-hero__back-link:focus-visible,
.astropop-flavor-hero__add-button:focus-visible {
  outline: 3px solid var(--hero-ink);
  outline-offset: 4px;
}

.astropop-flavor-hero__panel {
  position: relative;
  display: grid;
  min-height: min(44rem, calc(100svh - 5rem));
  overflow: hidden;
  isolation: isolate;
  border: 3px solid var(--hero-ink);
  border-radius: 3.5rem 1rem 7rem 1.5rem / 8rem 1rem 5rem 1.5rem;
  background:
    radial-gradient(ellipse at 88% 18%, rgba(255, 248, 229, 0.72), transparent 26%),
    var(--hero-panel);
  box-shadow: 0.65rem 0.75rem 0 var(--hero-ink);
}

.astropop-flavor-hero__panel::before {
  position: absolute;
  z-index: -1;
  top: 10%;
  right: -10%;
  width: 44%;
  aspect-ratio: 1;
  border: 2px solid color-mix(in srgb, var(--hero-ink) 55%, transparent);
  border-radius: 50%;
  content: "";
}

.astropop-flavor-hero__bottle-stage {
  position: relative;
  display: flex;
  min-height: 21rem;
  align-items: flex-end;
  justify-content: center;
  padding: 2.75rem 1rem 0;
}

.astropop-flavor-hero__bottle-stage::after {
  position: absolute;
  z-index: -1;
  bottom: 8%;
  width: min(80%, 20rem);
  height: 2rem;
  border-radius: 50%;
  background: rgba(58, 44, 53, 0.25);
  content: "";
  filter: blur(0.3rem);
}

.astropop-flavor-hero__bottle {
  display: block;
  width: min(100%, 24rem);
  max-height: 34rem;
  object-fit: contain;
  transform: rotate(-10deg) translate(-0.5rem, 1.8rem);
  transform-origin: bottom center;
}

.astropop-flavor-hero__burst {
  position: absolute;
  top: 2rem;
  right: 15%;
  color: var(--hero-ink);
  font-size: 2.3rem;
  transform: rotate(15deg);
}

.astropop-flavor-hero__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(2rem, 6vw, 5rem) clamp(1.5rem, 6vw, 5.5rem) clamp(3rem, 7vw, 6rem);
}

.astropop-flavor-hero__eyebrow {
  margin: 0 0 0.8rem;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.astropop-flavor-hero__title {
  display: flex;
  flex-direction: column;
  margin: 0;
  color: var(--hero-ink);
  font-family: "Fraunces", Georgia, serif;
  font-size: clamp(3.4rem, 8vw, 7.5rem);
  font-weight: 900;
  letter-spacing: -0.08em;
  line-height: 0.8;
  text-transform: uppercase;
}

.astropop-flavor-hero__title span:nth-child(2) {
  padding-left: 0.23em;
}

.astropop-flavor-hero__title span:nth-child(3) {
  padding-left: 0.08em;
}

.astropop-flavor-hero__slogan {
  max-width: 25rem;
  margin: 1.75rem 0 0;
  color: var(--hero-ink);
  font-family: "Fraunces", Georgia, serif;
  font-size: clamp(1.15rem, 2vw, 1.55rem);
  font-style: italic;
  font-weight: 700;
  line-height: 1.15;
}

.astropop-flavor-hero__description {
  max-width: 34rem;
  margin: 1rem 0 0;
  font-family: "Barlow", Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.55;
}

.astropop-flavor-hero__actions {
  margin-top: 1.75rem;
}

.astropop-flavor-hero__add-button {
  border: 2px solid var(--hero-ink);
  border-radius: 999px;
  padding: 0.82rem 1.3rem;
  background: var(--hero-ink);
  color: #fff8e5;
  cursor: pointer;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
}

.astropop-flavor-hero__add-button:hover:not(:disabled) {
  box-shadow: 0.18rem 0.2rem 0 var(--hero-accent);
  transform: translate(0.12rem, 0.14rem);
}

.astropop-flavor-hero__add-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.astropop-flavor-hero__confirmation {
  margin: 0.8rem 0 0;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-weight: 700;
}

.astropop-flavor-hero__orbit {
  position: absolute;
  z-index: -1;
  border: 2px solid color-mix(in srgb, var(--hero-ink) 45%, transparent);
  border-radius: 50%;
}

.astropop-flavor-hero__orbit--one {
  bottom: -11rem;
  left: -6rem;
  width: 22rem;
  height: 22rem;
}

.astropop-flavor-hero__orbit--two {
  top: -7rem;
  right: 20%;
  width: 13rem;
  height: 13rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (min-width: 760px) {
  .astropop-flavor-hero__panel {
    grid-template-columns: minmax(20rem, 0.9fr) minmax(28rem, 1.1fr);
    overflow: visible;
  }

  .astropop-flavor-hero__content {
    position: relative;
    z-index: 1;
  }

  .astropop-flavor-hero__bottle-stage {
    min-height: 100%;
    overflow: visible;
  }

  .astropop-flavor-hero__bottle {
    width: min(130%, 32rem);
    max-height: none;
    transform: rotate(-11deg) translate(-1.5rem, 3rem);
  }
}

@media (max-width: 759px) {
  .astropop-flavor-hero__panel {
    border-radius: 2.75rem 0.75rem 5rem 1rem / 4rem 0.75rem 3.5rem 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .astropop-flavor-hero__add-button {
    transition: none;
  }
}
</style>
