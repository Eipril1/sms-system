<template>
  <div class="voluntary-report">
    <div class="page-header">
      <h2>自愿报告</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>新增报告
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="信息编号">
          <el-input v-model="searchForm.recordNumber" placeholder="请输入编号" clearable />
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="searchForm.eventType" placeholder="请选择类型" clearable>
            <el-option label="运行事件" value="运行事件" />
            <el-option label="服务事件" value="服务事件" />
            <el-option label="机务事件" value="机务事件" />
            <el-option label="空防事件" value="空防事件" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理部门">
          <el-select v-model="searchForm.handleDept" placeholder="请选择部门" clearable>
            <el-option label="飞行部" value="飞行部" />
            <el-option label="客舱部" value="客舱部" />
            <el-option label="机务部" value="机务部" />
            <el-option label="安保部" value="安保部" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option 
              v-for="(value, key) in STATUS" 
              :key="key"
              :label="value"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="recordNumber" label="信息编号" width="120" />
      <el-table-column prop="occurDate" label="事发日期" width="100" />
      <el-table-column prop="flightNo" label="航班号" width="100" />
      <el-table-column prop="eventType" label="事件类型" width="100" />
      <el-table-column prop="description" label="事件描述" show-overflow-tooltip />
      <el-table-column prop="hopeHandleDept" label="希望处理部门" width="120" />
      <el-table-column prop="distributeDept" label="实际处理部门" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <template v-if="row.status !== STATUS.CLOSED">
            <el-button 
              link 
              :type="getProcessButtonType(row.status)"
              @click="handleProcess(row)"
            >
              {{ getProcessButtonText(row.status) }}
            </el-button>
          </template>
          <template v-if="row.status === STATUS.CLOSED">
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
          <template v-if="canRevoke(row.status)">
            <el-button 
              link 
              type="warning" 
              @click="handleRevoke(row)"
            >
              撤回
            </el-button>
          </template>
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
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 统一的处理对话框 -->
    <el-dialog
      v-model="processDialogVisible"
      :title="getProcessDialogTitle(currentReport?.status)"
      width="900px"
    >
      <div class="process-container">
        <!-- 第一步:选择处理类型和填写表单 -->
        <div v-if="!isConfirmStep" class="process-form">
          <el-form
            ref="processFormRef"
            :model="processForm"
            :rules="processRules"
            label-width="100px"
          >
            <!-- 处理类型选择 -->
            <el-form-item label="处理类型" prop="type">
              <el-radio-group v-model="processForm.type">
                <el-radio 
                  v-for="option in getProcessOptions(currentReport?.status)"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 根据处理类型显示不同表单 -->
            <template v-if="processForm.type === 'valid'">
              <el-form-item label="处理意见" prop="comment">
                <el-input
                  v-model="processForm.comment"
                  type="textarea"
                  rows="3"
                  placeholder="请输入处理意见"
                />
              </el-form-item>
            </template>

            <template v-else-if="processForm.type === 'invalid'">
              <el-form-item label="无效原因" prop="invalidReason">
                <el-input
                  v-model="processForm.invalidReason"
                  type="textarea"
                  rows="3"
                  placeholder="请说明判定无效的原因"
                />
              </el-form-item>
            </template>

            <template v-else-if="processForm.type === 'distribute'">
              <el-form-item label="处理部门" prop="department">
                <el-select v-model="processForm.department" placeholder="请选择处理部门">
                  <el-option label="飞行部" value="飞行部" />
                  <el-option label="客舱部" value="客舱部" />
                  <el-option label="机务部" value="机务部" />
                  <el-option label="安保部" value="安保部" />
                  <el-option label="机场管理部" value="机场管理部" />
                </el-select>
              </el-form-item>
              <el-form-item label="处理要求" prop="comment">
                <el-input
                  v-model="processForm.comment"
                  type="textarea"
                  rows="3"
                  placeholder="请输入处理要求"
                />
              </el-form-item>
              <el-form-item label="处理期限" prop="deadline">
                <el-date-picker
                  v-model="processForm.deadline"
                  type="datetime"
                  placeholder="请选择处理期限"
                />
              </el-form-item>
            </template>

            <template v-else-if="processForm.type === 'approve'">
              <el-form-item label="评审意见" prop="auditComment">
                <el-input
                  v-model="processForm.auditComment"
                  type="textarea"
                  rows="3"
                  placeholder="请输入评审意见"
                />
              </el-form-item>
            </template>

            <template v-else-if="processForm.type === 'reject' || processForm.type === 'return'">
              <el-form-item label="退回原因" prop="returnReason">
                <el-input
                  v-model="processForm.returnReason"
                  type="textarea"
                  rows="3"
                  placeholder="请说明退回原因"
                />
              </el-form-item>
            </template>
          </el-form>
        </div>

        <!-- 第二步:确认信息和上传附件 -->
        <div v-else class="confirm-step">
          <!-- 确认信息展示 -->
          <div class="confirm-content">
            <el-alert
              :title="`您确定要${getProcessButtonText(processForm.type)}吗？`"
              type="warning"
              show-icon
            >
              <div class="confirm-details">
                <!-- 显示表单填写的内容 -->
                <template v-if="processForm.type === 'valid'">
                  <p>处理意见: {{ processForm.comment }}</p>
                </template>
                <template v-else-if="processForm.type === 'invalid'">
                  <p>无效原因: {{ processForm.invalidReason }}</p>
                </template>
                <template v-else-if="processForm.type === 'distribute'">
                  <p>处理部门: {{ processForm.department }}</p>
                  <p>处理要求: {{ processForm.comment }}</p>
                  <p>处理期限: {{ processForm.deadline }}</p>
                </template>
                <!-- 其他类型的确认信息... -->
              </div>
            </el-alert>
          </div>

          <!-- 附件上传 -->
          <div class="upload-section">
            <h4>上传附件</h4>
            <el-upload
              action="/api/upload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              multiple
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon>选择文件
              </el-button>
            </el-upload>
          </div>
        </div>

        <!-- 右侧流转记录 -->
        <div class="process-history">
          <div class="history-header">
            <el-icon><Timer /></el-icon>
            <span>流转记录</span>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="record in currentReport?.processRecords"
              :key="record.timestamp"
              :timestamp="record.timestamp"
              :type="getTimelineItemType(record.type)"
            >
              <div class="record-content">
                <h4>{{ getRecordTitle(record) }}</h4>
                <p class="record-info">
                  <span>操作人: {{ record.operator }}</span>
                  <span>部门: {{ record.department }}</span>
                </p>
                <p class="record-comment">{{ record.comment }}</p>
                <div v-if="record.attachments?.length" class="record-attachments">
                  <el-link
                    v-for="file in record.attachments"
                    :key="file"
                    type="primary"
                    :underline="false"
                    @click="handleDownload(file)"
                  >
                    <el-icon><Document /></el-icon>
                    {{ getFileName(file) }}
                  </el-link>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="processDialogVisible = false">取消</el-button>
          
          <!-- 第一步按钮 -->
          <template v-if="!isConfirmStep">
            <el-button 
              type="primary" 
              @click="handleNextStep"
              :disabled="!processForm.type || !isFormValid"
            >
              下一步
            </el-button>
          </template>
          
          <!-- 第二步按钮 -->
          <template v-else>
            <el-button @click="isConfirmStep = false">上一步</el-button>
            <el-button 
              type="primary" 
              @click="submitProcess"
            >
              确认{{ getProcessButtonText(processForm.type) }}
            </el-button>
          </template>
        </div>
      </template>
    </el-dialog>

    <!-- 退回对话框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="退回报告"
      width="600px"
    >
      <el-form
        ref="rejectFormRef"
        :model="rejectForm"
        :rules="rejectRules"
        label-width="100px"
      >
        <el-form-item label="退回原因" prop="reason">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            rows="3"
            placeholder="请输入退回原因"
          />
        </el-form-item>
        <el-form-item label="退回意见" prop="comment">
          <el-input
            v-model="rejectForm.comment"
            type="textarea"
            rows="3"
            placeholder="请输入退回意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReject">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加新增报告对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增自愿报告"
      width="600px"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addRules"
        label-width="100px"
      >
        <el-form-item label="事发日期" prop="occurDate">
          <el-date-picker
            v-model="addForm.occurDate"
            type="date"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="事发时间" prop="occurTime">
          <el-time-picker
            v-model="addForm.occurTime"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="航班号" prop="flightNo">
          <el-input v-model="addForm.flightNo" placeholder="请输入航班号" />
        </el-form-item>
        <el-form-item label="机号" prop="aircraftNo">
          <el-input v-model="addForm.aircraftNo" placeholder="请输入机号" />
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType">
          <el-select v-model="addForm.eventType" placeholder="请选择事件类型">
            <el-option label="运行事件" value="运行事件" />
            <el-option label="服务事件" value="服务事件" />
            <el-option label="机务事件" value="机务事件" />
            <el-option label="空防事件" value="空防事件" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件描述" prop="description">
          <el-input
            v-model="addForm.description"
            type="textarea"
            rows="3"
            placeholder="请输入事件描述"
          />
        </el-form-item>
        <el-form-item label="希望处理部门" prop="hopeHandleDept">
          <el-select v-model="addForm.hopeHandleDept" placeholder="请选择处理部门">
            <el-option label="飞行部" value="飞行部" />
            <el-option label="客舱部" value="客舱部" />
            <el-option label="机务部" value="机务部" />
            <el-option label="安保部" value="安保部" />
            <el-option label="机场管理部" value="机场管理部" />
          </el-select>
        </el-form-item>
        <el-form-item label="改进建议" prop="improvementMeasures">
          <el-input
            v-model="addForm.improvementMeasures"
            type="textarea"
            rows="3"
            placeholder="请输入改进建议"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            ref="uploadRef"
            :action="uploadUrl"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :on-exceed="handleExceed"
            :file-list="fileList"
            multiple
            :limit="5"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>上传附件
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持jpg、png、pdf格式文件，单个文件不超过10MB，最多上传5个文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">确定</el-button>
      </template>
    </el-dialog>

    <!-- 增加确认步骤的内容展示 -->
    <div v-if="isConfirmStep" class="confirm-content">
      <el-alert
        :title="`您确定要${getProcessButtonText(processForm.type)}吗？`"
        type="warning"
        show-icon
      >
        <div class="confirm-details">
          <template v-if="processForm.type === 'valid'">
            <p>处理意见: {{ processForm.comment }}</p>
          </template>
          <template v-else-if="processForm.type === 'invalid'">
            <p>无效原因: {{ processForm.invalidReason }}</p>
          </template>
          <template v-else-if="processForm.type === 'distribute'">
            <p>处理部门: {{ processForm.department }}</p>
            <p>处理要求: {{ processForm.comment }}</p>
            <p>处理期限: {{ processForm.deadline }}</p>
          </template>
          <!-- 其他类型的确认信息... -->
        </div>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { VoluntaryReport, ProcessRecord } from '@/types/info'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadUserFile, UploadRawFile } from 'element-plus'
import { Plus, Upload, Document, Timer } from '@element-plus/icons-vue'

// 添加当前报告的引用
const currentReport = ref<VoluntaryReport | null>(null)

// 添加表单引用
const processFormRef = ref()
const rejectFormRef = ref()
const reviewFormRef = ref()
const distributeFormRef = ref()
const confirmFormRef = ref()

// 添加上传文件列表引用
const uploadedFiles = ref<string[]>([])

// 搜索表单
const searchForm = reactive({
  recordNumber: '',
  eventType: '',
  handleDept: '',
  status: ''
})

// 表格数据
const tableData = ref<VoluntaryReport[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const formData = reactive({
  recordNumber: '',
  occurDate: '',
  flightNo: '',
  eventType: '',
  description: '',
  hopeHandleDept: '',
  improvementMeasures: ''
})

// 状态定义
const STATUS = {
  PENDING_REVIEW: '待审核',      // 初始状态
  PENDING_PROCESS: '待处理',     // 审核通过后
  PENDING_DISTRIBUTE: '待分发',  // 判定有效后
  PENDING_AUDIT: '待评审',      // 部门处理后
  CLOSED: '已关闭',            // 评审通过后
  INVALID: '无效报告',         // 判定无效后
  REJECTED: '已退回'           // 退回状态
} as const

type StatusType = typeof STATUS[keyof typeof STATUS]

// 对话框控制
const reviewDialogVisible = ref(false)
const distributeDialogVisible = ref(false)
const confirmDialogVisible = ref(false)
const processDialogVisible = ref(false)
const rejectDialogVisible = ref(false)

// 表单数据
const reviewForm = reactive({
  result: 'approve',
  comment: ''
})

const distributeForm = reactive({
  department: '',
  requirement: '',
  deadline: ''
})

const confirmForm = reactive({
  result: 'approve',
  comment: ''
})

const processForm = reactive({
  type: '' as 'distribute' | 'invalid' | 'approve' | 'return' | '',
  department: '',         // 处理部门
  invalidReason: '',      // 无效原因
  returnReason: '',       // 退回原因
  auditComment: '',       // 评审意见
  deadline: '',           // 处理期限
  attachments: [] as string[]
})

const rejectForm = reactive({
  reason: '',
  comment: ''
})

// 表单验证规则
const reviewRules = {
  comment: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
}

const distributeRules = {
  department: [{ required: true, message: '请选择处理部门', trigger: 'change' }],
  requirement: [{ required: true, message: '请输入处理要求', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择处理期限', trigger: 'change' }]
}

const confirmRules = {
  comment: [{ required: true, message: '请输入确认意见', trigger: 'blur' }]
}

const processRules = {
  type: [{ required: true, message: '请选择处理类型', trigger: 'change' }],
  department: [{ 
    required: true, 
    message: '请选择处理部门', 
    trigger: 'change',
    // 仅当类型为分发时必填
    validator: (rule: any, value: string) => {
      if (processForm.type === 'distribute' && !value) {
        return new Error('请选择处理部门')
      }
      return true
    }
  }],
  invalidReason: [{
    required: true,
    message: '请输入无效原因',
    trigger: 'blur',
    validator: (rule: any, value: string) => {
      if (processForm.type === 'invalid' && !value) {
        return new Error('请输入无效原因')
      }
      return true
    }
  }],
  returnReason: [{
    required: true,
    message: '请输入退回原因',
    trigger: 'blur',
    validator: (rule: any, value: string) => {
      if (processForm.type === 'return' && !value) {
        return new Error('请输入退回原因')
      }
      return true
    }
  }],
  auditComment: [{
    required: true,
    message: '请输入评审意见',
    trigger: 'blur',
    validator: (rule: any, value: string) => {
      if (processForm.type === 'approve' && !value) {
        return new Error('请输入评审意见')
      }
      return true
    }
  }]
}

const rejectRules = {
  reason: [{ required: true, message: '请输入退回原因', trigger: 'blur' }],
  comment: [{ required: true, message: '请输入退回意见', trigger: 'blur' }]
}

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    [STATUS.PENDING_REVIEW]: 'info',
    [STATUS.INVALID]: 'danger',
    [STATUS.PENDING_PROCESS]: 'warning',
    [STATUS.PENDING_AUDIT]: 'primary',
    [STATUS.CLOSED]: '',
    [STATUS.REJECTED]: 'danger'
  }
  return map[status] || 'info'
}

// 方法定义
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = mockData.filter(item => {
      const matchRecordNumber = !searchForm.recordNumber || 
        item.recordNumber.includes(searchForm.recordNumber)
      const matchEventType = !searchForm.eventType || 
        item.eventType === searchForm.eventType
      const matchDepartment = !searchForm.handleDept || 
        item.hopeHandleDept === searchForm.handleDept || 
        item.distributeDept === searchForm.handleDept
      const matchStatus = !searchForm.status || 
        item.status === searchForm.status
      
      return matchRecordNumber && matchEventType && matchDepartment && matchStatus
    })
    total.value = tableData.value.length
    loading.value = false
  }, 300)
}

const handleReset = () => {
  searchForm.recordNumber = ''
  searchForm.eventType = ''
  searchForm.handleDept = ''
  searchForm.status = ''
  handleSearch()
}

const showAddDialog = () => {
  addDialogVisible.value = true
  addForm.occurDate = ''
  addForm.occurTime = ''
  addForm.flightNo = ''
  addForm.aircraftNo = ''
  addForm.eventType = ''
  addForm.description = ''
  addForm.hopeHandleDept = ''
  addForm.improvementMeasures = ''
  addForm.attachments = []
  fileList.value = []
}

const handleEdit = (row: VoluntaryReport) => {
  // 这个方法可以删除，因为我们使用统一的处理对话框
}

const handleSubmit = async () => {
  // 这个方法可以删除，使用 submitProcess 替代
}

const handleDelete = async (row: VoluntaryReport) => {
  try {
    await ElMessageBox.confirm('确认删除该报告？删除后无法恢复', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    
    // 从模拟数据中删除
    const index = mockData.findIndex(item => item.recordNumber === row.recordNumber)
    if (index > -1) {
      mockData.splice(index, 1)
      ElMessage.success('删除成功')
      handleSearch()
    }
  } catch {
    // 取消删除
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

// 处理方法
const handleReview = (row: VoluntaryReport) => {
  reviewForm.result = 'approve'
  reviewForm.comment = ''
  reviewDialogVisible.value = true
}

const handleDistribute = (row: VoluntaryReport) => {
  distributeForm.department = row.hopeHandleDept
  distributeForm.requirement = ''
  distributeForm.deadline = ''
  distributeDialogVisible.value = true
}

const handleConfirm = (row: VoluntaryReport) => {
  confirmForm.result = 'approve'
  confirmForm.comment = ''
  confirmDialogVisible.value = true
}

// 提交方法
const submitReview = async () => {
  if (!reviewFormRef.value) return
  await reviewFormRef.value.validate()
  
  try {
    const newRecord: ProcessRecord = {
      timestamp: new Date().toISOString(),
      type: reviewForm.result === 'approve' ? 'review' : 'reject',
      operator: '当前用户名',
      department: '安全监察部',
      action: reviewForm.result === 'approve' ? '审核通过' : '退回',
      comment: reviewForm.comment,
      attachments: uploadedFiles.value
    }
    
    if (!currentReport.value) return
    
    currentReport.value.processRecords.unshift(newRecord)
    currentReport.value.status = reviewForm.result === 'approve' ? STATUS.PENDING_DISTRIBUTE : STATUS.REJECTED
    if (reviewForm.result === 'approve') {
      currentReport.value.distributeDept = reviewForm.department
    }
    
    ElMessage.success('审核提交成功')
    reviewDialogVisible.value = false
    handleSearch()
  } catch (error) {
    console.error(error)
    ElMessage.error('审核提交失败')
  }
}

const submitDistribute = async () => {
  if (!distributeFormRef.value) return
  await distributeFormRef.value.validate()
  try {
    // 实现分发提交逻辑
    ElMessage.success('分发成功')
    distributeDialogVisible.value = false
    handleSearch()
  } catch (error) {
    console.error(error)
    ElMessage.error('分发失败')
  }
}

const submitConfirm = async () => {
  if (!confirmFormRef.value) return
  await confirmFormRef.value.validate()
  try {
    // 实现确认提交逻辑
    ElMessage.success('确认提交成功')
    confirmDialogVisible.value = false
    handleSearch()
  } catch (error) {
    console.error(error)
    ElMessage.error('确认提交失败')
  }
}

const handleProcess = (row: VoluntaryReport) => {
  console.log('处理报告:', row) // 调试日志
  currentReport.value = row
  processDialogVisible.value = true
  isViewMode.value = false
  isConfirmStep.value = false
  
  // 清空表单
  Object.assign(processForm, {
    type: '',
    department: '',
    invalidReason: '',
    returnReason: '',
    auditComment: '',
    deadline: '',
    comment: '',
    attachments: []
  })
}

const handleReject = (row: VoluntaryReport) => {
  currentReport.value = row
  rejectDialogVisible.value = true
}

const submitProcess = async () => {
  if (!processFormRef.value || !currentReport.value) return
  await processFormRef.value.validate()
  
  try {
    const newRecord: ProcessRecord = {
      timestamp: new Date().toISOString(),
      type: processForm.type,
      operator: '当前用户',
      department: '安全监察部',
      action: getProcessAction(processForm.type),
      comment: getProcessComment(),
      attachments: processForm.attachments
    }

    // 根据处理类型更新报告状态
    switch(processForm.type) {
      case 'valid':
        currentReport.value.status = STATUS.PENDING_PROCESS
        currentReport.value.isEffective = true
        break
      case 'invalid':
        currentReport.value.status = STATUS.INVALID
        currentReport.value.isEffective = false
        break
      case 'distribute':
        currentReport.value.status = STATUS.PENDING_AUDIT
        currentReport.value.distributeDept = processForm.department
        break
      case 'return':
        currentReport.value.status = STATUS.PENDING_REVIEW
        break
      case 'approve':
        currentReport.value.status = STATUS.CLOSED
        currentReport.value.isEffective = true
        break
      case 'reject':
        currentReport.value.status = STATUS.PENDING_PROCESS
        break
    }

    currentReport.value.processRecords.unshift(newRecord)
    
    ElMessage.success('处理成功')
    processDialogVisible.value = false
    handleSearch()
  } catch (error) {
    console.error(error)
    ElMessage.error('处理失败')
  }
}

const submitReject = async () => {
  if (!rejectFormRef.value) return
  await rejectFormRef.value.validate()
  
  try {
    // 添加退回记录
    const newRecord: ProcessRecord = {
      timestamp: new Date().toISOString(),
      type: 'reject',
      operator: '当前用户名',
      department: '当前部门',
      action: '退回',
      comment: rejectForm.comment
    }
    
    currentReport.value.processRecords.unshift(newRecord)
    currentReport.value.status = STATUS.REJECTED
    
    ElMessage.success('退回成功')
    rejectDialogVisible.value = false
    handleSearch()
  } catch (error) {
    console.error(error)
    ElMessage.error('退回失败')
  }
}

// 获取下一个状态
const getNextStatus = (type: string) => {
  const map: Record<string, string> = {
    approve: STATUS.PENDING_DISTRIBUTE,
    distribute: STATUS.PENDING_PROCESS,
    process: STATUS.PENDING_CONFIRM,
    confirm: STATUS.CLOSED,
    reject: STATUS.REJECTED
  }
  return map[type] || STATUS.DRAFT
}

// 模拟数据
const mockData: VoluntaryReport[] = [
  {
    recordNumber: 'VR202403001',
    occurDate: '2024-03-18',
    occurTime: '09:30',
    flightNo: 'DR1234',
    aircraftNo: 'B-1234',
    eventType: '运行事件',
    description: '落地后发现跑道出口标识不清晰，建议加强维护',
    department: '飞行部',
    creator: '张三',
    createTime: '2024-03-18 10:00:00',
    status: STATUS.PENDING_REVIEW,
    hopeHandleDept: '机场管理部',
    improvementMeasures: '建议与机场方沟通，及时修复和维护跑道标识',
    isDistributed: false,
    isFeedback: false,
    processRecords: [
      {
        timestamp: '2024-03-18 10:00:00',
        type: 'review',
        operator: '张三',
        department: '飞行部',
        action: '提交报告',
        comment: '请审核'
      }
    ]
  },
  {
    recordNumber: 'VR202403002',
    occurDate: '2024-03-19',
    occurTime: '14:20',
    flightNo: 'DR5678',
    aircraftNo: 'B-5678',
    eventType: '机务事件',
    description: '例行检查时发现货舱门密封条有轻微磨损',
    department: '机务部',
    creator: '李四',
    createTime: '2024-03-19 15:00:00',
    status: STATUS.PENDING_DISTRIBUTE,
    hopeHandleDept: '机务部',
    improvementMeasures: '建议更换新的密封条',
    isDistributed: false,
    isFeedback: false,
    processRecords: [
      {
        timestamp: '2024-03-19 15:30:00',
        type: 'review',
        operator: '李四',
        department: '安全监察部',
        action: '审核通过',
        comment: '同意分发到机务部处理'
      }
    ]
  },
  {
    recordNumber: 'VR202403003',
    occurDate: '2024-03-20',
    occurTime: '11:15',
    flightNo: 'DR9012',
    aircraftNo: 'B-9012',
    eventType: '服务事件',
    description: '客舱设备使用说明标识不规范',
    department: '客舱部',
    creator: '王五',
    createTime: '2024-03-20 12:00:00',
    status: STATUS.PENDING_PROCESS,
    hopeHandleDept: '客舱部',
    distributeDept: '客舱部',
    improvementMeasures: '更新客舱设备使用说明标识',
    isDistributed: true,
    isFeedback: false,
    processRecords: [
      {
        timestamp: '2024-03-20 12:00:00',
        type: 'process',
        operator: '王五',
        department: '客舱部',
        action: '处理完成',
        comment: '已更新客舱设备使用说明标识'
      }
    ]
  },
  {
    recordNumber: 'VR202403004',
    occurDate: '2024-03-21',
    occurTime: '16:45',
    flightNo: 'DR3456',
    aircraftNo: 'B-3456',
    eventType: '空防事件',
    description: '安检通道X光机显示屏存在闪烁现象',
    department: '安保部',
    creator: '赵六',
    createTime: '2024-03-21 17:00:00',
    status: STATUS.PENDING_CONFIRM,
    hopeHandleDept: '安保部',
    distributeDept: '安保部',
    improvementMeasures: '已联系厂家维修X光机显示屏',
    isDistributed: true,
    isEffective: true,
    analysis: '设备老化导致',
    controlMeasures: '定期检查维护',
    completionStatus: '已处理',
    isFeedback: true,
    processRecords: [
      {
        timestamp: '2024-03-21 17:00:00',
        type: 'process',
        operator: '赵六',
        department: '安保部',
        action: '处理完成',
        comment: '已联系厂家维修X光机显示屏'
      }
    ]
  },
  {
    recordNumber: 'VR202403005',
    occurDate: '2024-03-22',
    occurTime: '08:30',
    flightNo: 'DR7890',
    aircraftNo: 'B-7890',
    eventType: '运行事件',
    description: '机坪滑行引导线部分褪色',
    department: '飞行部',
    creator: '钱七',
    createTime: '2024-03-22 09:00:00',
    status: STATUS.CLOSED,
    hopeHandleDept: '机场管理部',
    distributeDept: '机场管理部',
    improvementMeasures: '已与机场协调重新喷涂引导线',
    isDistributed: true,
    isEffective: true,
    analysis: '日晒雨淋导致标线褪色',
    controlMeasures: '定期检查维护',
    completionStatus: '已完成',
    isFeedback: true,
    processRecords: [
      {
        timestamp: '2024-03-22 09:00:00',
        type: 'process',
        operator: '钱七',
        department: '飞行部',
        action: '处理完成',
        comment: '已与机场协调重新喷涂引导线'
      }
    ]
  }
]

// 在 setup 中调用初始化数据
handleSearch()

// 添加工具方法
const getTimelineItemType = (type: ProcessRecord['type']) => {
  const map: Record<ProcessRecord['type'], 'primary' | 'success' | 'warning' | 'danger'> = {
    review: 'primary',
    distribute: 'warning',
    process: 'primary',
    confirm: 'success',
    reject: 'danger'
  }
  return map[type]
}

const getRecordTitle = (record: ProcessRecord) => {
  const map: Record<ProcessRecord['type'], string> = {
    review: '审核',
    distribute: '分发',
    process: '处理',
    confirm: '确认',
    reject: '退回'
  }
  return `${map[record.type]}操作`
}

const getFileName = (path: string) => {
  return path.split('/').pop() || path
}

const getProcessDialogTitle = (status?: string) => {
  const map: Record<string, string> = {
    [STATUS.PENDING_REVIEW]: '报告审核',
    [STATUS.PENDING_DISTRIBUTE]: '报告分发',
    [STATUS.PENDING_PROCESS]: '报告处理',
    [STATUS.PENDING_CONFIRM]: '报告确认'
  }
  return map[status || ''] || '报告处理'
}

const getProcessOptions = (status?: string) => {
  console.log('current status:', status) // 调试日志
  
  switch(status) {
    case STATUS.PENDING_REVIEW:
      return [
        { label: '判定有效', value: 'valid' },
        { label: '判定无效', value: 'invalid' }
      ]
    case STATUS.PENDING_DISTRIBUTE:
      return [
        { label: '分发处理', value: 'distribute' },
        { label: '退回修改', value: 'return' }
      ]
    case STATUS.PENDING_AUDIT:
      return [
        { label: '评审通过', value: 'approve' },
        { label: '评审不通过', value: 'reject' }
      ]
    default:
      return []
  }
}

const getProcessButtonType = (status: string) => {
  const map: Record<string, 'primary' | 'success' | 'warning'> = {
    [STATUS.PENDING_REVIEW]: 'success',    // 审核
    [STATUS.PENDING_DISTRIBUTE]: 'warning', // 分发
    [STATUS.PENDING_PROCESS]: 'primary',    // 处理
    [STATUS.PENDING_CONFIRM]: 'success'     // 确认
  }
  return map[status] || 'primary'
}

const getProcessButtonText = (status: string) => {
  const map: Record<string, string> = {
    [STATUS.PENDING_REVIEW]: '审核',
    [STATUS.PENDING_DISTRIBUTE]: '分发',
    [STATUS.PENDING_PROCESS]: '处理',
    [STATUS.PENDING_AUDIT]: '评审'
  }
  return map[status] || '处理'
}

// 查看按钮
const handleView = (row: VoluntaryReport) => {
  currentReport.value = row
  processForm.type = ''
  processDialogVisible.value = true
  isViewMode.value = true
}

// 获取默认处理类型
const getDefaultProcessType = (status: string) => {
  const map: Record<string, string> = {
    [STATUS.PENDING_REVIEW]: 'approve',
    [STATUS.PENDING_DISTRIBUTE]: 'distribute',
    [STATUS.PENDING_PROCESS]: 'process',
    [STATUS.PENDING_CONFIRM]: 'confirm'
  }
  return map[status] || ''
}

// 添加视图模式控制
const isViewMode = ref(false)

// 添加处理动作描述方法
const getProcessAction = (type: string) => {
  const map: Record<string, string> = {
    approve: '审核通过',
    distribute: '分发处理',
    process: '处理完成',
    confirm: '确认完成',
    reject: '退回'
  }
  return map[type] || '处理'
}

// 添加新的响应式变量
const addDialogVisible = ref(false)
const addFormRef = ref()
const uploadRef = ref()
const fileList = ref<UploadUserFile[]>([])

// 新增表单数据
const addForm = reactive({
  occurDate: '',
  occurTime: '',
  flightNo: '',
  aircraftNo: '',
  eventType: '',
  description: '',
  hopeHandleDept: '',
  improvementMeasures: '',
  attachments: [] as string[]
})

// 新增表单验证规则
const addRules = {
  occurDate: [{ required: true, message: '请选择事发日期', trigger: 'change' }],
  eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入事件描述', trigger: 'blur' }],
  hopeHandleDept: [{ required: true, message: '请选择处理部门', trigger: 'change' }]
}

// 上传相关配置
const uploadUrl = '/api/upload' // 实际的上传地址
const maxFileSize = 10 * 1024 * 1024 // 10MB
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']

// 上传前验证
const beforeUpload = (file: UploadRawFile) => {
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('只能上传JPG/PNG/PDF格式文件!')
    return false
  }
  if (file.size > maxFileSize) {
    ElMessage.error('文件大小不能超过10MB!')
    return false
  }
  return true
}

// 上传成功回调
const handleUploadSuccess = (response: any, file: UploadUserFile) => {
  addForm.attachments.push(response.url)
  ElMessage.success('上传成功')
}

// 上传失败回调
const handleUploadError = () => {
  ElMessage.error('上传失败')
}

// 超出限制回调
const handleExceed = () => {
  ElMessage.warning('最多只能上传5个文件')
}

// 新增按钮点击
const submitAdd = async () => {
  if (!addFormRef.value) return
  await addFormRef.value.validate()
  
  try {
    const newReport: VoluntaryReport = {
      recordNumber: `VR${new Date().getTime()}`,
      occurDate: addForm.occurDate,
      occurTime: addForm.occurTime,
      flightNo: addForm.flightNo,
      aircraftNo: addForm.aircraftNo,
      eventType: addForm.eventType,
      description: addForm.description,
      department: '当前用户部门',
      creator: '当前用户',
      createTime: new Date().toISOString(),
      status: STATUS.PENDING_REVIEW,
      hopeHandleDept: addForm.hopeHandleDept,
      improvementMeasures: addForm.improvementMeasures,
      isDistributed: false,
      isFeedback: false,
      processRecords: [{
        timestamp: new Date().toISOString(),
        type: 'review',
        operator: '当前用户',
        department: '当前用户部门',
        action: '提交报告',
        comment: '请审核',
        attachments: addForm.attachments
      }]
    }
    
    // 添加到模拟数据中
    mockData.unshift(newReport)
    
    ElMessage.success('提交成功')
    addDialogVisible.value = false
    handleSearch()
  } catch (error) {
    console.error(error)
    ElMessage.error('提交失败')
  }
}

// 获取处理意见
const getProcessComment = () => {
  switch(processForm.type) {
    case 'distribute':
      return `分发至${processForm.department}处理，期限：${processForm.deadline}`
    case 'invalid':
      return `判定无效，原因：${processForm.invalidReason}`
    case 'approve':
      return `评审通过：${processForm.auditComment}`
    case 'return':
      return `退回处理：${processForm.returnReason}`
    default:
      return ''
  }
}

// 添加获取提交按钮文本的方法
const getSubmitButtonText = (type: string) => {
  const map: Record<string, string> = {
    'valid': '判定有效',
    'invalid': '判定无效',
    'distribute': '确认分发',
    'return': '确认退回',
    'approve': '确认通过',
    'reject': '确认不通过'
  }
  return map[type] || '提交'
}

// 添加确认步骤控制
const isConfirmStep = ref(false)

// 处理下一步
const handleNextStep = async () => {
  if (!processFormRef.value) return
  try {
    await processFormRef.value.validate()
    if (isFormValid.value) {
      isConfirmStep.value = true
    } else {
      ElMessage.warning('请填写完整信息')
    }
  } catch (error) {
    ElMessage.warning('请填写必填项')
  }
}

// 添加撤回相关的状态和方法
const canRevoke = (status: string) => {
  // 定义哪些状态可以撤回
  const revokableStatus = [
    STATUS.PENDING_PROCESS,  // 分发后可撤回
    STATUS.PENDING_AUDIT,    // 处理后可撤回
    STATUS.CLOSED           // 关闭后可撤回
  ]
  return revokableStatus.includes(status)
}

// 撤回操作
const handleRevoke = async (row: VoluntaryReport) => {
  try {
    await ElMessageBox.confirm(
      '撤回后将返回上一个处理状态，是否继续？',
      '撤回确认',
      {
        type: 'warning',
        confirmButtonText: '确认撤回',
        cancelButtonText: '取消'
      }
    )
    
    // 获取上一个状态
    const prevStatus = getPreviousStatus(row.status)
    
    // 添加撤回记录
    const newRecord: ProcessRecord = {
      timestamp: new Date().toISOString(),
      type: 'revoke',
      operator: '当前用户',
      department: '安全监察部',
      action: '撤回操作',
      comment: `从${row.status}撤回到${prevStatus}`
    }
    
    row.processRecords.unshift(newRecord)
    row.status = prevStatus
    
    ElMessage.success('撤回成功')
    handleSearch()
  } catch {
    // 取消撤回
  }
}

// 获取上一个状态
const getPreviousStatus = (currentStatus: string) => {
  const statusFlow = {
    [STATUS.PENDING_PROCESS]: STATUS.PENDING_REVIEW,   // 分发后撤回到待处理
    [STATUS.PENDING_AUDIT]: STATUS.PENDING_PROCESS,    // 处理后撤回到待分发
    [STATUS.CLOSED]: STATUS.PENDING_AUDIT             // 关闭后撤回到待评审
  }
  return statusFlow[currentStatus] || currentStatus
}

// 修改 ProcessRecord 类型
type ProcessRecordType = 'review' | 'distribute' | 'process' | 'confirm' | 'reject' | 'revoke'

// 添加表单验证状态
const isFormValid = computed(() => {
  if (!processForm.type) return false
  
  switch(processForm.type) {
    case 'valid':
      return !!processForm.comment
    case 'invalid':
      return !!processForm.invalidReason
    case 'distribute':
      return !!processForm.department && !!processForm.comment && !!processForm.deadline
    case 'approve':
      return !!processForm.auditComment
    case 'reject':
    case 'return':
      return !!processForm.returnReason
    default:
      return false
  }
})
</script>

<style scoped>
.voluntary-report {
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

.process-records {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}

.records-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  .el-icon {
    margin-right: 8px;
    font-size: 18px;
    color: #909399;
  }
}

.record-content {
  h4 {
    margin: 0 0 8px;
    font-size: 14px;
    color: #303133;
  }

  .record-info {
    font-size: 13px;
    color: #909399;
    margin-bottom: 8px;

    span {
      margin-right: 16px;
    }
  }

  .record-comment {
    color: #606266;
    margin-bottom: 8px;
  }

  .record-attachments {
    .el-link {
      margin-right: 16px;
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }
}

.process-container {
  display: flex;
  gap: 20px;
}

.process-form {
  flex: 1;
  padding-right: 20px;
  border-right: 1px solid #EBEEF5;
}

.process-history {
  flex: 1;
  max-height: 600px;
  overflow-y: auto;
}

.history-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  .el-icon {
    margin-right: 8px;
    font-size: 18px;
    color: #909399;
  }
}

.confirm-content {
  margin-top: 20px;
  padding: 20px;
  background-color: #FFF;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .confirm-details {
    p {
      margin: 0;
      font-size: 14px;
      color: #606266;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  .el-button {
    margin-left: 10px;
  }
}

.confirm-step {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;

  h4 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #303133;
  }
}
</style> 