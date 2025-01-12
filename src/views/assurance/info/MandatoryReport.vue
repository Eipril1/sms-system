<template>
  <div class="mandatory-report">
    <div class="page-header">
      <h2>强制报告</h2>
      <el-button type="primary" @click="handleAdd">+ 新增报告</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="编号">
          <el-input v-model="searchForm.recordNumber" placeholder="请输入编号" clearable />
        </el-form-item>
        <el-form-item label="航班号">
          <el-input v-model="searchForm.flightNo" placeholder="请输入航班号" clearable />
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="searchForm.eventType" placeholder="请选择" clearable>
            <el-option label="机务事件" value="maintenance" />
            <el-option label="运行事件" value="operation" />
            <el-option label="空防事件" value="security" />
            <el-option label="服务事件" value="service" />
          </el-select>
        </el-form-item>
        <el-form-item label="396事件">
          <el-select v-model="searchForm.is396Event" placeholder="请选择" clearable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="调查状态">
          <el-select v-model="searchForm.needInvestigation" placeholder="请选择" clearable>
            <el-option label="需要调查" :value="true" />
            <el-option label="无需调查" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="recordNumber" label="编号" width="120" />
      <el-table-column prop="occurDate" label="事发日期" width="100" />
      <el-table-column prop="occurTime" label="时间" width="100" />
      <el-table-column prop="flightNo" label="航班号" width="100" />
      <el-table-column prop="aircraftNo" label="飞机号" width="100" />
      <el-table-column prop="flightSegment" label="航段" width="120" />
      <el-table-column prop="occurPhase" label="事发阶段" width="120">
        <template #default="{ row }">
          {{ phaseMap[row.occurPhase] }}
        </template>
      </el-table-column>
      <el-table-column prop="controlArea" label="所在管制区" width="120" />
      <el-table-column prop="eventType" label="事件类型" width="120">
        <template #default="{ row }">
          {{ eventTypeMap[row.eventType] }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="事件经过" min-width="200" show-overflow-tooltip />
      <el-table-column prop="impact" label="产生影响" min-width="150" show-overflow-tooltip />
      <el-table-column prop="is396Event" label="396事件" width="90">
        <template #default="{ row }">
          <el-tag :type="row.is396Event ? 'danger' : 'info'">
            {{ row.is396Event ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="needInvestigation" label="调查状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.needInvestigation ? 'warning' : ''">
            {{ row.needInvestigation ? '需要调查' : '无需调查' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button 
            v-if="row.needInvestigation" 
            link 
            type="warning" 
            @click="handleInvestigate(row)"
          >调查</el-button>
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
      :title="dialogType === 'add' ? '新增强制报告' : '编辑强制报告'"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        class="report-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="航班号" prop="flightNo">
              <el-input v-model="formData.flightNo" placeholder="请输入航班号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="飞机号" prop="aircraftNo">
              <el-input v-model="formData.aircraftNo" placeholder="请输入飞机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事发日期" prop="occurDate">
              <el-date-picker
                v-model="formData.occurDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事发时间" prop="occurTime">
              <el-time-picker
                v-model="formData.occurTime"
                placeholder="选择时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航段" prop="flightSegment">
              <el-input v-model="formData.flightSegment" placeholder="请输入航段" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事发阶段" prop="occurPhase">
              <el-select v-model="formData.occurPhase" placeholder="请选择" style="width: 100%">
                <el-option label="起飞前" value="before_takeoff" />
                <el-option label="起飞" value="takeoff" />
                <el-option label="爬升" value="climb" />
                <el-option label="巡航" value="cruise" />
                <el-option label="下降" value="descent" />
                <el-option label="着陆" value="landing" />
                <el-option label="着陆后" value="after_landing" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在管制区" prop="controlArea">
              <el-input v-model="formData.controlArea" placeholder="请输入管制区" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件类型" prop="eventType">
              <el-select v-model="formData.eventType" placeholder="请选择" style="width: 100%">
                <el-option label="机务事件" value="maintenance" />
                <el-option label="运行事件" value="operation" />
                <el-option label="空防事件" value="security" />
                <el-option label="服务事件" value="service" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="396事件" prop="is396Event">
              <el-radio-group v-model="formData.is396Event">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调查状态" prop="needInvestigation">
              <el-radio-group v-model="formData.needInvestigation">
                <el-radio :label="true">需要调查</el-radio>
                <el-radio :label="false">无需调查</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="事件经过" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="4"
                placeholder="请详细描述事件经过"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产生影响" prop="impact">
              <el-input
                v-model="formData.impact"
                type="textarea"
                :rows="4"
                placeholder="请描述事件产生的影响"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="报告详情"
      width="60%"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="编号">{{ detailData.recordNumber }}</el-descriptions-item>
        <el-descriptions-item label="航班号">{{ detailData.flightNo }}</el-descriptions-item>
        <el-descriptions-item label="飞机号">{{ detailData.aircraftNo }}</el-descriptions-item>
        <el-descriptions-item label="事发日期">{{ detailData.occurDate }}</el-descriptions-item>
        <el-descriptions-item label="事发时间">{{ detailData.occurTime }}</el-descriptions-item>
        <el-descriptions-item label="航段">{{ detailData.flightSegment }}</el-descriptions-item>
        <el-descriptions-item label="事发阶段">{{ phaseMap[detailData.occurPhase] }}</el-descriptions-item>
        <el-descriptions-item label="所在管制区">{{ detailData.controlArea }}</el-descriptions-item>
        <el-descriptions-item label="事件类型">{{ eventTypeMap[detailData.eventType] }}</el-descriptions-item>
        <el-descriptions-item label="396事件">
          <el-tag :type="detailData.is396Event ? 'danger' : 'info'">
            {{ detailData.is396Event ? '是' : '否' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="调查状态">
          <el-tag :type="detailData.needInvestigation ? 'warning' : ''">
            {{ detailData.needInvestigation ? '需要调查' : '无需调查' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="事件经过" :span="2">{{ detailData.description }}</el-descriptions-item>
        <el-descriptions-item label="产生影响" :span="2">{{ detailData.impact }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 调查对话框 -->
    <el-dialog
      v-model="investigateVisible"
      title="事件调查"
      width="60%"
    >
      <el-form
        ref="investigateFormRef"
        :model="investigateForm"
        :rules="investigateRules"
        label-width="100px"
      >
        <el-form-item label="调查结论" prop="conclusion">
          <el-input
            v-model="investigateForm.conclusion"
            type="textarea"
            :rows="4"
            placeholder="请输入调查结论"
          />
        </el-form-item>
        <el-form-item label="处理建议" prop="suggestion">
          <el-input
            v-model="investigateForm.suggestion"
            type="textarea"
            :rows="4"
            placeholder="请输入处理建议"
          />
        </el-form-item>
        <el-form-item label="预防措施" prop="prevention">
          <el-input
            v-model="investigateForm.prevention"
            type="textarea"
            :rows="4"
            placeholder="请输入预防措施"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="investigateVisible = false">取消</el-button>
          <el-button type="primary" @click="submitInvestigation">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  recordNumber: '',
  flightNo: '',
  eventType: '',
  is396Event: '',
  needInvestigation: ''
})

// 表格数据
const tableData = ref([
  {
    recordNumber: 'MR202403001',
    occurDate: '2024-03-15',
    occurTime: '09:45',
    flightNo: 'DR6558',
    aircraftNo: 'B-1234',
    flightSegment: '曼德勒-芒市',
    occurPhase: 'takeoff',
    controlArea: '曼德勒机场',
    eventType: 'operation',
    description: '起飞滑跑阶段，发动机参数异常，机组执行中断起飞程序，安全返回机坪。',
    impact: '航班延误2小时，对后续航班运行造成影响。',
    is396Event: true,
    needInvestigation: true
  },
  {
    recordNumber: 'MR202403002',
    occurDate: '2024-03-14',
    occurTime: '15:20',
    flightNo: 'DR6569',
    aircraftNo: 'B-5678',
    flightSegment: '芒市-昆明',
    occurPhase: 'cruise',
    controlArea: '昆明管制区',
    eventType: 'maintenance',
    description: '巡航阶段，客舱高度警告，机组按程序处置后正常落地。',
    impact: '无重大影响，正常落地。',
    is396Event: false,
    needInvestigation: true
  },
  {
    recordNumber: 'MR202403003',
    occurDate: '2024-03-13',
    occurTime: '11:30',
    flightNo: 'DR6560',
    aircraftNo: 'B-9012',
    flightSegment: '昆明-腾冲',
    occurPhase: 'before_takeoff',
    controlArea: '昆明机场',
    eventType: 'security',
    description: '旅客登机过程中发现未经安检物品，立即启动安保程序处置。',
    impact: '航班延误45分钟。',
    is396Event: false,
    needInvestigation: false
  },
  {
    recordNumber: 'MR202403004',
    occurDate: '2024-03-12',
    occurTime: '16:15',
    flightNo: 'DR6571',
    aircraftNo: 'B-3456',
    flightSegment: '腾冲-丽江',
    occurPhase: 'landing',
    controlArea: '丽江机场',
    eventType: 'operation',
    description: '着陆过程中遭遇风切变，机组执行复飞程序后安全落地。',
    impact: '航班备降昆明，延误3小时。',
    is396Event: true,
    needInvestigation: true
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(4)

// 表单相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const formData = reactive({
  flightNo: '',
  aircraftNo: '',
  occurDate: '',
  occurTime: '',
  flightSegment: '',
  occurPhase: '',
  controlArea: '',
  eventType: '',
  is396Event: false,
  needInvestigation: false,
  description: '',
  impact: ''
})

const formRules = {
  flightNo: [{ required: true, message: '请输入航班号', trigger: 'blur' }],
  aircraftNo: [{ required: true, message: '请输入飞机号', trigger: 'blur' }],
  occurDate: [{ required: true, message: '请选择事发日期', trigger: 'change' }],
  occurTime: [{ required: true, message: '请选择事发时间', trigger: 'change' }],
  eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入事件经过', trigger: 'blur' }]
}

// 详情相关
const detailVisible = ref(false)
const detailData = ref({})

// 调查相关
const investigateVisible = ref(false)
const investigateFormRef = ref()
const investigateForm = reactive({
  conclusion: '',
  suggestion: '',
  prevention: ''
})

const investigateRules = {
  conclusion: [{ required: true, message: '请输入调查结论', trigger: 'blur' }],
  suggestion: [{ required: true, message: '请输入处理建议', trigger: 'blur' }],
  prevention: [{ required: true, message: '请输入预防措施', trigger: 'blur' }]
}

// 添加事发阶段的映射
const phaseMap: Record<string, string> = {
  'before_takeoff': '起飞前',
  'takeoff': '起飞',
  'climb': '爬升',
  'cruise': '巡航',
  'descent': '下降',
  'landing': '着陆',
  'after_landing': '着陆后'
}

// 添加事件类型的映射
const eventTypeMap: Record<string, string> = {
  'maintenance': '机务事件',
  'operation': '运行事件',
  'security': '空防事件',
  'service': '服务事件'
}

// 方法定义
const handleSearch = () => {
  // 实现搜索逻辑
}

const handleReset = () => {
  searchForm.recordNumber = ''
  searchForm.flightNo = ''
  searchForm.eventType = ''
  searchForm.is396Event = ''
  searchForm.needInvestigation = ''
}

const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleView = (row: any) => {
  detailData.value = row
  detailVisible.value = true
}

const handleInvestigate = (row: any) => {
  investigateForm.conclusion = ''
  investigateForm.suggestion = ''
  investigateForm.prevention = ''
  investigateVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
      dialogVisible.value = false
    }
  })
}

const submitInvestigation = async () => {
  if (!investigateFormRef.value) return
  await investigateFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现调查提交逻辑
      ElMessage.success('调查报告提交成功')
      investigateVisible.value = false
    }
  })
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该报告？', '提示', {
      type: 'warning'
    })
    // 实现删除逻辑
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 重新加载数据
}

const resetForm = () => {
  formData.flightNo = ''
  formData.aircraftNo = ''
  formData.occurDate = ''
  formData.occurTime = ''
  formData.flightSegment = ''
  formData.occurPhase = ''
  formData.controlArea = ''
  formData.eventType = ''
  formData.is396Event = false
  formData.needInvestigation = false
  formData.description = ''
  formData.impact = ''
}
</script>

<style scoped>
.mandatory-report {
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.report-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-descriptions__label) {
  width: 120px;
  justify-content: flex-end;
}
</style> 