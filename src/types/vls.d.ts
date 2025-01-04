declare module '@vue/runtime-core' {
  interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }

  interface ComponentCustomProperties {
    $refs: {
      [key: string]: HTMLElement | any
    }
  }
}

declare global {
  const __VLS_internalComponent: any
  const __VLS_componentsOption: any
  const __VLS_name: any
  const __VLS_setup: any
  const __VLS_component: any
  const __VLS_ctx: any
  const __VLS_props: any
  const __VLS_slots: any
  const __VLS_refs: any
  const __VLS_emit: any
  const __VLS_withDefaults: any
}

export {} 