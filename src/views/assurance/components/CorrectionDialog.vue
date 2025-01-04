<template>
  <el-dialog
    :title="type === 'add' ? '新增措施' : '编辑措施'"
    v-model="dialogVisible"
    width="60%"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="correction-form"
    >
      <!-- 基本信息 -->
      <el-form-item label="来源编号" prop="sourceNumber">
        <el-input v-model="form.sourceNumber" placeholder="请输入来源编号" />
      </el-form-item>

      <el-form-item label="问题类型" prop="problemType">
        <el-select v-model="form.problemType" placeholder="请选择问题类型">
          <el-option label="质量问题" value="quality" />
          <el-option label="安全隐患" value="safety" />
          <el-option label="流程缺陷" value="process" />
          <el-option label="其他问题" value="other" />
        </el-select>
      </el-form-item>

      <el-form-item label="问题描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入问题描述"
        />
      </el-form-item>

      <el-form-item label="原因分析" prop="analysis">
        <el-input
          v-model="form.analysis"
          type="textarea"
          :rows="4"
          placeholder="请输入原因分析"
        />
      </el-form-item>

      <el-form-item label="纠正措施" prop="controlMeasures">
        <el-input
          v-model="form.controlMeasures"
          type="textarea"
          :rows="4"
          placeholder="请输入纠正措施"
        />
      </el-form-item>

      <el-form-item label="预防措施" prop="preventiveMeasures">
        <el-input
          v-model="form.preventiveMeasures"
          type="textarea"
          :rows="4"
          placeholder="请输入预防措施"
        />
      </el-form-item>

      <el-form-item label="验证标准" prop="verificationStandard">
        <el-input
          v-model="form.verificationStandard"
          type="textarea"
          :rows="3"
          placeholder="请输入验证标准"
        />
      </el-form-item>

      <el-form-item label="责任部门" prop="responsibleDept">
        <el-select v-model="form.responsibleDept" placeholder="请选择责任部门">
          <el-option label="安全监察部" value="safety" />
          <el-option label="运行部" value="operation" />
          <el-option label="维修部" value="maintenance" />
        </el-select>
      </el-form-item>

      <el-form-item label="责任分部" prop="responsibleSubdept">
        <el-input v-model="form.responsibleSubdept" placeholder="请输入责任分部" />
      </el-form-item>

      <el-form-item label="经办人" prop="handler">
        <el-input v-model="form.handler" placeholder="请输入经办人" />
      </el-form-item>

      <el-form-item label="联系方式" prop="handlerContact">
        <el-input v-model="form.handlerContact" placeholder="请输入联系方式" />
      </el-form-item>

      <el-form-item label="计划完成时限" prop="planCompleteTime">
        <el-date-picker
          v-model="form.planCompleteTime"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>

      <el-form-item label="回复期限" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          type="date"
          placeholder="选择日期"
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
import { ref, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

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
  problemType: '',
  description: '',
  analysis: '',
  controlMeasures: '',
  preventiveMeasures: '',
  verificationStandard: '',
  responsibleDept: '',
  responsibleSubdept: '',
  handler: '',
  handlerContact: '',
  planCompleteTime: '',
  deadline: '',
  attachments: [] as any[]
})

// 表单校验规则
const rules: FormRules = {
  sourceNumber: [{ required: true, message: '请输入来源编号', trigger: 'blur' }],
  problemType: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
  analysis: [{ required: true, message: '请输入原因分析', trigger: 'blur' }],
  controlMeasures: [{ required: true, message: '请输入纠正措施', trigger: 'blur' }],
  preventiveMeasures: [{ required: true, message: '请输入预防措施', trigger: 'blur' }],
  verificationStandard: [{ required: true, message: '请输入验证标准', trigger: 'blur' }],
  responsibleDept: [{ required: true, message: '请选择责任部门', trigger: 'change' }],
  handler: [{ required: true, message: '请输入经办人', trigger: 'blur' }],
  planCompleteTime: [{ required: true, message: '请选择计划完成时限', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择回复期限', trigger: 'change' }]
}

// 监听编辑数据变化
watch(() => props.data, (val) => {
  if (val) {
    form.value = { ...val }
  } else {
    formRef.value?.resetFields()
  }
}, { immediate: true })

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
        const url = props.type === 'add' ? '/api/correction' : `/api/correction/${props.data?.id}`
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
.correction-form {
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