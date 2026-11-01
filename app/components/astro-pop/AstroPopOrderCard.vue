<script setup lang="ts">
import { computed } from "vue";
import type { AstroPopOrderHistory } from "../../../server/types/astro-pop.types";
import { ASTROPOP_FLAVORS } from "../../data/astroPopFlavors";

const props = defineProps<{ order: AstroPopOrderHistory }>();

const formattedDate = computed(() =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(props.order.createdAt)),
);
const formattedTotal = computed(() =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: props.order.currency.toUpperCase(),
  }).format(props.order.totalCents / 100),
);
const itemImages = computed(() =>
  props.order.items.map((item) => ({
    ...item,
    image: ASTROPOP_FLAVORS.find((flavor) => flavor.id === item.flavorId)?.bottleImage,
  })),
);
const bottleCount = computed(() => props.order.items.reduce((sum, item) => sum + item.quantity, 0));
</script>

<template>
  <article class="order-card" :aria-label="`Astro Pop order placed ${formattedDate}`">
    <header class="order-card__header">
      <div>
        <span class="order-card__eyebrow">Order placed</span>
        <strong>{{ formattedDate }}</strong>
      </div>
      <div>
        <span class="order-card__eyebrow">Total</span>
        <strong>{{ formattedTotal }}</strong>
      </div>
      <div>
        <span class="order-card__eyebrow">Payment</span>
        <strong class="order-card__status">{{ order.paymentStatus.replaceAll("_", " ") }}</strong>
      </div>
    </header>

    <div class="order-card__body">
      <div class="order-card__items">
        <div v-for="item in itemImages" :key="item.flavorId" class="order-card__item">
          <div class="order-card__artwork">
            <img v-if="item.image" :src="item.image" :alt="item.flavorName" loading="lazy" />
            <span v-else aria-hidden="true">✦</span>
            <span class="order-card__quantity" :aria-label="`Quantity ${item.quantity}`">×{{ item.quantity }}</span>
          </div>
          <div class="order-card__item-text">
            <strong>{{ item.flavorName }}</strong>
            <span>{{ item.quantity }} {{ item.quantity === 1 ? "bottle" : "bottles" }}</span>
          </div>
        </div>
      </div>
      <footer class="order-card__footer">
        <span>{{ bottleCount }} {{ bottleCount === 1 ? "bottle" : "bottles" }} · {{ order.status.toLowerCase() }}</span>
        <span>Demo checkout · Order #{{ order.id.slice(0, 8).toUpperCase() }}</span>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.order-card {
  overflow: hidden;
  border: 2px solid #45313a;
  border-radius: 1rem;
  background: #fff3d6;
  box-shadow: 4px 5px 0 #45313a;
  color: #45313a;
}
.order-card__header {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 3rem;
  padding: 1rem 1.25rem;
  border-bottom: 2px solid #45313a;
  background: #e1eee8;
}
.order-card__header > div { display: flex; flex-direction: column; gap: .25rem; }
.order-card__eyebrow {
  font: 700 .76rem/1.2 "Barlow Condensed", Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: .09em;
}
.order-card__status { color: #0d777a; text-transform: capitalize; }
.order-card__body { padding: 1rem 1.25rem; }
.order-card__items { display: grid; gap: .9rem; }
.order-card__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 5.5rem;
}
.order-card__artwork {
  position: relative;
  display: grid;
  place-items: center;
  flex: 0 0 5rem;
  min-width: 0;
  min-height: 0;
  width: 5rem;
  height: 5rem;
  border-radius: .75rem;
  background: #efdbc0;
}
.order-card__artwork img {
  position: absolute;
  inset: 0;
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  padding: .45rem;
  object-fit: contain;
  object-position: center;
}
.order-card__quantity {
  position: absolute;
  z-index: 1;
  right: -.35rem;
  bottom: -.35rem;
  min-width: 1.6rem;
  padding: .2rem .35rem;
  border-radius: 999px;
  background: #c43c30;
  color: white;
  font-weight: 700;
  text-align: center;
}
.order-card__item-text { display: flex; flex-direction: column; gap: .2rem; }
.order-card__item-text span { font-size: .9rem; }
.order-card__footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: .5rem;
  margin-top: 1rem;
  padding-top: .75rem;
  border-top: 1px solid #b9a28d;
  font-size: .8rem;
}
@media (max-width: 600px) {
  .order-card { min-height: 19rem; }
  .order-card__header { gap: .8rem 1.5rem; padding: .85rem; }
  .order-card__body { padding: .85rem; }
  .order-card__footer { flex-direction: column; }
}
</style>
