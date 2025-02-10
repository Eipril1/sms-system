<template>
  <base-library
      ref="libraryRef"
      :data="tableData"
      @search="handleSearch"
      @reset="resetSearch"
  >
    <!-- 自定义搜索条件 -->
    <template #extra-search>
      <el-select v-model="searchForm.checkType" placeholder="检查专业" clearable>
        <el-option label="航空安全" value="航空安全"/>
        <el-option label="维修工程" value="维修工程"/>
        <el-option label="运行控制" value="运行控制"/>
        <el-option label="客舱安全" value="客舱安全"/>
      </el-select>
      <el-select v-model="searchForm.isExecuted" placeholder="是否执行" clearable>
        <el-option label="已执行" value="true"/>
        <el-option label="未执行" value="false"/>
      </el-select>
      <el-select v-model="searchForm.isClosed" placeholder="是否关闭" clearable>
        <el-option label="已关闭" value="true"/>
        <el-option label="未关闭" value="false"/>
      </el-select>
    </template>

    <!-- 表格列定义 -->
    <template #columns>
      <el-table-column type="index" label="序号" width="60"/>
      <el-table-column prop="checkType" label="检查专业" width="120"/>
      <el-table-column prop="planTime" label="计划时间(月)" width="120"/>
      <el-table-column prop="checkItems" label="检查项目" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="superviseDept" label="实施监察单位/部门" width="160"/>
      <el-table-column prop="checkedDept" label="被检查单位/部门" width="160"/>
      <el-table-column prop="isExecuted" label="是否执行" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isExecuted ? 'success' : 'info'">
            {{ row.isExecuted ? '已执行' : '未执行' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="adjustInfo" label="调整情况" min-width="150" show-overflow-tooltip/>
      <el-table-column prop="isClosed" label="是否关闭" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isClosed ? 'success' : 'warning'">
            {{ row.isClosed ? '已关闭' : '未关闭' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip/>
    </template>
  </base-library>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import BaseLibrary from './components/BaseLibrary.vue'
import type {FormInstance} from 'element-plus'

// 引用基础库组件
const libraryRef = ref()
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  checkType: '',
  isExecuted: '',
  isClosed: ''
})

// 静态数据
const originalData = [
  {
    checkNo: 'RLZJ-2024005',
    findings: [],
    checkType: '航空安全',
    planTime: '2024-03',
    checkItems: '航空器运行安全检查',
    superviseDept: '安全监察部',
    checkedDept: '飞行部',
    isExecuted: true,
    adjustInfo: '按计划执行',
    isClosed: true,
    remark: ''
  },
  {
    checkType: '维修工程',
    planTime: '2024-03',
    checkItems: '航线维修质量检查',
    superviseDept: '质量监察室',
    checkedDept: '维修工程部',
    isExecuted: true,
    adjustInfo: '因故推迟一周',
    isClosed: false,
    remark: '正在整改'
  },
  {
    checkType: '运行控制',
    planTime: '2024-03',
    checkItems: '飞行签派资质检查',
    superviseDept: '安全监察部',
    checkedDept: '运行控制部',
    isExecuted: false,
    adjustInfo: '计划月底执行',
    isClosed: false,
    remark: ''
  },
  {
    checkType: '客舱安全',
    planTime: '2024-03',
    checkItems: '客舱应急设备检查',
    superviseDept: '客舱安全监察室',
    checkedDept: '客舱服务部',
    isExecuted: true,
    adjustInfo: '',
    isClosed: true,
    remark: '已完成整改'
  }
]

// 表格数据
const tableData = ref(originalData)

// 搜索处理函数
const handleSearch = () => {
  const {keyword, checkType, isExecuted, isClosed} = searchForm

  const filteredData = originalData.filter(item => {
    const matchKeyword = !keyword ||
        item.checkItems.toLowerCase().includes(keyword.toLowerCase()) ||
        item.checkType.toLowerCase().includes(keyword.toLowerCase())

    const matchCheckType = !checkType || item.checkType === checkType
    const matchIsExecuted = isExecuted === '' || String(item.isExecuted) === isExecuted
    const matchIsClosed = isClosed === '' || String(item.isClosed) === isClosed

    return matchKeyword && matchCheckType && matchIsExecuted && matchIsClosed
  })

  tableData.value = filteredData
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.checkType = ''
  searchForm.isExecuted = ''
  searchForm.isClosed = ''
  tableData.value = originalData
}
</script>

<style scoped>
.el-tag {
  min-width: 60px;
  text-align: center;
}

:deep(.el-table) {
  margin: 20px 0;
}

:deep(.el-table__empty-block) {
  min-height: 200px;
}

.search-input {
  width: 180px;
}

:deep(.search-area) {
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

:deep(.el-select) {
  width: 180px;
}
</style> 