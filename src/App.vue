<template>
  <div id="app">
    <Navigation />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
import { onMounted, onUnmounted } from 'vue'

    // Custom cursor implementation
    const updateCursor = (e: MouseEvent) => {
      const cursor = document.querySelector('.custom-cursor') as HTMLElement
      if (cursor) {
        cursor.style.left = `${e.clientX}px`
        cursor.style.top = `${e.clientY}px`
      }
    }

    const handleMouseDown = () => {
      const cursor = document.querySelector('.custom-cursor')
      if (cursor) cursor.classList.add('active')
    }

    const handleMouseUp = () => {
      const cursor = document.querySelector('.custom-cursor')
      if (cursor) cursor.classList.remove('active')
    }

    onMounted(() => {
      // Create custom cursor element
      const cursorElement = document.createElement('div')
      cursorElement.classList.add('custom-cursor')
      document.body.appendChild(cursorElement)

      // Add event listeners
      window.addEventListener('mousemove', updateCursor)
      window.addEventListener('mousedown', handleMouseDown)
      window.addEventListener('mouseup', handleMouseUp)
    })

    onUnmounted(() => {
      // Remove event listeners
      window.removeEventListener('mousemove', updateCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)

      // Remove custom cursor element
      const cursor = document.querySelector('.custom-cursor')
      if (cursor) document.body.removeChild(cursor)
    })
</script>

<style>
@import './assets/styles/main.css';
@import './assets/styles/transitions.css';
</style>
