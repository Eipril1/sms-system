<template>
  <div class="tracking-verification-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="来源编号">
          <el-input v-model="searchForm.sourceCode" placeholder="请输入来源编号" clearable/>
        </el-form-item>
        <el-form-item label="验证类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
            <el-option label="配合监查验证" value="配合监查验证"/>
            <el-option label="飞行" value="飞行"/>
          </el-select>
        </el-form-item>
        <el-form-item label="验证日期">
          <el-date-picker
              v-model="searchForm.verifyDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="责任部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
            <el-option label="地面服务部" value="地面服务部"/>
          </el-select>
        </el-form-item>
        <el-form-item label="验证人">
          <el-input v-model="searchForm.verifier" placeholder="请输入验证人" clearable/>
        </el-form-item>
        <el-form-item label="责任人">
          <el-input v-model="searchForm.responsible" placeholder="请输入责任人" clearable/>
        </el-form-item>
        <el-form-item label="结论">
          <el-select v-model="searchForm.result" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
            <el-option label="验证通过" value="验证通过"/>
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
      <el-table-column prop="sourceCode" label="来源编号" width="150"/>
      <el-table-column prop="type" label="验证类型" width="150"/>
      <el-table-column prop="department" label="责任部门" width="150"/>
      <el-table-column prop="verifyDate" label="验证日期" width="120"/>
      <el-table-column prop="verifier" label="验证人" width="100"/>
      <el-table-column prop="responsible" label="责任人" width="100"/>
      <el-table-column prop="verifyDate2" label="验证日期" width="120"/>
      <el-table-column prop="result" label="结论" width="100">
        <template #default="{ row }">
          <el-tag :type="getResultType(row.result)">{{ row.result }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="verifyTimes" label="验证次数" width="100" align="center"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag>{{ row.status }}</el-tag>
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
  sourceCode: '',
  type: '',
  verifyDate: '',
  department: '',
  verifier: '',
  responsible: '',
  result: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表格数据
const tableData = ref([
  {
    sourceCode: 'Se20210421-001',
    type: '配合监查验证',
    department: '地面服务部',
    verifyDate: '2021-05-11',
    verifier: '李强',
    responsible: '陈建平',
    verifyDate2: '2021-05-17',
    result: '验证通过',
    verifyTimes: 1,
    status: '已验证'
  },
  {
    sourceCode: '20210410-001',
    type: '飞行',
    department: '地面服务部',
    verifyDate: '2021-04-30',
    verifier: '沈翼',
    responsible: '郑建峰',
    verifyDate2: '2021-05-07',
    result: '验证通过',
    verifyTimes: 1,
    status: '已验证'
  },
  {
    sourceCode: '20210415-001',
    type: '飞行',
    department: '地面服务部',
    verifyDate: '2021-04-29',
    verifier: '沈翼',
    responsible: '郑建峰',
    verifyDate2: '2021-05-07',
    result: '验证通过',
    verifyTimes: 1,
    status: '已验证'
  }
])

// 获取结果样式
const getResultType = (result: string) => {
  const map: Record<string, string> = {
    '验证通过': 'success',
    '未通过': 'danger',
    '待验证': 'info'
  }
  return map[result] || ''
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
.tracking-verification-container {
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