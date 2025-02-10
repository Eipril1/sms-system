<template>
  <div class="dict-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="字典名称">
          <el-input v-model="searchForm.dictName" placeholder="请输入字典名称" clearable/>
        </el-form-item>
        <el-form-item label="字典类型">
          <el-input v-model="searchForm.dictType" placeholder="请输入字典类型" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="启用" value="1"/>
            <el-option label="禁用" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="success" @click="handleAdd">新增字典</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="dictName" label="字典名称" width="150"/>
      <el-table-column prop="dictType" label="字典类型" width="150"/>
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip/>
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
          <el-button link type="primary" @click="handleData(row)">字典数据</el-button>
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

    <!-- 字典表单对话框 -->
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
          label-width="100px"
      >
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称"/>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入描述"
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

    <!-- 字典数据对话框 -->
    <el-dialog
        :title="dictDataTitle"
        v-model="dictDataVisible"
        width="800px"
        :close-on-click-modal="false"
    >
      <div class="dict-data-header">
        <el-button type="success" @click="handleAddData">新增字典数据</el-button>
      </div>
      <el-table :data="dictDataList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center"/>
        <el-table-column prop="label" label="字典标签" width="150"/>
        <el-table-column prop="value" label="字典键值" width="150"/>
        <el-table-column prop="sort" label="排序" width="80"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'">
              {{ row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip/>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEditData(row)">编辑</el-button>
            <el-button
                link
                :type="row.status === '1' ? 'danger' : 'success'"
                @click="handleToggleDataStatus(row)"
            >
              {{ row.status === '1' ? '禁用' : '启用' }}
            </el-button>
            <el-button link type="danger" @click="handleDeleteData(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 字典数据表单对话框 -->
    <el-dialog
        :title="dataFormTitle"
        v-model="dataFormVisible"
        width="500px"
        :close-on-click-modal="false"
    >
      <el-form
          ref="dataFormRef"
          :model="dataForm"
          :rules="dataRules"
          label-width="100px"
      >
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="dataForm.label" placeholder="请输入字典标签"/>
        </el-form-item>
        <el-form-item label="字典键值" prop="value">
          <el-input v-model="dataForm.value" placeholder="请输入字典键值"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="dataForm.sort" :min="0" :max="999"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
              v-model="dataForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dataFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitData">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage, ElMessageBox} from 'element-plus'

// 搜索表单
const searchForm = ref({
  dictName: '',
  dictType: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表格数据
const tableData = ref([
  {
    dictName: '用户性别',
    dictType: 'sys_user_sex',
    description: '用户性别列表',
    status: '1',
    createTime: '2024-01-01 12:00:00'
  }
])

// 字典数据列表
const dictDataList = ref([
  {
    label: '男',
    value: '1',
    sort: 1,
    status: '1',
    remark: '性别男'
  },
  {
    label: '女',
    value: '2',
    sort: 2,
    status: '1',
    remark: '性别女'
  }
])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const form = ref({
  dictName: '',
  dictType: '',
  description: ''
})

// 表单校验规则
const rules: FormRules = {
  dictName: [
    {required: true, message: '请输入字典名称', trigger: 'blur'}
  ],
  dictType: [
    {required: true, message: '请输入字典类型', trigger: 'blur'}
  ]
}

// 字典数据对话框相关
const dictDataVisible = ref(false)
const dictDataTitle = ref('')
const dataFormVisible = ref(false)
const dataFormTitle = ref('')
const dataFormRef = ref<FormInstance>()
const dataForm = ref({
  label: '',
  value: '',
  sort: 0,
  remark: ''
})

// 字典数据表单校验规则
const dataRules: FormRules = {
  label: [
    {required: true, message: '请输入字典标签', trigger: 'blur'}
  ],
  value: [
    {required: true, message: '请输入字典键值', trigger: 'blur'}
  ],
  sort: [
    {required: true, message: '请输入排序号', trigger: 'blur'}
  ]
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 新增字典
const handleAdd = () => {
  dialogTitle.value = '新增字典'
  form.value = {
    dictName: '',
    dictType: '',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑字典
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑字典'
  form.value = {...row}
  dialogVisible.value = true
}

// 查看字典数据
const handleData = (row: any) => {
  dictDataTitle.value = `字典数据 - ${row.dictName}`
  dictDataVisible.value = true
}

// 新增字典数据
const handleAddData = () => {
  dataFormTitle.value = '新增字典数据'
  dataForm.value = {
    label: '',
    value: '',
    sort: 0,
    remark: ''
  }
  dataFormVisible.value = true
}

// 编辑字典数据
const handleEditData = (row: any) => {
  dataFormTitle.value = '编辑字典数据'
  dataForm.value = {...row}
  dataFormVisible.value = true
}

// 启用/禁用字典
const handleToggleStatus = (row: any) => {
  const action = row.status === '1' ? '禁用' : '启用'
  ElMessageBox.confirm(`确认${action}该字典?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('切换状态:', row)
    ElMessage.success(`${action}成功`)
  })
}

// 启用/禁用字典数据
const handleToggleDataStatus = (row: any) => {
  const action = row.status === '1' ? '禁用' : '启用'
  ElMessageBox.confirm(`确认${action}该字典数据?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('切换状态:', row)
    ElMessage.success(`${action}成功`)
  })
}

// 删除字典
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该字典?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('删除:', row)
    ElMessage.success('删除成功')
  })
}

// 删除字典数据
const handleDeleteData = (row: any) => {
  ElMessageBox.confirm('确认删除该字典数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('删除:', row)
    ElMessage.success('删除成功')
  })
}

// 提交字典表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交表单:', form.value)
      dialogVisible.value = false
      ElMessage.success(dialogTitle.value === '新增字典' ? '新增成功' : '编辑成功')
    }
  })
}

// 提交字典数据表单
const handleSubmitData = async () => {
  if (!dataFormRef.value) return
  await dataFormRef.value.validate((valid) => {
    if (valid) {
      console.log('提交表单:', dataForm.value)
      dataFormVisible.value = false
      ElMessage.success(dataFormTitle.value === '新增字典数据' ? '新增成功' : '编辑成功')
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
.dict-container {
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

.dict-data-header {
  margin-bottom: 20px;
}

:deep(.el-input-number) {
  width: 120px;
}
</style> 