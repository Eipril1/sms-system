<template>
  <el-dialog
    title="查看风险详情"
    v-model="dialogVisible"
    width="60%"
  >
    <div class="detail-content">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="风险编号">{{ data?.recordNumber }}</el-descriptions-item>
        <el-descriptions-item label="危险源编号">{{ data?.dangerSourceCode }}</el-descriptions-item>
        
        <el-descriptions-item label="危险源描述" :span="2">
          <div class="description-text">{{ data?.dangerSourceDesc }}</div>
        </el-descriptions-item>
        
        <el-descriptions-item label="是否重大危险源">
          <el-tag :type="data?.isMajorDanger ? 'danger' : 'info'">
            {{ data?.isMajorDanger ? '是' : '否' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="危险源来源">{{ data?.dangerSource }}</el-descriptions-item>
        
        <el-descriptions-item label="时态">{{ getTimeStateText(data?.timeState) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(data?.status)">{{ data?.status }}</el-tag>
        </el-descriptions-item>
        
        <el-descriptions-item label="管控措施" :span="2">
          <div class="description-text">{{ data?.controlMeasures }}</div>
        </el-descriptions-item>
        
        <el-descriptions-item label="应急预案" :span="2">
          <div class="description-text">{{ data?.emergencyPlan }}</div>
        </el-descriptions-item>
        
        <template v-if="data?.riskLevel">
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelType(data?.riskLevel)">{{ data?.riskLevel }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="可接受程度">{{ data?.acceptanceLevel }}</el-descriptions-item>
          
          <el-descriptions-item label="可能性">{{ data?.possibility }}</el-descriptions-item>
          <el-descriptions-item label="严重性">{{ data?.severity }}</el-descriptions-item>
        </template>
        
        <template v-if="data?.residualRiskLevel">
          <el-descriptions-item label="剩余风险等级">
            <el-tag :type="getRiskLevelType(data?.residualRiskLevel)">
              {{ data?.residualRiskLevel }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="剩余风险可接受程度">
            {{ data?.residualAcceptanceLevel }}
          </el-descriptions-item>
          
          <el-descriptions-item label="剩余风险可能性">{{ data?.residualPossibility }}</el-descriptions-item>
          <el-descriptions-item label="剩余风险严重性">{{ data?.residualSeverity }}</el-descriptions-item>
        </template>
      </el-descriptions>

      <!-- 附件列表 -->
      <div v-if="data?.attachments?.length" class="attachments-section">
        <div class="section-title">附件列表</div>
        <el-table :data="data.attachments" style="width: 100%">
          <el-table-column prop="name" label="文件名称" />
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
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

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
const getTimeStateText = (state: string) => {
  const map: Record<string, string> = {
    'past': '过去',
    'present': '现在',
    'future': '将来'
  }
  return map[state] || state
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待评估': 'warning',
    '评估中': 'primary',
    '已评估': 'success',
    '已关闭': 'info'
  }
  return map[status] || 'info'
}

const getRiskLevelType = (level: string) => {
  const map: Record<string, string> = {
    '高风险': 'danger',
    '中风险': 'warning',
    '低风险': 'success'
  }
  return map[level] || 'info'
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