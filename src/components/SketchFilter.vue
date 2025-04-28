<template>
  <div
    class="sketch-filter-container"
    :class="{ 'animated': animated }"
    ref="container"
  >
    <img
      :src="imageSrc"
      :alt="imageAlt || 'Sketch image'"
      class="sketch-image"
      ref="imageRef"
      @load="onImageLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { gsap } from 'gsap';

interface SketchFilterProps {
  imageSrc: string;
  imageAlt?: string;
  animated?: boolean;
  animationDuration?: number;
  playOnHover?: boolean;
  debug?: boolean;
}

const props = withDefaults(defineProps<SketchFilterProps>(), {
  imageAlt: '',
  animated: true,
  animationDuration: 2,
  playOnHover: false,
  debug: false
});

const container = ref<HTMLDivElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const isLoaded = ref(false);
const isAnimating = ref(false);

function onImageLoad(): void {
  if (props.debug) console.log('[SketchFilter] Image loaded');
  isLoaded.value = true;

  if (props.animated && !props.playOnHover) {
    setTimeout(playAnimation, 100);
  }
}

function playAnimation(): void {
  if (!container.value || isAnimating.value) return;

  isAnimating.value = true;
  if (props.debug) console.log('[SketchFilter] Playing animation');

  // Reset animation state
  container.value.style.setProperty('--sketch-contrast', '100%');
  container.value.style.setProperty('--sketch-brightness', '100%');
  container.value.style.setProperty('--sketch-grayscale', '0%');

  // Animate filter properties
  const duration = props.animationDuration;
  gsap.timeline()
    .to(container.value, {
      duration: duration * 0.3,
      onUpdate: function() {
        const progress = this.progress();
        container.value!.style.setProperty('--sketch-grayscale', `${progress * 100}%`);
      }
    })
    .to(container.value, {
      duration: duration * 0.3,
      onUpdate: function() {
        const progress = this.progress();
        container.value!.style.setProperty('--sketch-contrast', `${100 + progress * 150}%`);
      }
    }, `-=${duration * 0.1}`)
    .to(container.value, {
      duration: duration * 0.4,
      onUpdate: function() {
        const progress = this.progress();
        container.value!.style.setProperty('--sketch-brightness', `${100 + progress * 30}%`);
      },
      onComplete: () => {
        isAnimating.value = false;
        if (props.debug) console.log('[SketchFilter] Animation completed');
      }
    }, `-=${duration * 0.1}`);
}

function setupHoverListener(): void {
  if (!container.value || !props.playOnHover) return;

  container.value.addEventListener('mouseenter', () => {
    if (props.debug) console.log('[SketchFilter] Hover detected');
    playAnimation();
  });
}

// Watch for changes in playOnHover
watch(() => props.playOnHover, (newValue) => {
  if (newValue) {
    setupHoverListener();
  }
});

// Watch for changes in image source
watch(() => props.imageSrc, () => {
  isLoaded.value = false;
  isAnimating.value = false;
});

onMounted(() => {
  if (props.debug) console.log('[SketchFilter] Component mounted');

  // Set initial CSS variables
  if (container.value) {
    container.value.style.setProperty('--sketch-contrast', '100%');
    container.value.style.setProperty('--sketch-brightness', '100%');
    container.value.style.setProperty('--sketch-grayscale', '0%');
  }

  if (props.playOnHover) {
    setupHoverListener();
  }

  // If image is already loaded
  if (imageRef.value?.complete) {
    onImageLoad();
  }
});

// Expose methods to parent component
defineExpose({
  play: playAnimation
});
</script>

<style scoped>
.sketch-filter-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  filter:
    grayscale(var(--sketch-grayscale, 0%))
    contrast(var(--sketch-contrast, 100%))
    brightness(var(--sketch-brightness, 100%));
}

.sketch-image {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Default non-animated state for instant sketch effect */
.sketch-filter-container:not(.animated) {
  filter: grayscale(100%) contrast(250%) brightness(130%);
}
</style>
