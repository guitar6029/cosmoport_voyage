<script lang="ts" setup>
import { ref } from 'vue';
import Loading from '../ui/Loading.vue';
import type { Voyage } from '../types/Voyage.ts';
import VoyageCard from '../ui/VoyageCard.vue';
import BaseModal from '../ui/BaseModal.vue';
import { TransitionGroup } from 'vue'
import VoyageMoreDetails from '../components/voyage/VoyageMoreDetails.vue';


const props = defineProps<{
    loading: boolean
    voyages: Voyage[]
}>()

const selectedVoyage = ref<Voyage | null>(null);
const isModalShowing = ref(false);

const handleVoyageDetails = (voyage: Voyage) => {
    selectedVoyage.value = voyage
    console.log("selected voyage", selectedVoyage.value)
    isModalShowing.value = true
}

</script>

<template>
    <section v-if="loading">
        <Loading />
    </section>
    <section v-else class="flex flex-col items-center gap-10">
        <Transition name="slide-in">
            <BaseModal v-show="isModalShowing" :show="isModalShowing" :title="selectedVoyage?.name"
                :open="isModalShowing" @close="isModalShowing = false" uppercase titleClass="font-sci-fi">
                <VoyageMoreDetails :selectedVoyage="selectedVoyage" />
            </BaseModal>
        </Transition>

        <h1 class="font-sci-fi text-8xl font-bold">Voyages</h1>
        <TransitionGroup name="fade" tag="div" appear class="flex items-center justify-center flex-wrap gap-4">
            <VoyageCard v-for="(voyage, index) in props.voyages" :key="voyage.id" :voyage="voyage"
                :style="{ transitionDelay: `${index * 100}ms` }" @view-voyage-details="handleVoyageDetails($event)" />
        </TransitionGroup>
    </section>
</template>
