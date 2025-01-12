<template>
  <div class="responsibility-container">
    <div class="page-header">
      <h2>安全责任</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增责任清单</el-button>
        <el-button type="success" @click="handleAddAssessment">新增考核记录</el-button>
      </div>
    </div>

    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="责任层级">
          <el-select v-model="searchForm.level" placeholder="请选择层级">
            <el-option label="公司级" value="company" />
            <el-option label="部门级" value="department" />
            <el-option label="岗位级" value="position" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门/岗位">
          <el-input v-model="searchForm.department" placeholder="请输入部门或岗位" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 责任清单表格 -->
    <el-card class="content-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="责任清单" name="list">
          <el-table :data="responsibilityList" style="width: 100%">
            <el-table-column prop="code" label="编号" width="120" />
            <el-table-column prop="level" label="责任层级" width="100" />
            <el-table-column prop="department" label="部门/岗位" width="120" />
            <el-table-column prop="content" label="责任内容" min-width="200" show-overflow-tooltip />
            <el-table-column prop="updateTime" label="更新时间" width="180" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleView(row)">查看</el-button>
                <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="考核记录" name="assessment">
          <el-table :data="assessmentList" style="width: 100%">
            <el-table-column prop="period" label="考核周期" width="120" />
            <el-table-column prop="department" label="考核部门" width="120" />
            <el-table-column prop="assessor" label="考核人" width="100" />
            <el-table-column prop="score" label="考核得分" width="100" />
            <el-table-column prop="result" label="考核结果" width="100">
              <template #default="{ row }">
                <el-tag :type="getResultType(row.result)">{{ row.result }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="考核意见" min-width="200" show-overflow-tooltip />
            <el-table-column prop="assessTime" label="考核时间" width="180" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewAssessment(row)">查看</el-button>
                <el-button link type="danger" @click="handleDeleteAssessment(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新增/编辑责任清单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增责任清单' : '编辑责任清单'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="责任层级" prop="level">
          <el-select v-model="form.level" placeholder="请选择层级">
            <el-option label="公司级" value="company" />
            <el-option label="部门级" value="department" />
            <el-option label="岗位级" value="position" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门/岗位" prop="department">
          <el-input v-model="form.department" placeholder="请输入部门或岗位" />
        </el-form-item>
        <el-form-item label="责任内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入责任内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增考核记录对话框 -->
    <el-dialog
      v-model="assessmentDialogVisible"
      title="新增考核记录"
      width="600px"
    >
      <el-form ref="assessmentFormRef" :model="assessmentForm" :rules="assessmentRules" label-width="100px">
        <el-form-item label="考核周期" prop="period">
          <el-input v-model="assessmentForm.period" placeholder="请输入考核周期" />
        </el-form-item>
        <el-form-item label="考核部门" prop="department">
          <el-input v-model="assessmentForm.department" placeholder="请输入考核部门" />
        </el-form-item>
        <el-form-item label="考核人" prop="assessor">
          <el-input v-model="assessmentForm.assessor" placeholder="请输入考核人" />
        </el-form-item>
        <el-form-item label="考核得分" prop="score">
          <el-input-number v-model="assessmentForm.score" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="考核结果" prop="result">
          <el-select v-model="assessmentForm.result" placeholder="请选择考核结果">
            <el-option label="优秀" value="优秀" />
            <el-option label="良好" value="良好" />
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
        <el-form-item label="考核意见" prop="comment">
          <el-input
            v-model="assessmentForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入考核意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assessmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitAssessment">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表单引用
const formRef = ref<FormInstance>()
const assessmentFormRef = ref<FormInstance>()

// 对话框控制
const dialogVisible = ref(false)
const assessmentDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

// 标签页控制
const activeTab = ref('list')

// 搜索表单
const searchForm = ref({
  level: '',
  department: ''
})

// 表单数据
const form = ref({
  level: '',
  department: '',
  content: ''
})

// 考核表单数据
const assessmentForm = ref({
  period: '',
  department: '',
  assessor: '',
  score: 0,
  result: '',
  comment: ''
})

// 模拟责任清单数据
const responsibilityList = ref([
  {
    code: 'RS001',
    level: '公司级',
    department: '安全监察部',
    content: '负责公司安全管理体系的建立和维护...',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    code: 'RS002',
    level: '部门级',
    department: '运行控制部',
    content: '确保部门安全运行管理规范的执行...',
    updateTime: '2024-01-14 15:30:00'
  }
])

// 模拟考核记录数据
const assessmentList = ref([
  {
    period: '2024年第一季度',
    department: '安全监察部',
    assessor: '张三',
    score: 95,
    result: '优秀',
    comment: '安全管理体系运行良好，各项指标达标',
    assessTime: '2024-03-31 14:00:00'
  }
])

// 表单验证规则
const rules = {
  level: [{ required: true, message: '请选择责任层级', trigger: 'change' }],
  department: [{ required: true, message: '请输入部门/岗位', trigger: 'blur' }],
  content: [{ required: true, message: '请输入责任内容', trigger: 'blur' }]
}

// 考核表单验证规则
const assessmentRules = {
  period: [{ required: true, message: '请输入考核周期', trigger: 'blur' }],
  department: [{ required: true, message: '请输入考核部门', trigger: 'blur' }],
  assessor: [{ required: true, message: '请输入考核人', trigger: 'blur' }],
  score: [{ required: true, message: '请输入考核得分', trigger: 'change' }],
  result: [{ required: true, message: '请选择考核结果', trigger: 'change' }],
  comment: [{ required: true, message: '请输入考核意见', trigger: 'blur' }]
}

// 获取考核结果样式
const getResultType = (result: string) => {
  const map: Record<string, string> = {
    '优秀': 'success',
    '良好': 'primary',
    '合格': 'warning',
    '不合格': 'danger'
  }
  return map[result] || ''
}

// 搜索
const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索条件：', searchForm.value)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    level: '',
    department: ''
  }
  handleSearch()
}

// 新增责任清单
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    level: '',
    department: '',
    content: ''
  }
  dialogVisible.value = true
}

// 新增考核记录
const handleAddAssessment = () => {
  assessmentForm.value = {
    period: '',
    department: '',
    assessor: '',
    score: 0,
    result: '',
    comment: ''
  }
  assessmentDialogVisible.value = true
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

// 查看考核记录
const handleViewAssessment = (row: any) => {
  // 实现查看逻辑
  console.log('查看考核记录：', row)
}

// 删除责任清单
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该责任清单？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 实现删除逻辑
    ElMessage.success('删除成功')
  } catch (error) {
    console.log('取消删除')
  }
}

// 删除考核记录
const handleDeleteAssessment = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该考核记录？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 实现删除逻辑
    ElMessage.success('删除成功')
  } catch (error) {
    console.log('取消删除')
  }
}

// 提交责任清单表单
const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
    }
  })
}

// 提交考核记录表单
const handleSubmitAssessment = () => {
  assessmentFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      assessmentDialogVisible.value = false
      ElMessage.success('考核记录已保存')
    }
  })
}
</script>

<style scoped>
.responsibility-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-card {
  margin-bottom: 20px;
}

.content-card {
  margin-bottom: 20px;
}
</style> 