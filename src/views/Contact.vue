<template>
  <section class="section contact">
    <div class="page-number">{{ $route.meta.pageNumber }}</div>
    <div class="container">
      <div class="contact-header">
        <h2 class="contact-name">Joshua Price</h2>
      </div>

      <h2 class="section-title text-reveal" ref="sectionTitle">
        <span class="text-reveal-inner">WORK WITH ME</span>
      </h2>

      <div class="contact-content grid">
        <div class="contact-info" ref="contactInfo">
          <a href="mailto:me@pricejoshua.com" class="email-link">
            <p>
            me@pricejoshua.com
            </p>
          </a>
        </div>
        <div class="social-media">
          <a href="https://github.com/pricejoshua" target="_blank" rel="noopener noreferrer">
            <img src="@/assets/img/github.png" alt="GitHub" class="social-icon" />
          </a>
          <a href="https://www.linkedin.com/in/joshuajangprice/" target="_blank" rel="noopener noreferrer">
            <img src="@/assets/img/linkedin.png" alt="LinkedIn" class="social-icon" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

export default {
  name: 'Contact',
  setup() {
    const sectionTitle = ref(null)
    const contactInfo = ref(null)
    const contactImage = ref(null)

    onMounted(() => {
      // GSAP animation
      const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } })

      tl.to(sectionTitle.value.querySelector('.text-reveal-inner'), {
        y: 0,
        delay: 0.2
      })
      .from(contactInfo.value.querySelectorAll('p'), {
        opacity: 0,
        y: 20,
        stagger: 0.1
      }, '-=0.5')
      .from(contactImage.value, {
        opacity: 0,
        y: 30
      }, '-=0.7')
    })

    return {
      sectionTitle,
      contactInfo,
      contactImage
    }
  }
}
</script>

<style scoped>
.contact {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.email-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: bold;
  animation: fadeIn 0.5s ease-in-out;
}

.email-link:hover {
  text-decoration: underline;
}

.contact-header {
  margin-bottom: calc(var(--spacing-unit) * 4);
}

.contact-name {
  font-family: var(--font-heading);
  font-size: 1.8rem;
}

.contact-content {
  margin-top: calc(var(--spacing-unit) * 6);
  align-items: flex-start;
}

.contact-info {
  font-size: 1.5rem;
  line-height: 1.8;
}

.contact-info p {
  margin-bottom: calc(var(--spacing-unit) * 3);
}

.contact-image {
  overflow: hidden;
}

.contact-image img {
  width: 100%;
  transform: rotate(5deg);
  transition: transform 0.5s ease;
}

.contact-image:hover img {
  transform: rotate(0);
}

.social-icon {
  width: 24px;
  height: 24px;
  margin-right: 16px;
}

.social-media {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.social-media a {
  margin-right: 20px;
}

.social-media img, .social-icon {
  width: 30px;
  height: 30px;
}

@media (max-width: 768px) {
  .contact-info {
    font-size: 1.2rem;
    margin-bottom: calc(var(--spacing-unit) * 6);
  }
}
</style>
