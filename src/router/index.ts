import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { pageNumber: '01' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import("../views/About.vue"),
    meta: { pageNumber: '02' }
  },
  {
    path: '/work-experience',
    name: 'WorkExperience',
    component: () => import("../views/WorkExperience.vue"),
    meta: { pageNumber: '03' }
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import("../views/Skills.vue"),
    meta: { pageNumber: '04' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import("../views/Projects.vue"),
    meta: { pageNumber: '06' }
  },
  // {
  //   path: '/contact',
  //   name: 'Contact',
  //   component: Contact,
  //   meta: { pageNumber: '07' }
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router