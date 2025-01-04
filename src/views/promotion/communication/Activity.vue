<template>
  <div class="activity-container">
    <!-- 顶部工具栏 -->
    <div class="content-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增活动
      </el-button>
    </div>

    <!-- 活动记录列表 -->
    <el-table :data="activityList" border style="width: 100%">
      <el-table-column prop="title" label="活动名称" />
      <el-table-column prop="date" label="活动日期" width="160" />
      <el-table-column prop="location" label="活动地点" width="120" />
      <el-table-column prop="organizer" label="组织者" width="120" />
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
      :title="dialogType === 'add' ? '新增活动' : '编辑活动'"
      width="60%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择活动日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="活动地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入活动地点" />
        </el-form-item>
        <el-form-item label="组织者" prop="organizer">
          <el-input v-model="form.organizer" placeholder="请输入组织者" />
        </el-form-item>
        <el-form-item label="活动内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入活动内容"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

// 活动列表数据
const activityList = ref([
  {
    title: '2024年第一季度安全生产例会',
    date: '2024-01-20',
    location: '公司会议室A',
    organizer: '安全管理部',
    content: '讨论Q1安全生产重点工作...'
  },
  {
    title: '机务维修部安全专项培训',
    date: '2024-02-01',
    location: '培训中心',
    organizer: '机务部',
    content: '针对新引进机型的维修安全培训...'
  },
  {
    title: '空勤人员安全研讨会',
    date: '2024-02-15',
    location: '飞行训练中心',
    organizer: '飞行部',
    content: '交流分享飞行安全经验...'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 表单对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = ref({
  title: '',
  date: '',
  location: '',
  organizer: '',
  content: ''
})

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  date: [{ required: true, message: '请选择活动日期', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  organizer: [{ required: true, message: '请输入组织者', trigger: 'blur' }]
}

// 新增活动
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    title: '',
    date: '',
    location: '',
    organizer: '',
    content: ''
  }
  dialogVisible.value = true
}

// 编辑活动
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 查看活动
const handleView = (row: any) => {
  // 实现查看逻辑
}

// 删除活动
const handleDelete = (row: any) => {
  // 实现删除逻辑
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.activity-container {
  padding: 20px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 