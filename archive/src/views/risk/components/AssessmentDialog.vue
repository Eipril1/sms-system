<template>
  <el-dialog
      :title="type === 'add' ? '新增风险' : '编辑风险'"
      v-model="dialogVisible"
      width="60%"
      :before-close="handleClose"
  >
    <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="assessment-form"
    >
      <!-- 基本信息 -->
      <el-form-item label="危险源编号" prop="dangerSourceCode">
        <el-input v-model="form.dangerSourceCode" placeholder="请输入危险源编号"/>
      </el-form-item>

      <el-form-item label="危险源描述" prop="dangerSourceDesc">
        <el-input
            v-model="form.dangerSourceDesc"
            type="textarea"
            :rows="4"
            placeholder="请输入危险源描述"
        />
      </el-form-item>

      <el-form-item label="是否重大危险源" prop="isMajorDanger">
        <el-switch v-model="form.isMajorDanger"/>
      </el-form-item>

      <el-form-item label="危险源来源" prop="dangerSource">
        <el-input v-model="form.dangerSource" placeholder="请输入危险源来源"/>
      </el-form-item>

      <el-form-item label="时态" prop="timeState">
        <el-select v-model="form.timeState" placeholder="请选择时态">
          <el-option label="过去" value="past"/>
          <el-option label="现在" value="present"/>
          <el-option label="将来" value="future"/>
        </el-select>
      </el-form-item>

      <el-form-item label="管控措施" prop="controlMeasures">
        <el-input
            v-model="form.controlMeasures"
            type="textarea"
            :rows="4"
            placeholder="请输入管控措施"
        />
      </el-form-item>

      <el-form-item label="应急预案" prop="emergencyPlan">
        <el-input
            v-model="form.emergencyPlan"
            type="textarea"
            :rows="4"
            placeholder="请输入应急预案"
        />
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
  dangerSourceCode: '',
  dangerSourceDesc: '',
  isMajorDanger: false,
  dangerSource: '',
  timeState: '',
  controlMeasures: '',
  emergencyPlan: '',
  attachments: [] as any[]
})

// 表单校验规则
const rules: FormRules = {
  dangerSourceCode: [{required: true, message: '请输入危险源编号', trigger: 'blur'}],
  dangerSourceDesc: [{required: true, message: '请输入危险源描述', trigger: 'blur'}],
  dangerSource: [{required: true, message: '请输入危险源来源', trigger: 'blur'}],
  timeState: [{required: true, message: '请选择时态', trigger: 'change'}],
  controlMeasures: [{required: true, message: '请输入管控措施', trigger: 'blur'}],
  emergencyPlan: [{required: true, message: '请输入应急预案', trigger: 'blur'}]
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
        const url = props.type === 'add' ? '/api/risk' : `/api/risk/${props.data?.id}`
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
.assessment-form {
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