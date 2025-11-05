<script setup lang="ts">
import type { Voyage } from '../types/Voyage';
import { Eclipse } from 'lucide-vue-next';
import Difficulty from './Badge/Difficulty.vue';
import { getImage } from '../utils/getImage';

defineProps<{
    voyage: Voyage
}>();

defineEmits<{
    (e: 'view-voyage-details', voyage: Voyage): void
}>();



</script>

<template>
    <div class="card card-xl card-border bg-base-100 w-96 h-150 shadow-sm hover-bg hover:bg-accent">
        <figure class="relative">
            <img :src="getImage(voyage.imageUrlKey)" :alt="voyage.description" class="zoom-in w-full" />
        </figure>
        <div class="card-body flex flex-col gap-2">
            <h2 class="card-title">{{ voyage.name }}</h2>
            <p class="line-clamp-2">{{ voyage.description }}</p>
            <Difficulty :difficulty="voyage.difficulty" />
            <div class="flex flex-row items-center gap-2 m-2">
                <Eclipse class="w-6 h-6" />
                <span>Origin: <span class="font-bold">{{ voyage.origin }}</span></span>
            </div>
            <div class="flex flex-row items-center gap-2 m-2">
                <Eclipse class="w-6 h-6" />
                <span>Destination: <span class="font-bold">{{ voyage.destination }}</span></span>
            </div>
            <div class="card-actions flex flex-col md:flex-row items-center gap-2">
                <button @click="$emit('view-voyage-details', voyage)" class="btn btn-primary flex-1 text-xl">More
                    Info</button>
                <button class="btn btn-secondary text-xl flex-1">Join</button>
            </div>
        </div>
    </div>
</template>