<script setup lang="ts">
import type { AstroPopFlavor } from "../../data/astroPopFlavors";

defineProps<{
  flavor: AstroPopFlavor;
}>();
</script>

<template>
  <article
    class="flavor-card"
    :class="`flavor-card--${flavor.theme}`"
    :aria-labelledby="`${flavor.id}-title`"
  >
    <div class="flavor-card__ornament flavor-card__ornament--top" aria-hidden="true">✦</div>
    <header class="flavor-card__header">
      <p class="flavor-card__brand">AstroPop Soda Co. · Future flavor</p>
      <h3 :id="`${flavor.id}-title`" class="sr-only">{{ flavor.name }}</h3>
    </header>

    <div class="flavor-card__artwork">
      <span class="flavor-card__artwork-burst flavor-card__artwork-burst--one" aria-hidden="true">✦</span>
      <span class="flavor-card__artwork-burst flavor-card__artwork-burst--two" aria-hidden="true">✦</span>
      <img
        class="flavor-card__artwork-image"
        :src="flavor.artwork.src"
        :alt="flavor.artwork.alt"
        loading="lazy"
      />
    </div>

    <p class="flavor-card__description">{{ flavor.description }}</p>
    <div class="flavor-card__rule" aria-hidden="true"><span>✦</span></div>
    <div class="flavor-card__ornament flavor-card__ornament--bottom" aria-hidden="true">✦</div>
  </article>
</template>

<style scoped>
.flavor-card {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  max-width: 33rem;
  min-height: 40rem;
  flex-direction: column;
  overflow: hidden;
  border: 2px solid var(--card-ink);
  border-radius: 1.25rem 0.45rem 1.25rem 0.45rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--card-paper);
  box-shadow: 0.5rem 0.55rem 0 var(--card-ink);
  color: var(--card-ink);
}

.flavor-card__header {
  position: relative;
  z-index: 1;
  padding-right: 1rem;
}

.flavor-card__brand {
  margin: 0 0 0.85rem;
  color: var(--card-accent);
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1.3;
  text-transform: uppercase;
}

.flavor-card__artwork {
  display: flex;
  min-height: 0;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  position: relative;
  margin: 1.5rem 0;
  border: 2px dashed var(--card-accent);
  border-radius: 48% 52% 45% 55% / 15% 18% 12% 16%;
  padding: 0;
  background:
    radial-gradient(circle at 50% 55%, rgba(255, 250, 222, 0.7), transparent 40%),
    var(--card-art);
  text-align: center;
  transform: rotate(-1deg);
}

.flavor-card__artwork-image {
  display: block;
  width: calc(100% + 1rem);
  height: auto;
  max-width: none;
  margin-inline: -0.5rem;
  object-fit: contain;
}

.flavor-card__artwork::before,
.flavor-card__artwork::after {
  position: absolute;
  z-index: -1;
  color: var(--card-accent);
  content: "✦";
  font-size: 1.8rem;
}

.flavor-card__artwork::before {
  top: 1rem;
  left: 1.25rem;
}

.flavor-card__artwork::after {
  right: 1.25rem;
  bottom: 1rem;
}

.flavor-card__artwork-burst {
  position: absolute;
  color: var(--card-accent);
  font-size: 1rem;
}

.flavor-card__artwork-burst--one {
  top: 2.2rem;
  right: 3rem;
}

.flavor-card__artwork-burst--two {
  bottom: 2.2rem;
  left: 3rem;
}

.flavor-card__description {
  max-width: 34ch;
  margin: auto 0 0;
  font-family: "Barlow", Arial, sans-serif;
  font-size: 0.97rem;
  font-weight: 400;
  line-height: 1.5;
}

.flavor-card__rule {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.35rem;
  color: var(--card-accent);
}

.flavor-card__rule::before,
.flavor-card__rule::after {
  height: 1px;
  flex: 1;
  background: currentColor;
  content: "";
}

.flavor-card__rule span {
  font-size: 0.8rem;
}

.flavor-card__ornament {
  position: absolute;
  color: var(--card-accent);
  font-size: 1.1rem;
}

.flavor-card__ornament--top {
  top: 1.25rem;
  right: 1.5rem;
}

.flavor-card__ornament--bottom {
  right: 1.5rem;
  bottom: 1.2rem;
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

@media (max-width: 700px) {
  .flavor-card {
    min-height: 36rem;
  }

  .flavor-card__artwork {
    min-height: 0;
  }
}
</style>
