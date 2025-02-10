<template>
  <el-dialog
      title="查看审核详情"
      v-model="dialogVisible"
      width="60%"
  >
    <div class="detail-content">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="审核编号">{{ data?.recordNumber }}</el-descriptions-item>
        <el-descriptions-item label="审核类型">{{ getAuditTypeName(data?.subType) }}</el-descriptions-item>

        <el-descriptions-item label="检查项目">{{ data?.checkProject }}</el-descriptions-item>
        <el-descriptions-item label="实施部门">{{ getDepartmentText(data?.implementDept) }}</el-descriptions-item>

        <template v-if="data?.subType === 'daily'">
          <el-descriptions-item label="检查地点">{{ data?.checkLocation }}</el-descriptions-item>
        </template>

        <template v-else>
          <el-descriptions-item label="检查依据">{{ data?.checkBasis }}</el-descriptions-item>
        </template>

        <el-descriptions-item label="开始日期">{{ data?.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ data?.endDate }}</el-descriptions-item>

        <el-descriptions-item label="检查要点" :span="2">
          <div class="description-text">{{ data?.checkKeyPoints }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="检查情况" :span="2">
          <div class="description-text">{{ data?.checkSituation }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="检查结论" :span="2">
          <div class="description-text">{{ data?.checkConclusion }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="审核组成员" :span="2">
          <el-tag
              v-for="member in data?.auditTeamMembers"
              :key="member"
              class="member-tag"
          >
            {{ member }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(data?.status) as 'success' | 'warning' | 'info' | 'primary' | 'danger'">
            {{ data?.status }}
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
import type {TagType} from '@/types/element-plus'

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
const getAuditTypeName = (type: string) => {
  return type === 'daily' ? '日常检查' : '法定自查'
}

const getDepartmentText = (dept: string) => {
  const map: Record<string, string> = {
    'safety': '安全监察部',
    'operation': '运行部',
    'maintenance': '维修部'
  }
  return map[dept] || dept
}

const getStatusType = (status: string): TagType => {
  const map: Record<string, TagType> = {
    '待审核': 'warning',
    '审核中': 'primary',
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