<script setup lang="ts">
import { ref } from "vue";
import AstroPopAnimatedTestimonialAvatar from "./AstroPopAnimatedTestimonialAvatar.vue";

type AnimatedAvatar = InstanceType<typeof AstroPopAnimatedTestimonialAvatar>;

const animatedAvatars = ref<Record<string, AnimatedAvatar | undefined>>({});

const replayTestimonialAvatar = (name: string) => {
  animatedAvatars.value[name]?.replayOnHover();
};

const setTestimonialAvatar = (name: string, avatar: AnimatedAvatar | null) => {
  if (avatar) {
    animatedAvatars.value[name] = avatar;
  } else {
    delete animatedAvatars.value[name];
  }
};

const testimonials = [
  {
    name: "Dorothy Miller",
    role: "Mother of Three",
    portrait: "/images/astro-pop/testimonials/dorothy-miller/Dorothy_Miller.jpg",
    portraitVideo: "/images/astro-pop/testimonials/dorothy-miller/Dorothy_Miller.mp4",
    portraitAlt: "Dorothy Miller holding a bottle of AstroPop soda",
    quote:
      "Three hungry youngsters, a busy household, and somehow Bobby Bubbles always arrives right on time!",
  },
  {
    name: "Walter Peterson",
    role: "Weekend Golfer",
    portrait: "/images/astro-pop/testimonials/walter-peterson/Walter_Peterson.jpg",
    portraitVideo: "/images/astro-pop/testimonials/walter-peterson/Walter_Peterson.mp4",
    portraitAlt: "Walter Peterson holding an AstroPop bottle with a golf club over his shoulder",
    quote:
      "Eighteen holes on the course, twelve bottles on the porch. Now that's what I call a perfect Sunday!",
  },
  {
    name: "Grandpa Henry",
    role: "Proud AstroPop Customer",
    portrait: "/images/astro-pop/testimonials/grandpa-henry/Grandpa_Henry.jpg",
    portraitVideo: "/images/astro-pop/testimonials/grandpa-henry/Grandpa_Henry.mp4",
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
    <img
      class="astropop-testimonials__sign"
      src="/images/astro-pop/testimonials/TheNeighborhoodIsTalkingSign.png"
      alt=""
      aria-hidden="true"
    />
    <div class="astropop-testimonials__content">
      <header class="astropop-testimonials__header">
        <h2 id="astropop-testimonials-title" class="astropop-testimonials__title">The Neighborhood Is Talking!</h2>
        <p class="astropop-eyebrow astropop-testimonials__eyebrow">GOOD NEWS TRAVELS FAST!</p>
        <p class="astropop-testimonials__subtitle">Everybody's buzzing about AstroPop!</p>
      </header>

      <div class="astropop-testimonials__clippings">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="astropop-testimonial"
          @pointerenter="replayTestimonialAvatar(testimonial.name)"
        >
          <div class="astropop-testimonial__portrait">
            <AstroPopAnimatedTestimonialAvatar
              v-if="testimonial.portraitVideo"
              :ref="(avatar) => setTestimonialAvatar(testimonial.name, avatar as AnimatedAvatar | null)"
              :image-src="testimonial.portrait"
              :image-alt="testimonial.portraitAlt"
              :video-src="testimonial.portraitVideo"
              :replay-label="`Replay ${testimonial.name}'s animation`"
            />
            <img
              v-else
              :src="testimonial.portrait"
              :alt="testimonial.portraitAlt"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figure class="astropop-testimonial__message">
            <blockquote>
              <p>“{{ testimonial.quote }}”</p>
            </blockquote>
            <figcaption>
              <span class="astropop-testimonial__name">{{ testimonial.name }}</span>
              <span class="astropop-testimonial__role">{{ testimonial.role }}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.astropop-testimonials {
  position: relative;
  isolation: isolate;
  width: 100%;
  min-width: 0;
  margin: 0;
  color: #5e2730;
  overflow: visible;
  background-image:
    linear-gradient(180deg, rgba(255, 244, 214, 0.18), rgba(255, 244, 214, 0.08)),
    url("/images/astro-pop/testimonials/RetroFuturisticSuburbanUtopia.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 0 0 3rem 3rem;
}

.astropop-testimonials__sign {
  position: absolute;
  z-index: 1;
  top: clamp(-6rem, -8vw, -4rem);
  left: max(0.5rem, calc((100% - 80rem) / 2));
  display: block;
  width: clamp(18rem, 40vw, 31rem);
  height: auto;
  pointer-events: none;
}

.astropop-testimonials__content {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  width: min(100% - 2rem, 80rem);
  min-width: 0;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2vw, 2rem) clamp(4rem, 8vw, 7rem);
}

.astropop-testimonials__header {
  padding-top: clamp(8.25rem, 15vw, 12rem);
  text-align: center;
}

.astropop-testimonials__eyebrow {
  margin: 0 0 0.85rem;
  color: #a83f2e;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  line-height: 1.4;
}

.astropop-testimonials__title {
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
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.75rem);
  margin-top: clamp(2rem, 4vw, 3rem);
}

.astropop-testimonial {
  display: grid;
  min-width: 0;
  width: min(100%, 49rem);
  grid-template-columns: clamp(7rem, 15vw, 10.5rem) minmax(0, 1fr);
  gap: clamp(0.8rem, 2vw, 1.5rem);
  align-items: center;
  margin: 0;
}

.astropop-testimonial:nth-child(2) {
  align-self: flex-end;
  grid-template-columns: minmax(0, 1fr) clamp(7rem, 15vw, 10.5rem);
}

.astropop-testimonial:nth-child(2) .astropop-testimonial__portrait {
  order: 2;
}

.astropop-testimonial__portrait {
  display: flex;
  aspect-ratio: 1;
  justify-content: center;
  overflow: hidden;
  border: clamp(0.3rem, 0.8vw, 0.5rem) solid #f7c656;
  border-radius: 50%;
  background: #1b7987;
  box-shadow: 0.25rem 0.3rem 0 #5e2730, inset 0 0 0 0.18rem #fff4da;
}

.astropop-testimonial__portrait img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.astropop-testimonial__message {
  position: relative;
  min-width: 0;
  padding: clamp(1.15rem, 2.5vw, 1.75rem);
  margin: 0;
  background: #fff4da;
  border: 2px solid #5e2730;
  border-radius: 1.5rem;
  box-shadow: 0.28rem 0.32rem 0 rgba(94, 39, 48, 0.22);
}

.astropop-testimonial__message::before,
.astropop-testimonial__message::after {
  position: absolute;
  top: 50%;
  width: 1.25rem;
  height: 1.25rem;
  content: "";
  background: #fff4da;
  transform: translateY(-50%) rotate(45deg);
}

.astropop-testimonial__message::before {
  left: -0.72rem;
  border-bottom: 2px solid #5e2730;
  border-left: 2px solid #5e2730;
}

.astropop-testimonial__message::after {
  z-index: 1;
  left: -0.55rem;
  width: 1.05rem;
  height: 1.05rem;
}

.astropop-testimonial:nth-child(2) .astropop-testimonial__message::before {
  right: -0.72rem;
  left: auto;
  border-top: 2px solid #5e2730;
  border-right: 2px solid #5e2730;
  border-bottom: 0;
  border-left: 0;
}

.astropop-testimonial:nth-child(2) .astropop-testimonial__message::after {
  right: -0.55rem;
  left: auto;
}

.astropop-testimonial blockquote {
  margin: 0;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  font-weight: 500;
  line-height: 1.5;
}

.astropop-testimonial blockquote p {
  margin: 0;
}

.astropop-testimonial figcaption {
  border-top: 1px solid rgba(168, 63, 46, 0.45);
  padding-top: 0.85rem;
  margin-top: 1rem;
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

@media (max-width: 639px) {
  .astropop-testimonials__content {
    width: 100%;
    padding-inline: 1rem;
  }

  .astropop-testimonials {
    border-radius: 0 0 2rem 2rem;
  }

  .astropop-testimonials__sign {
    top: -2.75rem;
    left: 0.5rem;
    width: clamp(18rem, 82vw, 22rem);
  }

  .astropop-testimonials__header {
    padding-top: 9rem;
  }

  .astropop-testimonials__clippings {
    gap: 1.5rem;
  }

  .astropop-testimonial,
  .astropop-testimonial:nth-child(2) {
    width: 100%;
    grid-template-columns: 5.6rem minmax(0, 1fr);
    gap: 0.8rem;
    align-self: auto;
  }

  .astropop-testimonial:nth-child(2) .astropop-testimonial__portrait {
    order: 0;
  }

  .astropop-testimonial:nth-child(2) .astropop-testimonial__message::before {
    right: auto;
    left: -0.72rem;
    border-top: 0;
    border-right: 0;
    border-bottom: 2px solid #5e2730;
    border-left: 2px solid #5e2730;
  }

  .astropop-testimonial:nth-child(2) .astropop-testimonial__message::after {
    right: auto;
    left: -0.55rem;
  }

  .astropop-testimonial__message {
    padding: 1rem;
    border-radius: 1.15rem;
  }

  .astropop-testimonial blockquote {
    font-size: 1rem;
  }
}
</style>
