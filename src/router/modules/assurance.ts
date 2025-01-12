import Layout from '@/layout/MainLayout.vue'

export default {
  path: '/assurance',
  component: Layout,
  name: 'Assurance',
  meta: { title: '安全保证' },
  children: [
    {
      path: 'supervision',
      name: 'Supervision',
      component: () => import('@/views/assurance/supervision/index.vue'),
      redirect: '/assurance/supervision/daily',
      meta: { title: '监督审核' },
      children: [
        {
          path: 'daily',
          name: 'Daily',
          component: () => import('@/views/assurance/supervision/daily/index.vue'),
          redirect: '/assurance/supervision/daily/plan',
          meta: { title: '日常检查' },
          children: [
            {
              path: 'plan',
              name: 'CheckPlan',
              component: () => import('@/views/assurance/supervision/daily/plan/index.vue'),
              meta: { title: '检查计划' }
            },
            {
              path: 'task',
              name: 'CheckTask',
              component: () => import('@/views/assurance/supervision/daily/task/index.vue'),
              meta: { title: '检查任务' }
            },
            {
              path: 'items',
              name: 'CheckItems',
              component: () => import('@/views/assurance/supervision/daily/items/index.vue'),
              meta: { title: '检查项管理' }
            }
          ]
        }
      ]
    }
  ]
} 