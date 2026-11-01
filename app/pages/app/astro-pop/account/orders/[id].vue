<script setup lang="ts">
import { computed } from "vue";
import { useAstroPopOrder } from "../../../../../composables/useAstroPopOrder";

const route = useRoute();
const orderId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const { order, pending, error, refresh } = useAstroPopOrder(orderId ?? "");

definePageMeta({
  middleware: ["astro-pop-account-auth"],
});

useSeoMeta({
  title: "Order Details | Astro Pop Soda Co.",
  robots: "noindex, nofollow",
});

const errorStatus = computed(() => {
  const fetchError = error.value as { statusCode?: number; response?: { status?: number } } | null;
  return fetchError?.statusCode ?? fetchError?.response?.status;
});

const formattedDate = computed(() => order.value && new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
}).format(new Date(order.value.createdAt)));

const formatCurrency = (amountCents: number) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: order.value?.currency.toUpperCase() ?? "USD",
}).format(amountCents / 100);

const formatStatus = (status: string) => status.replaceAll("_", " ").toLowerCase();
</script>

<template>
  <div class="astro-pop-order-page">
    <AstroPopNav />
    <main class="order-detail">
      <NuxtLink class="order-detail__back" to="/app/astro-pop/account">
        <span aria-hidden="true">←</span> Back to Orders
      </NuxtLink>

      <p v-if="pending" class="order-detail__message" role="status">Loading your order…</p>

      <section v-else-if="errorStatus === 404" class="order-detail__message" role="alert">
        <h1>Order not found</h1>
        <p>This order isn't in your Astro Pop account.</p>
      </section>

      <section v-else-if="errorStatus === 401" class="order-detail__message" role="alert">
        <h1>Your session has ended</h1>
        <p>Please sign in again to view your orders.</p>
        <NuxtLink to="/">Return to CosmoPort</NuxtLink>
      </section>

      <section v-else-if="error" class="order-detail__message" role="alert">
        <h1>We couldn't load this order</h1>
        <p>Please try again in a moment.</p>
        <button type="button" @click="refresh()">Try again</button>
      </section>

      <section v-else-if="!order" class="order-detail__message" role="alert">
        <h1>Order not found</h1>
        <p>This order isn't in your Astro Pop account.</p>
      </section>

      <section v-else class="order-detail__card" :aria-labelledby="`order-${order.id}-title`">
        <header class="order-detail__header">
          <div>
            <p class="order-detail__eyebrow">Astro Pop order</p>
            <h1 :id="`order-${order.id}-title`">Order #{{ order.id.slice(0, 8).toUpperCase() }}</h1>
            <p>Placed {{ formattedDate }}</p>
          </div>
          <div class="order-detail__status-grid">
            <span><b>Order</b> {{ formatStatus(order.status) }}</span>
            <span><b>Payment</b> {{ formatStatus(order.paymentStatus) }}</span>
          </div>
        </header>

        <section class="order-detail__items" aria-labelledby="order-items-title">
          <h2 id="order-items-title">Your crate</h2>
          <ul>
            <li v-for="item in order.items" :key="item.flavorId">
              <div>
                <strong>{{ item.flavorName }}</strong>
                <span>{{ item.quantity }} {{ item.quantity === 1 ? "bottle" : "bottles" }} · {{ formatCurrency(item.unitPriceCents) }} each</span>
              </div>
              <strong>{{ formatCurrency(item.quantity * item.unitPriceCents) }}</strong>
            </li>
          </ul>
        </section>

        <footer class="order-detail__total">
          <span>Order total</span>
          <strong>{{ formatCurrency(order.totalCents) }}</strong>
        </footer>
      </section>
    </main>
  </div>
</template>

<style scoped src="./[id].css"></style>
