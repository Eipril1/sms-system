<template>
  <div class="task-execution">
    <div class="execution-header">
      <div class="task-info">
        <div class="info-item">
          <span class="label">任务编号：</span>
          <span class="value">{{ task?.taskNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">自查类型：</span>
          <span class="value">{{ task?.checkType }}</span>
        </div>
        <div class="info-item">
          <span class="label">责任部门：</span>
          <span class="value">{{ task?.department }}</span>
        </div>
        <div class="info-item">
          <span class="label">检查组：</span>
          <span class="value">{{ task?.checkTeam?.join('、') }}</span>
        </div>
      </div>
      <div class="task-progress">
        <el-progress 
          type="circle" 
          :percentage="progress" 
          :status="progress >= 100 ? 'success' : ''"
        >
          <template #default>
            <div class="progress-info">
              <div class="progress-text">完成进度</div>
              <div class="progress-value">{{ progress }}%</div>
            </div>
          </template>
        </el-progress>
      </div>
    </div>

    <!-- 检查项列表 -->
    <div class="check-items">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部" name="all">
          <div class="items-filter">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索检查内容"
              clearable
              style="width: 200px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="resultFilter" clearable placeholder="检查结果" style="width: 120px">
              <el-option label="符合" value="符合" />
              <el-option label="不符合" value="不符合" />
              <el-option label="部分符合" value="部分符合" />
              <el-option label="不适用" value="不适用" />
            </el-select>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待检查" name="pending" />
        <el-tab-pane label="已完成" name="completed" />
        <el-tab-pane label="问题项" name="issues" />
        <el-tab-pane label="历史记录" name="history">
          <div class="history-list">
            <el-timeline>
              <el-timeline-item
                v-for="record in historyRecords"
                :key="record.id"
                :timestamp="record.time"
                :type="getHistoryType(record.type)"
              >
                <div class="history-item">
                  <div class="history-content">
                    <span class="history-title">{{ record.title }}</span>
                    <div class="history-detail" v-if="record.detail">
                      {{ record.detail }}
                    </div>
                    <div class="history-changes" v-if="record.changes?.length">
                      <div 
                        v-for="(change, index) in record.changes" 
                        :key="index"
                        class="change-item"
                      >
                        <span class="change-label">{{ change.label }}：</span>
                        <span class="change-from">{{ change.from }}</span>
                        <el-icon><ArrowRight /></el-icon>
                        <span class="change-to">{{ change.to }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="history-operator">
                    <el-avatar :size="24" :src="record.operator.avatar">
                      {{ record.operator.name.substring(0, 1) }}
                    </el-avatar>
                    <span class="operator-name">{{ record.operator.name }}</span>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
        <el-tab-pane label="问题跟踪" name="tracking">
          <div class="tracking-header">
            <div class="tracking-stats">
              <el-card class="stat-card">
                <template #header>
                  <div class="card-header">
                    <span>问题统计</span>
                  </div>
                </template>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div class="stat-item">
                      <div class="stat-value">{{ issueStats.total }}</div>
                      <div class="stat-label">问题总数</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="stat-item warning">
                      <div class="stat-value">{{ issueStats.pending }}</div>
                      <div class="stat-label">待整改</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="stat-item success">
                      <div class="stat-value">{{ issueStats.completed }}</div>
                      <div class="stat-label">已完成</div>
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </div>

            <el-table :data="issueList" style="width: 100%; margin-top: 20px;">
              <el-table-column type="expand">
                <template #default="{ row }">
                  <div class="issue-detail">
                    <div class="detail-section">
                      <h4>问题描述</h4>
                      <p>{{ row.findings }}</p>
                    </div>
                    <div class="detail-section">
                      <h4>整改措施</h4>
                      <p>{{ row.measures }}</p>
                    </div>
                    <div class="detail-section">
                      <h4>整改进度</h4>
                      <div class="rectification-progress">
                        <el-steps :active="row.currentStep" finish-status="success">
                          <el-step 
                            v-for="(step, index) in row.steps" 
                            :key="index"
                            :title="step.title"
                            :description="step.time"
                          />
                        </el-steps>
                      </div>
                    </div>
                    <div class="detail-section">
                      <h4>整改记录</h4>
                      <el-timeline>
                        <el-timeline-item
                          v-for="record in row.records"
                          :key="record.id"
                          :timestamp="record.time"
                          :type="record.status === 'success' ? 'success' : 'primary'"
                        >
                          <div class="record-content">
                            <div class="record-title">{{ record.title }}</div>
                            <div class="record-detail">{{ record.content }}</div>
                            <div class="record-attachments" v-if="record.attachments?.length">
                              <el-link 
                                v-for="file in record.attachments"
                                :key="file.name"
                                type="primary"
                                :href="file.url"
                                target="_blank"
                              >
                                <el-icon><Document /></el-icon>
                                {{ file.name }}
                              </el-link>
                            </div>
                          </div>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
              <el-table-column prop="result" label="检查结果" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row)">{{ row.result }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="整改状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getRectificationStatus(row.status)">
                    {{ getRectificationText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="{ row }">
                  <el-button 
                    link 
                    type="primary"
                    @click="handleUpdateProgress(row)"
                  >
                    更新进度
                  </el-button>
                  <el-button 
                    link 
                    type="success"
                    @click="handleVerify(row)"
                    :disabled="row.status !== 'rectified'"
                  >
                    验证确认
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-table :data="filteredItems" style="width: 100%">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="item-detail">
              <div class="detail-row">
                <span class="detail-label">检查依据：</span>
                <span class="detail-value">{{ row.basis }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">检查方法：</span>
                <span class="detail-value">{{ row.method }}</span>
              </div>
              <div class="detail-row" v-if="row.result === '不符合' || row.result === '部分符合'">
                <span class="detail-label">发现问题：</span>
                <div class="detail-content">
                  <el-input
                    v-model="row.findings"
                    type="textarea"
                    :rows="2"
                    placeholder="请描述发现的问题"
                  />
                </div>
              </div>
              <div class="detail-row" v-if="row.result === '不符合' || row.result === '部分符合'">
                <span class="detail-label">整改措施：</span>
                <div class="detail-content">
                  <el-input
                    v-model="row.measures"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入整改措施"
                  />
                </div>
              </div>
              <div class="detail-row">
                <span class="detail-label">附件：</span>
                <div class="detail-content">
                  <el-upload
                    action="#"
                    :auto-upload="false"
                    :on-change="(file) => handleFileChange(file, row)"
                    :file-list="row.attachments || []"
                  >
                    <el-button type="primary" link>
                      <el-icon><Upload /></el-icon>上传附件
                    </el-button>
                  </el-upload>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
        <el-table-column prop="standard" label="检查标准" show-overflow-tooltip />
        <el-table-column label="检查结果" width="120">
          <template #default="{ row }">
            <el-select 
              v-model="row.result" 
              placeholder="请选择"
              @change="handleResultChange"
            >
              <el-option label="符合" value="符合" />
              <el-option label="不符合" value="不符合" />
              <el-option label="部分符合" value="部分符合" />
              <el-option label="不适用" value="不适用" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row)">
              {{ row.result ? '已完成' : '待检查' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 操作按钮 -->
    <div class="execution-footer">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button 
        type="success" 
        :disabled="progress < 100"
        @click="handleComplete"
      >
        完成检查
      </el-button>
    </div>

    <!-- 添加更新进度对话框 -->
    <el-dialog
      v-model="progressDialogVisible"
      title="更新整改进度"
      width="600px"
    >
      <el-form :model="progressForm" label-width="100px">
        <el-form-item label="当前进度">
          <el-input
            v-model="progressForm.content"
            type="textarea"
            :rows="3"
            placeholder="请输入整改进展情况"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            action="#"
            :auto-upload="false"
            :file-list="progressForm.attachments"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>上传附件
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="progressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProgress">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加整改任务分配对话框 -->
    <el-dialog
      v-model="assignDialogVisible"
      title="分配整改任务"
      width="600px"
    >
      <el-form :model="assignForm" :rules="assignRules" ref="assignFormRef" label-width="100px">
        <el-form-item label="责任人" prop="assignee">
          <el-select
            v-model="assignForm.assignee"
            placeholder="请选择责任人"
            style="width: 100%"
          >
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            >
              <div class="user-option">
                <el-avatar :size="24" :src="user.avatar">
                  {{ user.name.substring(0, 1) }}
                </el-avatar>
                <span>{{ user.name }}</span>
                <span class="user-dept">{{ user.department }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成期限" prop="deadline">
          <el-date-picker
            v-model="assignForm.deadline"
            type="datetime"
            placeholder="请选择完成期限"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input
            v-model="assignForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注说明"
          />
        </el-form-item>
        <el-form-item label="提醒设置">
          <el-checkbox-group v-model="assignForm.reminders">
            <el-checkbox label="start">任务开始时</el-checkbox>
            <el-checkbox label="beforeDay">到期前1天</el-checkbox>
            <el-checkbox label="beforeHour">到期前2小时</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssign">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Upload, ArrowRight, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  task: any
}>()

const emit = defineEmits(['cancel', 'save', 'complete'])

// 搜索和筛选
const searchKeyword = ref('')
const resultFilter = ref('')
const activeTab = ref('all')

// 计算完成进度
const progress = computed(() => {
  if (!props.task?.checkItems?.length) return 0
  const completed = props.task.checkItems.filter((item: any) => item.result).length
  return Math.round((completed / props.task.checkItems.length) * 100)
})

// 过滤检查项
const filteredItems = computed(() => {
  let items = props.task?.checkItems || []
  
  // 根据标签页筛选
  switch (activeTab.value) {
    case 'pending':
      items = items.filter((item: any) => !item.result)
      break
    case 'completed':
      items = items.filter((item: any) => item.result)
      break
    case 'issues':
      items = items.filter((item: any) => 
        item.result === '不符合' || item.result === '部分符合'
      )
      break
  }

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    items = items.filter((item: any) => 
      item.content.toLowerCase().includes(keyword) ||
      item.standard.toLowerCase().includes(keyword)
    )
  }

  // 结果筛选
  if (resultFilter.value) {
    items = items.filter((item: any) => item.result === resultFilter.value)
  }

  return items
})

// 获取状态类型
const getStatusType = (row: any) => {
  if (!row.result) return 'info'
  const map: Record<string, string> = {
    '符合': 'success',
    '不符合': 'danger',
    '部分符合': 'warning',
    '不适用': ''
  }
  return map[row.result] || ''
}

// 处理文件上传
const handleFileChange = (file: any, row: any) => {
  if (!row.attachments) {
    row.attachments = []
  }
  row.attachments.push(file)
}

// 处理结果变更
const handleResultChange = () => {
  emit('save', props.task)
}

// 保存检查结果
const handleSave = () => {
  emit('save', props.task)
  // 添加历史记录
  const completedCount = props.task.checkItems.filter((item: any) => item.result).length
  addHistory({
    type: 'update',
    title: '更新检查结果',
    detail: `完成${completedCount}项检查`,
    changes: props.task.checkItems
      .filter((item: any) => item.result)
      .map((item: any) => ({
        label: item.content,
        from: '待检查',
        to: item.result
      }))
  })
}

// 完成检查
const handleComplete = async () => {
  try {
    await ElMessageBox.confirm('确认完成本次检查？提交后将不能修改', '提示')
    emit('complete', props.task)
  } catch {
    // 取消操作
  }
}

// 历史记录数据
const historyRecords = ref([
  {
    id: 1,
    type: 'create',
    title: '创建任务',
    time: '2024-03-15 09:00:00',
    operator: {
      name: '张三',
      avatar: ''
    }
  },
  {
    id: 2,
    type: 'update',
    title: '更新检查结果',
    time: '2024-03-15 10:30:00',
    detail: '完成3项检查',
    changes: [
      {
        label: '检查项1',
        from: '待检查',
        to: '符合'
      },
      {
        label: '检查项2',
        from: '待检查',
        to: '不符合'
      }
    ],
    operator: {
      name: '李四',
      avatar: ''
    }
  },
  {
    id: 3,
    type: 'issue',
    title: '发现问题',
    time: '2024-03-15 11:00:00',
    detail: '发现2项不符合项，需要整改',
    operator: {
      name: '王五',
      avatar: ''
    }
  }
])

// 获取历史记录类型
const getHistoryType = (type: string) => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
    create: 'primary',
    update: 'success',
    issue: 'warning',
    complete: 'success'
  }
  return map[type] || 'info'
}

// 添加历史记录
const addHistory = (record: any) => {
  historyRecords.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleString(),
    operator: {
      name: '当前用户',
      avatar: ''
    },
    ...record
  })
}

// 问题统计
const issueStats = computed(() => {
  const total = props.task.checkItems.length
  const pending = props.task.checkItems.filter((item: any) => !item.result).length
  const completed = props.task.checkItems.filter((item: any) => item.result).length
  return {
    total,
    pending,
    completed
  }
})

// 问题列表
const issueList = ref([])

// 处理更新进度
const progressDialogVisible = ref(false)
const progressForm = ref({
  content: '',
  attachments: []
})

const handleUpdateProgress = (row: any) => {
  progressDialogVisible.value = true
}

const submitProgress = () => {
  // 处理进度更新逻辑
  progressDialogVisible.value = false
}

// 处理验证确认
const handleVerify = (row: any) => {
  // 处理验证逻辑
}

// 获取整改状态
const getRectificationStatus = (status: string) => {
  const map: Record<string, string> = {
    'pending': 'warning',
    'rectified': 'success',
    'unverified': 'info'
  }
  return map[status] || 'info'
}

// 获取整改文本
const getRectificationText = (status: string) => {
  const map: Record<string, string> = {
    'pending': '待整改',
    'rectified': '已完成',
    'unverified': '未验证'
  }
  return map[status] || '未知'
}

// 添加整改任务分配对话框
const assignDialogVisible = ref(false)
const assignForm = ref({
  assignee: '',
  deadline: '',
  remark: '',
  reminders: []
})
const assignRules = ref({
  assignee: [{ required: true, message: '请选择责任人', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择完成期限', trigger: 'change' }],
  remark: [{ required: true, message: '请输入备注说明', trigger: 'blur' }],
  reminders: [{ type: 'array', required: true, message: '请选择提醒设置', trigger: 'change' }]
})
const userOptions = ref([
  { id: 1, name: '张三', avatar: '', department: '部门1' },
  { id: 2, name: '李四', avatar: '', department: '部门2' },
  { id: 3, name: '王五', avatar: '', department: '部门3' }
])
const assignFormRef = ref(null)

const submitAssign = () => {
  // 处理分配任务逻辑
  assignDialogVisible.value = false
}
</script>

<style scoped>
.task-execution {
  padding: 20px;
}

.execution-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.task-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
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

.progress-info {
  text-align: center;

  .progress-text {
    font-size: 12px;
    color: #909399;
  }

  .progress-value {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
  }
}

.check-items {
  margin-bottom: 24px;

  .items-filter {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
}

.item-detail {
  padding: 16px;
  background-color: #f5f7fa;

  .detail-row {
    display: flex;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .detail-label {
    width: 100px;
    color: #606266;
  }

  .detail-content {
    flex: 1;
  }
}

.execution-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.history-list {
  padding: 20px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.history-content {
  flex: 1;
  margin-right: 16px;
}

.history-title {
  font-weight: 500;
  color: #303133;
}

.history-detail {
  margin-top: 8px;
  color: #606266;
  font-size: 14px;
}

.history-changes {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ebeef5;
}

.change-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 13px;

  .change-label {
    color: #909399;
  }

  .change-from {
    color: #f56c6c;
  }

  .change-to {
    color: #67c23a;
  }

  .el-icon {
    color: #909399;
  }
}

.history-operator {
  display: flex;
  align-items: center;
  gap: 8px;

  .operator-name {
    font-size: 13px;
    color: #606266;
  }
}

:deep(.el-timeline-item__node--primary) {
  background-color: #409eff;
}

:deep(.el-timeline-item__node--success) {
  background-color: #67c23a;
}

:deep(.el-timeline-item__node--warning) {
  background-color: #e6a23c;
}

:deep(.el-timeline-item__node--danger) {
  background-color: #f56c6c;
}

.tracking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.tracking-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  width: 300px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;

  .card-header {
    font-weight: 500;
    color: #303133;
  }
}

.stat-item {
  text-align: center;

  .stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
  }

  .stat-label {
    font-size: 12px;
    color: #909399;
  }
}

.stat-item.warning {
  .stat-value {
    color: #e6a23c;
  }
}

.stat-item.success {
  .stat-value {
    color: #67c23a;
  }
}

.issue-detail {
  padding: 16px;
  background-color: #f5f7fa;

  .detail-section {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .detail-section h4 {
    font-weight: 500;
    color: #303133;
  }

  .detail-section p {
    margin-top: 8px;
    color: #606266;
    font-size: 14px;
  }
}

.rectification-progress {
  margin-top: 16px;
}

.rectification-progress .el-steps {
  margin-top: 8px;
}

.rectification-progress .el-step {
  width: 100%;
}

.rectification-progress .el-step .el-step__head {
  width: 100%;
}

.rectification-progress .el-step .el-step__tail {
  width: 100%;
}

.rectification-progress .el-step .el-step__title {
  font-size: 12px;
  color: #909399;
}

.rectification-progress .el-step .el-step__description {
  font-size: 12px;
  color: #909399;
}

.rectification-progress .el-step .el-step__icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
  width: 16px;
  height: 16px;
}

.rectification-progress .el-step .el-step__icon .el-icon {
</style> 
  height: 16px;
}

</style> 