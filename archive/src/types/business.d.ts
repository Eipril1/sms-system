// 通用状态类型
export type StatusType = 'success' | 'warning' | 'info' | 'danger' | 'primary'

// 基础表单项接口
export interface BaseFormItem {
    id?: number
    recordNumber?: string
    status?: string
    createTime?: string
    updateTime?: string
    attachments?: Array<{
        name: string
        url: string
    }>
}

// 审核相关接口
export interface AuditItem extends BaseFormItem {
    checkProject: string
    checkLocation?: string
    checkBasis?: string
    implementDept: string
    startDate: string
    endDate: string
    checkKeyPoints: string
    checkSituation: string
    checkConclusion: string
    auditTeamMembers: string[]
}

// 调查相关接口
export interface InvestigationItem extends BaseFormItem {
    sourceNumber: string
    eventType: string
    startDate: string
    endDate: string
    investigationPlan: string
    investigationProcess: string
    investigationConclusion: string
    investigationTeam: string[]
}

// 纠正预防相关接口
export interface CorrectionItem extends BaseFormItem {
    sourceNumber: string
    problemType: string
    description: string
    analysis: string
    controlMeasures: string
    preventiveMeasures: string
    verificationStandard: string
    responsibleDept: string
    handler: string
    planCompleteTime: string
    deadline: string
}

// 风险评估相关接口
export interface RiskItem extends BaseFormItem {
    dangerSourceCode: string
    dangerSourceDesc: string
    timeState: string
    riskLevel?: string
    acceptanceLevel?: string
    residualRiskLevel?: string
    controlMeasures: string
    emergencyPlan: string
} 