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
        placeholder="发现项编号"
        clearable
        class="search-input"
      />
      <el-select v-model="searchForm.source" placeholder="来源" clearable>
        <el-option label="监督检查" value="supervision" />
        <el-option label="法定自查" value="self-inspection" />
        <el-option label="内部审核" value="internal-audit" />
        <el-option label="外部审核" value="external-audit" />
      </el-select>
      <el-select v-model="searchForm.level" placeholder="问题等级" clearable>
        <el-option label="一般" value="normal" />
        <el-option label="重要" value="major" />
        <el-option label="严重" value="severe" />
      </el-select>
      <el-select v-model="searchForm.status" placeholder="状态" clearable>
        <el-option label="待整改" value="pending" />
        <el-option label="整改中" value="processing" />
        <el-option label="待验证" value="verifying" />
        <el-option label="已关闭" value="closed" />
      </el-select>
    </template>

    <!-- 表格列定义 -->
    <template #columns>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="code" label="发现项编号" width="120" />
      <el-table-column prop="source" label="来源" width="100">
        <template #default="{ row }">
          {{ getSourceLabel(row.source) }}
        </template>
      </el-table-column>
      <el-table-column prop="sourceNo" label="来源编号" width="120" />
      <el-table-column prop="parentHazardNo" label="关联隐患编号" width="120" />
      <el-table-column prop="toHazardNo" label="升级隐患编号" width="120" />
      <el-table-column prop="findingDate" label="发现日期" width="100" />
      <el-table-column prop="department" label="责任部门" width="100" />
      <el-table-column prop="description" label="问题描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="level" label="问题等级" width="100">
        <template #default="{ row }">
          <el-tag :type="getLevelType(row.level)">
            {{ getLevelLabel(row.level) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="requirement" label="整改要求" min-width="200" show-overflow-tooltip />
      <el-table-column prop="deadline" label="整改期限" width="100" />
      <el-table-column prop="measures" label="整改措施" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="verifyInfo" label="验证情况" min-width="150" show-overflow-tooltip />
      <el-table-column prop="verifier" label="验证人" width="100" />
      <el-table-column prop="closeDate" label="关闭日期" width="100" />
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="warning" link @click="handleUpgradeToHazard(row)">
            升级为隐患
          </el-button>
        </template>
      </el-table-column>
    </template>

    <!-- 升级为隐患对话框 -->
    <el-dialog v-model="hazardDialogVisible" title="升级为隐患" width="600px">
      <el-form :model="hazardForm" label-width="100px">
        <el-form-item label="隐患类型" required>
          <el-select v-model="hazardForm.dangerType">
            <el-option label="一般" value="normal" />
            <el-option label="重大" value="major" />
          </el-select>
        </el-form-item>
        <!-- 其他字段... -->
      </el-form>
      <template #footer>
        <el-button @click="hazardDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHazard">确认</el-button>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog 
      v-model="editDialogVisible" 
      :title="form.code ? '编辑发现项' : '新增发现项'" 
      width="650px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="问题描述" prop="description">
          <el-input v-model="form.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="问题等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择">
            <el-option label="一般" value="normal" />
            <el-option label="重要" value="major" />
            <el-option label="严重" value="severe" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择">
            <el-option label="飞行部" value="飞行部" />
            <el-option label="维修部" value="维修部" />
            <el-option label="运控部" value="运控部" />
            <el-option label="安全部" value="安全部" />
          </el-select>
        </el-form-item>
        <el-form-item label="整改要求" prop="requirement">
          <el-input v-model="form.requirement" type="textarea" rows="2" />
        </el-form-item>
        <el-form-item label="整改期限" prop="deadline">
          <el-date-picker v-model="form.deadline" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="整改措施" prop="measures">
          <el-input v-model="form.measures" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="待整改" value="pending" />
            <el-option label="整改中" value="processing" />
            <el-option label="待验证" value="verifying" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="验证情况" prop="verifyInfo">
          <el-input v-model="form.verifyInfo" />
        </el-form-item>
        <el-form-item label="验证人" prop="verifier">
          <el-input v-model="form.verifier" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
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
  source: '',
  level: '',
  status: ''
})

// 获取来源标签
const getSourceLabel = (source: string) => {
  const map: Record<string, string> = {
    'supervision': '监督检查',
    'self-inspection': '法定自查',
    'internal-audit': '内部审核',
    'external-audit': '外部审核'
  }
  return map[source] || source
}

// 获取等级标签
const getLevelLabel = (level: string) => {
  const map: Record<string, string> = {
    'normal': '一般',
    'major': '重要',
    'severe': '严重'
  }
  return map[level] || level
}

// 获取等级标签类型
const getLevelType = (level: string) => {
  const map: Record<string, 'info' | 'warning' | 'danger'> = {
    'normal': 'info',
    'major': 'warning',
    'severe': 'danger'
  }
  return map[level] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'pending': '待整改',
    'processing': '整改中',
    'verifying': '待验证',
    'closed': '已关闭'
  }
  return map[status] || status
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const map: Record<string, 'info' | 'warning' | 'success'> = {
    'pending': 'info',
    'processing': 'warning',
    'verifying': 'warning',
    'closed': 'success'
  }
  return map[status] || 'info'
}

// 静态数据
const originalData = [
  {
    code: 'FD-2024001',
    source: 'supervision',
    sourceType: 'checklist',
    sourceNo: 'RLSJ-2024002',
    parentHazardNo: '',
    toHazardNo: '',
    findingDate: '2024-02-26',
    department: '飞行部',
    description: '部分机组成员疲劳风险报告填写不规范',
    level: 'major',
    requirement: '完善报告填写流程，加强培训',
    deadline: '2024-03-10',
    measures: '1.修订报告填写指南；2.开展专项培训；3.加强日常监督',
    status: 'processing',
    verifyInfo: '',
    verifier: '',
    closeDate: '',
    remark: '整改进行中'
  },
  {
    code: 'FD-2024002',
    source: 'self-inspection',
    sourceType: 'checklist',
    sourceNo: 'RLZJ-2024005',
    parentHazardNo: '',
    toHazardNo: '',
    findingDate: '2024-02-25',
    department: '维修部',
    description: '工具借用登记不完整',
    level: 'normal',
    requirement: '规范工具借用管理',
    deadline: '2024-03-05',
    measures: '完善工具管理系统，加强交接班检查',
    status: 'verifying',
    verifyInfo: '待现场核实',
    verifier: '张工',
    closeDate: '',
    remark: ''
  },
  {
    code: 'FD-2024003',
    source: 'internal-audit',
    sourceType: 'checklist',
    sourceNo: 'RLSN-2024008',
    parentHazardNo: '',
    toHazardNo: '',
    findingDate: '2024-02-20',
    department: '运控部',
    description: '部分航班放行文件未按规定时限存档',
    level: 'major',
    requirement: '及时完成文件存档',
    deadline: '2024-03-01',
    measures: '优化存档流程，明确责任人',
    status: 'closed',
    verifyInfo: '已完成整改验证',
    verifier: '李监察',
    closeDate: '2024-02-28',
    remark: '按期完成整改'
  },
  {
    code: 'FD-2024004',
    source: 'supervision',
    sourceType: 'checklist',
    sourceNo: 'RLSJ-2024009',
    parentHazardNo: '',
    toHazardNo: '',
    findingDate: '2024-02-28',
    department: '维修部',
    description: '发动机振动值超限未及时处置',
    level: 'severe',
    requirement: '立即排查原因，采取措施',
    deadline: '2024-03-01',
    measures: '1.执行发动机振动排查程序；2.必要时更换部件；3.完善监控机制',
    status: 'processing',
    verifyInfo: '',
    verifier: '',
    closeDate: '',
    remark: '优先处理'
  },
  {
    code: 'FD-2024005',
    source: 'internal-audit',
    sourceType: 'checklist',
    sourceNo: 'RLSN-2024010',
    parentHazardNo: '',
    toHazardNo: '',
    findingDate: '2024-02-27',
    department: '飞行部',
    description: '发现多起高原机场着陆偏差超标',
    level: 'severe',
    requirement: '分析原因，加强培训',
    deadline: '2024-03-05',
    measures: '1.分析气象和人为因素；2.修订高原机场运行程序；3.开展专项训练',
    status: 'processing',
    verifyInfo: '',
    verifier: '',
    closeDate: '',
    remark: '需要局方参与'
  }
]

// 表格数据
const tableData = ref(originalData)

// 搜索处理函数
const handleSearch = () => {
  const { keyword, code, source, level, status } = searchForm
  
  const filteredData = originalData.filter(item => {
    const matchKeyword = !keyword || 
      item.description.toLowerCase().includes(keyword.toLowerCase()) ||
      item.code.toLowerCase().includes(keyword.toLowerCase())
    
    const matchCode = !code || item.code.toLowerCase().includes(code.toLowerCase())
    const matchSource = !source || item.source === source
    const matchLevel = !level || item.level === level
    const matchStatus = !status || item.status === status
    
    return matchKeyword && matchCode && matchSource && matchLevel && matchStatus
  })
  
  tableData.value = filteredData
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.code = ''
  searchForm.source = ''
  searchForm.level = ''
  searchForm.status = ''
  tableData.value = originalData
}

// 升级为隐患相关逻辑
const hazardDialogVisible = ref(false)
const hazardForm = reactive({
  dangerType: '',
  fromFindingNo: ''
})

const handleUpgradeToHazard = (row) => {
  hazardForm.fromFindingNo = row.code
  hazardDialogVisible.value = true
}

const submitHazard = async () => {
  // 创建隐患
  const hazard = await createHazard({
    ...hazardForm,
    fromFindingNo: hazardForm.fromFindingNo
  })
  
  // 更新发现项状态
  await updateFinding({
    code: hazardForm.fromFindingNo,
    toHazardNo: hazard.code,
    status: 'upgraded'
  })
}

// 编辑相关
const editDialogVisible = ref(false)
const form = reactive({
  code: '',
  description: '',
  level: '',
  department: '',
  requirement: '',
  deadline: '',
  measures: '',
  status: '',
  verifyInfo: '',
  verifier: '',
  remark: ''
})

// 表单验证规则
const rules = {
  description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
  level: [{ required: true, message: '请选择问题等级', trigger: 'change' }],
  department: [{ required: true, message: '请选择责任部门', trigger: 'change' }],
  requirement: [{ required: true, message: '请输入整改要求', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择整改期限', trigger: 'change' }],
  measures: [{ required: true, message: '请输入整改措施', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 处理编辑
const handleEdit = (row: any) => {
  Object.assign(form, row)  // 复制数据到表单
  editDialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (form.code) {
        // 编辑现有记录
        await updateFinding({
          ...form
        })
      } else {
        // 创建新记录
        await createFinding({
          ...form,
          code: generateFindingCode(),  // 生成新编号
          findingDate: new Date().toISOString().split('T')[0]
        })
      }
      
      editDialogVisible.value = false
      // 刷新表格数据
      await refreshTableData()
    }
  })
}

// 刷新表格数据
const refreshTableData = async () => {
  // 这里可以调用API重新获取数据
  // 暂时使用静态数据演示
  tableData.value = [...originalData]
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