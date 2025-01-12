import type { AppRouteRecordRaw } from '@/types/router'

const databaseRoutes: AppRouteRecordRaw = {
  path: '/database',
  name: 'Database',
  redirect: '/database/hazard',
  meta: {
    title: 'SMS数据库',
    icon: 'DataBase'
  },
  children: [
    {
      path: '/database/hazard',
      name: 'HazardLibrary',
      component: () => import('@/views/database/hazard/index.vue'),
      meta: { title: '危险源库' }
    },
    {
      path: '/database/checklist',
      name: 'ChecklistLibrary',
      component: () => import('@/views/database/checklist/index.vue'),
      meta: { title: '检查单库' }
    },
    {
      path: '/database/findings',
      name: 'FindingsLibrary',
      component: () => import('@/views/database/findings/index.vue'),
      meta: { title: '检查发现库' }
    }
  ]
}

export default databaseRoutes 