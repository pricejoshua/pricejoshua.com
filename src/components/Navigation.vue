<template>
  <nav class="navbar">
    <div class="hamburger" :class="{ open: isMenuOpen }" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <transition name="menu">
      <div v-if="isMenuOpen" class="menu">
        <div class="menu-container">
          <ul class="menu-items">
            <li v-for="(item, index) in menuItems" :key="index">
              <router-link :to="item.path" @click="closeMenu">
                <span class="menu-number">{{ item.meta && item.meta.pageNumber || '' }}</span>
                <span class="menu-title">{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hamburger {
  position: fixed;
  top: calc(var(--spacing-unit) * 5);
  left: calc(var(--spacing-unit) * 5);
  background-color: var(--color-black);
  width: 30px;
  height: 25px;
  cursor: pointer;
  z-index: 1100;  /* Ensure it's above the menu */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: var(--color-white);
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.open span {
  background-color: var(--color-white);
}

.hamburger.open span:nth-child(1) {
  transform: translateY(11px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-11px) rotate(-45deg);
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

/* Menu transition animations */
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
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
