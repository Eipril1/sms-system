<template>
  <base-library
      ref="libraryRef"
      :data="tableData"
      @search="handleSearch"
      @reset="resetSearch"
  >
    <!-- 自定义搜索条件 -->
    <template #extra-search>
      <el-input
          v-model="searchForm.code"
          placeholder="指标编号"
          clearable
          class="search-input"
      />
      <el-select v-model="searchForm.category" placeholder="指标类别" clearable>
        <el-option label="安全目标" value="target"/>
        <el-option label="管理要求" value="management"/>
        <el-option label="运行指标" value="operation"/>
      </el-select>
      <el-select v-model="searchForm.department" placeholder="责任部门" clearable>
        <el-option label="飞行部" value="flight"/>
        <el-option label="维修部" value="maintenance"/>
        <el-option label="运控部" value="operation"/>
        <el-option label="安全部" value="safety"/>
      </el-select>
      <el-select v-model="searchForm.status" placeholder="监控状态" clearable>
        <el-option label="正常" value="normal"/>
        <el-option label="预警" value="warning"/>
        <el-option label="超限" value="exceeded"/>
      </el-select>
    </template>

    <!-- 表格列定义 -->
    <template #columns>
      <el-table-column type="index" label="序号" width="60"/>
      <el-table-column prop="code" label="指标编号" width="120"/>
      <el-table-column prop="name" label="指标名称" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="category" label="指标类别" width="100">
        <template #default="{ row }">
          {{ getCategoryLabel(row.category) }}
        </template>
      </el-table-column>
      <el-table-column prop="department" label="责任部门" width="100"/>
      <el-table-column prop="description" label="指标描述" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="target" label="目标值" width="100"/>
      <el-table-column prop="warningValue" label="预警值" width="100"/>
      <el-table-column prop="currentValue" label="当前值" width="100"/>
      <el-table-column prop="status" label="监控状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="monitorFreq" label="监控频率" width="100"/>
      <el-table-column prop="updateTime" label="更新时间" width="180"/>
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip/>
    </template>

    <!-- 表单定义 -->
    <template #form>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="指标编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入指标编号"/>
        </el-form-item>
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入指标名称"/>
        </el-form-item>
        <el-form-item label="指标类别" prop="category">
          <el-select v-model="form.category" placeholder="请选择指标类别">
            <el-option label="安全目标" value="target"/>
            <el-option label="管理要求" value="management"/>
            <el-option label="运行指标" value="operation"/>
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择责任部门">
            <el-option label="飞行部" value="flight"/>
            <el-option label="维修部" value="maintenance"/>
            <el-option label="运控部" value="operation"/>
            <el-option label="安全部" value="safety"/>
          </el-select>
        </el-form-item>
        <el-form-item label="指标描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入指标描述"
          />
        </el-form-item>
        <el-form-item label="目标值" prop="target">
          <el-input v-model="form.target" placeholder="请输入目标值"/>
        </el-form-item>
        <el-form-item label="预警值" prop="warningValue">
          <el-input v-model="form.warningValue" placeholder="请输入预警值"/>
        </el-form-item>
        <el-form-item label="监控频率" prop="monitorFreq">
          <el-select v-model="form.monitorFreq" placeholder="请选择监控频率">
            <el-option label="每日" value="daily"/>
            <el-option label="每周" value="weekly"/>
            <el-option label="每月" value="monthly"/>
            <el-option label="每季" value="quarterly"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注信息"/>
        </el-form-item>
      </el-form>
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
  code: '',
  category: '',
  department: '',
  status: ''
})

// 表单数据
const form = reactive({
  code: '',
  name: '',
  category: '',
  department: '',
  description: '',
  target: '',
  warningValue: '',
  currentValue: '',
  status: '',
  monitorFreq: '',
  updateTime: '',
  remark: ''
})

// 获取指标类别标签
const getCategoryLabel = (category: string) => {
  const map: Record<string, string> = {
    target: '安全目标',
    management: '管理要求',
    operation: '运行指标'
  }
  return map[category] || category
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    normal: '正常',
    warning: '预警',
    exceeded: '超限'
  }
  return map[status] || status
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger'> = {
    normal: 'success',
    warning: 'warning',
    exceeded: 'danger'
  }
  return map[status] || 'info'
}

// 静态数据
const originalData = [
  {
    code: 'KPI-FLT-001',
    name: '飞行事故率',
    category: 'target',
    department: '飞行部',
    description: '每10000飞行小时飞行事故次数',
    target: '0',
    warningValue: '0.05',
    currentValue: '0',
    status: 'normal',
    monitorFreq: 'monthly',
    updateTime: '2024-02-25',
    remark: '持续保持零事故'
  },
  {
    code: 'KPI-MNT-001',
    name: '技术故障率',
    category: 'operation',
    department: '维修部',
    description: '每100次起飞技术故障次数',
    target: '0.5',
    warningValue: '0.8',
    currentValue: '0.75',
    status: 'warning',
    monitorFreq: 'monthly',
    updateTime: '2024-02-25',
    remark: '需要关注发动机故障率上升趋势'
  },
  {
    code: 'KPI-OPS-001',
    name: '放行正常率',
    category: 'operation',
    department: '运控部',
    description: '航班正常放行比例',
    target: '99%',
    warningValue: '98%',
    currentValue: '98.5%',
    status: 'warning',
    monitorFreq: 'daily',
    updateTime: '2024-02-25',
    remark: '受天气影响较大'
  },
  {
    code: 'KPI-SAF-001',
    name: '安全报告提交率',
    category: 'management',
    department: '安全部',
    description: '安全信息报告按时提交比例',
    target: '100%',
    warningValue: '95%',
    currentValue: '97%',
    status: 'normal',
    monitorFreq: 'monthly',
    updateTime: '2024-02-25',
    remark: ''
  },
  {
    code: 'KPI-MNT-002',
    name: 'MEL延期执行率',
    category: 'operation',
    department: '维修部',
    description: 'MEL项目延期执行比例',
    target: '5%',
    warningValue: '8%',
    currentValue: '9%',
    status: 'exceeded',
    monitorFreq: 'weekly',
    updateTime: '2024-02-25',
    remark: '需要加强备件储备'
  }
]

// 表格数据
const tableData = ref(originalData)

// 搜索处理函数
const handleSearch = () => {
  const {keyword, code, category, department, status} = searchForm

  const filteredData = originalData.filter(item => {
    const matchKeyword = !keyword ||
        item.code.toLowerCase().includes(keyword.toLowerCase()) ||
        item.name.toLowerCase().includes(keyword.toLowerCase())

    const matchCode = !code || item.code.toLowerCase().includes(code.toLowerCase())
    const matchCategory = !category || item.category === category
    const matchDepartment = !department || item.department === department
    const matchStatus = !status || item.status === status

    return matchKeyword && matchCode && matchCategory && matchDepartment && matchStatus
  })

  tableData.value = filteredData
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.code = ''
  searchForm.category = ''
  searchForm.department = ''
  searchForm.status = ''
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