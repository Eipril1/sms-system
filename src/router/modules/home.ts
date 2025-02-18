import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/MainLayout.vue'

const home: RouteRecordRaw = {
  path: '/',
  component: Layout,
  redirect: '/home',
  children: [
    {
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
        icon: 'HomeFilled'
      }
    }
  ]
}

export default home 