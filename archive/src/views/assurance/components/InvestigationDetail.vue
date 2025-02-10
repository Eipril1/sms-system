<template>
  <el-dialog
      title="查看调查详情"
      v-model="dialogVisible"
      width="60%"
  >
    <div class="detail-content">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="调查编号">{{ data?.recordNumber }}</el-descriptions-item>
        <el-descriptions-item label="来源编号">{{ data?.sourceNumber }}</el-descriptions-item>

        <el-descriptions-item label="事件类型">{{ getEventTypeText(data?.eventType) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(data?.status)">{{ data?.status }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="开始日期">{{ data?.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ data?.endDate }}</el-descriptions-item>

        <el-descriptions-item label="调查方案" :span="2">
          <div class="description-text">{{ data?.investigationPlan }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="调查过程" :span="2">
          <div class="description-text">{{ data?.investigationProcess }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="调查结论" :span="2">
          <div class="description-text">{{ data?.investigationConclusion }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="调查组成员" :span="2">
          <el-tag
              v-for="member in data?.investigationTeam"
              :key="member"
              class="member-tag"
          >
            {{ member }}
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
const getEventTypeText = (type: string) => {
  const map: Record<string, string> = {
    'mechanical': '机械故障',
    'human': '人为差错',
    'weather': '天气影响',
    'other': '其他'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待调查': 'warning',
    '调查中': 'primary',
    '已完成': 'success',
    '已关闭': 'info'
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

.member-tag {
  margin-right: 8px;
  margin-bottom: 8px;
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