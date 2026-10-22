<script setup lang="ts">
import DecorativeImage from "../shared/DecorativeImage.vue";
</script>

<template>
  <div class="astropop-delivery-section-container decorative-container bg-[#efd099]">
    <section class="astropop-delivery-section" aria-labelledby="astropop-delivery-title">
      <div class="astropop-delivery-section__content">
        <p class="astropop-delivery-section__eyebrow">Delivery Service</p>
        <h2 id="astropop-delivery-title">AstroPop Delivers!</h2>
        <p class="astropop-delivery-section__copy">
          Fresh bottles from tomorrow, delivered right to your door.
        </p>
        <a class="astropop-delivery-section__button" href="#astropop-delivery-plans">
          View Plans
        </a>
      </div>

      <div class="astropop-delivery-section__artwork">
        <img
          class="astropop-delivery-section__image"
          src="/images/astro-pop/delivery/AstroPop Delivers_ Retro Soda Adventure.png"
          alt="Retro AstroPop delivery adventure with a soda delivery rocket"
          loading="lazy"
        />
      </div>
    </section>

    <DecorativeImage
      class="astropop-flavor-section__cap"
      src="/images/astro-pop/accents/Vintage AstroPop Soda Cap.png"
      style="top: 90%; left: -5rem; width: 150px; opacity: 0.45; transform: rotate(-15deg); z-index: 0;"
    />

    <DecorativeImage
      class="astropop-flavor-section__cap"
      src="/images/astro-pop/accents/Vintage AstroPop Soda Cap.png"
      style="top: 10%; left: 95%; width: 150px; opacity: 0.45; transform: rotate(-15deg); z-index: 0;"
    />

    <DecorativeImage
      class="astropop-flavor-section__delivery_card"
      src="/images/astro-pop/accents/AstroPop Soda Co. Delivery Note.png"
      style="top: 10%; left: 5%; width: 550px; opacity: 0.45; transform: rotate(-45deg); z-index: 0;"
    />



  </div>
</template>

<style scoped>
.astropop-flavor-section__delivery_card {
  max-width: min(550px, 75vw);
}


.astropop-delivery-section {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(100% - 2rem, 80rem);
  min-width: 0;
  margin: 0 auto;
  flex-direction: column;
  gap: clamp(2rem, 6vw, 5rem);
  border: 2px solid #5e2730;
  border-radius: 1.5rem 0.5rem 1.5rem 0.5rem;
  padding: clamp(2rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem);
  background:
    radial-gradient(circle at 82% 18%, rgba(255, 249, 225, 0.8), transparent 35%),
    #fff0d2;
  /* box-shadow: 0.5rem 0.55rem 0 #5e2730; */
  color: #3a2c35;
}

.astropop-delivery-section__content,
.astropop-delivery-section__artwork {
  min-width: 0;
  flex: 1 1 0%;
}

.astropop-delivery-section__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.astropop-delivery-section__eyebrow {
  margin: 0 0 0.9rem;
  color: #a83f2e;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.3;
  text-transform: uppercase;
}

.astropop-delivery-section h2 {
  max-width: 10ch;
  margin: 0;
  color: #5e2730;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(2.75rem, 7vw, 5.5rem);
  font-weight: 900;
  line-height: 0.9;
  text-wrap: balance;
}

.astropop-delivery-section__copy {
  max-width: 28rem;
  margin: 1.25rem 0 1.75rem;
  color: #167c89;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(1.15rem, 2.5vw, 1.6rem);
  font-style: italic;
  font-weight: 700;
  line-height: 1.25;
}

.astropop-delivery-section__button {
  display: inline-block;
  border: 2px solid #5e2730;
  border-radius: 999px;
  padding: 0.85rem 1.5rem;
  background: #b63a3c;
  color: #fff8e5;
  cursor: pointer;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
}

.astropop-delivery-section__button:hover,
.astropop-delivery-section__button:focus-visible {
  background: #a83f2e;
}

.astropop-delivery-section__button:focus-visible {
  outline: 3px solid var(--astropop-focus-ring, #167c89);
  outline-offset: 4px;
}

.astropop-delivery-section__artwork {
  display: flex;
  align-items: center;
  justify-content: center;
}

.astropop-delivery-section__image {
  display: block;
  width: min(100%, 38rem);
  height: auto;
  object-fit: contain;
}

@media (min-width: 760px) {
  .astropop-delivery-section {
    flex-direction: row;
    align-items: center;
  }
}
</style>
