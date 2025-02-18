<template>
  <div class="hazard-query-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="过程名称">
          <el-select v-model="searchForm.processName" placeholder="可接受程度" clearable>
            <el-option label="三级配置" value="三级配置"/>
          </el-select>
        </el-form-item>
        <el-form-item label="涉及部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option label="地面服务部" value="地面服务部"/>
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="searchForm.riskLevel" placeholder="请选择" clearable>
            <el-option label="2" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="控制措施描述">
          <el-select v-model="searchForm.controlMeasure" placeholder="请选择" clearable>
            <el-option label="建立管理" value="建立管理"/>
          </el-select>
        </el-form-item>
        <el-form-item label="最后关联事件">
          <el-select v-model="searchForm.lastEvent" placeholder="请选择" clearable>
            <el-option label="0" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="可能导致的后果">
          <el-select v-model="searchForm.consequence" placeholder="请选择" clearable>
            <el-option label="可能导致" value="可能导致"/>
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
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="hazardCode" label="危险源编号" width="120"/>
      <el-table-column prop="hazardDesc" label="危险源描述" min-width="180" show-overflow-tooltip/>
      <el-table-column prop="riskLevel" label="涉及风险" width="120"/>
      <el-table-column prop="possibleRisk" label="可能导致的后果" min-width="180" show-overflow-tooltip/>
      <el-table-column prop="acceptableLevel" label="可接受程度" width="120"/>
      <el-table-column prop="controlMeasure" label="风险控制措施" min-width="180" show-overflow-tooltip/>
      <el-table-column prop="eventCount" label="关联次数" width="100"/>
      <el-table-column prop="relatedDept" label="责任部门" width="120"/>
      <el-table-column prop="department" label="涉及部门" width="120"/>
      <el-table-column prop="creator" label="创建人" width="100"/>
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
import {ElMessage, ElMessageBox} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'

// 搜索表单
const searchForm = ref({
  processName: '',
  department: '',
  riskLevel: '',
  controlMeasure: '',
  lastEvent: '',
  consequence: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表格数据
const tableData = ref([
  {
    hazardCode: '009155',
    hazardDesc: '在不良天气...',
    riskLevel: '三级配置',
    possibleRisk: '可能导致...',
    acceptableLevel: '建立管理',
    controlMeasure: '建立管理...',
    eventCount: '0',
    relatedDept: '地面服务部',
    department: '地面服务部',
    creator: '郑佳伟'
  }
])

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    processName: '',
    department: '',
    riskLevel: '',
    controlMeasure: '',
    lastEvent: '',
    consequence: ''
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
.hazard-query-container {
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
  width: 180px;
}
</style> 