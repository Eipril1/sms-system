<template>
  <div class="home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h1>欢迎使用安全管理系统</h1>
      <p class="subtitle">{{ getCurrentTime() }}</p>
    </div>

    <!-- 快捷入口区域 -->
    <div class="quick-access">
      <el-row :gutter="20">
        <el-col :span="4" v-for="item in quickAccessItems" :key="item.id">
          <el-card 
            class="quick-access-item" 
            :class="item.type" 
            shadow="hover"
            @click="handleQuickAccess(item)"
          >
            <div class="icon-wrapper">
              <el-icon :size="32">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="item-info">
              <h3>{{ item.title }}</h3>
              <p v-if="item.count !== undefined">
                <el-badge :value="item.count" :max="99" type="danger">
                  待处理
                </el-badge>
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 统计信息区域 -->
    <div class="statistics-section">
      <el-row :gutter="20">
        <!-- 待办任务统计 -->
        <el-col :span="16">
          <el-card class="statistics-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>待办任务</span>
                <el-button-group>
                  <el-button type="primary" plain size="small">本周</el-button>
                  <el-button type="primary" plain size="small">本月</el-button>
                  <el-button type="primary" plain size="small">全部</el-button>
                </el-button-group>
              </div>
            </template>
            <div class="task-statistics">
              <div 
                v-for="task in taskStatistics" 
                :key="task.type" 
                class="task-item"
                @click="handleTaskClick(task)"
              >
                <div class="task-icon" :class="task.type">
                  <el-icon :size="24"><component :is="task.icon" /></el-icon>
                </div>
                <div class="task-info">
                  <h4>{{ task.title }}</h4>
                  <p>{{ task.count }}条待处理</p>
                </div>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 风险趋势图 -->
        <el-col :span="8">
          <el-card class="trend-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>风险趋势</span>
                <el-radio-group v-model="trendTimeRange" size="small">
                  <el-radio-button label="week">周</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div class="trend-chart" ref="trendChartRef"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 文件通知区域 -->
    <div class="notice-section">
      <el-row :gutter="20">
        <!-- 最新文件 -->
        <el-col :span="12">
          <el-card class="notice-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>最新文件</span>
                <el-button link type="primary">更多</el-button>
              </div>
            </template>
            <div class="file-list">
              <div v-for="file in latestFiles" :key="file.id" class="file-item">
                <el-icon><Document /></el-icon>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-date">{{ file.date }}</span>
                <el-button link type="primary" size="small">下载</el-button>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 通知公告 -->
        <el-col :span="12">
          <el-card class="notice-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>通知公告</span>
                <el-button link type="primary">更多</el-button>
              </div>
            </template>
            <div class="notice-list">
              <div v-for="notice in notices" :key="notice.id" class="notice-item">
                <el-tag 
                  size="small" 
                  :type="notice.type"
                  class="notice-tag"
                >
                  {{ notice.category }}
                </el-tag>
                <span class="notice-title">{{ notice.title }}</span>
                <span class="notice-date">{{ notice.date }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

// 获取当前时间
const getCurrentTime = () => {
  return dayjs().format('YYYY年MM月DD日 HH:mm:ss dddd')
}

// 更新时间
const timer = ref<number>()
onMounted(() => {
  timer.value = setInterval(() => {
    getCurrentTime()
  }, 1000)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

// 趋势图时间范围
const trendTimeRange = ref('month')

const router = useRouter()
const trendChartRef = ref()

// 快捷入口数据
const quickAccessItems = [
  { 
    id: 1, 
    title: '自愿报告', 
    icon: 'Document', 
    count: 12, 
    type: 'info', 
    route: '/assurance/info/voluntary-report'  // 自愿报告路由
  },
  { 
    id: 2, 
    title: '强制报告', 
    icon: 'Warning', 
    count: 5, 
    type: 'warning', 
    route: '/assurance/info/mandatory-report'  // 强制报告路由
  },
  { 
    id: 3, 
    title: '日常检查', 
    icon: 'List', 
    count: 8, 
    type: 'check', 
    route: '/assurance/supervision/daily'  // 日常检查路由
  },
  { 
    id: 4, 
    title: '法定检查', 
    icon: 'Calendar', 
    count: 3, 
    type: 'audit', 
    route: '/assurance/supervision/statutory'  // 法定检查路由
  },
  { 
    id: 5, 
    title: '风险管理', 
    icon: 'Histogram', 
    type: 'risk', 
    route: '/risk'
  },
  { 
    id: 6, 
    title: '系统设置', 
    icon: 'Setting', 
    type: 'setting', 
    route: '/settings'
  }
]

// 待办任务统计
const taskStatistics = [
  { type: 'info', title: '自愿报告', count: 5, icon: 'Document' },
  { type: 'warning', title: '强制报告', count: 3, icon: 'Warning' },
  { type: 'check', title: '日常检查', count: 4, icon: 'List' },
  { type: 'audit', title: '法定检查', count: 2, icon: 'Calendar' }
]

// 最新文件
const latestFiles = [
  { id: 1, name: '2021年度安全管理人员培训计划.pdf', date: '2024-03-27' },
  { id: 2, name: '安全检查管理规定与实施细则.zip', date: '2024-03-26' },
  { id: 3, name: '关于加强安全生产工作的通知.doc', date: '2024-03-25' },
  { id: 4, name: '2024年第一季度安全检查报告.pdf', date: '2024-03-24' },
  { id: 5, name: '安全隐患排查治理制度.doc', date: '2024-03-23' }
]

// 通知公告
const notices = [
  { 
    id: 1, 
    title: '关于开展2024年度安全生产大检查的通知', 
    date: '2024-03-27',
    category: '安全检查',
    type: 'warning'  // 紧急通知用 warning
  },
  { 
    id: 2, 
    title: '安全管理体系修订版发布及培训通知', 
    date: '2024-03-26',
    category: '体系管理',
    type: 'info'  // 普通通知用 info
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
    type: 'success'  // 培训通知用 success
  },
  { 
    id: 5, 
    title: '关于组织开展安全文化建设活动的通知', 
    date: '2024-03-23',
    category: '安全文化',
    type: 'info'
  }
]

// 处理快捷入口点击
const handleQuickAccess = (item: any) => {
  if (item.route) {
    router.push(item.route)
  }
}

// 添加任务点击处理方法
const handleTaskClick = (task: any) => {
  const routeMap = {
    info: '/assurance/info/voluntary-report',
    warning: '/assurance/info/mandatory-report',
    check: '/assurance/supervision/daily',
    audit: '/assurance/supervision/statutory'
  }
  if (routeMap[task.type]) {
    router.push(routeMap[task.type])
  }
}

// 修改趋势图配置
onMounted(() => {
  const chart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['高风险', '中风险', '低风险']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '高风险',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          color: '#F56C6C'
        },
        data: [3, 2, 4, 1, 2, 3]
      },
      {
        name: '中风险',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          color: '#E6A23C'
        },
        data: [5, 4, 6, 5, 3, 4]
      },
      {
        name: '低风险',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          color: '#67C23A'
        },
        data: [4, 2, 5, 4, 2, 4]
      }
    ]
  }
  chart.setOption(option)

  // 监听时间范围变化
  watch(trendTimeRange, (newValue) => {
    // 根据时间范围更新数据
    const dataMap = {
      week: {
        xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        high: [2, 1, 3, 2, 1, 0, 1],
        medium: [3, 4, 2, 3, 2, 1, 2],
        low: [2, 3, 2, 1, 2, 1, 1]
      },
      month: {
        xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
        high: [3, 2, 4, 1, 2, 3],
        medium: [5, 4, 6, 5, 3, 4],
        low: [4, 2, 5, 4, 2, 4]
      },
      year: {
        xAxis: ['1季度', '2季度', '3季度', '4季度'],
        high: [9, 6, 8, 7],
        medium: [15, 12, 14, 11],
        low: [11, 10, 9, 8]
      }
    }

    const data = dataMap[newValue]
    chart.setOption({
      xAxis: {
        data: data.xAxis
      },
      series: [
        { data: data.high },
        { data: data.medium },
        { data: data.low }
      ]
    })
  })

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    chart.resize()
  })
})

// 在组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', () => {
    chart.resize()
  })
})
</script>

<style scoped lang="scss">
.home-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100%;
}

.welcome-section {
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  border-radius: 8px;
  color: white;
  
  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 500;
  }
  
  .subtitle {
    margin: 8px 0 0;
    font-size: 16px;
    opacity: 0.8;
  }
}

.quick-access-item {
  height: 120px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  &.info { background: linear-gradient(135deg, #36a3ff 0%, #5abeff 100%); }
  &.warning { background: linear-gradient(135deg, #ff7a45 0%, #ff9c6e 100%); }
  &.check { background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%); }
  &.audit { background: linear-gradient(135deg, #722ed1 0%, #9254de 100%); }
  &.risk { background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%); }
  &.setting { background: linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%); }
  
  .icon-wrapper {
    text-align: center;
    margin-bottom: 12px;
    
    .el-icon {
      color: white;
    }
  }
  
  .item-info {
    text-align: center;
    color: white;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: normal;
    }
  }
}

.task-item {
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    background: #f5f7fa;
    
    .arrow-icon {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .arrow-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%) translateX(-10px);
    opacity: 0;
    transition: all 0.3s;
    color: #909399;
  }
}

.notice-card {
  .file-item,
  .notice-item {
    padding: 12px 0;
    
    .el-icon {
      margin-right: 8px;
      color: #909399;
    }
    
    .notice-tag {
      margin-right: 8px;
    }
  }
}

.trend-card {
  .trend-chart {
    height: 300px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 任务类型颜色 */
.info .task-icon { background-color: #409EFF; }
.warning .task-icon { background-color: #E6A23C; }
.audit .task-icon { background-color: #67C23A; }
.notice .task-icon { background-color: #909399; }
</style> 