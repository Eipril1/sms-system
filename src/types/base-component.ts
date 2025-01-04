import type { ComponentPublicInstance, Ref } from 'vue'

export type ComponentPublicInstance = _ComponentPublicInstance
export type Ref<T> = _Ref<T>

// 基础组件状态
export interface BaseState {
  loading: boolean
  currentPage: number
  pageSize: number
  total: number
  dialogVisible: boolean
  detailVisible: boolean
  dialogType: 'add' | 'edit' | 'view'
  currentItem: any | null
}

// 基础组件方法
export interface BaseMethods {
  handleAdd(): void
  handleEdit(row: any): void
  handleDelete(row: any): void
  handleView(row: any): void
  handleSizeChange(size: number): void
  handleCurrentChange(page: number): void
  handleDialogSuccess(): void
  handleClose(): void
  handleSubmit(): void
}

// 基础组件属性
export interface BaseProps {
  modelValue?: any
  visible?: boolean
  type?: string
  data?: any
}

// 基础组件事件
export interface BaseEmits {
  (e: 'update:modelValue', value: any): void
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

// 基础组件上下文
export interface BaseContext {
  emit: (event: string, ...args: any[]) => void
  expose: (exposed: Record<string, any>) => void
}

// 基础组件实例
export interface BaseInstance extends ComponentPublicInstance {
  state: BaseState
  methods: BaseMethods
}

// 组件响应式状态
export type ReactiveState<T> = {
  [K in keyof T]: Ref<T[K]>
} 