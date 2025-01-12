<template>
  <div class="voluntary-report">
    <div class="page-header">
      <h2>自愿报告</h2>
      <el-button type="primary" @click="handleAdd">+ 新增报告</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="信息编号">
          <el-input v-model="searchForm.recordNumber" placeholder="请输入编号" clearable />
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="searchForm.eventType" placeholder="请选择" clearable>
            <el-option label="机务事件" value="maintenance" />
            <el-option label="运行事件" value="operation" />
            <el-option label="空防事件" value="security" />
            <el-option label="服务事件" value="service" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理部门">
          <el-select v-model="searchForm.handleDept" placeholder="请选择" clearable>
            <el-option label="飞行部" value="flight" />
            <el-option label="机务部" value="maintenance" />
            <el-option label="运控部" value="operation" />
            <el-option label="客舱部" value="cabin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待分发" value="pending" />
            <el-option label="已分发" value="distributed" />
            <el-option label="已完成" value="completed" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="recordNumber" label="信息编号" width="120" />
      <el-table-column prop="occurDate" label="事发日期" width="100" />
      <el-table-column prop="flightNo" label="航班号" width="100" />
      <el-table-column prop="aircraftNo" label="飞机号" width="100" />
      <el-table-column prop="flightSegment" label="航段" width="120" />
      <el-table-column prop="occurPlace" label="事发地" width="120" />
      <el-table-column prop="eventType" label="事件类型" width="120" />
      <el-table-column prop="hopeHandleDept" label="希望处理部门" width="120" />
      <el-table-column prop="description" label="事件经过" min-width="200" show-overflow-tooltip />
      <el-table-column prop="improvementMeasures" label="改进措施" min-width="200" show-overflow-tooltip />
      <el-table-column prop="isDistributed" label="分发状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.isDistributed ? 'success' : 'info'">
            {{ row.isDistributed ? '已分发' : '未分发' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isSubmitToSafety" label="提交安监部" width="90">
        <template #default="{ row }">
          <el-tag :type="row.isSubmitToSafety ? 'success' : 'info'">
            {{ row.isSubmitToSafety ? '已提交' : '未提交' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isClosed" label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.isClosed ? 'success' : 'warning'">
            {{ row.isClosed ? '已关闭' : '处理中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="primary" @click="handleDistribute(row)" 
            :disabled="row.isDistributed">分发</el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增自愿报告' : '编辑自愿报告'"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="航班号" prop="flightNo">
              <el-input v-model="form.flightNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="飞机号" prop="aircraftNo">
              <el-input v-model="form.aircraftNo" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 其他表单项... -->
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  recordNumber: '',
  eventType: '',
  handleDept: '',
  status: ''
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  recordNumber: '',
  occurDate: '',
  aircraftNo: '',
  flightNo: '',
  flightSegment: '',
  occurPlace: '',
  eventType: '',
  hopeHandleDept: '',
  description: '',
  improvementMeasures: '',
  isDistributed: false,
  distributeDept: '',
  isEffective: false,
  analysis: '',
  controlMeasures: '',
  completionStatus: '',
  isSubmitToSafety: false,
  auditResult: '',
  isFeedback: false,
  trackingVerification: '',
  isClosed: false
})

// 表单验证规则
const rules = {
  flightNo: [{ required: true, message: '请输入航班号', trigger: 'blur' }],
  eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入事件经过', trigger: 'blur' }],
  hopeHandleDept: [{ required: true, message: '请选择希望处理部门', trigger: 'change' }]
}

// 方法定义...
</script>

<style scoped>
.voluntary-report {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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