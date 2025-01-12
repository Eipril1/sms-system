<template>
  <div class="voluntary-container">
    <!-- 搜索区域 -->
    <div class="search-area">
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
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="待分发" value="待分发" />
            <el-option label="已分发" value="已分发" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已关闭" value="已关闭" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 新增按钮 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        + 新增报告
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="flightSegment" label="航段" width="120" />
      <el-table-column prop="location" label="事发地" width="120" />
      <el-table-column prop="eventType" label="事件类型" width="120" />
      <el-table-column prop="department" label="希望处理部门" width="120" />
      <el-table-column prop="description" label="事件经过" show-overflow-tooltip />
      <el-table-column prop="improvements" label="改进措施" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleView(row)">查看</el-button>
          <!-- 根据不同状态显示不同的审批按钮 -->
          <template v-if="row.status === '待审核'">
            <el-button type="success" link @click="handleReview(row)">审核</el-button>
          </template>
          <template v-if="row.status === '待处理'">
            <el-button type="warning" link @click="handleProcess(row)">处理</el-button>
          </template>
          <template v-if="row.status === '待确认'">
            <el-button type="info" link @click="handleConfirm(row)">确认</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增报告' : '编辑报告'"
      width="800px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="航段" prop="flightSegment">
          <el-input v-model="form.flightSegment" placeholder="请输入航段" />
        </el-form-item>
        <el-form-item label="事发地" prop="location">
          <el-input v-model="form.location" placeholder="请输入事发地" />
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType">
          <el-select v-model="form.eventType" placeholder="请选择事件类型">
            <el-option label="运行事件" value="运行事件" />
            <el-option label="服务事件" value="服务事件" />
            <el-option label="机务事件" value="机务事件" />
            <el-option label="空防事件" value="空防事件" />
          </el-select>
        </el-form-item>
        <el-form-item label="希望处理部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择处理部门">
            <el-option label="飞行部" value="飞行部" />
            <el-option label="客舱部" value="客舱部" />
            <el-option label="机务部" value="机务部" />
            <el-option label="安保部" value="安保部" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件经过" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入事件经过"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      title="报告审核"
      width="600px"
    >
      <el-form ref="reviewFormRef" :model="reviewForm" :rules="reviewRules" label-width="100px">
        <el-form-item label="审核结果" required>
          <el-radio-group v-model="reviewForm.result">
            <el-radio label="distribute">分发处理</el-radio>
            <el-radio label="reject">退回修改</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item 
          label="处理部门" 
          prop="department" 
          v-if="reviewForm.result === 'distribute'"
          required
        >
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
            :rows="3"
            placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">确认</el-button>
      </template>
    </el-dialog>

    <!-- 处理对话框 -->
    <el-dialog
      v-model="processDialogVisible"
      title="处理反馈"
      width="600px"
    >
      <el-form ref="processFormRef" :model="processForm" :rules="processRules" label-width="100px">
        <el-form-item label="处理结果" prop="result" required>
          <el-input
            v-model="processForm.result"
            type="textarea"
            :rows="3"
            placeholder="请输入处理结果"
          />
        </el-form-item>
        <el-form-item label="改进措施" prop="improvements" required>
          <el-input
            v-model="processForm.improvements"
            type="textarea"
            :rows="3"
            placeholder="请输入改进措施"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProcess">确认</el-button>
      </template>
    </el-dialog>

    <!-- 确认对话框 -->
    <el-dialog
      v-model="confirmDialogVisible"
      title="确认处理"
      width="600px"
    >
      <el-form ref="confirmFormRef" :model="confirmForm" :rules="confirmRules" label-width="100px">
        <el-form-item label="确认结果" required>
          <el-radio-group v-model="confirmForm.result">
            <el-radio label="close">确认关闭</el-radio>
            <el-radio label="return">退回处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="确认意见" prop="comment" required>
          <el-input
            v-model="confirmForm.comment"
            type="textarea"
            :rows="3"
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
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 状态管理
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待审核': 'warning',
    '待处理': 'primary',
    '待确认': 'info',
    '已关闭': 'success',
    '已退回': 'danger'
  }
  return map[status] || 'info'
}

// 表单数据
const reviewForm = ref({
  result: 'distribute',
  department: '',
  comment: ''
})

const processForm = ref({
  result: '',
  improvements: ''
})

const confirmForm = ref({
  result: 'close',
  comment: ''
})

// 表单验证规则
const reviewRules = {
  department: [{ required: true, message: '请选择处理部门', trigger: 'change' }],
  comment: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
}

const processRules = {
  result: [{ required: true, message: '请输入处理结果', trigger: 'blur' }],
  improvements: [{ required: true, message: '请输入改进措施', trigger: 'blur' }]
}

const confirmRules = {
  comment: [{ required: true, message: '请输入确认意见', trigger: 'blur' }]
}

// 对话框显示控制
const reviewDialogVisible = ref(false)
const processDialogVisible = ref(false)
const confirmDialogVisible = ref(false)

// 处理方法
const handleReview = (row: any) => {
  reviewForm.value = {
    result: 'distribute',
    department: '',
    comment: ''
  }
  reviewDialogVisible.value = true
}

const handleProcess = (row: any) => {
  processForm.value = {
    result: '',
    improvements: ''
  }
  processDialogVisible.value = true
}

const handleConfirm = (row: any) => {
  confirmForm.value = {
    result: 'close',
    comment: ''
  }
  confirmDialogVisible.value = true
}

// 提交方法
const submitReview = async () => {
  if (!reviewFormRef.value) return
  
  await reviewFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 根据审核结果更新状态
      const newStatus = reviewForm.value.result === 'distribute' ? '待处理' : '已退回'
      // TODO: 调用API更新状态
      reviewDialogVisible.value = false
      ElMessage.success('审核完成')
      handleSearch() // 刷新列表
    }
  })
}

const submitProcess = async () => {
  if (!processFormRef.value) return
  
  await processFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 更新状态为待确认
      // TODO: 调用API更新状态和处理结果
      processDialogVisible.value = false
      ElMessage.success('处理完成')
      handleSearch() // 刷新列表
    }
  })
}

const submitConfirm = async () => {
  if (!confirmFormRef.value) return
  
  await confirmFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 根据确认结果更新状态
      const newStatus = confirmForm.value.result === 'close' ? '已关闭' : '待处理'
      // TODO: 调用API更新状态
      confirmDialogVisible.value = false
      ElMessage.success('确认完成')
      handleSearch() // 刷新列表
    }
  })
}
</script>

<style scoped>
.voluntary-container {
  padding: 20px;
}

.search-area {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 