<template>
  <div class="training-implementation">
    <el-tabs v-model="activeTab">
      <!-- 培训实施 -->
      <el-tab-pane label="培训实施" name="implementation">
        <div class="implementation-section">
          <!-- 实施记录 -->
          <el-table :data="implementationList">
            <el-table-column prop="planName" label="培训计划" />
            <el-table-column prop="trainer" label="培训讲师" />
            <el-table-column prop="date" label="培训日期" />
            <el-table-column prop="location" label="培训地点" />
            <el-table-column prop="status" label="实施状态" />
            <!-- 其他列... -->
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 培训记录保存 -->
      <el-tab-pane label="培训记录" name="record">
        <div class="record-section">
          <!-- 培训记录表单 -->
          <el-form :model="recordForm" label-width="100px">
            <el-form-item label="培训内容">
              <el-input type="textarea" v-model="recordForm.content" />
            </el-form-item>
            <el-form-item label="培训照片">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="签到表">
              <el-upload
                action="#"
                :auto-upload="false"
              >
                <el-button type="primary">上传签到表</el-button>
              </el-upload>
            </el-form-item>
            <!-- 其他记录项... -->
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 当前激活的标签页
const activeTab = ref('implementation')

// 实施记录列表
const implementationList = ref([
  {
    planName: '飞行员年度复训',
    trainer: '王教员',
    date: '2024-01-15',
    location: '飞行训练中心',
    status: '进行中',
    attendees: '25人',
    completion: '80%'
  },
  {
    planName: '客舱服务标准培训',
    trainer: '李教员',
    date: '2024-01-10',
    location: '培训教室B',
    status: '已完成',
    attendees: '30人',
    completion: '100%'
  }
])

// 记录表单
const recordForm = ref({
  planId: '',
  content: '',
  photos: [],
  attendance: null,
  materials: [],
  notes: ''
})

// 表单验证规则
const rules = {
  content: [{ required: true, message: '请输入培训内容', trigger: 'blur' }],
  attendance: [{ required: true, message: '请上传签到表', trigger: 'change' }]
}

// 上传配置
const uploadConfig = {
  action: '/api/upload',
  headers: {
    // 配置上传请求头
  }
}

// 处理照片上传
const handlePhotoSuccess = (response: any) => {
  recordForm.value.photos.push(response.url)
}

// 处理签到表上传
const handleAttendanceSuccess = (response: any) => {
  recordForm.value.attendance = response.url
}

// 保存记录
const handleSave = () => {
  // 实现保存逻辑
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.training-implementation {
  padding: 20px;
}

.implementation-section,
.record-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.el-form {
  max-width: 800px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

/* 自定义上传组件样式 */
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 120px;
  height: 120px;
}

:deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
  line-height: 130px;
}
</style> 