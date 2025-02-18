<template>
  <div class="monitoring-home">
    <!-- 统计卡片分组 -->
    <el-row :gutter="20" class="statistics-group">
      <!-- 安全报告统计 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-group">
          <div class="group-header">
            <span class="title">安全报告</span>
            <el-tag size="small">本月</el-tag>
          </div>
          <div class="group-content">
            <div class="stat-item">
              <span class="label">自愿报告</span>
              <span class="value">32</span>
            </div>
            <div class="stat-item">
              <span class="label">强制报告</span>
              <span class="value">15</span>
            </div>
            <div class="stat-item">
              <span class="label">待处理</span>
              <span class="value highlight">8</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 事件调查统计 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-group">
          <div class="group-header">
            <span class="title">事件调查</span>
            <el-tag size="small" type="warning">进行中</el-tag>
          </div>
          <div class="group-content">
            <div class="stat-item">
              <span class="label">调查总数</span>
              <span class="value">18</span>
            </div>
            <div class="stat-item">
              <span class="label">已完成</span>
              <span class="value success">12</span>
            </div>
            <div class="stat-item">
              <span class="label">处理中</span>
              <span class="value warning">6</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 飞行数据分析 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-group">
          <div class="group-header">
            <span class="title">飞行数据</span>
            <el-tag size="small" type="success">实时</el-tag>
          </div>
          <div class="group-content">
            <div class="stat-item">
              <span class="label">航班总数</span>
              <span class="value">245</span>
            </div>
            <div class="stat-item">
              <span class="label">异常数据</span>
              <span class="value warning">5</span>
            </div>
            <div class="stat-item">
              <span class="label">分析完成</span>
              <span class="value">89%</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 系统评价指标 -->
      <el-col :span="6">
        <el-card shadow="hover" class="stat-group">
          <div class="group-header">
            <span class="title">系统评价</span>
            <el-tag size="small" type="info">本季度</el-tag>
          </div>
          <div class="group-content">
            <div class="stat-item">
              <span class="label">安全指数</span>
              <span class="value">92.5</span>
            </div>
            <div class="stat-item">
              <span class="label">风险等级</span>
              <span class="value success">低风险</span>
            </div>
            <div class="stat-item">
              <span class="label">达标率</span>
              <span class="value">96%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势分析图表 -->
    <el-row :gutter="20" class="charts">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>安全绩效趋势分析</span>
              <div class="chart-controls">
                <el-select v-model="selectedMetrics" multiple size="small" placeholder="选择指标">
                  <el-option label="安全事件数" value="events" />
                  <el-option label="报告数量" value="reports" />
                  <el-option label="风险指数" value="risk" />
                  <el-option label="完成率" value="completion" />
                </el-select>
                <el-radio-group v-model="timeRange" size="small">
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="quarter">季</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div id="trendChart" class="chart-content"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>安全风险分布</span>
            </div>
          </template>
          <div id="distributionChart" class="chart-content"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新动态列表 -->
    <el-card class="recent-card">
      <template #header>
        <div class="card-header">
          <span>安全动态</span>
          <div class="header-actions">
            <el-radio-group v-model="eventType" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="report">安全报告</el-radio-button>
              <el-radio-button label="investigation">事件调查</el-radio-button>
              <el-radio-button label="analysis">数据分析</el-radio-button>
            </el-radio-group>
            <el-button type="primary" link>查看更多</el-button>
          </div>
        </div>
      </template>
      <el-table :data="recentEvents" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 图表控制
const selectedMetrics = ref(['events', 'risk'])
const timeRange = ref('month')
const eventType = ref('all')

// 状态和级别标签类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待处理': 'warning',
    '进行中': 'primary',
    '已完成': 'success',
    '已关闭': 'info'
  }
  return map[status] || 'info'
}

const getLevelType = (level: string) => {
  const map: Record<string, string> = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return map[level] || 'info'
}

// 最新动态数据
const recentEvents = [
  {
    time: '2024-01-15 10:30',
    module: '安全报告',
    title: '机务维修安全检查报告',
    level: '中',
    status: '待处理'
  },
  {
    time: '2024-01-14 16:45',
    module: '事件调查',
    title: '航班延误原因调查',
    level: '低',
    status: '进行中'
  },
  {
    time: '2024-01-14 09:20',
    module: '数据分析',
    title: '飞行数据异常分析',
    level: '高',
    status: '已完成'
  }
]

// 趋势图表初始化
let trendChart: echarts.ECharts | null = null
let distributionChart: echarts.ECharts | null = null

onMounted(() => {
  // 初始化趋势图表
  const trendChartDom = document.getElementById('trendChart')
  if (trendChartDom) {
    trendChart = echarts.init(trendChartDom)
    const trendOption: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['安全事件数', '报告数量', '风险指数']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: [
        {
          type: 'value',
          name: '数量',
          position: 'left'
        },
        {
          type: 'value',
          name: '指数',
          position: 'right',
          max: 5,
          min: 0
        }
      ],
      series: [
        {
          name: '安全事件数',
          type: 'line',
          smooth: true,
          data: [12, 8, 15, 10, 7, 11]
        },
        {
          name: '报告数量',
          type: 'line',
          smooth: true,
          data: [30, 25, 35, 28, 32, 38]
        },
        {
          name: '风险指数',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: [2.5, 2.8, 2.3, 2.6, 2.1, 2.4]
        }
      ]
    }
    trendChart.setOption(trendOption)
  }

  // 初始化分布图表
  const distributionChartDom = document.getElementById('distributionChart')
  if (distributionChartDom) {
    distributionChart = echarts.init(distributionChartDom)
    const distributionOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '风险分布',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 15, name: '高风险', itemStyle: { color: '#F56C6C' } },
            { value: 30, name: '中风险', itemStyle: { color: '#E6A23C' } },
            { value: 55, name: '低风险', itemStyle: { color: '#67C23A' } }
          ]
        }
      ]
    }
    distributionChart.setOption(distributionOption)
  }
})

// 监听窗口大小变化
window.addEventListener('resize', () => {
  trendChart?.resize()
  distributionChart?.resize()
})
</script>

<style scoped lang="scss">
.monitoring-home {
  padding: 20px;
}

.statistics-group {
  margin-bottom: 20px;
}

.stat-group {
  .group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .group-content {
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .label {
        color: #606266;
      }

      .value {
        font-size: 18px;
        font-weight: 500;

        &.highlight {
          color: #409EFF;
        }

        &.warning {
          color: #E6A23C;
        }

        &.success {
          color: #67C23A;
        }
      }
    }
  }
}

.charts {
  margin-bottom: 20px;

  .chart-card {
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .chart-controls {
        display: flex;
        gap: 12px;
      }
    }

    .chart-content {
      height: 350px;
    }
  }
}

.recent-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }
  }
}
</style> 