<script setup lang="ts">
import { ArrowBigLeft, ArrowBigRight } from 'lucide-vue-next';
import { shipsData } from '../../assets/shipsData';
import type { Ship } from '../../types/Ship';
import { computed, ref } from 'vue';

// refs
const currentCarouselStep = ref(0)
const ships = ref<Ship[] | null>(shipsData)


//emits 
const emit = defineEmits<{
    (e: 'shipSelected', ship: Ship): void
}>()

const previousShipSlide = () => {
    if (currentCarouselStep.value === 0) {
        //then go to the last ship
        currentCarouselStep.value = ships.value!.length - 1
    } else {
        currentCarouselStep.value -= 1

    }

}

const nextShipSlide = () => {
    if (currentCarouselStep.value === ships.value!.length - 1) {
        //then go to the first ship
        currentCarouselStep.value = 0
    } else {
        currentCarouselStep.value += 1
    }
}




//get current ship object 
const currentShip = computed(() => {
    return ships.value![currentCarouselStep.value]
})

//get current ship - 1
const previousShip = computed(() => {
    // if index is at 0, then return the last ship
    if (currentCarouselStep.value === 0) {
        return ships.value![ships.value!.length - 1]
    } else {
        return ships.value![currentCarouselStep.value - 1]

    }
})

//get current ship + 1
const nextShip = computed(() => {
    // if index is at last index, then return the first ship
    if (currentCarouselStep.value === ships.value!.length - 1) {
        return ships.value![0]
    } else {
        return ships.value![currentCarouselStep.value + 1]
    }
})


</script>

<template>
    <div class="flex items-center justify-center gap-2">
                <ArrowBigLeft @click="previousShipSlide()"
                    class="w-12 h-12 cursor-pointer hover-basic hover:text-primary hover:fill-primary" />

                <div class="relative flex items-center gap-4">
                    <div class="relative bottom-30 p-4 w-50 flex flex-col items-center gap-4 ">
                        <img :src="previousShip?.images.default" :alt="previousShip?.name" class="blur-[2px]">
                    </div>
                    <div class="p-4 w-150 flex flex-col items-center gap-4 ">
                        <img :src="currentShip?.images.default" alt="">
                        <span class="font-bold text-4xl">{{ currentShip?.name }}</span>
                        <span class="text-2xl">{{ currentShip?.role }}</span>
                        <button class="btn btn-xl btn-primary" @click="emit('shipSelected', currentShip!)">Select Ship</button>
                    </div>
                    <div class="relative bottom-30 p-4 w-50 flex flex-col items-center gap-4 ">

                        <img :src="nextShip?.images.default" :alt="nextShip?.name" class="blur-[2px]">
                    </div>
                </div>

                <ArrowBigRight @click="nextShipSlide()"
                    class="w-12 h-12 cursor-pointer hover-basic hover:text-primary hover:fill-primary" />
            </div>

</template>