<template>
  <div class="statutory-plan">
    <div class="page-header">
      <h2>自查计划</h2>
      <div class="header-actions">
        <el-button type="success" @click="handleExport">
          <el-icon><Download /></el-icon>导出
        </el-button>
        <el-button type="warning" @click="handleImport">
          <el-icon><Upload /></el-icon>导入
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增计划
        </el-button>
      </div>
    </div>

    <!-- 添加图表展示区域 -->
    <el-row :gutter="20" class="charts">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>各部门自查计划完成情况</span>
            </div>
          </template>
          <div class="chart-container" ref="deptChartRef"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>自查类型分布</span>
            </div>
          </template>
          <div class="chart-container" ref="typeChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本年度计划完成率</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.completionRate }}%</span>
            <el-progress 
              :percentage="statistics.completionRate" 
              :status="statistics.completionRate >= 90 ? 'success' : 'warning'"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>年度计划自查次数</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.plannedCount }}</span>
            <span class="label">次</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>已完成自查</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.completedCount }}</span>
            <span class="label">次</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待执行自查</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.pendingCount }}</span>
            <span class="label">次</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="计划年度">
          <el-date-picker
            v-model="searchForm.planYear"
            type="year"
            placeholder="选择年份"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="自查类型">
          <el-select 
            v-model="searchForm.checkType" 
            placeholder="请选择" 
            clearable
            style="width: 180px"
          >
            <el-option label="运行合格审定" value="operation" />
            <el-option label="维修合格审定" value="maintenance" />
            <el-option label="训练大纲" value="training" />
            <el-option label="手册体系" value="manual" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门">
          <el-select 
            v-model="searchForm.department" 
            placeholder="请选择" 
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 在表格上方添加批量操作按钮 -->
    <div class="table-operations" v-if="selectedRows.length > 0">
      <el-alert
        :title="`已选择 ${selectedRows.length} 项`"
        type="info"
        show-icon
      >
        <template #default>
          <el-button type="danger" size="small" @click="handleBatchDelete">
            批量删除
          </el-button>
          <el-button type="warning" size="small" @click="handleBatchExport">
            导出所选
          </el-button>
        </template>
      </el-alert>
    </div>

    <!-- 表格区域 -->
    <el-table 
      :data="tableData" 
      style="width: 100%" 
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="planYear" label="计划年度" width="100" />
      <el-table-column prop="checkType" label="自查类型" width="150" />
      <el-table-column prop="department" label="责任部门" width="120" />
      <el-table-column prop="frequency" label="频次" width="100" />
      <el-table-column prop="plannedCount" label="计划次数" width="100" />
      <el-table-column prop="completedCount" label="已完成" width="100" />
      <el-table-column prop="completionRate" label="完成率" width="180">
        <template #default="{ row }">
          <el-progress 
            :percentage="row.completionRate" 
            :status="row.completionRate >= 90 ? 'success' : 'warning'"
          />
        </template>
      </el-table-column>
      <el-table-column prop="nextTime" label="下次自查时间" width="160" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="success" @click="showExecutionDetails(row)">
            执行详情
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增自查计划' : '编辑自查计划'"
      width="700px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="计划年度" prop="planYear">
          <el-date-picker
            v-model="form.planYear"
            type="year"
            placeholder="选择年份"
          />
        </el-form-item>
        <el-form-item label="自查类型" prop="checkType">
          <el-select v-model="form.checkType" placeholder="请选择">
            <el-option label="运行合格审定" value="operation" />
            <el-option label="维修合格审定" value="maintenance" />
            <el-option label="训练大纲" value="training" />
            <el-option label="手册体系" value="manual" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择">
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="自查频次" prop="frequency">
          <el-select v-model="form.frequency" placeholder="请选择">
            <el-option label="每月" value="monthly" />
            <el-option label="每季" value="quarterly" />
            <el-option label="每半年" value="semiannual" />
            <el-option label="每年" value="annual" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划次数" prop="plannedCount">
          <el-input-number v-model="form.plannedCount" :min="1" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加执行详情对话框 -->
    <el-dialog
      v-model="executionDialogVisible"
      title="执行详情"
      width="900px"
    >
      <div class="execution-header">
        <div class="info-item">
          <span class="label">自查类型：</span>
          <span class="value">{{ currentPlan?.checkType }}</span>
        </div>
        <div class="info-item">
          <span class="label">责任部门：</span>
          <span class="value">{{ currentPlan?.department }}</span>
        </div>
        <div class="info-item">
          <span class="label">计划频次：</span>
          <span class="value">{{ currentPlan?.frequency }}</span>
        </div>
      </div>

      <!-- 执行记录时间轴 -->
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in executionRecords"
          :key="index"
          :type="getTimelineItemType(record.status)"
          :timestamp="record.time"
        >
          <el-card class="timeline-card">
            <template #header>
              <div class="timeline-header">
                <span>第{{ index + 1 }}次自查</span>
                <el-tag :type="getStatusType(record.status)">
                  {{ record.status }}
                </el-tag>
              </div>
            </template>
            <div class="timeline-content">
              <p><strong>检查人员：</strong>{{ record.inspector }}</p>
              <p><strong>检查结果：</strong>{{ record.result }}</p>
              <p v-if="record.findings"><strong>发现问题：</strong>{{ record.findings }}</p>
              <p v-if="record.measures"><strong>整改措施：</strong>{{ record.measures }}</p>
              <div class="timeline-attachments" v-if="record.attachments?.length">
                <p><strong>附件：</strong></p>
                <el-link 
                  v-for="file in record.attachments" 
                  :key="file.name"
                  type="primary" 
                  :underline="false"
                  @click="downloadAttachment(file)"
                >
                  <el-icon><Document /></el-icon>
                  {{ file.name }}
                </el-link>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Upload, Plus, Document } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

// 部门选项
const departmentOptions = [
  { label: '飞行部', value: '飞行部' },
  { label: '维修部', value: '维修部' },
  { label: '运控部', value: '运控部' },
  { label: '客舱部', value: '客舱部' },
  { label: '安全部', value: '安全部' }
]

// 统计数据
const statistics = reactive({
  completionRate: 75,
  plannedCount: 12,
  completedCount: 9,
  pendingCount: 3
})

// 搜索表单
const searchForm = reactive({
  planYear: '',
  checkType: '',
  department: ''
})

// 表格数据
const tableData = ref([
  {
    planYear: '2024',
    checkType: '运行合格审定',
    department: '飞行部',
    frequency: '每季',
    plannedCount: 4,
    completedCount: 1,
    completionRate: 25,
    nextTime: '2024-04-15',
    status: '进行中',
    remark: '按CCAR-121部要求开展自查'
  },
  {
    planYear: '2024',
    checkType: '维修合格审定',
    department: '维修部',
    frequency: '每半年',
    plannedCount: 2,
    completedCount: 0,
    completionRate: 0,
    nextTime: '2024-06-20',
    status: '未开始',
    remark: '按CCAR-145部要求开展自查'
  },
  {
    planYear: '2024',
    checkType: '训练大纲',
    department: '飞行部',
    frequency: '每年',
    plannedCount: 1,
    completedCount: 0,
    completionRate: 0,
    nextTime: '2024-09-10',
    status: '未开始',
    remark: '年度训练大纲符合性检查'
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  planYear: '',
  checkType: '',
  department: '',
  frequency: '',
  plannedCount: 1,
  remark: '',
  status: '未开始'
})

// 表单验证规则
const rules = {
  planYear: [{ required: true, message: '请选择计划年度', trigger: 'change' }],
  checkType: [{ required: true, message: '请选择自查类型', trigger: 'change' }],
  department: [{ required: true, message: '请选择责任部门', trigger: 'change' }],
  frequency: [{ required: true, message: '请选择自查频次', trigger: 'change' }],
  plannedCount: [{ required: true, message: '请输入计划次数', trigger: 'blur' }]
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const map: Record<string, 'success' | 'warning' | 'info'> = {
    '已完成': 'success',
    '进行中': 'warning',
    '未开始': 'info'
  }
  return map[status] || 'info'
}

// 方法定义
const handleSearch = () => {
  loading.value = true
  // 实现搜索逻辑
  const { planYear, checkType, department } = searchForm
  const filteredData = tableData.value.filter(item => {
    const matchYear = !planYear || item.planYear === planYear
    const matchType = !checkType || item.checkType === checkType
    const matchDept = !department || item.department === department
    return matchYear && matchType && matchDept
  })
  total.value = filteredData.length
  loading.value = false
}

const handleReset = () => {
  searchForm.planYear = ''
  searchForm.checkType = ''
  searchForm.department = ''
  handleSearch()
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(form, {
    planYear: '',
    checkType: '',
    department: '',
    frequency: '',
    plannedCount: 1,
    remark: '',
    status: '未开始'
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleView = (row: any) => {
  // 实现查看逻辑
  ElMessage.info(`查看自查计划：${row.checkType}`)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该自查计划？', '提示', {
      type: 'warning'
    })
    // 实现删除逻辑
    const index = tableData.value.findIndex(item => 
      item.planYear === row.planYear && 
      item.checkType === row.checkType &&
      item.department === row.department
    )
    if (index !== -1) {
      tableData.value.splice(index, 1)
      total.value = tableData.value.length
      ElMessage.success('删除成功')
    }
  } catch {
    // 取消删除
  }
}

const calculateNextTime = (frequency: string): string => {
  const now = new Date()
  switch (frequency) {
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1)).toISOString().split('T')[0]
    case 'quarterly':
      return new Date(now.setMonth(now.getMonth() + 3)).toISOString().split('T')[0]
    case 'semiannual':
      return new Date(now.setMonth(now.getMonth() + 6)).toISOString().split('T')[0]
    case 'annual':
      return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString().split('T')[0]
    default:
      return ''
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      const nextTime = calculateNextTime(form.frequency)
      const newPlan = {
        ...form,
        completedCount: 0,
        completionRate: 0,
        nextTime,
        status: '未开始'
      }

      if (dialogType.value === 'add') {
        tableData.value.push(newPlan)
      } else {
        const index = tableData.value.findIndex(item => 
          item.planYear === form.planYear && 
          item.checkType === form.checkType &&
          item.department === form.department
        )
        if (index !== -1) {
          tableData.value[index] = newPlan
        }
      }
      
      total.value = tableData.value.length
      dialogVisible.value = false
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
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

// 图表相关
const deptChartRef = ref<HTMLElement>()
const typeChartRef = ref<HTMLElement>()
let deptChart: echarts.ECharts | null = null
let typeChart: echarts.ECharts | null = null

// 初始化图表
onMounted(() => {
  if (deptChartRef.value) {
    deptChart = echarts.init(deptChartRef.value)
    updateDeptChart()
  }
  if (typeChartRef.value) {
    typeChart = echarts.init(typeChartRef.value)
    updateTypeChart()
  }
})

// 更新部门完成情况图表
const updateDeptChart = () => {
  const deptData = departmentOptions.map(dept => {
    const deptPlans = tableData.value.filter(item => item.department === dept.value)
    const completionRate = deptPlans.length ? 
      Math.round(deptPlans.reduce((sum, plan) => sum + plan.completionRate, 0) / deptPlans.length) : 0
    return { name: dept.label, value: completionRate }
  })

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%'
    },
    xAxis: {
      type: 'category',
      data: deptData.map(item => item.name)
    },
    yAxis: {
      type: 'value',
      max: 100,
      name: '完成率(%)'
    },
    series: [
      {
        type: 'bar',
        data: deptData.map(item => item.value),
        itemStyle: {
          color: '#409EFF'
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        }
      }
    ]
  }

  deptChart?.setOption(option)
}

// 更新类型分布图表
const updateTypeChart = () => {
  const typeData = [
    { name: '运行合格审定', value: 0 },
    { name: '维修合格审定', value: 0 },
    { name: '训练大纲', value: 0 },
    { name: '手册体系', value: 0 }
  ]

  tableData.value.forEach(item => {
    const typeItem = typeData.find(t => t.name === item.checkType)
    if (typeItem) typeItem.value++
  })

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: typeData
      }
    ]
  }

  typeChart?.setOption(option)
}

// 导出功能
const handleExport = () => {
  const data = tableData.value.map(item => ({
    '计划年度': item.planYear,
    '自查类型': item.checkType,
    '责任部门': item.department,
    '频次': item.frequency,
    '计划次数': item.plannedCount,
    '已完成次数': item.completedCount,
    '完成率': `${item.completionRate}%`,
    '下次自查时间': item.nextTime,
    '状态': item.status,
    '备注': item.remark
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '自查计划')
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `自查计划_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// 导入功能
const handleImport = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls'
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        // 处理导入的数据
        const importedData = jsonData.map((item: any) => ({
          planYear: item['计划年度'].toString(),
          checkType: item['自查类型'],
          department: item['责任部门'],
          frequency: item['频次'],
          plannedCount: parseInt(item['计划次数']),
          completedCount: parseInt(item['已完成次数']),
          completionRate: parseInt(item['完成率']),
          nextTime: item['下次自查时间'],
          status: item['状态'],
          remark: item['备注']
        }))

        tableData.value = importedData
        total.value = importedData.length
        ElMessage.success('导入成功')
        
        // 更新图表
        updateDeptChart()
        updateTypeChart()
      }
      reader.readAsArrayBuffer(file)
    }
  }
  input.click()
}

// 在数据变化时更新图表
watch(tableData, () => {
  updateDeptChart()
  updateTypeChart()
}, { deep: true })

// 添加新的响应式变量
const selectedRows = ref<any[]>([])
const executionDialogVisible = ref(false)
const currentPlan = ref<any>(null)
const executionRecords = ref([
  {
    time: '2024-03-01 09:00',
    status: '已完成',
    inspector: '张三、李四',
    result: '符合要求',
    findings: '无重大问题',
    measures: '',
    attachments: [
      { name: '自查报告-Q1.pdf', url: '' },
      { name: '检查记录表.xlsx', url: '' }
    ]
  },
  {
    time: '2023-12-15 14:00',
    status: '已完成',
    inspector: '王五、赵六',
    result: '部分符合',
    findings: '1. 部分记录填写不规范\n2. 个别程序执行不到位',
    measures: '1. 加强人员培训\n2. 完善操作流程',
    attachments: [
      { name: '自查报告-Q4.pdf', url: '' },
      { name: '整改报告.docx', url: '' }
    ]
  }
])

// 多选相关方法
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 个计划？`, 
      '提示',
      { type: 'warning' }
    )
    // 实现批量删除逻辑
    const ids = selectedRows.value.map(row => row.id)
    tableData.value = tableData.value.filter(item => !ids.includes(item.id))
    total.value = tableData.value.length
    ElMessage.success('批量删除成功')
  } catch {
    // 取消删除
  }
}

const handleBatchExport = () => {
  const data = selectedRows.value.map(item => ({
    '计划年度': item.planYear,
    '自查类型': item.checkType,
    '责任部门': item.department,
    '频次': item.frequency,
    '计划次数': item.plannedCount,
    '已完成次数': item.completedCount,
    '完成率': `${item.completionRate}%`,
    '下次自查时间': item.nextTime,
    '状态': item.status,
    '备注': item.remark
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '自查计划')
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `自查计划_所选项_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// 执行详情相关方法
const showExecutionDetails = (row: any) => {
  currentPlan.value = row
  executionDialogVisible.value = true
}

const getTimelineItemType = (status: string): '' | 'primary' | 'success' | 'warning' | 'danger' => {
  const map: Record<string, any> = {
    '已完成': 'success',
    '进行中': 'primary',
    '未开始': '',
    '逾期': 'danger'
  }
  return map[status] || ''
}

const downloadAttachment = (file: any) => {
  // 实现文件下载逻辑
  ElMessage.success(`下载文件：${file.name}`)
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.statistics {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistics-value {
  text-align: center;
}

.statistics-value .number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.statistics-value .label {
  margin-left: 4px;
  color: #909399;
}

.search-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.charts {
  margin-bottom: 20px;
}

.chart-card {
  height: 360px;
}

.chart-container {
  height: 300px;
}

.table-operations {
  margin-bottom: 16px;

  :deep(.el-alert) {
    margin-bottom: 0;
  }

  .el-button {
    margin-left: 16px;
  }
}

.execution-header {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.info-item {
  .label {
    color: #909399;
    margin-right: 8px;
  }

  .value {
    font-weight: 500;
  }
}

.timeline-card {
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .timeline-content {
    p {
      margin: 8px 0;
    }

    strong {
      color: #606266;
    }
  }

  .timeline-attachments {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;

    .el-link {
      margin-right: 16px;
      margin-bottom: 8px;

      .el-icon {
        margin-right: 4px;
      }
    }
  }
}
</style> 