import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Layout from '@/layout/MainLayout.vue'

// 导入路由模块
import assurance from './modules/assurance'
import policy from './modules/policy'
import risk from './modules/risk'
import promotion from './modules/promotion'
import database from './modules/database'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页'
                }
            }
        ]
    },
    assurance,
    policy,
    risk,
    promotion,
    database

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 