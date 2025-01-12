<template>
  <div class="report-archive">
    <div class="archive-header">
      <div class="header-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索报告"
          clearable
          style="width: 200px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="typeFilter" clearable placeholder="报告类型">
          <el-option label="运行合格审定" value="运行合格审定" />
          <el-option label="维修管理" value="维修管理" />
          <el-option label="训练大纲" value="训练大纲" />
        </el-select>
        <el-select v-model="statusFilter" clearable placeholder="状态">
          <el-option label="已通过" value="approved" />
          <el-option label="已驳回" value="rejected" />
          <el-option label="已归档" value="archived" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleBatchArchive">
          <el-icon><Folder /></el-icon>批量归档
        </el-button>
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>导出
        </el-button>
      </div>
    </div>

    <!-- 报告列表 -->
    <el-table
      :data="filteredReports"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="reportNo" label="报告编号" width="180" />
      <el-table-column prop="title" label="报告标题" show-overflow-tooltip />
      <el-table-column prop="type" label="报告类型" width="120">
        <template #default="{ row }">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="责任部门" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button 
            link 
            type="primary" 
            @click="handleArchive(row)"
            v-if="row.status === 'approved' && !row.archived"
          >
            归档
          </el-button>
          <el-button link type="primary" @click="handleDownload(row)">
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 归档对话框 -->
    <el-dialog
      v-model="archiveDialogVisible"
      title="报告归档"
      width="500px"
    >
      <el-form :model="archiveForm" label-width="100px">
        <el-form-item label="归档类型" required>
          <el-select v-model="archiveForm.category" placeholder="请选择归档类型">
            <el-option label="自查报告" value="self_check" />
            <el-option label="整改报告" value="rectification" />
            <el-option label="验收报告" value="acceptance" />
          </el-select>
        </el-form-item>
        <el-form-item label="归档说明">
          <el-input
            v-model="archiveForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入归档说明"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
            v-for="tag in archiveForm.tags"
            :key="tag"
            closable
            @close="handleRemoveTag(tag)"
            style="margin-right: 8px"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="tagInputVisible"
            ref="tagInputRef"
            v-model="tagInputValue"
            class="tag-input"
            size="small"
            @keyup.enter="handleAddTag"
            @blur="handleAddTag"
          />
          <el-button v-else size="small" @click="showTagInput">
            + 添加标签
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="archiveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitArchive">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Search, Folder, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const dateRange = ref<[Date, Date] | null>(null)

// 报告列表
const reportList = ref([
  {
    reportNo: 'R202403150001',
    title: '2024年第一季度运行合格审定自查报告',
    type: '运行合格审定',
    department: '飞行部',
    createTime: '2024-03-15 10:00:00',
    status: 'approved',
    archived: false
  }
])

// 筛选后的报告列表
const filteredReports = computed(() => {
  let result = reportList.value

  if (searchKeyword.value) {
    result = result.filter(item => 
      item.title.includes(searchKeyword.value) ||
      item.reportNo.includes(searchKeyword.value)
    )
  }

  if (typeFilter.value) {
    result = result.filter(item => item.type === typeFilter.value)
  }

  if (statusFilter.value) {
    result = result.filter(item => item.status === statusFilter.value)
  }

  if (dateRange.value) {
    const [start, end] = dateRange.value
    result = result.filter(item => {
      const date = new Date(item.createTime)
      return date >= start && date <= end
    })
  }

  return result
})

// 选中的报告
const selectedReports = ref<any[]>([])
const handleSelectionChange = (selection: any[]) => {
  selectedReports.value = selection
}

// 归档相关
const archiveDialogVisible = ref(false)
const currentReport = ref<any>(null)
const archiveForm = ref({
  category: '',
  remark: '',
  tags: [] as string[]
})

// 标签输入
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref<HTMLInputElement>()

const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const handleAddTag = () => {
  if (tagInputValue.value) {
    if (!archiveForm.value.tags.includes(tagInputValue.value)) {
      archiveForm.value.tags.push(tagInputValue.value)
    }
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

const handleRemoveTag = (tag: string) => {
  archiveForm.value.tags = archiveForm.value.tags.filter(t => t !== tag)
}

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    'approved': 'success',
    'rejected': 'danger',
    'archived': 'info'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'approved': '已通过',
    'rejected': '已驳回',
    'archived': '已归档'
  }
  return map[status] || status
}

// 查看报告
const handleView = (row: any) => {
  // 实现查看功能
}

// 单个归档
const handleArchive = (row: any) => {
  currentReport.value = row
  archiveForm.value = {
    category: '',
    remark: '',
    tags: []
  }
  archiveDialogVisible.value = true
}

// 批量归档
const handleBatchArchive = () => {
  if (!selectedReports.value.length) {
    ElMessage.warning('请选择要归档的报告')
    return
  }

  const canArchive = selectedReports.value.every(
    report => report.status === 'approved' && !report.archived
  )
  if (!canArchive) {
    ElMessage.warning('选中的报告中包含不可归档的报告')
    return
  }

  currentReport.value = null
  archiveForm.value = {
    category: '',
    remark: '',
    tags: []
  }
  archiveDialogVisible.value = true
}

// 提交归档
const submitArchive = async () => {
  if (!archiveForm.value.category) {
    ElMessage.warning('请选择归档类型')
    return
  }

  try {
    if (currentReport.value) {
      // 单个归档
      currentReport.value.archived = true
      currentReport.value.status = 'archived'
    } else {
      // 批量归档
      selectedReports.value.forEach(report => {
        report.archived = true
        report.status = 'archived'
      })
    }

    archiveDialogVisible.value = false
    ElMessage.success('归档成功')
  } catch (error) {
    ElMessage.error('归档失败')
  }
}

// 导出报告
const handleExport = () => {
  // 实现导出功能
}

// 下载报告
const handleDownload = (row: any) => {
  // 实现下载功能
}
</script>

<style scoped>
.report-archive {
  padding: 20px;
}

.archive-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  gap: 16px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.tag-input {
  width: 100px;
  margin-left: 8px;
  vertical-align: bottom;
}
</style> 