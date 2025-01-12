<template>
  <div class="check-task">
    <div class="page-header">
      <h2>检查任务</h2>
      <el-button type="primary" @click="handleAdd">新增任务</el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>本月任务总数</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.totalCount }}</span>
            <div class="sub-info">
              <span class="completed">已完成: {{ statistics.completedCount }}</span>
              <span class="pending">待执行: {{ statistics.pendingCount }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>本月完成率</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.completionRate }}%</span>
            <el-progress 
              :percentage="statistics.completionRate" 
              :status="statistics.completionRate >= 90 ? 'success' : 'warning'"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>问题发现数</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.issueCount }}</span>
            <div class="sub-info">
              <span class="danger">高风险: {{ statistics.highRiskCount }}</span>
              <span class="warning">中风险: {{ statistics.mediumRiskCount }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>问题整改率</span>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics.rectificationRate }}%</span>
            <el-progress 
              :percentage="statistics.rectificationRate" 
              :status="statistics.rectificationRate >= 90 ? 'success' : 'warning'"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="任务编号">
          <el-input v-model="searchForm.taskNo" placeholder="请输入编号" clearable />
        </el-form-item>
        <el-form-item label="检查部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查时间">
          <el-date-picker
            v-model="searchForm.checkTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 任务列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>检查任务列表</span>
          <div class="header-operations">
            <el-button type="primary" @click="handleAdd">新增任务</el-button>
            <el-button type="success" @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <el-table 
        :data="tableData" 
        v-loading="loading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="taskNo" label="任务编号" width="120" />
        <el-table-column prop="checkProject" label="检查项目" min-width="180" />
        <el-table-column prop="department" label="检查部门" width="120" />
        <el-table-column prop="checkTeam" label="检查组成员" width="180" />
        <el-table-column prop="checkTime" label="检查时间" width="180" />
        <el-table-column prop="issueCount" label="问题数" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button 
              link 
              type="primary" 
              @click="handleExecute(row)"
              :disabled="row.status === '已完成'"
            >执行</el-button>
            <el-button 
              link 
              type="danger" 
              @click="handleDelete(row)"
              :disabled="row.status !== '未开始'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增检查任务' : '编辑检查任务'"
      v-model="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="检查项目" prop="checkProject">
          <el-input v-model="form.checkProject" placeholder="请输入检查项目" />
        </el-form-item>
        <el-form-item label="检查部门" prop="department">
          <el-select 
            v-model="form.department" 
            placeholder="请选择"
            @change="handleDepartmentChange"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查组成员" prop="checkTeam">
          <el-select
            v-model="form.checkTeam"
            multiple
            placeholder="请选择检查组成员"
          >
            <el-option
              v-for="member in teamMembers"
              :key="member.value"
              :label="member.label"
              :value="member.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查时间" prop="checkTime">
          <el-date-picker
            v-model="form.checkTime"
            type="datetime"
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="检查地点" prop="checkLocation">
          <el-input v-model="form.checkLocation" placeholder="请输入检查地点" />
        </el-form-item>
        <el-form-item label="检查项" prop="checkItems">
          <div class="check-items-wrapper">
            <div class="selected-items">
              <div class="items-header">
                <span>已选检查项（{{ form.checkItems.length }}）</span>
                <el-button link type="primary" @click="showItemSelector = true">添加检查项</el-button>
              </div>
              <el-table
                :data="form.checkItems"
                style="width: 100%"
                size="small"
                max-height="200"
              >
                <el-table-column prop="itemNo" label="编号" width="100" />
                <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
                <el-table-column label="操作" width="80" align="center">
                  <template #default="{ $index }">
                    <el-button 
                      link 
                      type="danger" 
                      @click="removeCheckItem($index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 检查项选择器 -->
    <el-dialog
      title="选择检查项"
      v-model="showItemSelector"
      width="800px"
      append-to-body
    >
      <div class="item-selector">
        <div class="selector-header">
          <el-input
            v-model="itemSearchKeyword"
            placeholder="搜索检查项"
            clearable
            @input="filterItems"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="selector-body">
          <el-table
            ref="itemSelectorTable"
            :data="filteredCheckItems"
            style="width: 100%"
            height="400"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="itemNo" label="编号" width="120" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
            <el-table-column prop="standard" label="检查标准" show-overflow-tooltip />
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="showItemSelector = false">取消</el-button>
        <el-button type="primary" @click="confirmSelectItems">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

// 统计数据
const statistics = reactive({
  totalCount: 12,
  completedCount: 8,
  pendingCount: 4,
  completionRate: 85,
  issueCount: 15,
  highRiskCount: 3,
  mediumRiskCount: 7,
  rectificationRate: 90
})

// 搜索表单
const searchForm = ref({
  taskNo: '',
  department: '',
  checkTime: [],
  status: ''
})

// 表格数据
const tableData = ref([
  {
    taskNo: 'RW202401001',
    checkProject: '飞行部安全检查',
    department: '飞行部',
    checkTeam: ['张三', '李四'],
    checkTime: '2024-03-15 09:00',
    issueCount: 3,
    status: '未开始'
  },
  {
    taskNo: 'RW202401002',
    checkProject: '维修部例行检查',
    department: '维修部',
    checkTeam: ['陈工', '刘工'],
    checkTime: '2024-03-17 10:00',
    issueCount: 0,
    status: '未开始'
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

// 部门选项
const departmentOptions = [
  { label: '飞行部', value: '飞行部' },
  { label: '维修部', value: '维修部' },
  { label: '运控部', value: '运控部' },
  { label: '客舱部', value: '客舱部' },
  { label: '货运部', value: '货运部' },
  { label: '安全部', value: '安全部' }
]

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '未开始': 'info',
    '进行中': 'warning',
    '已完成': 'success'
  }
  return map[status] || 'info'
}

// 搜索方法
const handleSearch = () => {
  // 实现搜索逻辑
}

const resetSearch = () => {
  searchForm.value.taskNo = ''
  searchForm.value.department = ''
  handleSearch()
}

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 新增任务
const handleAdd = () => {
  dialogType.value = 'add'
  // 重置表单数据
  form.taskNo = ''
  form.checkProject = ''
  form.department = ''
  form.checkTeam = []
  form.checkTime = ''
  form.checkLocation = ''
  form.checkItems = []
  form.remark = ''
  
  // 显示对话框
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newTask = {
      taskNo: `RW${new Date().getTime()}`,
      checkProject: form.checkProject,
      department: form.department,
      checkTeam: form.checkTeam,
      checkTime: form.checkTime,
      checkLocation: form.checkLocation,
      checkItems: form.checkItems,
      remark: form.remark,
      status: '未开始',
      issueCount: 0
    }
    
    if (dialogType.value === 'add') {
      tableData.value.unshift(newTask)
      total.value++
      ElMessage.success('新增成功')
    } else {
      const index = tableData.value.findIndex(item => item.taskNo === form.taskNo)
      if (index !== -1) {
        tableData.value[index] = { ...tableData.value[index], ...newTask }
        ElMessage.success('修改成功')
      }
    }
    
    dialogVisible.value = false
  } catch (error) {
    // 表单验证失败
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

// 编辑任务
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  // 填充表单数据
  Object.assign(form, {
    taskNo: row.taskNo,
    checkProject: row.checkProject,
    department: row.department,
    checkTeam: row.checkTeam,
    checkTime: row.checkTime,
    checkLocation: row.checkLocation,
    checkItems: row.checkItems || [],
    remark: row.remark
  })
  
  dialogVisible.value = true
}

// 删除任务
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该检查任务？', '提示', {
      type: 'warning'
    })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = tableData.value.findIndex(item => item.taskNo === row.taskNo)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      total.value--
      ElMessage.success('删除成功')
    }
  } catch {
    // 取消删除
  }
}

// 执行检查
const handleExecute = (row: any) => {
  // TODO: 跳转到检查执行页面
  ElMessage.info('即将跳转到检查执行页面')
}

// 导出功能
const handleExport = () => {
  // TODO: 实现导出功能
  ElMessage.success('导出成功')
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

// 表单数据
const form = reactive({
  taskNo: '',
  checkProject: '',
  department: '',
  checkTeam: [] as string[],
  checkTime: '',
  checkLocation: '',
  checkItems: [] as any[],
  remark: ''
})

// 表单验证规则
const rules = {
  checkProject: [{ required: true, message: '请输入检查项目', trigger: 'blur' }],
  department: [{ required: true, message: '请选择检查部门', trigger: 'change' }],
  checkTeam: [{ required: true, message: '请选择检查组成员', trigger: 'change' }],
  checkTime: [{ required: true, message: '请选择检查时间', trigger: 'change' }],
  checkLocation: [{ required: true, message: '请输入检查地点', trigger: 'blur' }],
  checkItems: [{ required: true, message: '请选择检查项', trigger: 'change' }]
}

// 检查项选择器
const showItemSelector = ref(false)
const itemSearchKeyword = ref('')
const selectedItems = ref<any[]>([])

// 检查项数据（模拟）
const checkItemsList = [
  {
    itemNo: 'CX-FLT-001',
    type: '运行检查',
    content: '飞行员资质检查',
    standard: '按照CCAR-121部要求检查飞行员执照和训练记录'
  },
  {
    itemNo: 'CX-MNT-001',
    type: '维修检查',
    content: '航线维修检查',
    standard: '按照维修手册要求检查航线维修工作'
  }
  // ... 更多检查项
]

// 根据部门筛选的检查项
const filteredCheckItems = ref(checkItemsList)

// 搜索过滤
const filterItems = () => {
  if (!itemSearchKeyword.value) {
    filteredCheckItems.value = checkItemsList
    return
  }
  
  filteredCheckItems.value = checkItemsList.filter(item => 
    item.itemNo.toLowerCase().includes(itemSearchKeyword.value.toLowerCase()) ||
    item.content.includes(itemSearchKeyword.value) ||
    item.type.includes(itemSearchKeyword.value)
  )
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedItems.value = selection
}

// 确认选择
const confirmSelectItems = () => {
  form.checkItems.push(...selectedItems.value)
  showItemSelector.value = false
}

// 移除检查项
const removeCheckItem = (index: number) => {
  form.checkItems.splice(index, 1)
}

// 部门变化时更新检查组成员选项
const teamMembers = ref([
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' }
])

const handleDepartmentChange = (value: string) => {
  form.checkTeam = []
  // TODO: 根据部门获取对应的检查组成员
}
</script>

<style scoped>
.check-task {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 统计卡片样式 */
.statistics {
  margin-bottom: 20px;
}

.statistics-card {
  height: 140px;
  transition: all 0.3s;
}

.statistics-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.statistics-card :deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #EBEEF5;
}

.statistics-card :deep(.el-card__body) {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.statistics-value {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.statistics-value .number {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  line-height: 1;
  margin: 0;
}

.statistics-value .sub-info {
  display: flex;
  justify-content: space-around;
  width: 100%;
  font-size: 13px;
}

.statistics-value .completed {
  color: #67C23A;
}

.statistics-value .pending {
  color: #E6A23C;
}

.statistics-value .danger {
  color: #F56C6C;
}

.statistics-value .warning {
  color: #E6A23C;
}

.statistics-value :deep(.el-progress) {
  width: 90%;
}

/* 搜索区域样式 */
.search-wrapper {
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

:deep(.el-form--inline) {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: -16px;
}

:deep(.el-form--inline .el-form-item) {
  margin: 0;
  flex-shrink: 0;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  padding-right: 12px;
}

:deep(.el-input__wrapper),
:deep(.el-select),
:deep(.el-date-editor.el-input) {
  width: 220px;
}

:deep(.el-form--inline .el-form-item:last-child) {
  margin-left: auto;
}

/* 表格区域样式 */
.table-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.table-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #EBEEF5;
}

.table-card :deep(.el-card__body) {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-operations {
  display: flex;
  gap: 12px;
}

:deep(.el-table) {
  margin-bottom: 16px;
}

:deep(.el-table th) {
  background-color: #F5F7FA;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 8px 0;
}

:deep(.el-button--link) {
  padding: 4px 8px;
}

:deep(.el-button--link + .el-button--link) {
  margin-left: 8px;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #EBEEF5;
}

/* 对话框样式 */
:deep(.el-dialog__body) {
  padding: 20px 40px;
}

:deep(.el-dialog__footer) {
  padding: 16px 40px;
  border-top: 1px solid #EBEEF5;
}

:deep(.el-form-item__content) {
  width: calc(100% - 100px);
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  font-family: inherit;
}

.check-items-wrapper {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding: 12px;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.selector-header {
  padding: 0 0 16px 0;
  border-bottom: 1px solid #EBEEF5;
}

.selector-body {
  flex: 1;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style> 