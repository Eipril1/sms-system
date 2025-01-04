// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页响应类型
export interface PageResponse<T = any> {
  records: T[]
  total: number
  size: number
  current: number
}

// 用户信息类型
export interface UserInfo {
  id: number
  username: string
  realName: string
  avatar?: string
  roles: string[]
}

// 文件类型
export interface FileInfo {
  name: string
  url: string
} 