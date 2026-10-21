<script setup lang="ts">
import type { AstroPopFlavor } from "../data/astroPopFlavors";

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
      <h3 :id="`${flavor.id}-title`">{{ flavor.name }}</h3>
      <p class="flavor-card__slogan">{{ flavor.slogan }}</p>
    </header>

    <div
      class="flavor-card__artwork"
      role="img"
      :aria-label="`${flavor.artwork.label}: ${flavor.artwork.pose}`"
    >
      <span class="flavor-card__artwork-burst flavor-card__artwork-burst--one" aria-hidden="true">✦</span>
      <span class="flavor-card__artwork-burst flavor-card__artwork-burst--two" aria-hidden="true">✦</span>
      <span class="flavor-card__artwork-label">Artwork placeholder</span>
      <strong>{{ flavor.artwork.label }}</strong>
      <span>{{ flavor.artwork.pose }}</span>
    </div>

    <p class="flavor-card__description">{{ flavor.description }}</p>
    <div class="flavor-card__rule" aria-hidden="true"><span>✦</span></div>
    <div class="flavor-card__ornament flavor-card__ornament--bottom" aria-hidden="true">✦</div>
  </article>
</template>

<style scoped>
.flavor-card {
  --card-accent: #b43f35;
  --card-ink: #4b2830;
  --card-paper: #fff3d6;
  --card-art: #efb9a4;
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

.flavor-card--atomic-cherry {
  --card-accent: #b63a3c;
  --card-ink: #5e2730;
  --card-paper: #fff0d2;
  --card-art: #efb4a5;
}

.flavor-card--solar-citrus {
  --card-accent: #d97b1f;
  --card-ink: #75431e;
  --card-paper: #fff1bd;
  --card-art: #f6c85f;
}

.flavor-card--lunar-lime {
  --card-accent: #4f9470;
  --card-ink: #285748;
  --card-paper: #eaf1c9;
  --card-art: #a8d69b;
}

.flavor-card--neptune-berry {
  --card-accent: #167c89;
  --card-ink: #174d5a;
  --card-paper: #dff1e8;
  --card-art: #86c8c2;
}

.flavor-card__header {
  position: relative;
  z-index: 1;
  padding-right: 1rem;
}

.flavor-card__brand {
  margin: 0 0 0.85rem;
  color: var(--card-accent);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  line-height: 1.3;
  text-transform: uppercase;
}

.flavor-card h3 {
  max-width: 13ch;
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.9rem, 3vw, 2.8rem);
  line-height: 0.93;
  text-wrap: balance;
}

.flavor-card__slogan {
  margin: 0.8rem 0 0;
  color: var(--card-accent);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  font-style: italic;
  font-weight: 700;
  line-height: 1.15;
}

.flavor-card__artwork {
  display: flex;
  min-height: 20rem;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  position: relative;
  margin: 1.5rem 0;
  border: 2px dashed var(--card-accent);
  border-radius: 48% 52% 45% 55% / 15% 18% 12% 16%;
  padding: 2rem 1.5rem;
  background:
    radial-gradient(circle at 50% 55%, rgba(255, 250, 222, 0.7), transparent 40%),
    var(--card-art);
  text-align: center;
  transform: rotate(-1deg);
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

.flavor-card__artwork-label,
.flavor-card__artwork strong,
.flavor-card__artwork > span:last-child {
  display: block;
}

.flavor-card__artwork-label {
  margin-bottom: 0.5rem;
  color: var(--card-accent);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.flavor-card__artwork strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.35rem;
  line-height: 1.1;
}

.flavor-card__artwork > span:last-child {
  max-width: 20ch;
  margin-top: 0.45rem;
  font-size: 0.9rem;
  font-style: italic;
  line-height: 1.3;
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
  font-size: 0.97rem;
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

@media (max-width: 700px) {
  .flavor-card {
    min-height: 36rem;
  }

  .flavor-card__artwork {
    min-height: 17rem;
  }
}
</style>
