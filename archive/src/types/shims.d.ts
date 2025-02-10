import type {DefineComponent} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'

declare module '*.vue' {
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $refs: {
            [key: string]: HTMLElement | FormInstance | any
        }
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $refs: {
            [key: string]: HTMLElement | FormInstance | any
        }
    }
}

declare global {
    namespace __VLS {
        interface ComponentCustomProperties {
        }

        interface ComponentCustomOptions {
        }

        interface GlobalComponents {
        }

        interface GlobalDirectives {
        }

        interface IntrinsicElements {
        }
    }
}

export {} 