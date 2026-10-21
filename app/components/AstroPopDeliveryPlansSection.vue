<template>
  <section
    id="astropop-delivery-plans"
    class="astropop-delivery-plans"
    aria-labelledby="astropop-delivery-plans-title"
  >
    <div class="astropop-delivery-plans__accent" aria-hidden="true">✦</div>
    <p class="astropop-delivery-plans__eyebrow">Delivery Headquarters</p>
    <h2 id="astropop-delivery-plans-title">The Astro Delivery Plans</h2>
    <p class="astropop-delivery-plans__subtitle">As much AstroPop as your heart desires!</p>
  </section>
</template>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto;
  }
}

.astropop-delivery-plans {
  position: relative;
  width: min(100% - 2rem, 80rem);
  min-width: 0;
  margin: 0 auto;
  padding: clamp(4rem, 8vw, 7rem) clamp(1rem, 5vw, 4rem);
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
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.3;
  text-transform: uppercase;
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
</style>
