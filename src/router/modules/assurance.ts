export default {
  path: '/assurance',
  component: () => import('@/layout/MainLayout.vue'),
  meta: { title: '安全保证' },
  children: [
    {
      path: 'performance',
      component: () => import('@/views/assurance/Performance.vue'),
      meta: { title: '安全绩效评估与监测' }
    },
    {
      path: 'change',
      component: () => import('@/views/assurance/Change.vue'),
      meta: { title: '变更管理' }
    },
    {
      path: 'improvement',
      component: () => import('@/views/assurance/Improvement.vue'),
      meta: { title: 'SMS持续改进' }
    }
  ]
} 