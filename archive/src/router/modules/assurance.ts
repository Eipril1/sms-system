import Layout from '@/layout/MainLayout.vue'

export default {
    path: '/assurance',
    component: Layout,
    name: 'Assurance',
    meta: {title: '安全保证', icon: 'CircleCheckFilled'},
    children: [
        {
            path: 'monitoring',
            name: 'Monitoring',
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
            meta: {title: '监督审核', icon: 'Check'}
        }
    ]
} 