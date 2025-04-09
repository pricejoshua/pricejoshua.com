<!-- src/views/Projects.vue -->
<template>
  <section class="section other-projects">
    <div class="page-number">{{ $route.meta.pageNumber }}</div>
    <div class="container">
      <h2 class="section-title text-reveal" ref="sectionTitle">
        <span class="text-reveal-inner">OTHER PROJECTS</span>
      </h2>

      <div class="project-description-text" ref="projectDescription">
        <p>A SAMPLE OF POSTERS AND CARDS CONCEPTUALIZED, DESIGNED, AND CREATED BY ME</p>
      </div>

      <div class="projects-showcase" ref="projectsShowcase">
        <div class="projects-grid">
          <!-- <img src="/images/works/other-projects.jpg" alt="Sample of poster designs" class="projects-collage" /> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const sectionTitle = ref<HTMLElement | null>(null)
const projectDescription = ref<HTMLElement | null>(null)
const projectsShowcase = ref<HTMLElement | null>(null)

onMounted(() => {
  // GSAP animation
  const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } })

  if (sectionTitle.value) {
    tl.to(sectionTitle.value.querySelector('.text-reveal-inner'), {
      y: 0,
    })
      .from(projectDescription.value, {
        opacity: 0,
        y: 20
      }, '-=0.5')
      .from(projectsShowcase.value, {
        opacity: 0,
        y: 30
      }, '-=0.5')
  }
})
</script>

<style scoped>
.other-projects {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.project-description-text {
  text-align: right;
  max-width: 600px;
  margin-left: auto;
  margin-bottom: calc(var(--spacing-unit) * 8);
  font-size: 0.9rem;
}

.projects-showcase {
  margin-top: calc(var(--spacing-unit) * 3);
}

.projects-grid {
  display: flex;
  justify-content: center;
}

.projects-collage {
  width: 100%;
  max-width: 1200px;
  display: block;
}

@media (max-width: 768px) {
  .project-description-text {
    text-align: left;
    margin-bottom: calc(var(--spacing-unit) * 4);
  }
}
</style>
