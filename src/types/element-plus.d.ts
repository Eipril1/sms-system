declare module 'element-plus' {
  export const ElConfigProvider: typeof import('element-plus/es')['ElConfigProvider']
  // 组件类型
  export const ElButton: any
  export const ElDialog: any
  export const ElForm: any
  export const ElFormItem: any
  export const ElInput: any
  export const ElSelect: any
  export const ElOption: any
  export const ElTable: any
  export const ElTableColumn: any
  export const ElTag: any
  export const ElPagination: any
  export const ElUpload: any
  export const ElDatePicker: any
  export const ElTimePicker: any
  export const ElDescriptions: any
  export const ElDescriptionsItem: any

  // 表单规则类型
  export interface FormItemRule {
    required?: boolean
    message?: string
    trigger?: string | string[]
    min?: number
    max?: number
    type?: string
    validator?: (rule: any, value: any, callback: any) => void
  }

  export interface FormRules {
    [key: string]: FormItemRule | FormItemRule[]
  }

  // Tag 类型
  export type TagType = 'success' | 'warning' | 'info' | 'primary' | 'danger'
}

// Element Plus 中文语言包类型
declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const locale: any
  export default locale
} 