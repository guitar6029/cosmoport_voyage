<script setup lang="ts">
import AstroPopFlavorSection from "../components/astro-pop/AstroPopFlavorSection.vue";
import AstroPopPackYourPopSection from "../components/astro-pop/AstroPopPackYourPopSection.vue";
import AstroPopDeliverySection from "../components/astro-pop/AstroPopDeliverySection.vue";
import AstroPopDeliveryPlansSection from "../components/astro-pop/AstroPopDeliveryPlansSection.vue";
import AstroPopDeliveryTestimonialsSection from "../components/astro-pop/AstroPopDeliveryTestimonialsSection.vue";
import AstroPopFooter from "../components/astro-pop/AstroPopFooter.vue";
import AstroPopCartLink from "../components/astro-pop/AstroPopCartLink.vue";
</script>

<template>
  <div>
    <main class="astropop-page">
      <section class="astropop-hero" aria-labelledby="astropop-title">
        <NuxtLink class="astropop-home-link" to="/">← Universe directory</NuxtLink>
        <AstroPopCartLink class="astropop-cart-link" />
        <h1 id="astropop-title" class="sr-only">AstroPop Soda Co.</h1>
        <img
          class="astropop-hero__image"
          src="/images/astro-pop/hero/AstroPopDeliveryMan.png"
          alt="Vintage AstroPop Soda Co. advertisement featuring a smiling soda delivery man and a flying delivery rocket"
        />
      </section>

      <AstroPopFlavorSection />
      <AstroPopPackYourPopSection />
      <AstroPopDeliverySection />
      <AstroPopDeliveryPlansSection />
      <AstroPopDeliveryTestimonialsSection />
    </main>
    <AstroPopFooter />
  </div>
</template>

<style scoped>
.astropop-page {
  min-height: 100vh;
  min-height: 100svh;
  background: #e8d3ad;
}

.astropop-hero {
  position: relative;
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  padding: 4.5rem 1rem 1rem;
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 249, 225, 0.7), transparent 48%),
    #e8d3ad;
}

.astropop-hero__image {
  display: block;
  width: min(100%, 124rem);
  max-height: calc(100svh - 5.5rem);
  height: auto;
  object-fit: contain;
}

.astropop-home-link {
  position: absolute;
  z-index: 1;
  top: 1.25rem;
  left: 1.25rem;
  color: #3a2c35;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 700;
  text-decoration: none;
}

.astropop-cart-link {
  position: absolute;
  z-index: 1;
  top: 1rem;
  right: 1.25rem;
}

.astropop-home-link:hover,
.astropop-home-link:focus-visible {
  color: #a83f2e;
  text-decoration: underline;
}

.astropop-home-link:focus-visible {
  outline: 3px solid #a83f2e;
  outline-offset: 4px;
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

@media (max-width: 600px) {
  .astropop-hero {
    padding-inline: 0.5rem;
  }

  .astropop-hero__image {
    width: 100%;
  }
}
</style>
