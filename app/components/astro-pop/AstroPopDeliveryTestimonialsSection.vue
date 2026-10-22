<script setup lang="ts">
const testimonials = [
  {
    name: "Dorothy Miller",
    role: "Mother of Three",
    portrait: "/images/astro-pop/testimonials/AstroPop%20Soda%20Housewife%20Portrait.png",
    portraitAlt: "Dorothy Miller holding a bottle of AstroPop soda",
    quote:
      "Three hungry youngsters, a busy household, and somehow Bobby Bubbles always arrives right on time!",
  },
  {
    name: "Walter Peterson",
    role: "Weekend Golfer",
    portrait: "/images/astro-pop/testimonials/Retro%20AstroPop%20Golf%20Advertisement.png",
    portraitAlt: "Walter Peterson holding an AstroPop bottle with a golf club over his shoulder",
    quote:
      "Eighteen holes on the course, twelve bottles on the porch. Now that's what I call a perfect Sunday!",
  },
  {
    name: "Grandpa Henry",
    role: "Proud AstroPop Customer",
    portrait: "/images/astro-pop/testimonials/Grandpa%E2%80%99s%20AstroPop%20Soda%20Endorsement.png",
    portraitAlt: "Grandpa Henry pointing to his bottle of AstroPop soda",
    quote:
      "In my day, the milkman brought milk. Now a fellow brings fizzy drinks from the future. What a marvelous century!",
  },
];
</script>

<template>
  <section
    id="astropop-delivery-testimonials"
    class="astropop-testimonials"
    aria-labelledby="astropop-testimonials-title"
  >
    <header class="astropop-testimonials__header">
      <p class="astropop-testimonials__eyebrow">GOOD NEWS TRAVELS FAST!</p>
      <h2 id="astropop-testimonials-title">The Neighborhood Is Talking!</h2>
      <p class="astropop-testimonials__subtitle">Everybody's buzzing about AstroPop!</p>
    </header>

    <div class="astropop-testimonials__clippings">
      <figure
        v-for="testimonial in testimonials"
        :key="testimonial.name"
        class="astropop-testimonial"
      >
        <div class="astropop-testimonial__portrait">
          <img
            :src="testimonial.portrait"
            :alt="testimonial.portraitAlt"
            loading="lazy"
            decoding="async"
          />
        </div>
        <blockquote>
          <p>“{{ testimonial.quote }}”</p>
        </blockquote>
        <figcaption>
          <span class="astropop-testimonial__name">{{ testimonial.name }}</span>
          <span class="astropop-testimonial__role">{{ testimonial.role }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.astropop-testimonials {
  width: min(100% - 2rem, 80rem);
  min-width: 0;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2vw, 2rem) clamp(4rem, 8vw, 7rem);
  color: #5e2730;
}

.astropop-testimonials__header {
  text-align: center;
}

.astropop-testimonials__eyebrow {
  margin: 0 0 0.85rem;
  color: #a83f2e;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1.4;
}

.astropop-testimonials h2 {
  margin: 0;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(2.1rem, 4.5vw, 3.75rem);
  font-weight: 900;
  line-height: 1.05;
  text-wrap: balance;
}

.astropop-testimonials__subtitle {
  margin: 1.1rem 0 0;
  color: #167c89;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-style: italic;
  font-weight: 700;
  line-height: 1.4;
}

.astropop-testimonials__clippings {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-top: clamp(2rem, 4vw, 3rem);
}

.astropop-testimonial {
  display: flex;
  min-width: 0;
  flex-direction: column;
  margin: 0;
  border: 1px solid #5e2730;
  border-top: 5px double #5e2730;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  background: #fff4da;
  box-shadow: 0.2rem 0.25rem 0 rgba(94, 39, 48, 0.18);
}

.astropop-testimonial__portrait {
  display: flex;
  height: clamp(15rem, 23vw, 19rem);
  align-items: flex-end;
  justify-content: center;
  margin: 0 0 1.25rem;
}

.astropop-testimonial__portrait img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  object-fit: contain;
  object-position: center bottom;
}

.astropop-testimonial blockquote {
  flex: 1;
  margin: 0 0 1.75rem;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(1.15rem, 1.6vw, 1.35rem);
  font-weight: 500;
  line-height: 1.5;
}

.astropop-testimonial blockquote p {
  margin: 0;
}

.astropop-testimonial figcaption {
  border-top: 1px solid rgba(168, 63, 46, 0.45);
  padding-top: 1rem;
}

.astropop-testimonial__name {
  display: block;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1.3;
}

.astropop-testimonial__role {
  display: block;
  margin-top: 0.35rem;
  color: #167c89;
  font-family: "Barlow Condensed", Arial, sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  line-height: 1.4;
  text-transform: uppercase;
}

@media (max-width: 959px) {
  .astropop-testimonials__clippings {
    grid-template-columns: 1fr;
    max-width: 34rem;
    margin-inline: auto;
  }

  .astropop-testimonial__portrait {
    height: clamp(13rem, 62vw, 20rem);
  }
}
</style>
