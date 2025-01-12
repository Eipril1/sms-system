<template>
  <div class="emergency-container">
    <div class="page-header">
      <h2>应急预案协调</h2>
      <el-button type="primary" @click="handleAdd">新增预案</el-button>
    </div>

    <!-- 预案列表 -->
    <el-card class="content-card">
      <el-table :data="planList" style="width: 100%">
        <el-table-column prop="code" label="预案编号" width="120" />
        <el-table-column prop="name" label="预案名称" min-width="200" />
        <el-table-column prop="type" label="预案类型" width="120" />
        <el-table-column prop="department" label="责任部门" width="120" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '有效' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handleDrill(row)">演练</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增预案' : '编辑预案'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="预案名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入预案名称" />
        </el-form-item>
        <el-form-item label="预案类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择预案类型">
            <el-option label="自然灾害" value="natural" />
            <el-option label="事故灾难" value="accident" />
            <el-option label="公共卫生" value="health" />
            <el-option label="社会安全" value="social" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入责任部门" />
        </el-form-item>
        <el-form-item label="预案内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入预案内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 演练记录对话框 -->
    <el-dialog
      v-model="drillDialogVisible"
      title="添加演练记录"
      width="600px"
    >
      <el-form ref="drillFormRef" :model="drillForm" :rules="drillRules" label-width="100px">
        <el-form-item label="演练日期" prop="drillDate">
          <el-date-picker
            v-model="drillForm.drillDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="参与人员" prop="participants">
          <el-input v-model="drillForm.participants" placeholder="请输入参与人员" />
        </el-form-item>
        <el-form-item label="演练结果" prop="result">
          <el-input
            v-model="drillForm.result"
            type="textarea"
            :rows="4"
            placeholder="请输入演练结果"
          />
        </el-form-item>
        <el-form-item label="改进建议" prop="improvements">
          <el-input
            v-model="drillForm.improvements"
            type="textarea"
            :rows="4"
            placeholder="请输入改进建议"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drillDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitDrill">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 对话框控制
const dialogVisible = ref(false)
const drillDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

// 表单引用
const formRef = ref<FormInstance>()
const drillFormRef = ref<FormInstance>()

// 表单数据
const form = ref({
  name: '',
  type: '',
  department: '',
  content: ''
})

// 演练表单数据
const drillForm = ref({
  drillDate: '',
  participants: '',
  result: '',
  improvements: ''
})

// 预案列表数据
const planList = ref([
  {
    code: 'EP001',
    name: '自然灾害应急预案',
    type: '自然灾害',
    department: '安全监察部',
    updateTime: '2024-01-15 10:00:00',
    status: '有效'
  }
])

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入预案名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择预案类型', trigger: 'change' }],
  department: [{ required: true, message: '请输入责任部门', trigger: 'blur' }],
  content: [{ required: true, message: '请输入预案内容', trigger: 'blur' }]
}

// 演练表单验证规则
const drillRules = {
  drillDate: [{ required: true, message: '请选择演练日期', trigger: 'change' }],
  participants: [{ required: true, message: '请输入参与人员', trigger: 'blur' }],
  result: [{ required: true, message: '请输入演练结果', trigger: 'blur' }],
  improvements: [{ required: true, message: '请输入改进建议', trigger: 'blur' }]
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    type: '',
    department: '',
    content: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 查看
const handleView = (row: any) => {
  // 实现查看逻辑
  console.log('查看详情：', row)
}

// 演练
const handleDrill = (row: any) => {
  drillForm.value = {
    drillDate: '',
    participants: '',
    result: '',
    improvements: ''
  }
  drillDialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该预案？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

// 提交预案表单
const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
    }
  })
}

// 提交演练记录
const handleSubmitDrill = () => {
  drillFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      drillDialogVisible.value = false
      ElMessage.success('演练记录已保存')
    }
  })
}
</script>

<style scoped>
.emergency-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-card {
  margin-bottom: 20px;
}
</style> 