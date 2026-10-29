<script setup lang="ts">
import { computed, ref } from "vue";
import { useSignUp } from "@clerk/nuxt/composables";
import { PASSPORT_OFFICE_MEDIA } from "../../data/passportOfficeMedia";
import { usePassportOfficeRegistration } from "../../composables/usePassportOfficeRegistration";

const emit = defineEmits<{ cancel: []; complete: [] }>();
const { isLoaded, signUp, setActive } = useSignUp();
const stage = ref<"details" | "review">("details");
const passportCoverFailed = ref(false);
const firstName = ref(""); const lastName = ref(""); const emailAddress = ref(""); const password = ref(""); const code = ref("");
const applicantName = computed(() => `${firstName.value.trim()} ${lastName.value.trim()}`.trim());
const { verifying, pending, error, begin: beginRegistration, verify: verifyCode, resend } = usePassportOfficeRegistration(signUp, setActive, isLoaded, () => emit("complete"));
function reviewApplication() { stage.value = "review"; }
function correctApplication() { stage.value = "details"; }
async function fileApplication() { await beginRegistration({ firstName: firstName.value, lastName: lastName.value, emailAddress: emailAddress.value, password: password.value }); }
</script>

<template>
  <section class="passport-registration" aria-labelledby="passport-registration-title">
    <div class="passport-registration__cover" :class="{ 'passport-registration__cover--fallback': passportCoverFailed }">
      <img v-if="!passportCoverFailed" :src="PASSPORT_OFFICE_MEDIA.passportCover" alt="CosmoPort passport cover" @error="passportCoverFailed = true">
      <p v-else>Passport cover unavailable. Your application can still be filed.</p>
    </div>

    <form v-if="!verifying && stage === 'details'" class="passport-registration__form" @submit.prevent="reviewApplication">
      <p class="passport-registration__stamp">CosmoPort Passport Bureau · Form CP-1957</p>
      <h2 id="passport-registration-title">Traveler registration</h2>
      <p>Enter your particulars for Bureau review. Your password is never displayed on the review page.</p>
      <label for="passport-first-name">Given name <span aria-hidden="true">(first name)</span></label>
      <input id="passport-first-name" v-model="firstName" name="firstName" type="text" autocomplete="given-name" required :disabled="pending || !isLoaded">
      <label for="passport-last-name">Family name <span aria-hidden="true">(last name)</span></label>
      <input id="passport-last-name" v-model="lastName" name="lastName" type="text" autocomplete="family-name" required :disabled="pending || !isLoaded">
      <label for="passport-email">Contact signal <span aria-hidden="true">(email address)</span></label>
      <input id="passport-email" v-model="emailAddress" name="emailAddress" type="email" autocomplete="email" required :disabled="pending || !isLoaded">
      <label for="passport-password">Secure launch phrase <span aria-hidden="true">(password)</span></label>
      <input id="passport-password" v-model="password" name="password" type="password" autocomplete="new-password" minlength="8" required :disabled="pending || !isLoaded">
      <p v-if="!isLoaded" class="passport-registration__hint" role="status">Preparing the secure application desk…</p>
      <button type="submit" :disabled="pending || !isLoaded">Review application</button>
      <button type="button" class="passport-registration__secondary" :disabled="pending" @click="emit('cancel')">Back to the office</button>
    </form>

    <div v-else-if="!verifying" class="passport-registration__form passport-registration__review" aria-labelledby="passport-registration-title">
      <p class="passport-registration__stamp">CosmoPort Passport Bureau · Review desk</p><h2 id="passport-registration-title">Confirm registration particulars</h2>
      <dl><div><dt>Traveler</dt><dd>{{ applicantName }}</dd></div><div><dt>Email address</dt><dd>{{ emailAddress.trim() }}</dd></div></dl>
      <p>Your secure launch phrase is protected and will not be displayed here.</p>
      <p v-if="error" class="passport-registration__error" role="alert">{{ error }}</p>
      <button type="button" :disabled="pending || !isLoaded" @click="fileApplication">{{ pending ? "Filing…" : "File application" }}</button>
      <button type="button" class="passport-registration__secondary" :disabled="pending" @click="correctApplication">Make corrections</button>
      <button type="button" class="passport-registration__secondary" :disabled="pending" @click="emit('cancel')">Cancel application</button>
    </div>

    <form v-else class="passport-registration__form" @submit.prevent="verifyCode(code)">
      <p class="passport-registration__stamp">CosmoPort Passport Bureau · Signal verification</p><h2 id="passport-registration-title">Confirm contact signal</h2>
      <p>Enter the code Clerk sent to <strong>{{ emailAddress.trim() }}</strong>. A Clerk security challenge may appear in a separate dialog when required.</p>
      <label for="passport-verification-code">Verification code</label>
      <input id="passport-verification-code" v-model="code" name="verificationCode" inputmode="numeric" autocomplete="one-time-code" required :disabled="pending">
      <p v-if="error" class="passport-registration__error" role="alert">{{ error }}</p>
      <button type="submit" :disabled="pending">{{ pending ? "Verifying…" : "Verify email and activate" }}</button>
      <button type="button" class="passport-registration__secondary" :disabled="pending" @click="resend">Resend code</button>
      <button type="button" class="passport-registration__secondary" :disabled="pending" @click="emit('cancel')">Cancel application</button>
    </form>
  </section>
</template>

<style scoped>
.passport-registration { display:grid; grid-template-columns:minmax(18rem,.9fr) minmax(0,1.1fr); gap:clamp(1.25rem,3vw,3rem); align-items:stretch; margin:0; }
.passport-registration__cover { display:grid; min-height:34rem; place-items:center; overflow:hidden; border:2px solid #173c47; border-radius:.6rem; padding:0; background:#173c47; }.passport-registration__cover img { display:block; width:100%; height:100%; object-fit:contain; }.passport-registration__cover--fallback { color:#fff3d7; text-align:center; font-weight:700; }.passport-registration__cover--fallback p { padding:1.5rem; }
.passport-registration__form { display:grid; gap:.7rem; align-content:start; padding:clamp(.5rem,1vw,1rem) clamp(.35rem,1vw,1rem); }.passport-registration__form p,.passport-registration__form h2 { margin:0; }.passport-registration__form h2 { font-family:Georgia,"Times New Roman",serif; font-size:clamp(1.5rem,3vw,2.15rem); }.passport-registration__stamp { color:#b8493a; font-size:.72rem; font-weight:900; letter-spacing:.14em; text-transform:uppercase; }
.passport-registration__form label { display:grid; gap:.3rem; font-weight:800; }.passport-registration__form input { border:2px solid #173c47; border-radius:.45rem; padding:.65rem; background:#fffdf5; color:#173c47; font:inherit; }.passport-registration__form button { border:2px solid #173c47; border-radius:.65rem; padding:.72rem; background:#78c5bf; color:#173c47; font:inherit; font-weight:800; cursor:pointer; }.passport-registration__form button:hover { background:#ee8e71; }.passport-registration__form button:focus-visible,.passport-registration__form input:focus-visible { outline:3px solid #b8493a; outline-offset:3px; }.passport-registration__form button:disabled,.passport-registration__form input:disabled { opacity:.65; cursor:wait; }.passport-registration__secondary { background:#fff3d7 !important; }.passport-registration__error { color:#912c21; font-weight:800; }.passport-registration__hint { font-weight:700; }
.passport-registration__review dl { display:grid; gap:.55rem; margin:0; }.passport-registration__review dl div { display:grid; gap:.12rem; border-bottom:1px solid rgb(23 60 71 / .3); padding-bottom:.4rem; }.passport-registration__review dt { color:#b8493a; font-size:.76rem; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }.passport-registration__review dd { margin:0; font-weight:800; overflow-wrap:anywhere; }
@media (max-width:44rem) { .passport-registration { grid-template-columns:1fr; }.passport-registration__cover { min-height:18rem; }.passport-registration__cover img { max-height:24rem; }.passport-registration__form { padding:.5rem 0; } }
</style>
