import Layout from '@/layout/MainLayout.vue'
import type { RouteRecordRaw } from 'vue-router'

const policyRoutes: RouteRecordRaw = {
  path: '/policy',
  component: Layout,
  name: 'Policy',
  meta: {
    title: '政策管理',
    icon: 'Document'
  },
  children: [
    {
      path: 'commitment',
      name: 'Commitment',
      component: () => import('@/views/policy/commitment/index.vue'),
      meta: {
        title: '管理者承诺',
        icon: 'UserFilled'
      },
      redirect: '/policy/commitment/policy',
      children: [
        {
          path: 'policy',
          name: 'CommitmentPolicy',
          component: () => import('@/views/policy/commitment/policy/index.vue'),
          meta: {
            title: '安全政策管理',
            icon: 'Shield'
          }
        },
        {
          path: 'target',
          name: 'CommitmentTarget',
          component: () => import('@/views/policy/commitment/target/index.vue'),
          meta: {
            title: '安全目标管理',
            icon: 'List'
          }
        }
      ]
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

export default policyRoutes 