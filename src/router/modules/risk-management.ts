import type {RouteRecordRaw} from 'vue-router'
import Layout from '@/layout/MainLayout.vue'

const riskManagement: RouteRecordRaw = {
    path: '/risk-management',
    component: Layout,
    name: 'RiskManagement',
    meta: {title: '风险管理', icon: 'Warning'},
    children: [
        {
            path: 'hazard-query',
            name: 'HazardQuery',
            component: () => import('@/views/risk-management/hazard-query/index.vue'),
            meta: {title: '危险源查询', icon: 'Search'}
        },
        {
            path: 'hazard-dynamic',
            name: 'HazardDynamic',
            component: () => import('@/views/risk-management/hazard-dynamic/index.vue'),
            meta: {title: '危险源管理动态变化', icon: 'DataLine'}
        },
        {
            path: 'evaluation-standards',
            name: 'EvaluationStandards',
            component: () => import('@/views/risk-management/evaluation-standards/index.vue'),
            meta: {title: '风险评价标准', icon: 'Files'}
        },
        {
            path: 'management-plan',
            name: 'ManagementPlan',
            component: () => import('@/views/risk-management/management-plan/index.vue'),
            meta: {title: '风险管理方案', icon: 'Document'}
        },
        {
            path: 'safety-control',
            name: 'SafetyControl',
            component: () => import('@/views/risk-management/safety-control/index.vue'),
            meta: {title: '安全隐患动态控制', icon: 'Monitor'}
        }
    ]
}

export default riskManagement 