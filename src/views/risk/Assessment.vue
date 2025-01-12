<template>
  <div class="assessment-container">
    <div class="page-header">
      <h2>风险识别与评估</h2>
      <el-button type="primary" @click="handleAdd">新增风险识别</el-button>
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
        <el-form-item label="风险等级">
          <el-select v-model="searchForm.level" placeholder="请选择风险等级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 风险列表 -->
    <el-card class="content-card">
      <el-table :data="riskList" style="width: 100%">
        <el-table-column prop="code" label="编号" width="120" />
        <el-table-column prop="type" label="风险类型" width="120" />
        <el-table-column prop="description" label="风险描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="probability" label="发生概率" width="100" />
        <el-table-column prop="severity" label="严重程度" width="100" />
        <el-table-column prop="level" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="责任部门" width="120" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleControl(row)">管控</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增风险识别' : '编辑风险识别'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="风险类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择风险类型">
            <el-option label="运行风险" value="operation" />
            <el-option label="维修风险" value="maintenance" />
            <el-option label="安保风险" value="security" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入风险描述"
          />
        </el-form-item>
        <el-form-item label="发生概率" prop="probability">
          <el-select v-model="form.probability" placeholder="请选择发生概率">
            <el-option label="频繁" value="frequent" />
            <el-option label="偶尔" value="occasional" />
            <el-option label="极少" value="rare" />
          </el-select>
        </el-form-item>
        <el-form-item label="严重程度" prop="severity">
          <el-select v-model="form.severity" placeholder="请选择严重程度">
            <el-option label="灾难性" value="catastrophic" />
            <el-option label="危险" value="hazardous" />
            <el-option label="轻微" value="minor" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入责任部门" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 管控措施对话框 -->
    <el-dialog
      v-model="controlDialogVisible"
      title="管控措施"
      width="600px"
    >
      <div class="control-list">
        <div class="control-header">
          <h3>已有管控措施</h3>
          <el-button type="primary" @click="handleAddControl">新增管控措施</el-button>
        </div>
        <el-table :data="controlMeasures" style="width: 100%">
          <el-table-column prop="type" label="措施类型" width="120" />
          <el-table-column prop="content" label="措施内容" min-width="200" show-overflow-tooltip />
          <el-table-column prop="responsible" label="责任人" width="100" />
          <el-table-column prop="deadline" label="完成期限" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEditControl(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDeleteControl(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 管控措施表单对话框 -->
    <el-dialog
      v-model="controlFormVisible"
      :title="controlFormType === 'add' ? '新增管控措施' : '编辑管控措施'"
      width="500px"
    >
      <el-form ref="controlFormRef" :model="controlForm" :rules="controlRules" label-width="100px">
        <el-form-item label="措施类型" prop="type">
          <el-select v-model="controlForm.type" placeholder="请选择措施类型">
            <el-option label="工程措施" value="engineering" />
            <el-option label="管理措施" value="management" />
            <el-option label="培训措施" value="training" />
          </el-select>
        </el-form-item>
        <el-form-item label="措施内容" prop="content">
          <el-input
            v-model="controlForm.content"
            type="textarea"
            :rows="3"
            placeholder="请输入措施内容"
          />
        </el-form-item>
        <el-form-item label="责任人" prop="responsible">
          <el-input v-model="controlForm.responsible" placeholder="请输入责任人" />
        </el-form-item>
        <el-form-item label="完成期限" prop="deadline">
          <el-date-picker
            v-model="controlForm.deadline"
            type="date"
            placeholder="请选择完成期限"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="controlFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitControl">确定</el-button>
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
  level: ''
})

// 表单数据
const form = ref({
  type: '',
  description: '',
  probability: '',
  severity: '',
  department: ''
})

// 对话框控制
const dialogVisible = ref(false)
const controlDialogVisible = ref(false)
const controlFormVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const controlFormType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const controlFormRef = ref<FormInstance>()

// 当前选中项
const currentItem = ref<any>(null)

// 管控措施表单
const controlForm = ref({
  type: '',
  content: '',
  responsible: '',
  deadline: '',
  status: '进行中'
})

// 管控措施数据
const controlMeasures = ref([
  {
    type: 'engineering',
    content: '安装防坠落护栏和安全网',
    responsible: '张三',
    deadline: '2024-03-01',
    status: '进行中'
  },
  {
    type: 'management',
    content: '修订高空作业安全操作规程',
    responsible: '李四',
    deadline: '2024-02-15',
    status: '已完成'
  }
])

// 风险列表数据
const riskList = ref([
  {
    code: 'R001',
    type: '运行风险',
    description: '跑道积水可能导致飞机滑出跑道',
    probability: '偶尔',
    severity: '危险',
    level: '高',
    department: '运行控制部',
    updateTime: '2024-01-15 10:00:00'
  }
])

// 表单验证规则
const rules = {
  type: [{ required: true, message: '请选择风险类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入风险描述', trigger: 'blur' }],
  probability: [{ required: true, message: '请选择发生概率', trigger: 'change' }],
  severity: [{ required: true, message: '请选择严重程度', trigger: 'change' }],
  department: [{ required: true, message: '请输入责任部门', trigger: 'blur' }]
}

// 管控措施表单验证规则
const controlRules = {
  type: [{ required: true, message: '请选择措施类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入措施内容', trigger: 'blur' }],
  responsible: [{ required: true, message: '请输入责任人', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择完成期限', trigger: 'change' }]
}

// 获取风险等级样式
const getRiskLevelType = (level: string) => {
  const map: Record<string, string> = {
    '高': 'danger',
    '中': 'warning',
    '低': 'success'
  }
  return map[level] || 'info'
}

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '进行中': 'warning',
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
    level: ''
  }
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    type: '',
    description: '',
    probability: '',
    severity: '',
    department: ''
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
  currentItem.value = row
  // 实现查看逻辑
}

// 管控措施相关方法
const handleControl = (row: any) => {
  currentItem.value = row
  controlDialogVisible.value = true
}

const handleAddControl = () => {
  controlFormType.value = 'add'
  controlForm.value = {
    type: '',
    content: '',
    responsible: '',
    deadline: '',
    status: '进行中'
  }
  controlFormVisible.value = true
}

const handleEditControl = (row: any) => {
  controlFormType.value = 'edit'
  controlForm.value = { ...row }
  controlFormVisible.value = true
}

const handleDeleteControl = (row: any) => {
  ElMessageBox.confirm('确认删除该管控措施？', '提示', {
    type: 'warning'
  }).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该风险记录？', '提示', {
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

// 提交管控措施表单
const handleSubmitControl = () => {
  controlFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      controlFormVisible.value = false
      ElMessage.success(controlFormType.value === 'add' ? '新增成功' : '编辑成功')
    }
  })
}
</script>

<style scoped>
.assessment-container {
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

.control-list {
  .control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style> 