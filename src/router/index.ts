import {createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import Layout from '@/layout/MainLayout.vue'

// 导入路由模块
import assurance from './modules/assurance'
import policy from './modules/policy'
import risk from './modules/risk'
import promotion from './modules/promotion'
import database from './modules/database'
import riskManagement from "./modules/risk-management"
import correction from './modules/correction'
import supervision from './modules/supervision'
import system from './modules/system'  // 确保导入系统管理模块

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
    database,
    riskManagement,
    supervision,
    correction,  // 纠正预防模块
    system,      // 系统管理模块
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error/404.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 