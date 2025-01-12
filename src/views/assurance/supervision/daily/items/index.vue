<template>
  <div class="check-items">
    <div class="page-header">
      <h2>检查项管理</h2>
      <el-button type="primary" @click="handleAdd">新增检查项</el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="检查项编号">
          <el-input v-model="searchForm.itemNo" placeholder="请输入编号" clearable />
        </el-form-item>
        <el-form-item label="检查类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in checkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 检查项列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>检查项列表</span>
          <div class="header-operations">
            <el-button type="primary" @click="handleAdd">新增检查项</el-button>
            <el-button type="success" @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <el-table 
        :data="tableData" 
        v-loading="loading"
        border
        stripe
      >
        <el-table-column prop="itemNo" label="检查项编号" width="120" />
        <el-table-column prop="type" label="检查类型" width="120" />
        <el-table-column prop="content" label="检查内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="standard" label="检查标准" min-width="200" show-overflow-tooltip />
        <el-table-column prop="method" label="检查方法" width="120" />
        <el-table-column prop="department" label="适用部门" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button 
              link 
              :type="row.status === '启用' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === '启用' ? '停用' : '启用' }}
            </el-button>
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
      :title="dialogType === 'add' ? '新增检查项' : '编辑检查项'"
      v-model="dialogVisible"
      width="650px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="检查类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in checkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门" prop="department">
          <el-select v-model="form.department" multiple placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            rows="3"
            placeholder="请输入检查内容"
          />
        </el-form-item>
        <el-form-item label="检查标准" prop="standard">
          <el-input
            v-model="form.standard"
            type="textarea"
            rows="3"
            placeholder="请输入检查标准"
          />
        </el-form-item>
        <el-form-item label="检查方法" prop="method">
          <el-select v-model="form.method" placeholder="请选择" style="width: 100%">
            <el-option label="文件审查" value="文件审查" />
            <el-option label="现场检查" value="现场检查" />
            <el-option label="人员访谈" value="人员访谈" />
            <el-option label="系统核查" value="系统核查" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            rows="2"
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

    <!-- 查看详情对话框 -->
    <el-dialog
      title="检查项详情"
      v-model="viewDialogVisible"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="检查项编号">{{ viewData.itemNo }}</el-descriptions-item>
        <el-descriptions-item label="检查类型">{{ viewData.type }}</el-descriptions-item>
        <el-descriptions-item label="适用部门">{{ viewData.department }}</el-descriptions-item>
        <el-descriptions-item label="检查内容">{{ viewData.content }}</el-descriptions-item>
        <el-descriptions-item label="检查标准">{{ viewData.standard }}</el-descriptions-item>
        <el-descriptions-item label="检查方法">{{ viewData.method }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="viewData.status === '启用' ? 'success' : 'info'">
            {{ viewData.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{ viewData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

// 搜索表单
const searchForm = ref({
  itemNo: '',
  type: '',
  department: ''
})

// 表格数据
const tableData = ref([
  {
    itemNo: 'CX-FLT-001',
    type: '运行检查',
    content: '飞行员资质检查',
    standard: '按照CCAR-121部要求检查飞行员执照和训练记录',
    method: '文件审查',
    status: '启用'
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(1)

// 部门选项
const departmentOptions = [
  { label: '飞行部', value: '飞行部' },
  { label: '维修部', value: '维修部' },
  { label: '运控部', value: '运控部' },
  { label: '客舱部', value: '客舱部' },
  { label: '货运部', value: '货运部' },
  { label: '安全部', value: '安全部' }
]

// 检查类型选项
const checkTypeOptions = [
  { label: '运行检查', value: '运行检查' },
  { label: '维修检查', value: '维修检查' },
  { label: '安保检查', value: '安保检查' },
  { label: '客舱检查', value: '客舱检查' },
  { label: '货运检查', value: '货运检查' }
]

// 表单数据
const form = reactive({
  itemNo: '',
  type: '',
  department: [],
  content: '',
  standard: '',
  method: '',
  remark: ''
})

// 表单验证规则
const rules = {
  type: [{ required: true, message: '请选择检查类型', trigger: 'change' }],
  department: [{ required: true, message: '请选择适用部门', trigger: 'change' }],
  content: [{ required: true, message: '请输入检查内容', trigger: 'blur' }],
  standard: [{ required: true, message: '请输入检查标准', trigger: 'blur' }],
  method: [{ required: true, message: '请选择检查方法', trigger: 'change' }]
}

// 查看详情数据
const viewData = ref({
  itemNo: '',
  type: '',
  department: '',
  content: '',
  standard: '',
  method: '',
  status: '',
  remark: ''
})
const viewDialogVisible = ref(false)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 新增检查项
const handleAdd = () => {
  dialogType.value = 'add'
  // 重置表单数据
  Object.assign(form, {
    itemNo: '',
    type: '',
    department: [],
    content: '',
    standard: '',
    method: '',
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑检查项
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  // 填充表单数据
  Object.assign(form, {
    itemNo: row.itemNo,
    type: row.type,
    department: Array.isArray(row.department) ? row.department : [row.department],
    content: row.content,
    standard: row.standard,
    method: row.method,
    remark: row.remark || ''
  })
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
    
    const newItem = {
      itemNo: dialogType.value === 'add' ? `CX-${form.type.substring(0, 3)}-${Date.now()}` : form.itemNo,
      type: form.type,
      department: form.department,
      content: form.content,
      standard: form.standard,
      method: form.method,
      remark: form.remark,
      status: '启用'
    }
    
    if (dialogType.value === 'add') {
      tableData.value.unshift(newItem)
      total.value++
      ElMessage.success('新增成功')
    } else {
      const index = tableData.value.findIndex(item => item.itemNo === form.itemNo)
      if (index !== -1) {
        tableData.value[index] = { ...tableData.value[index], ...newItem }
        ElMessage.success('修改成功')
      }
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

// 搜索方法
const handleSearch = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 这里应该是实际的API调用
    // 模拟筛选
    const filteredData = tableData.value.filter(item => {
      const matchItemNo = !searchForm.value.itemNo || 
        item.itemNo.toLowerCase().includes(searchForm.value.itemNo.toLowerCase())
      const matchType = !searchForm.value.type || 
        item.type === searchForm.value.type
      const matchDepartment = !searchForm.value.department || 
        (Array.isArray(item.department) ? 
          item.department.includes(searchForm.value.department) : 
          item.department === searchForm.value.department)
      
      return matchItemNo && matchType && matchDepartment
    })
    
    total.value = filteredData.length
    // 更新表格数据
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败')
  } finally {
    loading.value = false
  }
}

// 导出功能
const handleExport = () => {
  const headers = [
    '检查项编号',
    '检查类型',
    '检查内容',
    '检查标准',
    '检查方法',
    '适用部门',
    '状态'
  ]
  
  const data = tableData.value.map(item => [
    item.itemNo,
    item.type,
    item.content,
    item.standard,
    item.method,
    Array.isArray(item.department) ? item.department.join(',') : item.department,
    item.status
  ])
  
  // 创建工作簿
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
  
  // 设置列宽
  ws['!cols'] = [
    { wch: 15 }, // 编号
    { wch: 12 }, // 类型
    { wch: 40 }, // 内容
    { wch: 40 }, // 标准
    { wch: 12 }, // 方法
    { wch: 20 }, // 部门
    { wch: 8 }   // 状态
  ]
  
  XLSX.utils.book_append_sheet(wb, ws, '检查项列表')
  
  // 导出文件
  XLSX.writeFile(wb, `检查项列表_${new Date().toLocaleDateString()}.xlsx`)
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
</script>

<style scoped>
.check-items {
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

.view-dialog :deep(.el-descriptions__label) {
  width: 120px;
  justify-content: flex-end;
}

.view-dialog :deep(.el-descriptions__content) {
  padding: 12px 16px;
}

/* 搜索区域样式优化 */
.search-wrapper {
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

/* 表格区域样式优化 */
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

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #F5F7FA;
  color: #606266;
  font-weight: 600;
  height: 44px;
}

:deep(.el-table td) {
  padding: 8px 0;
}

/* 分页样式优化 */
.pagination-container {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #EBEEF5;
  display: flex;
  justify-content: flex-end;
}

/* 对话框样式优化 */
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

/* 按钮样式优化 */
:deep(.el-button--link) {
  height: 28px;
  padding: 0 8px;
}

:deep(.el-button--link + .el-button--link) {
  margin-left: 8px;
}

/* 标签样式优化 */
:deep(.el-tag) {
  border-radius: 12px;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
}

/* 详情对话框样式优化 */
.view-dialog :deep(.el-descriptions) {
  padding: 16px;
}

.view-dialog :deep(.el-descriptions__label) {
  width: 120px;
  justify-content: flex-end;
  padding: 12px 16px;
  font-weight: 500;
}

.view-dialog :deep(.el-descriptions__content) {
  padding: 12px 16px;
  line-height: 1.6;
}
</style> 