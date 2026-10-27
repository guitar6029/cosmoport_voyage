<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { AstroPopCheckoutStatus } from "../../../../shared/astroPopCheckoutStatus";
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
type ConfirmationState =
  | "checking"
  | "confirmed"
  | "payment-pending"
  | "payment-received"
  | "payment-received-recording-unknown"
  | "unpaid"
  | "unavailable"
  | "unauthorized";

const status = ref<ConfirmationState>("checking");
const message = ref("Checking your checkout…");
const cartMessage = ref("");

const hasExpectedStatusShape = (value: unknown): value is AstroPopCheckoutStatus => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const status = value as Record<string, unknown>;
  return (
    ["paid", "pending", "unpaid", "unknown"].includes(String(status.paymentStatus)) &&
    ["recorded", "not_recorded", "not_checked", "unknown"].includes(String(status.orderStatus)) &&
    typeof status.orderConfirmed === "boolean"
  );
};

const showStatus = (checkoutStatus: AstroPopCheckoutStatus) => {
  if (
    checkoutStatus.orderConfirmed &&
    checkoutStatus.paymentStatus === "paid" &&
    checkoutStatus.orderStatus === "recorded"
  ) {
    status.value = "confirmed";
    message.value = "Your payment and order are confirmed.";
    return;
  }

  if (checkoutStatus.paymentStatus === "paid") {
    if (checkoutStatus.orderStatus === "not_recorded") {
      status.value = "payment-received";
      message.value = "Your payment was received. We’re finalizing your order.";
      return;
    }

    status.value = "payment-received-recording-unknown";
    message.value = "Your payment was received, but order recording is temporarily unavailable.";
    return;
  }

  if (checkoutStatus.paymentStatus === "pending") {
    status.value = "payment-pending";
    message.value = "Your payment has not been confirmed yet. Your cart is still saved.";
    return;
  }

  if (checkoutStatus.paymentStatus === "unpaid") {
    status.value = "unpaid";
    message.value = "This checkout was not completed. Your cart is still saved.";
    return;
  }

  status.value = "unavailable";
  message.value = "Checkout status is temporarily unavailable. Your cart is still saved.";
};

const isUnauthorizedError = (error: unknown) => {
  const fetchError = error as {
    statusCode?: number;
    response?: { status?: number };
  };
  return fetchError.statusCode === 403 || fetchError.response?.status === 403;
};

onMounted(async () => {
  const sessionId = Array.isArray(route.query.session_id)
    ? undefined
    : route.query.session_id;
  const pendingCheckout = getPendingAstroPopCheckout();
  const completedCheckout = getCompletedAstroPopCheckout();
  const isPendingCheckout = pendingCheckout?.sessionId === sessionId;
  const isCompletedCheckout = completedCheckout?.sessionId === sessionId;

  if (!sessionId || (!isPendingCheckout && !isCompletedCheckout)) {
    status.value = "unavailable";
    message.value = "We could not confirm this checkout for this browser.";
    return;
  }

  try {
    const result = await $fetch<AstroPopCheckoutStatus>(
      "/api/astro-pop/checkout/status",
      { query: { session_id: sessionId } },
    );

    if (!hasExpectedStatusShape(result)) {
      throw new Error("Checkout status was invalid");
    }

    if (isPendingCheckout && pendingCheckout && result.paymentStatus === "paid") {
      const cartResult = completeVerifiedAstroPopCheckout(
        crateStore,
        pendingCheckout,
        { sessionId, verified: true },
      );

      if (!cartResult) {
        throw new Error("Checkout could not be completed");
      }

      clearPendingAstroPopCheckout();
      saveCompletedAstroPopCheckout(sessionId);
      cartMessage.value = cartResult === "cleared"
        ? "Your checkout cart has been cleared."
        : "Your cart changed while checkout was in progress, so the updated cart was preserved.";
    } else if (isCompletedCheckout) {
      cartMessage.value = "Your current cart was left untouched.";
    }

    showStatus(result);
  } catch (error) {
    if (isUnauthorizedError(error)) {
      status.value = "unauthorized";
      message.value = "This browser cannot access that checkout.";
      return;
    }

    status.value = "unavailable";
    message.value = "Checkout status is temporarily unavailable. Your cart is still saved.";
  }
});
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
