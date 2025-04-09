<template>
  <nav class="navbar">
    <div class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <transition name="menu">
      <div v-if="isMenuOpen" class="menu">
        <div class="menu-container">
          <div class="menu-header">
            <div class="hamburger open" @click="toggleMenu">
              <span></span>
              <span></span>
            </div>
          </div>
          <ul class="menu-items">
            <li v-for="(item, index) in menuItems" :key="index">
              <router-link :to="item.path" @click="closeMenu">
                <span class="menu-number">{{ item.meta.pageNumber }}</span>
                <span class="menu-title">{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Navigation',
  setup() {
    const router = useRouter()
    const isMenuOpen = ref(false)

    // Get routes for menu items
    const menuItems = router.options.routes

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
      document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
    }

    const closeMenu = () => {
      isMenuOpen.value = false
      document.body.style.overflow = ''
    }

    return {
      isMenuOpen,
      menuItems,
      toggleMenu,
      closeMenu
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--color-black);
  color: var(--color-white);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: calc(var(--spacing-unit) * 10);
}

.menu-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: calc(var(--spacing-unit) * 10);
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.menu-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
}

.menu-items li {
  margin-bottom: calc(var(--spacing-unit) * 5);
  overflow: hidden;
}

.menu-items a {
  font-family: var(--font-heading);
  font-size: 4rem;
  color: var(--color-white);
  text-decoration: none;
  display: flex;
  align-items: baseline;
  transition: color 0.3s ease;
}

.menu-items a:hover {
  color: rgba(255, 255, 255, 0.7);
}

.menu-number {
  font-size: 1.5rem;
  opacity: 0.5;
  margin-right: calc(var(--spacing-unit) * 2);
}

@media (max-width: 768px) {
  .menu-items a {
    font-size: 2.5rem;
  }

  .menu-number {
    font-size: 1rem;
  }
}
</style>