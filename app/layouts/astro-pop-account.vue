<template>
    <div class="astro-pop-account-layout">
        <AstroPopNav />

        <main class="astro-pop-account-layout__main">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.astro-pop-account-layout {
    min-height: 100vh;
    background: #ead5b0;
}

.astro-pop-account-layout__main {
    width: min(100% - 2rem, 1200px);
    margin-inline: auto;
    padding-block: 2rem 4rem;
}
</style>
