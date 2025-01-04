import type { BaseFormItem, AuditItem, InvestigationItem, CorrectionItem, RiskItem } from './business'
import type { FormInstance, UploadInstance } from 'element-plus'

// 基础对话框属性
export interface DialogProps {
  visible: boolean
  type?: 'add' | 'edit'
  data?: any
}

// 基础对话框事件
export interface DialogEmits {
  'update:visible': (value: boolean) => void
  success: () => void
}

// 基础表单组件属性
export interface BaseFormProps<T = any> {
  modelValue: T
  rules?: Record<string, any[]>
}

// 基础表单组件事件
export interface BaseFormEmits<T = any> {
  'update:modelValue': (value: T) => void
  submit: () => void
}

// 审核对话框组件
export interface AuditDialogProps extends DialogProps {
  auditType: 'daily' | 'legal'
  data?: AuditItem
}

// 调查对话框组件
export interface InvestigationDialogProps extends DialogProps {
  data?: InvestigationItem
}

// 纠正对话框组件
export interface CorrectionDialogProps extends DialogProps {
  data?: CorrectionItem
}

// 风险评估对话框组件
export interface AssessmentDialogProps extends DialogProps {
  data?: RiskItem
}

// 组件实例类型
export interface FormComponentInstance {
  formRef: FormInstance | null
  uploadRef: UploadInstance | null
  validate: () => Promise<boolean>
  resetFields: () => void
  submit: () => Promise<void>
}

// 组件状态类型
export interface ComponentState {
  loading: boolean
  currentPage: number
  pageSize: number
  total: number
  dialogVisible: boolean
  detailVisible: boolean
  dialogType: 'add' | 'edit'
  currentItem: any | null
}

// 组件方法类型
export interface ComponentMethods {
  handleAdd: () => void
  handleEdit: (row: any) => void
  handleDelete: (row: any) => void
  handleView: (row: any) => void
  handleSizeChange: (size: number) => void
  handleCurrentChange: (page: number) => void
  handleDialogSuccess: () => void
  handleUploadSuccess: (response: any, file: any) => void
  handleUploadError: () => void
  downloadFile: (file: any) => void
}