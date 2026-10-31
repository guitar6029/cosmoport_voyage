<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h2 class="admin-sidebar__title">Admin Dashboard</h2>

      <nav class="admin-sidebar__nav" aria-label="Admin navigation">
        <NuxtLink class="admin-sidebar__link" to="/admin">Dashboard</NuxtLink>
        <NuxtLink class="admin-sidebar__link" to="/">Back to Universe</NuxtLink>
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
  min-height: 100svh;
}

.admin-sidebar {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  border-right: 2px solid #d4b46a;
  background: #173c49;
  color: #fff7e5;
}

.admin-sidebar__title {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.3rem;
  line-height: 1.2;
  text-align: center;
}

.admin-sidebar__nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
}

.admin-sidebar__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 2.75rem;
  border: 1px solid transparent;
  border-radius: 0.45rem;
  padding: 0.6rem;
  color: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}

.admin-sidebar__link:hover,
.admin-sidebar__link.router-link-exact-active {
  border-color: #d4b46a;
  background: #285361;
}

.admin-sidebar__link:focus-visible {
  outline: 3px solid #ffe09d;
  outline-offset: 3px;
}

.admin-content {
  min-width: 0;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  background: #f3e4c7;
  color: #173c49;
}

@media (max-width: 640px) {
  .admin-layout {
    display: flex;
    flex-direction: column;
  }

  .admin-sidebar {
    min-height: 12rem;
    border-right: 0;
    border-bottom: 2px solid #d4b46a;
    padding: 1.25rem 1rem;
  }

  .admin-content {
    flex: 1;
  }
}
</style>
