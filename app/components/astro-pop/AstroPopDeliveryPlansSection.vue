<script setup lang="ts">
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
    image: "/images/astro-pop/delivery/astropop-crate-small.png",
    imageWidth: 585,
    price: "35¢ per delivery",
    description:
      "A delightful little delivery for the soda lover who likes to keep a few chilled and ready.",
  },
  {
    id: "family-fizz-crate",
    name: "Family Fizz Crate",
    bottles: "12 bottles",
    image: "/images/astro-pop/delivery/astropop-crate-medium.png",
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
    image: "/images/astro-pop/delivery/astropop-crate-large.png",
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

<style scoped>
.astropop-delivery-plans {
  position: relative;
  width: min(100% - 2rem, 80rem);
  min-width: 0;
  margin: 0 auto;
  padding: clamp(4rem, 8vw, 7rem) clamp(0.5rem, 2vw, 2rem);
  color: #5e2730;
  text-align: center;
}

.astropop-delivery-plans::before,
.astropop-delivery-plans::after {
  display: block;
  width: min(100%, 42rem);
  height: 2px;
  margin: 0 auto;
  background: #a83f2e;
  content: "";
}

.astropop-delivery-plans::before {
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}

.astropop-delivery-plans::after {
  margin-top: clamp(2rem, 5vw, 3.5rem);
}

.astropop-delivery-plans__accent {
  margin-bottom: 0.9rem;
  color: #167c89;
  font-size: 1.25rem;
  line-height: 1;
}

.astropop-delivery-plans__eyebrow {
  margin: 0 0 0.75rem;
  color: #a83f2e;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  line-height: 1.3;
}

.astropop-delivery-plans h2 {
  margin: 0;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(2.25rem, 6vw, 4.75rem);
  font-weight: 900;
  line-height: 0.95;
  text-wrap: balance;
}

.astropop-delivery-plans__subtitle {
  margin: 1.25rem 0 0;
  color: #167c89;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(1.15rem, 2.5vw, 1.6rem);
  font-style: italic;
  font-weight: 700;
  line-height: 1.25;
}

.astropop-delivery-plans__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-top: clamp(3rem, 7vw, 5rem);
  text-align: left;
}

.astropop-delivery-plan-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  border: 2px solid #5e2730;
  border-radius: 1.25rem 0.5rem 1.25rem 0.5rem;
  padding: 0.75rem;
  background: #fff0d2;
  box-shadow: 0.35rem 0.4rem 0 #5e2730;
}

.astropop-delivery-plan-card--featured {
  border-color: #a83f2e;
  background: #fff8e5;
  box-shadow: 0.35rem 0.4rem 0 #a83f2e;
}

.astropop-delivery-plan-card__artwork {
  position: relative;
  display: flex;
  height: clamp(18rem, 28vw, 23rem);
  flex: none;
  align-items: flex-end;
  justify-content: center;
}

.astropop-delivery-plan-card__artwork img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

.astropop-delivery-plan-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.25rem 0.5rem 0.75rem;
}

.astropop-delivery-plan-card__badge {
  position: absolute;
  top: 0.75rem;
  left: 50%;
  width: max-content;
  max-width: calc(100% - 1rem);
  transform: translateX(-50%);
  margin: 0;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  background: #167c89;
  color: #fff8e5;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}

.astropop-delivery-plan-card h3 {
  min-height: 1.9em;
  margin: 0;
  color: #5e2730;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(1.65rem, 2.5vw, 2.35rem);
  font-weight: 900;
  line-height: 0.95;
  text-wrap: balance;
}

.astropop-delivery-plan-card__bottles {
  margin: 1rem 0 0.2rem;
  color: #167c89;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.astropop-delivery-plan-card__price {
  margin: 0;
  color: #a83f2e;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: 1.45rem;
  font-weight: 900;
}

.astropop-delivery-plan-card__description {
  margin: 1rem 0 0;
  color: #3a2c35;
  font-family: "Barlow", Arial, sans-serif;
  font-size: 0.95rem;
  line-height: 1.45;
}

@media (max-width: 959px) {
  .astropop-delivery-plans__cards {
    grid-template-columns: 1fr;
    max-width: 30rem;
    margin-inline: auto;
  }

  .astropop-delivery-plan-card__artwork {
    height: clamp(18rem, 85vw, 25rem);
  }

  .astropop-delivery-plan-card h3 {
    min-height: 0;
  }
}
</style>
