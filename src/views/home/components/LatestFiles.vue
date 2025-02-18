<template>
  <div class="latest-files">
    <div class="header">
      <span>最新文件</span>
      <el-button link type="primary" @click="handleMore">更多</el-button>
    </div>
    
    <div class="file-list">
      <div v-for="file in fileList" :key="file.id" class="file-item">
        <div class="file-info">
          <el-icon><Document /></el-icon>
          <span class="file-name" :title="file.name">{{ file.name }}</span>
        </div>
        <div class="file-actions">
          <span class="file-date">{{ file.date }}</span>
          <el-button 
            link 
            type="primary" 
            size="small"
            @click="handleDownload(file)"
          >
            下载
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { DocumentIcon } from '@element-plus/icons-vue'
import type { ElMessage } from 'element-plus'

interface FileItem {
  id: number
  name: string
  date: string
  url?: string
}

const fileList = ref<FileItem[]>([
  { 
    id: 1, 
    name: '2024年度安全管理人员培训计划.pdf', 
    date: '2024-03-27' 
  },
  { 
    id: 2, 
    name: '安全检查管理规定与实施细则.zip', 
    date: '2024-03-26' 
  },
  { 
    id: 3, 
    name: '关于加强安全生产工作的通知.doc', 
    date: '2024-03-25' 
  },
  { 
    id: 4, 
    name: '2024年第一季度安全检查报告.pdf', 
    date: '2024-03-24' 
  },
  { 
    id: 5, 
    name: '安全隐患排查治理制度.doc', 
    date: '2024-03-23' 
  }
])

const handleDownload = (file: FileItem) => {
  // TODO: 实现文件下载逻辑
  ElMessage.success(`开始下载: ${file.name}`)
}

const handleMore = () => {
  // TODO: 跳转到文件管理页面
  console.log('查看更多文件')
}
</script>

<style scoped lang="scss">
.latest-files {
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  span {
    font-size: 16px;
    font-weight: 500;
  }
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
  
  &:last-child {
    border-bottom: none;
  }
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    
    .el-icon {
      color: #909399;
      flex-shrink: 0;
    }
    
    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #303133;
    }
  }
  
  .file-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    
    .file-date {
      color: #909399;
      font-size: 13px;
    }
  }
}
</style> 