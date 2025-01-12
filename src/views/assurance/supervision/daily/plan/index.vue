<template>
  <div class="check-plan">
    <div class="page-header">
      <h2>检查计划</h2>
      <el-button type="primary" @click="handleAdd">新增计划</el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>年度计划完成率</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.yearCompletionRate }}%</span>
            <el-progress 
              :percentage="statistics.yearCompletionRate" 
              :status="statistics.yearCompletionRate >= 90 ? 'success' : 'warning'"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>年度检查计划</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.yearPlannedCount }}</span>
            <div class="sub-info">
              <span class="completed">已完成: {{ statistics.yearCompletedCount }}</span>
              <span class="pending">待执行: {{ statistics.yearPendingCount }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>本月完成率</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.monthCompletionRate }}%</span>
            <el-progress 
              :percentage="statistics.monthCompletionRate" 
              :status="statistics.monthCompletionRate >= 90 ? 'success' : 'warning'"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>本月检查计划</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.monthPlannedCount }}</span>
            <div class="sub-info">
              <span class="completed">已完成: {{ statistics.monthCompletedCount }}</span>
              <span class="pending">待执行: {{ statistics.monthPendingCount }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索区域优化 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="计划月份">
          <el-date-picker
            v-model="searchForm.planMonth"
            type="month"
            placeholder="选择月份"
            format="YYYY年MM月"
            value-format="YYYY-MM"
          />
        </el-form-item>
        <el-form-item label="检查部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 计划列表优化 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>检查计划列表</span>
          <div class="header-operations">
            <el-button type="primary" @click="handleAdd">新增计划</el-button>
            <el-button type="success" @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <el-table 
        :data="tableData" 
        v-loading="loading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="planNo" label="计划编号" width="120" />
        <el-table-column prop="planMonth" label="计划月份" width="120">
          <template #default="{ row }">
            {{ formatDate(row.planMonth) }}
          </template>
        </el-table-column>
        <el-table-column prop="department" label="检查部门" width="120" />
        <el-table-column prop="checkCount" label="检查次数" width="100" align="center" />
        <el-table-column prop="completedCount" label="已完成" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button 
              link 
              type="danger" 
              @click="handleDelete(row)"
              :disabled="row.status !== '未开始'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页优化 -->
      <div class="pagination-container">
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

    <!-- 表单对话框优化 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增检查计划' : '编辑检查计划'"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="计划月份" prop="planMonth">
          <el-date-picker
            v-model="form.planMonth"
            type="month"
            placeholder="选择月份"
            format="YYYY年MM月"
            value-format="YYYY-MM"
            style="width: 100%"
            :disabled="dialogType === 'edit'"
          />
        </el-form-item>
        <el-form-item label="检查部门" prop="department">
          <el-select 
            v-model="form.department" 
            placeholder="请选择" 
            style="width: 100%"
            :disabled="dialogType === 'edit'"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查次数" prop="checkCount">
          <el-input-number 
            v-model="form.checkCount" 
            :min="1" 
            :max="99"
            style="width: 100%" 
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'

// 统计数据
const statistics = reactive({
  // 年度数据
  yearCompletionRate: 78,
  yearPlannedCount: 120,
  yearCompletedCount: 94,
  yearPendingCount: 26,
  // 月度数据
  monthCompletionRate: 85,
  monthPlannedCount: 12,
  monthCompletedCount: 8,
  monthPendingCount: 4
})

// 搜索表单
const searchForm = ref({
  planMonth: '',
  department: '',
  status: ''
})

// 表格数据
const tableData = ref([
  {
    planNo: 'JH202401001',
    planMonth: '2024-01',
    department: '飞行部',
    checkCount: 4,
    completedCount: 2,
    status: '进行中',
    createTime: '2024-01-01 10:00:00'
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(1)

// 部门选项
const departmentOptions = [
  { label: '飞行部', value: '飞行部' },
  { label: '维修部', value: '维修部' },
  { label: '运控部', value: '运控部' },
  { label: '客舱部', value: '客舱部' },
  { label: '货运部', value: '货运部' },
  { label: '安全部', value: '安全部' }
]

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  planNo: '',
  planMonth: '',
  department: '',
  checkCount: 1,
  remark: ''
})

// 表单验证规则
const rules = {
  planMonth: [{ required: true, message: '请选择计划月份', trigger: 'change' }],
  department: [{ required: true, message: '请选择检查部门', trigger: 'change' }],
  checkCount: [{ required: true, message: '请输入检查次数', trigger: 'blur' }]
}

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '未开始': 'info',
    '进行中': 'warning',
    '已完成': 'success'
  }
  return map[status] || 'info'
}

// 日期格式化
const formatDate = (date: string) => {
  if (!date) return ''
  return date.replace(/(\d{4})-(\d{2})/, '$1年$2月')
}

// 导出功能
const handleExport = () => {
  ElMessage.success('导出成功')
}

// 提交状态
const submitting = ref(false)

// 搜索方法优化
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    // TODO: 实际API调用
    loading.value = false
  } catch (error) {
    loading.value = false
    ElMessage.error('获取数据失败')
  }
}

// 提交表单优化
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    dialogVisible.value = false
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
    handleSearch()
  } catch (error) {
    // 表单验证失败
  } finally {
    submitting.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})

// 新增计划
const handleAdd = () => {
  dialogType.value = 'add'
  form.planNo = ''
  form.planMonth = ''
  form.department = ''
  form.checkCount = 1
  form.remark = ''
  dialogVisible.value = true
}

// 编辑计划
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 查看计划
const handleView = (row: any) => {
  // 实现查看逻辑
  console.log('查看计划：', row)
}

// 删除计划
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该检查计划？', '提示', {
      type: 'warning'
    })
    // 实现删除逻辑
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}

// 统计卡片数据
const statisticsCards = computed(() => [
  {
    title: '年度计划完成率',
    value: statistics.yearCompletionRate,
    showProgress: true
  },
  {
    title: '年度检查计划',
    value: statistics.yearPlannedCount,
    completed: statistics.yearCompletedCount,
    pending: statistics.yearPendingCount,
    showProgress: false
  },
  {
    title: '本月完成率',
    value: statistics.monthCompletionRate,
    showProgress: true
  },
  {
    title: '本月检查计划',
    value: statistics.monthPlannedCount,
    completed: statistics.monthCompletedCount,
    pending: statistics.monthPendingCount,
    showProgress: false
  }
])
</script>

<style scoped>
.check-plan {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.statistics {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.statistics-value {
  text-align: center;
}

.number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-right: 8px;
}

.label {
  color: #909399;
}

.search-wrapper {
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

:deep(.el-form--inline) {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: -16px;
}

:deep(.el-form--inline .el-form-item) {
  margin: 0;
  flex-shrink: 0;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  padding-right: 12px;
}

:deep(.el-input__wrapper),
:deep(.el-select),
:deep(.el-date-editor.el-input) {
  width: 220px;
}

:deep(.el-form--inline .el-form-item:last-child) {
  margin-left: auto;
}

:deep(.el-button) {
  padding: 8px 16px;
  height: 32px;
  font-size: 14px;
}

:deep(.el-button + .el-button) {
  margin-left: 12px;
}

.table-card {
  margin-top: 16px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #EBEEF5;
}

:deep(.el-card__body) {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-operations {
  display: flex;
  gap: 12px;
}

:deep(.el-table) {
  margin-bottom: 16px;
}

:deep(.el-pagination) {
  justify-content: flex-end;
  margin-top: 16px;
}

.statistics-value .sub-value {
  margin-top: 8px;
  font-size: 14px;
  display: flex;
  justify-content: space-around;
}

.statistics-value .completed {
  color: #67C23A;
}

.statistics-value .pending {
  color: #E6A23C;
}

.statistics-card {
  height: 140px;
}

.statistics-card :deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #EBEEF5;
}

.statistics-card :deep(.el-card__body) {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.statistics-value {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.statistics-value .number {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  line-height: 1;
  margin: 0;
}

.statistics-value .sub-info {
  display: flex;
  justify-content: space-around;
  width: 100%;
  font-size: 13px;
}

.statistics-value .completed {
  color: #67C23A;
}

.statistics-value .pending {
  color: #E6A23C;
}

.statistics-value :deep(.el-progress) {
  width: 90%;
}
</style> 