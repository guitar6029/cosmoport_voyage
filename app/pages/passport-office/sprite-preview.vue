<script setup lang="ts">
import { ref } from "vue";

const STELLA_SPRITE_URL = "https://media.cosmos-universe.com/passport-office/stella/v0/stella-blink.webp";
const useCreamBackground = ref(true);
const imageFailed = ref(false);

function toggleBackground() {
  useCreamBackground.value = !useCreamBackground.value;
}
</script>

<template>
  <main
    class="sprite-preview"
    :class="{ 'sprite-preview--cream': useCreamBackground, 'sprite-preview--dark': !useCreamBackground }"
  >
    <div class="sprite-preview__content">
      <p class="sprite-preview__eyebrow">Passport Office</p>
      <h1>Stella sprite preview</h1>
      <p class="sprite-preview__intro">Her animated WebP should blink automatically when CDN delivery is available.</p>

      <button
        class="sprite-preview__toggle"
        type="button"
        :aria-pressed="!useCreamBackground"
        @click="toggleBackground"
      >
        Use {{ useCreamBackground ? "dark" : "cream" }} background
      </button>

      <div class="sprite-preview__stage" aria-live="polite">
        <img
          v-if="!imageFailed"
          class="sprite-preview__image"
          :src="STELLA_SPRITE_URL"
          alt="Stella, the Passport Office attendant, blinking"
          @error="imageFailed = true"
        >
        <p v-else class="sprite-preview__error" role="alert">
          Stella could not be loaded right now. Please try again when media delivery is available.
        </p>
      </div>

      <NuxtLink class="sprite-preview__back-link" to="/">Back to the Universe</NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.sprite-preview {
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  padding: clamp(1.25rem, 4vw, 3rem);
  transition: background-color 160ms ease, color 160ms ease;
}

.sprite-preview--cream { background: #f3e4c7; color: #183d4a; }
.sprite-preview--dark { background: #142b35; color: #fff8e8; }

.sprite-preview__content {
  width: min(100%, 44rem);
  align-self: center;
  justify-self: center;
  text-align: center;
}

.sprite-preview__eyebrow {
  margin: 0 0 0.75rem;
  color: #b44d32;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

h1 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2.5rem, 8vw, 5rem); line-height: 1; }
.sprite-preview__intro { max-width: 35rem; margin: 1rem auto 1.5rem; line-height: 1.5; }

.sprite-preview__toggle,
.sprite-preview__back-link {
  border: 2px solid currentColor;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  color: inherit;
  font: inherit;
  font-weight: 800;
}

.sprite-preview__toggle { cursor: pointer; background: transparent; }
.sprite-preview__toggle:hover,
.sprite-preview__toggle:focus-visible,
.sprite-preview__back-link:hover,
.sprite-preview__back-link:focus-visible { background: currentColor; color: #fff8e8; }
.sprite-preview--dark .sprite-preview__toggle:hover,
.sprite-preview--dark .sprite-preview__toggle:focus-visible,
.sprite-preview--dark .sprite-preview__back-link:hover,
.sprite-preview--dark .sprite-preview__back-link:focus-visible { color: #142b35; }
.sprite-preview__toggle:focus-visible,
.sprite-preview__back-link:focus-visible { outline: 3px solid #b44d32; outline-offset: 4px; }

.sprite-preview__stage { display: grid; min-height: 8rem; place-items: center; margin: clamp(1.5rem, 5vw, 3rem) 0; }
.sprite-preview__image { display: block; max-width: 100%; height: auto; }
.sprite-preview__error { max-width: 30rem; margin: 0; border: 2px solid #b44d32; border-radius: 0.75rem; padding: 1rem; font-weight: 700; }
.sprite-preview__back-link { display: inline-block; text-decoration: none; transition: background-color 160ms ease, color 160ms ease; }

@media (prefers-reduced-motion: reduce) {
  .sprite-preview,
  .sprite-preview__back-link { transition: none; }
}
</style>
