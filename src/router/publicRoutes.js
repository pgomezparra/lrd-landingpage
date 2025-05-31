export const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/home/views/Home.vue')
  },
  {
    path: '/admissions',
    name: 'admissions',
    component: () => import('@/admissions/views/Admissions.vue')
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('@/gallery/views/Gallery.vue')
  },
  {
    path: '/news',
    name: 'public-news',
    component: () => import('@/institutional/views/News.vue')
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
    component: () => import('@/home/components/documents/Institutional.vue')
  },
  {
    path: '/user-not-found',
    name: 'user-not-found',
    component: () => import('@/admin/views/UserNotFound.vue')
  },
  {
    path: '/without-years',
    name: 'without-years',
    component: () => import('@/admin/views/WithoutYears.vue')
  }
]
