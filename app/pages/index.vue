<script setup lang="ts">
import { onMounted, ref } from "vue";
import { GRAND_CONCOURSE_MEDIA } from "../data/grandConcourseMedia";

const heroFailed = ref(false);
const heroImage = ref<HTMLImageElement>();

onMounted(() => {
  if (heroImage.value?.complete && heroImage.value.naturalWidth === 0) {
    heroFailed.value = true;
    return;
  }

  void heroImage.value?.decode().catch(() => { heroFailed.value = true; });
});

useSeoMeta({
  title: "CosmoPort Universe",
  description: "Welcome to the Grand Concourse, your gateway to the CosmoPort Universe.",
  ogTitle: "CosmoPort Universe",
  ogDescription: "Welcome to the Grand Concourse, your gateway to the CosmoPort Universe.",
});
</script>

<template>
  <div class="grand-concourse">
    <header class="grand-concourse__header"><UniverseNav /></header>
    <main>
      <section class="grand-concourse__hero" aria-label="CosmoPort Grand Concourse">
        <div class="grand-concourse__hero-art">
          <div class="grand-concourse__hero-fallback" aria-hidden="true"><span>CosmoPort</span><strong>Grand Concourse</strong><small>Arrivals from tomorrow</small></div>
          <img v-if="!heroFailed" ref="heroImage" :src="GRAND_CONCOURSE_MEDIA.hero" alt="Illustrated CosmoPort Grand Concourse terminal, with travelers, a central CosmoPort sign, and the AstroPop Soda Co. storefront." fetchpriority="high" @error="heroFailed = true">
        </div>
        <a class="grand-concourse__scroll-link" href="#concourse">Explore the Concourse <span aria-hidden="true">↓</span></a>
      </section>

      <section id="concourse" class="concourse-experiences" aria-labelledby="concourse-title">
        <div class="concourse-experiences__heading"><p class="concourse-experiences__eyebrow">CosmoPort Universe</p><h1 id="concourse-title">Explore the Concourse</h1></div>
        <div class="concourse-experiences__cards">
          <article class="concourse-card concourse-card--astropop">
            <p class="concourse-card__status">Now serving</p><h2>AstroPop Soda Co.</h2><p>Your neighborhood soda shop, now serving the stars.</p>
            <NuxtLink class="concourse-card__link" to="/astro-pop">Enter AstroPop <span aria-hidden="true">→</span></NuxtLink>
          </article>
          <article class="concourse-card concourse-card--voyage">
            <p class="concourse-card__status">Opening soon</p><h2>CosmoPort Voyage</h2><p>Our next departure is still under construction.</p>
            <span class="concourse-card__unavailable" aria-label="CosmoPort Voyage is under construction">Under Construction</span>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.grand-concourse { min-height: 100vh; min-height: 100svh; overflow: clip; background: #f3e4c7; color: #183d4a; }
.grand-concourse__header { position: relative; z-index: 2; background: #f3e4c7; }
.grand-concourse__hero { position: relative; display: grid; min-height: calc(100svh - 4.75rem); background: #183d4a; }.grand-concourse__hero-art { display: grid; width: 100%; min-height: 0; place-items: center; overflow: hidden; background: radial-gradient(circle at 50% 40%, #f2c774 0 18%, #dc8154 45%, #183d4a 100%); }.grand-concourse__hero-art img, .grand-concourse__hero-fallback { grid-area: 1 / 1; }.grand-concourse__hero-art img { display: block; width: 100%; height: 100%; min-height: inherit; aspect-ratio: 16 / 9; color: transparent; font-size: 0; object-fit: contain; object-position: center; }
.grand-concourse__hero-fallback { display: grid; width: 100%; min-height: inherit; align-content: center; justify-items: center; gap: .5rem; padding: 2rem; color: #fff8e8; text-align: center; text-transform: uppercase; }.grand-concourse__hero-fallback span, .grand-concourse__hero-fallback small { font-size: clamp(.65rem, 1.4vw, .9rem); font-weight: 800; letter-spacing: .2em; }.grand-concourse__hero-fallback strong { max-width: 16ch; color: #ffd281; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2.8rem, 9vw, 7rem); letter-spacing: -.055em; line-height: .85; }
.grand-concourse__scroll-link { position: absolute; right: clamp(1rem, 3vw, 3rem); bottom: clamp(1rem, 3vw, 2rem); display: inline-flex; align-items: center; gap: .55rem; border: 2px solid #fff8e8; border-radius: 999px; padding: .7rem 1rem; background: rgba(24, 61, 74, .78); color: #fff8e8; font-size: .72rem; font-weight: 800; letter-spacing: .1em; text-decoration: none; text-transform: uppercase; }.grand-concourse__scroll-link:hover, .grand-concourse__scroll-link:focus-visible { background: #fff8e8; color: #183d4a; }.grand-concourse__scroll-link:focus-visible, .concourse-card__link:focus-visible { outline: 3px solid #b44d32; outline-offset: 4px; }
.concourse-experiences { width: min(100% - 2rem, 72rem); margin: 0 auto; padding: clamp(4rem, 9vw, 7rem) 0; }.concourse-experiences__heading { max-width: 40rem; }.concourse-experiences__eyebrow, .concourse-card__status { margin: 0 0 .8rem; color: #b44d32; font-size: .7rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }.concourse-experiences h1, .concourse-card h2 { margin: 0; font-family: Georgia, "Times New Roman", serif; letter-spacing: -.05em; line-height: .92; }.concourse-experiences h1 { font-size: clamp(2.7rem, 6vw, 5.25rem); }.concourse-experiences__cards { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(15rem, .75fr); gap: 1.5rem; margin-top: 2.5rem; }.concourse-card { display: flex; min-height: 18rem; flex-direction: column; align-items: flex-start; border: 3px solid #183d4a; padding: clamp(1.5rem, 4vw, 2.5rem); }.concourse-card h2 { font-size: clamp(2rem, 4vw, 3.4rem); }.concourse-card > p:not(.concourse-card__status) { max-width: 27rem; margin: 1.25rem 0 2rem; font-size: 1.05rem; line-height: 1.55; }.concourse-card--astropop { background: #f4a7a4; box-shadow: .5rem .5rem 0 #183d4a; }.concourse-card--astropop .concourse-card__status { color: #8d301e; }.concourse-card--voyage { border-color: #7a8f91; background: #d9e1d7; color: #526a70; }.concourse-card--voyage .concourse-card__status { color: #68787b; }.concourse-card__link, .concourse-card__unavailable { display: inline-flex; align-items: center; gap: .55rem; margin-top: auto; border-radius: 999px; padding: .75rem 1rem; font-size: .74rem; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; }.concourse-card__link { border: 2px solid #183d4a; background: #183d4a; color: #fff8e8; text-decoration: none; }.concourse-card__link:hover, .concourse-card__link:focus-visible { border-color: #b44d32; background: #b44d32; }.concourse-card__unavailable { border: 2px dashed #7a8f91; color: #526a70; }
@media (max-width: 44rem) { .grand-concourse__hero { min-height: auto; }.grand-concourse__hero-art img { min-height: 0; aspect-ratio: 4 / 3; }.grand-concourse__hero-fallback { padding: 1rem; }.grand-concourse__hero-fallback strong { max-width: 100%; font-size: clamp(2rem, 13vw, 2.8rem); }.concourse-experiences__cards { grid-template-columns: 1fr; }.concourse-card { min-height: 15rem; }.concourse-card--astropop { box-shadow: .35rem .35rem 0 #183d4a; } }
@media (max-width: 30rem) { .concourse-experiences { width: min(100% - 1.5rem, 72rem); }.grand-concourse__scroll-link { right: .75rem; bottom: .75rem; font-size: .64rem; }.concourse-card { padding: 1.35rem; } }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
</style>
