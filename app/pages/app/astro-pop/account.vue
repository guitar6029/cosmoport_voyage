<script setup lang="ts">
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
            <h2>Order History</h2>
            <p>Your recent Astro Pop orders will appear here.</p>
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
</style>
