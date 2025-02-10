<template>
  <div class="roles-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" clearable/>
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
          <el-button type="success" @click="handleAdd">新增角色</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="roleCode" label="角色编码" width="120"/>
      <el-table-column prop="roleName" label="角色名称" width="150"/>
      <el-table-column prop="description" label="角色描述" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"/>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handlePermission(row)">权限设置</el-button>
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

    <!-- 角色表单对话框 -->
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色编码"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入角色描述"
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

    <!-- 权限设置对话框 -->
    <el-dialog
        title="权限设置"
        v-model="permissionVisible"
        width="600px"
        :close-on-click-modal="false"
    >
      <el-tree
          ref="treeRef"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="checkedKeys"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePermission">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessageBox, ElMessage} from 'element-plus'

// 搜索表单
const searchForm = ref({
  roleName: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表格数据
const tableData = ref([
  {
    roleCode: 'ADMIN',
    roleName: '系统管理员',
    description: '系统管理员，拥有所有权限',
    status: '1',
    createTime: '2024-01-01 12:00:00'
  },
  {
    roleCode: 'USER',
    roleName: '普通用户',
    description: '普通用户，拥有基本权限',
    status: '1',
    createTime: '2024-01-01 12:00:00'
  }
])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const form = ref({
  roleName: '',
  roleCode: '',
  description: ''
})

// 表单校验规则
const rules: FormRules = {
  roleName: [
    {required: true, message: '请输入角色名称', trigger: 'blur'}
  ],
  roleCode: [
    {required: true, message: '请输入角色编码', trigger: 'blur'}
  ]
}

// 权限树相关
const permissionVisible = ref(false)
const treeRef = ref()
const checkedKeys = ref<number[]>([])
const permissionTree = ref([
  {
    id: 1,
    label: '系统管理',
    children: [
      {id: 11, label: '用户管理'},
      {id: 12, label: '角色管理'},
      {id: 13, label: '菜单管理'}
    ]
  },
  {
    id: 2,
    label: '业务管理',
    children: [
      {id: 21, label: '业务功能1'},
      {id: 22, label: '业务功能2'}
    ]
  }
])
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增角色'
  form.value = {
    roleName: '',
    roleCode: '',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑角色'
  form.value = {...row}
  dialogVisible.value = true
}

// 权限设置
const handlePermission = (row: any) => {
  console.log('设置权限:', row)
  checkedKeys.value = [11, 21] // 模拟已有权限
  permissionVisible.value = true
}

// 保存权限
const handleSavePermission = () => {
  if (!treeRef.value) return
  const {checkedKeys, halfCheckedKeys} = treeRef.value.getCheckedKeys(true)
  console.log('选中的权限:', checkedKeys, halfCheckedKeys)
  permissionVisible.value = false
  ElMessage.success('权限设置成功')
}

// 启用/禁用
const handleToggleStatus = (row: any) => {
  const action = row.status === '1' ? '禁用' : '启用'
  ElMessageBox.confirm(`确认${action}该角色?`, '提示', {
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
  ElMessageBox.confirm('确认删除该角色?', '提示', {
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
      ElMessage.success(dialogTitle.value === '新增角色' ? '新增成功' : '编辑成功')
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
.roles-container {
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