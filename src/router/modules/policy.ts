export default {
  path: '/policy',
  component: () => import('@/layout/MainLayout.vue'),
  meta: { title: '安全政策和目标' },
  children: [
    {
      path: 'commitment',
      component: () => import('@/views/policy/Commitment.vue'),
      meta: { title: '管理者承诺' }
    },
    {
      path: 'responsibility',
      component: () => import('@/views/policy/Responsibility.vue'),
      meta: { title: '安全责任' }
    },
    {
      path: 'key-personnel',
      component: () => import('@/views/policy/KeyPersonnel.vue'),
      meta: { title: '任命关键安全人员' }
    },
    {
      path: 'emergency',
      component: () => import('@/views/policy/Emergency.vue'),
      meta: { title: '应急预案协调' }
    },
    {
      path: 'sms-doc',
      component: () => import('@/views/policy/SMSDoc.vue'),
      meta: { title: 'SMS文件' }
    }
  ]
} 