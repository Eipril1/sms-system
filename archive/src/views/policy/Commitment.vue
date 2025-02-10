<template>
  <div class="commitment-container">
    <div class="page-header">
      <h2>管理者承诺</h2>
      <el-button type="primary" @click="handleAdd">新增承诺</el-button>
    </div>

    <el-card class="content-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="发布日期" width="180"/>
        <el-table-column prop="title" label="承诺标题"/>
        <el-table-column prop="publisher" label="发布人" width="120"/>
        <el-table-column prop="department" label="部门" width="120"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已发布' ? 'success' : 'warning'">
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
        :title="dialogType === 'add' ? '新增承诺' : '编辑承诺'"
        width="60%"
    >
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="承诺标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入承诺标题"/>
        </el-form-item>
        <el-form-item label="承诺内容" prop="content">
          <el-input
              v-model="form.content"
              type="textarea"
              rows="6"
              placeholder="请输入承诺内容"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
              action="/api/upload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
          >
            <el-button type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看对话框 -->
    <el-dialog v-model="detailVisible" title="承诺详情" width="60%">
      <div class="detail-content">
        <h3>{{ currentItem?.title }}</h3>
        <div class="info-row">
          <span>发布日期：{{ currentItem?.date }}</span>
          <span>发布人：{{ currentItem?.publisher }}</span>
          <span>部门：{{ currentItem?.department }}</span>
        </div>
        <div class="content-box">
          {{ currentItem?.content }}
        </div>
        <div v-if="currentItem?.attachments?.length" class="attachments">
          <h4>附件：</h4>
          <div v-for="file in currentItem.attachments" :key="file.name">
            <el-link @click="downloadFile(file)">{{ file.name }}</el-link>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// 表格数据
const tableData = ref([
  {
    date: '2024-01-01',
    title: '2024年度安全管理承诺',
    publisher: '张三',
    department: '安全监察部',
    status: '已发布',
    content: '我们承诺将安全放在首位...',
    attachments: [
      {name: '安全管理手册.pdf', url: '#'}
    ]
  }
])

// 对话框控制
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentItem = ref<any>(null)

// 表单数据
const form = ref({
  title: '',
  content: '',
  attachments: []
})

// 操作方法
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {title: '', content: '', attachments: []}
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = {...row}
  dialogVisible.value = true
}

const handleView = (row: any) => {
  currentItem.value = row
  detailVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该承诺？', '提示', {
    type: 'warning'
  })
}

const handleSubmit = () => {
  dialogVisible.value = false
  ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
}

const handleUploadSuccess = (response: any) => {
  ElMessage.success('上传成功')
}

const handleUploadError = () => {
  ElMessage.error('上传失败')
}

const downloadFile = (file: any) => {
  window.open(file.url)
}
</script>

<style scoped>
.commitment-container {
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

.detail-content {
  padding: 20px;
}

.info-row {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  color: #666;
}

.content-box {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
  line-height: 1.6;
}

.attachments {
  margin-top: 20px;
}
</style> 