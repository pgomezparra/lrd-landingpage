import { validateRegisteredUser } from '@/router/middleware/guards.js'
import { createAuthGuard } from '@auth0/auth0-vue'


export const privateRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/admin/views/Admin.vue'),
    beforeEnter: [createAuthGuard(), validateRegisteredUser],
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/admin/views/Dashboard.vue')
      },
      {
        path: 'payments',
        name: 'payments',
        component: () => import('@/admin/views/Payments.vue')
      },
      {
        path: 'news',
        name: 'news',
        component: () => import('@/admin/views/News.vue')
      },
      {
        path: 'announcements',
        name: 'announcements',
        component: () => import('@/admin/views/Announcements.vue')
      },
      {
        path: 'students',
        name: 'students',
        component: () => import('@/admin/views/Students.vue')
      }
      // {
      //   path: 'settings',
      //   name: 'admin-settings',
      //   component: () => import('@/views/admin/Settings.vue')
      // }
    ]
  }
]