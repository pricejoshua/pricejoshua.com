import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import type { ProjectData } from '../types/types'

const projects: ProjectData[] = [
  {
    id: '1',
    title: 'Project 1',
    description: 'Description of Project 1',
    image: 'path/to/image1.jpg',
    category: 'Category 1',
    link: 'https://example.com/project1'
  },
  {
    id: '2',
    title: 'Project 2',
    description: 'Description of Project 2',
    image: 'path/to/image2.jpg',
    category: 'Category 2',
    link: 'https://example.com/project2'
  }
]

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
    meta: { pageNumber: '05' }
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
