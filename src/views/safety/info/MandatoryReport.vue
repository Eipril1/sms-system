<template>
  <div class="mandatory-report">
    <div class="page-header">
      <h2>强制报告</h2>
      <el-button type="primary" @click="handleAdd">+ 新增报告</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="编号">
          <el-input v-model="searchForm.recordNumber" placeholder="请输入编号" clearable />
        </el-form-item>
        <el-form-item label="航班号">
          <el-input v-model="searchForm.flightNo" placeholder="请输入航班号" clearable />
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="searchForm.eventType" placeholder="请选择" clearable>
            <el-option label="机务事件" value="maintenance" />
            <el-option label="运行事件" value="operation" />
            <el-option label="空防事件" value="security" />
            <el-option label="服务事件" value="service" />
          </el-select>
        </el-form-item>
        <el-form-item label="396事件">
          <el-select v-model="searchForm.is396Event" placeholder="请选择" clearable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="调查状态">
          <el-select v-model="searchForm.needInvestigation" placeholder="请选择" clearable>
            <el-option label="需要调查" :value="true" />
            <el-option label="无需调查" :value="false" />
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
      <el-table-column prop="recordNumber" label="编号" width="120" />
      <el-table-column prop="occurDate" label="事发日期" width="100" />
      <el-table-column prop="occurTime" label="时间" width="100" />
      <el-table-column prop="flightNo" label="航班号" width="100" />
      <el-table-column prop="aircraftNo" label="飞机号" width="100" />
      <el-table-column prop="flightSegment" label="航段" width="120" />
      <el-table-column prop="occurPhase" label="事发阶段" width="120" />
      <el-table-column prop="controlArea" label="所在管制区" width="120" />
      <el-table-column prop="eventType" label="事件类型" width="120" />
      <el-table-column prop="description" label="事件经过" min-width="200" show-overflow-tooltip />
      <el-table-column prop="impact" label="产生影响" min-width="150" show-overflow-tooltip />
      <el-table-column prop="is396Event" label="396事件" width="90">
        <template #default="{ row }">
          <el-tag :type="row.is396Event ? 'danger' : 'info'">
            {{ row.is396Event ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="needInvestigation" label="需要调查" width="90">
        <template #default="{ row }">
          <el-tag :type="row.needInvestigation ? 'warning' : 'info'">
            {{ row.needInvestigation ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isClosed" label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.isClosed ? 'success' : 'warning'">
            {{ row.isClosed ? '已结案' : '未结案' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button 
            v-if="row.needInvestigation && !row.isClosed"
            link 
            type="warning" 
            @click="handleInvestigate(row)"
          >
            调查
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增强制报告' : '编辑强制报告'"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="事发日期" prop="occurDate">
              <el-date-picker
                v-model="form.occurDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事发时间" prop="occurTime">
              <el-time-picker
                v-model="form.occurTime"
                placeholder="选择时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="航段" prop="flightSegment">
              <el-input v-model="form.flightSegment" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事发阶段" prop="occurPhase">
              <el-select v-model="form.occurPhase" placeholder="请选择" style="width: 100%">
                <el-option label="起飞" value="takeoff" />
                <el-option label="巡航" value="cruise" />
                <el-option label="着陆" value="landing" />
                <el-option label="地面" value="ground" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="事件类型" prop="eventType">
          <el-select v-model="form.eventType" placeholder="请选择">
            <el-option label="机务事件" value="maintenance" />
            <el-option label="运行事件" value="operation" />
            <el-option label="空防事件" value="security" />
            <el-option label="服务事件" value="service" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件经过" prop="description">
          <el-input v-model="form.description" type="textarea" rows="4" />
        </el-form-item>
        <el-form-item label="产生影响" prop="impact">
          <el-input v-model="form.impact" type="textarea" rows="3" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="396事件" prop="is396Event">
              <el-switch v-model="form.is396Event" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需要调查" prop="needInvestigation">
              <el-switch v-model="form.needInvestigation" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否结案" prop="isClosed">
              <el-switch v-model="form.isClosed" />
            </el-form-item>
          </el-col>
        </el-row>
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
  flightNo: '',
  eventType: '',
  is396Event: '',
  needInvestigation: ''
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
  occurTime: '',
  aircraftNo: '',
  flightNo: '',
  flightSegment: '',
  occurPhase: '',
  controlArea: '',
  eventType: '',
  description: '',
  impact: '',
  is396Event: false,
  errorStandard: '',
  needInvestigation: false,
  isClosed: false
})

// 表单验证规则
const rules = {
  flightNo: [{ required: true, message: '请输入航班号', trigger: 'blur' }],
  aircraftNo: [{ required: true, message: '请输入飞机号', trigger: 'blur' }],
  occurDate: [{ required: true, message: '请选择事发日期', trigger: 'change' }],
  occurTime: [{ required: true, message: '请选择事发时间', trigger: 'change' }],
  eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入事件经过', trigger: 'blur' }]
}

// 方法定义...
const handleSearch = () => {
  // 实现搜索逻辑
}

const handleReset = () => {
  searchForm.recordNumber = ''
  searchForm.flightNo = ''
  searchForm.eventType = ''
  searchForm.is396Event = ''
  searchForm.needInvestigation = ''
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.recordNumber = ''
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleView = (row: any) => {
  // 实现查看逻辑
}

const handleInvestigate = (row: any) => {
  // 实现调查逻辑
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 提交表单逻辑
      dialogVisible.value = false
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 重新加载数据
}
</script>

<style scoped>
.mandatory-report {
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