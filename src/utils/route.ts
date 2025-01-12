import type { AppRouteRecordRaw } from '@/types/router'

export const generateRouteKey = (route: AppRouteRecordRaw): string => {
  return route.path || route.name?.toString() || Math.random().toString(36).substr(2, 9)
}

export const hasPermission = (route: AppRouteRecordRaw): boolean => {
  return !route.meta?.hidden
} 