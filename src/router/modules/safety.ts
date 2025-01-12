import Layout from '@/layout/MainLayout.vue'

export default {
  path: '/policy',
  component: Layout,
  name: 'Policy',
  meta: {
    title: '安全政策',
    icon: 'Shield'
  },
  children: [
    {
      path: 'commitment',
      name: 'PolicyCommitment',
      component: () => import('@/views/policy/commitment/index.vue'),
      meta: {
        title: '管理者承诺'
      }
    },
    {
      path: 'responsibility',
      name: 'PolicyResponsibility',
      component: () => import('@/views/policy/responsibility/index.vue'),
      meta: {
        title: '安全责任'
      }
    },
    {
      path: 'performance',
      name: 'SafetyPerformance',
      component: () => import('@/views/safety/performance/index.vue'),
      meta: {
        title: '安全绩效监测'
      }
    },
    {
      path: 'change',
      name: 'ChangeManagement',
      component: () => import('@/views/safety/change/index.vue'),
      meta: {
        title: '变更管理'
      }
    },
    {
      path: 'improvement',
      name: 'ContinuousImprovement',
      component: () => import('@/views/safety/improvement/index.vue'),
      meta: {
        title: '持续改进'
      }
    },
    {
      path: 'info',
      name: 'SafetyInfo',
      component: () => import('@/views/safety/info/index.vue'),
      meta: {
        title: '信息管理'
      },
      children: [
        {
          path: 'voluntary',
          name: 'VoluntaryReport',
          component: () => import('@/views/safety/info/VoluntaryReport.vue'),
          meta: {
            title: '自愿报告'
          }
        },
        {
          path: 'mandatory',
          name: 'MandatoryReport',
          component: () => import('@/views/safety/info/MandatoryReport.vue'),
          meta: {
            title: '强制报告'
          }
        }
      ]
    }
  ]
} 