declare module 'vue' {
    export interface GlobalComponents {
        ElButton: typeof import('element-plus')['ElButton']
        ElDialog: typeof import('element-plus')['ElDialog']
        ElForm: typeof import('element-plus')['ElForm']
        ElFormItem: typeof import('element-plus')['ElFormItem']
        ElInput: typeof import('element-plus')['ElInput']
        ElSelect: typeof import('element-plus')['ElSelect']
        ElOption: typeof import('element-plus')['ElOption']
        ElTable: typeof import('element-plus')['ElTable']
        ElTableColumn: typeof import('element-plus')['ElTableColumn']
        ElTag: typeof import('element-plus')['ElTag']
        ElPagination: typeof import('element-plus')['ElPagination']
        ElUpload: typeof import('element-plus')['ElUpload']
        ElDatePicker: typeof import('element-plus')['ElDatePicker']
        ElTimePicker: typeof import('element-plus')['ElTimePicker']
        ElDescriptions: typeof import('element-plus')['ElDescriptions']
        ElDescriptionsItem: typeof import('element-plus')['ElDescriptionsItem']
    }
}

export {}