<template>
  <div class="commitment-container">
    <div class="page-header">
      <h2>管理者承诺</h2>
      <el-button type="primary" @click="handleAdd">新增承诺</el-button>
    </div>

    <!-- 承诺列表 -->
    <el-card class="content-card">
      <el-table :data="commitmentList" style="width: 100%">
        <el-table-column prop="code" label="承诺编号" width="120" />
        <el-table-column prop="title" label="承诺标题" min-width="200" />
        <el-table-column prop="issuer" label="承诺人" width="120" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="issueDate" label="发布日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '有效' ? 'success' : 'info'">
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
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="承诺标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入承诺标题" />
        </el-form-item>
        <el-form-item label="承诺人" prop="issuer">
          <el-input v-model="form.issuer" placeholder="请输入承诺人" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="承诺内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入承诺内容"
          />
        </el-form-item>
        <el-form-item label="发布日期" prop="issueDate">
          <el-date-picker
            v-model="form.issueDate"
            type="date"
            placeholder="请选择发布日期"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="承诺详情"
      width="600px"
    >
      <div class="commitment-detail" v-if="currentCommitment">
        <h3>{{ currentCommitment.title }}</h3>
        <div class="detail-info">
          <p><span class="label">承诺人：</span>{{ currentCommitment.issuer }}</p>
          <p><span class="label">职位：</span>{{ currentCommitment.position }}</p>
          <p><span class="label">发布日期：</span>{{ currentCommitment.issueDate }}</p>
        </div>
        <div class="detail-content">
          <h4>承诺内容：</h4>
          <p>{{ currentCommitment.content }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 列表数据
const commitmentList = ref([
  {
    code: 'CM001',
    title: '2024年度安全管理承诺',
    issuer: '张三',
    position: '总经理',
    issueDate: '2024-01-01',
    status: '有效',
    content: '我们承诺将安全放在首位，持续改进安全管理体系...'
  }
])

// 对话框控制
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const currentCommitment = ref()

// 表单数据
const form = ref({
  title: '',
  issuer: '',
  position: '',
  content: '',
  issueDate: ''
})

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入承诺标题', trigger: 'blur' }],
  issuer: [{ required: true, message: '请输入承诺人', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  content: [{ required: true, message: '请输入承诺内容', trigger: 'blur' }],
  issueDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }]
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    title: '',
    issuer: '',
    position: '',
    content: '',
    issueDate: ''
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
  currentCommitment.value = row
  detailVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该承诺？', '提示', {
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

.commitment-detail {
  h3 {
    margin-bottom: 20px;
    color: #303133;
  }

  .detail-info {
    margin-bottom: 20px;
    
    .label {
      display: inline-block;
      width: 100px;
      color: #909399;
    }
  }

  .detail-content {
    h4 {
      margin-bottom: 10px;
      color: #606266;
    }

    p {
      line-height: 1.6;
      color: #303133;
    }
  }
}
</style> 