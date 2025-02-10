<template>
  <el-dialog
      :title="type === 'add' ? '新增调查' : '编辑调查'"
      v-model="dialogVisible"
      width="60%"
      :before-close="handleClose"
  >
    <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="investigation-form"
    >
      <!-- 基本信息 -->
      <el-form-item label="来源编号" prop="sourceNumber">
        <el-input v-model="form.sourceNumber" placeholder="请输入来源编号"/>
      </el-form-item>

      <el-form-item label="事件类型" prop="eventType">
        <el-select v-model="form.eventType" placeholder="请选择事件类型">
          <el-option label="机械故障" value="mechanical"/>
          <el-option label="人为差错" value="human"/>
          <el-option label="天气影响" value="weather"/>
          <el-option label="其他" value="other"/>
        </el-select>
      </el-form-item>

      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="选择开始日期"
        />
      </el-form-item>

      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="选择结束日期"
        />
      </el-form-item>

      <el-form-item label="调查方案" prop="investigationPlan">
        <el-input
            v-model="form.investigationPlan"
            type="textarea"
            :rows="4"
            placeholder="请输入调查方案"
        />
      </el-form-item>

      <el-form-item label="调查过程" prop="investigationProcess">
        <el-input
            v-model="form.investigationProcess"
            type="textarea"
            :rows="4"
            placeholder="请输入调查过程"
        />
      </el-form-item>

      <el-form-item label="调查结论" prop="investigationConclusion">
        <el-input
            v-model="form.investigationConclusion"
            type="textarea"
            :rows="3"
            placeholder="请输入调查结论"
        />
      </el-form-item>

      <!-- 调查组成员 -->
      <el-form-item label="调查组成员" prop="investigationTeam">
        <el-select
            v-model="form.investigationTeam"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入调查组成员"
        >
          <el-option
              v-for="item in memberOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 附件上传 -->
      <el-form-item label="附件">
        <el-upload
            action="/api/file/upload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :file-list="form.attachments"
            multiple
        >
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'

interface Props {
  visible: boolean
  type: 'add' | 'edit'
  data?: any
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  type: 'add'
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// 表单相关
const formRef = ref<FormInstance>()
const form = ref({
  sourceNumber: '',
  eventType: '',
  startDate: '',
  endDate: '',
  investigationPlan: '',
  investigationProcess: '',
  investigationConclusion: '',
  investigationTeam: [] as string[],
  attachments: [] as any[]
})

// 调查组成员选项
const memberOptions = [
  {value: '张三', label: '张三'},
  {value: '李四', label: '李四'},
  {value: '王五', label: '王五'}
]

// 表单校验规则
const rules: FormRules = {
  sourceNumber: [{required: true, message: '请输入来源编号', trigger: 'blur'}],
  eventType: [{required: true, message: '请选择事件类型', trigger: 'change'}],
  startDate: [{required: true, message: '请选择开始日期', trigger: 'change'}],
  endDate: [{required: true, message: '请选择结束日期', trigger: 'change'}],
  investigationPlan: [{required: true, message: '请输入调查方案', trigger: 'blur'}],
  investigationProcess: [{required: true, message: '请输入调查过程', trigger: 'blur'}],
  investigationConclusion: [{required: true, message: '请输入调查结论', trigger: 'blur'}],
  investigationTeam: [{required: true, message: '请选择调查组成员', trigger: 'change'}]
}

// 监听编辑数据变化
watch(() => props.data, (val) => {
  if (val) {
    form.value = {...val}
  } else {
    formRef.value?.resetFields()
  }
}, {immediate: true})

// 文件上传相关
const handleUploadSuccess = (response: any, file: any) => {
  form.value.attachments.push({
    name: file.name,
    url: response.data
  })
  ElMessage.success('上传成功')
}

const handleUploadError = () => {
  ElMessage.error('上传失败')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const url = props.type === 'add' ? '/api/investigation' : `/api/investigation/${props.data?.id}`
        const method = props.type === 'add' ? 'POST' : 'PUT'

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.value)
        })

        const data = await res.json()
        if (data.code === 200) {
          ElMessage.success(props.type === 'add' ? '新增成功' : '编辑成功')
          emit('success')
          handleClose()
        } else {
          ElMessage.error(data.message || '操作失败')
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('操作失败')
      }
    }
  })
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}
</script>

<style scoped>
.investigation-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style> 