<template>
  <div class="departments-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="部门名称">
          <el-input v-model="searchForm.deptName" placeholder="请输入部门名称" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
            <el-option label="启用" value="1"/>
            <el-option label="禁用" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="success" @click="handleAdd">新增部门</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="deptCode" label="部门编码" width="120"/>
      <el-table-column prop="deptName" label="部门名称" width="150"/>
      <el-table-column prop="leader" label="负责人" width="120"/>
      <el-table-column prop="phone" label="联系电话" width="120"/>
      <el-table-column prop="email" label="邮箱" width="180"/>
      <el-table-column prop="description" label="部门描述" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"/>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button
              link
              :type="row.status === '1' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
          >
            {{ row.status === '1' ? '禁用' : '启用' }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <!-- 部门表单对话框 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="500px"
        :close-on-click-modal="false"
    >
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="80px"
      >
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门名称"/>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="部门描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入部门描述"
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
import {ElMessage, ElMessageBox} from 'element-plus'
import type {FormInstance, FormRules} from 'element-plus'

// 搜索表单
const searchForm = ref({
  deptName: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表格数据
const tableData = ref([
  {
    deptCode: 'D001',
    deptName: '飞行部',
    leader: '张三',
    phone: '13800138001',
    email: 'flight@example.com',
    description: '负责飞行相关工作',
    status: '1',
    createTime: '2024-01-01 12:00:00'
  }
])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const form = ref({
  deptName: '',
  leader: '',
  phone: '',
  email: '',
  description: ''
})

// 表单校验规则
const rules: FormRules = {
  deptName: [
    {required: true, message: '请输入部门名称', trigger: 'blur'}
  ],
  leader: [
    {required: true, message: '请输入负责人', trigger: 'blur'}
  ],
  phone: [
    {required: true, message: '请输入联系电话', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
  ],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
  ]
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增部门'
  form.value = {
    deptName: '',
    leader: '',
    phone: '',
    email: '',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑部门'
  form.value = {...row}
  dialogVisible.value = true
}

// 启用/禁用
const handleToggleStatus = (row: any) => {
  const action = row.status === '1' ? '禁用' : '启用'
  ElMessageBox.confirm(`确认${action}该部门?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('切换状态:', row)
    ElMessage.success(`${action}成功`)
  })
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该部门?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('删除:', row)
    ElMessage.success('删除成功')
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交表单:', form.value)
      dialogVisible.value = false
      ElMessage.success(dialogTitle.value === '新增部门' ? '新增成功' : '编辑成功')
    }
  })
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}
</script>

<style scoped>
.departments-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

:deep(.el-select) {
  width: 200px;
}

:deep(.el-input) {
  width: 200px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style> 