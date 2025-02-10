/// <reference types="vite/client" />

declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '@vue/runtime-core' {
    interface GlobalComponents {
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
        ElDescriptions: typeof import('element-plus')['ElDescriptions']
        ElDescriptionsItem: typeof import('element-plus')['ElDescriptionsItem']
    }

    interface ComponentCustomProperties {
        $message: typeof import('element-plus')['ElMessage']
        $messageBox: typeof import('element-plus')['ElMessageBox']
    }
}

declare module '@element-plus/icons-vue' {
    import type {Component} from 'vue'

    export const Shield: Component
    export const Warning: Component
    export const Fold: Component
    export const Expand: Component
}

declare module 'element-plus' {
    export const ElMessage: {
        success: (message: string) => void
        warning: (message: string) => void
        error: (message: string) => void
        info: (message: string) => void
    }

    export const ElMessageBox: {
        confirm: (message: string, title?: string, options?: any) => Promise<void>
        alert: (message: string, title?: string, options?: any) => Promise<void>
    }
}
