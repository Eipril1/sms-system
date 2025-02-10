<template>
  <div class="identification-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>危险源识别</h2>
        <div class="toolbar">
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus/>
            </el-icon>
            新增危险源
          </el-button>
          <el-button type="primary" @click="handleBatchDelete" :disabled="!selectedRows.length">
            <el-icon>
              <Delete/>
            </el-icon>
            批量删除
            <template #default v-if="selectedRows.length">
              ({{ selectedRows.length }})
            </template>
          </el-button>
          <el-button type="primary" @click="handleExport">
            <el-icon>
              <Download/>
            </el-icon>
            导出
          </el-button>
          <el-upload
              action=""
              :show-file-list="false"
              :before-upload="handleImport"
              accept=".xlsx,.xls"
          >
            <el-button type="primary">
              <el-icon>
                <Upload/>
              </el-icon>
              导入
            </el-button>
          </el-upload>
        </div>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="危险源编号">
          <el-input v-model="searchForm.code" placeholder="请输入危险源编号" clearable/>
        </el-form-item>
        <el-form-item label="危险源名称">
          <el-input v-model="searchForm.name" placeholder="请输入危险源名称" clearable/>
        </el-form-item>
        <el-form-item label="危险源类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="设备设施" value="equipment"/>
            <el-option label="作业活动" value="operation"/>
            <el-option label="环境因素" value="environment"/>
            <el-option label="人员行为" value="behavior"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="code" label="危险源编号" width="120"/>
        <el-table-column prop="name" label="危险源名称"/>
        <el-table-column prop="type" label="危险源类型" width="120">
          <template #default="{ row }">
            {{ getHazardTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="所在位置" width="150"/>
        <el-table-column prop="department" label="责任部门" width="120"/>
        <el-table-column prop="manager" label="责任人" width="100"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增危险源' : '编辑危险源'"
        width="60%"
    >
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="危险源名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入危险源名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险源类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="设备设施" value="equipment"/>
                <el-option label="作业活动" value="operation"/>
                <el-option label="环境因素" value="environment"/>
                <el-option label="人员行为" value="behavior"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所在位置" prop="location">
              <el-input v-model="form.location" placeholder="请输入所在位置"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任部门" prop="department">
              <el-input v-model="form.department" placeholder="请输入责任部门"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="责任人" prop="manager">
              <el-input v-model="form.manager" placeholder="请输入责任人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="使用中" value="active"/>
                <el-option label="已停用" value="inactive"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="危险源描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              rows="3"
              placeholder="请输入危险源描述"
          />
        </el-form-item>

        <el-form-item label="可能导致的事故" prop="accidents">
          <el-input
              v-model="form.accidents"
              type="textarea"
              rows="3"
              placeholder="请输入可能导致的事故"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Plus, Delete, Download, Upload} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {exportToExcel} from '@/utils/risk'

// 搜索表单
const searchFormRef = ref()
const searchForm = ref({
  code: '',
  name: '',
  type: ''
})

// 表格数据
const tableData = ref([
  {
    id: '1',
    code: 'HZ2024001',
    name: '高空作业安全隐患',
    type: 'operation',
    location: '施工现场A区',
    department: '施工部',
    manager: '张三',
    status: '使用中',
    description: '在高处进行施工作业时存在坠落风险',
    accidents: '高空坠落、物体打击'
  },
  {
    id: '2',
    code: 'HZ2024002',
    name: '危险化学品泄漏',
    type: 'equipment',
    location: '化学品仓库',
    department: '仓储部',
    manager: '李四',
    status: '使用中',
    description: '危险化学品储存过程中可能发生泄漏',
    accidents: '中毒和窒息、火灾爆炸'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

// 选中行
const selectedRows = ref<any[]>([])

// 表单相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = ref({
  name: '',
  type: '',
  location: '',
  department: '',
  manager: '',
  status: 'active',
  description: '',
  accidents: ''
})

const rules = {
  name: [
    {required: true, message: '请输入危险源名称', trigger: 'blur'},
    {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
  ],
  type: [{required: true, message: '请选择危险源类型', trigger: 'change'}],
  location: [{required: true, message: '请输入所在位置', trigger: 'blur'}],
  department: [{required: true, message: '请输入责任部门', trigger: 'blur'}],
  manager: [{required: true, message: '请输入责任人', trigger: 'blur'}],
  status: [{required: true, message: '请选择状态', trigger: 'change'}],
  description: [
    {required: true, message: '请输入危险源描述', trigger: 'blur'},
    {min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur'}
  ],
  accidents: [
    {required: true, message: '请输入可能导致的事故', trigger: 'blur'},
    {min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur'}
  ]
}

// 方法定义
const handleSearch = () => {
  console.log('搜索条件：', searchForm.value)
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
}

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    type: '',
    location: '',
    department: '',
    manager: '',
    status: 'active',
    description: '',
    accidents: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = {...row}
  dialogVisible.value = true
}

const handleView = (row: any) => {
  // TODO: 实现查看详情功能
  console.log('查看详情：', row)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
      '确定要删除该危险源吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    console.log('删除：', row)
    ElMessage.success('删除成功')
  })
}

const handleBatchDelete = () => {
  if (!selectedRows.value.length) return
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条记录吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    console.log('批量删除：', selectedRows.value)
    ElMessage.success('删除成功')
  })
}

const handleExport = () => {
  exportToExcel(tableData.value, '危险源清单')
}

const handleImport = (file: File) => {
  console.log('导入文件：', file)
  return false
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('表单数据：', form.value)
      dialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

// 工具方法
const getHazardTypeText = (type: string) => {
  const map: Record<string, string> = {
    equipment: '设备设施',
    operation: '作业活动',
    environment: '环境因素',
    behavior: '人员行为'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '使用中': 'success',
    '已停用': 'info'
  }
  return map[status] || 'info'
}
</script>

<style scoped>
.identification-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h2 {
  margin: 0;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style> 