<template>
  <el-dialog
      title="查看措施详情"
      v-model="dialogVisible"
      width="60%"
  >
    <div class="detail-content">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="措施编号">{{ data?.recordNumber }}</el-descriptions-item>
        <el-descriptions-item label="来源编号">{{ data?.sourceNumber }}</el-descriptions-item>

        <el-descriptions-item label="问题类型">{{ getProblemTypeText(data?.problemType) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(data?.status)">{{ data?.status }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="问题描述" :span="2">
          <div class="description-text">{{ data?.description }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="原因分析" :span="2">
          <div class="description-text">{{ data?.analysis }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="纠正措施" :span="2">
          <div class="description-text">{{ data?.controlMeasures }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="预防措施" :span="2">
          <div class="description-text">{{ data?.preventiveMeasures }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="验证标准" :span="2">
          <div class="description-text">{{ data?.verificationStandard }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="责任部门">
          {{ getDepartmentText(data?.responsibleDept) }}
        </el-descriptions-item>
        <el-descriptions-item label="责任分部">{{ data?.responsibleSubdept }}</el-descriptions-item>

        <el-descriptions-item label="经办人">{{ data?.handler }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ data?.handlerContact }}</el-descriptions-item>

        <el-descriptions-item label="计划完成时限">{{ data?.planCompleteTime }}</el-descriptions-item>
        <el-descriptions-item label="回复期限">{{ data?.deadline }}</el-descriptions-item>

        <el-descriptions-item label="验证结果" v-if="data?.verificationResult">
          <el-tag :type="getVerifyType(data?.verificationResult)">
            {{ data?.verificationResult }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="完成情况" v-if="data?.completionStatus">
          <el-tag :type="getCompletionType(data?.completionStatus)">
            {{ data?.completionStatus }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 附件列表 -->
      <div v-if="data?.attachments?.length" class="attachments-section">
        <div class="section-title">附件列表</div>
        <el-table :data="data.attachments" style="width: 100%">
          <el-table-column prop="name" label="文件名称"/>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button link type="primary" @click="downloadFile(row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {ElMessage} from 'element-plus'

interface Props {
  visible: boolean
  data?: any
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// 获取文本显示
const getProblemTypeText = (type: string) => {
  const map: Record<string, string> = {
    'quality': '质量问题',
    'safety': '安全隐患',
    'process': '流程缺陷',
    'other': '其他问题'
  }
  return map[type] || type
}

const getDepartmentText = (dept: string) => {
  const map: Record<string, string> = {
    'safety': '安全监察部',
    'operation': '运行部',
    'maintenance': '维修部'
  }
  return map[dept] || dept
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待处理': 'warning',
    '处理中': 'primary',
    '已完成': 'success',
    '已关闭': 'info'
  }
  return map[status] || 'info'
}

const getVerifyType = (result: string) => {
  const map: Record<string, string> = {
    '有效': 'success',
    '部分有效': 'warning',
    '无效': 'danger'
  }
  return map[result] || 'info'
}

const getCompletionType = (status: string) => {
  const map: Record<string, string> = {
    '已完成': 'success',
    '部分完成': 'warning',
    '未完成': 'danger'
  }
  return map[status] || 'info'
}

// 下载文件
const downloadFile = (file: any) => {
  if (file.url) {
    window.open(file.url)
  } else {
    ElMessage.warning('文件地址不存在')
  }
}
</script>

<style scoped>
.detail-content {
  padding: 20px;
}

.description-text {
  white-space: pre-wrap;
  line-height: 1.5;
}

.attachments-section {
  margin-top: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}
</style> 