<template>
  <div class="issue-discovery-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="问题编号">
          <el-input v-model="searchForm.issueCode" placeholder="请输入问题编号" clearable/>
        </el-form-item>
        <el-form-item label="问题类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
            <el-option label="安全隐患" value="安全隐患"/>
            <el-option label="流程问题" value="流程问题"/>
            <el-option label="设备故障" value="设备故障"/>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input v-model="searchForm.description" placeholder="请输入问题描述" clearable/>
        </el-form-item>
        <el-form-item label="责任部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
            <el-option label="飞行部" value="飞行部"/>
            <el-option label="维修部" value="维修部"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发现日期">
          <el-date-picker
              v-model="searchForm.findDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
            <el-option label="待处理" value="待处理"/>
            <el-option label="处理中" value="处理中"/>
            <el-option label="已完成" value="已完成"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表展示 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="issueCode" label="问题编号" width="150"/>
      <el-table-column prop="type" label="问题类型" width="120"/>
      <el-table-column prop="description" label="问题描述" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="findDate" label="发现日期" width="120"/>
      <el-table-column prop="department" label="责任部门" width="150"/>
      <el-table-column prop="status" label="处理状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="handler" label="处理人" width="100"/>
      <el-table-column prop="handleDate" label="处理日期" width="120"/>
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
  issueCode: '',
  type: '',
  description: '',
  department: '',
  findDate: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表格数据
const tableData = ref([
  {
    issueCode: 'WT-20240101-001',
    type: '安全隐患',
    description: '发现某设备存在安全隐患...',
    findDate: '2024-01-01',
    department: '飞行检查部',
    status: '待处理',
    handler: '张三',
    handleDate: '2024-01-02'
  }
])

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待处理': 'warning',
    '处理中': 'primary',
    '已完成': 'success'
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
.issue-discovery-container {
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