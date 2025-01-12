<template>
  <div class="check-items">
    <div class="page-header">
      <h2>检查项管理</h2>
      <el-button type="primary" @click="handleAdd">新增检查项</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="检查项编号">
          <el-input 
            v-model="searchForm.itemNo" 
            placeholder="请输入编号" 
            clearable
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="检查类型">
          <el-select 
            v-model="searchForm.type" 
            placeholder="请选择" 
            clearable
            style="width: 180px;"
          >
            <el-option
              v-for="item in checkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门">
          <el-select 
            v-model="searchForm.department" 
            placeholder="请选择" 
            clearable
            style="width: 180px;"
          >
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
    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="itemNo" label="检查项编号" width="120" />
      <el-table-column prop="type" label="检查类型" width="120" />
      <el-table-column prop="department" label="适用部门" width="120" />
      <el-table-column prop="content" label="检查内容" min-width="250" show-overflow-tooltip />
      <el-table-column prop="standard" label="检查标准" min-width="250" show-overflow-tooltip />
      <el-table-column prop="basis" label="检查依据" min-width="200" show-overflow-tooltip />
      <el-table-column prop="method" label="检查方法" width="120" />
      <el-table-column prop="frequency" label="检查频次" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button 
            link 
            :type="row.status === '启用' ? 'warning' : 'success'"
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
      :title="dialogType === 'add' ? '新增检查项' : '编辑检查项'"
      width="800px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="检查类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in checkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择">
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
            :rows="3"
            placeholder="请输入检查内容"
          />
        </el-form-item>
        <el-form-item label="检查标准" prop="standard">
          <el-input
            v-model="form.standard"
            type="textarea"
            :rows="3"
            placeholder="请输入检查标准"
          />
        </el-form-item>
        <el-form-item label="检查依据" prop="basis">
          <el-input
            v-model="form.basis"
            type="textarea"
            :rows="2"
            placeholder="请输入检查依据"
          />
        </el-form-item>
        <el-form-item label="检查方法" prop="method">
          <el-select v-model="form.method" placeholder="请选择">
            <el-option label="现场检查" value="site" />
            <el-option label="资料检查" value="document" />
            <el-option label="人员访谈" value="interview" />
            <el-option label="系统检查" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查频次" prop="frequency">
          <el-select v-model="form.frequency" placeholder="请选择">
            <el-option label="每日" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
            <el-option label="每季" value="quarterly" />
          </el-select>
        </el-form-item>
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
import { ElMessage, ElMessageBox } from 'element-plus'

// 检查类型选项
const checkTypeOptions = [
  { label: '运行检查', value: 'operation' },
  { label: '维修检查', value: 'maintenance' },
  { label: '安全检查', value: 'safety' },
  { label: '客舱检查', value: 'cabin' },
  { label: '地面检查', value: 'ground' }
]

// 部门选项
const departmentOptions = [
  { label: '飞行部', value: '飞行部' },
  { label: '维修部', value: '维修部' },
  { label: '运控部', value: '运控部' },
  { label: '客舱部', value: '客舱部' },
  { label: '安全部', value: '安全部' }
]

// 搜索表单
const searchForm = reactive({
  itemNo: '',
  type: '',
  department: ''
})

// 表格数据
const tableData = ref([
  {
    itemNo: 'CX-FLT-001',
    type: '运行检查',
    department: '飞行部',
    content: '检查飞行计划的制定是否符合规范',
    standard: '符合CCAR-121部运行规范要求',
    basis: 'CCAR-121部第121.533条',
    method: '资料检查',
    frequency: '每日',
    status: '启用'
  },
  {
    itemNo: 'CX-MNT-001',
    type: '维修检查',
    department: '维修部',
    content: '检查航线维修记录的填写',
    standard: '按维修手册要求填写完整、准确',
    basis: 'CCAR-145部第145.59条',
    method: '现场检查',
    frequency: '每周',
    status: '启用'
  },
  {
    itemNo: 'CX-OPS-001',
    type: '运行检查',
    department: '运控部',
    content: '检查放行文件的完整性',
    standard: '放行文件齐全，签署完整',
    basis: '运行手册4.3.2节',
    method: '资料检查',
    frequency: '每日',
    status: '启用'
  },
  {
    itemNo: 'CX-CAB-001',
    type: '客舱检查',
    department: '客舱部',
    content: '检查客舱应急设备状态',
    standard: '设备完好、数量齐全、位置正确',
    basis: '客舱安全手册3.2节',
    method: '现场检查',
    frequency: '每周',
    status: '停用'
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(4)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  itemNo: '',
  type: '',
  department: '',
  content: '',
  standard: '',
  basis: '',
  method: '',
  frequency: '',
  status: '启用'
})

// 表单验证规则
const rules = {
  type: [{ required: true, message: '请选择检查类型', trigger: 'change' }],
  department: [{ required: true, message: '请选择适用部门', trigger: 'change' }],
  content: [{ required: true, message: '请输入检查内容', trigger: 'blur' }],
  standard: [{ required: true, message: '请输入检查标准', trigger: 'blur' }],
  basis: [{ required: true, message: '请输入检查依据', trigger: 'blur' }],
  method: [{ required: true, message: '请选择检查方法', trigger: 'change' }],
  frequency: [{ required: true, message: '请选择检查频次', trigger: 'change' }]
}

// 方法定义
const handleSearch = () => {
  // 实现搜索逻辑
  const { itemNo, type, department } = searchForm
  const filteredData = tableData.value.filter(item => {
    const matchItemNo = !itemNo || item.itemNo.toLowerCase().includes(itemNo.toLowerCase())
    const matchType = !type || item.type === type
    const matchDepartment = !department || item.department === department
    return matchItemNo && matchType && matchDepartment
  })
  total.value = filteredData.length
}

const handleReset = () => {
  searchForm.itemNo = ''
  searchForm.type = ''
  searchForm.department = ''
  handleSearch()
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(form, {
    itemNo: '',
    type: '',
    department: '',
    content: '',
    standard: '',
    basis: '',
    method: '',
    frequency: '',
    status: '启用'
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleView = (row: any) => {
  // 实现查看逻辑
  ElMessage.info(`查看检查项：${row.itemNo}`)
}

const handleToggleStatus = async (row: any) => {
  const action = row.status === '启用' ? '停用' : '启用'
  try {
    await ElMessageBox.confirm(`确认${action}该检查项？`, '提示', {
      type: 'warning'
    })
    row.status = action === '启用' ? '启用' : '停用'
    ElMessage.success(`${action}成功`)
  } catch {
    // 取消操作
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 生成检查项编号
        const deptCode = form.department === '飞行部' ? 'FLT' : 
                        form.department === '维修部' ? 'MNT' :
                        form.department === '运控部' ? 'OPS' :
                        form.department === '客舱部' ? 'CAB' : 'SAF'
        form.itemNo = `CX-${deptCode}-${String(tableData.value.length + 1).padStart(3, '0')}`
        tableData.value.push({ ...form })
      } else {
        // 更新现有检查项
        const index = tableData.value.findIndex(item => item.itemNo === form.itemNo)
        if (index !== -1) {
          tableData.value[index] = { ...form }
        }
      }
      total.value = tableData.value.length
      dialogVisible.value = false
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
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
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;

  :deep(.el-form--inline) {
    .el-form-item {
      margin-right: 20px;
      margin-bottom: 0;

      &__label {
        font-weight: normal;
        color: #606266;
      }
    }
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    width: 100%;
  }

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-button) {
    margin-left: 0;
    margin-right: 10px;
    
    &:last-child {
      margin-right: 0;
    }
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 