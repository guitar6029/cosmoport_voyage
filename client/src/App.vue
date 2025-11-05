<script setup lang="ts">

import { Transition, onMounted, ref } from 'vue';
import VoyageContainer from './components/VoyageContainer.vue';
import useVoyage from './composables/useVoyage';
import type { Voyage } from './types/Voyage';

const { fetchVoyageData, isLoadingVoyageData } = useVoyage()
const hasMounted = ref(false);
const voyageData = ref<Voyage[]>([])
const showHero = ref(true);
onMounted(async () => {
  hasMounted.value = true
  const result = await fetchVoyageData()
  console.log("voyage fetch result:", result)
  const payload = Array.isArray(result.data)
    ? result.data
    : (result.data && Array.isArray(result.data.data) ? result.data.data : [])

  if (payload.length > 0) {
    voyageData.value = payload
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <Transition v-if="showHero && hasMounted" name="slide-in" appear>

      <section v-if="hasMounted" class="hero flex flex-col md:flex-row items-center justify-center gap-6">
        <div class="w-full md:max-w-xl flex flex-col items-center justify-center gap-12">
          <h1 class="text-2xl text-glow md:text-[6rem] lg:text-[14rem] font-bold font-sci-fi uppercase z-10">
            CostmoPort</h1>

          <button @click="showHero = false"
            class="border-2 p-2 cursor-pointer rounded-xl border-primary text-6xl md:w-fit w-full uppercase font-sci-fi">Explore
            Voyages</button>
        </div>

      </section>
    </Transition>

    <VoyageContainer v-else-if="hasMounted && !showHero" :loading="isLoadingVoyageData" :voyages="voyageData" />
  </div>
</template>
