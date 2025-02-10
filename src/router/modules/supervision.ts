import Layout from '@/layout/MainLayout.vue'

export default {
    path: '/supervision',
    component: Layout,
    name: 'Supervision',
    meta: {title: '安全与质量监督审核', icon: 'Monitor'},
    children: [
        {
            path: 'audit',
            name: 'CompanyAudit',
            component: () => import('@/views/supervision/audit/index.vue'),
            meta: {title: '公司/部门监察与审核', icon: 'Aim'}
        },
        {
            path: 'safety-production',
            name: 'SafetyProduction',
            component: () => import('@/views/supervision/safety-production/index.vue'),
            meta: {title: '安全生产过程管理', icon: 'SetUp'}
        }
    ]
} 