<script setup lang="ts">
import type { AstroPopFlavor } from "../../data/astroPopFlavors";
import type { AstroPopFlavorId } from "../../stores/astroPopCrate";

const props = defineProps<{
  flavor: AstroPopFlavor;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  add: [flavorId: AstroPopFlavorId];
}>();
</script>

<template>
  <article class="bottle-selection-card" :class="`bottle-selection-card--${flavor.theme}`">
    <div class="bottle-selection-card__image-wrap">
      <img
        class="bottle-selection-card__image"
        :src="flavor.bottleImage"
        :alt="`${flavor.name} AstroPop bottle`"
        loading="lazy"
      />
    </div>

    <h3 class="bottle-selection-card__title">{{ flavor.name }}</h3>

    <button
      class="bottle-selection-card__button"
      type="button"
      :disabled="props.disabled"
      @click="emit('add', flavor.id)"
    >
      Add Bottle
    </button>
  </article>
</template>

<style scoped>
.bottle-selection-card {
  --card-accent: #b43f35;
  --card-ink: #4b2830;
  --card-paper: #fff3d6;
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 22rem;
  flex-direction: column;
  align-items: center;
  border: 2px solid var(--card-ink);
  border-radius: 1rem 0.4rem 1rem 0.4rem;
  padding: 1rem;
  background: var(--card-paper);
  box-shadow: 0.35rem 0.4rem 0 var(--card-ink);
  color: var(--card-ink);
  text-align: center;
}

.bottle-selection-card--atomic-cherry {
  --card-accent: #b63a3c;
  --card-ink: #5e2730;
  --card-paper: #fff0d2;
}

.bottle-selection-card--solar-citrus {
  --card-accent: #d97b1f;
  --card-ink: #75431e;
  --card-paper: #fff1bd;
}

.bottle-selection-card--lunar-lime {
  --card-accent: #4f9470;
  --card-ink: #285748;
  --card-paper: #eaf1c9;
}

.bottle-selection-card--neptune-berry {
  --card-accent: #167c89;
  --card-ink: #174d5a;
  --card-paper: #dff1e8;
}

.bottle-selection-card__image-wrap {
  display: flex;
  width: 100%;
  height: 12rem;
  align-items: center;
  justify-content: center;
}

.bottle-selection-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.bottle-selection-card__title {
  display: flex;
  min-height: 3.2rem;
  align-items: center;
  justify-content: center;
  margin: 0.85rem 0 1rem;
  color: var(--card-ink);
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  font-weight: 900;
  line-height: 1.05;
}

.bottle-selection-card__button {
  width: 100%;
  margin-top: auto;
  border: 2px solid var(--card-accent);
  border-radius: 999px;
  padding: 0.7rem 1rem;
  background: var(--card-accent);
  color: #fff8e5;
  cursor: pointer;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
  transition: transform 150ms ease, box-shadow 150ms ease, filter 150ms ease, opacity 150ms ease;
}

.bottle-selection-card__button:focus-visible {
  outline: 3px solid var(--astropop-focus-ring, #167c89);
  outline-offset: 4px;
}

.bottle-selection-card__button:active:not(:disabled) {
  transform: translate(0.1rem, 0.12rem);
}

.bottle-selection-card__button:disabled {
  box-shadow: none;
  cursor: not-allowed;
  filter: saturate(0.55);
  opacity: 0.55;
}

@media (hover: hover) {
  .bottle-selection-card__button:hover:not(:disabled):not(:active) {
    box-shadow: 0.16rem 0.18rem 0 var(--card-ink);
    transform: translate(0.12rem, 0.14rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bottle-selection-card__button {
    transition: none;
  }
}
</style>
