<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAstroPopCrateStore } from "../../../stores/astroPopCrate";
import {
  completeVerifiedAstroPopCheckout,
  getPendingAstroPopCheckout,
} from "../../../utils/astroPopCheckout";

const route = useRoute();
const crateStore = useAstroPopCrateStore();
const status = ref<"loading" | "success" | "error">("loading");
const message = ref("Verifying your payment…");

onMounted(async () => {
  const sessionId = Array.isArray(route.query.session_id)
    ? undefined
    : route.query.session_id;
  const pendingCheckout = getPendingAstroPopCheckout();

  if (!sessionId || !pendingCheckout || pendingCheckout.sessionId !== sessionId) {
    status.value = "error";
    message.value = "We could not confirm this checkout for this browser.";
    return;
  }

  try {
    const result = await $fetch<{
      sessionId: string;
      verified: boolean;
    }>("/api/astro-pop/checkout/verify", { query: { session_id: sessionId } });

    if (!result.verified || result.sessionId !== pendingCheckout.sessionId) {
      throw new Error("Checkout was not verified");
    }

    if (!completeVerifiedAstroPopCheckout(crateStore, pendingCheckout, result)) {
      status.value = "error";
      message.value = "Your cart changed while checkout was in progress, so it was left untouched.";
      return;
    }

    status.value = "success";
    message.value = "Payment confirmed. Your rocket crate is on its way!";
  } catch {
    status.value = "error";
    message.value = "We could not verify your payment yet. Your cart is still saved.";
  }
});
</script>

<template>
  <main class="astropop-checkout-success">
    <p v-if="status === 'loading'" role="status">{{ message }}</p>
    <template v-else>
      <h1>{{ status === "success" ? "Thank you for your order" : "Checkout needs attention" }}</h1>
      <p role="alert">{{ message }}</p>
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
