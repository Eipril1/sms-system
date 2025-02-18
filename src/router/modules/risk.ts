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
    },
    {
      path: 'hazard-query',
      name: 'HazardQuery',
      component: () => import('@/views/risk/hazard-query/index.vue'),
      meta: {title: '危险源查询', icon: 'Search'}
    },
    {
      path: 'hazard-dynamic',
      name: 'HazardDynamic',
      component: () => import('@/views/risk/hazard-dynamic/index.vue'),
      meta: {title: '危险源管理动态变化', icon: 'DataLine'}
    },
    {
      path: 'evaluation-standards',
      name: 'EvaluationStandards',
      component: () => import('@/views/risk/evaluation-standards/index.vue'),
      meta: {title: '风险评价标准', icon: 'Files'}
    },
    {
      path: 'management-plan',
      name: 'ManagementPlan',
      component: () => import('@/views/risk/management-plan/index.vue'),
      meta: {title: '风险管理方案', icon: 'Document'}
    }
  ]
} 