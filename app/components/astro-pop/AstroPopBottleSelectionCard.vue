<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import type { AstroPopFlavor } from "../../data/astroPopFlavors";
import type { AstroPopFlavorId } from "../../stores/astroPopCrate";

const props = defineProps<{
  flavor: AstroPopFlavor & { id: AstroPopFlavorId };
  disabled?: boolean;
  successToken?: number;
}>();

const emit = defineEmits<{
  add: [flavorId: AstroPopFlavorId];
}>();

const isShowingSuccess = ref(false);
let successTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.successToken,
  () => {
    if (successTimer) {
      clearTimeout(successTimer);
    }

    isShowingSuccess.value = true;
    successTimer = setTimeout(() => {
      isShowingSuccess.value = false;
      successTimer = undefined;
    }, 800);
  },
);

onBeforeUnmount(() => {
  if (successTimer) {
    clearTimeout(successTimer);
  }
});
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
      :class="{ 'bottle-selection-card__button--added': isShowingSuccess }"
      @click="emit('add', flavor.id )"
    >
      <span v-if="isShowingSuccess" aria-hidden="true">✓ ADDED!</span>
      <span v-else>Add Bottle</span>
    </button>
  </article>
</template>

<style scoped>
.bottle-selection-card {
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

.bottle-selection-card__button--added {
  animation: added-pop 800ms ease-out;
}

@keyframes added-pop {
  0% {
    transform: scale(1);
  }

  28% {
    transform: scale(1.06);
  }

  55% {
    transform: scale(0.98);
  }

  100% {
    transform: scale(1);
  }
}

@media (hover: hover) {
  .bottle-selection-card__button:hover:not(:disabled):not(:active) {
    box-shadow: 0.16rem 0.18rem 0 var(--card-ink);
    transform: translate(0.12rem, 0.14rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bottle-selection-card__button,
  .bottle-selection-card__button--added {
    transition: none;
    animation: none;
  }
}
</style>
