<template>
  <div class="policy-container">
    <div class="page-header">
      <h2>安全政策管理</h2>
      <el-button type="primary" @click="handleAdd">新增政策</el-button>
    </div>

    <!-- 政策列表 -->
    <el-card class="content-card">
      <el-table :data="policyList" style="width: 100%">
        <el-table-column prop="code" label="政策编号" width="120" />
        <el-table-column prop="title" label="政策标题" min-width="200" />
        <el-table-column prop="issuer" label="发布人" width="120" />
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

    <!-- 其他对话框组件保持不变 -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 列表数据
const policyList = ref([
  {
    code: 'SP001',
    title: '2024年度安全管理政策',
    issuer: '张三',
    position: '总经理',
    issueDate: '2024-01-01',
    status: '有效',
    content: '为确保公司安全运营，特制定以下安全管理政策：\n1. 安全第一，预防为主\n2. 全员参与，持续改进\n3. 遵守法规，控制风险'
  },
  {
    code: 'SP002',
    title: '飞行安全管理规定',
    issuer: '李四',
    position: '安全总监',
    issueDate: '2024-01-15',
    status: '有效',
    content: '关于加强飞行安全管理的若干规定...'
  },
  {
    code: 'SP003',
    title: '维修安全管理制度',
    issuer: '王五',
    position: '维修总监',
    issueDate: '2024-02-01',
    status: '有效',
    content: '维修安全管理制度详细内容...'
  }
])

// 对话框控制
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentPolicy = ref()

// 表单数据
const form = ref({
  title: '',
  issuer: '',
  position: '',
  content: '',
  issueDate: ''
})

// 处理查看
const handleView = (row: any) => {
  currentPolicy.value = row
  detailVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该政策？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

// 处理新增
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
</script>

<style scoped>
.policy-container {
  height: 100%;
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