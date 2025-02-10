import type {RouteRecordRaw} from 'vue-router'
import Layout from '@/layout/MainLayout.vue'

const correction: RouteRecordRaw = {
    path: '/correction',
    component: Layout,
    name: 'Correction',
    meta: {title: '纠正预防', icon: 'Warning'},
    children: [
        {
            path: 'task-assignment',
            name: 'TaskAssignment',
            component: () => import('@/views/correction/task-assignment/index.vue'),
            meta: {title: '工作任务分配', icon: 'Document'}
        },
        {
            path: 'issue-discovery',
            name: 'IssueDiscovery',
            component: () => import('@/views/correction/issue-discovery/index.vue'),
            meta: {title: '发现问题', icon: 'Search'}
        },
        {
            path: 'tracking-verification',
            name: 'TrackingVerification',
            component: () => import('@/views/correction/tracking-verification/index.vue'),
            meta: {title: '跟踪验证', icon: 'View'}
        }
    ]
}

export default correction 