<template>
  <div class="report-generator">
    <div class="report-header">
      <h2>{{ task.checkType }}自查报告</h2>
      <div class="report-meta">
        <div class="meta-item">
          <span class="label">任务编号：</span>
          <span class="value">{{ task.taskNo }}</span>
        </div>
        <div class="meta-item">
          <span class="label">检查时间：</span>
          <span class="value">{{ task.startTime }} 至 {{ task.endTime }}</span>
        </div>
        <div class="meta-item">
          <span class="label">责任部门：</span>
          <span class="value">{{ task.department }}</span>
        </div>
        <div class="meta-item">
          <span class="label">检查组成员：</span>
          <span class="value">{{ task.checkTeam?.join('、') }}</span>
        </div>
      </div>
    </div>

    <el-form :model="reportForm" label-width="100px" class="report-form">
      <el-form-item label="检查概述">
        <el-input
          v-model="reportForm.summary"
          type="textarea"
          :rows="4"
          placeholder="请输入本次检查的总体情况"
        />
      </el-form-item>

      <!-- 检查结果统计 -->
      <el-form-item label="检查结果">
        <div class="result-statistics">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ checkStats.total }}</div>
                <div class="stat-label">检查项总数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card success">
                <div class="stat-value">{{ checkStats.conformity }}</div>
                <div class="stat-label">符合项</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card danger">
                <div class="stat-value">{{ checkStats.nonConformity }}</div>
                <div class="stat-label">不符合项</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card warning">
                <div class="stat-value">{{ checkStats.partialConformity }}</div>
                <div class="stat-label">部分符合项</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form-item>

      <!-- 问题清单 -->
      <el-form-item label="发现的问题">
        <div class="issues-list">
          <div 
            v-for="(issue, index) in issuesList" 
            :key="index"
            class="issue-item"
          >
            <div class="issue-header">
              <span class="issue-no">问题 {{ index + 1 }}</span>
              <el-tag :type="getIssueType(issue.result)">{{ issue.result }}</el-tag>
            </div>
            <div class="issue-content">
              <div class="content-row">
                <span class="row-label">检查内容：</span>
                <span class="row-value">{{ issue.content }}</span>
              </div>
              <div class="content-row">
                <span class="row-label">检查标准：</span>
                <span class="row-value">{{ issue.standard }}</span>
              </div>
              <div class="content-row">
                <span class="row-label">问题描述：</span>
                <span class="row-value">{{ issue.findings }}</span>
              </div>
              <div class="content-row">
                <span class="row-label">整改措施：</span>
                <span class="row-value">{{ issue.measures }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="整改建议">
        <el-input
          v-model="reportForm.recommendations"
          type="textarea"
          :rows="4"
          placeholder="请输入整改建议"
        />
      </el-form-item>

      <el-form-item label="检查结论">
        <el-input
          v-model="reportForm.conclusion"
          type="textarea"
          :rows="4"
          placeholder="请输入检查结论"
        />
      </el-form-item>

      <el-form-item label="附件">
        <el-upload
          action="#"
          :auto-upload="false"
          :file-list="reportForm.attachments"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>添加附件
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <div class="report-actions">
      <el-button @click="templateDialogVisible = true">
        <el-icon><Document /></el-icon>选择模板
      </el-button>
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="handlePreview">预览</el-button>
      <el-button type="success" @click="handleGenerate">生成报告</el-button>
    </div>

    <el-dialog
      v-model="previewDialogVisible"
      title="报告预览"
      width="90%"
      :close-on-click-modal="false"
      fullscreen
      append-to-body
    >
      <report-preview
        v-if="reportData"
        :report="reportData"
        @close="previewDialogVisible = false"
      />
    </el-dialog>

    <el-dialog
      v-model="templateDialogVisible"
      title="选择报告模板"
      width="800px"
    >
      <report-template @select="handleSelectTemplate" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  task: any
}>()

const emit = defineEmits(['cancel', 'generate'])

// 报告表单
const reportForm = ref({
  summary: '',
  recommendations: '',
  conclusion: '',
  attachments: []
})

// 检查结果统计
const checkStats = computed(() => {
  const items = props.task?.checkItems || []
  return {
    total: items.length,
    conformity: items.filter(item => item.result === '符合').length,
    nonConformity: items.filter(item => item.result === '不符合').length,
    partialConformity: items.filter(item => item.result === '部分符合').length
  }
})

// 问题列表
const issuesList = computed(() => 
  props.task?.checkItems?.filter(item => 
    item.result === '不符合' || item.result === '部分符合'
  ) || []
)

// 获取问题类型
const getIssueType = (result: string) => {
  return result === '不符合' ? 'danger' : 'warning'
}

// 预览报告
const previewDialogVisible = ref(false)
const reportData = ref<any>(null)

const handlePreview = () => {
  reportData.value = {
    reportNo: `R${new Date().getTime()}`,
    task: props.task,
    ...reportForm.value,
    stats: checkStats.value,
    issues: issuesList.value
  }
  previewDialogVisible.value = true
}

// 生成报告
const approvalDialogVisible = ref(false)

const handleGenerate = async () => {
  const reportData = {
    reportNo: `R${new Date().getTime()}`,
    task: props.task,
    ...reportForm.value,
    stats: checkStats.value,
    issues: issuesList.value,
    status: 'draft'
  }
  
  try {
    await ElMessageBox.confirm('是否提交审批？', '提示', {
      confirmButtonText: '提交审批',
      cancelButtonText: '保存草稿'
    })
    reportData.status = 'submitted'
  } catch {
    // 保存为草稿
  }
  
  emit('generate', reportData)
}

// 处理审批状态更新
const handleApprovalUpdate = (data: any) => {
  // 更新报告状态
  reportData.value.status = data.status
}

// 模板选择对话框
const templateDialogVisible = ref(false)

// 模板选择
const handleSelectTemplate = (template: any) => {
  // 处理模板选择
}
</script>

<style scoped>
.report-generator {
  padding: 20px;
}

.report-header {
  text-align: center;
  margin-bottom: 32px;

  h2 {
    margin-bottom: 20px;
  }
}

.report-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  text-align: left;
  margin: 0 auto;
  max-width: 800px;
}

.meta-item {
  .label {
    color: #909399;
    margin-right: 8px;
  }

  .value {
    font-weight: 500;
  }
}

.report-form {
  max-width: 1000px;
  margin: 0 auto;
}

.result-statistics {
  .stat-card {
    text-align: center;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 4px;

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #409EFF;
    }

    .stat-label {
      margin-top: 8px;
      color: #606266;
    }

    &.success .stat-value {
      color: #67C23A;
    }

    &.danger .stat-value {
      color: #F56C6C;
    }

    &.warning .stat-value {
      color: #E6A23C;
    }
  }
}

.issues-list {
  .issue-item {
    margin-bottom: 16px;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.issue-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .issue-no {
    font-weight: 500;
    margin-right: 12px;
  }
}

.issue-content {
  .content-row {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .row-label {
      color: #909399;
      margin-right: 8px;
    }
  }
}

.report-actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style> 