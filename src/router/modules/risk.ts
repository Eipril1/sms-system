import Layout from '@/layout/MainLayout.vue'

export default {
  path: '/risk',
  component: Layout,
  name: 'Risk',
  meta: {
    title: '安全风险管理',
    icon: 'Warning'
  },
  children: [
    {
      path: 'assessment',
      name: 'RiskAssessment',
      component: () => import('@/views/risk/Assessment.vue'),
      meta: {
        title: '风险识别与评估'
      }
    },
    {
      path: 'control',
      name: 'RiskControl',
      component: () => import('@/views/risk/RiskControl.vue'),
      meta: {
        title: '风险控制与跟踪'
      }
    }
  ]
} 