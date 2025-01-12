import Layout from '@/layout/MainLayout.vue'

export default {
  path: '/promotion',
  component: Layout,
  name: 'Promotion',
  meta: {
    title: '安全促进',
    icon: 'Promotion'
  },
  children: [
    {
      path: 'training',
      name: 'SafetyTraining',
      component: () => import('@/views/promotion/training/index.vue'),
      meta: {
        title: '安全培训和教育'
      }
    },
    {
      path: 'communication',
      name: 'SafetyCommunication',
      component: () => import('@/views/promotion/communication/index.vue'),
      meta: {
        title: '安全交流'
      }
    }
  ]
} 