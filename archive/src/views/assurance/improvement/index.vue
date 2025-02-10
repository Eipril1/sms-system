<template>
  <div class="improvement-container">
    <div class="page-header">
      <h2>持续改进</h2>
      <el-button type="primary" @click="handleAdd">新增改进项</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="改进类型">
          <el-select v-model="searchForm.type" placeholder="请选择改进类型">
            <el-option label="流程优化" value="process"/>
            <el-option label="系统改进" value="system"/>
            <el-option label="人员培训" value="training"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="进行中" value="ongoing"/>
            <el-option label="已完成" value="completed"/>
            <el-option label="已关闭" value="closed"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 改进项列表 -->
    <el-card class="content-card">
      <el-table :data="improvementList" style="width: 100%">
        <el-table-column prop="code" label="编号" width="120"/>
        <el-table-column prop="type" label="改进类型" width="120"/>
        <el-table-column prop="title" label="改进项" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="department" label="责任部门" width="120"/>
        <el-table-column prop="deadline" label="完成期限" width="120"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="200">
          <template #default="{ row }">
            <el-progress :percentage="row.progress"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handleTrack(row)">跟踪</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增改进项' : '编辑改进项'"
        width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="改进类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择改进类型">
            <el-option label="流程优化" value="process"/>
            <el-option label="系统改进" value="system"/>
            <el-option label="人员培训" value="training"/>
          </el-select>
        </el-form-item>
        <el-form-item label="改进项" prop="title">
          <el-input v-model="form.title" placeholder="请输入改进项"/>
        </el-form-item>
        <el-form-item label="改进内容" prop="content">
          <el-input
              v-model="form.content"
              type="textarea"
              :rows="3"
              placeholder="请输入改进内容"
          />
        </el-form-item>
        <el-form-item label="责任部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入责任部门"/>
        </el-form-item>
        <el-form-item label="完成期限" prop="deadline">
          <el-date-picker
              v-model="form.deadline"
              type="date"
              placeholder="请选择完成期限"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 跟踪记录对话框 -->
    <el-dialog
        v-model="trackDialogVisible"
        title="跟踪记录"
        width="500px"
    >
      <el-form ref="trackFormRef" :model="trackForm" :rules="trackRules" label-width="100px">
        <el-form-item label="完成进度" prop="progress">
          <el-slider v-model="trackForm.progress" :step="10" show-stops/>
        </el-form-item>
        <el-form-item label="跟踪记录" prop="record">
          <el-input
              v-model="trackForm.record"
              type="textarea"
              :rows="3"
              placeholder="请输入跟踪记录"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="trackDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitTrack">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, type FormInstance} from 'vue'
import type {FormRules} from 'element-plus'
import {ElMessage, ElMessageBox} from 'element-plus'

// 搜索表单
const searchForm = ref({
  type: '',
  status: ''
})

// 表单数据
const form = ref({
  type: '',
  title: '',
  content: '',
  department: '',
  deadline: ''
})

// 跟踪表单
const trackForm = ref({
  progress: 0,
  record: ''
})

// 对话框可见性
const dialogVisible = ref(false)
const trackDialogVisible = ref(false)

// 表单类型
const dialogType = ref('add')

// 表单校验规则
const rules: FormRules = {
  type: [{required: true, message: '请选择改进类型', trigger: 'change'}],
  title: [{required: true, message: '请输入改进项', trigger: 'blur'}],
  content: [{required: true, message: '请输入改进内容', trigger: 'blur'}],
  department: [{required: true, message: '请输入责任部门', trigger: 'blur'}],
  deadline: [{required: true, message: '请选择完成期限', trigger: 'change'}]
}

const trackRules = {
  record: [{required: true, message: '请输入跟踪记录', trigger: 'blur'}]
}

// 表单引用
const formRef = ref<FormInstance>()
const trackFormRef = ref<FormInstance>()

// 获取状态类型
const getStatusType = (status: string) => {
  const map: { [key: string]: string } = {
    ongoing: 'primary',
    completed: 'success',
    closed: 'info'
  }
  return map[status] || 'info'
}

// 搜索
const handleSearch = () => {
  // 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    type: '',
    status: ''
  }
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    type: '',
    title: '',
    content: '',
    department: '',
    deadline: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = {...row}
  dialogVisible.value = true
}

// 查看
const handleView = (row: any) => {
  // 实现查看逻辑
}

// 跟踪
const handleTrack = (row: any) => {
  trackForm.value = {
    progress: row.progress || 0,
    record: ''
  }
  trackDialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该改进项？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
    }
  })
}

// 提交跟踪记录
const handleSubmitTrack = () => {
  trackFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      trackDialogVisible.value = false
      ElMessage.success('跟踪记录已保存')
    }
  })
}

// 模拟数据
const improvementList = ref([
  {
    code: 'IMP20240301',
    type: '流程优化',
    title: '优化安全检查流程',
    department: '安全部',
    deadline: '2024-04-01',
    status: 'ongoing',
    progress: 30
  },
  {
    code: 'IMP20240302',
    type: '系统改进',
    title: '升级安全监控系统',
    department: '技术部',
    deadline: '2024-05-01',
    status: 'ongoing',
    progress: 50
  }
])
</script>

<style scoped>
.improvement-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.content-card {
  margin-bottom: 20px;
}
</style> 