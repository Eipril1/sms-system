import request from '../request'
import type {CorrectionItem} from '@/types/business'

export function getCorrectionList(params: any) {
    return request({
        url: '/correction/list',
        method: 'get',
        params
    })
}

export function getCorrectionDetail(id: number) {
    return request({
        url: `/correction/${id}`,
        method: 'get'
    })
}

export function submitCorrection(data: Partial<CorrectionItem>) {
    return request({
        url: '/correction',
        method: 'post',
        data
    })
} 