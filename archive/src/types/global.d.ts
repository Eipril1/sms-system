import type {RouteLocationNormalizedLoaded, Router} from 'vue-router'
import type {Component, ComponentPublicInstance} from 'vue'

declare global {
    declare module '@vue/runtime-core' {
        interface GlobalComponents {
            RouterView: typeof import('vue-router')['RouterView']
            RouterLink: typeof import('vue-router')['RouterLink']
            // Element Plus Components
            ElContainer: typeof import('element-plus')['ElContainer']
            ElAside: typeof import('element-plus')['ElAside']
            ElHeader: typeof import('element-plus')['ElHeader']
            ElMain: typeof import('element-plus')['ElMain']
            ElMenu: typeof import('element-plus')['ElMenu']
            ElSubMenu: typeof import('element-plus')['ElSubMenu']
            ElMenuItem: typeof import('element-plus')['ElMenuItem']
            ElIcon: typeof import('element-plus')['ElIcon']
            ElButton: typeof import('element-plus')['ElButton']
            ElDialog: typeof import('element-plus')['ElDialog']
            ElForm: typeof import('element-plus')['ElForm']
            ElFormItem: typeof import('element-plus')['ElFormItem']
            ElInput: typeof import('element-plus')['ElInput']
            ElSelect: typeof import('element-plus')['ElSelect']
            ElOption: typeof import('element-plus')['ElOption']
            ElTable: typeof import('element-plus')['ElTable']
            ElTableColumn: typeof import('element-plus')['ElTableColumn']
            ElTag: typeof import('element-plus')['ElTag']
            ElPagination: typeof import('element-plus')['ElPagination']
            ElUpload: typeof import('element-plus')['ElUpload']
            ElDatePicker: typeof import('element-plus')['ElDatePicker']
            ElTimePicker: typeof import('element-plus')['ElTimePicker']
            ElBreadcrumb: typeof import('element-plus')['ElBreadcrumb']
            ElBreadcrumbItem: typeof import('element-plus')['ElBreadcrumbItem']
            ElDropdown: typeof import('element-plus')['ElDropdown']
            ElDropdownMenu: typeof import('element-plus')['ElDropdownMenu']
            ElDropdownItem: typeof import('element-plus')['ElDropdownItem']
            ElAvatar: typeof import('element-plus')['ElAvatar']
            ElDescriptions: typeof import('element-plus')['ElDescriptions']
            ElDescriptionsItem: typeof import('element-plus')['ElDescriptionsItem']
        }

        interface ComponentCustomProperties {
            $route: RouteLocationNormalizedLoaded
            $router: Router
            $refs: {
                [key: string]: ComponentPublicInstance | HTMLElement | null
            }
            $props: {
                [key: string]: any
            }
            $message: typeof import('element-plus')['ElMessage']
            $messageBox: typeof import('element-plus')['ElMessageBox']
            $emit: (event: string, ...args: any[]) => void
        }
    }
}

// Element Plus 类型补充
declare module 'element-plus' {
    export interface FormInstance extends ComponentPublicInstance {
        validate: (callback?: (valid: boolean) => void) => Promise<boolean>
        validateField: (props: string | string[], callback?: (valid: boolean) => void) => Promise<void>
        resetFields: () => void
        scrollToField: (prop: string) => void
    }

    export interface UploadFile {
        name: string
        url: string
        status?: string
        size?: number
        raw?: File
        uid?: number
    }

    export interface UploadInstance extends ComponentPublicInstance {
        upload: (file: File) => void
        abort: (file: UploadFile) => void
        submit: () => void
        clearFiles: () => void
    }

    export interface TableInstance extends ComponentPublicInstance {
        clearSelection: () => void
        toggleRowSelection: (row: any, selected?: boolean) => void
        toggleAllSelection: () => void
        clearSort: () => void
        clearFilter: () => void
        doLayout: () => void
    }

    export interface ElMessage {
        success: (message: string) => void
        warning: (message: string) => void
        error: (message: string) => void
        info: (message: string) => void
    }

    export interface ElMessageBox {
        confirm: (message: string, title?: string, options?: any) => Promise<void>
        alert: (message: string, title?: string, options?: any) => Promise<void>
    }
}

// Icons 类型定义
declare module '@element-plus/icons-vue' {
    export const Shield: Component
    export const Warning: Component
    export const Fold: Component
    export const Expand: Component
}

// Vue 文件类型定义
declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// 通用接口定义
export interface BaseResponse {
    code: number
    message: string
    data?: any
}

export interface PageParams {
    current: number
    size: number
    total?: number
}

export interface TableData<T = any> {
    list: T[]
    total: number
}

export {} 