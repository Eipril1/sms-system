import {Component} from 'vue'

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        RouterLink: typeof import('vue-router')['RouterLink']
        RouterView: typeof import('vue-router')['RouterView']
    }

    export interface ComponentCustomProperties {
        $refs: { [key: string]: HTMLElement | any }
    }
}

declare module 'vue' {
    export {
        ref,
        computed,
        watch,
        onMounted,
        reactive,
        defineComponent,
        ComponentPublicInstance,
        Ref
    } from '@vue/runtime-core'
}