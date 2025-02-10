<template>
  <div class="key-personnel-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>任命关键安全人员</h2>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAdd">
          <el-icon>
            <Plus/>
          </el-icon>
          新增人员
        </el-button>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="职位">
          <el-select v-model="searchForm.position" placeholder="请选择职位" clearable>
            <el-option label="安全总监" value="director"/>
            <el-option label="安全经理" value="manager"/>
            <el-option label="安全员" value="staff"/>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="searchForm.department" placeholder="请输入部门" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 人员列表 -->
    <el-table :data="personnelList" border style="width: 100%">
      <el-table-column prop="name" label="姓名" width="120"/>
      <el-table-column prop="position" label="职位" width="120"/>
      <el-table-column prop="department" label="部门" width="150"/>
      <el-table-column prop="appointmentDate" label="任命日期" width="180"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '在职' : '离职' }}
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
      />
    </div>

    <!-- 表单对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增人员' : '编辑人员'"
        width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-select v-model="form.position" placeholder="请选择职位">
            <el-option label="安全总监" value="director"/>
            <el-option label="安全经理" value="manager"/>
            <el-option label="安全员" value="staff"/>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入部门"/>
        </el-form-item>
        <el-form-item label="任命日期" prop="appointmentDate">
          <el-date-picker
              v-model="form.appointmentDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">在职</el-radio>
            <el-radio label="inactive">离职</el-radio>
          </el-radio-group>
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
import {Plus} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'

// 搜索表单
const searchForm = ref({
  position: '',
  department: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 人员列表数据
const personnelList = ref([
  {
    name: '张三',
    position: '安全总监',
    department: '安全管理部',
    appointmentDate: '2024-01-01',
    status: 'active'
  }
])

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = ref({
  name: '',
  position: '',
  department: '',
  appointmentDate: '',
  status: 'active'
})

// 表单验证规则
const rules = {
  name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
  position: [{required: true, message: '请选择职位', trigger: 'change'}],
  department: [{required: true, message: '请输入部门', trigger: 'blur'}],
  appointmentDate: [{required: true, message: '请选择任命日期', trigger: 'change'}]
}

// 处理搜索
const handleSearch = () => {
  // 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    position: '',
    department: ''
  }
  handleSearch()
}

// 新增人员
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    position: '',
    department: '',
    appointmentDate: '',
    status: 'active'
  }
  dialogVisible.value = true
}

// 编辑人员
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = {...row}
  dialogVisible.value = true
}

// 查看人员
const handleView = (row: any) => {
  // 实现查看逻辑
}

// 删除人员
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该人员？', '提示', {
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
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
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

.search-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style> 