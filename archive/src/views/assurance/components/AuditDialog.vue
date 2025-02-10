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
        class="audit-form"
    >
      <!-- 基本信息 -->
      <el-form-item label="检查项目" prop="checkProject">
        <el-input v-model="form.checkProject" placeholder="请输入检查项目"/>
      </el-form-item>

      <el-form-item label="检查地点" prop="checkLocation" v-if="auditType === 'daily'">
        <el-input v-model="form.checkLocation" placeholder="请输入检查地点"/>
      </el-form-item>

      <el-form-item label="检查依据" prop="checkBasis" v-if="auditType === 'legal'">
        <el-input v-model="form.checkBasis" placeholder="请输入检查依据"/>
      </el-form-item>

      <el-form-item label="实施部门" prop="implementDept">
        <el-select v-model="form.implementDept" placeholder="请选择实施部门">
          <el-option label="安全监察部" value="safety"/>
          <el-option label="运行部" value="operation"/>
          <el-option label="维修部" value="maintenance"/>
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

      <el-form-item label="检查要点" prop="checkKeyPoints">
        <el-input
            v-model="form.checkKeyPoints"
            type="textarea"
            :rows="4"
            placeholder="请输入检查要点"
        />
      </el-form-item>

      <el-form-item label="检查情况" prop="checkSituation">
        <el-input
            v-model="form.checkSituation"
            type="textarea"
            :rows="4"
            placeholder="请输入检查情况"
        />
      </el-form-item>

      <el-form-item label="检查结论" prop="checkConclusion">
        <el-input
            v-model="form.checkConclusion"
            type="textarea"
            :rows="3"
            placeholder="请输入检查结论"
        />
      </el-form-item>

      <!-- 审核组成员 -->
      <el-form-item label="审核组成员" prop="auditTeamMembers">
        <el-select
            v-model="form.auditTeamMembers"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入审核组成员"
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
import {ref, computed, watch, reactive} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'

interface Props {
  visible: boolean
  type: 'add' | 'edit'
  auditType: 'daily' | 'legal'
  data?: any
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  type: 'add',
  auditType: 'daily'
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

const typeName = computed(() => props.auditType === 'daily' ? '日常检查' : '法定自查')

// 表单相关
const formRef = ref<FormInstance>()
const form = ref({
  checkProject: '',
  checkLocation: '',
  checkBasis: '',
  implementDept: '',
  startDate: '',
  endDate: '',
  checkKeyPoints: '',
  checkSituation: '',
  checkConclusion: '',
  auditTeamMembers: [] as string[],
  attachments: [] as any[]
})

// 审核组成员选项
const memberOptions = [
  {value: '张三', label: '张三'},
  {value: '李四', label: '李四'},
  {value: '王五', label: '王五'}
]

// 表单校验规则
const rules = reactive<FormRules>({
  checkProject: [{required: true, message: '请输入检查项目', trigger: 'blur'}],
  checkLocation: [{required: props.auditType === 'daily', message: '请输入检查地点', trigger: 'blur'}],
  checkBasis: [{required: props.auditType === 'legal', message: '请输入检查依据', trigger: 'blur'}],
  implementDept: [{required: true, message: '请选择实施部门', trigger: 'change'}],
  startDate: [{required: true, message: '请选择开始日期', trigger: 'change'}],
  endDate: [{required: true, message: '请选择结束日期', trigger: 'change'}],
  checkKeyPoints: [{required: true, message: '请输入检查要点', trigger: 'blur'}],
  checkSituation: [{required: true, message: '请输入检查情况', trigger: 'blur'}],
  checkConclusion: [{required: true, message: '请输入检查结论', trigger: 'blur'}],
  auditTeamMembers: [{required: true, message: '请选择审核组成员', trigger: 'change'}]
})

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

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const url = props.type === 'add' ? '/api/audit' : `/api/audit/${props.data?.id}`
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

// 添加 valid 参数类型
const handleValidate = async (valid: boolean) => {
  if (valid) {
    // ...
  }
}
</script>

<style scoped>
.audit-form {
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