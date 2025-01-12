<template>
  <div class="sms-doc-container">
    <div class="page-header">
      <h2>SMS文件</h2>
      <el-button type="primary" @click="handleAdd">新增文件</el-button>
    </div>

    <!-- 文件列表 -->
    <el-card class="content-card">
      <el-table :data="docList" style="width: 100%">
        <el-table-column prop="code" label="文件编号" width="120" />
        <el-table-column prop="name" label="文件名称" min-width="200" />
        <el-table-column prop="type" label="文件类型" width="120" />
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '有效' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDownload(row)">下载</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增文件' : '编辑文件'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="文件类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择文件类型">
            <el-option label="管理手册" value="manual" />
            <el-option label="程序文件" value="procedure" />
            <el-option label="工作文件" value="work" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="文件上传" prop="file">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                支持 doc, docx, pdf 格式文件
              </div>
            </template>
          </el-upload>
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
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = ref({
  name: '',
  type: '',
  version: '',
  file: null
})

// 文件列表数据
const docList = ref([
  {
    code: 'SMS001',
    name: '安全管理手册V1.0',
    type: '管理手册',
    version: 'V1.0',
    updateTime: '2024-01-15 10:00:00',
    status: '有效'
  }
])

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入文件名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择文件类型', trigger: 'change' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }]
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    type: '',
    version: '',
    file: null
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 下载
const handleDownload = (row: any) => {
  // 实现下载逻辑
  ElMessage.success('开始下载文件：' + row.name)
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该文件？', '提示', {
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
.sms-doc-container {
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

.upload-demo {
  margin-top: 8px;
}
</style> 