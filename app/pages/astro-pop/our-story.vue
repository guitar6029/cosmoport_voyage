<script setup lang="ts">
import AstroPopFooter from "../../components/astro-pop/AstroPopFooter.vue";
import AstroPopNav from "../../components/astro-pop/AstroPopNav.vue";
import DecorativeImage from "../../components/shared/DecorativeImage.vue";

useHead({
  title: "Our Story | AstroPop Soda Co.",
  meta: [
    {
      name: "description",
      content: "Discover the backyard beginnings of AstroPop Soda Co.",
    },
  ],
});
</script>

<template>
  <div class="astropop-our-story-page">
    <main>
      <section class="astropop-our-story-hero" aria-labelledby="astropop-our-story-title">
        <img
          class="astropop-our-story-hero__image"
          src="/images/astro-pop/our-story/hero-family-backyard.png"
          alt="A father pouring homemade red soda beside his smiling family at a backyard table at sunset"
        />
        <div class="astropop-our-story-hero__wash" aria-hidden="true" />

        <NuxtLink class="astropop-our-story-hero__back-link" to="/astro-pop">
          <span aria-hidden="true">←</span> Back to AstroPop
        </NuxtLink>

        <div class="astropop-our-story-hero__nav">
          <AstroPopNav />
        </div>

        <div class="astropop-our-story-hero__content">
          <p class="astropop-our-story-hero__eyebrow">Our Story <span aria-hidden="true">•</span> Est. 1957</p>
          <h1 id="astropop-our-story-title">It Started on the Porch.</h1>
          <p class="astropop-our-story-hero__description">
            Before Astro Pop became a household name, it was just Herbert “Herb” Walker, a backyard full of homemade soda experiments, and a family eager to taste the next batch.
          </p>
        </div>
      </section>

      <section class="astropop-porch-years" aria-labelledby="astropop-porch-years-title">
        <DecorativeImage
          class="astropop-porch-years__cap astropop-porch-years__cap--upper-left"
          src="/images/astro-pop/accents/Vintage AstroPop Soda Cap.png"
        />
        <DecorativeImage
          class="astropop-porch-years__cap astropop-porch-years__cap--lower-left"
          src="/images/astro-pop/accents/Vintage AstroPop Soda Cap.png"
        />
        <DecorativeImage
          class="astropop-porch-years__cap astropop-porch-years__cap--lower-right"
          src="/images/astro-pop/accents/Vintage AstroPop Soda Cap.png"
        />

        <div class="astropop-porch-years__inner">
          <div class="astropop-porch-years__image-wrap">
            <img
              class="astropop-porch-years__image"
              src="/images/astro-pop/our-story/Vintage%20Lemonade%20Stand%20Polaroid.png"
              alt="Herbert Walker stirring a bright red batch of homemade soda on the family back porch"
            />
          </div>

          <div class="astropop-porch-years__content">
            <p class="astropop-porch-years__eyebrow">The Beginning <span aria-hidden="true">•</span> 1957</p>
            <h2 id="astropop-porch-years-title">The Porch Years</h2>
            <p>
              In 1957, Herbert “Herb” Walker wasn't trying to build a soda empire. He just wanted to make a darn good bottle of pop.
            </p>
            <p>
              Most afternoons, you'd find him on the family back porch, surrounded by glass bottles, fresh fruit, handwritten recipes, and the occasional sticky mess. Some batches were too sweet. Others didn't have quite enough fizz. But Herb kept tinkering.
            </p>
            <p>
              His most enthusiastic taste tester? His young son, who never missed a chance to try Dad's latest creation.
            </p>

            <figure class="astropop-porch-years__quote">
              <blockquote>
                “If it's not good enough for our family table, it's not good enough for anybody else's.”
              </blockquote>
              <figcaption>— Herb Walker</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="astropop-first-shop" aria-labelledby="astropop-first-shop-title">
        <div class="astropop-first-shop__inner">
          <div class="astropop-first-shop__content">
            <p class="astropop-first-shop__eyebrow">The First Shop <span aria-hidden="true">•</span> From Porch to Main Street</p>
            <h2 id="astropop-first-shop-title">A Storefront of Our Own</h2>
            <p>
              It started with a few bottles shared over the backyard fence. Then friends brought friends, neighbors told neighbors, and before long, the Walkers had more requests than their little porch could handle.
            </p>
            <p>
              One evening, Herb looked at the growing pile of orders, turned to his family, and said, "Well… I think we're going to need a bigger porch."
            </p>
            <p>
              With a little savings, a whole lot of hard work, and his family by his side, Herb opened the first Astro Pop Soda Co. shop. It was a modest little storefront with a striped awning, shelves of freshly bottled pop, and a door that was always open to the neighborhood.
            </p>
            <p class="astropop-first-shop__closing-line">It wasn't fancy. It wasn't big. But it was theirs.</p>
          </div>

          <figure class="astropop-first-shop__photo-frame">
            <img
              class="astropop-first-shop__photo"
              src="/images/astro-pop/our-story/A%20Family%20Day%20at%20Astro%20Pop%20Soda%20Co.png"
              alt="The Walker family standing outside the first Astro Pop Soda Co. storefront beneath its striped awning and hand-painted sign"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section class="astropop-neighborhood" aria-labelledby="astropop-neighborhood-title">
        <div class="astropop-neighborhood__introduction">
          <p class="astropop-neighborhood__eyebrow">Today <span aria-hidden="true">•</span> The Astro Pop Promise</p>
          <h2 id="astropop-neighborhood-title">A Bigger Neighborhood. The Same Promise.</h2>
          <p>
            What began on one little back porch has grown into more than 250 Astro Pop locations, with bottles making their way to family tables and front porches all across America.
          </p>
          <p>
            But no matter how much we've grown, we haven't forgotten what got us here: good soda, good people, and a recipe worth sharing. Herb's original spirit still lives on in every bottle we make and every customer we serve.
          </p>
          <p>
            So grab a Pop, pull up a chair, and enjoy it with your family and friends. Some things are simply better when shared.
          </p>
        </div>

        <figure class="astropop-neighborhood__photo-wrap">
          <img
            class="astropop-neighborhood__photo"
            src="/images/astro-pop/our-story/Astro%20Pop%20Neighborhood%20Block%20Party.png"
            alt="Families sharing Astro Pop at porches and a picnic table during a neighborhood celebration, with an Astro Pop delivery van on the street"
            loading="lazy"
          />
        </figure>

        <div class="astropop-neighborhood__closing">
          <p>Made for good times, since 1957.</p>
          <NuxtLink to="/astro-pop/#astropop-flavors-title">Explore Our Flavors</NuxtLink>
        </div>
      </section>
    </main>
    <AstroPopFooter />
  </div>
</template>

<style scoped>
.astropop-our-story-page {
  min-height: 100vh;
  min-height: 100svh;
  overflow-x: clip;
  background: var(--astropop-cream, #fff8e5);
  color: var(--astropop-ink, #3a2c35);
}

.astropop-our-story-hero {
  position: relative;
  isolation: isolate;
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  padding: clamp(5.5rem, 11vh, 8.25rem) clamp(1rem, 5vw, 4.5rem) clamp(2.5rem, 7vh, 5.5rem);
}

.astropop-our-story-hero__image,
.astropop-our-story-hero__wash {
  position: absolute;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
}

.astropop-our-story-hero__image {
  object-fit: cover;
  object-position: 61% center;
}

.astropop-our-story-hero__wash {
  z-index: -1;
  background: linear-gradient(90deg, rgba(48, 29, 27, 0.72) 0%, rgba(61, 36, 29, 0.48) 29%, rgba(61, 36, 29, 0.08) 58%, transparent 76%);
}

.astropop-our-story-hero__back-link {
  position: absolute;
  top: 1.25rem;
  left: clamp(1rem, 5vw, 4.5rem);
  z-index: 1;
  color: #fff8e5;
  font-family: var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.astropop-our-story-hero__back-link:hover,
.astropop-our-story-hero__back-link:focus-visible {
  color: #fff8e5;
  text-decoration: underline;
}

.astropop-our-story-hero__back-link:focus-visible {
  outline: 3px solid #fff8e5;
  outline-offset: 4px;
}

.astropop-our-story-hero__nav {
  z-index: 1;
  width: min(100%, 72rem);
  justify-self: center;
}

.astropop-our-story-hero__content {
  align-self: center;
  max-width: 35rem;
  margin-top: clamp(3rem, 10vh, 7rem);
  color: #fff8e5;
  text-shadow: 0 0.12rem 0.7rem rgba(38, 22, 20, 0.55);
}

.astropop-our-story-hero__eyebrow {
  margin: 0 0 1rem;
  font-family: var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}

.astropop-our-story-hero h1 {
  max-width: 10ch;
  margin: 0;
  font-family: var(--astropop-display-font, "Fraunces", Georgia, serif);
  font-size: clamp(3.5rem, 7vw, 7rem);
  font-weight: 900;
  letter-spacing: -0.055em;
  line-height: 0.92;
  text-wrap: balance;
}

.astropop-our-story-hero__description {
  max-width: 31rem;
  margin: clamp(1.25rem, 3vh, 2rem) 0 0;
  font-family: var(--astropop-body-font, "Barlow", Arial, sans-serif);
  font-size: clamp(1.05rem, 1.8vw, 1.3rem);
  font-weight: 600;
  line-height: 1.55;
  text-wrap: pretty;
}

.astropop-porch-years {
  position: relative;
  isolation: isolate;
  overflow: clip;
  background: #f5e7ca;
  color: var(--astropop-ink, #3a2c35);
}

.astropop-porch-years__inner {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(100%, 78rem);
  align-items: center;
  gap: clamp(2.5rem, 7vw, 7rem);
  margin-inline: auto;
  padding: clamp(4rem, 9vw, 8rem) clamp(1rem, 5vw, 4.5rem);
}


.astropop-porch-years__cap {
  inset: auto;
  z-index: 0;
  width: clamp(5.5rem, 10vw, 9rem);
  opacity: 0.32;
}

.astropop-porch-years__cap--upper-left {
  top: clamp(1.5rem, 5vw, 4rem);
  left: clamp(0.75rem, 3vw, 3rem);
  transform: rotate(-18deg);
}

.astropop-porch-years__cap--lower-left {
  bottom: clamp(1.5rem, 5vw, 4rem);
  left: clamp(1rem, 5vw, 5rem);
  width: clamp(3.75rem, 6vw, 5.75rem);
  opacity: 0.27;
  transform: rotate(23deg);
}

.astropop-porch-years__cap--lower-right {
  right: clamp(1rem, 4vw, 4rem);
  bottom: clamp(2rem, 7vw, 6rem);
  transform: rotate(-11deg);
}

.astropop-porch-years__image-wrap {
  display: flex;
  justify-content: center;
}

.astropop-porch-years__image {
  display: block;
  width: min(100%, 38rem);
  height: auto;
  object-fit: contain;
}

.astropop-porch-years__content {
  max-width: 36rem;
}

.astropop-porch-years__eyebrow {
  margin: 0 0 0.85rem;
  color: var(--astropop-red, #a83f2e);
  font-family: var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}

.astropop-porch-years h2 {
  margin: 0;
  font-family: var(--astropop-display-font, "Fraunces", Georgia, serif);
  font-size: clamp(2.8rem, 5vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.95;
  text-wrap: balance;
}

.astropop-porch-years__content > p:not(.astropop-porch-years__eyebrow) {
  margin: 1.25rem 0 0;
  font-family: var(--astropop-body-font, "Barlow", Arial, sans-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.65;
}

.astropop-porch-years__quote {
  margin: clamp(2rem, 5vw, 3.25rem) 0 0;
  border-left: 3px solid var(--astropop-red, #a83f2e);
  padding-left: clamp(1rem, 3vw, 1.75rem);
}

.astropop-porch-years__quote blockquote {
  margin: 0;
  font-family: var(--astropop-display-font, "Fraunces", Georgia, serif);
  font-size: clamp(1.2rem, 2.1vw, 1.55rem);
  font-style: italic;
  font-weight: 700;
  line-height: 1.4;
}

.astropop-porch-years__quote figcaption {
  margin-top: 0.75rem;
  color: var(--astropop-red, #a83f2e);
  font-family: var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.astropop-first-shop {
  background:
    radial-gradient(circle at 88% 15%, rgba(230, 196, 134, 0.16), transparent 24rem),
    #49262e;
  color: var(--astropop-cream, #fff8e5);
}

.astropop-first-shop__inner {
  display: grid;
  width: min(100%, 78rem);
  align-items: center;
  gap: clamp(2.5rem, 7vw, 7rem);
  margin-inline: auto;
  padding: clamp(4rem, 9vw, 8rem) clamp(1rem, 5vw, 4.5rem);
}

.astropop-first-shop__content {
  max-width: 36rem;
}

.astropop-first-shop__eyebrow {
  margin: 0 0 0.85rem;
  color: var(--astropop-gold, #e6c486);
  font-family: var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}

.astropop-first-shop h2 {
  margin: 0;
  font-family: var(--astropop-display-font, "Fraunces", Georgia, serif);
  font-size: clamp(2.8rem, 5vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.95;
  text-wrap: balance;
}

.astropop-first-shop__content > p:not(.astropop-first-shop__eyebrow) {
  margin: 1.25rem 0 0;
  font-family: var(--astropop-body-font, "Barlow", Arial, sans-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.65;
}

.astropop-first-shop__closing-line {
  color: var(--astropop-gold, #e6c486);
  font-family: var(--astropop-display-font, "Fraunces", Georgia, serif) !important;
  font-size: clamp(1.2rem, 2vw, 1.55rem) !important;
  font-style: italic;
  font-weight: 700;
}

.astropop-first-shop__photo-frame {
  margin: 0;
  border: 0.6rem solid #fff4da;
  box-shadow: 0.7rem 0.8rem 0 rgba(230, 196, 134, 0.42);
}

.astropop-first-shop__photo {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.astropop-neighborhood {
  background: var(--astropop-cream, #fff8e5);
  color: var(--astropop-ink, #3a2c35);
  text-align: center;
}

.astropop-neighborhood__introduction {
  width: min(100%, 51rem);
  margin-inline: auto;
  padding: clamp(4rem, 9vw, 8rem) clamp(1rem, 5vw, 4.5rem) clamp(3rem, 7vw, 6rem);
}

.astropop-neighborhood__eyebrow {
  margin: 0 0 0.85rem;
  color: var(--astropop-red, #a83f2e);
  font-family: var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}

.astropop-neighborhood h2 {
  max-width: 16ch;
  margin: 0 auto;
  font-family: var(--astropop-display-font, "Fraunces", Georgia, serif);
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 900;
  letter-spacing: -0.055em;
  line-height: 0.92;
  text-wrap: balance;
}

.astropop-neighborhood__introduction > p:not(.astropop-neighborhood__eyebrow) {
  max-width: 43rem;
  margin: 1.35rem auto 0;
  font-family: var(--astropop-body-font, "Barlow", Arial, sans-serif);
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  line-height: 1.65;
}

.astropop-neighborhood__photo-wrap {
  width: 100%;
  margin: 0;
  border-block: 0.45rem solid var(--astropop-red, #a83f2e);
}

.astropop-neighborhood__photo {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.astropop-neighborhood__closing {
  display: grid;
  justify-items: center;
  gap: 1.5rem;
  padding: clamp(3.5rem, 8vw, 6rem) clamp(1rem, 5vw, 4.5rem);
}

.astropop-neighborhood__closing p {
  margin: 0;
  color: var(--astropop-red, #a83f2e);
  font-family: var(--astropop-display-font, "Fraunces", Georgia, serif);
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-style: italic;
  font-weight: 700;
  line-height: 1.15;
}

.astropop-neighborhood__closing a {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--astropop-ink, #3a2c35);
  border-radius: 999px;
  padding: 0.7rem 1.25rem;
  background: var(--astropop-red, #a83f2e);
  box-shadow: 0.18rem 0.2rem 0 var(--astropop-ink, #3a2c35);
  color: var(--astropop-cream, #fff8e5);
  font-family: var(--astropop-label-font, "Barlow Condensed", Arial, sans-serif);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.astropop-neighborhood__closing a:hover,
.astropop-neighborhood__closing a:focus-visible {
  background: var(--astropop-teal, #167c89);
}

.astropop-neighborhood__closing a:focus-visible {
  outline: 3px solid var(--astropop-teal, #167c89);
  outline-offset: 4px;
}

@media (min-width: 760px) {
  .astropop-porch-years__inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .astropop-first-shop__inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

@media (max-width: 700px) {
  .astropop-our-story-hero {
    display: flex;
    min-height: 0;
    flex-direction: column;
    gap: 1.25rem;
    padding: 5rem 1rem 2.25rem;
    background: #49262e;
  }

  .astropop-our-story-hero__image {
    position: relative;
    z-index: 0;
    inset: auto;
    order: 0;
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
  }

  .astropop-our-story-hero__wash {
    display: none;
  }

  .astropop-our-story-hero__back-link {
    top: 1rem;
    left: 1rem;
  }

  .astropop-our-story-hero__content {
    z-index: 0;
    order: 1;
    margin-top: 0;
    text-shadow: none;
  }

  .astropop-our-story-hero__nav {
    position: relative;
    z-index: 1;
    order: -1;
  }

  .astropop-our-story-hero h1 {
    max-width: 8ch;
  }

  .astropop-porch-years__content {
    max-width: none;
  }

  .astropop-first-shop__content {
    max-width: none;
  }

  .astropop-porch-years__cap {
    display: none;
  }
}
</style>
