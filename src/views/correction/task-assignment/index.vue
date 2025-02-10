<template>
  <div class="task-assignment-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="任务编号">
          <el-input v-model="searchForm.taskCode" placeholder="请输入任务编号" clearable/>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="searchForm.taskType" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item label="工作内容">
          <el-input v-model="searchForm.content" placeholder="请输入工作内容" clearable/>
        </el-form-item>
        <el-form-item label="责任部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker
              v-model="searchForm.publishDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="完成状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item label="要求完成日期">
          <el-date-picker
              v-model="searchForm.deadline"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表展示 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="taskCode" label="任务编号" width="150"/>
      <el-table-column prop="taskType" label="任务类型" width="120"/>
      <el-table-column prop="content" label="工作内容" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="publishDate" label="发布日期" width="120"/>
      <el-table-column prop="department" label="责任部门" width="150"/>
      <el-table-column prop="deadline" label="要求完成日期" width="120"/>
      <el-table-column prop="status" label="完成状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// 搜索表单
const searchForm = ref({
  taskCode: '',
  taskType: '',
  content: '',
  department: '',
  publishDate: '',
  status: '',
  deadline: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表格数据
const tableData = ref([
  {
    taskCode: 'RW-20240101-001',
    taskType: '日常工作',
    content: '工作内容描述...',
    publishDate: '2024-01-01',
    department: '飞行检查部部 飞行部',
    deadline: '2024-01-15',
    status: '进行中'
  }
])

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '未开始': 'info',
    '进行中': 'primary',
    '已完成': 'success',
    '已超期': 'danger'
  }
  return map[status] || ''
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 查看
const handleView = (row: any) => {
  console.log('查看:', row)
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}
</script>

<style scoped>
.task-assignment-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

:deep(.el-select) {
  width: 200px;
}

:deep(.el-date-editor) {
  width: 180px;
}

:deep(.el-input) {
  width: 200px;
}
</style> 