<template>
  <div class="users-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.realName" placeholder="请输入姓名" clearable/>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
            <el-option label="全部" value=""/>
            <el-option label="飞行部" value="飞行部"/>
            <el-option label="维修部" value="维修部"/>
            <el-option label="地面服务部" value="地面服务部"/>
          </el-select>
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
          <el-button type="success" @click="handleAdd">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="username" label="用户名" width="120"/>
      <el-table-column prop="realName" label="姓名" width="120"/>
      <el-table-column prop="department" label="部门" width="150"/>
      <el-table-column prop="role" label="角色" width="150"/>
      <el-table-column prop="phone" label="手机号" width="120"/>
      <el-table-column prop="email" label="邮箱" width="180"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"/>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleReset(row)">重置密码</el-button>
          <el-button
              link
              :type="row.status === '1' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
          >
            {{ row.status === '1' ? '禁用' : '启用' }}
          </el-button>
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

    <!-- 用户表单对话框 -->
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择">
            <el-option label="飞行部" value="飞行部"/>
            <el-option label="维修部" value="维修部"/>
            <el-option label="地面服务部" value="地面服务部"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择">
            <el-option label="管理员" value="admin"/>
            <el-option label="普通用户" value="user"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"/>
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
import type {FormInstance, FormRules} from 'element-plus'

// 搜索表单
const searchForm = ref({
  username: '',
  realName: '',
  department: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表格数据
const tableData = ref([
  {
    username: 'admin',
    realName: '管理员',
    department: '系统管理部',
    role: '管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    status: '1',
    createTime: '2024-01-01 12:00:00'
  }
])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const form = ref({
  username: '',
  realName: '',
  department: '',
  role: '',
  phone: '',
  email: ''
})

// 表单校验规则
const rules: FormRules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
  ],
  realName: [
    {required: true, message: '请输入姓名', trigger: 'blur'}
  ],
  department: [
    {required: true, message: '请选择部门', trigger: 'change'}
  ],
  role: [
    {required: true, message: '请选择角色', trigger: 'change'}
  ],
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
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
  dialogTitle.value = '新增用户'
  form.value = {
    username: '',
    realName: '',
    department: '',
    role: '',
    phone: '',
    email: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑用户'
  form.value = {...row}
  dialogVisible.value = true
}

// 重置密码
const handleReset = (row: any) => {
  console.log('重置密码:', row)
}

// 启用/禁用
const handleToggleStatus = (row: any) => {
  console.log('切换状态:', row)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交表单:', form.value)
      dialogVisible.value = false
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
.users-container {
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