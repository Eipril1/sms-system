// 报告基础类型
export interface BaseReport {
  recordNumber: string
  occurDate: string
  occurTime?: string
  flightNo?: string
  aircraftNo?: string
  eventType: string
  description: string
  department: string
  creator: string
  createTime: string
  status: '草稿' | '待审核' | '待分发' | '待处理' | '待确认' | '已关闭' | '已退回'
}

// 流转记录
export interface ProcessRecord {
  timestamp: string
  type: 'review' | 'distribute' | 'process' | 'confirm' | 'reject' | 'revoke'
  operator: string
  department: string
  action: string
  comment: string
}

// 自愿报告
export interface VoluntaryReport extends BaseReport {
  hopeHandleDept: string
  improvementMeasures?: string
  isDistributed: boolean
  distributeDept?: string
  isEffective?: boolean
  analysis?: string
  controlMeasures?: string
  completionStatus?: string
  isFeedback: boolean
  processRecords: ProcessRecord[]
}

// 强制报告
export interface MandatoryReport extends BaseReport {
  is396Event: boolean
  needInvestigation: boolean
  impact?: string
  investigationResult?: string
  correctiveActions?: string
  preventiveActions?: string
  investigationStatus?: 'pending' | 'processing' | 'completed'
} 