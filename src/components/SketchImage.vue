<template>
  <div class="sketch-image-container" ref="container">
    <img
      :src="imageSrc"
      ref="originalImage"
      class="original-image"
      @load="onImageLoad"
      :alt="imageAlt || 'Sketch image'"
    />
    <canvas ref="sketchCanvas" class="sketch-canvas"></canvas>
    <div v-if="debug" class="debug-info">
      <p>Status: {{ status }}</p>
      <p>Edges: {{ edgeCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
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
  debug?: boolean;
}



// Edge point - [x, y, intensity]
type EdgePoint = [number, number, number];

// Define exposed methods
interface SketchImageMethods {
  play: () => void;
  pause: () => void;
  restart: () => void;
  forceInitialize: () => void;
}

const props = withDefaults(defineProps<SketchImageProps>(), {
  imageAlt: '',
  animationDuration: 2.5,
  playOnHover: false,
  autoPlay: true,
  strokeColor: '#000000',
  strokeWidth: 1,
  debug: false
});

// Component state
const container = ref<HTMLDivElement | null>(null);
const originalImage = ref<HTMLImageElement | null>(null);
const sketchCanvas = ref<HTMLCanvasElement | null>(null);
const status = ref<string>('Initializing...');
const edgeCount = ref<number>(0);
let ctx: CanvasRenderingContext2D | null = null;
let animation: gsap.core.Timeline | null = null;
let edges: EdgePoint[] = [];
let initialized = false;

// Simple logging function
const log = (message: string): void => {
  console.log(`[SketchImage] ${message}`);
  status.value = message;
};

// Handle image load event
function onImageLoad(): void {
  log('Image loaded via event');
  initializeProcess();
}

// Initialize the component
function initializeProcess(): void {
  if (initialized) return;

  log('Starting initialization process');

  // Wait for the next Vue update cycle to ensure refs are available
  nextTick(() => {
    if (!originalImage.value) {
      log('Error: Image reference is missing');
      return;
    }

    log(originalImage.value.src); // Log the actual image path for debugging

    // Double check if image is really loaded
    if (!originalImage.value.complete) {
      log('Image not fully loaded yet, waiting...');
      originalImage.value.onload = () => {
        log('Image completed loading');
        initializeSketch();
      };
      return;
    }

    initializeSketch();
  });
}

// Main function to initialize sketch effect
function initializeSketch(): void {
  if (initialized) return;

  try {
    log('Initializing sketch effect');

    if (!originalImage.value || !sketchCanvas.value) {
      log('Error: Missing image or canvas reference');
      return;
    }

    const img = originalImage.value;
    const canvas = sketchCanvas.value;

    // Check image dimensions
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      log(`Error: Image has invalid dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
      return;
    }

    log(`Image dimensions: ${img.naturalWidth}x${img.naturalHeight}`);

    // Set canvas dimensions to match image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Get canvas context with willReadFrequently attribute
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      log('Error: Could not get canvas context');
      return;
    }

    // Clear canvas - use white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Process image and create edge points
    processImage();

    initialized = true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Error during initialization: ${errorMessage}`);
    console.error(error);
  }
}

// Process the image to detect edges
function processImage(): void {
  try {
    if (!originalImage.value || !sketchCanvas.value || !ctx) {
      log('Error: Missing required references for processing');
      return;
    }

    const img = originalImage.value;
    const canvas = sketchCanvas.value;

    // Create offscreen canvas for processing
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

    if (!offCtx) {
      log('Error: Could not get offscreen canvas context');
      return;
    }

    // Draw image to offscreen canvas
    offCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get image data for processing
    const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // R
      data[i + 1] = avg; // G
      data[i + 2] = avg; // B
    }

    offCtx.putImageData(imageData, 0, 0);

    // Find edges
    log('Detecting edges...');
    edges = detectEdges(offscreenCanvas);
    edgeCount.value = edges.length;
    log(`Found ${edges.length} edge points`);

    // Create animation once edges are detected
    if (edges.length > 0) {
      setupAnimation();
    } else {
      // If no edges found, try with a lower threshold
      log('Few edges detected - trying with a lower threshold');
      edges = detectEdges(offscreenCanvas, 5); // Lower threshold
      edgeCount.value = edges.length;
      log(`Found ${edges.length} edge points with lower threshold`);

      if (edges.length > 0) {
        setupAnimation();
      } else {
        log('Still no edges detected - drawing original image in sketch style');
        drawFallbackSketch(offscreenCanvas);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Error processing image: ${errorMessage}`);
    console.error(error);
  }
}

// Fallback sketch when edge detection fails
function drawFallbackSketch(sourceCanvas: HTMLCanvasElement): void {
  if (!ctx || !sketchCanvas.value) return;

  log('Using fallback sketch method');

  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d');

  if (!sourceCtx) return;

  // Get image data
  const imageData = sourceCtx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw sketch lines based on brightness
  ctx.strokeStyle = props.strokeColor;
  ctx.lineWidth = props.strokeWidth;

  // Sample points from the image
  const sampleRate = Math.max(1, Math.floor(width * height / 15000));
  const points: [number, number, number][] = [];

  for (let y = 0; y < height; y += sampleRate) {
    for (let x = 0; x < width; x += sampleRate) {
      const idx = (y * width + x) * 4;
      const brightness = data[idx]; // Grayscale, so R=G=B

      // Add points with weighted randomness based on brightness
      // Darker areas get more points
      if (Math.random() < (255 - brightness) / 255 * 0.5) {
        points.push([x, y, 255 - brightness]);
      }
    }
  }

  // Shuffle points for more natural drawing order
  const shuffledPoints = shuffleArray(points);

  // Create animation timeline
  animation = gsap.timeline({
    paused: !props.autoPlay,
    onStart: () => log('Fallback animation started'),
    onComplete: () => log('Fallback animation completed')
  });

  // Group points into batches
  const batchSize = Math.ceil(shuffledPoints.length / 100);
  const batches: [number, number, number][][] = [];

  for (let i = 0; i < shuffledPoints.length; i += batchSize) {
    batches.push(shuffledPoints.slice(i, i + batchSize));
  }

  // Animate drawing each batch
  batches.forEach((batch, index) => {
    animation?.add(() => {
      batch.forEach(([x, y, intensity]) => {
        const lineLength = Math.random() * 4 + 1;
        const angle = Math.random() * Math.PI * 2;

        if (ctx) {
          ctx.globalAlpha = intensity / 512 + 0.3; // Adjusted opacity
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(angle) * lineLength,
            y + Math.sin(angle) * lineLength
          );
          ctx.stroke();
        }
      });
    }, index * (props.animationDuration / batches.length));
  });
}

// Detect edges in the image
function detectEdges(sourceCanvas: HTMLCanvasElement, threshold?: number): EdgePoint[] {
  const edgePoints: EdgePoint[] = [];
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) return [];

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Edge detection threshold - use passed threshold or default
  const EDGE_THRESHOLD = threshold || 10;

  // Sample rate to improve performance
  const sampleRate = Math.max(1, Math.floor(width * height / 15000));

  // Detect edges by comparing neighboring pixels
  for (let y = 1; y < height - 1; y += sampleRate) {
    for (let x = 1; x < width - 1; x += sampleRate) {
      const idx = (y * width + x) * 4;

      const left = data[idx - 4];
      const right = data[idx + 4];
      const up = data[idx - width * 4];
      const down = data[idx + width * 4];

      const diffX = Math.abs(left - right);
      const diffY = Math.abs(up - down);

      // If there's significant change, it's an edge
      if (diffX > EDGE_THRESHOLD || diffY > EDGE_THRESHOLD) {
        edgePoints.push([x, y, Math.min(255, diffX + diffY)]);
      }
    }
  }

  // Shuffle points for more natural drawing
  return shuffleArray(edgePoints);
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Setup GSAP animation
function setupAnimation(): void {
  log('Setting up animation');

  if (!ctx || !sketchCanvas.value || edges.length === 0) {
    log('Cannot create animation: missing context or edges');
    return;
  }

  // Clear any existing animation
  if (animation) {
    animation.kill();
  }

  // Reset canvas - white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sketchCanvas.value.width, sketchCanvas.value.height);

  // Create a new GSAP timeline
  animation = gsap.timeline({
    paused: !props.autoPlay,
    onStart: () => log('Animation started'),
    onComplete: () => log('Animation completed')
  });

  // Set drawing style
  ctx.strokeStyle = props.strokeColor;
  ctx.lineWidth = props.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Group edges into batches for animation
  const totalBatches = Math.min(100, Math.ceil(edges.length / 10));
  const batchSize = Math.ceil(edges.length / totalBatches);
  const batches: EdgePoint[][] = [];

  for (let i = 0; i < edges.length; i += batchSize) {
    batches.push(edges.slice(i, i + batchSize));
  }

  // Create animation for each batch
  batches.forEach((batch, index) => {
    animation?.add(() => {
      batch.forEach(point => {
        const [x, y, intensity] = point;
        const opacity = intensity / 255;

        if (ctx) {
          ctx.globalAlpha = opacity * 0.8;
          ctx.beginPath();
          ctx.moveTo(x, y);

          // Add a small random line for sketchy effect
          const angle = Math.random() * Math.PI * 2;
          const length = Math.random() * 3 + 2; // Slightly longer lines
          ctx.lineTo(
            x + Math.cos(angle) * length,
            y + Math.sin(angle) * length
          );

          ctx.stroke();
        }
      });
    }, index * (props.animationDuration / batches.length));
  });

  // Set up hover interaction if needed
  if (props.playOnHover && !props.autoPlay) {
    setupHoverListener();
  }

  log('Animation setup complete');
  // Add this at the end of setupAnimation:
// Draw debug markers
if (props.debug && ctx && sketchCanvas.value) {
  // Draw border
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, sketchCanvas.value.width - 20, sketchCanvas.value.height - 20);

  // Draw crosshair
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(0, sketchCanvas.value.height/2);
  ctx.lineTo(sketchCanvas.value.width, sketchCanvas.value.height/2);
  ctx.moveTo(sketchCanvas.value.width/2, 0);
  ctx.lineTo(sketchCanvas.value.width/2, sketchCanvas.value.height);
  ctx.stroke();
}
}

// Setup hover listener
function setupHoverListener(): void {
  if (!container.value || !animation) return;

  container.value.addEventListener('mouseenter', () => {
    log('Hover detected');
    animation?.restart();
  });
}

// Watch for image source changes
watch(() => props.imageSrc, () => {
  log('Image source changed');
  initialized = false;
  initializeProcess();
});

// Component lifecycle
onMounted(() => {
  log('Component mounted');

  // Try to initialize after a short delay to ensure everything is loaded
  setTimeout(() => {
    if (!initialized) {
      log('Delayed initialization');
      initializeProcess();
    }
  }, 200);
});

onUnmounted(() => {
  log('Component unmounting');
  if (animation) {
    animation.kill();
  }
});

// Expose methods to parent component
const exposedMethods: SketchImageMethods = {
  play: () => {
    log('Play method called');
    if (animation) animation.play(0);
  },
  pause: () => {
    log('Pause method called');
    if (animation) animation.pause();
  },
  restart: () => {
    log('Restart method called');
    if (animation) animation.restart();
  },
  forceInitialize: () => {
    log('Force initialize called');
    initialized = false;
    initializeProcess();
  }
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
}

.debug-info {
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  font-family: monospace;
  z-index: 10;
}
</style>
