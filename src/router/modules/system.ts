import type {RouteRecordRaw} from 'vue-router'
import Layout from '@/layout/MainLayout.vue'

const system: RouteRecordRaw = {
    path: '/system',
    component: Layout,
    redirect: '/system/users',
    name: 'System',
    meta: {title: '系统管理', icon: 'Setting'},
    children: [
        {
            path: 'users',
            name: 'Users',
            component: () => import('@/views/system/users/index.vue'),
            meta: {title: '用户管理', icon: 'User'}
        },
        {
            path: 'roles',
            name: 'Roles',
            component: () => import('@/views/system/roles/index.vue'),
            meta: {title: '角色管理', icon: 'UserFilled'}
        },
        {
            path: 'departments',
            name: 'Departments',
            component: () => import('@/views/system/departments/index.vue'),
            meta: {title: '部门管理', icon: 'OfficeBuilding'}
        },
        {
            path: 'menus',
            name: 'Menus',
            component: () => import('@/views/system/menus/index.vue'),
            meta: {title: '菜单管理', icon: 'Menu'}
        },
        {
            path: 'dict',
            name: 'Dict',
            component: () => import('@/views/system/dict/index.vue'),
            meta: {title: '字典管理', icon: 'Collection'}
        },
        {
            path: 'logs/operation',
            name: 'OperationLog',
            component: () => import('@/views/system/logs/operation/index.vue'),
            meta: {title: '操作日志', icon: 'Operation'}
        },
        {
            path: 'logs/login',
            name: 'LoginLog',
            component: () => import('@/views/system/logs/login/index.vue'),
            meta: {title: '登录日志', icon: 'Key'}
        },
        {
            path: 'homeMg',
            name: 'HomeMg',
            component: () => import('@/views/system/homeMg/index.vue'),
            meta: {
                title: '首页管理',
                icon: 'HomeFilled'
            }
        },
    ]
}

export default system