export default {
  path: '/risk',
  component: () => import('@/layout/MainLayout.vue'),
  meta: { title: '安全风险管理' },
  children: [
    {
      path: 'identification',
      component: () => import('@/views/risk/Identification.vue'),
      meta: { title: '危险源识别' }
    },
    {
      path: 'assessment',
      component: () => import('@/views/risk/Assessment.vue'),
      meta: { title: '安全风险评价和控制' }
    }
  ]
} 