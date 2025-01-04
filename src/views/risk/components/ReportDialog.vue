<template>
  <el-dialog
    :title="type === 'add' ? '新增' + typeName : '编辑' + typeName"
    v-model="dialogVisible"
    width="60%"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="report-form"
    >
      <!-- 基本信息 -->
      <el-form-item label="事发日期" prop="occurDate">
        <el-date-picker
          v-model="form.occurDate"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      
      <el-form-item label="事发时间" prop="occurTime">
        <el-time-picker
          v-model="form.occurTime"
          placeholder="选择时间"
        />
      </el-form-item>

      <el-form-item label="航班号" prop="flightNo" v-if="reportType === 'forced'">
        <el-input v-model="form.flightNo" placeholder="请输入航班号" />
      </el-form-item>

      <el-form-item label="飞机号" prop="aircraftNo" v-if="reportType === 'forced'">
        <el-input v-model="form.aircraftNo" placeholder="请输入飞机号" />
      </el-form-item>

      <el-form-item label="航段" prop="flightSegment" v-if="reportType === 'forced'">
        <el-input v-model="form.flightSegment" placeholder="请输入航段" />
      </el-form-item>

      <el-form-item label="事发阶段" prop="occurPhase">
        <el-select v-model="form.occurPhase" placeholder="请选择事发阶段">
          <el-option label="起飞" value="takeoff" />
          <el-option label="巡航" value="cruise" />
          <el-option label="降落" value="landing" />
          <el-option label="地面" value="ground" />
        </el-select>
      </el-form-item>

      <el-form-item label="事件类型" prop="eventType">
        <el-select v-model="form.eventType" placeholder="请选择事件类型">
          <el-option label="机械故障" value="mechanical" />
          <el-option label="人为差错" value="human" />
          <el-option label="天气影响" value="weather" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>

      <el-form-item label="事件经过" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请详细描述事件经过"
        />
      </el-form-item>

      <el-form-item label="影响" prop="impact">
        <el-input
          v-model="form.impact"
          type="textarea"
          :rows="3"
          placeholder="请描述事件影响"
        />
      </el-form-item>

      <!-- 强制报告特有字段 -->
      <template v-if="reportType === 'forced'">
        <el-form-item label="是否396事件" prop="is396Event">
          <el-switch v-model="form.is396Event" />
        </el-form-item>

        <el-form-item label="差错标准" prop="errorStandard">
          <el-select v-model="form.errorStandard" placeholder="请选择差错标准">
            <el-option label="严重差错" value="serious" />
            <el-option label="一般差错" value="normal" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否需要调查" prop="needInvestigation">
          <el-switch v-model="form.needInvestigation" />
        </el-form-item>
      </template>

      <!-- 自愿报告特有字段 -->
      <template v-else>
        <el-form-item label="希望处理部门" prop="hopeHandleDept">
          <el-select v-model="form.hopeHandleDept" placeholder="请选择部门">
            <el-option label="安全监察部" value="safety" />
            <el-option label="运行部" value="operation" />
            <el-option label="维修部" value="maintenance" />
          </el-select>
        </el-form-item>

        <el-form-item label="联系方式" prop="handlerContact">
          <el-input v-model="form.handlerContact" placeholder="请输入联系方式（选填）" />
        </el-form-item>
      </template>

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
import axios from 'axios'  // 直接导入 axios

interface Props {
  visible: boolean
  type: 'add' | 'edit'
  reportType: 'forced' | 'voluntary'
  data?: any
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  type: 'add',
  reportType: 'forced'
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

const typeName = computed(() => props.reportType === 'forced' ? '强制报告' : '自愿报告')

// 表单相关
const formRef = ref<FormInstance>()
const form = ref({
  recordType: props.reportType,
  occurDate: '',
  occurTime: '',
  flightNo: '',
  aircraftNo: '',
  flightSegment: '',
  occurPhase: '',
  eventType: '',
  description: '',
  impact: '',
  is396Event: false,
  errorStandard: '',
  needInvestigation: false,
  hopeHandleDept: '',
  handlerContact: '',
  attachments: [] as any[]
})

// 表单校验规则
const rules: FormRules = {
  occurDate: [{ required: true, message: '请选择事发日期', trigger: 'change' }],
  occurTime: [{ required: true, message: '请选择事发时间', trigger: 'change' }],
  occurPhase: [{ required: true, message: '请选择事发阶段', trigger: 'change' }],
  eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入事件经过', trigger: 'blur' }],
  impact: [{ required: true, message: '请输入影响', trigger: 'blur' }],
  // 强制报告特有校验
  flightNo: [{ required: props.reportType === 'forced', message: '请输入航班号', trigger: 'blur' }],
  aircraftNo: [{ required: props.reportType === 'forced', message: '请输入飞机号', trigger: 'blur' }],
  flightSegment: [{ required: props.reportType === 'forced', message: '请输入航段', trigger: 'blur' }],
  errorStandard: [{ required: props.reportType === 'forced', message: '请选择差错标准', trigger: 'change' }],
  // 自愿报告特有校验
  hopeHandleDept: [{ required: props.reportType === 'voluntary', message: '请选择希望处理部门', trigger: 'change' }]
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
        const requestData = {
          ...form.value,
          recordType: props.reportType === 'forced' ? 'forced_report' : 'voluntary_report',
          occurDate: form.value.occurDate ? new Date(form.value.occurDate).toISOString().split('T')[0] : null,
          occurTime: form.value.occurTime ? form.value.occurTime : null
        }

        console.log('Submitting data:', requestData)

        const url = props.type === 'add' ? '/api/report/submit' : `/api/report/${props.data?.id}`
        const response = await axios({
          url,
          method: props.type === 'add' ? 'POST' : 'PUT',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.data.code === 200) {
          ElMessage.success(props.type === 'add' ? '新增成功' : '编辑成功')
          emit('success')
          handleClose()
        } else {
          throw new Error(response.data.message || '操作失败')
        }
      } catch (error: any) {
        console.error('Submit error:', error)
        ElMessage.error(error.response?.data?.message || error.message || '操作失败')
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
.report-form {
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