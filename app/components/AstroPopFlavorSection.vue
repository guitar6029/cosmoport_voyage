<script setup lang="ts">
import { ASTROPOP_FLAVORS } from "../data/astroPopFlavors";
import AstroPopFlavorCard from "./AstroPopFlavorCard.vue";
</script>

<template>
  <section class="astropop-flavor-section" aria-labelledby="astropop-flavors-title">
    <header class="astropop-flavor-section__header">
      <p class="astropop-flavor-section__eyebrow">AstroPop Soda Co. · The flavor department</p>
      <h2 id="astropop-flavors-title">Pick Your Pop!</h2>
      <p class="astropop-flavor-section__subtitle">Four Marvelous Flavors from the Future!</p>
    </header>

    <div class="astropop-flavor-grid">
      <AstroPopFlavorCard
        v-for="flavor in ASTROPOP_FLAVORS"
        :key="flavor.id"
        :flavor="flavor"
      />
    </div>
  </section>
</template>

<style scoped>
.astropop-flavor-section {
  width: min(100%, 80rem);
  margin: 0 auto;
  overflow: hidden;
  padding: clamp(4rem, 8vw, 8rem) clamp(1rem, 4vw, 3rem) clamp(5rem, 9vw, 9rem);
  color: #3a2c35;
}

.astropop-flavor-section__header {
  max-width: 48rem;
  margin: 0 auto clamp(2.5rem, 5vw, 4.5rem);
  text-align: center;
}

.astropop-flavor-section__eyebrow {
  margin: 0 0 1rem;
  color: #a83f2e;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  line-height: 1.3;
  text-transform: uppercase;
}

.astropop-flavor-section h2 {
  margin: 0;
  color: #3a2c35;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3rem, 8vw, 6.5rem);
  line-height: 0.9;
  text-wrap: balance;
}

.astropop-flavor-section__subtitle {
  margin: 1rem 0 0;
  color: #167c89;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.25rem, 2.5vw, 1.8rem);
  font-style: italic;
  font-weight: 700;
  line-height: 1.2;
}

.astropop-flavor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 33rem));
  justify-content: center;
  gap: clamp(2rem, 4vw, 4rem);
}

@media (max-width: 680px) {
  .astropop-flavor-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
