<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
export type Direction = 'up' | 'right' | 'down' | 'left'
import spaceshipUp from '../../assets/img/cosmoport/spaceship-up.png'
import default_bg from '../../assets/img/cosmoport/bg/default-bg.jpg'
import debrisImg from "../../assets/img/cosmoport/env-objects/crimson-rift/debris-001.png"
import crystalImg from "../../assets/img/cosmoport/env-objects/crimson-rift/crystal-001.png"
import asteroidImg from "../../assets/img/cosmoport/env-objects/crimson-rift/asteroid-001.png"

let assetsReady = 0
// global variables
let bgOffsetY = 0
const scrollSpeed = 2 // pixels per frame (adjust for feel)

const margin = 20
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
const size = 100

//bg image
let bgImage: HTMLImageElement

//spaceship
let spaceshipImg = new Image()
spaceshipImg.src = spaceshipUp
//initialize the posX and posY
let posX = 0
let posY = 0

let debris = new Image()
debris.src = debrisImg
let crystal = new Image()
crystal.src = crystalImg
let asteroid = new Image()
asteroid.src = asteroidImg

function fitToDisplaySize(canvas: HTMLCanvasElement) {
    const dpr = Math.max(1, window.devicePixelRatio || 1)

    // Choose a logical CSS size for your canvas “game area”
    // You can keep your Tailwind classes for layout, but
    // define a *logical* drawing size here (e.g., 560x820).
    const cssWidth = 560
    const cssHeight = 820

    // Set backing store to DPR-scaled pixels
    canvas.width = Math.floor(cssWidth * dpr)
    canvas.height = Math.floor(cssHeight * dpr)

    // Make 1 unit in API = 1 CSS pixel
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Optional: also size the element with CSS inline styles
    canvas.style.width = cssWidth + 'px'
    canvas.style.height = cssHeight + 'px'
}

function initialDraw() {
    drawBackground()
    randomizeObjects(5)
    drawSpaceship()

}

function init() {
    const canvas = canvasRef.value

    if (!canvas) return

    // canvas.width = canvas.clientWidth
    // canvas.height = canvas.clientHeight
    ctx = canvas.getContext('2d')
    if (!ctx) return

    fitToDisplaySize(canvas)


    //initialize the posX and posY
    // find the cente so the spaceship is in the middle
    posX = (canvas.clientWidth - size) / 2
    posY = canvas.clientHeight - size - margin

    bgImage = new Image()
    bgImage.src = default_bg
    bgImage.onload = () => {
        assetsReady++
        if (assetsReady == 2) {
            initialDraw()
        }
    }

    spaceshipImg.onload = () => {
        assetsReady++
        if (assetsReady == 2) {
            initialDraw()
        }
    }
}


function randomizeObjects(numberOfItems: number) {
    let items = [debris, crystal, asteroid] as HTMLImageElement[]
    for (let i = 0; i < numberOfItems; i++) {
        let randomX = Math.floor(Math.random() * canvasRef.value!.clientWidth)
        let randomY = Math.floor(Math.random() * canvasRef.value!.clientHeight)
        let randomindex = Math.floor(Math.random() * items.length)
        ctx?.drawImage(items[randomindex], randomX, randomY, 150, 150)
    }

}

function movementControl(direction: Direction) {
    switch (direction) {
        case "up":
            if (posY > 0) {
                //alow movement
                posY -= 10
            } else {
                //then do nothing
            }
            break;


        case "right":
            if (posX >= canvasRef.value!.clientWidth - size) {

            } else {
                posX += 10
            }
            break;

        case "down":
            if (posY <= canvasRef.value!.clientHeight - size) {
                //alow movement
                posY += 10
            } else {
                //then do nothing
            }
            break;

        case "left":
            if (posX <= 0) {
                //then do nothing
            } else {
                //alow movement
                posX -= 10
            }
            break;
        default:
            //do nothing
            break

    }

}

function onKeyDown(e: KeyboardEvent) {

    switch (e.key) {
        case "ArrowUp":
            movementControl('up')
            break;
        case "ArrowRight":
            movementControl('right')
            break;
        case "ArrowDown":
            movementControl('down')
            break;
        case "ArrowLeft":
            movementControl('left')
            break;
        default:
            //do nothing
            break
    }

    //then rerender by using draw()
    draw()
}

function drawBackground() {
    const canvas = canvasRef.value!
    if (!ctx || !canvas) return

    // draw first copy
    ctx.drawImage(bgImage, 0, bgOffsetY, canvas.clientWidth, canvas.clientHeight)

    // draw second copy, right above it
    ctx.drawImage(bgImage, 0, bgOffsetY - canvas.clientHeight, canvas.clientWidth, canvas.clientHeight)

    // move the background down
    bgOffsetY += scrollSpeed

    // if first copy moved fully off-screen, reset
    if (bgOffsetY >= canvas.clientHeight) bgOffsetY = 0
}

function drawSpaceship() {
    ctx?.drawImage(spaceshipImg, posX, posY, size, size)
}

function draw() {
    ctx?.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)
    drawBackground()
    drawSpaceship()
}

onMounted(() => {
    init()
    window.addEventListener('keydown', onKeyDown)
    // Later you can also add: window.addEventListener('resize', () => fitToDisplaySize(canvasRef.value!))
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown)
})


</script>

<template>
    <!-- Keep your Tailwind layout classes; we’ll override the inner size in JS for crispness -->
    <canvas ref="canvasRef" class="bg-black rounded-xl shadow-2xl"></canvas>
</template>
