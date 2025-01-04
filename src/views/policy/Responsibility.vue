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
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="level" label="责任层级" width="100" />
            <el-table-column prop="department" label="部门/岗位" width="150" />
            <el-table-column prop="responsible" label="责任人" width="120" />
            <el-table-column prop="position" label="职位" width="120" />
            <el-table-column prop="updateTime" label="更新时间" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '已生效' ? 'success' : 'warning'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
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
          <el-table :data="assessmentData" border style="width: 100%">
            <el-table-column prop="department" label="部门/岗位" width="150" />
            <el-table-column prop="responsible" label="责任人" width="120" />
            <el-table-column prop="assessmentDate" label="考核日期" width="180" />
            <el-table-column prop="assessor" label="考核人" width="120" />
            <el-table-column prop="score" label="考核得分" width="100" />
            <el-table-column prop="result" label="考核结果" width="100">
              <template #default="{ row }">
                <el-tag :type="getAssessmentResultType(row.result)">
                  {{ row.result }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewAssessment(row)">查看</el-button>
                <el-button link type="primary" @click="handleEditAssessment(row)">编辑</el-button>
                <el-button link type="danger" @click="handleDeleteAssessment(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增责任清单' : '编辑责任清单'"
      width="60%"
    >
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="部门/岗位" prop="department">
          <el-input v-model="form.department" placeholder="请输入部门或岗位名称" />
        </el-form-item>
        <el-form-item label="责任人" prop="responsible">
          <el-input v-model="form.responsible" placeholder="请输入责任人姓名" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="主要职责" prop="duties">
          <el-input
            v-model="form.duties"
            type="textarea"
            rows="6"
            placeholder="请输入主要职责"
          />
        </el-form-item>
        <el-form-item label="安全职责" prop="safetyDuties">
          <el-input
            v-model="form.safetyDuties"
            type="textarea"
            rows="6"
            placeholder="请输入安全职责"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            action="/api/upload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
          >
            <el-button type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看对话框 -->
    <el-dialog v-model="detailVisible" title="责任清单详情" width="60%">
      <div class="detail-content">
        <div class="info-row">
          <span>部门/岗位：{{ currentItem?.department }}</span>
          <span>责任人：{{ currentItem?.responsible }}</span>
          <span>职位：{{ currentItem?.position }}</span>
        </div>
        <div class="section">
          <h4>主要职责：</h4>
          <div class="content-box">{{ currentItem?.duties }}</div>
        </div>
        <div class="section">
          <h4>安全职责：</h4>
          <div class="content-box">{{ currentItem?.safetyDuties }}</div>
        </div>
        <div v-if="currentItem?.attachments?.length" class="attachments">
          <h4>附件：</h4>
          <div v-for="file in currentItem.attachments" :key="file.name">
            <el-link @click="downloadFile(file)">{{ file.name }}</el-link>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 考核记录对话框 -->
    <el-dialog
      v-model="assessmentDialogVisible"
      :title="assessmentDialogType === 'add' ? '新增考核记录' : '编辑考核记录'"
      width="60%"
    >
      <el-form ref="assessmentFormRef" :model="assessmentForm" label-width="100px">
        <el-form-item label="部门/岗位" prop="department">
          <el-input v-model="assessmentForm.department" placeholder="请选择部门或岗位" />
        </el-form-item>
        <el-form-item label="责任人" prop="responsible">
          <el-input v-model="assessmentForm.responsible" placeholder="请选择责任人" />
        </el-form-item>
        <el-form-item label="考核日期" prop="assessmentDate">
          <el-date-picker
            v-model="assessmentForm.assessmentDate"
            type="date"
            placeholder="请选择考核日期"
          />
        </el-form-item>
        <el-form-item label="考核人" prop="assessor">
          <el-input v-model="assessmentForm.assessor" placeholder="请输入考核人" />
        </el-form-item>
        <el-form-item label="考核得分" prop="score">
          <el-input-number v-model="assessmentForm.score" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="考核内容" prop="content">
          <el-input
            v-model="assessmentForm.content"
            type="textarea"
            rows="4"
            placeholder="请输入考核内容"
          />
        </el-form-item>
        <el-form-item label="考核结果" prop="result">
          <el-select v-model="assessmentForm.result" placeholder="请选择考核结果">
            <el-option label="优秀" value="优秀" />
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="assessmentForm.remarks"
            type="textarea"
            rows="4"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assessmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAssessmentSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 表格数据
const tableData = ref([
  {
    department: '安全监察部',
    responsible: '张三',
    position: '部门经理',
    updateTime: '2024-01-01',
    status: '已生效',
    duties: '负责公司安全管理体系的建立和维护...',
    safetyDuties: '1. 监督安全管理体系的实施\n2. 组织安全检查和评估\n3. 协调各部门安全工作',
    attachments: [
      { name: '安全责任书.pdf', url: '#' }
    ]
  }
])

// 对话框控制
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentItem = ref<any>(null)

// 表单数据
const form = ref({
  department: '',
  responsible: '',
  position: '',
  duties: '',
  safetyDuties: '',
  attachments: []
})

// 查询表单
const searchForm = ref({
  level: '',
  department: ''
})

// 标签页控制
const activeTab = ref('list')

// 考核记录数据
const assessmentData = ref([
  {
    department: '安全监察部',
    responsible: '张三',
    assessmentDate: '2024-01-15',
    assessor: '李四',
    score: 90,
    result: '优秀',
    content: '安全管理体系运行良好...',
    remarks: '持续保持'
  }
])

// 考核对话框控制
const assessmentDialogVisible = ref(false)
const assessmentDialogType = ref<'add' | 'edit'>('add')
const assessmentForm = ref({
  department: '',
  responsible: '',
  assessmentDate: '',
  assessor: '',
  score: 0,
  content: '',
  result: '',
  remarks: ''
})

// 操作方法
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    department: '',
    responsible: '',
    position: '',
    duties: '',
    safetyDuties: '',
    attachments: []
  }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleView = (row: any) => {
  currentItem.value = row
  detailVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该责任清单？', '提示', {
    type: 'warning'
  })
}

const handleSubmit = () => {
  dialogVisible.value = false
  ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
}

const handleUploadSuccess = (response: any) => {
  ElMessage.success('上传成功')
}

const handleUploadError = () => {
  ElMessage.error('上传失败')
}

const downloadFile = (file: any) => {
  window.open(file.url)
}

// 查询方法
const handleSearch = () => {
  // 实现查询逻辑
}

const resetSearch = () => {
  searchForm.value = {
    level: '',
    department: ''
  }
}

// 考核相关方法
const handleAddAssessment = () => {
  assessmentDialogType.value = 'add'
  assessmentForm.value = {
    department: '',
    responsible: '',
    assessmentDate: '',
    assessor: '',
    score: 0,
    content: '',
    result: '',
    remarks: ''
  }
  assessmentDialogVisible.value = true
}

const handleViewAssessment = (row: any) => {
  // 实现查看考核记录逻辑
}

const handleEditAssessment = (row: any) => {
  assessmentDialogType.value = 'edit'
  assessmentForm.value = { ...row }
  assessmentDialogVisible.value = true
}

const handleDeleteAssessment = (row: any) => {
  ElMessageBox.confirm('确认删除该考核记录？', '提示', {
    type: 'warning'
  })
}

const handleAssessmentSubmit = () => {
  assessmentDialogVisible.value = false
  ElMessage.success(assessmentDialogType.value === 'add' ? '新增成功' : '编辑成功')
}

const getAssessmentResultType = (result: string) => {
  const map: Record<string, string> = {
    '优秀': 'success',
    '合格': 'primary',
    '不合格': 'danger'
  }
  return map[result] || 'info'
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

.content-card {
  margin-bottom: 20px;
}

.detail-content {
  padding: 20px;
}

.info-row {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  color: #666;
}

.section {
  margin: 20px 0;
}

.section h4 {
  margin: 10px 0;
  color: #333;
}

.content-box {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
  line-height: 1.6;
  white-space: pre-line;
}

.attachments {
  margin-top: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.el-tabs {
  margin-top: 20px;
}
</style> 