<template>
  <div class="audit-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="监察与审核编号">
          <el-input v-model="searchForm.code" placeholder="请输入编号" clearable/>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入标题" clearable/>
        </el-form-item>
        <el-form-item label="计划完成日期">
          <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="监察审核类型">
          <el-select v-model="searchForm.auditType" placeholder="请选择" clearable>
            <el-option label="年度" value="year"/>
            <el-option label="月度" value="month"/>
          </el-select>
        </el-form-item>
        <el-form-item label="制定人">
          <el-input v-model="searchForm.creator" placeholder="请输入制定人" clearable/>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待处理" value="pending"/>
            <el-option label="处理中" value="processing"/>
            <el-option label="已完成" value="completed"/>
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option label="部门1" value="dept1"/>
            <el-option label="部门2" value="dept2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表展示 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="code" label="编号" width="150"/>
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="creator" label="制定人" width="120"/>
      <el-table-column prop="createTime" label="制定日期" width="120"/>
      <el-table-column prop="planDate" label="计划完成日期" width="180"/>
      <el-table-column prop="auditType" label="监察审核类型" width="120">
        <template #default="{ row }">
          {{ getAuditTypeName(row.auditType) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="处理状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusName(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
import {ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'

// 搜索表单
const searchForm = ref({
  code: '',
  title: '',
  dateRange: [],
  auditType: '',
  creator: '',
  status: '',
  department: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格数据
const tableData = ref([
  {
    code: 'ISP202501-DF005',
    title: '1月份管理检查计划',
    creator: '管理员',
    createTime: '2025-01-15',
    planDate: '2025/01/15-2025/01/20',
    auditType: 'month',
    status: 'pending'
  },
  {
    code: 'ISP202501-DF004',
    title: '1月份巡检',
    creator: '管理员',
    createTime: '2025-01-15',
    planDate: '2025/01/15-2025/01/20',
    auditType: 'month',
    status: 'processing'
  }
])

// 获取监察审核类型名称
const getAuditTypeName = (type: string) => {
  const map: Record<string, string> = {
    year: '年度',
    month: '月度'
  }
  return map[type] || type
}

// 获取状态名称
const getStatusName = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成'
  }
  return map[status] || status
}

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success'
  }
  return map[status] || ''
}

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索条件:', searchForm.value)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    code: '',
    title: '',
    dateRange: [],
    auditType: '',
    creator: '',
    status: '',
    department: ''
  }
  handleSearch()
}

// 查看
const handleView = (row: any) => {
  // TODO: 实现查看逻辑
  console.log('查看:', row)
}

// 编辑
const handleEdit = (row: any) => {
  // TODO: 实现编辑逻辑
  console.log('编辑:', row)
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该记录？', '提示', {
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
.audit-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-date-editor) {
  width: 240px;
}
</style> 