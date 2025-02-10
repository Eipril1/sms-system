<template>
  <div class="menus-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="菜单名称">
          <el-input v-model="searchForm.menuName" placeholder="请输入菜单名称" clearable/>
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
          <el-button type="success" @click="handleAdd">新增菜单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-table
        :data="tableData"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="menuName" label="菜单名称" width="180"/>
      <el-table-column prop="icon" label="图标" width="80">
        <template #default="{ row }">
          <el-icon v-if="row.icon">
            <component :is="row.icon"/>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="菜单类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'menu' ? '' : 'info'">
            {{ row.type === 'menu' ? '菜单' : '按钮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="80"/>
      <el-table-column prop="perms" label="权限标识" min-width="150" show-overflow-tooltip/>
      <el-table-column prop="path" label="路由地址" min-width="150" show-overflow-tooltip/>
      <el-table-column prop="component" label="组件路径" min-width="150" show-overflow-tooltip/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleAdd(row)">新增</el-button>
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

    <!-- 菜单表单对话框 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
        :close-on-click-modal="false"
    >
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
      >
        <el-form-item label="上级菜单">
          <el-tree-select
              v-model="form.parentId"
              :data="menuTree"
              placeholder="请选择上级菜单"
              :props="{ label: 'menuName', value: 'id' }"
              check-strictly
              clearable
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="图标" v-if="form.type === 'menu'">
          <el-input v-model="form.icon" placeholder="请输入图标名称"/>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" :max="999"/>
        </el-form-item>
        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="form.perms" placeholder="请输入权限标识"/>
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-if="form.type === 'menu'">
          <el-input v-model="form.path" placeholder="请输入路由地址"/>
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="form.type === 'menu'">
          <el-input v-model="form.component" placeholder="请输入组件路径"/>
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
  menuName: '',
  status: ''
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    menuName: '系统管理',
    icon: 'Setting',
    type: 'menu',
    orderNum: 1,
    perms: 'system',
    path: '/system',
    component: 'Layout',
    status: '1',
    children: [
      {
        id: 11,
        menuName: '用户管理',
        icon: 'User',
        type: 'menu',
        orderNum: 1,
        perms: 'system:user',
        path: 'users',
        component: '/system/users/index',
        status: '1'
      },
      {
        id: 12,
        menuName: '角色管理',
        icon: 'UserFilled',
        type: 'menu',
        orderNum: 2,
        perms: 'system:role',
        path: 'roles',
        component: '/system/roles/index',
        status: '1'
      }
    ]
  }
])

// 菜单树数据
const menuTree = ref([
  {
    id: 0,
    menuName: '主目录',
    children: [...tableData.value]
  }
])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const form = ref({
  parentId: '',
  type: 'menu',
  menuName: '',
  icon: '',
  orderNum: 0,
  perms: '',
  path: '',
  component: ''
})

// 表单校验规则
const rules: FormRules = {
  type: [
    {required: true, message: '请选择菜单类型', trigger: 'change'}
  ],
  menuName: [
    {required: true, message: '请输入菜单名称', trigger: 'blur'}
  ],
  orderNum: [
    {required: true, message: '请输入排序号', trigger: 'blur'}
  ]
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 新增
const handleAdd = (row?: any) => {
  dialogTitle.value = '新增菜单'
  form.value = {
    parentId: row?.id || '',
    type: 'menu',
    menuName: '',
    icon: '',
    orderNum: 0,
    perms: '',
    path: '',
    component: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑菜单'
  form.value = {...row}
  dialogVisible.value = true
}

// 启用/禁用
const handleToggleStatus = (row: any) => {
  const action = row.status === '1' ? '禁用' : '启用'
  ElMessageBox.confirm(`确认${action}该菜单?`, '提示', {
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
  ElMessageBox.confirm('确认删除该菜单?', '提示', {
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
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('提交表单:', form.value)
      dialogVisible.value = false
      ElMessage.success(dialogTitle.value === '新增菜单' ? '新增成功' : '编辑成功')
    }
  })
}
</script>

<style scoped>
.menus-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

:deep(.el-select),
:deep(.el-tree-select) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 120px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style> 