// 信息报告的详情查看组件
<template>
  <el-dialog
      v-model="dialogVisible"
      title="报告详情"
      width="70%"
  >
    <div class="detail-content">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="报告编号">{{ data?.recordNumber }}</el-descriptions-item>
        <el-descriptions-item label="报告类型">
          {{ data?.recordType === 'forced_report' ? '强制报告' : '自愿报告' }}
        </el-descriptions-item>
        <el-descriptions-item label="事发日期">{{ data?.occurDate }}</el-descriptions-item>
        <el-descriptions-item label="事发时间">{{ data?.occurTime }}</el-descriptions-item>
        <el-descriptions-item label="航班号" v-if="data?.flightNo">{{ data?.flightNo }}</el-descriptions-item>
        <el-descriptions-item label="飞机号" v-if="data?.aircraftNo">{{ data?.aircraftNo }}</el-descriptions-item>
        <el-descriptions-item label="航段" v-if="data?.flightSegment">{{ data?.flightSegment }}</el-descriptions-item>
        <el-descriptions-item label="事发阶段" v-if="data?.occurPhase">{{ data?.occurPhase }}</el-descriptions-item>
        <el-descriptions-item label="事件类型">{{ data?.eventType }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(data?.status)">{{ data?.status }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div class="content-box">
        <h3>事件经过</h3>
        <p class="description-text">{{ data?.description }}</p>
      </div>

      <div class="content-box">
        <h3>产生影响</h3>
        <p class="description-text">{{ data?.impact }}</p>
      </div>

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

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待处理': 'warning',
    '处理中': 'primary',
    '已完成': 'success',
    '已关闭': 'info'
  }
  return map[status] || 'info'
}

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

.content-box {
  margin: 20px 0;
}

.description-text {
  white-space: pre-wrap;
  line-height: 1.5;
  color: #666;
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