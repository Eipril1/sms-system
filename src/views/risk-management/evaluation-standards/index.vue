<template>
  <div class="evaluation-standards-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="标准名称">
          <el-input v-model="searchForm.name" placeholder="请输入标准名称" clearable/>
        </el-form-item>
        <el-form-item label="标准类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="定性标准" value="定性标准"/>
            <el-option label="定量标准" value="定量标准"/>
          </el-select>
        </el-form-item>
        <el-form-item label="适用范围">
          <el-select v-model="searchForm.scope" placeholder="请选择" clearable>
            <el-option label="全公司" value="全公司"/>
            <el-option label="部门" value="部门"/>
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
      <el-table-column prop="code" label="标准编号" width="120"/>
      <el-table-column prop="name" label="标准名称" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="type" label="标准类型" width="100"/>
      <el-table-column prop="scope" label="适用范围" width="120"/>
      <el-table-column prop="createTime" label="创建时间" width="120"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '生效' ? 'success' : 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// 搜索表单
const searchForm = ref({
  name: '',
  type: '',
  scope: ''
})

// 表格数据
const tableData = ref([
  {
    code: 'ST-20240101-001',
    name: '运行风险评价标准V1.0',
    type: '定性标准',
    scope: '全公司',
    createTime: '2024-01-01',
    status: '生效'
  }
])

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 查看
const handleView = (row: any) => {
  console.log('查看:', row)
}

// 编辑
const handleEdit = (row: any) => {
  console.log('编辑:', row)
}
</script>

<style scoped>
.evaluation-standards-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

:deep(.el-select) {
  width: 200px;
}
</style> 