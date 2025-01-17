<template>
  <div class="daily-items-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>日常检查项目</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon>
          <Plus/>
        </el-icon>
        新增项目
      </el-button>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="项目名称">
          <el-input v-model="searchForm.name" placeholder="请输入项目名称" clearable/>
        </el-form-item>
        <el-form-item label="检查类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="常规检查" value="regular"/>
            <el-option label="专项检查" value="special"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 项目列表 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="项目名称"/>
      <el-table-column prop="type" label="检查类型" width="120"/>
      <el-table-column prop="department" label="责任部门" width="150"/>
      <el-table-column prop="frequency" label="检查频率" width="120"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" link @click="handleView(row)">查看</el-button>
          <el-button
              type="danger"
              link
              @click="handleDelete(row)"
          >删除
          </el-button>
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
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Component} from 'vue'
import {ref, defineComponent} from 'vue'
import type {FormInstance, TableInstance} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'

interface SearchForm {
  name: string
  type: string
}

interface TableItem {
  name: string
  type: string
  department: string
  frequency: string
  status: 'active' | 'inactive'
}

// 搜索表单
const searchForm = ref<SearchForm>({
  name: '',
  type: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格数据
const tableData = ref<TableItem[]>([
  {
    name: '设备安全检查',
    type: '常规检查',
    department: '设备部',
    frequency: '每周',
    status: 'active'
  }
])

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    name: '',
    type: ''
  }
  handleSearch()
}

// 新增
const handleAdd = () => {
  // TODO: 实现新增逻辑
}

// 编辑
const handleEdit = (row: TableItem) => {
  // TODO: 实现编辑逻辑
}

// 查看
const handleView = (row: TableItem) => {
  // TODO: 实现查看逻辑
}

// 删除
const handleDelete = (row: TableItem) => {
  ElMessageBox.confirm('确认删除该检查项目?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.daily-items-container {
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

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 