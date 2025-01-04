/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  export interface GlobalComponents {
    RouterView: typeof import('vue-router')['RouterView']
    RouterLink: typeof import('vue-router')['RouterLink']
  }
}

declare module 'vue-router' {
  export interface RouteMeta {
    title?: string
    icon?: string
  }
}