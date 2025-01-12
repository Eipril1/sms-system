<template>
  <div class="check-plan">
    <div class="page-header">
      <h2>检查计划</h2>
      <el-button type="primary" @click="handleAdd">新增计划</el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月计划完成率</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.completionRate }}%</span>
            <el-progress 
              :percentage="statistics.completionRate" 
              :status="statistics.completionRate >= 90 ? 'success' : 'warning'"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月计划检查次数</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.plannedCount }}</span>
            <span class="label">次</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>已完成检查</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.completedCount }}</span>
            <span class="label">次</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待执行检查</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.pendingCount }}</span>
            <span class="label">次</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="计划月份">
          <el-date-picker
            v-model="searchForm.planMonth"
            type="month"
            placeholder="选择月份"
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
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="planMonth" label="计划月份" width="120" />
      <el-table-column prop="department" label="检查部门" width="120" />
      <el-table-column prop="checkType" label="检查类型" width="120" />
      <el-table-column prop="plannedCount" label="计划检查次数" width="120" />
      <el-table-column prop="completedCount" label="已完成次数" width="120" />
      <el-table-column prop="completionRate" label="完成率" width="120">
        <template #default="{ row }">
          <el-progress 
            :percentage="row.completionRate" 
            :status="row.completionRate >= 90 ? 'success' : 'warning'"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增计划' : '编辑计划'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="计划月份" prop="planMonth">
          <el-date-picker
            v-model="form.planMonth"
            type="month"
            placeholder="选择月份"
          />
        </el-form-item>
        <el-form-item label="检查部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择">
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查类型" prop="checkType">
          <el-select v-model="form.checkType" placeholder="请选择">
            <el-option label="日常检查" value="daily" />
            <el-option label="专项检查" value="special" />
            <el-option label="季度检查" value="quarterly" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划次数" prop="plannedCount">
          <el-input-number v-model="form.plannedCount" :min="1" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

// 统计数据
const statistics = reactive({
  completionRate: 85,
  plannedCount: 20,
  completedCount: 17,
  pendingCount: 3
})

// 部门选项
const departmentOptions = [
  { label: '飞行部', value: '飞行部' },
  { label: '维修部', value: '维修部' },
  { label: '运控部', value: '运控部' },
  { label: '客舱部', value: '客舱部' },
  { label: '安全部', value: '安全部' }
]

// 搜索表单
const searchForm = reactive({
  planMonth: '',
  department: ''
})

// 表格数据
const tableData = ref([
  {
    planMonth: '2024-03',
    department: '飞行部',
    checkType: '日常检查',
    plannedCount: 8,
    completedCount: 7,
    completionRate: 87.5,
    status: '进行中'
  },
  {
    planMonth: '2024-03',
    department: '维修部',
    checkType: '专项检查',
    plannedCount: 6,
    completedCount: 5,
    completionRate: 83.3,
    status: '进行中'
  },
  {
    planMonth: '2024-03',
    department: '运控部',
    checkType: '日常检查',
    plannedCount: 4,
    completedCount: 4,
    completionRate: 100,
    status: '已完成'
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  planMonth: '',
  department: '',
  checkType: '',
  plannedCount: 1,
  remark: ''
})

// 表单验证规则
const rules = {
  planMonth: [{ required: true, message: '请选择计划月份', trigger: 'change' }],
  department: [{ required: true, message: '请选择检查部门', trigger: 'change' }],
  checkType: [{ required: true, message: '请选择检查类型', trigger: 'change' }],
  plannedCount: [{ required: true, message: '请输入计划次数', trigger: 'blur' }]
}

// 获取状态标签类型
const getStatusType = (status: string): 'success' | 'warning' | 'info' => {
  const map: Record<string, 'success' | 'warning' | 'info'> = {
    '已完成': 'success',
    '进行中': 'warning',
    '未开始': 'info'
  }
  return map[status] || 'info'
}

// 方法定义
const handleSearch = () => {
  // 实现搜索逻辑
}

const handleReset = () => {
  searchForm.planMonth = ''
  searchForm.department = ''
}

const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleView = (row: any) => {
  // 实现查看逻辑
}

const handleDelete = (row: any) => {
  // 实现删除逻辑
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 重新加载数据
}
</script>

<style scoped>
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
  justify-content: space-between;
  align-items: center;
}

.statistics-value {
  text-align: center;
}

.statistics-value .number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.statistics-value .label {
  margin-left: 4px;
  color: #909399;
}

.search-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 