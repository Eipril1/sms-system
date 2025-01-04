<template>
  <div class="assessment-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>安全风险评价和控制</h2>
        <div class="toolbar">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增评估
          </el-button>
          <el-button type="primary" @click="showAnalysis">
            <el-icon><TrendCharts /></el-icon>风险分析
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="危险源">
          <el-select v-model="searchForm.hazardId" placeholder="请选择危险源" clearable>
            <el-option
              v-for="item in hazardOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评估状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待评估" value="pending" />
            <el-option label="评估中" value="processing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="code" label="评估编号" width="120" />
        <el-table-column prop="hazardName" label="危险源名称" />
        <el-table-column prop="assessmentDate" label="评估日期" width="120" />
        <el-table-column prop="assessor" label="评估人" width="100" />
        <el-table-column prop="riskLevel" label="风险等级" width="100">
        <template #default="{ row }">
            <el-tag :type="getRiskLevelType(row.riskLevel)">
              {{ row.riskLevel }}
            </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
        </template>
      </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增评估' : '编辑评估'"
      width="60%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="危险源" prop="hazardId">
              <el-select v-model="form.hazardId" placeholder="请选择危险源" style="width: 100%">
                <el-option
                  v-for="item in hazardOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评估日期" prop="assessmentDate">
              <el-date-picker
                v-model="form.assessmentDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="评估人" prop="assessor">
              <el-input v-model="form.assessor" placeholder="请输入评估人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可能性" prop="likelihood">
              <el-select v-model="form.likelihood" placeholder="请选择可能性" style="width: 100%">
                <el-option label="经常" value="frequent" />
                <el-option label="可能" value="probable" />
                <el-option label="偶然" value="occasional" />
                <el-option label="极少" value="remote" />
                <el-option label="几乎不可能" value="improbable" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="严重性" prop="severity">
              <el-select v-model="form.severity" placeholder="请选择严重性" style="width: 100%">
                <el-option label="灾难性" value="catastrophic" />
                <el-option label="严重" value="critical" />
                <el-option label="中等" value="moderate" />
                <el-option label="轻微" value="negligible" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险等级" prop="riskLevel">
              <el-select v-model="form.riskLevel" placeholder="请选择风险等级" style="width: 100%">
                <el-option label="重大风险" value="high" />
                <el-option label="较大风险" value="medium" />
                <el-option label="一般风险" value="low" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="评估依据" prop="basis">
          <el-input
            v-model="form.basis"
            type="textarea"
            rows="3"
            placeholder="请输入评估依据"
          />
        </el-form-item>

        <el-form-item label="评估结论" prop="conclusion">
          <el-input
            v-model="form.conclusion"
            type="textarea"
            rows="3"
            placeholder="请输入评估结论"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      :title="currentItem?.hazardName"
      width="70%"
    >
      <div class="detail-content">
        <div class="section">
          <h4>基本信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">评估编号：</span>
              <span>{{ currentItem?.code }}</span>
            </div>
            <div class="info-item">
              <span class="label">评估日期：</span>
              <span>{{ currentItem?.assessmentDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">评估人：</span>
              <span>{{ currentItem?.assessor }}</span>
            </div>
            <div class="info-item">
              <span class="label">风险等级：</span>
              <el-tag :type="getRiskLevelType(currentItem?.riskLevel)">
                {{ currentItem?.riskLevel }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="section">
          <h4>风险评估</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">可能性：</span>
              <el-tag>{{ currentItem?.likelihood }}</el-tag>
            </div>
            <div class="info-item">
              <span class="label">严重性：</span>
              <el-tag>{{ currentItem?.severity }}</el-tag>
            </div>
          </div>
          <div class="content-box">
            <div class="content-item">
              <div class="label">评估依据：</div>
              <div class="text">{{ currentItem?.basis }}</div>
            </div>
            <div class="content-item">
              <div class="label">评估结论：</div>
              <div class="text">{{ currentItem?.conclusion }}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h4>管控措施</h4>
            <el-button type="primary" link @click="handleControl(currentItem)">
              管理措施
            </el-button>
          </div>
          <el-table :data="controlMeasures" border style="width: 100%">
            <el-table-column prop="type" label="措施类型" width="120">
              <template #default="{ row }">
                {{ getControlTypeText(row.type) }}
              </template>
            </el-table-column>
            <el-table-column prop="content" label="措施内容" />
            <el-table-column prop="responsible" label="责任人" width="120" />
            <el-table-column prop="deadline" label="完成期限" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!-- 管控措施对话框 -->
    <el-dialog
      v-model="controlDialogVisible"
      :title="`${currentItem?.hazardName} - 管控措施管理`"
      width="70%"
    >
      <div class="control-header">
        <el-button type="primary" @click="handleAddControl">新增措施</el-button>
      </div>

      <el-table :data="controlMeasures" border style="width: 100%">
        <el-table-column prop="type" label="措施类型" width="120">
          <template #default="{ row }">
            {{ getControlTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="措施内容" />
        <el-table-column prop="responsible" label="责任人" width="120" />
        <el-table-column prop="deadline" label="完成期限" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEditControl(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDeleteControl(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 管控措施表单对话框 -->
    <el-dialog
      v-model="controlFormVisible"
      :title="controlFormType === 'add' ? '新增管控措施' : '编辑管控措施'"
      width="50%"
      append-to-body
    >
      <el-form
        ref="controlFormRef"
        :model="controlForm"
        :rules="controlRules"
        label-width="100px"
      >
        <el-form-item label="措施类型" prop="type">
          <el-select v-model="controlForm.type" placeholder="请选择措施类型" style="width: 100%">
            <el-option label="工程措施" value="engineering" />
            <el-option label="管理措施" value="management" />
            <el-option label="培训措施" value="training" />
            <el-option label="应急措施" value="emergency" />
          </el-select>
        </el-form-item>

        <el-form-item label="措施内容" prop="content">
          <el-input
            v-model="controlForm.content"
            type="textarea"
            rows="3"
            placeholder="请输入措施内容"
          />
        </el-form-item>

        <el-form-item label="责任人" prop="responsible">
          <el-input v-model="controlForm.responsible" placeholder="请输入责任人" />
        </el-form-item>

        <el-form-item label="完成期限" prop="deadline">
          <el-date-picker
            v-model="controlForm.deadline"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="controlForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="controlFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleControlSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 风险分析对话框 -->
    <el-dialog
      v-model="analysisVisible"
      title="风险分析"
      width="80%"
    >
      <div class="chart-container">
        <!-- 时间范围选择 -->
        <div class="chart-header">
          <h4>风险等级分布</h4>
          <el-radio-group v-model="chartTimeRange" @change="handleTimeRangeChange">
            <el-radio-button label="month">本月</el-radio-button>
            <el-radio-button label="quarter">本季度</el-radio-button>
            <el-radio-button label="year">本年度</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 统计数据卡片 -->
        <el-row :gutter="20" class="stat-cards">
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <span>总风险数</span>
                  <el-icon><DataLine /></el-icon>
                </div>
              </template>
              <div class="stat-number">{{ statistics.total }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="danger-card">
              <template #header>
                <div class="stat-header">
                  <span>重大风险</span>
                  <el-icon><Warning /></el-icon>
                </div>
              </template>
              <div class="stat-number">{{ statistics.highRisk }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="warning-card">
              <template #header>
                <div class="stat-header">
                  <span>较大风险</span>
                  <el-icon><WarningFilled /></el-icon>
                </div>
              </template>
              <div class="stat-number">{{ statistics.mediumRisk }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="info-card">
              <template #header>
                <div class="stat-header">
                  <span>一般风险</span>
                  <el-icon><InfoFilled /></el-icon>
                </div>
              </template>
              <div class="stat-number">{{ statistics.lowRisk }}</div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 风险矩阵图表 -->
        <div class="matrix-chart">
          <v-chart class="chart" :option="matrixOption" />
        </div>

        <!-- 风险趋势图表 -->
        <div class="chart-header">
          <h4>风险趋势分析</h4>
        </div>
        <div class="trend-chart">
          <v-chart class="chart" :option="trendOption" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, TrendCharts, DataLine, Warning, WarningFilled, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchFormRef = ref()
const searchForm = ref({
  hazardId: '',
  status: ''
})

// 表格数据
const tableData = ref([
  {
    id: '1',
    code: 'RA2024001',
    hazardName: '高空作业安全隐患',
    assessmentDate: '2024-01-15',
    assessor: '张三',
    riskLevel: '重大风险',
    status: '待评估'
  },
  {
    id: '2',
    code: 'RA2024002',
    hazardName: '危险化学品泄漏',
    assessmentDate: '2024-01-16',
    assessor: '李四',
    riskLevel: '较大风险',
    status: '评估中'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

// 危险源选项
const hazardOptions = ref([
  { code: 'HZ2024001', name: '高空作业安全隐患' },
  { code: 'HZ2024002', name: '危险化学品泄漏' }
])

// 表单相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = ref({
  hazardId: '',
  assessmentDate: '',
  assessor: '',
  likelihood: '',
  severity: '',
  riskLevel: '',
  basis: '',
  conclusion: ''
})

const rules = {
  hazardId: [{ required: true, message: '请选择危险源', trigger: 'change' }],
  assessmentDate: [{ required: true, message: '请选择评估日期', trigger: 'change' }],
  assessor: [
    { required: true, message: '请输入评估人', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  likelihood: [{ required: true, message: '请选择可能性', trigger: 'change' }],
  severity: [{ required: true, message: '请选择严重性', trigger: 'change' }],
  riskLevel: [{ required: true, message: '请选择风险等级', trigger: 'change' }],
  basis: [
    { required: true, message: '请输入评估依据', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  conclusion: [
    { required: true, message: '请输入评估结论', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ]
}

// 方法定义
const handleSearch = () => {
  console.log('搜索条件：', searchForm.value)
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    hazardId: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: '',
    likelihood: '',
    severity: '',
    riskLevel: '',
    basis: '',
    conclusion: ''
  }
  dialogVisible.value = true
}

// 详情相关
const detailVisible = ref(false)
const currentItem = ref<any>(null)

// 管控措施相关
const controlDialogVisible = ref(false)
const controlFormVisible = ref(false)
const controlFormType = ref<'add' | 'edit'>('add')
const controlFormRef = ref()
const controlForm = ref({
  type: '',
  content: '',
  responsible: '',
  deadline: '',
  status: '进行中'
})

const controlRules = {
  type: [{ required: true, message: '请选择措施类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入措施内容', trigger: 'blur' }],
  responsible: [{ required: true, message: '请输入责任人', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择完成期限', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 管控措施数据
const controlMeasures = ref([
  {
    type: 'engineering',
    content: '安装防坠落护栏和安全网',
    responsible: '张三',
    deadline: '2024-03-01',
    status: '进行中'
  },
  {
    type: 'management',
    content: '修订高空作业安全操作规程',
    responsible: '李四',
    deadline: '2024-02-15',
    status: '已完成'
  }
])

// 修改查看详情方法
const handleView = (row: any) => {
  currentItem.value = row
  detailVisible.value = true
}

// 管控措施相关方法
const handleControl = (row: any) => {
  currentItem.value = row
  controlDialogVisible.value = true
}

const handleAddControl = () => {
  controlFormType.value = 'add'
  controlForm.value = {
    type: '',
    content: '',
    responsible: '',
    deadline: '',
    status: '进行中'
  }
  controlFormVisible.value = true
}

const handleEditControl = (row: any) => {
  controlFormType.value = 'edit'
  controlForm.value = { ...row }
  controlFormVisible.value = true
}

const handleDeleteControl = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该管控措施吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = controlMeasures.value.findIndex(item => item === row)
    if (index > -1) {
      controlMeasures.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  })
}

const handleControlSubmit = async () => {
  if (!controlFormRef.value) return
  await controlFormRef.value.validate((valid: boolean) => {
    if (valid) {
      if (controlFormType.value === 'add') {
        controlMeasures.value.push({ ...controlForm.value })
        } else {
        const index = controlMeasures.value.findIndex(item => item.content === controlForm.value.content)
        if (index > -1) {
          controlMeasures.value[index] = { ...controlForm.value }
        }
      }
      controlFormVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

const getControlTypeText = (type: string) => {
  const map: Record<string, string> = {
    engineering: '工程措施',
    management: '管理措施',
    training: '培训措施',
    emergency: '应急措施'
  }
  return map[type] || type
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

// 添加表单提交方法
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      const newData = {
        id: `${tableData.value.length + 1}`,
        code: `RA${new Date().getFullYear()}${String(tableData.value.length + 1).padStart(3, '0')}`,
        hazardName: hazardOptions.value.find(item => item.code === form.value.hazardId)?.name,
        assessmentDate: form.value.assessmentDate,
        assessor: form.value.assessor,
        riskLevel: form.value.riskLevel,
        status: '评估中',
        ...form.value
      }
      
      if (dialogType.value === 'add') {
        tableData.value.unshift(newData)
        total.value++
      } else {
        const index = tableData.value.findIndex(item => item.id === form.value.id)
        if (index > -1) {
          tableData.value[index] = { ...tableData.value[index], ...newData }
        }
      }
      
      dialogVisible.value = false
      ElMessage.success('保存成功')
      handleSearch()
    }
  })
}

// 工具方法
const getRiskLevelType = (level: string) => {
  const map: Record<string, string> = {
    '重大风险': 'danger',
    '较大风险': 'warning',
    '一般风险': 'info'
  }
  return map[level] || 'info'
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待评估': 'info',
    '评估中': 'warning',
    '已完成': 'success'
  }
  return map[status] || 'info'
}

// 风险分析相关
const analysisVisible = ref(false)
const chartTimeRange = ref('month')
const statistics = ref({
  total: 0,
  highRisk: 0,
  mediumRisk: 0,
  lowRisk: 0
})

const handleTimeRangeChange = () => {
  // 处理时间范围选择的逻辑
}

const matrixOption = ref({
  // 风险矩阵图表的配置选项
})

const trendOption = ref({
  // 风险趋势图表的配置选项
})

const showAnalysis = () => {
  analysisVisible.value = true
}
</script>

<style scoped>
.assessment-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h2 {
  margin: 0;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style> 