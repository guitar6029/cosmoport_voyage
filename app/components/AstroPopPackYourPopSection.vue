<script setup lang="ts">
import { ASTROPOP_FLAVORS } from "../data/astroPopFlavors";
import type { AstroPopFlavorId } from "../stores/astroPopCrate";
import { useAstroPopCrateStore } from "../stores/astroPopCrate";
import AstroPopBottleSelectionCard from "./AstroPopBottleSelectionCard.vue";

const crateStore = useAstroPopCrateStore();

const addBottle = (flavorId: AstroPopFlavorId) => {
  crateStore.addItem(flavorId);
};
</script>

<template>
  <section
    class="astropop-pack-your-pop-section"
    aria-labelledby="pack-your-pop-title"
  >
    <h2 id="pack-your-pop-title" class="sr-only">Pack Your Pop!</h2>

    <div class="astropop-pack-your-pop-section__layout">
      <div class="astropop-pack-your-pop-section__artwork">
        <img
          class="astropop-pack-your-pop-section__logo"
          src="/images/astro-pop/logos/AstroPop Pack Your Pop Logo.png"
          alt="AstroPop Pack Your Pop!"
          loading="lazy"
        />
      </div>

      <div class="astropop-pack-your-pop-section__selection-grid">
        <AstroPopBottleSelectionCard
          v-for="flavor in ASTROPOP_FLAVORS"
          :key="flavor.id"
          :flavor="flavor"
          :disabled="crateStore.isFull"
          @add="addBottle"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.astropop-pack-your-pop-section {
  width: min(100%, 80rem);
  margin: 0 auto;
  overflow: hidden;
  padding: 0 clamp(1rem, 4vw, 3rem) clamp(5rem, 9vw, 9rem);
  color: #3a2c35;
}

.astropop-pack-your-pop-section__layout {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: clamp(2rem, 6vw, 5rem);
}

.astropop-pack-your-pop-section__artwork,
.astropop-pack-your-pop-section__selection-grid {
  min-width: 0;
  flex: 1 1 0%;
}

.astropop-pack-your-pop-section__artwork {
  display: flex;
  align-items: center;
  justify-content: center;
}

.astropop-pack-your-pop-section__logo {
  display: block;
  width: min(100%, 34rem);
  height: auto;
  object-fit: contain;
}

.astropop-pack-your-pop-section__selection-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: start;
  gap: clamp(1rem, 2vw, 1.5rem);
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
  .astropop-pack-your-pop-section__layout {
    flex-direction: row;
    align-items: stretch;
  }

  .astropop-pack-your-pop-section__artwork,
  .astropop-pack-your-pop-section__selection-grid {
    flex-basis: 50%;
  }
}

@media (max-width: 420px) {
  .astropop-pack-your-pop-section__selection-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
