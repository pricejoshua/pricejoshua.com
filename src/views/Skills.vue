<template>
  <section class="section skills">
    <div class="page-number">{{ $route.meta.pageNumber }}</div>
    <div class="container">
      <h2 class="section-title text-reveal" ref="sectionTitle">
        <span class="text-reveal-inner">SKILLS & EXPERTISE</span>
      </h2>

      <div class="skills-content grid">
        <div class="skills-image image-hover" ref="skillsImage">
          <!-- <img src="/images/skills.jpg" alt="Designer drawing on tablet" /> -->
        </div>

        <div class="skills-list">
          <div class="skills-category" ref="devSkills">
            <h3 class="skills-category-title">Skills</h3>
            <ul>
              <li>— Web Development</li>
              <li>— Microcontroller Programming</li>
              <li>— Machine Learning</li>
              <li>— Computational Linguistics</li>
              <li>— Large Language Models</li>
            </ul>
          </div>
          <div class="skills-category" ref="programmingLanguages">
            <h3 class="skills-category-title">Programming Languages</h3>
            <ul>
              <li>— Java</li>
              <li>— C</li>
              <li>— JavaScript</li>
              <li>— TypeScript</li>
              <li>— Python</li>
            </ul>
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
  name: 'Skills',
  setup() {
    const sectionTitle = ref(null)
    const skillsImage = ref(null)
    const graphicDesign = ref(null)
    const illustration = ref(null)

    onMounted(() => {
      // GSAP animation
      const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } })

      tl.to(sectionTitle.value.querySelector('.text-reveal-inner'), {
        y: 0,
        delay: 0.2
      })
      .from(skillsImage.value, {
        opacity: 0,
        x: -30
      }, '-=0.5')
      .from(graphicDesign.value, {
        opacity: 0,
        y: 20
      }, '-=0.5')
      .from(graphicDesign.value.querySelectorAll('li'), {
        opacity: 0,
        x: 20,
        stagger: 0.1
      }, '-=0.5')
      .from(illustration.value, {
        opacity: 0,
        y: 20
      }, '-=0.3')
      .from(illustration.value.querySelectorAll('li'), {
        opacity: 0,
        x: 20,
        stagger: 0.1
      }, '-=0.5')
    })

    return {
      sectionTitle,
      skillsImage,
      graphicDesign,
      illustration
    }
  }
}
</script>

<style scoped>
.skills {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.skills-image {
  overflow: hidden;
}

.skills-image img {
  width: 100%;
  display: block;
}

.skills-list {
  padding-left: calc(var(--spacing-unit) * 5);
}

.skills-category {
  margin-bottom: calc(var(--spacing-unit) * 8);
}

.skills-category-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  margin-bottom: calc(var(--spacing-unit) * 4);
}

.skills-category ul {
  list-style: none;
}

.skills-category li {
  font-size: 1.1rem;
  margin-bottom: calc(var(--spacing-unit) * 2);
}

@media (max-width: 768px) {
  .skills-list {
    padding-left: 0;
    margin-top: calc(var(--spacing-unit) * 6);
  }

  .skills-category-title {
    font-size: 1.5rem;
  }
}
</style>
