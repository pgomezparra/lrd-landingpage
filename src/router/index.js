import { createRouter, createWebHistory } from 'vue-router'
import { publicRoutes } from '@/router/publicRoutes.js'
import { privateRoutes } from '@/router/privateRoutes.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...privateRoutes]
})

router.afterEach(() => {
  document.getElementById('container').scrollTop = 0
})

export default router
