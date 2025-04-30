import { createAuthGuard } from '@auth0/auth0-vue'


export const privateRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/admin/views/Admin.vue'),
    beforeEnter: createAuthGuard(),
    children: [
      {
        path: 'home',
        name: 'home-portal',
        component: () => import('@/admin/views/HomePortal.vue')
      },
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
      },
      {
        path: 'employees',
        name: 'employees',
        component: () => import('@/admin/views/Employees.vue')
      },
      {
        path: 'movements',
        name: 'movements',
        component: () => import('@/admin/views/Movements.vue')
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/admin/views/Settings.vue')
      },
      {
        path: 'debts',
        name: 'debts',
        component: () => import('@/admin/views/Debts.vue')
      },
      {
        path: 'cash-flow',
        name: 'cash-flow',
        component: () => import('@/admin/views/CashFlow.vue')
      }
    ]
  }
]