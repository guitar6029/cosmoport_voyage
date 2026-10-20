<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getWrappedIndex } from "../utils/carouselNavigation";

interface DestinationSectionProps {
  slug?: string;
  destinationLabel?: string;
  guideLabel?: string;
  guideTitle?: string;
  guideSubtitle?: string;
  fallbackName?: string;
  sectionId?: string;
  theme?: "destination" | "pearlwater" | "saffron";
}

const props = withDefaults(defineProps<DestinationSectionProps>(), {
  slug: "aurora-city",
  destinationLabel: "Destination 01 · Velora-7",
  guideLabel: "City guide",
  guideTitle: "Explore Aurora City",
  guideSubtitle: "Five Spectacular Ways to Experience Tomorrow.",
  fallbackName: "Aurora City",
  sectionId: "destination-title",
  theme: "destination",
});

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

interface DestinationContent {
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

const { data, error, pending } = await useSanityQuery<DestinationContent | null>(
  destinationQuery,
  { slug: props.slug },
);

const carousel = ref<HTMLElement | null>(null);
const selectedIndex = ref(0);
let scrollFrame: number | undefined;
let programmaticIndex: number | undefined;
let programmaticResetFrame: number | undefined;

const destination = computed(() => data.value);
const highlights = computed(() => destination.value?.highlights ?? []);
const hasContent = computed(() => Boolean(destination.value));

const imageAssetId = (image?: SanityImage) => image?.asset?._ref;

const scrollToHighlight = (index: number) => {
  const count = highlights.value.length;

  if (!count) {
    return;
  }

  const nextIndex = getWrappedIndex(index, count);
  const card = carousel.value?.querySelector<HTMLElement>(
    `[data-highlight-index="${nextIndex}"]`,
  );

  if (!card || !carousel.value) {
    return;
  }

  const targetScrollLeft = card.offsetLeft - (carousel.value.clientWidth - card.offsetWidth) / 2;
  const maxScrollLeft = carousel.value.scrollWidth - carousel.value.clientWidth;

  selectedIndex.value = nextIndex;
  programmaticIndex = nextIndex;
  carousel.value.scrollTo({
    left: Math.min(maxScrollLeft, Math.max(0, targetScrollLeft)),
    behavior: "auto",
  });

  if (programmaticResetFrame !== undefined) {
    cancelAnimationFrame(programmaticResetFrame);
  }

  programmaticResetFrame = requestAnimationFrame(() => {
    programmaticIndex = undefined;
    programmaticResetFrame = undefined;
  });
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

const updateSelectedIndex = () => {
  if (!carousel.value) {
    return;
  }

  const cards = carousel.value.querySelectorAll<HTMLElement>("[data-highlight-index]");

  // Keep the initial left edge stable, but let manual scrolling determine the
  // active card everywhere else. Arrow navigation is protected separately by
  // programmaticIndex so a clamped scroll cannot replace its requested index.
  if (carousel.value.scrollLeft <= 1 && selectedIndex.value === 0) {
    selectedIndex.value = 0;
    return;
  }

  const carouselCenter = carousel.value.scrollLeft + carousel.value.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(cardCenter - carouselCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = Number(card.dataset.highlightIndex);
    }
  });

  if (!Number.isNaN(closestIndex)) {
    selectedIndex.value = closestIndex;
  }
};

const handleCarouselScroll = () => {
  if (programmaticIndex !== undefined) {
    selectedIndex.value = programmaticIndex;
    programmaticIndex = undefined;

    if (programmaticResetFrame !== undefined) {
      cancelAnimationFrame(programmaticResetFrame);
      programmaticResetFrame = undefined;
    }

    return;
  }

  if (scrollFrame !== undefined) {
    cancelAnimationFrame(scrollFrame);
  }

  scrollFrame = requestAnimationFrame(() => {
    updateSelectedIndex();
    scrollFrame = undefined;
  });
};

onMounted(() => {
  if (!carousel.value || !highlights.value.length) {
    return;
  }

  carousel.value.addEventListener("scroll", handleCarouselScroll, { passive: true });
  updateSelectedIndex();
});

onBeforeUnmount(() => {
  carousel.value?.removeEventListener("scroll", handleCarouselScroll);

  if (scrollFrame !== undefined) {
    cancelAnimationFrame(scrollFrame);
  }

  if (programmaticResetFrame !== undefined) {
    cancelAnimationFrame(programmaticResetFrame);
  }
});
</script>

<template>
  <section
    class="destination-section"
    :class="`destination-section--${props.theme}`"
    :aria-labelledby="props.sectionId"
  >
    <div class="destination-section__inner">
      <div v-if="pending" class="destination-status" role="status">
        Preparing the {{ props.fallbackName }} departure board…
      </div>

      <div v-else-if="error || !hasContent" class="destination-status">
        <p class="destination-status__eyebrow">CosmoPort destination desk</p>
        <h2 :id="props.sectionId">{{ props.fallbackName }} is preparing for departure.</h2>
        <p>Destination details will appear here when the city is ready for visitors.</p>
      </div>

      <template v-else>
        <div class="destination-intro">
          <div class="destination-copy">
            <p class="destination-eyebrow">{{ props.destinationLabel }}</p>
            <h2 :id="props.sectionId">{{ destination?.name || props.fallbackName }}</h2>
            <p v-if="destination?.tagline" class="destination-tagline">
              {{ destination.tagline }}
            </p>
            <p v-if="destination?.description" class="destination-description">
              {{ destination.description }}
            </p>
          </div>

          <div v-if="imageAssetId(destination?.heroImage)" class="destination-hero-image">
            <SanityImage
              :asset-id="imageAssetId(destination?.heroImage)"
              :alt="destination?.altText || `${destination?.name || props.fallbackName} destination`"
              width="960"
              height="620"
              sizes="sm:100vw md:50vw lg:45vw"
            />
          </div>
        </div>

        <div v-if="highlights.length" class="destination-attractions">
          <div class="destination-attractions__heading">
            <div>
              <p class="destination-eyebrow">{{ props.guideLabel }}</p>
              <h3>{{ props.guideTitle }}</h3>
              <p class="destination-attractions__subtitle">{{ props.guideSubtitle }}</p>
            </div>
            <div class="destination-controls">
              <button
                type="button"
                class="destination-control"
                :disabled="highlights.length < 2"
                :aria-label="`Previous ${props.fallbackName} attraction`"
                @click="scrollToHighlight(selectedIndex - 1)"
              >
                ←
              </button>
              <span class="destination-position" aria-live="polite">
                {{ String(selectedIndex + 1).padStart(2, "0") }} /
                {{ String(highlights.length).padStart(2, "0") }}
              </span>
              <button
                type="button"
                class="destination-control"
                :disabled="highlights.length < 2"
                :aria-label="`Next ${props.fallbackName} attraction`"
                @click="scrollToHighlight(selectedIndex + 1)"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref="carousel"
            class="destination-carousel"
            tabindex="0"
            role="region"
            :aria-label="`${props.fallbackName} attractions`"
            @keydown="handleCarouselKeydown"
          >
            <article
              v-for="(highlight, index) in highlights"
              :key="highlight._key"
              :data-highlight-index="index"
              class="destination-card"
              :class="{ 'is-selected': selectedIndex === index }"
              :aria-current="selectedIndex === index ? 'true' : undefined"
            >
              <div v-if="imageAssetId(highlight.image)" class="destination-card__image">
                <SanityImage
                  :asset-id="imageAssetId(highlight.image)"
                  :alt="highlight.altText || highlight.title || `${props.fallbackName} attraction`"
                  width="720"
                  height="840"
                  sizes="sm:82vw md:42vw lg:30vw"
                />
              </div>
              <div v-else class="destination-card__image destination-card__image--empty" aria-hidden="true">
                <span>CPV / {{ props.fallbackName }}</span>
              </div>
              <div class="destination-card__body">
                <p class="destination-card__number">0{{ index + 1 }}</p>
                <h4>{{ highlight.title || `${props.fallbackName} attraction` }}</h4>
                <p v-if="highlight.description">{{ highlight.description }}</p>
              </div>
            </article>
          </div>
        </div>

        <p v-else class="destination-status destination-status--compact">
          {{ props.fallbackName }} attractions are still being charted.
        </p>
      </template>
    </div>
  </section>
</template>

<style scoped>
.destination-section {
  --destination-teal: #103947;
  --destination-deep-teal: #082b37;
  --destination-aqua: #71d6d0;
  --destination-ivory: #fff4df;
  --destination-gold: #eac78d;
  --destination-background-start: #0b303d;
  --destination-background-end: #194e59;
  min-height: 100svh;
  background:
    radial-gradient(circle at 15% 18%, rgba(113, 214, 208, 0.16), transparent 28rem),
    linear-gradient(135deg, var(--destination-background-start) 0%, var(--destination-teal) 48%, var(--destination-background-end) 100%);
  color: var(--destination-ivory);
  overflow: hidden;
}

.destination-section--pearlwater {
  --destination-teal: #155764;
  --destination-deep-teal: #0b3542;
  --destination-aqua: #79ded8;
  --destination-gold: #f2ce9a;
  --destination-background-start: #0a3e4c;
  --destination-background-end: #26818a;
}

.destination-section--pearlwater .destination-tagline {
  color: #f18d77;
}

.destination-section--saffron {
  --destination-teal: #a9553d;
  --destination-deep-teal: #382e37;
  --destination-aqua: #348d91;
  --destination-ivory: #f1d2a0;
  --destination-gold: #d78a42;
  --destination-background-start: #713c32;
  --destination-background-end: #a9553d;
}

.destination-section__inner {
  width: min(100% - 3rem, 1380px);
  min-height: 100svh;
  margin: 0 auto;
  padding: clamp(4rem, 8vw, 8rem) 0 clamp(4rem, 8vw, 7rem);
}

.destination-intro {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(20rem, 1.2fr);
  gap: clamp(2rem, 7vw, 8rem);
  align-items: end;
}

.destination-copy {
  max-width: 33rem;
}

.destination-eyebrow,
.destination-status__eyebrow {
  margin: 0 0 1rem;
  color: var(--destination-aqua);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.destination-copy h2,
.destination-status h2 {
  margin: 0;
  color: var(--destination-ivory);
  font-family: "Fontdiner Swanky", Georgia, serif;
  font-size: clamp(3.5rem, 8vw, 8rem);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 0.9;
  text-wrap: balance;
}

.destination-tagline {
  margin: 1.75rem 0 0;
  color: var(--destination-gold);
  font-family: "Cherry Cream Soda", system-ui, sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  line-height: 1.25;
}

.destination-description {
  max-width: 31rem;
  margin: 1.5rem 0 0;
  color: rgba(255, 244, 223, 0.84);
  font-size: 1.08rem;
  line-height: 1.65;
}

.destination-hero-image {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  aspect-ratio: 1.55;
  border: 2px solid var(--destination-gold);
  border-radius: 48% 8% 8% 8% / 12% 12% 42% 8%;
  background: var(--destination-deep-teal);
  box-shadow: 1rem 1rem 0 rgba(4, 25, 34, 0.25);
}

.destination-hero-image::after {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(113, 214, 208, 0.65);
  border-radius: inherit;
  content: "";
  pointer-events: none;
}

.destination-hero-image :deep(img),
.destination-card__image :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.destination-attractions {
  margin-top: clamp(5rem, 10vw, 10rem);
}

.destination-attractions__heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.destination-attractions h3 {
  margin: 0;
  color: var(--destination-ivory);
  font-family: "Cherry Cream Soda", system-ui, sans-serif;
  font-size: clamp(1.8rem, 3vw, 3rem);
  font-weight: 400;
}

.destination-controls {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.destination-control {
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border: 1px solid var(--destination-gold);
  border-radius: 50%;
  background: transparent;
  color: var(--destination-gold);
  cursor: pointer;
  font-size: 1.4rem;
}

.destination-control:hover:not(:disabled),
.destination-control:focus-visible {
  background: var(--destination-gold);
  color: var(--destination-deep-teal);
}

.destination-control:focus-visible,
.destination-carousel:focus-visible {
  outline: 3px solid var(--destination-aqua);
  outline-offset: 4px;
}

.destination-control:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.destination-position {
  min-width: 4.5rem;
  color: rgba(255, 244, 223, 0.72);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-align: center;
}

.destination-carousel {
  display: flex;
  gap: 1.25rem;
  width: 100vw;
  margin-left: calc((100% - 100vw) / 2);
  margin-right: calc((100% - 100vw) / 2);
  padding: 0.75rem 1.5rem 1.5rem max(1.5rem, calc((100vw - 1380px) / 2 + 1.5rem));
  overflow-x: auto;
  scroll-padding-inline: 1.5rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--destination-gold) transparent;
}

.destination-card {
  flex: 0 0 clamp(17rem, 29vw, 28rem);
  overflow: hidden;
  scroll-snap-align: center;
  border: 1px solid rgba(234, 199, 141, 0.5);
  border-radius: 44% 5% 7% 7% / 9% 7% 6% 12%;
  background: var(--destination-deep-teal);
  box-shadow: 0.7rem 0.7rem 0 rgba(4, 25, 34, 0.18);
  transition: border-color 180ms ease, transform 180ms ease;
}

.destination-card.is-selected {
  border: 2px solid var(--destination-gold);
  transform: translateY(-0.35rem);
}

.destination-card__image {
  height: clamp(15rem, 27vw, 25rem);
  overflow: hidden;
  background: #124858;
}

.destination-card__image--empty {
  display: grid;
  place-items: center;
  color: var(--destination-aqua);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
}

.destination-card__body {
  min-height: 12rem;
  padding: 1.25rem 1.5rem 1.5rem;
}

.destination-card__number {
  margin: 0 0 0.8rem;
  color: var(--destination-gold);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.2em;
}

.destination-card h4 {
  margin: 0;
  color: var(--destination-ivory);
  font-family: "Cherry Cream Soda", system-ui, sans-serif;
  font-size: 1.45rem;
  font-weight: 400;
  line-height: 1.25;
}

.destination-attractions__subtitle {
  margin: 0.6rem 0 0;
  color: rgba(255, 244, 223, 0.72);
  font-size: 0.98rem;
  line-height: 1.4;
}

.destination-card__body > p:last-child {
  margin: 0.8rem 0 0;
  color: rgba(255, 244, 223, 0.76);
  font-size: 0.95rem;
  line-height: 1.5;
}

.destination-status {
  display: grid;
  min-height: 55svh;
  place-content: center;
  max-width: 45rem;
  margin: 0 auto;
  text-align: center;
}

.destination-status h2 {
  font-size: clamp(3rem, 7vw, 6.5rem);
}

.destination-status > p:last-child {
  margin: 1.5rem auto 0;
  color: rgba(255, 244, 223, 0.8);
  line-height: 1.6;
}

.destination-status--compact {
  min-height: auto;
  margin: 3rem 0 0;
  color: rgba(255, 244, 223, 0.75);
  text-align: left;
}

@media (max-width: 800px) {
  .destination-section__inner {
    width: min(100% - 2rem, 40rem);
  }

  .destination-intro {
    grid-template-columns: 1fr;
  }

  .destination-copy h2,
  .destination-status h2 {
    max-width: 8ch;
    font-size: clamp(3rem, 13vw, 5.5rem);
    line-height: 0.92;
  }

  .destination-eyebrow,
  .destination-status__eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.2em;
  }

  .destination-card__number {
    font-size: 0.7rem;
    letter-spacing: 0.16em;
  }

  .destination-hero-image {
    aspect-ratio: 1.35;
  }

  .destination-attractions__heading {
    align-items: start;
    flex-direction: column;
    gap: 1.25rem;
  }

  .destination-carousel {
    padding-right: 1rem;
    padding-left: 1rem;
    scroll-padding-inline: 1rem;
  }

  .destination-card {
    flex-basis: min(82vw, 26rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .destination-card {
    transition: none;
  }
}
</style>
