<template>
  <div class="notifications">
    <div class="header">
      <span>通知公告</span>
      <el-button link type="primary" @click="handleMore">更多</el-button>
    </div>
    
    <div class="notice-list">
      <div v-for="notice in noticeList" :key="notice.id" class="notice-item">
        <div class="notice-info">
          <el-tag 
            size="small" 
            :type="notice.type"
            class="notice-tag"
          >
            {{ notice.category }}
          </el-tag>
          <span class="notice-title" :title="notice.title">{{ notice.title }}</span>
        </div>
        <span class="notice-date">{{ notice.date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

interface NoticeItem {
  id: number
  title: string
  date: string
  category: string
  type: '' | 'success' | 'warning' | 'info' | 'danger'
}

const noticeList = ref<NoticeItem[]>([
  { 
    id: 1, 
    title: '关于开展2024年度安全生产大检查的通知', 
    date: '2024-03-27',
    category: '安全检查',
    type: 'warning'
  },
  { 
    id: 2, 
    title: '安全管理体系修订版发布及培训通知', 
    date: '2024-03-26',
    category: '体系管理',
    type: 'info'
  },
  { 
    id: 3, 
    title: '关于加强春运期间安全管理工作的通知', 
    date: '2024-03-25',
    category: '运行管理',
    type: 'warning'
  },
  { 
    id: 4, 
    title: '2024年度安全管理人员持证培训通知', 
    date: '2024-03-24',
    category: '培训管理',
    type: 'success'
  },
  { 
    id: 5, 
    title: '关于组织开展安全文化建设活动的通知', 
    date: '2024-03-23',
    category: '安全文化',
    type: 'info'
  }
])

const handleMore = () => {
  // TODO: 跳转到通知公告页面
  console.log('查看更多通知')
}
</script>

<style scoped lang="scss">
.notifications {
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

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
  
  &:last-child {
    border-bottom: none;
  }
  
  .notice-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    
    .notice-tag {
      flex-shrink: 0;
    }
    
    .notice-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #303133;
    }
  }
  
  .notice-date {
    color: #909399;
    font-size: 13px;
    flex-shrink: 0;
  }
}
</style> 