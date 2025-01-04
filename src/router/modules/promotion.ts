export default {
  path: '/promotion',
  component: () => import('@/layout/MainLayout.vue'),
  meta: { title: '安全促进' },
  children: [
    {
      path: 'training',
      component: () => import('@/views/promotion/Training.vue'),
      meta: { title: '安全培训和教育' }
    },
    {
      path: 'communication',
      component: () => import('@/views/promotion/Communication.vue'),
      meta: { title: '安全交流' }
    }
  ]
} 