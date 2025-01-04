<template>
  <div class="performance-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>安全绩效监测</h2>
        <div class="toolbar">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增指标
          </el-button>
          <el-button type="primary" @click="showAnalysis">
            <el-icon><TrendCharts /></el-icon>绩效分析
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="指标类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="安全生产指标" value="production" />
            <el-option label="职业健康指标" value="health" />
            <el-option label="环境保护指标" value="environment" />
          </el-select>
        </el-form-item>
        <el-form-item label="监测周期">
          <el-select v-model="searchForm.period" placeholder="请选择周期" clearable>
            <el-option label="每日" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
            <el-option label="每季" value="quarterly" />
          </el-select>
        </el-form-item>
        <el-form-item label="更新日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
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
        <el-table-column prop="name" label="指标名称" />
        <el-table-column prop="type" label="指标类型" width="140">
          <template #default="{ row }">
            {{ utils.getIndicatorTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="period" label="监测周期" width="100">
          <template #default="{ row }">
            {{ utils.getPeriodText(row.period) }}
          </template>
        </el-table-column>
        <el-table-column prop="target" label="目标值" width="100">
          <template #default="{ row }">
            {{ row.target }}{{ row.unit }}
          </template>
        </el-table-column>
        <el-table-column prop="actual" label="实际值" width="100">
          <template #default="{ row }">
            {{ row.actual }}{{ row.unit }}
          </template>
        </el-table-column>
        <el-table-column label="达标状态" width="100">
          <template #default="{ row }">
            <el-tag :type="utils.getStatusType(row)">
              {{ utils.getStatusText(row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdate" label="更新日期" width="120" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleRecord(row)">记录</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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
      :title="dialogType === 'add' ? '新增指标' : '编辑指标'"
      width="60%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="指标类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="安全生产指标" value="production" />
            <el-option label="职业健康指标" value="health" />
            <el-option label="环境保护指标" value="environment" />
          </el-select>
        </el-form-item>
        <el-form-item label="监测周期" prop="period">
          <el-select v-model="form.period" placeholder="请选择周期" style="width: 100%">
            <el-option label="每日" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
            <el-option label="每季" value="quarterly" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标值" prop="target">
          <el-input-number v-model="form.target" :precision="2" :step="1" style="width: 200px" />
        </el-form-item>
        <el-form-item label="计算方法" prop="formula">
          <el-input v-model="form.formula" placeholder="请输入计算方法" />
        </el-form-item>
        <el-form-item label="指标说明" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="3"
            placeholder="请输入指标说明"
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

    <!-- 记录对话框 -->
    <el-dialog
      v-model="recordDialogVisible"
      title="记录数据"
      width="500px"
    >
      <el-form
        ref="recordFormRef"
        :model="recordForm"
        :rules="recordRules"
        label-width="100px"
        class="record-form"
      >
        <el-form-item label="记录日期" prop="recordDate">
          <el-date-picker
            v-model="recordForm.recordDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="实际值" prop="value">
          <el-input-number
            v-model="recordForm.value"
            :precision="2"
            :step="1"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="recordForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="recordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRecordSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分析对话框 -->
    <el-dialog
      v-model="analysisVisible"
      title="绩效分析"
      width="95%"
      :fullscreen="true"
      class="analysis-dialog"
    >
      <div class="analysis-container">
        <!-- 顶部时间选择 -->
        <div class="analysis-header">
          <h3>安全绩效监测分析</h3>
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
              <el-icon><DataLine /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">指标总数</div>
              <div class="stat-value">{{ statistics.total }}</div>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">达标数</div>
              <div class="stat-value">{{ statistics.achieved }}</div>
              <div class="stat-rate">达标率 {{ (statistics.achieved / statistics.total * 100).toFixed(1) }}%</div>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">预警数</div>
              <div class="stat-value">{{ statistics.warning }}</div>
              <div class="stat-rate">预警率 {{ (statistics.warning / statistics.total * 100).toFixed(1) }}%</div>
            </div>
          </div>
          <div class="stat-card danger">
            <div class="stat-icon">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">超标数</div>
              <div class="stat-value">{{ statistics.exceeded }}</div>
              <div class="stat-rate">超标率 {{ (statistics.exceeded / statistics.total * 100).toFixed(1) }}%</div>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-container">
          <!-- 趋势图 -->
          <div class="chart-section">
            <div class="section-header">
              <h4>指标趋势分析</h4>
              <el-radio-group v-model="chartTimeRange" @change="handleTimeRangeChange">
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季度</el-radio-button>
                <el-radio-button label="year">本年度</el-radio-button>
              </el-radio-group>
            </div>
            <div class="chart-content">
              <v-chart :option="trendOption" autoresize />
            </div>
          </div>

          <!-- 分布图 -->
          <div class="chart-section">
            <div class="section-header">
              <h4>指标分布</h4>
            </div>
            <div class="chart-content">
              <v-chart :option="distributionOption" autoresize />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, TrendCharts, DataLine, Warning, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import VChart from 'vue-echarts'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必需的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索表单
const searchFormRef = ref()
const searchForm = ref({
  type: '',
  period: '',
  dateRange: []
})

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const recordDialogVisible = ref(false)
const analysisVisible = ref(false)
const chartTimeRange = ref('month')

// 当前选中的项
const currentItem = ref<any>(null)

// 统计数据
const statistics = ref({
  total: 33,
  achieved: 28,
  warning: 4,
  exceeded: 1
})

// 表格数据
const tableData = ref([
  {
    name: '飞行事故率',
    type: 'safety',
    period: 'monthly',
    target: '0',
    actual: '0',
    unit: '%',
    status: 'success',
    lastUpdate: '2024-03-15'
  },
  {
    name: '航班准点率',
    type: 'operation',
    period: 'monthly',
    target: '85',
    actual: '87',
    unit: '%',
    status: 'success',
    lastUpdate: '2024-03-15'
  },
  {
    name: '机务维修完成率',
    type: 'maintenance',
    period: 'monthly',
    target: '95',
    actual: '96',
    unit: '%',
    status: 'success',
    lastUpdate: '2024-03-15'
  },
  {
    name: '飞行员资质有效率',
    type: 'qualification',
    period: 'monthly',
    target: '100',
    actual: '100',
    unit: '%',
    status: 'success',
    lastUpdate: '2024-03-15'
  }
])

// 更新总数
total.value = tableData.value.length

// 新增/编辑对话框
const formRef = ref()
const form = ref({
  name: '',
  type: '',
  period: '',
  target: 0,
  unit: '%',
  formula: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择指标类型', trigger: 'change' }],
  period: [{ required: true, message: '请选择监测周期', trigger: 'change' }],
  target: [{ required: true, message: '请输入目标值', trigger: 'blur' }],
  formula: [{ required: true, message: '请输入计算方法', trigger: 'blur' }]
}

// 记录对话框
const recordFormRef = ref()
const recordForm = ref({
  recordDate: '',
  value: 0,
  remark: ''
})

const recordRules = {
  recordDate: [{ required: true, message: '请选择记录日期', trigger: 'change' }],
  value: [{ required: true, message: '请输入实际值', trigger: 'blur' }]
}

// 指标列表数据
const indicatorList = ref([
  {
    name: '飞行事故率',
    type: '安全生产指标',
    period: '每月',
    target: '0',
    actual: '0',
    status: '达标',
    updateDate: '2024-03-15'
  },
  {
    name: '航班准点率',
    type: '运行指标',
    period: '每月',
    target: '85%',
    actual: '87%',
    status: '达标',
    updateDate: '2024-03-15'
  },
  {
    name: '机务维修完成率',
    type: '维修指标',
    period: '每月',
    target: '95%',
    actual: '96%',
    status: '达标',
    updateDate: '2024-03-15'
  },
  {
    name: '飞行员资质有效率',
    type: '人员资质指标',
    period: '每月',
    target: '100%',
    actual: '100%',
    status: '达标',
    updateDate: '2024-03-15'
  },
  {
    name: '安全培训覆盖率',
    type: '培训指标',
    period: '每季',
    target: '100%',
    actual: '98%',
    status: '预警',
    updateDate: '2024-03-15'
  },
  {
    name: '安全隐患整改率',
    type: '隐患管理指标',
    period: '每月',
    target: '95%',
    actual: '92%',
    status: '预警',
    updateDate: '2024-03-15'
  },
  {
    name: '应急演练完成率',
    type: '应急管理指标',
    period: '每季',
    target: '100%',
    actual: '100%',
    status: '达标',
    updateDate: '2024-03-15'
  },
  {
    name: '危险品运输合格率',
    type: '运输指标',
    period: '每月',
    target: '100%',
    actual: '100%',
    status: '达标',
    updateDate: '2024-03-15'
  }
])

// 指标类型选项
const indicatorTypes = [
  { value: 'safety', label: '安全生产指标' },
  { value: 'operation', label: '运行指标' },
  { value: 'maintenance', label: '维修指标' },
  { value: 'qualification', label: '人员资质指标' },
  { value: 'training', label: '培训指标' },
  { value: 'hazard', label: '隐患管理指标' },
  { value: 'emergency', label: '应急管理指标' },
  { value: 'transport', label: '运输指标' }
]

// 监测周期选项
const monitoringPeriods = [
  { value: 'monthly', label: '每月' },
  { value: 'quarterly', label: '每季' },
  { value: 'yearly', label: '每年' }
]

// 合并所有工具方法到一个对象中
const utils = {
  // 获取指标类型文本
  getIndicatorTypeText: (type: string) => {
    const map: Record<string, string> = {
      safety: '安全生产指标',
      operation: '运行指标',
      maintenance: '维修指标',
      qualification: '人员资质指标',
      training: '培训指标',
      hazard: '隐患管理指标',
      emergency: '应急管理指标',
      transport: '运输指标'
    }
    return map[type] || type
  },

  // 获取监测周期文本
  getPeriodText: (period: string) => {
    const map: Record<string, string> = {
      daily: '每日',
      weekly: '每周',
      monthly: '每月',
      quarterly: '每季'
    }
    return map[period] || period
  },

  // 获取状态类型
  getStatusType: (row: any) => {
    const map: Record<string, string> = {
      success: 'success',
      warning: 'warning',
      danger: 'danger'
    }
    return map[row.status] || 'info'
  },

  // 获取状态文本
  getStatusText: (row: any) => {
    const map: Record<string, string> = {
      success: '达标',
      warning: '预警',
      danger: '超标'
    }
    return map[row.status] || row.status
  }
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
    name: '',
    type: '',
    period: '',
    target: 0,
    unit: '%',
    formula: '',
    description: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleView = (row: any) => {
  currentItem.value = row
  // TODO: 实现查看详情功能
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该指标吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除：', row)
    ElMessage.success('删除成功')
  })
}

const handleRecord = (row: any) => {
  currentItem.value = row
  recordForm.value = {
    recordDate: '',
    value: 0,
    remark: ''
  }
  recordDialogVisible.value = true
}

const handleRecordSubmit = async () => {
  if (!recordFormRef.value) return
  await recordFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('记录数据：', recordForm.value)
      recordDialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
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

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

const showAnalysis = () => {
  analysisVisible.value = true
  loadStatistics()
}

const handleTimeRangeChange = () => {
  loadStatistics()
  // 根据时间范围更新图表数据
}

const loadStatistics = () => {
  // 加载统计数据
  statistics.value = {
    total: 33,
    achieved: 28,
    warning: 4,
    exceeded: 1
  }
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.performance-container {
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
  min-height: 0; /* 防止溢出 */
}

.chart-section {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 600px; /* 设置最小高度 */
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
  min-height: 0; /* 防止溢出 */
}

/* 图表组件样式 */
.chart-content .echarts {
  width: 100% !important;
  height: 100% !important;
  min-height: 500px;
}

/* 优化图表配置 */
</style> 