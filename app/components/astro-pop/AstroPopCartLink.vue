<script setup lang="ts">
import { onMounted } from "vue";
import { useAstroPopCrateStore } from "../../stores/astroPopCrate";

const crateStore = useAstroPopCrateStore();

onMounted(() => {
  crateStore.restoreFromStorage();
});
</script>

<template>
  <NuxtLink class="astropop-cart-link" to="/astro-pop/cart">
    <span>Order manifest</span>
    <span class="astropop-cart-link__count" :aria-label="`${crateStore.totalBottles} bottles in cart`">
      {{ crateStore.totalBottles }} / 6
    </span>
  </NuxtLink>
</template>

<style scoped>
.astropop-cart-link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.55rem;
  border: 2px solid #3a2c35;
  border-radius: 999px;
  padding: 0.45rem 0.7rem 0.45rem 1rem;
  background: #fff3d6;
  box-shadow: 0.18rem 0.2rem 0 #3a2c35;
  color: #3a2c35;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.astropop-cart-link:hover,
.astropop-cart-link:focus-visible {
  background: #9bd4cb;
}

.astropop-cart-link:focus-visible {
  outline: 3px solid var(--astropop-focus-ring, #167c89);
  outline-offset: 3px;
}

.astropop-cart-link__count {
  display: grid;
  min-width: 2.4rem;
  min-height: 1.8rem;
  place-items: center;
  border-radius: 999px;
  background: #a83f2e;
  color: #fff8e5;
}
</style>
