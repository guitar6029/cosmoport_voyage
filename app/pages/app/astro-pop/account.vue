<script setup lang="ts">
import { useAstroPopOrders } from "../../../composables/useAstroPopOrders";
import AstroPopOrderCard from "../../../components/astro-pop/AstroPopOrderCard.vue";

const { orders, pending, error, refresh } = useAstroPopOrders();
definePageMeta({
    middleware: ["astro-pop-account-auth"],
});

useSeoMeta({
    title: "My Account | Astro Pop Soda Co.",
    robots: "noindex, nofollow",
});
</script>

<template>
    <div class="astro-pop-account-page">
        <AstroPopNav />
        <section class="account">
            <header class="account__header">
                <h1>My Account</h1>
            </header>

        <div class="account__content">
                <div class="account__section-heading">
                    <h2>Order History</h2>
                    <span>Last 30 days</span>
                </div>

                <p v-if="pending" role="status">Loading your orders…</p>
                <div v-else-if="error" class="account__message" role="alert">
                    <p>We couldn't load your orders right now.</p>
                    <button type="button" @click="refresh()">Try again</button>
                </div>
                <div v-else-if="orders.length === 0" class="account__message">
                    <p>No orders in the last 30 days.</p>
                    <NuxtLink to="/app/astro-pop/#astropop-flavors-title">Explore flavors</NuxtLink>
                </div>
                <div v-else class="account__orders">
                    <AstroPopOrderCard v-for="order in orders" :key="order.id" :order="order" />
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.astro-pop-account-page {
    min-height: 100vh;
    background: #ead5b0;
}

.account {
    width: min(100% - 2rem, 1200px);
    margin-inline: auto;
    padding-block: 2rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.account__header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.account__header h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    color: #452c35;
}

.account__header nav {
    display: flex;
    gap: 1rem;
    border-bottom: 2px solid #452c35;
}

.account__nav-link {
    padding: 0.75rem 1rem;
    color: #452c35;
    text-decoration: none;
    font-weight: 700;
}

.account__nav-link--active {
    border-bottom: 3px solid #b93637;
}

.account__content {
    color: #452c35;
    flex: 1;
    min-height: 320px;
}
.account__section-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: .75rem;
    margin-bottom: 1.25rem;
}
.account__section-heading h2 { font-size: 1.35rem; font-weight: 700; }
.account__section-heading span { font-size: .9rem; }
.account__orders { display: grid; gap: 1.5rem; }
.account__message {
    padding: 1.5rem;
    border: 2px solid #452c35;
    border-radius: 1rem;
    background: #fff3d6;
}
.account__message a, .account__message button {
    display: inline-block;
    margin-top: 1rem;
    color: #a83f2e;
    font-weight: 700;
    text-decoration: underline;
}
</style>
