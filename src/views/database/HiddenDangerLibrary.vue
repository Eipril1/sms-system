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
      <el-select v-model="searchForm.department" placeholder="所属部门" clearable>
        <el-option label="安全监察" value="safety" />
        <el-option label="飞行维修" value="maintenance" />
        <el-option label="运行控制" value="operation" />
      </el-select>
      <el-select v-model="searchForm.dangerType" placeholder="隐患类型" clearable>
        <el-option label="一般" value="normal" />
        <el-option label="重大" value="major" />
      </el-select>
      <el-select v-model="searchForm.status" placeholder="关闭情况" clearable>
        <el-option label="已关闭" value="closed" />
        <el-option label="未关闭" value="open" />
      </el-select>
    </template>

    <!-- 表格列定义 -->
    <template #columns>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="discoveryDate" label="录入日期" width="100" />
      <el-table-column prop="department" label="所属部门" width="120" />
      <el-table-column prop="name" label="隐患名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="code" label="隐患编号" width="120" />
      <el-table-column prop="source" label="隐患来源" width="120" />
      <el-table-column prop="dangerType" label="隐患类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getDangerTypeTag(row.dangerType)">
            {{ getDangerTypeLabel(row.dangerType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="mainRisk" label="主要风险" min-width="150" show-overflow-tooltip />
      <el-table-column prop="measures" label="治理措施" min-width="200" show-overflow-tooltip />
      <el-table-column prop="deadline" label="整改期限" width="100" />
      <el-table-column prop="isDevelopRisk" label="是否开展危险源识别" width="150">
        <template #default="{ row }">
          <el-tag :type="row.isDevelopRisk ? 'success' : 'info'">
            {{ row.isDevelopRisk ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="riskCode" label="危险源对应编号" width="140" />
      <el-table-column prop="implementation" label="措施落实" width="120" />
      <el-table-column prop="status" label="关闭情况" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTag(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="verifyInfo" label="验证情况" min-width="150" show-overflow-tooltip />
      <el-table-column prop="verifier" label="验证人" width="100" />
      <el-table-column prop="closeTime" label="安全隐患关闭时间" width="160" />
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleAddFinding(row)">
            新增发现项
          </el-button>
        </template>
      </el-table-column>
    </template>

    <!-- 表单定义 -->
    <template #form>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <!-- 表单内容... -->
      </el-form>
    </template>

    <!-- 添加发现项对话框 -->
    <el-dialog v-model="findingDialogVisible" title="新增发现项" width="600px">
      <el-form :model="findingForm" label-width="100px">
        <el-form-item label="问题描述" required>
          <el-input v-model="findingForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="问题等级" required>
          <el-select v-model="findingForm.level">
            <el-option label="一般" value="normal" />
            <el-option label="重要" value="major" />
            <el-option label="严重" value="severe" />
          </el-select>
        </el-form-item>
        <!-- 其他字段... -->
      </el-form>
      <template #footer>
        <el-button @click="findingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFinding">确认</el-button>
      </template>
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
  code: '',
  department: '',
  dangerType: '',
  status: ''
})

// 表单数据
const form = reactive({
  code: '',
  discoveryDate: '',
  department: '',
  name: '',
  source: '',
  dangerType: '',
  mainRisk: '',
  measures: '',
  deadline: '',
  isDevelopRisk: false,
  riskCode: '',
  implementation: '',
  status: '',
  verifyInfo: '',
  verifier: '',
  closeTime: '',
  remark: ''
})

// 表单验证规则
const rules = {
  code: [{ required: true, message: '请输入隐患编号', trigger: 'blur' }],
  title: [{ required: true, message: '请输入隐患标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择隐患类型', trigger: 'change' }],
  level: [{ required: true, message: '请选择隐患等级', trigger: 'change' }],
  status: [{ required: true, message: '请选择处理状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入隐患描述', trigger: 'blur' }],
  measures: [{ required: true, message: '请输入整改措施', trigger: 'blur' }],
  department: [{ required: true, message: '请输入责任部门', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择整改期限', trigger: 'change' }]
}

// 获取隐患类型标签
const getDangerTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    normal: '一般',
    major: '重大'
  }
  return map[type] || type
}

// 获取隐患类型标签样式
const getDangerTypeTag = (type: string) => {
  return type === 'major' ? 'danger' : 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    closed: '已关闭',
    open: '未关闭'
  }
  return map[status] || status
}

// 获取状态标签样式
const getStatusTag = (status: string) => {
  return status === 'closed' ? 'success' : 'warning'
}

// 静态数据
const originalData = [
  {
    code: 'HD-2024001',
    fromFindingNo: 'FD-2024001',
    findings: [],
    discoveryDate: '2024-01-15',
    department: '飞行维修',
    name: '滑梯维护检查记录不完整',
    source: '日常检查',
    dangerType: 'normal',
    mainRisk: '可能影响应急设备可靠性',
    measures: '完善维护检查记录流程，加强记录管理',
    deadline: '2024-02-15',
    isDevelopRisk: true,
    riskCode: 'T-WX2024001',
    implementation: '已进行',
    status: 'closed',
    verifyInfo: '检查记录完整性提升至98%',
    verifier: '李洪涛',
    closeTime: '2024-02-10',
    remark: ''
  },
  {
    code: 'RLOP-2024002',
    discoveryDate: '2024-01-20',
    department: '运行控制',
    name: '航班放行文件未按规定时限存档',
    source: '内部审核',
    dangerType: 'normal',
    mainRisk: '影响运行数据追溯',
    measures: '优化文件管理系统，明确存档职责',
    deadline: '2024-02-20',
    isDevelopRisk: true,
    riskCode: 'T-OPS2024002',
    implementation: '进行中',
    status: 'open',
    verifyInfo: '正在实施系统升级',
    verifier: '张明',
    closeTime: '',
    remark: '系统升级预计2024年3月完成'
  },
  {
    code: 'RLSF-2024003',
    discoveryDate: '2024-02-01',
    department: '安全监察',
    name: '部分机组疲劳风险报告填写不规范',
    source: '安全检查',
    dangerType: 'major',
    mainRisk: '可能影响机组执勤安全',
    measures: '开展疲劳管理培训，完善报告系统',
    deadline: '2024-02-29',
    isDevelopRisk: true,
    riskCode: 'T-FLT2024003',
    implementation: '已完成',
    status: 'closed',
    verifyInfo: '报告规范性提升至95%',
    verifier: '王建国',
    closeTime: '2024-02-25',
    remark: '后续将持续跟踪监控'
  },
  {
    code: 'RLWX-2024004',
    discoveryDate: '2024-02-05',
    department: '飞行维修',
    name: 'APU滑油消耗异常未及时分析',
    source: '技术分析',
    dangerType: 'major',
    mainRisk: '可能影响发动机可靠性',
    measures: '制定滑油消耗监控标准，建立分析机制',
    deadline: '2024-03-05',
    isDevelopRisk: true,
    riskCode: 'T-WX2024004',
    implementation: '进行中',
    status: 'open',
    verifyInfo: '正在收集分析数据',
    verifier: '陈工',
    closeTime: '',
    remark: '需要收集3个月数据进行分析'
  },
  {
    code: 'RLOP-2024005',
    discoveryDate: '2024-02-10',
    department: '运行控制',
    name: '新机场天气报告获取延迟',
    source: '运行反馈',
    dangerType: 'normal',
    mainRisk: '影响航班计划制定准确性',
    measures: '优化天气信息获取渠道，增加备用数据源',
    deadline: '2024-03-10',
    isDevelopRisk: false,
    riskCode: '',
    implementation: '计划中',
    status: 'open',
    verifyInfo: '待实施',
    verifier: '赵航',
    closeTime: '',
    remark: '正在与气象部门协调'
  }
]

// 表格数据
const tableData = ref(originalData)

// 搜索处理函数
const handleSearch = () => {
  const { keyword, code, department, dangerType, status } = searchForm
  
  const filteredData = originalData.filter(item => {
    const matchKeyword = !keyword || 
      item.code.toLowerCase().includes(keyword.toLowerCase()) ||
      item.name.toLowerCase().includes(keyword.toLowerCase())
    
    const matchCode = !code || item.code.toLowerCase().includes(code.toLowerCase())
    const matchDepartment = !department || item.department === department
    const matchDangerType = !dangerType || item.dangerType === dangerType
    const matchStatus = !status || item.status === status
    
    return matchKeyword && matchCode && matchDepartment && matchDangerType && matchStatus
  })
  
  tableData.value = filteredData
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.code = ''
  searchForm.department = ''
  searchForm.dangerType = ''
  searchForm.status = ''
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
  findingForm.parentHazardNo = row.code
  findingDialogVisible.value = true
}

const submitFinding = async () => {
  // 调用API创建发现项
  await createFinding({
    ...findingForm,
    source: 'hazard-treatment',
    sourceNo: findingForm.parentHazardNo
  })
  
  // 更新隐患记录
  await updateHazard({
    code: findingForm.parentHazardNo,
    findings: [...currentFindings, newFindingCode]
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