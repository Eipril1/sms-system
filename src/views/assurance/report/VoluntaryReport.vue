<template>
  <div class="voluntary-report">
    <!-- 搜索工具栏 -->
    <div class="toolbar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="信息编号">
          <el-input v-model="searchForm.recordNumber" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="searchForm.eventType" placeholder="请选择类型">
            <el-option label="运行事件" value="运行事件" />
            <el-option label="服务事件" value="服务事件" />
            <el-option label="机务事件" value="机务事件" />
            <el-option label="空防事件" value="空防事件" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理部门">
          <el-select v-model="searchForm.department" placeholder="请选择部门">
            <el-option label="飞行部" value="飞行部" />
            <el-option label="客舱部" value="客舱部" />
            <el-option label="机务部" value="机务部" />
            <el-option label="安保部" value="安保部" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <div class="action-buttons">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增报告
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column prop="recordNumber" label="信息编号" width="120" />
      <el-table-column prop="eventType" label="事件类型" width="100" />
      <el-table-column prop="description" label="事件描述" show-overflow-tooltip />
      <el-table-column prop="department" label="处理部门" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleView(row)">查看</el-button>
          <el-button 
            v-if="row.status === '待审核'" 
            type="success" 
            link 
            @click="handleReview(row)"
          >审核</el-button>
          <el-button 
            v-if="row.status === '待评估'" 
            type="warning" 
            link 
            @click="handleAssess(row)"
          >评估</el-button>
          <el-button 
            v-if="row.status === '待确认'" 
            type="info" 
            link 
            @click="handleConfirm(row)"
          >确认</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      title="信息审核"
      width="600px"
    >
      <el-form ref="reviewFormRef" :model="reviewForm" label-width="100px">
        <el-form-item label="处理部门" prop="department" required>
          <el-select v-model="reviewForm.department">
            <el-option label="飞行部" value="飞行部" />
            <el-option label="客舱部" value="客舱部" />
            <el-option label="机务部" value="机务部" />
            <el-option label="安保部" value="安保部" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="comment" required>
          <el-input
            v-model="reviewForm.comment"
            type="textarea"
            rows="3"
            placeholder="请输入审核意见"
          />
        </el-form-item>
        <el-form-item label="处理决定" required>
          <el-radio-group v-model="reviewForm.decision">
            <el-radio label="approve">流转评估</el-radio>
            <el-radio label="reject">退回修改</el-radio>
            <el-radio label="close">直接关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">确认</el-button>
      </template>
    </el-dialog>

    <!-- 评估对话框 -->
    <el-dialog
      v-model="assessDialogVisible"
      title="信息评估"
      width="600px"
    >
      <el-form ref="assessFormRef" :model="assessForm" label-width="100px">
        <el-form-item label="评估结果" required>
          <el-input
            v-model="assessForm.result"
            type="textarea"
            rows="3"
            placeholder="请输入评估结果"
          />
        </el-form-item>
        <el-form-item label="整改措施" required>
          <el-input
            v-model="assessForm.measures"
            type="textarea"
            rows="3"
            placeholder="请输入整改措施"
          />
        </el-form-item>
        <el-form-item label="完成时限" required>
          <el-date-picker
            v-model="assessForm.deadline"
            type="date"
            placeholder="请选择完成时限"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assessDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssess">确认</el-button>
      </template>
    </el-dialog>

    <!-- 确认对话框 -->
    <el-dialog
      v-model="confirmDialogVisible"
      title="整改确认"
      width="600px"
    >
      <el-form ref="confirmFormRef" :model="confirmForm" label-width="100px">
        <el-form-item label="确认结果" required>
          <el-radio-group v-model="confirmForm.result">
            <el-radio label="approve">通过关闭</el-radio>
            <el-radio label="reject">退回整改</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="确认意见" required>
          <el-input
            v-model="confirmForm.comment"
            type="textarea"
            rows="3"
            placeholder="请输入确认意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitConfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  recordNumber: '',
  eventType: '',
  department: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    recordNumber: 'VR-20240301-001',
    eventType: '运行事件',
    description: '落地后发现跑道出口标识不清',
    department: '飞行部',
    status: '待审核'
  },
  {
    recordNumber: 'VR-20240301-002',
    eventType: '服务事件',
    description: '客舱设备使用说明标识不规范',
    department: '客舱部',
    status: '待评估'
  }
])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

// 对话框控制
const reviewDialogVisible = ref(false)
const assessDialogVisible = ref(false)
const confirmDialogVisible = ref(false)

// 表单数据
const reviewForm = ref({
  department: '',
  comment: '',
  decision: 'approve'
})

const assessForm = ref({
  result: '',
  measures: '',
  deadline: ''
})

const confirmForm = ref({
  result: 'approve',
  comment: ''
})

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待审核': 'warning',
    '待评估': 'primary',
    '待确认': 'info',
    '已关闭': 'success',
    '已退回': 'danger'
  }
  return map[status] || 'info'
}

// 搜索方法
const handleSearch = () => {
  loading.value = true
  // 实现搜索逻辑
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const resetSearch = () => {
  searchForm.recordNumber = ''
  searchForm.eventType = ''
  searchForm.department = ''
  handleSearch()
}

// 新增报告
const handleAdd = () => {
  // 实现新增逻辑
}

// 查看详情
const handleView = (row: any) => {
  // 实现查看逻辑
}

// 审核处理
const handleReview = (row: any) => {
  reviewForm.value = {
    department: '',
    comment: '',
    decision: 'approve'
  }
  reviewDialogVisible.value = true
}

// 评估处理
const handleAssess = (row: any) => {
  assessForm.value = {
    result: '',
    measures: '',
    deadline: ''
  }
  assessDialogVisible.value = true
}

// 确认处理
const handleConfirm = (row: any) => {
  confirmForm.value = {
    result: 'approve',
    comment: ''
  }
  confirmDialogVisible.value = true
}

// 提交审核
const submitReview = async () => {
  try {
    if (!reviewForm.value.department && reviewForm.value.decision === 'approve') {
      ElMessage.warning('请选择处理部门')
      return
    }
    if (!reviewForm.value.comment) {
      ElMessage.warning('请输入审核意见')
      return
    }
    
    ElMessage.success('审核成功')
    reviewDialogVisible.value = false
    handleSearch()
  } catch (error) {
    ElMessage.error('审核失败')
  }
}

// 提交评估
const submitAssess = async () => {
  try {
    if (!assessForm.value.result || !assessForm.value.measures || !assessForm.value.deadline) {
      ElMessage.warning('请填写完整评估信息')
      return
    }
    
    ElMessage.success('评估成功')
    assessDialogVisible.value = false
    handleSearch()
  } catch (error) {
    ElMessage.error('评估失败')
  }
}

// 提交确认
const submitConfirm = async () => {
  try {
    if (!confirmForm.value.comment) {
      ElMessage.warning('请输入确认意见')
      return
    }
    
    ElMessage.success('确认成功')
    confirmDialogVisible.value = false
    handleSearch()
  } catch (error) {
    ElMessage.error('确认失败')
  }
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
</script>

<style scoped>
.voluntary-report {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 