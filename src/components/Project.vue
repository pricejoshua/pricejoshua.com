<template>
  <div class="project" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="project-image-container">
      <img :src="image" :alt="title" class="project-image" />
      <div class="project-overlay" :class="{ active: isHovered }">
        <div class="project-details">
          <h3 class="project-title">{{ title }}</h3>
          <p class="project-description">{{ description }}</p>
          <div v-if="link" class="project-link">
            <a :href="link" target="_blank" rel="noopener noreferrer">View Project</a>
          </div>
        </div>
      </div>
    </div>
    <div class="project-info">
      <h3 class="project-title">{{ title }}</h3>
      <p class="project-category">{{ category }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Coding'
  },
  link: {
    type: String,
    default: ''
  }
});

const isHovered = ref(false);
</script>

<style scoped>
.project {
  margin: 1rem;
  width: 100%;
  max-width: 350px;
  transition: transform 0.3s ease;
}

.project:hover {
  transform: translateY(-5px);
}

.project-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  aspect-ratio: 16 / 9;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project:hover .project-image {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-overlay.active {
  opacity: 1;
}

.project-details {
  padding: 1.5rem;
  color: white;
  text-align: center;
}

.project-info {
  padding: 1rem 0;
}

.project-title {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.project-category {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
}

.project-description {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.project-link {
  margin-top: 1rem;
}

.project-link a {
  color: var(--accent-color, #fff);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid var(--accent-color, #fff);
  border-radius: 4px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.project-link a:hover {
  background: var(--accent-color, #fff);
  color: #000;
}
</style>
