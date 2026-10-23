<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAstroPopCrateStore } from "../../../stores/astroPopCrate";
import {
  clearPendingAstroPopCheckout,
  completeVerifiedAstroPopCheckout,
  getCompletedAstroPopCheckout,
  getPendingAstroPopCheckout,
  saveCompletedAstroPopCheckout,
} from "../../../utils/astroPopCheckout";

const route = useRoute();
const crateStore = useAstroPopCrateStore();
const status = ref<"loading" | "success" | "error">("loading");
const message = ref("Verifying your payment…");
const cartMessage = ref("");

onMounted(async () => {
  const sessionId = Array.isArray(route.query.session_id)
    ? undefined
    : route.query.session_id;
  const pendingCheckout = getPendingAstroPopCheckout();
  const completedCheckout = getCompletedAstroPopCheckout();
  const isPendingCheckout = pendingCheckout?.sessionId === sessionId;
  const isCompletedCheckout = completedCheckout?.sessionId === sessionId;

  if (!sessionId || (!isPendingCheckout && !isCompletedCheckout)) {
    status.value = "error";
    message.value = "We could not confirm this checkout for this browser.";
    return;
  }

  try {
    const result = await $fetch<{
      sessionId: string;
      verified: boolean;
    }>("/api/astro-pop/checkout/verify", { query: { session_id: sessionId } });

    if (!result.verified || result.sessionId !== sessionId) {
      throw new Error("Checkout was not verified");
    }

    if (isPendingCheckout && pendingCheckout) {
      const cartResult = completeVerifiedAstroPopCheckout(
        crateStore,
        pendingCheckout,
        result,
      );

      if (!cartResult) {
        throw new Error("Checkout could not be completed");
      }

      clearPendingAstroPopCheckout();
      saveCompletedAstroPopCheckout(sessionId);
      cartMessage.value = cartResult === "cleared"
        ? "Your checkout cart has been cleared."
        : "Your cart changed while checkout was in progress, so the updated cart was preserved.";
    } else {
      cartMessage.value = "Your current cart was left untouched.";
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
      <p :role="status === 'error' ? 'alert' : undefined">{{ message }}</p>
      <p v-if="status === 'success' && cartMessage">{{ cartMessage }}</p>
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
