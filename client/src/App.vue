<script setup lang="ts">
import { Transition, onMounted, ref, computed } from "vue";
import VoyageContainer from "./components/VoyageContainer.vue";
import useVoyage from "./composables/useVoyage";
import type { Voyage } from "./types/Voyage";
import type { AppView } from "./types/AppView";

const { fetchVoyageData, isLoadingVoyageData } = useVoyage();

const hasMounted = ref(false);
const voyageData = ref<Voyage[]>([]);
const currentView = ref<AppView>("hero");
const selectedVoyage = ref<Voyage | null>(null);

onMounted(async () => {
  hasMounted.value = true;
  const result = await fetchVoyageData();
  console.log("voyage fetch result:", result);
  const payload = Array.isArray(result.data)
    ? result.data
    : result.data && Array.isArray(result.data.data)
    ? result.data.data
    : [];

  if (payload.length > 0) {
    voyageData.value = payload;
  }
});

const handleViewChange = (view: AppView) => {
  currentView.value = view;
};

const getCurrentView = computed(() => {
  return currentView.value;
});

const setupCanvasInit = (voyage: Voyage) => {
  selectedVoyage.value = voyage;
  handleViewChange("game");
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <Transition
      v-if="getCurrentView === 'hero' && hasMounted"
      name="slide-in"
      appear
    >
      <section
        class="hero flex flex-col md:flex-row items-center justify-center gap-6"
      >
        <div
          class="w-full md:max-w-xl flex flex-col items-center justify-center gap-12"
        >
          <h1
            class="text-2xl text-glow md:text-[6rem] lg:text-[14rem] font-bold font-sci-fi uppercase z-10"
          >
            CosmoPort
          </h1>

          <button
            @click="handleViewChange('voyages')"
            class="border-2 p-2 hover-bg hover:bg-primary hover:text-accent cursor-pointer rounded-xl border-primary text-6xl md:w-fit w-full uppercase font-sci-fi"
          >
            Explore Voyages
          </button>
        </div>
      </section>
    </Transition>

    <VoyageContainer
      v-if="getCurrentView === 'voyages' && hasMounted"
      :loading="isLoadingVoyageData"
      :voyages="voyageData"
      @join-voyage="setupCanvasInit($event)"
    />
  </div>
</template>
