import 'vue-router'

export interface AppRouteRecordRaw {
  path: string
  name?: string
  component?: any
  redirect?: string
  meta?: {
    title?: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
  }
  children?: AppRouteRecordRaw[]
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
  }
} 