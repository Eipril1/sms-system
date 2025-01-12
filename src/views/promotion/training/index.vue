<template>
  <div class="training-container">
    <div class="page-header">
      <h2>安全培训和教育</h2>
    </div>
    
    <!-- 培训管理内容 -->
    <div class="content">
      <el-card class="training-card">
        <template #header>
          <div class="card-header">
            <span>培训计划</span>
            <el-button type="primary">新建培训</el-button>
          </div>
        </template>
        
        <!-- 培训列表 -->
        <el-table :data="trainingList" style="width: 100%">
          <el-table-column prop="name" label="培训名称" />
          <el-table-column prop="type" label="培训类型" />
          <el-table-column prop="startTime" label="开始时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <el-table-column prop="status" label="状态" />
          <el-table-column label="操作" width="200">
            <template #default>
              <el-button link type="primary">查看</el-button>
              <el-button link type="primary">编辑</el-button>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟培训数据
const trainingList = ref([
  {
    name: '2024年第一季度安全培训',
    type: '定期培训',
    startTime: '2024-01-01',
    endTime: '2024-03-31',
    status: '进行中'
  }
])
</script>

<style scoped>
.training-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.training-card {
  margin-bottom: 20px;
}
</style> 