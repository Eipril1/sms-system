<template>
  <div class="report-approval">
    <div class="approval-header">
      <h3>报告审批</h3>
      <div class="approval-status">
        <el-tag :type="getStatusType(report.status)">
          {{ getStatusText(report.status) }}
        </el-tag>
      </div>
    </div>

    <!-- 审批流程 -->
    <div class="approval-flow">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step 
          v-for="(step, index) in approvalSteps" 
          :key="index"
          :title="step.title"
          :description="step.role"
        >
          <template #icon>
            <el-avatar 
              v-if="step.approver"
              :size="24"
              :src="step.approver.avatar"
            >
              {{ step.approver.name.substring(0, 1) }}
            </el-avatar>
          </template>
        </el-step>
      </el-steps>
    </div>

    <!-- 审批记录 -->
    <div class="approval-records">
      <div class="records-title">审批记录</div>
      <el-timeline>
        <el-timeline-item
          v-for="record in approvalRecords"
          :key="record.id"
          :type="getRecordType(record.action)"
          :timestamp="record.time"
          :hollow="record.action === 'reject'"
        >
          <div class="record-content">
            <div class="record-header">
              <span class="operator">{{ record.operator.name }}</span>
              <span class="action">{{ getActionText(record.action) }}</span>
            </div>
            <div class="record-comment" v-if="record.comment">
              {{ record.comment }}
            </div>
            <div class="record-attachments" v-if="record.attachments?.length">
              <div 
                v-for="file in record.attachments"
                :key="file.name"
                class="attachment-item"
              >
                <el-link type="primary" :href="file.url" target="_blank">
                  <el-icon><Document /></el-icon>
                  {{ file.name }}
                </el-link>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 审批操作 -->
    <div class="approval-actions" v-if="canApprove">
      <el-form :model="approvalForm" ref="approvalFormRef">
        <el-form-item label="审批意见">
          <el-input
            v-model="approvalForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入审批意见"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            action="#"
            :auto-upload="false"
            :file-list="approvalForm.attachments"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>添加附件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleApprove">同意</el-button>
          <el-button type="danger" @click="handleReject">驳回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Document, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  report: any
}>()

const emit = defineEmits(['update'])

// 审批步骤
const approvalSteps = [
  { title: '提交报告', role: '检查组长' },
  { title: '部门审核', role: '部门负责人' },
  { title: '质量审核', role: '质量管理部' },
  { title: '最终审批', role: '分管领导' }
]

// 当前步骤
const activeStep = computed(() => {
  const statusMap: Record<string, number> = {
    'draft': 0,
    'submitted': 1,
    'dept_approved': 2,
    'quality_approved': 3,
    'approved': 4,
    'rejected': -1
  }
  return statusMap[props.report.status] || 0
})

// 审批记录
const approvalRecords = ref([
  {
    id: 1,
    operator: { name: '张三', avatar: '' },
    action: 'submit',
    time: '2024-03-15 10:00:00',
    comment: '提交审批'
  },
  {
    id: 2,
    operator: { name: '李四', avatar: '' },
    action: 'approve',
    time: '2024-03-15 11:00:00',
    comment: '部门审核通过'
  }
])

// 审批表单
const approvalForm = ref({
  comment: '',
  attachments: []
})

// 是否可以审批
const canApprove = computed(() => {
  // 根据当前用户角色和报告状态判断
  return true
})

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    'draft': 'info',
    'submitted': 'warning',
    'dept_approved': 'warning',
    'quality_approved': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'draft': '草稿',
    'submitted': '待部门审核',
    'dept_approved': '待质量审核',
    'quality_approved': '待最终审批',
    'approved': '已通过',
    'rejected': '已驳回'
  }
  return map[status] || '未知'
}

// 获取记录类型
const getRecordType = (action: string) => {
  return action === 'reject' ? 'danger' : 'primary'
}

// 获取操作文本
const getActionText = (action: string) => {
  const map: Record<string, string> = {
    'submit': '提交',
    'approve': '同意',
    'reject': '驳回'
  }
  return map[action] || action
}

// 同意
const handleApprove = async () => {
  try {
    await ElMessageBox.confirm('确认同意该报告？')
    // 添加审批记录
    approvalRecords.value.push({
      id: Date.now(),
      operator: { name: '当前用户', avatar: '' },
      action: 'approve',
      time: new Date().toLocaleString(),
      comment: approvalForm.value.comment,
      attachments: approvalForm.value.attachments
    })
    // 更新报告状态
    emit('update', { status: 'approved' })
    ElMessage.success('审批成功')
  } catch {
    // 取消操作
  }
}

// 驳回
const handleReject = async () => {
  try {
    await ElMessageBox.confirm('确认驳回该报告？')
    // 添加审批记录
    approvalRecords.value.push({
      id: Date.now(),
      operator: { name: '当前用户', avatar: '' },
      action: 'reject',
      time: new Date().toLocaleString(),
      comment: approvalForm.value.comment,
      attachments: approvalForm.value.attachments
    })
    // 更新报告状态
    emit('update', { status: 'rejected' })
    ElMessage.success('已驳回')
  } catch {
    // 取消操作
  }
}
</script>

<style scoped>
.report-approval {
  padding: 20px;
}

.approval-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h3 {
    margin: 0;
  }
}

.approval-flow {
  margin-bottom: 32px;
  padding: 24px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.approval-records {
  margin-bottom: 32px;

  .records-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
}

.record-content {
  .record-header {
    margin-bottom: 8px;

    .operator {
      font-weight: 500;
      margin-right: 8px;
    }

    .action {
      color: #909399;
    }
  }

  .record-comment {
    color: #606266;
    margin-bottom: 8px;
  }

  .attachment-item {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }

    .el-icon {
      margin-right: 4px;
    }
  }
}

.approval-actions {
  padding: 24px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style> 