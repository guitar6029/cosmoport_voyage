<template>
    <div class="admin-layout">
        <aside class="admin-sidebar">
            <h2>Admin Dashboard</h2>

            <nav class="flex flex-col items-center gap-2 justify-center" aria-label="Admin navigation">
                <NuxtLink to="/admin">Dashboard</NuxtLink>
                <NuxtLink to="/">Back to Universe</NuxtLink>
            </nav>
        </aside>

        <main class="admin-content">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.admin-layout {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    min-height: 100vh;
}

.admin-sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: #173c49;
    color: #fff7e5;
}

.admin-content {
    padding: 2rem;
    background: #f3e4c7;
}

@media (max-width: 640px) {
    .admin-layout {
        grid-template-columns: 1fr;
    }
}
</style>
