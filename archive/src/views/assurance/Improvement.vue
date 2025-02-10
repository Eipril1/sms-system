<template>
  <div class="improvement-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>持续改进</h2>
        <div class="toolbar">
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus/>
            </el-icon>
            新增建议
          </el-button>
          <el-button type="primary" @click="showAnalysis">
            <el-icon>
              <TrendCharts/>
            </el-icon>
            改进分析
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="建议类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="制度建议" value="system"/>
            <el-option label="流程建议" value="process"/>
            <el-option label="技术建议" value="technical"/>
            <el-option label="管理建议" value="management"/>
          </el-select>
        </el-form-item>
        <el-form-item label="提出人">
          <el-input v-model="searchForm.proposer" placeholder="请输入提出人" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待评估" value="pending"/>
            <el-option label="已采纳" value="accepted"/>
            <el-option label="实施中" value="implementing"/>
            <el-option label="已完成" value="completed"/>
            <el-option label="已驳回" value="rejected"/>
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
      <el-table
          :data="tableData"
          border
          style="width: 100%"
      >
        <el-table-column prop="code" label="建议编号" width="120"/>
        <el-table-column prop="type" label="建议类型" width="120">
          <template #default="{ row }">
            {{ getTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="建议标题"/>
        <el-table-column prop="proposer" label="提出人" width="100"/>
        <el-table-column prop="department" label="所属部门" width="120"/>
        <el-table-column prop="proposeDate" label="提出日期" width="120"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button
                type="primary"
                link
                @click="handleEdit(row)"
                v-if="row.status === 'pending'"
            >编辑
            </el-button>
            <el-button
                type="success"
                link
                @click="handleImplement(row)"
                v-if="row.status === 'accepted'"
            >实施
            </el-button>
            <el-button
                type="warning"
                link
                @click="handleEvaluate(row)"
                v-if="row.status === 'completed'"
            >评估
            </el-button>
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
        :title="dialogType === 'add' ? '新增建议' : '编辑建议'"
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
            <el-form-item label="建议类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="制度建议" value="system"/>
                <el-option label="流程建议" value="process"/>
                <el-option label="技术建议" value="technical"/>
                <el-option label="管理建议" value="management"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建议标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入建议标题"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="问题描述" prop="problem">
          <el-input
              v-model="form.problem"
              type="textarea"
              rows="3"
              placeholder="请描述当前存在的问题"
          />
        </el-form-item>

        <el-form-item label="改进建议" prop="suggestion">
          <el-input
              v-model="form.suggestion"
              type="textarea"
              rows="4"
              placeholder="请输入具体的改进建议"
          />
        </el-form-item>

        <el-form-item label="预期效果" prop="expectation">
          <el-input
              v-model="form.expectation"
              type="textarea"
              rows="3"
              placeholder="请描述预期达到的效果"
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

    <!-- 实施对话框 -->
    <el-dialog
        v-model="implementDialogVisible"
        title="改进实施"
        width="60%"
    >
      <el-form
          ref="implementFormRef"
          :model="implementForm"
          :rules="implementRules"
          label-width="100px"
      >
        <div class="section">
          <h4>实施计划</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="计划开始" prop="startDate">
                <el-date-picker
                    v-model="implementForm.startDate"
                    type="date"
                    placeholder="选择开始日期"
                    style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划完成" prop="endDate">
                <el-date-picker
                    v-model="implementForm.endDate"
                    type="date"
                    placeholder="选择完成日期"
                    style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="责任人" prop="responsible">
            <el-input v-model="implementForm.responsible" placeholder="请输入责任人"/>
          </el-form-item>

          <el-form-item label="实施步骤" prop="steps">
            <el-input
                v-model="implementForm.steps"
                type="textarea"
                rows="4"
                placeholder="请输入具体实施步骤"
            />
          </el-form-item>
        </div>

        <div class="section">
          <h4>资源配置</h4>
          <el-form-item label="所需资源" prop="resources">
            <el-input
                v-model="implementForm.resources"
                type="textarea"
                rows="3"
                placeholder="请描述所需的人力、物力、财力等资源"
            />
          </el-form-item>

          <el-form-item label="预算金额" prop="budget">
            <el-input-number
                v-model="implementForm.budget"
                :min="0"
                :precision="2"
                :step="1000"
                style="width: 200px"
            />
          </el-form-item>
        </div>

        <div class="section">
          <h4>进度跟踪</h4>
          <el-form-item label="当前进度" prop="progress">
            <el-slider
                v-model="implementForm.progress"
                :format-tooltip="(val) => val + '%'"
                :marks="{
                0: '0%',
                20: '20%',
                40: '40%',
                60: '60%',
                80: '80%',
                100: '100%'
              }"
            />
          </el-form-item>

          <el-form-item label="进度说明" prop="progressNote">
            <el-input
                v-model="implementForm.progressNote"
                type="textarea"
                rows="3"
                placeholder="请说明当前进度情况"
            />
          </el-form-item>

          <el-form-item label="存在问题" prop="issues">
            <el-input
                v-model="implementForm.issues"
                type="textarea"
                rows="3"
                placeholder="请说明实施过程中存在的问题"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="implementDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleImplementSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 评估对话框 -->
    <el-dialog
        v-model="evaluateDialogVisible"
        title="效果评估"
        width="60%"
    >
      <el-form
          ref="evaluateFormRef"
          :model="evaluateForm"
          :rules="evaluateRules"
          label-width="100px"
      >
        <div class="section">
          <h4>效果评估</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="评估日期" prop="evaluateDate">
                <el-date-picker
                    v-model="evaluateForm.evaluateDate"
                    type="date"
                    placeholder="选择评估日期"
                    style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="评估人" prop="evaluator">
                <el-input v-model="evaluateForm.evaluator" placeholder="请输入评估人"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="改进效果" prop="effect">
            <el-rate
                v-model="evaluateForm.effect"
                :texts="['很差', '较差', '一般', '良好', '优秀']"
                show-text
            />
          </el-form-item>

          <el-form-item label="效果说明" prop="effectNote">
            <el-input
                v-model="evaluateForm.effectNote"
                type="textarea"
                rows="3"
                placeholder="请说明改进效果"
            />
          </el-form-item>
        </div>

        <div class="section">
          <h4>问题反馈</h4>
          <el-form-item label="存在问题" prop="problems">
            <el-input
                v-model="evaluateForm.problems"
                type="textarea"
                rows="3"
                placeholder="请说明仍然存在的问题"
            />
          </el-form-item>

          <el-form-item label="改进建议" prop="suggestions">
            <el-input
                v-model="evaluateForm.suggestions"
                type="textarea"
                rows="3"
                placeholder="请提出进一步的改进建议"
            />
          </el-form-item>
        </div>

        <div class="section">
          <h4>总体评价</h4>
          <el-form-item label="评价结论" prop="conclusion">
            <el-radio-group v-model="evaluateForm.conclusion">
              <el-radio label="excellent">效果显著</el-radio>
              <el-radio label="good">基本达标</el-radio>
              <el-radio label="fair">部分改善</el-radio>
              <el-radio label="poor">效果不佳</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="补充说明" prop="remark">
            <el-input
                v-model="evaluateForm.remark"
                type="textarea"
                rows="3"
                placeholder="请输入补充说明"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="evaluateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEvaluateSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分析对话框 -->
    <el-dialog
        v-model="analysisVisible"
        title="改进分析"
        width="95%"
        :fullscreen="true"
        class="analysis-dialog"
    >
      <div class="analysis-container">
        <!-- 顶部时间选择 -->
        <div class="analysis-header">
          <h3>持续改进分析</h3>
          <el-radio-group v-model="chartTimeRange" @change="handleTimeRangeChange">
            <el-radio-button label="month">本月</el-radio-button>
            <el-radio-button label="quarter">本季度</el-radio-button>
            <el-radio-button label="year">本年度</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 统计卡片 -->
        <div class="stat-overview">
          <div class="stat-card total">
            <div class="stat-icon">
              <el-icon>
                <DataLine/>
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">建议总数</div>
              <div class="stat-value">{{ statistics.total }}</div>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">
              <el-icon>
                <CircleCheck/>
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已完成</div>
              <div class="stat-value">{{ statistics.completed }}</div>
              <div class="stat-rate">完成率 {{ (statistics.completed / statistics.total * 100).toFixed(1) }}%</div>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">
              <el-icon>
                <Warning/>
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">进行中</div>
              <div class="stat-value">{{ statistics.inProgress }}</div>
              <div class="stat-rate">占比 {{ (statistics.inProgress / statistics.total * 100).toFixed(1) }}%</div>
            </div>
          </div>
          <div class="stat-card danger">
            <div class="stat-icon">
              <el-icon>
                <CircleClose/>
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待处理</div>
              <div class="stat-value">{{ statistics.pending }}</div>
              <div class="stat-rate">占比 {{ (statistics.pending / statistics.total * 100).toFixed(1) }}%</div>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-container">
          <!-- 趋势图 -->
          <div class="chart-section">
            <div class="section-header">
              <h4>改进趋势分析</h4>
            </div>
            <div class="chart-content">
              <v-chart :option="trendOption" autoresize/>
            </div>
          </div>

          <!-- 分布图 -->
          <div class="chart-section">
            <div class="section-header">
              <h4>建议类型分布</h4>
            </div>
            <div class="chart-content">
              <v-chart :option="distributionOption" autoresize/>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {Plus, TrendCharts, DataLine, CircleCheck, Loading, Timer} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import VChart from 'vue-echarts'

// 搜索表单
const searchFormRef = ref()
const searchForm = ref({
  type: '',
  proposer: '',
  status: ''
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    code: 'SG202403001',
    type: 'process',
    title: '优化安全检查流程',
    proposer: '张三',
    department: '安全部',
    proposeDate: '2024-03-10',
    status: 'implementing',
    problem: '当前安全检查流程繁琐，效率低下',
    suggestion: '建议简化检查表单，采用移动端APP进行检查记录，实现数据实时上传和分析',
    expectation: '提高检查效率30%，减少纸质记录和人工统计工作'
  },
  {
    id: 2,
    code: 'SG202403002',
    type: 'technical',
    title: '增加设备预警功能',
    proposer: '李四',
    department: '设备部',
    proposeDate: '2024-03-12',
    status: 'completed',
    problem: '设备故障往往发生突然，缺乏预警机制',
    suggestion: '在关键设备上安装智能传感器，建立设备健康监测系统',
    expectation: '通过预警系统提前发现潜在问题，减少突发故障率'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

// 新增/编辑对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = ref({
  type: '',
  title: '',
  problem: '',
  suggestion: '',
  expectation: ''
})

const rules = {
  type: [{required: true, message: '请选择建议类型', trigger: 'change'}],
  title: [
    {required: true, message: '请输入建议标题', trigger: 'blur'},
    {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
  ],
  problem: [
    {required: true, message: '请输入问题描述', trigger: 'blur'},
    {min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur'}
  ],
  suggestion: [
    {required: true, message: '请输入改进建议', trigger: 'blur'},
    {min: 10, max: 1000, message: '长度在 10 到 1000 个字符', trigger: 'blur'}
  ],
  expectation: [
    {required: true, message: '请输入预期效果', trigger: 'blur'},
    {min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur'}
  ]
}

// 实施对话框
const implementDialogVisible = ref(false)
const implementFormRef = ref()
const implementForm = ref({
  startDate: '',
  endDate: '',
  responsible: '',
  steps: '',
  resources: '',
  budget: 0,
  progress: 0,
  progressNote: '',
  issues: ''
})

const implementRules = {
  startDate: [{required: true, message: '请选择开始日期', trigger: 'change'}],
  endDate: [{required: true, message: '请选择完成日期', trigger: 'change'}],
  responsible: [{required: true, message: '请输入责任人', trigger: 'blur'}],
  steps: [
    {required: true, message: '请输入实施步骤', trigger: 'blur'},
    {min: 10, max: 1000, message: '长度在 10 到 1000 个字符', trigger: 'blur'}
  ],
  resources: [{required: true, message: '请描述所需资源', trigger: 'blur'}],
  budget: [{required: true, message: '请输入预算金额', trigger: 'blur'}],
  progressNote: [{required: true, message: '请说明进度情况', trigger: 'blur'}]
}

// 评估对话框
const evaluateDialogVisible = ref(false)
const evaluateFormRef = ref()
const evaluateForm = ref({
  evaluateDate: '',
  evaluator: '',
  effect: 0,
  effectNote: '',
  problems: '',
  suggestions: '',
  conclusion: '',
  remark: ''
})

const evaluateRules = {
  evaluateDate: [{required: true, message: '请选择评估日期', trigger: 'change'}],
  evaluator: [{required: true, message: '请输入评估人', trigger: 'blur'}],
  effect: [{required: true, message: '请选择改进效果', trigger: 'change'}],
  effectNote: [{required: true, message: '请输入效果说明', trigger: 'blur'}],
  problems: [{required: true, message: '请输入存在问题', trigger: 'blur'}],
  suggestions: [{required: true, message: '请输入改进建议', trigger: 'blur'}],
  conclusion: [{required: true, message: '请选择评价结论', trigger: 'change'}],
  remark: [{required: true, message: '请输入补充说明', trigger: 'blur'}]
}

// 分析对话框
const analysisVisible = ref(false)
const chartTimeRange = ref('month')
const statistics = ref({
  total: 33,
  completed: 25,
  implementing: 5,
  pending: 3
})

// 图表配置
const trendOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['建议数量', '完成数量']
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '建议数量',
      type: 'line',
      data: [10, 15, 12, 18, 20, 16]
    },
    {
      name: '完成数量',
      type: 'line',
      data: [8, 12, 10, 15, 16, 14]
    }
  ]
})

const distributionOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [
        {value: 35, name: '制度建议'},
        {value: 25, name: '流程建议'},
        {value: 20, name: '技术建议'},
        {value: 20, name: '管理建议'}
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

const effectOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [
        {value: 40, name: '效果显著'},
        {value: 30, name: '基本达标'},
        {value: 20, name: '部分改善'},
        {value: 10, name: '效果不佳'}
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

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
    type: '',
    title: '',
    problem: '',
    suggestion: '',
    expectation: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = {...row}
  dialogVisible.value = true
}

const handleView = (row: any) => {
  // TODO: 实现查看详情功能
  console.log('查看详情：', row)
}

const handleImplement = (row: any) => {
  implementDialogVisible.value = true
  console.log('实施：', row)
}

const handleEvaluate = (row: any) => {
  evaluateDialogVisible.value = true
  console.log('评估：', row)
}

const showAnalysis = () => {
  analysisVisible.value = true
  loadStatistics()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('表单数据：', form.value)
      dialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

const handleImplementSubmit = async () => {
  if (!implementFormRef.value) return
  await implementFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('实施表单数据：', implementForm.value)
      implementDialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

const handleEvaluateSubmit = async () => {
  if (!evaluateFormRef.value) return
  await evaluateFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('评估表单数据：', evaluateForm.value)
      evaluateDialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

const handleTimeRangeChange = () => {
  loadStatistics()
}

const loadStatistics = () => {
  // TODO: 调用接口获取统计数据
  statistics.value = {
    total: 33,
    completed: 25,
    implementing: 5,
    pending: 3
  }
}

// 工具方法
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    system: '制度建议',
    process: '流程建议',
    technical: '技术建议',
    management: '管理建议'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    accepted: 'success',
    implementing: 'warning',
    completed: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待评估',
    accepted: '已采纳',
    implementing: '实施中',
    completed: '已完成',
    rejected: '已驳回'
  }
  return map[status] || status
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.improvement-container {
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

.toolbar {
  display: flex;
  gap: 10px;
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

/* 表单样式 */
.el-form-item.is-required .el-form-item__label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

/* 表格操作按钮样式 */
.el-button--text {
  padding: 0 4px;
}

.el-button--text + .el-button--text {
  margin-left: 8px;
}

/* 卡片内容边距 */
.el-card__body {
  padding: 20px;
}

/* 表单项间距 */
.el-form-item {
  margin-bottom: 18px;
}

/* 对话框内容最大高度 */
.el-dialog__body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* 详情内容布局 */
.detail-content {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 16px 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .label {
  color: #666;
  min-width: 80px;
}

.content-box {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
}

.content-box .text {
  line-height: 1.6;
  white-space: pre-line;
}

.section {
  margin-bottom: 24px;
}

.section h4 {
  margin: 0 0 16px;
  color: #333;
}

/* 实施进度样式 */
.progress-box {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-title {
  font-weight: bold;
  color: #333;
}

.progress-status {
  font-size: 14px;
  color: #666;
}

/* 评估结果样式 */
.evaluation-result {
  margin-top: 16px;
  padding: 16px;
  background: #f0f9eb;
  border-radius: 4px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-title {
  font-weight: bold;
  color: #67c23a;
}

.result-score {
  font-size: 24px;
  font-weight: bold;
  color: #67c23a;
}

/* 分析图表样式 */
.chart-container {
  padding: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4 {
  margin: 0;
  color: #333;
}

.stat-cards {
  margin-bottom: 24px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.trend-chart,
.distribution-chart {
  height: 400px;
  margin-bottom: 40px;
}

.chart {
  height: 100%;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .el-form-item {
    margin-bottom: 12px;
  }

  .trend-chart,
  .distribution-chart {
    height: 300px;
  }

  .stat-cards {
    margin-bottom: 16px;
  }

  .el-col {
    margin-bottom: 16px;
  }
}

/* 分析对话框样式 */
.analysis-dialog {
  --el-dialog-margin-top: 2vh;
}

.analysis-dialog :deep(.el-dialog__body) {
  padding: 0;
  height: calc(95vh - 53px); /* 减去标题栏高度 */
  overflow-y: auto;
}

.analysis-container {
  background-color: #f5f7fa;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.analysis-header {
  padding: 20px 24px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.analysis-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

/* 统计卡片样式 */
.stat-overview {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .el-icon {
  font-size: 24px;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1.2;
}

.stat-rate {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 卡片主题色 */
.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #409eff 0%, #53a8ff 100%);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #e6a23c 0%, #f3b760 100%);
}

.stat-card.danger .stat-icon {
  background: linear-gradient(135deg, #f56c6c 0%, #ff9292 100%);
}

/* 图表区域样式 */
.charts-container {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
}

.chart-section {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h4 {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin: 0;
  padding-left: 12px;
  border-left: 4px solid #409eff;
}

.chart-content {
  flex: 1;
  min-height: 0;
}

/* 图表组件样式 */
.chart-content .echarts {
  width: 100% !important;
  height: 100% !important;
  min-height: 500px;
}
</style> 