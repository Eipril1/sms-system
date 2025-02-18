import Layout from '@/layout/MainLayout.vue'
import type { RouteRecordRaw } from 'vue-router'

const assuranceRoutes: RouteRecordRaw = {
    path: '/assurance',
    component: Layout,
    name: 'Assurance',
    meta: {title: '安全保证', icon: 'Shield'},
    children: [
        {
            path: 'performance',
            name: 'Performance',
            component: () => import('@/views/assurance/performance/index.vue'),
            meta: {title: '安全绩效评估与测量', icon: 'TrendCharts'},
            redirect: '/assurance/performance/monitoring',
            children: [
                {
                    path: 'monitoring',
                    name: 'Monitoring',
                    component: () => import('@/views/assurance/performance/monitoring/index.vue'),
                    meta: {title: '安全绩效监测'},
                    redirect: '/assurance/performance/monitoring/home',
                    children: [
                        {
                            path: 'home',
                            name: 'MonitoringHome',
                            component: () => import('@/views/assurance/performance/monitoring/home/index.vue'),
                            meta: {title: '首页'}
                        },
                        {
                            path: 'management',
                            name: 'MonitoringManagement',
                            component: () => import('@/views/assurance/performance/monitoring/management/index.vue'),
                            meta: {title: '安全绩效管理'}
                        },
                        {
                            path: 'report',
                            name: 'MonitoringReport',
                            component: () => import('@/views/assurance/performance/monitoring/report/index.vue'),
                            meta: {title: '安全报告'}
                        },
                        {
                            path: 'investigation',
                            name: 'MonitoringInvestigation',
                            component: () => import('@/views/assurance/performance/monitoring/investigation/index.vue'),
                            meta: {title: '事件调查'}
                        },
                        {
                            path: 'flight-data',
                            name: 'MonitoringFlightData',
                            component: () => import('@/views/assurance/performance/monitoring/flight-data/index.vue'),
                            meta: {title: '飞行数据分析'}
                        },
                        {
                            path: 'system-evaluation',
                            name: 'MonitoringSystemEvaluation',
                            component: () => import('@/views/assurance/performance/monitoring/system-evaluation/index.vue'),
                            meta: {title: '安全信息综合分析和系统评价'}
                        },
                        {
                            path: '',
                            redirect: '/assurance/performance/monitoring/home'
                        }
                    ]
                },
                {
                    path: 'assessment',
                    name: 'Assessment',
                    component: () => import('@/views/assurance/performance/assessment/index.vue'),
                    meta: {title: '安全绩效评估'}
                },
                {
                    path: 'audit',
                    name: 'Audit',
                    component: () => import('@/views/assurance/performance/audit/index.vue'),
                    meta: {title: '内部审核'},
                    children: [
                        {
                            path: 'sms',
                            name: 'SmsAudit',
                            component: () => import('@/views/assurance/performance/audit/sms/index.vue'),
                            meta: {title: 'SMS审核'},
                            children: [
                                {
                                    path: 'plan',
                                    name: 'SmsAuditPlan',
                                    component: () => import('@/views/assurance/performance/audit/sms/AuditPlan.vue'),
                                    meta: {title: '审核计划'}
                                },
                                {
                                    path: 'task',
                                    name: 'SmsAuditTask',
                                    component: () => import('@/views/assurance/performance/audit/sms/AuditTask.vue'),
                                    meta: {title: '审核任务'}
                                }
                            ]
                        },
                        {
                            path: 'safety',
                            name: 'SafetyCheck',
                            component: () => import('@/views/assurance/performance/audit/safety/index.vue'),
                            meta: {title: '安全检查'},
                            children: [
                                {
                                    path: 'plan',
                                    name: 'SafetyCheckPlan',
                                    component: () => import('@/views/assurance/performance/audit/safety/CheckPlan.vue'),
                                    meta: {title: '检查计划'}
                                },
                                {
                                    path: 'task',
                                    name: 'SafetyCheckTask',
                                    component: () => import('@/views/assurance/performance/audit/safety/CheckTask.vue'),
                                    meta: {title: '检查任务'}
                                }
                            ]
                        },
                        {
                            path: '',
                            redirect: '/assurance/performance/audit/sms'
                        }
                    ]
                },
                {
                    path: '',
                    redirect: '/assurance/performance/monitoring'
                }
            ]
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
                    path: 'investigation',
                    name: 'Investigation',
                    component: () => import('@/views/assurance/Investigation.vue'),
                    meta: {title: '调查分析'}
                }
            ]
        },
        {
            path: 'safety-control',
            name: 'SafetyControl',
            component: () => import('@/views/risk/safety-control/index.vue'),
            meta: {title: '安全隐患动态控制', icon: 'Monitor'}
        }
    ]
}

export default assuranceRoutes