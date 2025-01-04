<template>
  <div class="change-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>变更管理</h2>
        <div class="toolbar">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增变更
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="变更编号">
          <el-input v-model="searchForm.code" placeholder="请输入变更编号" clearable />
        </el-form-item>
        <el-form-item label="变更类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="组织机构" value="organization" />
            <el-option label="人员配置" value="personnel" />
            <el-option label="设备设施" value="equipment" />
            <el-option label="作业方式" value="operation" />
            <el-option label="管理制度" value="management" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待审批" value="pending" />
            <el-option label="审批中" value="approving" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%"
      >
        <el-table-column prop="code" label="变更编号" width="120" />
        <el-table-column prop="type" label="变更类型" width="120">
          <template #default="{ row }">
            {{ getChangeTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="变更标题" />
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="department" label="所属部门" width="120" />
        <el-table-column prop="applyDate" label="申请日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button 
              type="primary" 
              link 
              @click="handleEdit(row)"
              v-if="row.status === 'pending'"
            >编辑</el-button>
            <el-button 
              type="success" 
              link 
              @click="handleApprove(row)"
              v-if="row.status === 'pending' || row.status === 'approving'"
            >审批</el-button>
            <el-button 
              type="danger" 
              link 
              @click="handleCancel(row)"
              v-if="row.status === 'pending'"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增变更' : '编辑变更'"
      width="60%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="变更类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="组织机构" value="organization" />
                <el-option label="人员配置" value="personnel" />
                <el-option label="设备设施" value="equipment" />
                <el-option label="作业方式" value="operation" />
                <el-option label="管理制度" value="management" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入变更标题" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="department">
              <el-input v-model="form.department" placeholder="请输入所属部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="applicant">
              <el-input v-model="form.applicant" placeholder="请输入申请人" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="变更原因" prop="reason">
          <el-input
            v-model="form.reason"
            type="textarea"
            rows="3"
            placeholder="请输入变更原因"
          />
        </el-form-item>

        <el-form-item label="变更内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            rows="4"
            placeholder="请输入变更内容"
          />
        </el-form-item>

        <el-form-item label="风险分析" prop="riskAnalysis">
          <el-input
            v-model="form.riskAnalysis"
            type="textarea"
            rows="3"
            placeholder="请输入风险分析"
          />
        </el-form-item>

        <el-form-item label="管控措施" prop="controls">
          <el-input
            v-model="form.controls"
            type="textarea"
            rows="3"
            placeholder="请输入管控措施"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchFormRef = ref()
const searchForm = ref({
  code: '',
  type: '',
  status: ''
})

// 表格数据
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 新增/编辑对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = ref({
  type: '',
  title: '',
  department: '',
  applicant: '',
  reason: '',
  content: '',
  riskAnalysis: '',
  controls: ''
})

const rules = {
  type: [{ required: true, message: '请选择变更类型', trigger: 'change' }],
  title: [
    { required: true, message: '请输入变更标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  department: [{ required: true, message: '请输入所属部门', trigger: 'blur' }],
  applicant: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
  reason: [
    { required: true, message: '请输入变更原因', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入变更内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '长度在 10 到 1000 个字符', trigger: 'blur' }
  ],
  riskAnalysis: [
    { required: true, message: '请输入风险分析', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  controls: [
    { required: true, message: '请输入管控措施', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ]
}

// 方法定义
const handleSearch = () => {
  console.log('搜索条件：', searchForm.value)
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    type: '',
    title: '',
    department: '',
    applicant: '',
    reason: '',
    content: '',
    riskAnalysis: '',
    controls: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleView = (row: any) => {
  // TODO: 实现查看详情功能
  console.log('查看详情：', row)
}

const handleApprove = (row: any) => {
  // TODO: 实现审批功能
  console.log('审批：', row)
}

const handleCancel = (row: any) => {
  ElMessageBox.confirm(
    '确定要取消该变更申请吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('取消：', row)
    ElMessage.success('取消成功')
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('表单数据：', form.value)
      dialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

// 工具方法
const getChangeTypeText = (type: string) => {
  const map: Record<string, string> = {
    organization: '组织机构',
    personnel: '人员配置',
    equipment: '设备设施',
    operation: '作业方式',
    management: '管理制度'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    approving: 'warning',
    approved: 'success',
    rejected: 'danger',
    cancelled: 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审批',
    approving: '审批中',
    approved: '已通过',
    rejected: '已驳回',
    cancelled: '已取消'
  }
  return map[status] || status
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.change-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h2 {
  margin: 0;
}

.toolbar {
  display: flex;
  gap: 10px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}

/* 表单样式 */
.el-form-item.is-required .el-form-item__label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

/* 表格操作按钮样式 */
.el-button--text {
  padding: 0 4px;
}

.el-button--text + .el-button--text {
  margin-left: 8px;
}

/* 卡片内容边距 */
.el-card__body {
  padding: 20px;
}

/* 表单项间距 */
.el-form-item {
  margin-bottom: 18px;
}

/* 对话框内容最大高度 */
.el-dialog__body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* 详情内容布局 */
.detail-content {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 16px 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .label {
  color: #666;
  min-width: 80px;
}

.content-box {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
}

.content-box .text {
  line-height: 1.6;
  white-space: pre-line;
}

.section {
  margin-bottom: 24px;
}

.section h4 {
  margin: 0 0 16px;
  color: #333;
}

/* 审批流程样式 */
.approval-flow {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
}

.flow-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #dcdfe6;
}

.flow-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.flow-info {
  flex: 1;
}

.flow-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.flow-content {
  color: #666;
  font-size: 14px;
}

.flow-time {
  color: #999;
  font-size: 12px;
  margin-left: 16px;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .el-form-item {
    margin-bottom: 12px;
  }

  .flow-item {
    flex-direction: column;
  }

  .flow-time {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style> 