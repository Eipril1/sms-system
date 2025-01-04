import request from '@/utils/request'
import type { RiskAssessment, ControlMeasure, RiskStatistics } from '@/types/risk'

// 风险评估相关接口
export function getRiskList(params: any) {
  return request({
    url: '/risk/assessment/list',
    method: 'get',
    params
  })
}

export function getRiskDetail(id: string) {
  return request({
    url: `/risk/assessment/${id}`,
    method: 'get'
  })
}

export function createRisk(data: Partial<RiskAssessment>) {
  return request({
    url: '/risk/assessment',
    method: 'post',
    data
  })
}

export function updateRisk(id: string, data: Partial<RiskAssessment>) {
  return request({
    url: `/risk/assessment/${id}`,
    method: 'put',
    data
  })
}

export function deleteRisk(id: string) {
  return request({
    url: `/risk/assessment/${id}`,
    method: 'delete'
  })
}

export function batchDeleteRisk(ids: string[]) {
  return request({
    url: '/risk/assessment/batch',
    method: 'delete',
    data: { ids }
  })
}

// 管控措施相关接口
export function getControlList(assessmentId: string) {
  return request({
    url: '/risk/control/list',
    method: 'get',
    params: { assessmentId }
  })
}

export function createControl(data: Partial<ControlMeasure>) {
  return request({
    url: '/risk/control',
    method: 'post',
    data
  })
}

export function updateControl(id: string, data: Partial<ControlMeasure>) {
  return request({
    url: `/risk/control/${id}`,
    method: 'put',
    data
  })
}

export function deleteControl(id: string) {
  return request({
    url: `/risk/control/${id}`,
    method: 'delete'
  })
}

// 统计相关接口
export function getRiskStatistics(params: any) {
  return request({
    url: '/risk/statistics',
    method: 'get',
    params
  })
}

// 导入导出相关接口
export function exportRisk(params: any) {
  return request({
    url: '/risk/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function importRisk(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/risk/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
} 