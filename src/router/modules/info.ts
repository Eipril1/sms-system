export default {
  path: 'info',
  component: () => import('@/views/assurance/info/index.vue'),
  meta: { title: '信息管理' },
  children: [
    {
      path: 'voluntary',
      component: () => import('@/views/assurance/info/VoluntaryReport.vue'),
      meta: { title: '自愿报告' }
    },
    {
      path: 'mandatory',
      component: () => import('@/views/assurance/info/MandatoryReport.vue'),
      meta: { title: '强制报告' }
    }
  ]
} 