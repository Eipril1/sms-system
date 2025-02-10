<template>
  <div class="management-plan-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="方案名称">
          <el-input v-model="searchForm.planName" placeholder="请输入方案名称" clearable/>
        </el-form-item>
        <el-form-item label="方案类型">
          <el-select v-model="searchForm.planType" placeholder="请选择" clearable>
            <el-option label="技术运行方案变更" value="技术运行方案变更"/>
            <el-option label="管理变更" value="管理变更"/>
            <el-option label="设备设施变更" value="设备设施变更"/>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="适用部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option label="飞行检查部部" value="飞行检查部部"/>
            <el-option label="飞行管理部" value="飞行管理部"/>
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
      <el-table-column prop="planCode" label="方案编号" width="150"/>
      <el-table-column prop="planName" label="方案名称" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="planType" label="方案类型" width="150"/>
      <el-table-column prop="department" label="适用部门" width="200"/>
      <el-table-column prop="creator" label="创建人" width="100"/>
      <el-table-column prop="createTime" label="创建日期" width="120"/>
      <el-table-column label="修订记录" width="100">
        <template #default="{ row }">
          <el-button link type="success">
            修订记录
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
  planName: '',
  planType: '',
  dateRange: [],
  department: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表格数据
const tableData = ref([
  {
    planCode: 'TE-20250113-035',
    planName: '直升机新机型改变更...',
    planType: '技术/运行方案变更',
    department: '飞行检查部部 飞行部',
    creator: '张铭',
    createTime: '2025-01-13'
  },
  {
    planCode: 'OT-20241220-015',
    planName: '飞行检查单中变更...',
    planType: '其他',
    department: '飞行检查部部 飞行...',
    creator: '张铭',
    createTime: '2024-12-20'
  },
  {
    planCode: 'ME-20241220-018',
    planName: '飞行检查外场增加...',
    planType: '管理变更',
    department: '飞行检查部部 飞行...',
    creator: '张铭',
    createTime: '2024-12-20'
  },
  {
    planCode: 'EF-20241105-003',
    planName: '测试',
    planType: '设备设施变更',
    department: '',
    creator: '冯子铭',
    createTime: '2024-11-05'
  },
  {
    planCode: 'EE-20241105-008',
    planName: '飞管部新大楼试运行...',
    planType: '外部环境变更',
    department: '飞行检查部部',
    creator: '段思敏',
    createTime: '2024-11-05'
  }
])

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    planName: '',
    planType: '',
    dateRange: [],
    department: ''
  }
  handleSearch()
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
.management-plan-container {
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

:deep(.el-select) {
  width: 200px;
}

:deep(.el-date-editor) {
  width: 240px;
}

:deep(.el-button--success) {
  padding: 4px 0;
}
</style> 