<template>
  <div class="statutory-report">
    <div class="page-header">
      <h2>自查报告</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleArchive">
          <el-icon><Folder /></el-icon>归档管理
        </el-button>
        <el-button type="success" @click="handleStatistics">
          <el-icon><TrendCharts /></el-icon>统计分析
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="报告编号">
          <el-input 
            v-model="searchForm.reportNo" 
            placeholder="请输入报告编号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="自查类型">
          <el-cascader
            v-model="searchForm.category"
            :options="categoryOptions"
            :props="{
              checkStrictly: true,
              label: 'name',
              value: 'code'
            }"
            placeholder="请选择类型"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="报告状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="草稿" value="draft" />
            <el-option label="待审批" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 320px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 报告列表 -->
    <el-table 
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="reportNo" label="报告编号" width="140" />
      <el-table-column prop="title" label="报告标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="type" label="自查类型" width="120">
        <template #default="{ row }">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="责任部门" width="120" />
      <el-table-column prop="creator" label="生成人" width="100" />
      <el-table-column prop="createTime" label="生成时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button 
            v-if="row.status === 'draft'"
            link 
            type="primary" 
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button 
            v-if="row.status === 'draft'"
            link 
            type="success" 
            @click="handleSubmit(row)"
          >
            提交
          </el-button>
          <el-button 
            v-if="row.status === 'pending'"
            link 
            type="warning" 
            @click="handleApprove(row)"
          >
            审批
          </el-button>
          <el-button 
            v-if="row.status === 'approved'"
            link 
            type="primary" 
            @click="handleArchiveReport(row)"
          >
            归档
          </el-button>
          <el-button link type="primary" @click="handleDownload(row)">
            下载
          </el-button>
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
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 报告预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="报告预览"
      width="90%"
      :close-on-click-modal="false"
      fullscreen
      append-to-body
    >
      <report-preview
        v-if="currentReport"
        :report="currentReport"
        @close="previewDialogVisible = false"
      />
    </el-dialog>

    <!-- 审批对话框 -->
    <el-dialog
      v-model="approvalDialogVisible"
      title="报告审批"
      width="800px"
      :close-on-click-modal="false"
    >
      <report-approval
        v-if="currentReport"
        :report="currentReport"
        @update="handleApprovalUpdate"
        @close="approvalDialogVisible = false"
      />
    </el-dialog>

    <!-- 归档对话框 -->
    <el-dialog
      v-model="archiveDialogVisible"
      title="归档管理"
      width="90%"
      :close-on-click-modal="false"
    >
      <report-archive
        v-if="archiveDialogVisible"
        @close="archiveDialogVisible = false"
      />
    </el-dialog>

    <!-- 统计分析对话框 -->
    <el-dialog
      v-model="statisticsDialogVisible"
      title="统计分析"
      width="90%"
      :close-on-click-modal="false"
    >
      <archive-statistics
        v-if="statisticsDialogVisible"
        @close="statisticsDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, TrendCharts } from '@element-plus/icons-vue'
import ReportPreview from './components/ReportPreview.vue'
import ReportApproval from './components/ReportApproval.vue'
import ReportArchive from './components/ReportArchive.vue'
import ArchiveStatistics from './components/ArchiveStatistics.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  reportNo: '',
  category: '',
  status: '',
  dateRange: []
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

// 表格数据
const tableData = ref([
  {
    reportNo: 'R202403001',
    title: '2024年第一季度运行合格审定自查报告',
    type: '运行合格审定',
    department: '飞行部',
    creator: '张三',
    createTime: '2024-03-15 14:30:00',
    status: 'pending',
    checkTime: '2024-03-01 ~ 2024-03-10',
    leader: '李四',
    members: ['王五', '赵六', '钱七'],
    stats: {
      total: 120,
      pass: 108,
      fail: 12
    },
    issues: [
      {
        level: 'high',
        standard: 'CCAR-121-R7 第121.133条',
        description: '飞行运行手册未及时更新，部分程序与实际运行不符',
        suggestion: '立即组织相关部门对手册进行全面评估和更新'
      },
      {
        level: 'normal',
        standard: 'CCAR-121-R7 第121.367条',
        description: '部分飞行记录单填写不规范，缺少必要信息',
        suggestion: '加强飞行记录管理培训，完善记录填写规范'
      }
    ],
    conclusion: '本次自查共发现12项不符合项，其中重大问题1项，一般问题11项。建议相关部门立即着手整改，并在30天内完成整改工作。'
  },
  {
    reportNo: 'R202403002',
    title: '2024年第一季度维修合格审定自查报告',
    type: '维修合格审定',
    department: '维修部',
    creator: '陈八',
    createTime: '2024-03-16 09:15:00',
    status: 'approved',
    checkTime: '2024-03-05 ~ 2024-03-15',
    leader: '孙九',
    members: ['周十', '吴一', '郑二'],
    stats: {
      total: 150,
      pass: 142,
      fail: 8
    },
    issues: [
      {
        level: 'normal',
        standard: 'CCAR-145-R4 第145.109条',
        description: '工具校验记录不完整，部分校验日期已过期',
        suggestion: '完善工具管理制度，确保按期校验'
      }
    ],
    conclusion: '本次自查整体情况良好，发现8项一般性问题，无重大问题。建议在下一季度重点关注工具管理和维修记录的规范性。'
  },
  {
    reportNo: 'R202403003',
    title: '2024年第一季度训练大纲自查报告',
    type: '训练大纲',
    department: '培训部',
    creator: '黄三',
    createTime: '2024-03-17 16:45:00',
    status: 'draft',
    checkTime: '2024-03-10 ~ 2024-03-17',
    leader: '刘四',
    members: ['张五', '李六'],
    stats: {
      total: 80,
      pass: 75,
      fail: 5
    },
    issues: [
      {
        level: 'high',
        standard: '训练大纲 7.3.2节',
        description: '复训课程时长不足，部分科目未按大纲要求完成',
        suggestion: '调整训练计划，确保训练时长符合要求'
      }
    ],
    conclusion: '训练执行总体符合要求，但在复训管理方面存在不足，需要加强管理和监督。'
  },
  {
    reportNo: 'R202403004',
    title: '2024年第一季度手册体系自查报告',
    type: '手册体系',
    department: '安全质量部',
    creator: '周七',
    createTime: '2024-03-18 10:20:00',
    status: 'rejected',
    checkTime: '2024-03-12 ~ 2024-03-18',
    leader: '吴八',
    members: ['郑九', '王十'],
    stats: {
      total: 100,
      pass: 90,
      fail: 10
    },
    issues: [
      {
        level: 'high',
        standard: 'SMS手册 4.2.3节',
        description: '风险管理程序未及时更新，不符合最新管理要求',
        suggestion: '修订风险管理程序，完善风险评估方法'
      }
    ],
    conclusion: '手册体系需要进行系统性更新，建议成立专项小组进行全面评估和修订。'
  },
  {
    reportNo: 'R202403005',
    title: '2024年第一季度运行规范自查报告',
    type: '运行合格审定',
    department: '运行控制部',
    creator: '赵一',
    createTime: '2024-03-19 14:00:00',
    status: 'archived',
    checkTime: '2024-03-15 ~ 2024-03-19',
    leader: '钱二',
    members: ['孙三', '李四', '周五'],
    stats: {
      total: 90,
      pass: 88,
      fail: 2
    },
    issues: [
      {
        level: 'normal',
        standard: 'CCAR-121-R7 第121.538条',
        description: '部分航线分析资料未及时更新',
        suggestion: '建立航线资料定期更新机制'
      }
    ],
    conclusion: '本次自查情况良好，仅发现2项一般性问题，建议继续保持现有管理水平。'
  }
])

// 对话框控制
const previewDialogVisible = ref(false)
const approvalDialogVisible = ref(false)
const archiveDialogVisible = ref(false)
const statisticsDialogVisible = ref(false)

// 当前操作的报告
const currentReport = ref(null)

// 分类选项
const categoryOptions = ref([
  {
    code: 'operation',
    name: '运行合格审定',
    children: [
      {
        code: 'operation_manual',
        name: '运行手册'
      },
      {
        code: 'operation_training',
        name: '训练大纲'
      }
    ]
  },
  {
    code: 'maintenance',
    name: '维修合格审定',
    children: [
      {
        code: 'maintenance_manual',
        name: '维修手册'
      },
      {
        code: 'maintenance_program',
        name: '维修方案'
      }
    ]
  }
])

// 状态相关方法
const getStatusType = (status: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    draft: 'info',
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    archived: 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    draft: '草稿',
    pending: '待审批',
    approved: '已通过',
    rejected: '已驳回',
    archived: '已归档'
  }
  return map[status] || status
}

// 搜索方法
const handleSearch = () => {
  loading.value = true
  // 实现搜索逻辑
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.reportNo = ''
  searchForm.category = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 分页方法
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

// 查看报告
const handleView = (row: any) => {
  currentReport.value = row
  previewDialogVisible.value = true
}

// 编辑报告
const handleEdit = (row: any) => {
  // 跳转到编辑页面，带上报告ID
  router.push({
    path: '/assurance/supervision/statutory/report/edit',
    query: { id: row.reportNo }
  })
}

// 提交审批
const handleSubmit = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '提交后报告将进入审批流程，是否确认提交？',
      '提示',
      {
        confirmButtonText: '确认提交',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 更新状态
    row.status = 'pending'
    ElMessage.success('报告已提交审批')
  } catch {
    // 取消操作
  }
}

// 审批报告
const handleApprove = (row: any) => {
  currentReport.value = row
  approvalDialogVisible.value = true
}

// 审批状态更新
const handleApprovalUpdate = (data: any) => {
  const { reportNo, status, comment } = data
  const report = tableData.value.find(item => item.reportNo === reportNo)
  if (report) {
    report.status = status
    report.approvalComment = comment
    
    // 显示对应的提示信息
    const messageMap = {
      approved: '报告已通过审批',
      rejected: '报告已被驳回'
    }
    ElMessage.success(messageMap[status] || '审批状态已更新')
  }
  approvalDialogVisible.value = false
}

// 归档报告
const handleArchiveReport = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '归档后报告将无法修改，是否确认归档？',
      '提示',
      {
        confirmButtonText: '确认归档',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    row.status = 'archived'
    row.archiveTime = new Date().toISOString()
    ElMessage.success('报告已归档')
  } catch {
    // 取消操作
  }
}

// 下载报告
const handleDownload = async (row: any) => {
  try {
    loading.value = true
    // 这里可以调用后端API下载报告
    // 模拟下载延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 使用 ReportPreview 组件的导出功能
    const previewComponent = document.createElement('div')
    const { handleExportPDF } = new Vue({
      render: h => h(ReportPreview, { props: { report: row } })
    }).$mount(previewComponent)
    
    await handleExportPDF()
    ElMessage.success('报告下载成功')
  } catch (error) {
    ElMessage.error('下载失败，请重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 打开归档管理
const handleArchive = () => {
  archiveDialogVisible.value = true
}

// 打开统计分析
const handleStatistics = () => {
  statisticsDialogVisible.value = true
}

// 关闭对话框时的处理
const handleDialogClose = () => {
  currentReport.value = null
}

// 监听对话框关闭事件
watch([previewDialogVisible, approvalDialogVisible], () => {
  if (!previewDialogVisible.value && !approvalDialogVisible.value) {
    handleDialogClose()
  }
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.search-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 