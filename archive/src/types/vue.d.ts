/// <reference types="vite/client" />
/// <reference types="element-plus/global" />

import type {DefineComponent, ComponentPublicInstance} from '@vue/runtime-core'

// Vue 组件声明
declare module '*.vue' {
    const component: DefineComponent<{}, {}, any>
    export default component
}

// Element Plus 类型声明
declare module 'element-plus' {
    export interface FormInstance extends ComponentPublicInstance {
        validate: (callback?: (valid: boolean) => void) => Promise<boolean>
        resetFields: () => void
        scrollToField: (prop: string) => void
    }

    export interface FormRules {
        [key: string]: Array<{
            required?: boolean
            message?: string
            trigger?: string | string[]
            min?: number
            max?: number
            type?: string
            validator?: (rule: any, value: any, callback: any) => void
        }>
    }
}

// Vue 全局组件声明
declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        RouterLink: typeof import('vue-router')['RouterLink']
        RouterView: typeof import('vue-router')['RouterView']
        // Element Plus 组件
        ElButton: typeof import('element-plus/es')['ElButton']
        ElDialog: typeof import('element-plus/es')['ElDialog']
        ElForm: typeof import('element-plus/es')['ElForm']
        ElFormItem: typeof import('element-plus/es')['ElFormItem']
        ElInput: typeof import('element-plus/es')['ElInput']
        ElSelect: typeof import('element-plus/es')['ElSelect']
        ElOption: typeof import('element-plus/es')['ElOption']
        ElTable: typeof import('element-plus/es')['ElTable']
        ElTableColumn: typeof import('element-plus/es')['ElTableColumn']
        ElTag: typeof import('element-plus/es')['ElTag']
        ElPagination: typeof import('element-plus/es')['ElPagination']
        ElUpload: typeof import('element-plus/es')['ElUpload']
        ElDatePicker: typeof import('element-plus/es')['ElDatePicker']
        ElTimePicker: typeof import('element-plus/es')['ElTimePicker']
        ElDescriptions: typeof import('element-plus/es')['ElDescriptions']
        ElDescriptionsItem: typeof import('element-plus/es')['ElDescriptionsItem']
        ElContainer: typeof import('element-plus/es')['ElContainer']
        ElAside: typeof import('element-plus/es')['ElAside']
        ElHeader: typeof import('element-plus/es')['ElHeader']
        ElMain: typeof import('element-plus/es')['ElMain']
        ElMenu: typeof import('element-plus/es')['ElMenu']
        ElSubMenu: typeof import('element-plus/es')['ElSubMenu']
        ElMenuItem: typeof import('element-plus/es')['ElMenuItem']
        ElBreadcrumb: typeof import('element-plus/es')['ElBreadcrumb']
        ElBreadcrumbItem: typeof import('element-plus/es')['ElBreadcrumbItem']
        ElDropdown: typeof import('element-plus/es')['ElDropdown']
        ElDropdownMenu: typeof import('element-plus/es')['ElDropdownMenu']
        ElDropdownItem: typeof import('element-plus/es')['ElDropdownItem']
        ElIcon: typeof import('element-plus/es')['ElIcon']
        ElAvatar: typeof import('element-plus/es')['ElAvatar']
        ElTabs: typeof import('element-plus/es')['ElTabs']
        ElTabPane: typeof import('element-plus/es')['ElTabPane']
        ElButtonGroup: typeof import('element-plus/es')['ElButtonGroup']
    }
}

// 其他模块声明
declare module '@element-plus/icons-vue'
declare module 'element-plus/dist/locale/zh-cn.mjs'

declare module 'vue' {
    export {ref, computed, watch, onMounted, reactive} from '@vue/runtime-core'
} 