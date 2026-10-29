<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import PassportOfficeLogin from "../../components/passport-office/PassportOfficeLogin.vue";
import PassportOfficeRegistration from "../../components/passport-office/PassportOfficeRegistration.vue";
import { dialogueFor, openingDialogueStep, type PassportOfficeChoice } from "../../data/passportOfficeDialogue";
import { PASSPORT_OFFICE_MEDIA } from "../../data/passportOfficeMedia";

type DialogueStep = "opening" | PassportOfficeChoice;

const step = ref<DialogueStep>(openingDialogueStep());
const isRegistering = ref(false);
const isReturning = ref(false);
const registrationComplete = ref(false);
// The opening choices are server-rendered. Keep them inert until Vue has
// hydrated so an early click cannot be lost before its event listeners exist.
const clientReady = ref(false);
const { isLoaded: isClerkLoaded, isSignedIn } = useAuth();
const backgroundFailed = ref(false);
const choicesReady = computed(() => clientReady.value && isClerkLoaded.value);

const dialogue = computed(() => registrationComplete.value ? { lines: ["Splendid! Your CosmoPort account is ready for takeoff.", "Stella has filed your traveler registration. Passport issuance will open in a future story."], choices: undefined } : dialogueFor(step.value));

onMounted(() => {
  clientReady.value = true;
});

function choose(choice: PassportOfficeChoice) {
  if (choice === "apply" && !registrationComplete.value && isSignedIn.value !== true) {
    isRegistering.value = true;
    return;
  }
  if (choice === "returning") {
    isReturning.value = true;
    return;
  }

  step.value = choice === "apply" ? "returning" : choice;
}
function restart() { step.value = openingDialogueStep(); registrationComplete.value = false; }
function cancelRegistration() { isRegistering.value = false; }
function completeRegistration() { isRegistering.value = false; registrationComplete.value = true; }
function cancelLogin() { isReturning.value = false; }
async function completeLogin() { isReturning.value = false; await navigateTo("/"); }
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

    <section v-if="isRegistering" class="passport-office__registration-shell" aria-label="CosmoPort traveler registration">
      <PassportOfficeRegistration @cancel="cancelRegistration" @complete="completeRegistration" />
    </section>

    <section v-else-if="isReturning" class="passport-office__registration-shell" aria-label="CosmoPort returning traveler login">
      <PassportOfficeLogin :is-signed-in="isSignedIn === true" @cancel="cancelLogin" @complete="completeLogin" />
    </section>

    <section v-else class="passport-office__dialogue" aria-labelledby="passport-office-title">
      <p class="passport-office__eyebrow">CosmoPort Passport Bureau</p>
      <h1 id="passport-office-title">Passport Office</h1>
      <p class="passport-office__byline">A message from Stella Starling, your interstellar travel clerk.</p>
      <div class="passport-office__message" role="status" aria-live="polite" aria-atomic="true">
        <p v-for="line in dialogue.lines" :key="line">{{ line }}</p>
      </div>
      <div v-if="dialogue.choices" class="passport-office__choices" aria-label="Choose a response">
        <button v-for="choice in dialogue.choices" :key="choice.id" type="button" :disabled="!choicesReady" @click="choose(choice.id)">
          {{ choice.label }}
        </button>
      </div>
      <div v-else class="passport-office__actions">
        <button type="button" @click="restart">Start over</button>
        <NuxtLink to="/">Leave the office</NuxtLink>
      </div>
    </section>

  </main>
</template>

<style scoped>
.passport-office { isolation: isolate; position: relative; display: grid; min-height: 100vh; min-height: 100svh; overflow: auto; place-items: center; padding: clamp(5rem, 10vw, 7rem) clamp(1rem, 4vw, 3rem) clamp(1.5rem, 4vw, 3rem); color: #173c47; }
.passport-office__background, .passport-office__background-fallback, .passport-office__wash { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; }
.passport-office__background { object-fit: cover; object-position: center; }
.passport-office__background-fallback { background: radial-gradient(circle at 72% 30%, #78c5bf 0 9%, transparent 9.5%), linear-gradient(135deg, #244c59 0 45%, #173c47 45% 100%); }
.passport-office__wash { z-index: -1; background: linear-gradient(135deg, rgb(12 49 61 / .22), rgb(255 247 226 / .24)); }
.passport-office__exit { position: absolute; top: clamp(1rem, 3vw, 2rem); right: clamp(1rem, 3vw, 2rem); border: 2px solid #173c47; border-radius: 999px; padding: .56rem .86rem; background: rgb(255 247 226 / .93); color: inherit; font-size: .86rem; font-weight: 800; text-decoration: none; }
.passport-office__dialogue { width: min(100%, 46rem); border: 3px solid #173c47; border-radius: 1.25rem; padding: clamp(1.35rem, 4vw, 3rem); background: rgb(255 243 215 / .97); box-shadow: .7rem .7rem 0 #d9654d, 0 1.25rem 3rem rgb(23 60 71 / .28); }
.passport-office__registration-shell { width: min(100%, 72rem); border: 3px solid #173c47; border-radius: 1.25rem; padding: clamp(.65rem, 1.5vw, 1rem); background: rgb(255 243 215 / .98); box-shadow: .7rem .7rem 0 #d9654d, 0 1.25rem 3rem rgb(23 60 71 / .28); }
.passport-office__eyebrow { margin: 0 0 .45rem; color: #b8493a; font-size: .72rem; font-weight: 900; letter-spacing: .17em; text-transform: uppercase; }
h1 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2rem, 5vw, 3.75rem); line-height: .95; }
.passport-office__byline { margin: .7rem 0 0; color: #b8493a; font-weight: 700; line-height: 1.4; }
.passport-office__message { margin: 1.5rem 0; border-block: 2px solid rgb(23 60 71 / .2); padding: 1.15rem 0; font-size: clamp(1.05rem, 1.8vw, 1.28rem); line-height: 1.55; }
.passport-office__message p { margin: 0; }.passport-office__message p + p { margin-top: .75rem; }
.passport-office__choices, .passport-office__actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: .75rem; }
.passport-office button, .passport-office__actions a { border: 2px solid #173c47; border-radius: .65rem; padding: .85rem 1rem; background: #78c5bf; color: #173c47; font: inherit; font-weight: 800; line-height: 1.25; text-align: left; cursor: pointer; text-decoration: none; }
.passport-office button:hover:not(:disabled), .passport-office__actions a:hover { background: #ee8e71; }
.passport-office button:disabled { cursor: wait; opacity: .66; }
.passport-office button:focus-visible, .passport-office a:focus-visible { outline: 3px solid #b8493a; outline-offset: 3px; }
@media (max-width: 44rem) { .passport-office { display: block; padding-top: 5rem; }.passport-office__background { object-position: 62% center; }.passport-office__dialogue, .passport-office__registration-shell { width: auto; }.passport-office__choices, .passport-office__actions { grid-template-columns: 1fr; }.passport-office__exit { z-index: 1; } }
@media (prefers-reduced-motion: reduce) { .passport-office * { scroll-behavior: auto; } }
</style>
