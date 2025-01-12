<template>
  <el-popover
    placement="bottom"
    :width="400"
    trigger="click"
    popper-class="task-reminder-popover"
  >
    <template #reference>
      <el-badge :value="reminderCount" :hidden="!reminderCount">
        <el-button :type="reminderCount ? 'warning' : 'info'" circle>
          <el-icon><Bell /></el-icon>
        </el-button>
      </el-badge>
    </template>

    <template #default>
      <div class="reminder-header">
        <span class="title">任务提醒 ({{ reminderCount }})</span>
        <el-button type="primary" link @click="markAllRead">全部已读</el-button>
      </div>
      <el-scrollbar max-height="400px">
        <div class="reminder-list">
          <div 
            v-for="item in reminders" 
            :key="item.id"
            class="reminder-item"
            :class="{ unread: !item.read }"
          >
            <div class="reminder-content">
              <el-icon :class="getIconClass(item.type)">
                <component :is="getIcon(item.type)" />
              </el-icon>
              <div class="reminder-info">
                <div class="reminder-text">{{ item.content }}</div>
                <div class="reminder-time">{{ item.time }}</div>
              </div>
            </div>
            <el-button 
              type="primary" 
              link 
              size="small"
              @click="handleAction(item)"
            >
              {{ getActionText(item.type) }}
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Bell, Timer, Warning, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['action'])

interface Reminder {
  id: number
  type: 'upcoming' | 'overdue' | 'completed' | 'warning'
  content: string
  time: string
  read: boolean
  taskNo?: string
  priority?: 'high' | 'medium' | 'low'
}

const reminders = ref<Reminder[]>([
  {
    id: 1,
    type: 'upcoming',
    content: '飞行部运行合格审定自查任务将在3天后开始',
    time: '2024-03-20',
    read: false,
    taskNo: 'SC-2024001',
    priority: 'high'
  },
  {
    id: 2,
    type: 'overdue',
    content: '维修部自查任务已逾期2天',
    time: '2024-03-15',
    read: false,
    taskNo: 'SC-2024002',
    priority: 'high'
  },
  {
    id: 3,
    type: 'warning',
    content: '本月法定自查计划完成率低于80%',
    time: '2024-03-18',
    read: false,
    priority: 'medium'
  },
  {
    id: 4,
    type: 'completed',
    content: '训练大纲自查任务已完成',
    time: '2024-03-10',
    read: true,
    taskNo: 'SC-2024003'
  }
])

const reminderCount = computed(() => 
  reminders.value.filter(item => !item.read).length
)

const getIcon = (type: string) => {
  const map: Record<string, any> = {
    upcoming: Timer,
    overdue: Warning,
    completed: Check
  }
  return map[type]
}

const getIconClass = (type: string) => {
  return {
    'reminder-icon': true,
    'upcoming': type === 'upcoming',
    'overdue': type === 'overdue',
    'completed': type === 'completed'
  }
}

const getActionText = (type: string) => {
  const map: Record<string, string> = {
    upcoming: '查看任务',
    overdue: '立即处理',
    completed: '查看报告'
  }
  return map[type] || '查看'
}

const handleAction = (item: Reminder) => {
  item.read = true
  switch (item.type) {
    case 'upcoming':
    case 'overdue':
      if (item.taskNo) {
        emit('action', { type: 'view', taskNo: item.taskNo })
      }
      break
    case 'completed':
      if (item.taskNo) {
        emit('action', { type: 'report', taskNo: item.taskNo })
      }
      break
    case 'warning':
      router.push('/assurance/supervision/statutory/plan')
      break
  }
}

const markAllRead = () => {
  reminders.value.forEach(item => item.read = true)
}

const getPriorityClass = (priority?: string) => {
  return {
    'priority-dot': true,
    'priority-high': priority === 'high',
    'priority-medium': priority === 'medium',
    'priority-low': priority === 'low'
  }
}

onMounted(() => {
  checkOverdueTasks()
  const timer = setInterval(checkOverdueTasks, 1000 * 60 * 60) // 每小时检查一次
  
  onUnmounted(() => {
    clearInterval(timer)
  })
})

const checkOverdueTasks = () => {
  const now = new Date()
  tableData.value.forEach(task => {
    if (task.status !== '已完成') {
      const endDate = new Date(task.endTime)
      if (endDate < now) {
        addReminder({
          type: 'overdue',
          content: `${task.department}${task.checkType}自查任务已逾期`,
          taskNo: task.taskNo,
          priority: 'high'
        })
      } else if (endDate.getTime() - now.getTime() <= 3 * 24 * 60 * 60 * 1000) {
        // 3天内到期
        addReminder({
          type: 'upcoming',
          content: `${task.department}${task.checkType}自查任务即将到期`,
          taskNo: task.taskNo,
          priority: 'medium'
        })
      }
    }
  })
}

const addReminder = (reminder: Partial<Reminder>) => {
  const existingReminder = reminders.value.find(
    r => r.type === reminder.type && r.taskNo === reminder.taskNo
  )
  if (!existingReminder) {
    reminders.value.unshift({
      id: Date.now(),
      time: new Date().toISOString().split('T')[0],
      read: false,
      ...reminder
    } as Reminder)
  }
}
</script>

<style scoped>
.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;

  .title {
    font-weight: bold;
    color: #303133;
  }
}

.reminder-list {
  .reminder-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f7fa;
    }

    &.unread {
      background-color: #ecf5ff;
    }
  }
}

.reminder-content {
  display: flex;
  align-items: flex-start;
  flex: 1;

  .reminder-icon {
    margin-right: 12px;
    font-size: 20px;

    &.upcoming {
      color: #409EFF;
    }

    &.overdue {
      color: #F56C6C;
    }

    &.completed {
      color: #67C23A;
    }
  }
}

.reminder-info {
  flex: 1;

  .reminder-text {
    color: #303133;
    margin-bottom: 4px;
  }

  .reminder-time {
    font-size: 12px;
    color: #909399;
  }
}
</style> 