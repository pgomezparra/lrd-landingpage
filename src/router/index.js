import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/home/views/Home.vue'
import Admissions from '@/admissions/views/Admissions.vue'
import Gallery from '@/gallery/views/Gallery.vue'
import Institutional from '@/home/components/documents/Institutional.vue'

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
    },
    {
      path: '/pqr',
      name: 'pqr',
      component: () => import('@/pqr/context/views/Pqr.vue')
    },
    {
      path: '/school-supply-lists',
      name: 'school-supply-lists',
      component: () => import('@/home/components/announcements/SupplyLists.vue')
    },
    {
      path: '/institutional',
      name: 'institutional',
      component: Institutional
    }
  ]
})

router.afterEach(() => {
  document.getElementById('container').scrollTop = 0
})

export default router
