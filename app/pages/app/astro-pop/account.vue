<script setup lang="ts">
definePageMeta({
    layout: "astro-pop-account",
    middleware: ["astro-pop-account-auth"],
});

useSeoMeta({
    title: "My Account | Astro Pop Soda Co.",
    robots: "noindex, nofollow",
});
</script>

<template>
    <section class="account">
        <header class="account__header">
            <h1>My Account</h1>

            <nav aria-label="Astro Pop account sections">
                <NuxtLink to="/app/astro-pop/account" class="account__nav-link"
                    exact-active-class="account__nav-link--active">
                    Orders
                </NuxtLink>
            </nav>
        </header>

        <div class="account__content">
            <h2>Order History</h2>
            <p>Your recent Astro Pop orders will appear here.</p>
        </div>
    </section>
</template>

<style scoped>
.account {
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
    flex: 1;
    min-height: 320px;
}
</style>
