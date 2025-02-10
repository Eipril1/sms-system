import {DefineComponent} from 'vue'

declare module 'vue' {
    export interface ComponentCustomProperties {
        $props: {
            [key: string]: any
        }
        $refs: {
            [key: string]: any
        }
        $emit: (event: string, ...args: any[]) => void
    }
}

export interface BaseProps {
    visible?: boolean
    type?: string
    data?: any
    onClose?: () => void
    onSuccess?: () => void
}

export interface BaseEmits {
    (e: 'update:visible', value: boolean): void

    (e: 'success'): void
}

export interface BaseSetup {
    dialogVisible: boolean
    handleClose: () => void
    handleSubmit: () => void
    form: any
    rules: any
    loading: boolean
    currentPage: number
    pageSize: number
    total: number
    handleSizeChange: (size: number) => void
    handleCurrentChange: (page: number) => void
    handleAdd: () => void
    handleEdit: (row: any) => void
    handleDelete: (row: any) => void
    handleView: (row: any) => void
    downloadFile: (url: string) => void
    getStatusType: (status: number) => string
    getRiskLevelType: (level: number) => string
    getTimeStateText: (state: number) => string
    getDepartmentText: (dept: string) => string
    getProblemTypeText: (type: string) => string
    getVerifyType: (type: string) => string
    getCompletionType: (type: string) => string
    getAuditTypeName: (type: string) => string
} 