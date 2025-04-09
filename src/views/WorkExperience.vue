<template>
  <section class="section work-experience">
    <div class="page-number">{{ $route.meta.pageNumber }}</div>
    <div class="container">
      <h2 class="section-title text-reveal" ref="sectionTitle">
        <span class="text-reveal-inner">WORK EXPERIENCE</span>
      </h2>

      <div class="work-content grid">
        <div class="work-column" ref="agencyColumn">
          <h3 class="work-title">Agency Work</h3>

          <div class="work-item">
            <h4>GRAYERVILLE GRAPHIC STUDIO</h4>
            <p class="work-position">— HEAD OF CREATIVES</p>
            <p class="work-period">(2020-2022)</p>
            <p class="work-position">— ART DIRECTOR</p>
            <p class="work-period">(2018-2020)</p>
          </div>

          <div class="work-item">
            <h4>JKLI DESIGN STUDIO</h4>
            <p class="work-position">— Senior Designer</p>
            <p class="work-period">(2016-2018)</p>
            <p class="work-position">— Junior Designer</p>
            <p class="work-period">(2015-2016)</p>
          </div>
        </div>

        <div class="work-column" ref="freelanceColumn">
          <h3 class="work-title">Freelance Work</h3>

          <div class="work-item">
            <h4>FULL-TIME ILLUSTRATOR</h4>
            <p class="work-period">(2022-PRESENT)</p>
          </div>

          <div class="work-item">
            <h4>PART-TIME GRAPHIC DESIGNER & ILLUSTRATOR</h4>
            <p class="work-period">(2021-2022)</p>
          </div>

          <div class="work-image image-hover">
            <!-- <img src="/images/works/laptop.jpg" alt="Designer working on laptop" /> -->
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
  name: 'WorkExperience',
  setup() {
    const sectionTitle = ref(null)
    const agencyColumn = ref(null)
    const freelanceColumn = ref(null)

    onMounted(() => {
      // GSAP animation
      const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } })

      tl.to(sectionTitle.value.querySelector('.text-reveal-inner'), {
        y: 0,
        delay: 0.2
      })
      .from(agencyColumn.value.querySelectorAll('.work-item'), {
        opacity: 0,
        y: 20,
        stagger: 0.2
      }, '-=0.5')
      .from(freelanceColumn.value.querySelectorAll('.work-item'), {
        opacity: 0,
        y: 20,
        stagger: 0.2
      }, '-=0.8')
      .from('.work-image', {
        opacity: 0,
        y: 30
      }, '-=0.5')
    })

    return {
      sectionTitle,
      agencyColumn,
      freelanceColumn
    }
  }
}
</script>

<style scoped>
.work-experience {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.work-content {
  align-items: flex-start;
}

.work-title {
  font-family: var(--font-heading);
  font-style: italic;
  margin-bottom: calc(var(--spacing-unit) * 6);
}

.work-item {
  margin-bottom: calc(var(--spacing-unit) * 6);
}

.work-item h4 {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: calc(var(--spacing-unit) * 1);
}

.work-position {
  font-weight: 500;
  margin-bottom: 0;
}

.work-period {
  margin-bottom: calc(var(--spacing-unit) * 2);
  opacity: 0.7;
}

.work-image {
  margin-top: calc(var(--spacing-unit) * 6);
  overflow: hidden;
}

.work-image img {
  width: 100%;
  display: block;
}

@media (max-width: 768px) {
  .work-column:first-child {
    margin-bottom: calc(var(--spacing-unit) * 8);
  }
}
</style>