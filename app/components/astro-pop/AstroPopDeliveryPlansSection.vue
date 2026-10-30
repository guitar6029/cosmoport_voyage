<script setup lang="ts">
import { ASTRO_POP_MEDIA } from "../../data/astroPopMedia";
type DeliveryPlan = {
  id: string;
  name: string;
  bottles: string;
  price: string;
  description: string;
  image: string;
  imageWidth: number;
  featured?: boolean;
};

const deliveryPlans: DeliveryPlan[] = [
  {
    id: "porch-pack",
    name: "Porch Pack",
    bottles: "6 bottles",
    image: ASTRO_POP_MEDIA.deliveryCrates.small,
    imageWidth: 585,
    price: "35¢ per delivery",
    description:
      "A delightful little delivery for the soda lover who likes to keep a few chilled and ready.",
  },
  {
    id: "family-fizz-crate",
    name: "Family Fizz Crate",
    bottles: "12 bottles",
    image: ASTRO_POP_MEDIA.deliveryCrates.medium,
    imageWidth: 655,
    price: "65¢ per delivery",
    description:
      "Perfect for sharing around the dinner table, after school, or during a marvelous movie night.",
    featured: true,
  },
  {
    id: "rocket-reserve",
    name: "Rocket Reserve",
    bottles: "24 bottles",
    image: ASTRO_POP_MEDIA.deliveryCrates.large,
    imageWidth: 808,
    price: "$1.19 per delivery",
    description:
      "For true AstroPop devotees, neighborhood gatherings, and homes where empty bottles never stay empty for long.",
  },
];
</script>

<template>
  <section
    id="astropop-delivery-plans"
    class="astropop-delivery-plans"
    aria-labelledby="astropop-delivery-plans-title"
  >
    <div class="astropop-delivery-plans__accent" aria-hidden="true">✦</div>
    <p class="astropop-eyebrow astropop-delivery-plans__eyebrow">Delivery Headquarters</p>
    <h2 id="astropop-delivery-plans-title">The Astro Delivery Plans</h2>
    <p class="astropop-delivery-plans__subtitle">As much AstroPop as your heart desires!</p>

    <div class="astropop-delivery-plans__cards" aria-label="AstroPop delivery plans">
      <article
        v-for="plan in deliveryPlans"
        :key="plan.id"
        class="astropop-delivery-plan-card"
        :class="{ 'astropop-delivery-plan-card--featured': plan.featured }"
      >
        <div class="astropop-delivery-plan-card__artwork">
          <img
            :src="plan.image"
            :alt="`${plan.name} wooden AstroPop soda crate with ${plan.bottles}`"
            :width="plan.imageWidth"
            height="768"
            loading="lazy"
            decoding="async"
          />
          <p v-if="plan.featured" class="astropop-delivery-plan-card__badge">
            Neighborhood Favorite
          </p>
        </div>

        <div class="astropop-delivery-plan-card__content">
          <h3>{{ plan.name }}</h3>
          <p class="astropop-delivery-plan-card__bottles">{{ plan.bottles }}</p>
          <p class="astropop-delivery-plan-card__price">{{ plan.price }}</p>
          <p class="astropop-delivery-plan-card__description">{{ plan.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped src="./AstroPopDeliveryPlansSection.css"></style>
