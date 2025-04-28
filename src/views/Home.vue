<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import SketchImage from '@/components/SketchImage.vue'
import profileImage from '@/assets/img/profile-cropped.jpg'
import SketchFilter from '@/components/SketchFilter.vue'

const nameTitle = ref<HTMLElement | null>(null)
const portfolioTitle = ref<HTMLElement | null>(null)
const jobTitle = ref<HTMLElement | null>(null)

onMounted(() => {
  // GSAP animation sequence
  const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } })

  tl.to(nameTitle.value?.querySelector('.text-reveal-inner')!, {
    y: 0,
    delay: 0.2
  })
  .to(portfolioTitle.value?.querySelector('.text-reveal-inner')!, {
    y: 0
  }, '-=0.7')
  .to(jobTitle.value?.querySelector('.text-reveal-inner')!, {
    y: 0
  }, '-=0.7')
})
</script>

<template>
  <section class="section home">
    <div class="page-number">{{ $route.meta.pageNumber }}</div>
    <div class="container">
      <div class="home-content">
        <h1 ref="nameTitle" class="text-reveal">
          <span class="text-reveal-inner">Joshua Price</span>
        </h1>
        <div class="home-image">
          <img :src="profileImage" alt="Joshua Price profile" />
        </div>
        <p ref="jobTitle" class="job-title text-reveal">
          <span class="text-reveal-inner">Coder and Creative</span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.home-content {
  position: relative;
}

h1 {
  margin-bottom: calc(var(--spacing-unit) * 2);
}

.portfolio-title {
  font-size: 8rem;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: calc(var(--spacing-unit) * 3);
}

.job-title {
  font-size: 1.2rem;
  opacity: 0.8;
}

.home-image {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.home-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Overriding text-reveal styles for home page */
.text-reveal {
  overflow: hidden;
}

.text-reveal-inner {
  display: block;
  transform: translateY(100%);
}

@media (max-width: 768px) {
  .portfolio-title {
    font-size: 4rem;
  }

  .home-image {
    width: 200px;
    height: 260px;
  }
}
</style>
