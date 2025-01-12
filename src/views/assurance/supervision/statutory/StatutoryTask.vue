<template>
  <div class="statutory-task">
    <div class="page-header">
      <h2>自查任务</h2>
      <div class="header-actions">
        <task-reminder />
        <el-button type="primary" @click="handleAdd">新建任务</el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="任务编号">
          <el-input 
            v-model="searchForm.taskNo" 
            placeholder="请输入编号" 
            clearable
            style="width: 200px"
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
        <el-form-item label="执行时间">
          <el-date-picker
            v-model="searchForm.executeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 320px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select 
            v-model="searchForm.status" 
            placeholder="请选择" 
            clearable
            style="width: 120px"
          >
            <el-option label="未开始" value="pending" />
            <el-option label="进行中" value="processing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
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

    <el-table :data="tableData" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="taskNo" label="任务编号" width="140" />
      <el-table-column prop="checkType" label="自查类型" width="150" />
      <el-table-column prop="department" label="责任部门" width="120" />
      <el-table-column prop="checkTeam" label="检查组" width="150">
        <template #default="{ row }">
          <el-tag 
            v-for="member in row.checkTeam" 
            :key="member"
            size="small"
            class="member-tag"
          >
            {{ member }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="160" />
      <el-table-column prop="endTime" label="结束时间" width="160" />
      <el-table-column prop="itemCount" label="检查项数量" width="100" align="center" />
      <el-table-column prop="progress" label="完成进度" width="180">
        <template #default="{ row }">
          <el-progress 
            :percentage="row.progress" 
            :status="row.progress >= 100 ? 'success' : ''"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <el-button 
            link 
            type="primary" 
            @click="handleExecute(row)"
            :disabled="row.status === '已完成'"
          >
            执行检查
          </el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button 
            link 
            type="primary" 
            @click="handleReport(row)"
            :disabled="row.status !== '已完成'"
          >
            生成报告
          </el-button>
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

    <!-- 新建任务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新建自查任务"
      width="800px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="自查类型" prop="checkType">
          <el-select 
            v-model="form.checkType" 
            placeholder="请选择"
            @change="handleTypeChange"
          >
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
        <el-form-item label="检查组成员" prop="checkTeam">
          <el-select
            v-model="form.checkTeam"
            multiple
            placeholder="请选择检查组成员"
          >
            <el-option
              v-for="item in staffOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间" prop="executeTime">
          <el-date-picker
            v-model="form.executeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-divider>检查项</el-divider>
        <!-- 检查项选择 -->
        <div class="check-items-section">
          <div class="section-header">
            <span>已选择 {{ form.checkItems.length }} 项</span>
            <el-button type="primary" link @click="showItemSelector = true">
              从检查项库选择
            </el-button>
          </div>
          <el-table :data="form.checkItems" style="width: 100%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
            <el-table-column prop="standard" label="检查标准" show-overflow-tooltip />
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button 
                  link 
                  type="danger" 
                  @click="removeCheckItem($index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 检查项选择对话框 -->
    <el-dialog
      v-model="showItemSelector"
      title="选择检查项"
      width="900px"
      append-to-body
    >
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="itemSearchForm" class="item-search">
        <el-form-item label="检查内容">
          <el-input 
            v-model="itemSearchForm.content" 
            placeholder="请输入关键词" 
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchItems">查询</el-button>
          <el-button @click="resetItemSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 检查项列表 -->
      <el-table
        ref="itemTableRef"
        :data="checkItemsList"
        style="width: 100%"
        v-loading="itemsLoading"
        @selection-change="handleItemSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="itemNo" label="检查项编号" width="120" />
        <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
        <el-table-column prop="standard" label="检查标准" show-overflow-tooltip />
        <el-table-column prop="method" label="检查方法" width="120" />
        <el-table-column prop="basis" label="检查依据" width="120" show-overflow-tooltip />
      </el-table>

      <!-- 分页 -->
      <div class="dialog-pagination">
        <el-pagination
          v-model:current-page="itemCurrentPage"
          v-model:page-size="itemPageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="itemTotal"
          layout="total, sizes, prev, pager, next"
          @size-change="handleItemSizeChange"
          @current-change="handleItemCurrentChange"
        />
      </div>

      <template #footer>
        <el-button @click="showItemSelector = false">取消</el-button>
        <el-button type="primary" @click="confirmItemSelection">确定</el-button>
      </template>
    </el-dialog>

    <!-- 执行检查对话框 -->
    <el-dialog
      v-model="executeDialogVisible"
      title="执行检查"
      width="1000px"
      :close-on-click-modal="false"
    >
      <div class="execute-header">
        <div class="info-item">
          <span class="label">任务编号：</span>
          <span class="value">{{ currentTask?.taskNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">自查类型：</span>
          <span class="value">{{ currentTask?.checkType }}</span>
        </div>
        <div class="info-item">
          <span class="label">责任部门：</span>
          <span class="value">{{ currentTask?.department }}</span>
        </div>
      </div>

      <!-- 检查项执行列表 -->
      <el-table :data="currentTask?.checkItems" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
        <el-table-column prop="standard" label="检查标准" show-overflow-tooltip />
        <el-table-column label="检查结果" width="120">
          <template #default="{ row }">
            <el-select v-model="row.result" placeholder="请选择">
              <el-option label="符合" value="符合" />
              <el-option label="不符合" value="不符合" />
              <el-option label="部分符合" value="部分符合" />
              <el-option label="不适用" value="不适用" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="发现问题" width="200">
          <template #default="{ row }">
            <el-input
              v-model="row.findings"
              type="textarea"
              :rows="2"
              placeholder="请输入发现的问题"
            />
          </template>
        </el-table-column>
        <el-table-column label="整改措施" width="200">
          <template #default="{ row }">
            <el-input
              v-model="row.measures"
              type="textarea"
              :rows="2"
              placeholder="请输入整改措施"
            />
          </template>
        </el-table-column>
        <el-table-column label="附件" width="120">
          <template #default="{ row }">
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="(file) => handleFileChange(file, row)"
            >
              <el-button link type="primary">
                <el-icon><Upload /></el-icon>上传附件
              </el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>

      <div class="execute-footer">
        <el-button @click="executeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveExecuteResult">保存</el-button>
        <el-button type="success" @click="completeExecute">完成检查</el-button>
      </div>
    </el-dialog>

    <!-- 报告对话框 -->
    <el-dialog
      v-model="reportDialogVisible"
      title="自查报告"
      width="1000px"
      :close-on-click-modal="false"
    >
      <div class="report-header">
        <h3>{{ currentTask?.checkType }}自查报告</h3>
        <div class="report-info">
          <div class="info-row">
            <div class="info-item">
              <span class="label">任务编号：</span>
              <span class="value">{{ currentTask?.taskNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">责任部门：</span>
              <span class="value">{{ currentTask?.department }}</span>
            </div>
            <div class="info-item">
              <span class="label">检查时间：</span>
              <span class="value">{{ currentTask?.startTime }} 至 {{ currentTask?.endTime }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">检查组成员：</span>
              <span class="value">{{ currentTask?.checkTeam?.join('、') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 报告内容 -->
      <div class="report-content">
        <el-form :model="reportForm" label-width="100px">
          <el-form-item label="检查概述">
            <el-input
              v-model="reportForm.summary"
              type="textarea"
              :rows="3"
              placeholder="请输入本次检查的总体情况"
            />
          </el-form-item>

          <!-- 检查结果统计 -->
          <div class="result-statistics">
            <h4>检查结果统计</h4>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="stat-card">
                  <div class="stat-label">检查项总数</div>
                  <div class="stat-value">{{ reportStats.total }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-card">
                  <div class="stat-label">符合项</div>
                  <div class="stat-value success">{{ reportStats.conformity }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-card">
                  <div class="stat-label">不符合项</div>
                  <div class="stat-value danger">{{ reportStats.nonConformity }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-card">
                  <div class="stat-label">部分符合项</div>
                  <div class="stat-value warning">{{ reportStats.partialConformity }}</div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 问题清单 -->
          <div class="findings-list">
            <h4>发现的问题</h4>
            <el-table :data="reportForm.findings" style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
              <el-table-column prop="standard" label="检查标准" show-overflow-tooltip />
              <el-table-column prop="result" label="检查结果" width="100">
                <template #default="{ row }">
                  <el-tag :type="getResultTagType(row.result)">{{ row.result }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="findings" label="问题描述" show-overflow-tooltip />
              <el-table-column prop="measures" label="整改措施" show-overflow-tooltip />
            </el-table>
          </div>

          <el-form-item label="整改建议">
            <el-input
              v-model="reportForm.recommendations"
              type="textarea"
              :rows="3"
              placeholder="请输入整改建议"
            />
          </el-form-item>

          <el-form-item label="结论">
            <el-input
              v-model="reportForm.conclusion"
              type="textarea"
              :rows="3"
              placeholder="请输入检查结论"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="reportDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handlePreview">预览</el-button>
        <el-button type="success" @click="handleExportReport">导出报告</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 部门选项
const departmentOptions = [
  { label: '飞行部', value: '飞行部' },
  { label: '维修部', value: '维修部' },
  { label: '运控部', value: '运控部' },
  { label: '客舱部', value: '客舱部' },
  { label: '安全部', value: '安全部' }
]

// 人员选项
const staffOptions = [
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '赵六', value: '赵六' },
  { label: '陈工', value: '陈工' },
  { label: '刘工', value: '刘工' }
]

// 搜索表单
const searchForm = reactive({
  taskNo: '',
  checkType: '',
  department: '',
  executeTime: [],
  status: ''
})

// 表格数据
const tableData = ref([
  {
    taskNo: 'SC-2024001',
    checkType: '运行合格审定',
    department: '飞行部',
    checkTeam: ['张三', '李四', '王五'],
    startTime: '2024-03-01',
    endTime: '2024-03-15',
    itemCount: 25,
    progress: 60,
    status: '进行中'
  },
  {
    taskNo: 'SC-2024002',
    checkType: '维修合格审定',
    department: '维修部',
    checkTeam: ['陈工', '刘工'],
    startTime: '2024-03-10',
    endTime: '2024-03-20',
    itemCount: 30,
    progress: 0,
    status: '未开始'
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

// 对话框控制
const dialogVisible = ref(false)
const showItemSelector = ref(false)
const executeDialogVisible = ref(false)
const reportDialogVisible = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  checkType: '',
  department: '',
  checkTeam: [],
  executeTime: [],
  checkItems: [] as any[]
})

// 表单验证规则
const rules = {
  checkType: [{ required: true, message: '请选择自查类型', trigger: 'change' }],
  department: [{ required: true, message: '请选择责任部门', trigger: 'change' }],
  checkTeam: [{ required: true, message: '请选择检查组成员', trigger: 'change' }],
  executeTime: [{ required: true, message: '请选择执行时间', trigger: 'change' }]
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
  const { taskNo, checkType, department, executeTime, status } = searchForm
  const filteredData = tableData.value.filter(item => {
    const matchTaskNo = !taskNo || item.taskNo.includes(taskNo)
    const matchType = !checkType || item.checkType === checkType
    const matchDept = !department || item.department === department
    const matchStatus = !status || item.status === status
    // 时间范围匹配逻辑
    let matchTime = true
    if (executeTime && executeTime.length === 2) {
      const startDate = new Date(executeTime[0])
      const endDate = new Date(executeTime[1])
      const itemStart = new Date(item.startTime)
      const itemEnd = new Date(item.endTime)
      matchTime = itemStart >= startDate && itemEnd <= endDate
    }
    return matchTaskNo && matchType && matchDept && matchStatus && matchTime
  })
  total.value = filteredData.length
  loading.value = false
}

const handleReset = () => {
  searchForm.taskNo = ''
  searchForm.checkType = ''
  searchForm.department = ''
  searchForm.executeTime = []
  searchForm.status = ''
  handleSearch()
}

const handleAdd = () => {
  Object.assign(form, {
    checkType: '',
    department: '',
    checkTeam: [],
    executeTime: [],
    checkItems: []
  })
  dialogVisible.value = true
}

const handleTypeChange = () => {
  // 根据自查类型加载对应的检查项
  form.checkItems = []
}

const removeCheckItem = (index: number) => {
  form.checkItems.splice(index, 1)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 生成任务编号
      const taskNo = `SC-${new Date().getFullYear()}${String(tableData.value.length + 1).padStart(3, '0')}`
      const [startTime, endTime] = form.executeTime
      
      const newTask = {
        taskNo,
        checkType: form.checkType,
        department: form.department,
        checkTeam: form.checkTeam,
        startTime: startTime.toISOString().split('T')[0],
        endTime: endTime.toISOString().split('T')[0],
        itemCount: form.checkItems.length,
        progress: 0,
        status: '未开始'
      }
      
      tableData.value.push(newTask)
      total.value = tableData.value.length
      dialogVisible.value = false
      ElMessage.success('创建任务成功')
    }
  })
}

const handleExecute = (row: any) => {
  // 实现检查执行逻辑
  executeDialogVisible.value = true
}

const handleView = (row: any) => {
  // 实现查看逻辑
  ElMessage.info(`查看任务：${row.taskNo}`)
}

const handleReport = (row: any) => {
  currentTask.value = row
  // 统计检查结果
  reportStats.total = row.checkItems?.length || 0
  reportStats.conformity = row.checkItems?.filter((item: any) => item.result === '符合').length || 0
  reportStats.nonConformity = row.checkItems?.filter((item: any) => item.result === '不符合').length || 0
  reportStats.partialConformity = row.checkItems?.filter((item: any) => item.result === '部分符合').length || 0

  // 筛选问题项
  reportForm.findings = row.checkItems?.filter((item: any) => 
    item.result === '不符合' || item.result === '部分符合'
  ) || []

  reportDialogVisible.value = true
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

// 检查项选择相关
const itemSearchForm = reactive({
  content: ''
})

const itemsLoading = ref(false)
const itemCurrentPage = ref(1)
const itemPageSize = ref(10)
const itemTotal = ref(0)
const selectedItems = ref<any[]>([])

const checkItemsList = ref([
  {
    itemNo: 'CX-FLT-001',
    content: '飞行员资质管理',
    standard: '按CCAR-121部要求进行飞行员资质管理',
    method: '文件审查',
    basis: 'CCAR-121'
  }
  // ... 更多检查项
])

// 报告相关
const currentTask = ref<any>(null)
const reportForm = reactive({
  summary: '',
  findings: [] as any[],
  recommendations: '',
  conclusion: ''
})

const reportStats = reactive({
  total: 0,
  conformity: 0,
  nonConformity: 0,
  partialConformity: 0
})

// 检查项选择方法
const searchItems = () => {
  itemsLoading.value = true
  // 实现检查项搜索逻辑
  setTimeout(() => {
    itemsLoading.value = false
  }, 500)
}

const resetItemSearch = () => {
  itemSearchForm.content = ''
  searchItems()
}

const handleItemSelectionChange = (items: any[]) => {
  selectedItems.value = items
}

const confirmItemSelection = () => {
  form.checkItems.push(...selectedItems.value)
  showItemSelector.value = false
  ElMessage.success(`已添加 ${selectedItems.value.length} 个检查项`)
}

// 检查执行相关
const handleFileChange = (file: any, row: any) => {
  if (!row.attachments) {
    row.attachments = []
  }
  row.attachments.push(file)
}

const saveExecuteResult = () => {
  // 保存检查结果
  ElMessage.success('保存成功')
}

const completeExecute = async () => {
  try {
    await ElMessageBox.confirm('确认完成本次检查？', '提示')
    // 更新任务状态
    const task = tableData.value.find(item => item.taskNo === currentTask.value.taskNo)
    if (task) {
      task.status = '已完成'
      task.progress = 100
    }
    executeDialogVisible.value = false
    ElMessage.success('检查已完成')
  } catch {
    // 取消操作
  }
}

// 报告相关方法
const getResultTagType = (result: string) => {
  const map: Record<string, 'success' | 'danger' | 'warning'> = {
    '符合': 'success',
    '不符合': 'danger',
    '部分符合': 'warning'
  }
  return map[result] || 'info'
}

const handlePreview = () => {
  // 实现报告预览逻辑
  window.open('#/preview/report', '_blank')
}

const handleExportReport = () => {
  // 实现报告导出逻辑
  const docDefinition = {
    content: [
      { text: `${currentTask.value?.checkType}自查报告`, style: 'header' },
      // ... 更多报告内容定义
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      }
    }
  }

  // 使用 pdfmake 生成 PDF
  ElMessage.success('报告导出成功')
}

const selectedRows = ref<any[]>([])

const handleSelectionChange = (selectedRows: any[]) => {
  selectedRows.value = selectedRows
}

const handleBatchDelete = () => {
  // 实现批量删除逻辑
  ElMessage.success('批量删除成功')
}

const handleBatchExport = () => {
  // 实现批量导出逻辑
  ElMessage.success('批量导出成功')
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.member-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}

.check-items-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 