// 风险评估类型定义
export interface RiskAssessment {
    id: string
    code: string
    hazardId: string
    hazardName: string
    assessmentDate: string
    assessor: string
    likelihood: string
    severity: string
    riskLevel: string
    basis: string
    conclusion: string
    status: string
    createTime: string
    updateTime: string
}

// 管控措施类型定义
export interface ControlMeasure {
    id: string
    assessmentId: string
    type: string
    content: string
    responsible: string
    deadline: string
    status: string
    createTime: string
    updateTime: string
}

// 统计数据类型定义
export interface RiskStatistics {
    total: number
    highRisk: number
    mediumRisk: number
    lowRisk: number
    monthlyTrend: {
        month: string
        high: number
        medium: number
        low: number
    }[]
    matrixData: {
        likelihood: string
        severity: string
        count: number
    }[]
} 