<template>
  <section class="section work-experience">
    <div class="page-number">{{ $route.meta.pageNumber }}</div>
    <div class="container">
      <h2 class="section-title text-reveal" ref="sectionTitle">
        <span class="text-reveal-inner">EXPERIENCE</span>
      </h2>

      <div class="work-content grid">
        <div class="work-column" ref="agencyColumn">
          <h3 class="work-title">Jobs</h3>

          <div class="work-item">
            <h4>EWERT ENERGY SYSTEMS</h4>
            <a class="work-position">— Software Developer for Test Equipment</a>
            <p class="work-period">(2023-Present)</p>
          </div>

          <div class="work-item">
            <h4>PEACEGENERATION INDONESIA</h4>
            <p class="work-position">— Website Developer</p>
            <p class="work-period">(2022)</p>
          </div>

          <div class="work-item">
            <h4>WHEATON COLLEGE</h4>
            <p class="work-position">— Computer Science Lab Assistant</p>
            <p class="work-period">(2023)</p>
            <p class="work-position">— Resident Assistant</p>
            <p class="work-period">(2022-2023)</p>
          </div>
        </div>

        <div class="work-column" ref="hackathonColumn">
          <h3 class="work-title">Hackathon Projects</h3>

          <div class="work-item">
            <a><h4>#HACK CHICAGO</h4></a>
            <p class="work-position">Spiritual Discipline Tracking App</p>
            <p class="work-period">(2024)</p>
          </div>

          <div class="work-item">
            <a><h4>GLOO AI AND THE CHURCH HACKATHON</h4></a>
            <p class="work-position">SarAIh</p>
            <p class="work-period">(2024)</p>
          </div>

          <div class="work-item">
            <a><h4>GLOO AI AND THE CHURCH HACKATHON</h4></a>
            <p class="work-position">Spark AI</p>
            <p class="work-period">(2023)</p>
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
