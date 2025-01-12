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
        v-model="searchForm.checkNo"
        placeholder="检查单编号"
        clearable
        class="search-input"
      />
      <el-select v-model="searchForm.checkedDept" placeholder="被审核部门" clearable>
        <el-option label="飞行部" value="飞行部" />
        <el-option label="维修部" value="维修部" />
        <el-option label="运控部" value="运控部" />
        <el-option label="安全部" value="安全部" />
      </el-select>
    </template>

    <!-- 表格列定义 -->
    <template #columns>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="checkItem" label="监督审核项目" min-width="200" show-overflow-tooltip />
      <el-table-column prop="checkTarget" label="检查对象" min-width="150" show-overflow-tooltip />
      <el-table-column prop="checkedDept" label="被审核部门" width="120" />
      <el-table-column prop="checkNo" label="检查单编号" width="120" />
      <el-table-column prop="checkTeam" label="监督审核组成员" width="150" />
      <el-table-column prop="checkTime" label="检查时间" width="180" />
      <el-table-column prop="checkLocation" label="检查地点" width="120" />
      <el-table-column prop="checkBasis" label="检查依据/重点" min-width="200" show-overflow-tooltip />
      <el-table-column prop="checkResult" label="结论判定" min-width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleAddFinding(row)">
            记录发现项
          </el-button>
        </template>
      </el-table-column>
    </template>

    <!-- 记录发现项对话框 -->
    <el-dialog v-model="findingDialogVisible" title="记录发现项" width="600px">
      <el-form :model="findingForm" label-width="100px">
        <!-- 表单内容... -->
      </el-form>
    </el-dialog>
  </base-library>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import BaseLibrary from './components/BaseLibrary.vue'
import type { FormInstance } from 'element-plus'

// 引用基础库组件
const libraryRef = ref()
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  checkNo: '',
  checkedDept: ''
})

// 静态数据
const originalData = [
  {
    checkItem: '次日风险落实、调测、应知应会检查',
    checkTarget: '运行控制部航班签派员',
    checkedDept: '运控部',
    checkNo: 'RLSJ-2024001',
    checkTeam: '王建国、李明',
    checkTime: '2024-02-26 09:00',
    checkLocation: '运控中心',
    checkBasis: '《次日航班运行风险评估程序》《运行手册》、局方/公司安全运行文件',
    checkResult: '符合要求',
    findings: []
  },
  {
    checkItem: '机组资质检查',
    checkTarget: '飞行部B737机型机组',
    checkedDept: '飞行部',
    checkNo: 'RLSJ-2024002',
    checkTeam: '张志强、刘伟',
    checkTime: '2024-02-26 14:00',
    checkLocation: '飞行部',
    checkBasis: '《机组资质管理规定》《训练大纲》',
    checkResult: '发现2项问题，已要求整改',
    findings: []
  }
]

// 表格数据
const tableData = ref(originalData)

// 搜索处理函数
const handleSearch = () => {
  const { keyword, checkNo, checkedDept } = searchForm
  
  const filteredData = originalData.filter(item => {
    const matchKeyword = !keyword || 
      item.checkItem.toLowerCase().includes(keyword.toLowerCase()) ||
      item.checkTarget.toLowerCase().includes(keyword.toLowerCase())
    
    const matchCheckNo = !checkNo || item.checkNo.toLowerCase().includes(checkNo.toLowerCase())
    const matchCheckedDept = !checkedDept || item.checkedDept === checkedDept
    
    return matchKeyword && matchCheckNo && matchCheckedDept
  })
  
  tableData.value = filteredData
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.checkNo = ''
  searchForm.checkedDept = ''
  tableData.value = originalData
}

// 新增发现项相关逻辑
const findingDialogVisible = ref(false)
const findingForm = reactive({
  description: '',
  level: '',
  sourceType: 'hazard',
  parentHazardNo: ''
})

const handleAddFinding = (row) => {
  findingForm.sourceType = 'checklist'
  findingForm.sourceNo = row.checkNo
  findingDialogVisible.value = true
}

const submitFinding = async () => {
  // 创建发现项
  const finding = await createFinding({
    ...findingForm,
    source: 'supervision'
  })
  
  // 更新检查单
  await updateChecklist({
    checkNo: findingForm.sourceNo,
    findings: [...currentFindings, finding.code]
  })
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