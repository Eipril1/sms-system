<template>
  <div class="key-personnel-container">
    <div class="page-header">
      <h2>任命关键安全人员</h2>
      <el-button type="primary" @click="handleAdd">新增任命</el-button>
    </div>

    <!-- 人员列表 -->
    <el-card class="content-card">
      <el-table :data="personnelList" style="width: 100%">
        <el-table-column prop="code" label="任命编号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="role" label="安全职责" min-width="200" show-overflow-tooltip />
        <el-table-column prop="appointDate" label="任命日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '在职' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增任命' : '编辑任命'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="安全职责" prop="role">
          <el-input
            v-model="form.role"
            type="textarea"
            :rows="4"
            placeholder="请输入安全职责"
          />
        </el-form-item>
        <el-form-item label="任命日期" prop="appointDate">
          <el-date-picker
            v-model="form.appointDate"
            type="date"
            placeholder="请选择任命日期"
          />
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

// 列表数据
const personnelList = ref([
  {
    code: 'KP001',
    name: '张三',
    position: '安全总监',
    department: '安全管理部',
    role: '负责公司整体安全管理工作，确保安全管理体系有效运行...',
    appointDate: '2024-01-01',
    status: '在职'
  }
])

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()

// 表单数据
const form = ref({
  name: '',
  position: '',
  department: '',
  role: '',
  appointDate: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  role: [{ required: true, message: '请输入安全职责', trigger: 'blur' }],
  appointDate: [{ required: true, message: '请选择任命日期', trigger: 'change' }]
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    position: '',
    department: '',
    role: '',
    appointDate: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 查看
const handleView = (row: any) => {
  // 实现查看逻辑
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该任命记录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
    }
  })
}
</script>

<style scoped>
.key-personnel-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-card {
  margin-bottom: 20px;
}
</style> 