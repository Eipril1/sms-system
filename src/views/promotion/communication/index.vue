<template>
  <div class="communication-container">
    <div class="page-header">
      <h2>安全交流</h2>
    </div>
    
    <!-- 安全交流内容 -->
    <div class="content">
      <el-row :gutter="20">
        <!-- 安全通告 -->
        <el-col :span="16">
          <el-card class="notice-card">
            <template #header>
              <div class="card-header">
                <span>安全通告</span>
                <el-button type="primary">发布通告</el-button>
              </div>
            </template>
            
            <el-table :data="noticeList" style="width: 100%">
              <el-table-column prop="title" label="标题" />
              <el-table-column prop="type" label="类型" width="120" />
              <el-table-column prop="publishTime" label="发布时间" width="180" />
              <el-table-column prop="status" label="状态" width="100" />
              <el-table-column label="操作" width="150">
                <template #default>
                  <el-button link type="primary">查看</el-button>
                  <el-button link type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        
        <!-- 快速入口 -->
        <el-col :span="8">
          <el-card class="quick-links">
            <template #header>
              <div class="card-header">
                <span>快速入口</span>
              </div>
            </template>
            
            <div class="link-list">
              <el-button type="primary" plain block class="link-item">
                <el-icon><Document /></el-icon>
                安全简报
              </el-button>
              <el-button type="success" plain block class="link-item">
                <el-icon><ChatDotRound /></el-icon>
                经验分享
              </el-button>
              <el-button type="warning" plain block class="link-item">
                <el-icon><Bell /></el-icon>
                预警信息
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document, ChatDotRound, Bell } from '@element-plus/icons-vue'

// 模拟通告数据
const noticeList = ref([
  {
    title: '关于加强冬季安全运行的通知',
    type: '安全通告',
    publishTime: '2024-01-15 10:00:00',
    status: '已发布'
  }
])
</script>

<style scoped>
.communication-container {
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

.notice-card {
  margin-bottom: 20px;
}

.quick-links {
  .link-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .link-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    
    .el-icon {
      margin-right: 8px;
    }
  }
}
</style> 