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
        title: '管理者承诺',
        icon: 'UserFilled'
      }
    },
    {
      path: 'responsibility',
      name: 'PolicyResponsibility',
      component: () => import('@/views/policy/responsibility/index.vue'),
      meta: {
        title: '安全责任',
        icon: 'List'
      }
    },
    {
      path: 'key-personnel',
      name: 'KeyPersonnel',
      component: () => import('@/views/policy/key-personnel/index.vue'),
      meta: {
        title: '任命关键安全人员',
        icon: 'User'
      }
    },
    {
      path: 'emergency',
      name: 'Emergency',
      component: () => import('@/views/policy/Emergency.vue'),
      meta: {
        title: '应急预案协调',
        icon: 'AlarmClock'
      }
    },
    {
      path: 'sms-doc',
      name: 'SMSDoc',
      component: () => import('@/views/policy/SMSDoc.vue'),
      meta: {
        title: 'SMS文件',
        icon: 'Document'
      }
    }
  ]
} 