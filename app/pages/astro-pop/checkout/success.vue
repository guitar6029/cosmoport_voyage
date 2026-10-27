<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAstroPopCheckoutConfirmation } from "../../../composables/useAstroPopCheckoutConfirmation";
import { useAstroPopCrateStore } from "../../../stores/astroPopCrate";

const route = useRoute();
const crateStore = useAstroPopCrateStore();
const sessionId =
  typeof route.query.session_id === "string"
    ? route.query.session_id
    : undefined;
const { status, cartCompletion, start } = useAstroPopCheckoutConfirmation({ sessionId, crateStore });

const messages = {
  checking: "Checking your checkout…",
  confirmed: "Your payment and order are confirmed.",
  "payment-pending": "Your payment has not been confirmed yet. Your cart is still saved.",
  "payment-received": "Your payment was received. We’re finalizing your order.",
  "payment-received-recording-unknown": "Your payment was received, but order recording is temporarily unavailable.",
  unpaid: "This checkout was not completed. Your cart is still saved.",
  unavailable: "Checkout status is temporarily unavailable. Your cart is still saved.",
  unauthorized: "This browser cannot access that checkout.",
  unrecognized: "We could not confirm this checkout for this browser.",
} as const;
const message = computed(() => messages[status.value]);
const cartMessage = computed(() => {
  if (cartCompletion.value === "cleared") return "Your checkout cart has been cleared.";
  if (cartCompletion.value === "preserved") return "Your cart changed while checkout was in progress, so the updated cart was preserved.";
  if (cartCompletion.value === "untouched") return "Your current cart was left untouched.";
  return "";
});

onMounted(start);
</script>

<template>
  <main class="astropop-checkout-success">
    <p v-if="status === 'checking'" role="status">{{ message }}</p>
    <template v-else>
      <h1>{{ status === "confirmed" ? "Thank you for your order" : "Checkout update" }}</h1>
      <p :role="status === 'confirmed' ? undefined : 'alert'">{{ message }}</p>
      <p v-if="cartMessage">{{ cartMessage }}</p>
      <NuxtLink to="/astro-pop/cart">Return to your cart</NuxtLink>
    </template>
  </main>
</template>

<style scoped>
.astropop-checkout-success {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: radial-gradient(circle at top, #fff4d8 0, #e8d3ad 55%);
  color: var(--astropop-ink);
  font-family: var(--astropop-body-font);
  text-align: center;
}

.astropop-checkout-success h1 {
  font-family: var(--astropop-display-font);
}
</style>
