<script lang="ts" setup>
import type { Voyage } from '../../types/Voyage';
import Difficulty from '../../ui/Badge/Difficulty.vue';
import { Eclipse, DollarSign } from 'lucide-vue-next';
import UiIcon from '../../ui/UiIcon.vue';
import { getImage } from '../../utils/getImage';

defineProps<{
    selectedVoyage: Voyage | null
}>();

</script>

<template>
    <div class="flex flex-col items-center justify-center md:flex-row md:items-start gap-2">
        <!-- left side on large screens -->
        <div class="flex flex-col gap-4">
            <p class="text-xl">{{ selectedVoyage?.description }}</p>
            <Difficulty :difficulty="selectedVoyage?.difficulty ?? null" />

            <div class="text-xl flex items-center gap-2">
                <UiIcon :icon="Eclipse" size="lg" customClass="text-primary" />
                <span>Origin:</span>
                <span class="font-bold badge badge-xl badge-outline">{{ selectedVoyage?.origin }}</span>
            </div>
            <div class="text-xl flex items-center gap-2">
                <UiIcon :icon="Eclipse" size="lg" customClass="text-primary" />
                <span>Destination</span>
                <span class="font-bold badge badge-xl badge-outline">{{ selectedVoyage?.destination }}</span>
            </div>
            <div class="text-xl flex items-center gap-2">
                <UiIcon :icon="DollarSign" size="lg" customClass="text-primary" />
                <span>Reward</span>
                <span class="font-bold badge badge-xl badge-outline">{{ selectedVoyage?.reward }}</span>
            </div>
            <div class="text-xl flex items-center gap-2">
                <span>Recommended Ship</span>
                <span class="font-bold badge badge-xl badge-outline">{{ selectedVoyage?.recommendedShip }}</span>
            </div>
        </div>
        <!-- right side on large screens -->
        <div class="min-w-sm max-w-sm">
            <img class="rounded-xl" :src="getImage(selectedVoyage?.imageUrlKey ?? null)" :alt="`${selectedVoyage?.name} image`">
        </div>

    </div>
</template>