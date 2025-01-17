import Layout from '@/layout/MainLayout.vue'

export default {
    path: '/assurance',
    component: Layout,
    name: 'Assurance',
    meta: {title: '安全保证', icon: 'Shield'},
    children: [
        {
            path: 'performance',
            name: 'Performance',
            component: () => import('@/views/assurance/Performance.vue'),
            meta: {title: '安全绩效监测', icon: 'TrendCharts'}
        },
        {
            path: 'change',
            name: 'Change',
            component: () => import('@/views/assurance/Change.vue'),
            meta: {title: '变更管理', icon: 'RefreshRight'}
        },
        {
            path: 'improvement',
            name: 'Improvement',
            component: () => import('@/views/assurance/improvement/index.vue'),
            meta: {title: '持续改进', icon: 'Refresh'}
        },
        {
            path: 'info',
            name: 'Info',
            component: () => import('@/views/assurance/info/index.vue'),
            meta: {title: '信息管理', icon: 'Message'}
        },
        {
            path: 'supervision',
            name: 'Supervision',
            component: () => import('@/views/assurance/supervision/index.vue'),
            redirect: '/assurance/supervision/daily',
            meta: {title: '监督审核', icon: 'Check'},
            children: [
                {
                    path: 'daily',
                    name: 'Daily',
                    component: () => import('@/views/assurance/supervision/daily/index.vue'),
                    redirect: '/assurance/supervision/daily/plan',
                    meta: {title: '日常检查'},
                    children: [
                        {
                            path: 'plan',
                            name: 'CheckPlan',
                            component: () => import('@/views/assurance/supervision/daily/plan/index.vue'),
                            meta: {title: '检查计划'}
                        },
                        {
                            path: 'task',
                            name: 'CheckTask',
                            component: () => import('@/views/assurance/supervision/daily/task/index.vue'),
                            meta: {title: '检查任务'}
                        },
                        {
                            path: 'items',
                            name: 'CheckItems',
                            component: () => import('@/views/assurance/supervision/daily/items/index.vue'),
                            meta: {title: '检查项管理'}
                        }
                    ]
                },
                {
                    path: 'audit',
                    name: 'Audit',
                    component: () => import('@/views/assurance/Audit.vue'),
                    meta: {title: '内部审核'}
                },
                {
                    path: 'investigation',
                    name: 'Investigation',
                    component: () => import('@/views/assurance/Investigation.vue'),
                    meta: {title: '调查分析'}
                }
            ]
        }
    ]
} 