<template>
  <div class="task-statistics">
    <!-- 标题栏 -->
    <div class="header">
      <span>待办任务</span>
      <el-radio-group v-model="timeRange" size="small">
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="all">全部</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 任务列表 -->
    <div class="task-list">
      <div 
        v-for="task in taskList" 
        :key="task.type" 
        class="task-item"
        @click="handleTaskClick(task)"
      >
        <div class="task-icon" :class="task.type">
          <el-icon :size="24">
            <component :is="task.icon" />
          </el-icon>
        </div>
        <div class="task-info">
          <h4>{{ task.title }}</h4>
          <p>{{ task.count }}条待处理</p>
        </div>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Warning, List, Calendar, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const timeRange = ref('week')

const taskList = ref([
  { type: 'info', title: '自愿报告', count: 5, icon: Document },
  { type: 'warning', title: '强制报告', count: 3, icon: Warning },
  { type: 'check', title: '日常检查', count: 4, icon: List },
  { type: 'audit', title: '法定检查', count: 2, icon: Calendar }
])

// 处理任务点击
const handleTaskClick = (task: any) => {
  const routeMap: Record<string, string> = {
    info: '/assurance/info/voluntary-report',
    warning: '/assurance/info/mandatory-report',
    check: '/assurance/supervision/daily',
    audit: '/assurance/supervision/statutory'
  }
  
  if (routeMap[task.type]) {
    router.push(routeMap[task.type])
  }
}

// 监听时间范围变化
watch(timeRange, (newValue) => {
  // TODO: 根据时间范围获取对应的任务数据
  console.log('时间范围改变:', newValue)
})
</script>

<style scoped lang="scss">
.task-statistics {
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #ecf5ff;
    
    .arrow-icon {
      transform: translateX(4px);
      opacity: 1;
    }
  }
  
  .task-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    
    .el-icon {
      color: white;
    }
    
    &.info { background-color: #409EFF; }
    &.warning { background-color: #E6A23C; }
    &.check { background-color: #67C23A; }
    &.audit { background-color: #909399; }
  }
  
  .task-info {
    flex: 1;
    
    h4 {
      margin: 0;
      font-size: 14px;
      color: #303133;
    }
    
    p {
      margin: 4px 0 0;
      font-size: 12px;
      color: #909399;
    }
  }
  
  .arrow-icon {
    color: #909399;
    transition: all 0.3s;
    opacity: 0;
  }
}
</style> 