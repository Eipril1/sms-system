// 风险等级映射
export const riskLevelMap = {
  high: {
    text: '重大风险',
    color: '#ff4d4f'
  },
  medium: {
    text: '较大风险',
    color: '#faad14'
  },
  low: {
    text: '一般风险',
    color: '#52c41a'
  }
}

// 可能性等级映射
export const likelihoodMap = {
  frequent: {
    text: '经常',
    value: 5
  },
  probable: {
    text: '可能',
    value: 4
  },
  occasional: {
    text: '偶然',
    value: 3
  },
  remote: {
    text: '极少',
    value: 2
  },
  improbable: {
    text: '几乎不可能',
    value: 1
  }
}

// 严重性等级映射
export const severityMap = {
  catastrophic: {
    text: '灾难性',
    value: 4
  },
  critical: {
    text: '严重',
    value: 3
  },
  moderate: {
    text: '中等',
    value: 2
  },
  negligible: {
    text: '轻微',
    value: 1
  }
}

// 计算风险等级
export function calculateRiskLevel(likelihood: string, severity: string): string {
  const l = likelihoodMap[likelihood as keyof typeof likelihoodMap]?.value || 0
  const s = severityMap[severity as keyof typeof severityMap]?.value || 0
  const score = l * s

  if (score >= 12) return 'high'
  if (score >= 6) return 'medium'
  return 'low'
}

// 导出Excel
export function exportToExcel(data: any[], filename: string) {
  import('xlsx').then(XLSX => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  })
} 