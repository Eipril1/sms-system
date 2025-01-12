<template>
  <div class="voluntary-report">
    <!-- 顶部标签页 -->
    <div class="tab-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="自愿报告" name="voluntary">
          <el-icon><Edit /></el-icon>
        </el-tab-pane>
        <el-tab-pane label="强制报告" name="forced">
          <el-icon><Warning /></el-icon>
        </el-tab-pane>
      </el-tabs>
    </div>

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
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          <!-- 根据状态显示不同的按钮 -->
          <template v-if="row.status === '待分发'">
            <el-button type="success" link @click="handleDistribute(row)">分发</el-button>
            <el-button type="warning" link @click="handleReturn(row)">退回</el-button>
          </template>
          <template v-else-if="row.status === '已分发'">
            <el-button type="warning" link @click="handleAssess(row)">评估</el-button>
          </template>
          <template v-else-if="row.status === '待确认'">
            <el-button type="success" link @click="handleConfirm(row, 'approve')">确认通过</el-button>
            <el-button type="danger" link @click="handleConfirm(row, 'reject')">退回处理</el-button>
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

    <!-- 分发对话框 -->
    <el-dialog
      v-model="distributeDialogVisible"
      title="分发处理"
      width="600px"
    >
      <el-form ref="distributeFormRef" :model="distributeForm" :rules="distributeRules" label-width="100px">
        <el-form-item label="处理部门" prop="department" required>
          <el-select v-model="distributeForm.department">
            <el-option label="飞行部" value="飞行部" />
            <el-option label="客舱部" value="客舱部" />
            <el-option label="机务部" value="机务部" />
            <el-option label="安保部" value="安保部" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理要求" prop="requirement" required>
          <el-input
            v-model="distributeForm.requirement"
            type="textarea"
            :rows="3"
            placeholder="请输入处理要求"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="distributeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDistribute">确认</el-button>
      </template>
    </el-dialog>

    <!-- 评估对话框 -->
    <el-dialog
      v-model="assessDialogVisible"
      title="评估处理"
      width="600px"
    >
      <el-form ref="assessFormRef" :model="assessForm" :rules="assessRules" label-width="100px">
        <el-form-item label="评估结果" prop="result" required>
          <el-input
            v-model="assessForm.result"
            type="textarea"
            :rows="3"
            placeholder="请输入评估结果"
          />
        </el-form-item>
        <el-form-item label="改进措施" prop="improvements" required>
          <el-input
            v-model="assessForm.improvements"
            type="textarea"
            :rows="3"
            placeholder="请输入改进措施"
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
import type { FormInstance } from 'element-plus'

// 搜索表单
const searchForm = ref({
  recordNumber: '',
  eventType: '',
  department: '',
  status: ''
})

// 表格数据
const tableData = ref([
  {
    flightSegment: '芒市-昆明',
    location: '芒市',
    eventType: '运行事件',
    department: '飞行部',
    description: '落地后发现跑道出口标识不清',
    improvements: '建议机场方重新粉刷跑道标识',
    status: '待分发'
  },
  {
    flightSegment: '昆明-丽江',
    location: '丽江',
    eventType: '服务事件',
    department: '客舱部',
    description: '客舱设备使用说明标识不规范',
    improvements: '建议更换新的设备使用说明',
    status: '已分发'
  },
  {
    flightSegment: '丽江-芒市',
    location: '芒市',
    eventType: '机务事件',
    department: '机务部',
    description: '例行检查时发现货舱门窗...',
    improvements: '建议在下次维护时重新紧实...',
    status: '待确认'
  }
])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

// 对话框控制
const distributeDialogVisible = ref(false)
const assessDialogVisible = ref(false)
const confirmDialogVisible = ref(false)

// 表单数据
const distributeForm = ref({
  department: '',
  requirement: ''
})

const assessForm = ref({
  result: '',
  improvements: ''
})

const confirmForm = ref({
  result: 'close',
  comment: ''
})

// 表单验证规则
const distributeRules = {
  department: [{ required: true, message: '请选择处理部门', trigger: 'change' }],
  requirement: [{ required: true, message: '请输入处理要求', trigger: 'blur' }]
}

const assessRules = {
  result: [{ required: true, message: '请输入评估结果', trigger: 'blur' }],
  improvements: [{ required: true, message: '请输入改进措施', trigger: 'blur' }]
}

const confirmRules = {
  comment: [{ required: true, message: '请输入确认意见', trigger: 'blur' }]
}

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待分发': 'warning',
    '已分发': 'primary',
    '待确认': 'info',
    '已关闭': 'success'
  }
  return map[status] || 'info'
}

// 处理方法
const handleDistribute = (row: any) => {
  distributeForm.value = {
    department: '',
    requirement: ''
  }
  distributeDialogVisible.value = true
}

const handleReturn = async (row: any) => {
  try {
    await ElMessageBox.prompt('请输入退回原因', '退回处理', {
      confirmButtonText: '确认退回',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputPlaceholder: '请输入退回原因'
    }).then(({ value }) => {
      if (value) {
        // TODO: 调用API更新状态为已退回
        ElMessage.success('已退回')
        handleSearch() // 刷新列表
      }
    })
  } catch {
    // 取消操作
  }
}

const handleAssess = (row: any) => {
  assessForm.value = {
    result: '',
    improvements: ''
  }
  assessDialogVisible.value = true
}

const handleConfirm = async (row: any, type: 'approve' | 'reject') => {
  confirmForm.value = {
    result: type === 'approve' ? 'close' : 'return',
    comment: ''
  }
  confirmDialogVisible.value = true
}

// 提交方法
const submitDistribute = async () => {
  if (!distributeFormRef.value) return
  
  await distributeFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用API更新状态和处理要求
      distributeDialogVisible.value = false
      ElMessage.success('分发成功')
      handleSearch() // 刷新列表
    }
  })
}

const submitAssess = async () => {
  if (!assessFormRef.value) return
  
  await assessFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用API更新状态和评估结果
      assessDialogVisible.value = false
      ElMessage.success('评估完成')
      handleSearch() // 刷新列表
    }
  })
}

const submitConfirm = async () => {
  if (!confirmFormRef.value) return
  
  await confirmFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用API更新状态
      confirmDialogVisible.value = false
      ElMessage.success('确认完成')
      handleSearch() // 刷新列表
    }
  })
}

// 其他方法保持不变
</script>

<style scoped>
.voluntary-report {
  padding: 20px;
}

.tab-container {
  margin-bottom: 20px;
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