import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/policy/commitment',
    children: [
      // 安全政策和目标
      {
        path: 'policy',
        redirect: '/policy/commitment',
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
            meta: { title: '关键安全人员' }
          },
          {
            path: 'emergency',
            component: () => import('@/views/policy/Emergency.vue'),
            meta: { title: '应急预案' }
          },
          {
            path: 'sms-doc',
            component: () => import('@/views/policy/SMSDoc.vue'),
            meta: { title: 'SMS文件' },
            children: [
              {
                path: 'regulation',
                component: () => import('@/views/policy/regulation/index.vue'),
                meta: { title: '规章管理' }
              },
              {
                path: 'regulation/compliance/:id',
                component: () => import('@/views/policy/regulation/compliance.vue'),
                meta: { title: '符合性声明' }
              }
            ]
          }
        ]
      },
      // 其他原有路由保持不变...
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 