<template>
  <div class="hazard-dynamic-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="变化类型">
          <el-select v-model="searchForm.changeType" placeholder="请选择" clearable>
            <el-option label="新增" value="新增"/>
            <el-option label="修改" value="修改"/>
            <el-option label="删除" value="删除"/>
          </el-select>
        </el-form-item>
        <el-form-item label="变化日期">
          <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="责任部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option label="飞行部" value="飞行部"/>
            <el-option label="维修部" value="维修部"/>
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
      <el-table-column prop="changeType" label="变化类型" width="100"/>
      <el-table-column prop="hazardCode" label="危险源编号" width="120"/>
      <el-table-column prop="hazardDesc" label="危险源描述" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="department" label="责任部门" width="120"/>
      <el-table-column prop="changeDate" label="变化日期" width="120"/>
      <el-table-column prop="operator" label="操作人" width="100"/>
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip/>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// 搜索表单
const searchForm = ref({
  changeType: '',
  dateRange: [],
  department: ''
})

// 表格数据
const tableData = ref([
  {
    changeType: '新增',
    hazardCode: 'HZ-20240101-001',
    hazardDesc: '新增危险源描述...',
    department: '飞行部',
    changeDate: '2024-01-01',
    operator: '张三',
    remark: '系统自动新增'
  }
])

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}
</script>

<style scoped>
.hazard-dynamic-container {
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