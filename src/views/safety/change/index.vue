<template>
  <div class="change-management">
    <div class="page-header">
      <h2>变更管理</h2>
      <el-button type="primary" @click="handleAdd">+ 新增变更</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="变更编号">
          <el-input v-model="searchForm.changeNo" placeholder="请输入变更编号" clearable />
        </el-form-item>
        <el-form-item label="变更类型">
          <el-select v-model="searchForm.changeType" placeholder="请选择" clearable>
            <el-option label="组织机构" value="organization" />
            <el-option label="运行政策" value="policy" />
            <el-option label="管理手册" value="manual" />
            <!-- 其他变更类型... -->
          </el-select>
        </el-form-item>
        <el-form-item label="变更状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待审批" value="pending" />
            <el-option label="已批准" value="approved" />
            <el-option label="已拒绝" value="rejected" />
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
      <el-table-column prop="changeNo" label="变更编号" width="120" />
      <el-table-column prop="changeType" label="变更类型" width="120" />
      <el-table-column prop="changeTitle" label="变更标题" min-width="200" />
      <el-table-column prop="applicant" label="申请人" width="100" />
      <el-table-column prop="department" label="所属部门" width="120" />
      <el-table-column prop="applyDate" label="申请日期" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 搜索表单
const searchForm = reactive({
  changeNo: '',
  changeType: '',
  status: ''
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取状态标签类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审批',
    approved: '已批准',
    rejected: '已拒绝'
  }
  return map[status] || status
}

// 方法定义
const handleSearch = () => {
  // 实现搜索逻辑
}

const handleReset = () => {
  searchForm.changeNo = ''
  searchForm.changeType = ''
  searchForm.status = ''
}

const handleAdd = () => {
  // 实现新增逻辑
}

const handleEdit = (row: any) => {
  // 实现编辑逻辑
}

const handleView = (row: any) => {
  // 实现查看逻辑
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
.change-management {
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}
</style> 