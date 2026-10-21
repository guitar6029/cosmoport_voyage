<template>
  <main class="universe-directory">
    <div class="universe-directory__content">
      <p class="universe-directory__eyebrow">The CosmoPort universe</p>
      <h1>Choose your tomorrow.</h1>
      <nav aria-label="Experiences">
        <ul class="universe-directory__links">
          <li><NuxtLink to="/cosmoport-voyage">CosmoPort Voyage</NuxtLink></li>
          <li><NuxtLink to="/astro-pop">AstroPop Soda Co.</NuxtLink></li>
        </ul>
      </nav>
    </div>
  </main>
</template>

<style scoped>
.universe-directory {
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  padding: 2rem;
  background: #f3e4c7;
  color: #183d4a;
}

.universe-directory__content {
  width: min(100%, 42rem);
  text-align: center;
}

.universe-directory__eyebrow {
  margin: 0 0 1rem;
  color: #b44d32;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.75rem, 8vw, 6rem);
  line-height: 0.95;
}

.universe-directory__links {
  display: grid;
  gap: 1rem;
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}

.universe-directory__links a {
  display: block;
  border: 2px solid #183d4a;
  border-radius: 999px;
  padding: 1rem 1.5rem;
  color: inherit;
  font-weight: 800;
  text-decoration: none;
  transition: background-color 160ms ease, color 160ms ease;
}

.universe-directory__links a:hover,
.universe-directory__links a:focus-visible {
  background: #183d4a;
  color: #fff8e8;
}

.universe-directory__links a:focus-visible {
  outline: 3px solid #b44d32;
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .universe-directory__links a {
    transition: none;
  }
}
</style>
