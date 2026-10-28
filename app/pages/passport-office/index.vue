<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { dialogueFor, openingDialogueStep, type PassportOfficeChoice } from "../../data/passportOfficeDialogue";
import { PASSPORT_OFFICE_MEDIA } from "../../data/passportOfficeMedia";

type DialogueStep = "opening" | PassportOfficeChoice;

const step = ref<DialogueStep>(openingDialogueStep());
const reducedMotion = ref(false);
const isRegistering = ref(false);
const registrationComplete = ref(false);
const imageFailure = ref<"none" | "primary" | "fallback">("none");
const backgroundFailed = ref(false);
let motionQuery: MediaQueryList | undefined;
const updateMotionPreference = () => { reducedMotion.value = motionQuery?.matches ?? false; };

const dialogue = computed(() => registrationComplete.value ? { stella: "happy" as const, lines: ["Splendid! Your CosmoPort account is ready for takeoff.", "Passport issuance will open in a future story."], choices: undefined } : dialogueFor(step.value));
const stellaSource = computed(() => {
  // The happy portrait is an intentionally static asset for reduced-motion visitors.
  if (reducedMotion.value) return PASSPORT_OFFICE_MEDIA.stella.happy;
  if (imageFailure.value === "primary") return PASSPORT_OFFICE_MEDIA.stella.fallback;
  return PASSPORT_OFFICE_MEDIA.stella[isRegistering.value ? "talking" : dialogue.value.stella];
});
const stellaAlt = computed(() => `Stella Starling, the Passport Office attendant, ${dialogue.value.stella}`);

function choose(choice: PassportOfficeChoice) { if (choice === "apply") isRegistering.value = true; else step.value = choice; }
function restart() { step.value = openingDialogueStep(); registrationComplete.value = false; }
function cancelRegistration() { isRegistering.value = false; }
function completeRegistration() { isRegistering.value = false; registrationComplete.value = true; }
function handleImageError() {
  imageFailure.value = !reducedMotion.value && imageFailure.value === "none" ? "primary" : "fallback";
}

onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  updateMotionPreference();
  motionQuery.addEventListener("change", updateMotionPreference);
});
onBeforeUnmount(() => motionQuery?.removeEventListener("change", updateMotionPreference));
</script>

<template>
  <main class="passport-office" :class="{ 'passport-office--background-fallback': backgroundFailed }">
    <img
      v-if="!backgroundFailed"
      class="passport-office__background"
      :src="PASSPORT_OFFICE_MEDIA.background"
      alt=""
      aria-hidden="true"
      @error="backgroundFailed = true"
    >
    <div v-else class="passport-office__background-fallback" aria-hidden="true" />
    <div class="passport-office__wash" aria-hidden="true" />

    <NuxtLink class="passport-office__exit" to="/">Exit Office</NuxtLink>

    <section class="passport-office__dialogue" aria-labelledby="passport-office-title">
      <p class="passport-office__eyebrow">CosmoPort Passport Bureau</p>
      <h1 id="passport-office-title">Stella Starling</h1>
      <div class="passport-office__message" role="status" aria-live="polite" aria-atomic="true">
        <p v-for="line in dialogue.lines" :key="line">{{ line }}</p>
      </div>
      <PassportOfficeRegistration v-if="isRegistering" @cancel="cancelRegistration" @complete="completeRegistration" />
      <div v-else-if="dialogue.choices" class="passport-office__choices" aria-label="Choose a response">
        <button v-for="choice in dialogue.choices" :key="choice.id" type="button" @click="choose(choice.id)">
          {{ choice.label }}
        </button>
      </div>
      <div v-else class="passport-office__actions">
        <button type="button" @click="restart">Start over</button>
        <NuxtLink to="/">Leave the office</NuxtLink>
      </div>
    </section>

    <aside class="passport-office__stella" aria-label="Stella Starling">
      <img
        v-if="imageFailure !== 'fallback'"
        :key="stellaSource"
        :src="stellaSource"
        :alt="stellaAlt"
        @error="handleImageError"
      >
      <div v-else class="passport-office__stella-fallback" role="img" aria-label="Stella is temporarily unavailable">
        <span>✦</span><strong>Stella will be right back.</strong>
      </div>
    </aside>
  </main>
</template>

<style scoped>
.passport-office { isolation: isolate; position: relative; display: grid; grid-template-columns: minmax(18rem, 31rem) minmax(14rem, 1fr); min-height: 100vh; min-height: 100svh; overflow: hidden; align-items: end; padding: clamp(1rem, 3vw, 2.75rem); color: #173c47; }
.passport-office__background, .passport-office__background-fallback, .passport-office__wash { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; }
.passport-office__background { object-fit: cover; object-position: center; }
.passport-office__background-fallback { background: radial-gradient(circle at 72% 30%, #78c5bf 0 9%, transparent 9.5%), linear-gradient(135deg, #244c59 0 45%, #173c47 45% 100%); }
.passport-office__wash { z-index: -1; background: linear-gradient(90deg, rgb(255 247 226 / 0.34), transparent 68%); }
.passport-office__exit { position: absolute; top: clamp(1rem, 3vw, 2rem); right: clamp(1rem, 3vw, 2rem); border: 2px solid #173c47; border-radius: 999px; padding: .56rem .86rem; background: rgb(255 247 226 / .93); color: inherit; font-size: .86rem; font-weight: 800; text-decoration: none; }
.passport-office__dialogue { align-self: end; width: min(100%, 31rem); border: 3px solid #173c47; border-radius: 1.1rem; padding: clamp(1.1rem, 2.6vw, 1.75rem); background: #fff3d7; box-shadow: .45rem .45rem 0 #d9654d; }
.passport-office__eyebrow { margin: 0 0 .45rem; color: #b8493a; font-size: .72rem; font-weight: 900; letter-spacing: .17em; text-transform: uppercase; }
h1 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2rem, 5vw, 3.75rem); line-height: .95; }
.passport-office__message { margin: 1rem 0 1.15rem; font-size: clamp(1rem, 1.4vw, 1.15rem); line-height: 1.5; }
.passport-office__message p { margin: 0; }.passport-office__message p + p { margin-top: .75rem; }
.passport-office__choices, .passport-office__actions { display: grid; gap: .65rem; }
.passport-office button, .passport-office__actions a { border: 2px solid #173c47; border-radius: .65rem; padding: .72rem .85rem; background: #78c5bf; color: #173c47; font: inherit; font-weight: 800; line-height: 1.2; text-align: left; cursor: pointer; text-decoration: none; }
.passport-office button:hover, .passport-office__actions a:hover { background: #ee8e71; }
.passport-office button:focus-visible, .passport-office a:focus-visible { outline: 3px solid #b8493a; outline-offset: 3px; }
.passport-office__stella { display: grid; align-self: stretch; align-items: end; justify-items: center; min-width: 0; pointer-events: none; }
.passport-office__stella img { display: block; width: min(100%, 39rem); max-height: min(86svh, 50rem); object-fit: contain; object-position: bottom center; }
.passport-office__stella-fallback { display: grid; gap: .5rem; width: min(100%, 22rem); place-items: center; margin-bottom: 1.5rem; border: 3px dashed #173c47; border-radius: 50%; aspect-ratio: 1; padding: 1rem; background: #f4ca6e; text-align: center; }.passport-office__stella-fallback span { font-size: 4rem; }
@media (max-width: 44rem) { .passport-office { grid-template-columns: 1fr; grid-template-rows: minmax(13rem, 42svh) auto; align-items: stretch; overflow: auto; padding: 4.5rem 1rem 1rem; }.passport-office__background { object-position: 62% center; }.passport-office__wash { background: linear-gradient(180deg, transparent 35%, rgb(255 247 226 / .48)); }.passport-office__stella { grid-row: 1; max-height: 42svh; }.passport-office__stella img { max-height: 40svh; width: min(100%, 24rem); }.passport-office__dialogue { grid-row: 2; width: auto; }.passport-office__exit { z-index: 1; } }
@media (prefers-reduced-motion: reduce) { .passport-office * { scroll-behavior: auto; } }
</style>
