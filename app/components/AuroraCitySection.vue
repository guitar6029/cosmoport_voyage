<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface SanityImage {
  asset?: {
    _ref?: string;
  };
}

interface DestinationHighlight {
  _key: string;
  title?: string;
  description?: string;
  image?: SanityImage;
  altText?: string;
}

interface AuroraCityDestination {
  name?: string;
  tagline?: string;
  description?: string;
  heroImage?: SanityImage;
  altText?: string;
  highlights?: DestinationHighlight[];
}

const destinationQuery = `*[
  _type == "destination" &&
  slug.current == $slug
][0] {
  name,
  tagline,
  description,
  heroImage,
  altText,
  highlights[] {
    _key,
    title,
    description,
    image,
    altText
  }
}`;

const { data, error, pending } = await useSanityQuery<AuroraCityDestination | null>(
  destinationQuery,
  { slug: "aurora-city" },
);

const carousel = ref<HTMLElement | null>(null);
const selectedIndex = ref(0);
let observer: IntersectionObserver | undefined;

const destination = computed(() => data.value);
const highlights = computed(() => destination.value?.highlights ?? []);
const hasContent = computed(() => Boolean(destination.value));

const imageAssetId = (image?: SanityImage) => image?.asset?._ref;

const scrollToHighlight = (index: number) => {
  const count = highlights.value.length;

  if (!count) {
    return;
  }

  const nextIndex = (index + count) % count;
  const card = carousel.value?.querySelector<HTMLElement>(
    `[data-highlight-index="${nextIndex}"]`,
  );

  selectedIndex.value = nextIndex;
  card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
};

const handleCarouselKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    scrollToHighlight(selectedIndex.value - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    scrollToHighlight(selectedIndex.value + 1);
  }
};

onMounted(() => {
  if (!carousel.value || !highlights.value.length || !("IntersectionObserver" in window)) {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const visibleCard = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      const index = visibleCard?.target instanceof HTMLElement
        ? Number(visibleCard.target.dataset.highlightIndex)
        : undefined;

      if (index !== undefined && !Number.isNaN(index)) {
        selectedIndex.value = index;
      }
    },
    { root: carousel.value, threshold: [0.6, 0.85] },
  );

  carousel.value.querySelectorAll<HTMLElement>("[data-highlight-index]").forEach((card) => {
    observer?.observe(card);
  });
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section class="aurora-section" aria-labelledby="aurora-title">
    <div class="aurora-section__inner">
      <div v-if="pending" class="aurora-status" role="status">
        Preparing the Aurora City departure board…
      </div>

      <div v-else-if="error || !hasContent" class="aurora-status">
        <p class="aurora-status__eyebrow">CosmoPort destination desk</p>
        <h2 id="aurora-title">Aurora City is preparing for departure.</h2>
        <p>Destination details will appear here when the city is ready for visitors.</p>
      </div>

      <template v-else>
        <div class="aurora-intro">
          <div class="aurora-copy">
            <p class="aurora-eyebrow">Destination 01 · Velora-7</p>
            <h2 id="aurora-title">{{ destination?.name || "Aurora City" }}</h2>
            <p v-if="destination?.tagline" class="aurora-tagline">
              {{ destination.tagline }}
            </p>
            <p v-if="destination?.description" class="aurora-description">
              {{ destination.description }}
            </p>
          </div>

          <div v-if="imageAssetId(destination?.heroImage)" class="aurora-hero-image">
            <SanityImage
              :asset-id="imageAssetId(destination?.heroImage)"
              :alt="destination?.altText || `${destination?.name || 'Aurora City'} destination`"
              width="960"
              height="620"
              sizes="sm:100vw md:50vw lg:45vw"
            />
          </div>
        </div>

        <div v-if="highlights.length" class="aurora-attractions">
          <div class="aurora-attractions__heading">
            <div>
              <p class="aurora-eyebrow">City guide</p>
              <h3>Explore Aurora City</h3>
              <p class="aurora-attractions__subtitle">
                Five Spectacular Ways to Experience Tomorrow.
              </p>
            </div>
            <div class="aurora-controls">
              <button
                type="button"
                class="aurora-control"
                :disabled="highlights.length < 2"
                aria-label="Previous Aurora City attraction"
                @click="scrollToHighlight(selectedIndex - 1)"
              >
                ←
              </button>
              <span class="aurora-position" aria-live="polite">
                {{ String(selectedIndex + 1).padStart(2, "0") }} /
                {{ String(highlights.length).padStart(2, "0") }}
              </span>
              <button
                type="button"
                class="aurora-control"
                :disabled="highlights.length < 2"
                aria-label="Next Aurora City attraction"
                @click="scrollToHighlight(selectedIndex + 1)"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref="carousel"
            class="aurora-carousel"
            tabindex="0"
            role="region"
            aria-label="Aurora City attractions"
            @keydown="handleCarouselKeydown"
          >
            <article
              v-for="(highlight, index) in highlights"
              :key="highlight._key"
              :data-highlight-index="index"
              class="aurora-card"
              :class="{ 'is-selected': selectedIndex === index }"
              :aria-current="selectedIndex === index ? 'true' : undefined"
            >
              <div v-if="imageAssetId(highlight.image)" class="aurora-card__image">
                <SanityImage
                  :asset-id="imageAssetId(highlight.image)"
                  :alt="highlight.altText || highlight.title || 'Aurora City attraction'"
                  width="720"
                  height="840"
                  sizes="sm:82vw md:42vw lg:30vw"
                />
              </div>
              <div v-else class="aurora-card__image aurora-card__image--empty" aria-hidden="true">
                <span>CPV / AURORA</span>
              </div>
              <div class="aurora-card__body">
                <p class="aurora-card__number">0{{ index + 1 }}</p>
                <h4>{{ highlight.title || "Aurora City attraction" }}</h4>
                <p v-if="highlight.description">{{ highlight.description }}</p>
              </div>
            </article>
          </div>
        </div>

        <p v-else class="aurora-status aurora-status--compact">
          Aurora City attractions are still being charted.
        </p>
      </template>
    </div>
  </section>
</template>

<style scoped>
.aurora-section {
  --aurora-teal: #103947;
  --aurora-deep-teal: #082b37;
  --aurora-aqua: #71d6d0;
  --aurora-ivory: #fff4df;
  --aurora-gold: #eac78d;
  min-height: 100svh;
  background:
    radial-gradient(circle at 15% 18%, rgba(113, 214, 208, 0.16), transparent 28rem),
    linear-gradient(135deg, #0b303d 0%, var(--aurora-teal) 48%, #194e59 100%);
  color: var(--aurora-ivory);
  overflow: hidden;
}

.aurora-section__inner {
  width: min(100% - 3rem, 1380px);
  min-height: 100svh;
  margin: 0 auto;
  padding: clamp(4rem, 8vw, 8rem) 0 clamp(4rem, 8vw, 7rem);
}

.aurora-intro {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(20rem, 1.2fr);
  gap: clamp(2rem, 7vw, 8rem);
  align-items: end;
}

.aurora-copy {
  max-width: 33rem;
}

.aurora-eyebrow,
.aurora-status__eyebrow {
  margin: 0 0 1rem;
  color: var(--aurora-aqua);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.aurora-copy h2,
.aurora-status h2 {
  margin: 0;
  color: var(--aurora-ivory);
  font-family: "Fontdiner Swanky", Georgia, serif;
  font-size: clamp(3.5rem, 8vw, 8rem);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 0.9;
  text-wrap: balance;
}

.aurora-tagline {
  margin: 1.75rem 0 0;
  color: var(--aurora-gold);
  font-family: "Cherry Cream Soda", system-ui, sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  line-height: 1.25;
}

.aurora-description {
  max-width: 31rem;
  margin: 1.5rem 0 0;
  color: rgba(255, 244, 223, 0.84);
  font-size: 1.08rem;
  line-height: 1.65;
}

.aurora-hero-image {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  aspect-ratio: 1.55;
  border: 2px solid var(--aurora-gold);
  border-radius: 48% 8% 8% 8% / 12% 12% 42% 8%;
  background: var(--aurora-deep-teal);
  box-shadow: 1rem 1rem 0 rgba(4, 25, 34, 0.25);
}

.aurora-hero-image::after {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(113, 214, 208, 0.65);
  border-radius: inherit;
  content: "";
  pointer-events: none;
}

.aurora-hero-image :deep(img),
.aurora-card__image :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.aurora-attractions {
  margin-top: clamp(5rem, 10vw, 10rem);
}

.aurora-attractions__heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.aurora-attractions h3 {
  margin: 0;
  color: var(--aurora-ivory);
  font-family: "Cherry Cream Soda", system-ui, sans-serif;
  font-size: clamp(1.8rem, 3vw, 3rem);
  font-weight: 400;
}

.aurora-controls {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.aurora-control {
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border: 1px solid var(--aurora-gold);
  border-radius: 50%;
  background: transparent;
  color: var(--aurora-gold);
  cursor: pointer;
  font-size: 1.4rem;
}

.aurora-control:hover:not(:disabled),
.aurora-control:focus-visible {
  background: var(--aurora-gold);
  color: var(--aurora-deep-teal);
}

.aurora-control:focus-visible,
.aurora-carousel:focus-visible {
  outline: 3px solid var(--aurora-aqua);
  outline-offset: 4px;
}

.aurora-control:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.aurora-position {
  min-width: 4.5rem;
  color: rgba(255, 244, 223, 0.72);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-align: center;
}

.aurora-carousel {
  display: flex;
  gap: 1.25rem;
  margin-inline: calc((min(100vw, 100% + 3rem) - 100%) / -2);
  padding: 0.75rem max(1.5rem, calc((100vw - min(100vw, 1380px)) / 2 + 1.5rem)) 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-padding-inline: max(1.5rem, calc((100vw - min(100vw, 1380px)) / 2 + 1.5rem));
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--aurora-gold) transparent;
}

.aurora-card {
  flex: 0 0 clamp(17rem, 29vw, 28rem);
  overflow: hidden;
  scroll-snap-align: center;
  border: 1px solid rgba(234, 199, 141, 0.5);
  border-radius: 44% 5% 7% 7% / 9% 7% 6% 12%;
  background: var(--aurora-deep-teal);
  box-shadow: 0.7rem 0.7rem 0 rgba(4, 25, 34, 0.18);
  transition: border-color 180ms ease, transform 180ms ease;
}

.aurora-card.is-selected {
  border: 2px solid var(--aurora-gold);
  transform: translateY(-0.35rem);
}

.aurora-card__image {
  height: clamp(15rem, 27vw, 25rem);
  overflow: hidden;
  background: #124858;
}

.aurora-card__image--empty {
  display: grid;
  place-items: center;
  color: var(--aurora-aqua);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
}

.aurora-card__body {
  min-height: 12rem;
  padding: 1.25rem 1.5rem 1.5rem;
}

.aurora-card__number {
  margin: 0 0 0.8rem;
  color: var(--aurora-gold);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.2em;
}

.aurora-card h4 {
  margin: 0;
  color: var(--aurora-ivory);
  font-family: "Cherry Cream Soda", system-ui, sans-serif;
  font-size: 1.45rem;
  font-weight: 400;
  line-height: 1.15;
}

.aurora-attractions__subtitle {
  margin: 0.6rem 0 0;
  color: rgba(255, 244, 223, 0.72);
  font-size: 0.98rem;
  line-height: 1.4;
}

.aurora-card__body > p:last-child {
  margin: 0.8rem 0 0;
  color: rgba(255, 244, 223, 0.76);
  font-size: 0.95rem;
  line-height: 1.5;
}

.aurora-status {
  display: grid;
  min-height: 55svh;
  place-content: center;
  max-width: 45rem;
  margin: 0 auto;
  text-align: center;
}

.aurora-status h2 {
  font-size: clamp(3rem, 7vw, 6.5rem);
}

.aurora-status > p:last-child {
  margin: 1.5rem auto 0;
  color: rgba(255, 244, 223, 0.8);
  line-height: 1.6;
}

.aurora-status--compact {
  min-height: auto;
  margin: 3rem 0 0;
  color: rgba(255, 244, 223, 0.75);
  text-align: left;
}

@media (max-width: 800px) {
  .aurora-section__inner {
    width: min(100% - 2rem, 40rem);
  }

  .aurora-intro {
    grid-template-columns: 1fr;
  }

  .aurora-copy h2 {
    max-width: 8ch;
  }

  .aurora-hero-image {
    aspect-ratio: 1.35;
  }

  .aurora-attractions__heading {
    align-items: start;
    flex-direction: column;
    gap: 1.25rem;
  }

  .aurora-carousel {
    margin-inline: -1rem;
    padding-inline: 1rem;
    scroll-padding-inline: 1rem;
  }

  .aurora-card {
    flex-basis: min(82vw, 26rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-carousel {
    scroll-behavior: auto;
  }

  .aurora-card {
    transition: none;
  }
}
</style>
