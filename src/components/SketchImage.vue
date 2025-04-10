<template>
  <div class="sketch-image-container" ref="container">
    <img
      :src="imageSrc"
      ref="originalImage"
      class="original-image"
      @load="initializeSketch"
      :alt="imageAlt || 'Sketch image'"
    />
    <canvas ref="sketchCanvas" class="sketch-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { gsap } from 'gsap';

// Define types
interface SketchImageProps {
  imageSrc: string;
  imageAlt?: string;
  animationDuration?: number;
  playOnHover?: boolean;
  autoPlay?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
}

// Edge point - [x, y, intensity]
type EdgePoint = [number, number, number];

// Define exposed methods
interface SketchImageMethods {
  play: () => void;
  pause: () => void;
  restart: () => void;
}

const props = withDefaults(defineProps<SketchImageProps>(), {
  imageAlt: '',
  animationDuration: 2.5,
  playOnHover: false,
  autoPlay: true,
  strokeColor: '#000000',
  strokeWidth: 1
});

const container = ref<HTMLDivElement | null>(null);
const originalImage = ref<HTMLImageElement | null>(null);
const sketchCanvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animation: gsap.core.Timeline | null = null;
let edges: EdgePoint[] = [];
let hoverListener: (() => void) | null = null;

// Initialize the sketch effect after image loads
const initializeSketch = (): void => {
  if (!originalImage.value || !sketchCanvas.value) return;

  const img = originalImage.value;
  const canvas = sketchCanvas.value;

  // Set canvas dimensions to match image
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw image to offscreen canvas to process it
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  const offCtx = offscreenCanvas.getContext('2d');

  if (!offCtx) return;

  // Draw and convert to grayscale
  offCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  offCtx.putImageData(imageData, 0, 0);

  // Detect edges for sketch effect (simplified Sobel operator)
  edges = detectEdges(offscreenCanvas);

  // Set animation behavior
  setupAnimation();
};

// Detect edges in the image for sketch effect
const detectEdges = (sourceCanvas: HTMLCanvasElement): EdgePoint[] => {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) return [];

  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const edgePoints: EdgePoint[] = [];

  // Sample the image at intervals for edge points (for performance)
  const sampleRate = Math.max(1, Math.floor(width * height / 20000));

  for (let y = 1; y < height - 1; y += sampleRate) {
    for (let x = 1; x < width - 1; x += sampleRate) {
      const idx = (y * width + x) * 4;

      // Check if this pixel has significant edge characteristics
      // Simplified edge detection - compare with neighbors
      const current = sourceData[idx];
      const left = sourceData[idx - 4];
      const right = sourceData[idx + 4];
      const top = sourceData[idx - width * 4];
      const bottom = sourceData[idx + width * 4];

      const diffX = Math.abs(right - left);
      const diffY = Math.abs(bottom - top);

      // If significant gradient, consider it an edge point
      if (diffX > 20 || diffY > 20) {
        // Store coordinates and intensity for drawing
        edgePoints.push([x, y, Math.min(255, diffX + diffY)]);
      }
    }
  }

  // Shuffle edge points for more natural drawing effect
  return shuffleArray(edgePoints);
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Setup the GSAP animation
const setupAnimation = (): void => {
  if (!ctx || !sketchCanvas.value || edges.length === 0) return;

  // Clear any existing animation
  if (animation) {
    animation.kill();
  }

  // Reset canvas
  ctx.clearRect(0, 0, sketchCanvas.value.width, sketchCanvas.value.height);

  // Create timeline
  animation = gsap.timeline({
    paused: !props.autoPlay,
    onComplete: () => {
      // Animation complete callback if needed
    }
  });

  // Setup line style
  ctx.strokeStyle = props.strokeColor;
  ctx.lineWidth = props.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Group edge points into batches for smoother animation
  const edgeBatches: EdgePoint[][] = [];
  const batchSize = Math.max(10, Math.floor(edges.length / 100));

  for (let i = 0; i < edges.length; i += batchSize) {
    edgeBatches.push(edges.slice(i, i + batchSize));
  }

  // Animate drawing each batch of edges
  edgeBatches.forEach((batch, index) => {
    animation?.add(() => {
      batch.forEach(point => {
        const [x, y, intensity] = point;
        const opacity = intensity / 255;

        // Draw a short line or point based on edge intensity
        if (ctx) {
          ctx.globalAlpha = opacity * 0.8;
          ctx.beginPath();
          ctx.moveTo(x, y);

          // Small random offset for sketchy effect
          const length = Math.random() * 3 + 1;
          const angle = Math.random() * Math.PI * 2;
          ctx.lineTo(
            x + Math.cos(angle) * length,
            y + Math.sin(angle) * length
          );

          ctx.stroke();
        }
      });
    }, index * (props.animationDuration / edgeBatches.length));
  });

  // If not autoplay but hover is enabled, set up hover listener
  if (props.playOnHover && !props.autoPlay) {
    setupHoverListener();
  }
};

// Setup hover behavior if playOnHover is true
const setupHoverListener = (): void => {
  if (!container.value || !animation) return;

  // Remove any existing listener
  if (hoverListener) {
    container.value.removeEventListener('mouseenter', hoverListener);
  }

  hoverListener = () => {
    if (animation) {
      animation.play(0);
    }
  };

  container.value.addEventListener('mouseenter', hoverListener);
};

// Watch for prop changes
watch(() => props.imageSrc, () => {
  // Reinitialize when image source changes
  if (originalImage.value?.complete) {
    initializeSketch();
  }
});

onMounted(() => {
  // If image is already loaded (from cache), initialize immediately
  if (originalImage.value?.complete) {
    initializeSketch();
  }
});

onUnmounted(() => {
  // Clean up
  if (animation) {
    animation.kill();
  }

  if (hoverListener && container.value) {
    container.value.removeEventListener('mouseenter', hoverListener);
  }
});

// Expose methods to parent component
const exposedMethods: SketchImageMethods = {
  play: () => animation?.play(0),
  pause: () => animation?.pause(),
  restart: () => animation?.restart()
};

defineExpose(exposedMethods);
</script>

<style scoped>
.sketch-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.original-image {
  opacity: 0;
  display: block;
  max-width: 100%;
}

.sketch-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
</style>
