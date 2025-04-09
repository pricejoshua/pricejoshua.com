<template>
  <section class="section about">
    <div class="page-number">{{ $route.meta.pageNumber }}</div>
    <div class="container">
      <h2 class="section-title text-reveal" ref="sectionTitle">
        <span class="text-reveal-inner">A LITTLE ABOUT ME</span>
      </h2>

      <div class="about-content grid">
        <div class="about-text">
          <p class="about-description" ref="aboutDescription">
            I am a digital nomad currently based in Hong Kong. I've been working in graphic design for the past ten years. It was only in the past three that I decided to focus full-time on illustrating.
          </p>
        </div>

        <div class="about-images">
          <div class="about-image image-hover">
            <!-- <img src="/images/about.jpg" alt="Designer at work" /> -->
          </div>
          <div class="about-image-small image-hover">
            <!-- <img src="/images/about.jpg" alt="Designer at desk" /> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

export default {
  name: 'About',
  setup() {
    const sectionTitle = ref(null)
    const aboutDescription = ref(null)

    onMounted(() => {
      // GSAP animation
      const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } })

      tl.to(sectionTitle.value.querySelector('.text-reveal-inner'), {
        y: 0,
        delay: 0.2
      })
      .from(aboutDescription.value, {
        opacity: 0,
        y: 20
      }, '-=0.5')
      .from('.about-image', {
        opacity: 0,
        y: 30,
        stagger: 0.2
      }, '-=0.8')
    })

    return {
      sectionTitle,
      aboutDescription
    }
  }
}
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.about-content {
  align-items: center;
}

.about-text {
  padding-right: calc(var(--spacing-unit) * 5);
}

.about-description {
  font-size: 1.4rem;
  line-height: 1.6;
}

.about-images {
  position: relative;
}

.about-image {
  width: 100%;
  margin-bottom: calc(var(--spacing-unit) * 4);
  overflow: hidden;
}

.about-image-small {
  width: 70%;
  margin-left: auto;
  overflow: hidden;
}

.about-image img,
.about-image-small img {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 768px) {
  .about-text {
    padding-right: 0;
    margin-bottom: calc(var(--spacing-unit) * 5);
  }

  .about-description {
    font-size: 1.2rem;
  }
}
</style>