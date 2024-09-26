import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/home/views/Home.vue'
import Admissions from '@/admissions/views/Admissions.vue'
import Gallery from '@/gallery/views/Gallery.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/admissions',
      name: 'admissions',
      component: Admissions
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: Gallery
    }
  ]
})

router.afterEach(() => {
  document.getElementById('container').scrollTop = 0
})

export default router
