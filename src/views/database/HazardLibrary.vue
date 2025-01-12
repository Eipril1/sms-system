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
        placeholder="编号"
        clearable
        class="search-input"
      />
      <el-input
        v-model="searchForm.name"
        placeholder="危险源名称"
        clearable
        class="search-input"
      />
      <el-select v-model="searchForm.category" placeholder="分类" clearable>
        <el-option label="威胁" value="threat" />
        <el-option label="后果" value="consequence" />
      </el-select>
      <el-select v-model="searchForm.system" placeholder="所属系统" clearable>
        <el-option label="飞行运行 FLT" value="FLT" />
        <el-option label="机务维修 MNT" value="MNT" />
        <el-option label="地面保障 GND" value="GND" />
        <el-option label="运行控制 OPS" value="OPS" />
        <el-option label="客舱服务 CAB" value="CAB" />
      </el-select>
      <el-select v-model="searchForm.riskValue" placeholder="风险值" clearable>
        <el-option label="1A-1E" value="1" />
        <el-option label="2A-2E" value="2" />
        <el-option label="3A-3E" value="3" />
        <el-option label="4A-4E" value="4" />
        <el-option label="5A-5E" value="5" />
      </el-select>
    </template>

    <!-- 表格列定义 -->
    <template #columns>
      <el-table-column prop="code" label="编号" width="120" />
      <el-table-column prop="name" label="危险源名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="100">
        <template #default="{ row }">
          {{ getCategoryLabel(row.category) }}
        </template>
      </el-table-column>
      <el-table-column prop="system" label="所属系统" width="120" />
      <el-table-column prop="primaryClass" label="一级分类" width="120" />
      <el-table-column prop="secondaryClass" label="二级分类" width="120" />
      <el-table-column prop="riskValue" label="风险值" width="100">
        <template #default="{ row }">
          <el-tag :type="getRiskValueType(row.riskValue)">
            {{ row.riskValue }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="controlCode" label="控制措施编号" width="120" />
      <el-table-column prop="residualRiskValue" label="剩余风险值" width="100">
        <template #default="{ row }">
          <el-tag type="success">{{ row.residualRiskValue }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="入库时间" width="180" />
    </template>

    <!-- 表单定义 -->
    <template #form>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="危险源编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入危险源编号" />
        </el-form-item>
        <el-form-item label="危险源名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入危险源名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="威胁" value="threat" />
            <el-option label="后果" value="consequence" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属系统" prop="system">
          <el-select v-model="form.system" placeholder="请选择所属系统">
            <el-option label="飞行运行 FLT" value="FLT" />
            <el-option label="机务维修 MNT" value="MNT" />
            <el-option label="地面保障 GND" value="GND" />
            <el-option label="运行控制 OPS" value="OPS" />
            <el-option label="客舱服务 CAB" value="CAB" />
          </el-select>
        </el-form-item>
        <el-form-item label="一级分类" prop="primaryClass">
          <el-input v-model="form.primaryClass" placeholder="请输入一级分类" />
        </el-form-item>
        <el-form-item label="二级分类" prop="secondaryClass">
          <el-input v-model="form.secondaryClass" placeholder="请输入二级分类" />
        </el-form-item>
        <el-form-item label="风险值" prop="riskValue">
          <el-input v-model="form.riskValue" placeholder="请输入风险值" />
        </el-form-item>
        <el-form-item label="控制措施编号" prop="controlCode">
          <el-input v-model="form.controlCode" placeholder="请输入控制措施编号" />
        </el-form-item>
        <el-form-item label="剩余风险值" prop="residualRiskValue">
          <el-input v-model="form.residualRiskValue" placeholder="请输入剩余风险值" />
        </el-form-item>
      </el-form>
    </template>
  </base-library>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import BaseLibrary from './components/BaseLibrary.vue'
import type { FormInstance } from 'element-plus'

// 引用基础库组件
const libraryRef = ref()
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  code: '',
  name: '',
  category: '',
  system: '',
  riskValue: ''
})

// 表单数据
const form = reactive({
  code: '',
  name: '',
  category: '',
  system: '',
  primaryClass: '',
  secondaryClass: '',
  riskValue: '',
  controlCode: '',
  residualRiskValue: '',
  updateTime: ''
})

// 表单验证规则
const rules = {
  code: [{ required: true, message: '请输入危险源编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入危险源名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  system: [{ required: true, message: '请选择所属系统', trigger: 'change' }],
  riskValue: [{ required: true, message: '请输入风险值', trigger: 'blur' }],
  controlCode: [{ required: true, message: '请输入控制措施编号', trigger: 'blur' }],
  residualRiskValue: [{ required: true, message: '请输入剩余风险值', trigger: 'blur' }]
}

// 获取分类标签
const getCategoryLabel = (category: string) => {
  const map: Record<string, string> = {
    threat: '威胁',
    consequence: '后果'
  }
  return map[category] || category
}

// 获取风险值标签类型
const getRiskValueType = (value: string) => {
  const level = value.charAt(0)
  const map: Record<string, 'danger' | 'warning' | 'success'> = {
    '5': 'danger',
    '4': 'danger',
    '3': 'warning',
    '2': 'warning',
    '1': 'success'
  }
  return map[level] || 'info'
}

// 定义原始数据，用于搜索和重置
const originalData = [
  {
    code: 'T-FLT129',
    name: '航路和程序变化',
    category: 'threat',
    system: '飞行运行 FLT',
    primaryClass: '外部威胁',
    secondaryClass: '空域',
    riskValue: '2C',
    controlCode: 'D-FLT042',
    residualRiskValue: '1C',
    updateTime: '2022-05-10'
  },
  {
    code: 'T-WX159',
    name: '技术指令《检查机载应急设备标准》中的工作步骤不明确',
    category: 'threat',
    system: '机务维修 MNT',
    primaryClass: '程序',
    secondaryClass: '工作制度',
    riskValue: '3D',
    controlCode: 'D-WX307',
    residualRiskValue: '1D',
    updateTime: '2022-04-19'
  },
  {
    code: 'T-WX158',
    name: '工具租借过程中双方的使用和识别责任不清晰',
    category: 'threat',
    system: '机务维修 MNT',
    primaryClass: '生产支援',
    secondaryClass: '工具管理',
    riskValue: '3D',
    controlCode: 'D-WX306',
    residualRiskValue: '1D',
    updateTime: '2022-04-19'
  },
  {
    code: 'T-WX157',
    name: '大风天气下飞机长时间设置停留刹车，可能导致刹车系统损坏',
    category: 'threat',
    system: '机务维修 MNT',
    primaryClass: '航线维修',
    secondaryClass: '维修实施',
    riskValue: '3C',
    controlCode: 'D-WX305',
    residualRiskValue: '1C',
    updateTime: '2022-04-19'
  }
]

// 表格数据
const tableData = ref(originalData)

// 搜索处理函数
const handleSearch = () => {
  const { keyword, code, name, category, system, riskValue } = searchForm
  
  // 过滤数据
  const filteredData = originalData.filter(item => {
    // 关键字搜索
    const matchKeyword = !keyword || 
      item.code.toLowerCase().includes(keyword.toLowerCase()) ||
      item.name.toLowerCase().includes(keyword.toLowerCase())
    
    // 精确搜索
    const matchCode = !code || item.code.toLowerCase().includes(code.toLowerCase())
    const matchName = !name || item.name.toLowerCase().includes(name.toLowerCase())
    const matchCategory = !category || item.category === category
    const matchSystem = !system || item.system.includes(system)
    const matchRiskValue = !riskValue || item.riskValue.startsWith(riskValue)
    
    return matchKeyword && matchCode && matchName && matchCategory && matchSystem && matchRiskValue
  })
  
  tableData.value = filteredData
}

// 重置搜索
const resetSearch = () => {
  // 重置所有搜索条件
  searchForm.keyword = ''
  searchForm.code = ''
  searchForm.name = ''
  searchForm.category = ''
  searchForm.system = ''
  searchForm.riskValue = ''
  
  // 重置表格数据
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

/* 调整搜索区域的布局 */
:deep(.search-area) {
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

:deep(.el-select) {
  width: 180px;
}
</style> 