<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  imageSrc: string;
  imageAlt: string;
  videoSrc: string;
}>();

const avatar = ref<HTMLElement | null>(null);
const video = ref<HTMLVideoElement | null>(null);
const shouldLoadVideo = ref(false);
const isVideoPlaying = ref(false);
let observer: IntersectionObserver | undefined;
let hasAutoplayed = false;
let isPlaybackActive = false;
let reduceMotion = false;

const showStaticImage = () => {
  isVideoPlaying.value = false;
};

const playVideo = async () => {
  if (isPlaybackActive || reduceMotion) {
    return;
  }

  isPlaybackActive = true;
  shouldLoadVideo.value = true;

  await nextTick();

  if (!video.value) {
    isPlaybackActive = false;
    return;
  }

  video.value.currentTime = 0;

  try {
    await video.value.play();
  } catch {
    showStaticImage();
    isPlaybackActive = false;
  }
};

const replayOnHover = () => {
  if (!window.matchMedia("(hover: hover)").matches) {
    return;
  }

  void playVideo();
};

const onPlaying = () => {
  isVideoPlaying.value = true;
};

const onEnded = () => {
  showStaticImage();
};

const onVideoError = () => {
  showStaticImage();
  isPlaybackActive = false;
};

const onVideoTransitionEnd = (event: TransitionEvent) => {
  if (event.propertyName === "opacity" && !isVideoPlaying.value && video.value) {
    video.value.currentTime = 0;
    isPlaybackActive = false;
  }
};

onMounted(() => {
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !avatar.value || !("IntersectionObserver" in window)) {
    return;
  }

  observer = new IntersectionObserver((entries) => {
    if (!entries[0]?.isIntersecting || hasAutoplayed) {
      return;
    }

    hasAutoplayed = true;
    observer?.disconnect();
    void playVideo();
  }, { threshold: 0.6 });

  observer.observe(avatar.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  video.value?.pause();
});

defineExpose({ replayOnHover });
</script>

<template>
  <div ref="avatar" class="astropop-animated-testimonial-avatar">
    <img
      class="astropop-animated-testimonial-avatar__media"
      :src="props.imageSrc"
      :alt="props.imageAlt"
      loading="lazy"
      decoding="async"
    />
    <video
      v-if="shouldLoadVideo"
      ref="video"
      class="astropop-animated-testimonial-avatar__media astropop-animated-testimonial-avatar__video"
      :class="{ 'astropop-animated-testimonial-avatar__video--playing': isVideoPlaying }"
      :src="props.videoSrc"
      muted
      playsinline
      preload="metadata"
      aria-hidden="true"
      @playing="onPlaying"
      @ended="onEnded"
      @error="onVideoError"
      @transitionend="onVideoTransitionEnd"
    />
  </div>
</template>

<style scoped>
.astropop-animated-testimonial-avatar {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
}

.astropop-animated-testimonial-avatar__media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.astropop-animated-testimonial-avatar__video {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms ease-out;
}

.astropop-animated-testimonial-avatar__video--playing {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .astropop-animated-testimonial-avatar__video {
    display: none;
  }
}
</style>
