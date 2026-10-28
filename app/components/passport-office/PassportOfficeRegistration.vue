<script setup lang="ts">
import { ref } from "vue";
import { useSignUp } from "@clerk/nuxt/composables";
import { usePassportOfficeRegistration } from "../../composables/usePassportOfficeRegistration";
const emit = defineEmits<{ cancel: []; complete: [] }>();
const { isLoaded, signUp, setActive } = useSignUp();
const email = ref(""); const password = ref(""); const code = ref("");
const { verifying, pending, error, begin: beginRegistration, verify: verifyCode, resend } = usePassportOfficeRegistration(signUp, setActive, isLoaded, () => emit("complete"));
const begin = () => beginRegistration(email.value, password.value);
const verify = () => verifyCode(code.value);
</script>
<template><form v-if="!verifying" class="passport-registration" @submit.prevent="begin"><p>A passport begins with a verified CosmoPort account.</p><label>Email address<input v-model="email" type="email" autocomplete="email" required :disabled="pending || !isLoaded"></label><label>Password<input v-model="password" type="password" autocomplete="new-password" required :disabled="pending || !isLoaded"></label><p v-if="error" role="alert">{{ error }}</p><button type="submit" :disabled="pending || !isLoaded">{{ pending ? "Preparing…" : "Send verification code" }}</button><button type="button" :disabled="pending" @click="emit('cancel')">Back to the office</button></form><form v-else class="passport-registration" @submit.prevent="verify"><p>Enter the code Clerk sent to <strong>{{ email }}</strong>.</p><label>Verification code<input v-model="code" inputmode="numeric" autocomplete="one-time-code" required :disabled="pending"></label><p v-if="error" role="alert">{{ error }}</p><button type="submit" :disabled="pending">{{ pending ? "Verifying…" : "Verify email" }}</button><button type="button" :disabled="pending" @click="resend">Resend code</button><button type="button" :disabled="pending" @click="emit('cancel')">Cancel</button></form></template>
<style scoped>.passport-registration{display:grid;gap:.7rem;margin-top:1rem}.passport-registration p{margin:0;line-height:1.4}.passport-registration label{display:grid;gap:.3rem;font-weight:800}.passport-registration input{border:2px solid #173c47;border-radius:.45rem;padding:.65rem;background:#fffdf5;color:#173c47;font:inherit}.passport-registration button{border:2px solid #173c47;border-radius:.65rem;padding:.72rem;background:#78c5bf;color:#173c47;font:inherit;font-weight:800;cursor:pointer}.passport-registration button:disabled,.passport-registration input:disabled{opacity:.65}</style>
