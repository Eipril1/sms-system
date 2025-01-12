import request from '@/utils/request'

export function getRegulations(type: string) {
  return request({
    url: '/regulation/list',
    method: 'get',
    params: { type }
  })
}

export function saveCompliance(data: any) {
  return request({
    url: '/regulation/compliance',
    method: 'post',
    data
  })
} 