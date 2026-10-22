<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ASTROPOP_FLAVORS } from "../../data/astroPopFlavors";
import type { AstroPopFlavorId } from "../../stores/astroPopCrate";
import { useAstroPopCrateStore } from "../../stores/astroPopCrate";

const crateStore = useAstroPopCrateStore();
const announcement = ref("");

const cartItems = computed(() =>
  crateStore.items.flatMap((item) => {
    const flavor = ASTROPOP_FLAVORS.find((candidate) => candidate.id === item.flavorId);
    return flavor ? [{ ...item, flavor }] : [];
  }),
);

onMounted(() => {
  crateStore.restoreFromStorage();
});

const increaseQuantity = (flavorId: AstroPopFlavorId, name: string) => {
  if (crateStore.addItem(flavorId)) {
    announcement.value = `${name} quantity increased. ${crateStore.totalBottles} of 6 bottles selected.`;
  }
};

const decreaseQuantity = (flavorId: AstroPopFlavorId, name: string) => {
  if (crateStore.decrementItem(flavorId)) {
    announcement.value = `${name} quantity decreased. ${crateStore.totalBottles} of 6 bottles selected.`;
  }
};

const updateQuantity = (event: Event, flavorId: AstroPopFlavorId, currentQuantity: number, name: string) => {
  const input = event.target as HTMLInputElement;
  const inputValue = input.value.trim();

  if (inputValue === "") {
    input.value = String(currentQuantity);
    announcement.value = `Enter a whole-number quantity for ${name}.`;
    return;
  }

  const quantity = Number(input.value);

  if (crateStore.setItemQuantity(flavorId, quantity)) {
    announcement.value = quantity === 0
      ? `${name} removed from your order manifest.`
      : `${name} quantity set to ${quantity}. ${crateStore.totalBottles} of 6 bottles selected.`;
    return;
  }

  input.value = String(currentQuantity);
  announcement.value = `Please select a whole number between 0 and ${currentQuantity + crateStore.remainingCapacity} bottles of ${name}.`;
};

const removeItem = (flavorId: AstroPopFlavorId, name: string) => {
  if (crateStore.removeItem(flavorId)) {
    announcement.value = `${name} removed from your order manifest.`;
  }
};
</script>

<template>
  <main class="astropop-cart-page">
    <header class="astropop-cart-page__header">
      <NuxtLink class="astropop-cart-page__back" to="/astro-pop">← Back to AstroPop</NuxtLink>
      <p class="astropop-cart-page__eyebrow">Cosmoport Soda Service</p>
      <h1>Order Manifest</h1>
      <p>Reserve a seat in the six-bottle rocket crate.</p>
    </header>

    <p class="sr-only" aria-live="polite">{{ announcement }}</p>

    <section v-if="crateStore.isEmpty" class="astropop-cart-empty" aria-labelledby="empty-cart-title">
      <p class="astropop-cart-empty__stamp">Manifest clear</p>
      <h2 id="empty-cart-title">Your rocket crate is ready for liftoff.</h2>
      <p>Choose a few fizzy passengers and we’ll keep the bottle caps polished.</p>
      <NuxtLink class="astropop-cart-page__button" to="/astro-pop#pack-your-pop-title">Choose your flavors</NuxtLink>
    </section>

    <div v-else class="astropop-cart-page__layout">
      <section class="astropop-cart-items" aria-labelledby="cart-items-title">
        <h2 id="cart-items-title">Bottle roster</h2>
        <article v-for="item in cartItems" :key="item.flavorId" class="astropop-cart-item">
          <img :src="item.flavor.bottleImage" :alt="`${item.flavor.name} AstroPop bottle`" />
          <div class="astropop-cart-item__details">
            <h3>{{ item.flavor.name }}</h3>
            <p>{{ item.flavor.slogan }}</p>
            <button type="button" class="astropop-cart-item__remove" @click="removeItem(item.flavorId, item.flavor.name)">
              Remove bottle
            </button>
          </div>
          <div class="astropop-cart-item__quantity">
            <label :for="`quantity-${item.flavorId}`">Quantity</label>
            <div class="astropop-cart-item__quantity-controls">
              <button type="button" :aria-label="`Decrease ${item.flavor.name} quantity`" @click="decreaseQuantity(item.flavorId, item.flavor.name)">−</button>
              <input
                :id="`quantity-${item.flavorId}`"
                type="number"
                inputmode="numeric"
                min="0"
                :max="item.quantity + crateStore.remainingCapacity"
                :value="item.quantity"
                @change="updateQuantity($event, item.flavorId, item.quantity, item.flavor.name)"
              />
              <button
                type="button"
                :aria-label="`Increase ${item.flavor.name} quantity`"
                :disabled="crateStore.isFull"
                @click="increaseQuantity(item.flavorId, item.flavor.name)"
              >+</button>
            </div>
          </div>
        </article>
      </section>

      <aside class="astropop-cart-summary" aria-labelledby="cart-summary-title">
        <p class="astropop-cart-summary__eyebrow">Crate capacity</p>
        <h2 id="cart-summary-title">{{ crateStore.totalBottles }} of 6 bottles</h2>
        <div class="astropop-cart-summary__meter" aria-label="Six-bottle capacity indicator">
          <span v-for="slot in 6" :key="slot" :class="{ 'is-filled': slot <= crateStore.totalBottles }"></span>
        </div>
        <p>{{ crateStore.remainingCapacity }} {{ crateStore.remainingCapacity === 1 ? "space remains" : "spaces remain" }} in your rocket crate.</p>
        <p class="astropop-cart-summary__note">Bottle prices will appear when the soda counter opens.</p>
        <NuxtLink class="astropop-cart-summary__continue" to="/astro-pop#pack-your-pop-title">Continue shopping</NuxtLink>
        <button class="astropop-cart-page__button" type="button" disabled>Checkout · Coming soon</button>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.astropop-cart-page { min-height: 100vh; padding: clamp(1.25rem, 4vw, 3rem); background: radial-gradient(circle at top, #fff4d8 0, #e8d3ad 55%); color: #3a2c35; font-family: "Barlow", Arial, sans-serif; }
.astropop-cart-page__header, .astropop-cart-page__layout, .astropop-cart-empty { width: min(100%, 70rem); margin-inline: auto; }
.astropop-cart-page__header { position: relative; padding: 2rem 0 3rem; text-align: center; }
.astropop-cart-page__back { position: absolute; top: 0; left: 0; color: inherit; font-weight: 700; text-decoration: none; }
.astropop-cart-page__back:hover, .astropop-cart-page__back:focus-visible, .astropop-cart-summary__continue:hover, .astropop-cart-summary__continue:focus-visible { color: #a83f2e; text-decoration: underline; }
.astropop-cart-page__eyebrow, .astropop-cart-summary__eyebrow, .astropop-cart-empty__stamp { margin: 0; color: #a83f2e; font-family: "Barlow Condensed", Arial, sans-serif; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.astropop-cart-page h1, .astropop-cart-page h2, .astropop-cart-page h3 { font-family: "Fraunces", Georgia, serif; font-weight: 900; }
.astropop-cart-page h1 { margin: .4rem 0; font-size: clamp(2.7rem, 8vw, 5rem); line-height: 1; }
.astropop-cart-page__header > p:last-child { margin: 0; font-size: 1.1rem; }
.astropop-cart-page__layout { display: grid; gap: 1.5rem; align-items: start; grid-template-columns: minmax(0, 1fr); }
.astropop-cart-items, .astropop-cart-summary, .astropop-cart-empty { border: 2px solid #4b2830; border-radius: 1rem .35rem 1rem .35rem; background: #fff3d6; box-shadow: .4rem .45rem 0 #4b2830; }
.astropop-cart-items { padding: clamp(1rem, 3vw, 1.75rem); }
.astropop-cart-items > h2 { margin: 0 0 1rem; font-size: 1.8rem; }
.astropop-cart-item { display: grid; grid-template-columns: 4.5rem minmax(0, 1fr); gap: .75rem 1rem; align-items: center; border-top: 2px dashed #c89c75; padding: 1rem 0; }
.astropop-cart-item img { grid-row: span 2; width: 4.5rem; height: 7rem; object-fit: contain; }
.astropop-cart-item__details h3 { margin: 0; font-size: 1.2rem; }.astropop-cart-item__details p { margin: .2rem 0 .5rem; font-size: .9rem; font-style: italic; }
.astropop-cart-item__remove { border: 0; border-bottom: 1px solid currentColor; padding: 0; background: transparent; color: #8f3134; cursor: pointer; font: inherit; font-weight: 700; }
.astropop-cart-item__quantity { grid-column: 2; }.astropop-cart-item__quantity label { display: block; margin-bottom: .35rem; font-family: "Barlow Condensed", Arial, sans-serif; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.astropop-cart-item__quantity-controls { display: flex; width: fit-content; border: 2px solid #3a2c35; border-radius: .35rem; overflow: hidden; }.astropop-cart-item__quantity-controls button, .astropop-cart-item__quantity-controls input { min-width: 2.5rem; height: 2.4rem; border: 0; background: #fffdf1; color: #3a2c35; font: inherit; text-align: center; }.astropop-cart-item__quantity-controls button { cursor: pointer; font-size: 1.25rem; font-weight: 700; }.astropop-cart-item__quantity-controls button:hover:not(:disabled) { background: #9bd4cb; }.astropop-cart-item__quantity-controls button:disabled { cursor: not-allowed; color: #9b8474; }.astropop-cart-item__quantity-controls input { min-width: 3.25rem; border-inline: 2px solid #3a2c35; }
.astropop-cart-summary { padding: 1.5rem; }.astropop-cart-summary h2 { margin: .35rem 0 1rem; font-size: 2rem; }.astropop-cart-summary__meter { display: grid; grid-template-columns: repeat(6, 1fr); gap: .35rem; }.astropop-cart-summary__meter span { height: 1rem; border: 2px solid #3a2c35; border-radius: 999px; }.astropop-cart-summary__meter .is-filled { background: #a83f2e; }.astropop-cart-summary__note { border-top: 1px solid #c89c75; padding-top: 1rem; font-style: italic; }.astropop-cart-summary__continue { display: inline-block; margin: .5rem 0 1.25rem; color: #3a2c35; font-weight: 700; }
.astropop-cart-page__button { display: inline-flex; min-height: 2.8rem; align-items: center; justify-content: center; border: 2px solid #6d2e35; border-radius: 999px; padding: .65rem 1.1rem; background: #a83f2e; color: #fff8e5; font-family: "Barlow Condensed", Arial, sans-serif; font-size: .95rem; font-weight: 700; letter-spacing: .08em; text-decoration: none; text-transform: uppercase; }.astropop-cart-summary .astropop-cart-page__button { width: 100%; }.astropop-cart-page__button:disabled { cursor: not-allowed; opacity: .65; }
.astropop-cart-empty { max-width: 42rem; padding: clamp(1.5rem, 5vw, 3rem); text-align: center; }.astropop-cart-empty h2 { margin: .75rem 0; font-size: clamp(1.8rem, 5vw, 2.8rem); }.astropop-cart-empty p:not(.astropop-cart-empty__stamp) { margin: 0 0 1.5rem; font-size: 1.1rem; line-height: 1.6; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
button:focus-visible, input:focus-visible, a:focus-visible { outline: 3px solid #167c89; outline-offset: 3px; }
@media (min-width: 760px) { .astropop-cart-page__layout { grid-template-columns: minmax(0, 1.65fr) minmax(17rem, .75fr); }.astropop-cart-item { grid-template-columns: 5.5rem minmax(0, 1fr) auto; }.astropop-cart-item img { grid-row: auto; width: 5.5rem; height: 8rem; }.astropop-cart-item__quantity { grid-column: auto; }.astropop-cart-item__details { align-self: center; } }
@media (max-width: 480px) { .astropop-cart-page__back { position: static; display: inline-block; margin-bottom: 2rem; }.astropop-cart-page__header { padding-top: 0; } }
</style>
