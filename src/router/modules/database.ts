import Layout from '@/layout/MainLayout.vue'

export default {
    path: '/database',
    component: Layout,
    name: 'Database',
    meta: {
        title: '数据库管理',
        icon: 'DataLine'
    },
    children: [
        {
            path: 'hazard',
            name: 'HazardLibrary',
            component: () => import('@/views/database/HazardLibrary.vue'),
            meta: {
                title: '危险源库',
                icon: 'Warning'
            }
        },
        {
            path: 'hidden-danger',
            name: 'HiddenDangerLibrary',
            component: () => import('@/views/database/HiddenDangerLibrary.vue'),
            meta: {
                title: '隐患库',
                icon: 'CircleClose'
            }
        },
        {
            path: 'findings',
            name: 'FindingsLibrary',
            component: () => import('@/views/database/FindingsLibrary.vue'),
            meta: {
                title: '发现项库',
                icon: 'Search'
            }
        },
        {
            path: 'checklist',
            name: 'ChecklistLibrary',
            component: () => import('@/views/database/ChecklistLibrary.vue'),
            meta: {
                title: '检查单库',
                icon: 'Document'
            }
        },
        {
            path: 'self-inspection',
            name: 'SelfInspectionLibrary',
            component: () => import('@/views/database/SelfInspectionLibrary.vue'),
            meta: {
                title: '自查库',
                icon: 'List'
            }
        },
        {
            path: 'performance',
            name: 'PerformanceLibrary',
            component: () => import('@/views/database/PerformanceLibrary.vue'),
            meta: {
                title: '绩效指标库',
                icon: 'TrendCharts'
            }
        }
    ]
}