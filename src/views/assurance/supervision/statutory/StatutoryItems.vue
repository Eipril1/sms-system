<template>
  <div class="statutory-items">
    <div class="page-header">
      <h2>自查项管理</h2>
      <div class="header-actions">
        <el-button type="success" @click="handleImport">
          <el-icon><Upload /></el-icon>导入
        </el-button>
        <el-button type="warning" @click="handleExport">
          <el-icon><Download /></el-icon>导出
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增检查项
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="检查类型">
          <el-cascader
            v-model="searchForm.category"
            :options="categoryOptions"
            :props="{
              checkStrictly: true,
              label: 'name',
              value: 'code',
              children: 'children'
            }"
            placeholder="请选择分类"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="检查内容">
          <el-input 
            v-model="searchForm.content" 
            placeholder="请输入关键词"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="检查依据">
          <el-select v-model="searchForm.basis" placeholder="请选择" clearable>
            <el-option label="CCAR-121" value="CCAR-121" />
            <el-option label="CCAR-135" value="CCAR-135" />
            <el-option label="CCAR-145" value="CCAR-145" />
            <el-option label="公司手册" value="manual" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 添加批量操作工具栏 -->
    <div class="table-operations" v-if="selectedRows.length > 0">
      <el-alert
        :title="`已选择 ${selectedRows.length} 项`"
        type="info"
        show-icon
      >
        <template #default>
          <el-button-group>
            <el-button type="primary" size="small" @click="handleBatchCategory">
              批量分类
            </el-button>
            <el-button type="warning" size="small" @click="handleBatchStatus">
              批量启停
            </el-button>
            <el-button type="danger" size="small" @click="handleBatchDelete">
              批量删除
            </el-button>
          </el-button-group>
        </template>
      </el-alert>
    </div>

    <!-- 检查项列表 -->
    <el-table 
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="code" label="编号" width="120" />
      <el-table-column prop="type" label="检查类型" width="120">
        <template #default="{ row }">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="检查内容" min-width="300" show-overflow-tooltip />
      <el-table-column prop="method" label="检查方法" width="120" />
      <el-table-column prop="basis" label="检查依据" width="120" />
      <el-table-column prop="department" label="适用部门" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button 
            link 
            :type="row.status === 'active' ? 'warning' : 'success'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'active' ? '停用' : '启用' }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentItem ? '编辑检查项' : '新增检查项'"
      width="700px"
    >
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="检查类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择检查类型" style="width: 100%">
            <el-option label="运行合格审定" value="operation" />
            <el-option label="维修合格审定" value="maintenance" />
            <el-option label="训练大纲" value="training" />
            <el-option label="手册体系" value="manual" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="3"
            placeholder="请输入检查内容"
          />
        </el-form-item>
        <el-form-item label="检查方法" prop="method">
          <el-select v-model="form.method" placeholder="请选择检查方法" style="width: 100%">
            <el-option label="文件审查" value="document" />
            <el-option label="现场检查" value="site" />
            <el-option label="人员访谈" value="interview" />
            <el-option label="记录核查" value="record" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查依据" prop="basis">
          <el-select v-model="form.basis" placeholder="请选择检查依据" style="width: 100%">
            <el-option label="CCAR-121" value="CCAR-121" />
            <el-option label="CCAR-135" value="CCAR-135" />
            <el-option label="CCAR-145" value="CCAR-145" />
            <el-option label="公司手册" value="manual" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门" prop="department">
          <el-select 
            v-model="form.department" 
            multiple 
            placeholder="请选择适用部门"
            style="width: 100%"
          >
            <el-option label="飞行部" value="flight" />
            <el-option label="维修部" value="maintenance" />
            <el-option label="运控部" value="operations" />
            <el-option label="培训部" value="training" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注说明"
          />
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-cascader
            v-model="form.category"
            :options="categoryOptions"
            :props="{
              checkStrictly: true,
              label: 'name',
              value: 'code',
              children: 'children'
            }"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入检查项"
      width="500px"
    >
      <el-upload
        class="upload-demo"
        :action="uploadUrl"
        :headers="uploadHeaders"
        :before-upload="beforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        accept=".xlsx,.xls"
      >
        <el-button type="primary">选择文件</el-button>
        <template #tip>
          <div class="el-upload__tip">
            请上传 Excel 文件，仅支持 .xlsx, .xls 格式
            <el-link type="primary" @click="downloadTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
    </el-dialog>

    <!-- 添加批量分类对话框 -->
    <el-dialog
      v-model="batchCategoryDialogVisible"
      title="批量设置分类"
      width="500px"
    >
      <el-form :model="batchForm">
        <el-form-item label="目标分类" required>
          <el-cascader
            v-model="batchForm.category"
            :options="categoryOptions"
            :props="{
              checkStrictly: true,
              label: 'name',
              value: 'code',
              children: 'children'
            }"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchCategoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchCategory">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  category: '',
  content: '',
  basis: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    code: 'SC-001',
    type: '运行合格审定',
    content: '检查飞行运行手册是否符合CCAR-121部要求',
    method: '文件审查',
    basis: 'CCAR-121',
    department: ['飞行部'],
    status: 'active'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表单
const dialogVisible = ref(false)
const currentItem = ref<any>(null)
const formRef = ref()
const form = reactive({
  type: '',
  content: '',
  method: '',
  basis: '',
  department: [],
  remark: ''
})

// 表单校验规则
const rules = {
  type: [{ required: true, message: '请选择检查类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入检查内容', trigger: 'blur' }],
  method: [{ required: true, message: '请选择检查方法', trigger: 'change' }],
  basis: [{ required: true, message: '请选择检查依据', trigger: 'change' }],
  department: [{ required: true, message: '请选择适用部门', trigger: 'change' }]
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
  searchForm.category = ''
  searchForm.content = ''
  searchForm.basis = ''
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

// 表单方法
const handleAdd = () => {
  currentItem.value = null
  Object.assign(form, {
    type: '',
    content: '',
    method: '',
    basis: '',
    department: [],
    remark: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  currentItem.value = row
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (currentItem.value) {
      // 更新
      const index = tableData.value.findIndex(item => item.code === currentItem.value.code)
      if (index > -1) {
        tableData.value[index] = { ...currentItem.value, ...form }
      }
    } else {
      // 新增
      tableData.value.push({
        code: `SC-${Date.now()}`,
        ...form,
        status: 'active'
      })
    }
    
    dialogVisible.value = false
    ElMessage.success('保存成功')
  } catch {
    // 表单校验失败
  }
}

// 其他方法
const handleToggleStatus = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确认${row.status === 'active' ? '停用' : '启用'}该检查项？`
    )
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`${row.status === 'active' ? '启用' : '停用'}成功`)
  } catch {
    // 取消操作
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该检查项？', '提示', {
      type: 'warning'
    })
    const index = tableData.value.findIndex(item => item.code === row.code)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch {
    // 取消操作
  }
}

const selectedRows = ref<any[]>([])

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const handleImport = () => {
  // 实现导入逻辑
}

const handleExport = () => {
  // 实现导出逻辑
}

// 添加新的响应式变量
const importDialogVisible = ref(false)
const batchCategoryDialogVisible = ref(false)
const batchForm = reactive({
  category: null
})

// 分类选项数据
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

// 导入导出相关方法
const uploadUrl = 'your-upload-url'
const uploadHeaders = {
  // 设置上传请求头
}

const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                  file.type === 'application/vnd.ms-excel'
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件!')
    return false
  }
  return true
}

const handleUploadSuccess = (response: any) => {
  ElMessage.success('导入成功')
  importDialogVisible.value = false
  // 刷新列表
  handleSearch()
}

const handleUploadError = () => {
  ElMessage.error('导入失败')
}

const downloadTemplate = () => {
  // 实现模板下载逻辑
  window.open('template-download-url')
}

// 批量操作相关方法
const handleBatchCategory = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要操作的检查项')
    return
  }
  batchCategoryDialogVisible.value = true
}

const confirmBatchCategory = async () => {
  if (!batchForm.category) {
    ElMessage.warning('请选择目标分类')
    return
  }

  try {
    // 实现批量更新分类的逻辑
    selectedRows.value.forEach(row => {
      row.category = batchForm.category
    })
    ElMessage.success('批量设置分类成功')
    batchCategoryDialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleBatchStatus = async () => {
  try {
    await ElMessageBox.confirm('确认批量修改选中检查项的状态？')
    const targetStatus = selectedRows.value[0].status === 'active' ? 'inactive' : 'active'
    selectedRows.value.forEach(row => {
      row.status = targetStatus
    })
    ElMessage.success('批量修改状态成功')
  } catch {
    // 取消操作
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 个检查项？`,
      '提示',
      {
        type: 'warning'
      }
    )
    // 实现批量删除逻辑
    const codes = selectedRows.value.map(row => row.code)
    tableData.value = tableData.value.filter(item => !codes.includes(item.code))
    ElMessage.success('批量删除成功')
  } catch {
    // 取消操作
  }
}
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

.table-operations {
  margin-bottom: 16px;
}

.table-operations :deep(.el-alert) {
  margin-bottom: 0;
}

.table-operations .el-button {
  margin-left: 16px;
}

.upload-demo {
  text-align: center;
}

.el-upload__tip {
  margin-top: 8px;
  line-height: 1.5;
}
</style> 