// 规章相关类型
export interface RegulationItem {
    id: string
    regNumber: string
    regName: string
    regType: string
    publishDate: string
    effectiveDate: string
    status: string
    content?: string
}

export interface RegulationClause {
    id: string
    clauseNo: string
    clauseTitle: string
    clauseContent: string
    children?: RegulationClause[]
}

export interface ComplianceForm {
    manualCode: string
    manualClause: string
    statement: string
}

// 查询参数类型
export interface RegulationQuery {
    regNumber?: string
    regType?: string
    pageNum?: number
    pageSize?: number
}

// 规章条款详细信息
export interface RegulationClauseDetail {
    id: string
    clauseNo: string        // 章节号，如 "1.1.1"
    clauseTitle: string     // 标题
    clauseContent: string   // 具体内容
    requirement: string     // 要求内容
    children?: RegulationClauseDetail[]
}

// 符合性声明详细信息
export interface ComplianceDetail {
    id: string
    regClauseId: string    // 关联的规章条款ID
    clauseNo: string       // 规章章节号
    requirement: string    // 规章要求
    manualCode: string     // 手册编号，如 "DY-1Y-03"
    manualClause: string   // 手册章节，如 "1.1.1"
    statement: string      // 符合性说明
    status: string         // 状态
}