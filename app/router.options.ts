import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash && to.path.replace(/\/$/, "") === "/astro-pop") {
      return { el: to.hash };
    }

    return { top: 0 };
  },
};
