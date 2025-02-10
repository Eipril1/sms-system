<template>
  <div class="safety-control-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="隐患类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="设备隐患" value="设备隐患"/>
            <el-option label="人员隐患" value="人员隐患"/>
            <el-option label="环境隐患" value="环境隐患"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发现日期">
          <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待处理" value="待处理"/>
            <el-option label="处理中" value="处理中"/>
            <el-option label="已完成" value="已完成"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="success" @click="handleAdd">新增隐患</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表展示 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="code" label="隐患编号" width="120"/>
      <el-table-column prop="type" label="隐患类型" width="100"/>
      <el-table-column prop="description" label="隐患描述" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="level" label="风险等级" width="100">
        <template #default="{ row }">
          <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="findTime" label="发现时间" width="120"/>
      <el-table-column prop="status" label="处理状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="责任部门" width="120"/>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="primary" @click="handleEdit(row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// 搜索表单
const searchForm = ref({
  type: '',
  dateRange: [],
  status: ''
})

// 表格数据
const tableData = ref([
  {
    code: 'YH-20240101-001',
    type: '设备隐患',
    description: '设备老化存在安全隐患...',
    level: '高',
    findTime: '2024-01-01',
    status: '待处理',
    department: '维修部'
  }
])

// 获取风险等级样式
const getLevelType = (level: string) => {
  const map: Record<string, string> = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return map[level] || ''
}

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

// 新增
const handleAdd = () => {
  console.log('新增隐患')
}

// 查看
const handleView = (row: any) => {
  console.log('查看:', row)
}

// 处理
const handleEdit = (row: any) => {
  console.log('处理:', row)
}
</script>

<style scoped>
.safety-control-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

:deep(.el-select) {
  width: 200px;
}

:deep(.el-date-editor) {
  width: 240px;
}
</style> 