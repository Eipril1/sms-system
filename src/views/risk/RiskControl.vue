<template>
  <div class="risk-control">
    <div class="page-header">
      <h2>风险控制与跟踪</h2>
      <el-button type="primary" @click="handleAdd">新增控制措施</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="风险类型">
          <el-select v-model="searchForm.type" placeholder="请选择风险类型">
            <el-option label="运行风险" value="operation" />
            <el-option label="维修风险" value="maintenance" />
            <el-option label="安保风险" value="security" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="进行中" value="ongoing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 控制措施列表 -->
    <el-card class="content-card">
      <el-table :data="controlList" style="width: 100%">
        <el-table-column prop="code" label="编号" width="100" />
        <el-table-column prop="riskType" label="风险类型" width="120" />
        <el-table-column prop="measure" label="控制措施" min-width="200" show-overflow-tooltip />
        <el-table-column prop="department" label="责任部门" width="120" />
        <el-table-column prop="deadline" label="完成期限" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="200">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" />
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
      :title="dialogType === 'add' ? '新增控制措施' : '编辑控制措施'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="风险类型" prop="riskType">
          <el-select v-model="form.riskType" placeholder="请选择风险类型">
            <el-option label="运行风险" value="operation" />
            <el-option label="维修风险" value="maintenance" />
            <el-option label="安保风险" value="security" />
          </el-select>
        </el-form-item>
        <el-form-item label="控制措施" prop="measure">
          <el-input
            v-model="form.measure"
            type="textarea"
            :rows="3"
            placeholder="请输入控制措施"
          />
        </el-form-item>
        <el-form-item label="责任部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入责任部门" />
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
      width="600px"
    >
      <el-form ref="trackFormRef" :model="trackForm" :rules="trackRules" label-width="100px">
        <el-form-item label="当前进度" prop="progress">
          <el-slider v-model="trackForm.progress" :step="10" show-stops />
        </el-form-item>
        <el-form-item label="跟踪记录" prop="record">
          <el-input
            v-model="trackForm.record"
            type="textarea"
            :rows="4"
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
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = ref({
  type: '',
  status: ''
})

// 表单数据
const form = ref({
  riskType: '',
  measure: '',
  department: '',
  deadline: ''
})

// 跟踪表单数据
const trackForm = ref({
  progress: 0,
  record: ''
})

// 对话框控制
const dialogVisible = ref(false)
const trackDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const trackFormRef = ref<FormInstance>()

// 控制措施列表数据
const controlList = ref([
  {
    code: 'C001',
    riskType: '运行风险',
    measure: '加强跑道巡查，及时清理积水',
    department: '场道维护部',
    deadline: '2024-03-31',
    status: '进行中',
    progress: 30
  }
])

// 表单验证规则
const rules = {
  riskType: [{ required: true, message: '请选择风险类型', trigger: 'change' }],
  measure: [{ required: true, message: '请输入控制措施', trigger: 'blur' }],
  department: [{ required: true, message: '请输入责任部门', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择完成期限', trigger: 'change' }]
}

// 跟踪表单验证规则
const trackRules = {
  progress: [{ required: true, message: '请设置当前进度', trigger: 'change' }],
  record: [{ required: true, message: '请输入跟踪记录', trigger: 'blur' }]
}

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '进行中': 'primary',
    '已完成': 'success',
    '已关闭': 'info'
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
    riskType: '',
    measure: '',
    department: '',
    deadline: ''
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
}

// 跟踪
const handleTrack = (row: any) => {
  trackForm.value = {
    progress: row.progress,
    record: ''
  }
  trackDialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该控制措施？', '提示', {
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
</script>

<style scoped>
.risk-control {
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