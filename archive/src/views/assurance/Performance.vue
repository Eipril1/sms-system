<template>
  <div class="performance-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6" v-for="stat in statistics" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>{{ stat.title }}</span>
              <el-tooltip :content="stat.tip" placement="top">
                <el-icon>
                  <InfoFilled/>
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="stat-value">
            <span class="number" :class="stat.trend">{{ stat.value }}</span>
            <div class="trend-info">
              <span>{{ stat.compare }}</span>
              <el-icon v-if="stat.trend === 'up'">
                <CaretTop/>
              </el-icon>
              <el-icon v-else-if="stat.trend === 'down'">
                <CaretBottom/>
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 指标监控表格 -->
    <el-card class="monitor-card">
      <template #header>
        <div class="card-header">
          <span>指标监控</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleExport">
              <el-icon>
                <Download/>
              </el-icon>
              导出数据
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="code" label="指标编号" width="120"/>
        <el-table-column prop="name" label="指标名称" min-width="180"/>
        <el-table-column prop="category" label="指标类别" width="120">
          <template #default="{ row }">
            {{ getCategoryLabel(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="department" label="责任部门" width="120"/>
        <el-table-column prop="target" label="目标值" width="100"/>
        <el-table-column prop="warning" label="预警值" width="100"/>
        <el-table-column prop="current" label="当前值" width="100"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180"/>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="showTrend(row)">趋势分析</el-button>
            <el-button link type="primary" @click="showDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 趋势分析对话框 -->
    <el-dialog
        v-model="trendDialogVisible"
        title="指标趋势分析"
        width="70%"
    >
      <div class="trend-content">
        <div class="trend-header">
          <h3>{{ currentIndicator?.name }}</h3>
          <div class="trend-info">
            <span>目标值: {{ currentIndicator?.target }}</span>
            <span>预警值: {{ currentIndicator?.warning }}</span>
          </div>
        </div>
        <div class="chart-container" ref="chartRef"></div>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
        v-model="detailDialogVisible"
        title="指标详情"
        width="60%"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="指标编号">{{ currentIndicator?.code }}</el-descriptions-item>
        <el-descriptions-item label="指标名称">{{ currentIndicator?.name }}</el-descriptions-item>
        <el-descriptions-item label="指标类别">{{ getCategoryLabel(currentIndicator?.category) }}</el-descriptions-item>
        <el-descriptions-item label="责任部门">{{ currentIndicator?.department }}</el-descriptions-item>
        <el-descriptions-item label="目标值">{{ currentIndicator?.target }}</el-descriptions-item>
        <el-descriptions-item label="预警值">{{ currentIndicator?.warning }}</el-descriptions-item>
        <el-descriptions-item label="当前值">{{ currentIndicator?.current }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentIndicator?.status)">
            {{ getStatusLabel(currentIndicator?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="监控频率">{{ currentIndicator?.frequency }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentIndicator?.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="指标说明" :span="2">{{ currentIndicator?.description }}</el-descriptions-item>
        <el-descriptions-item label="计算方法" :span="2">{{ currentIndicator?.calculation }}</el-descriptions-item>
        <el-descriptions-item label="数据来源" :span="2">{{ currentIndicator?.dataSource }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import {ElMessage} from 'element-plus'
import {InfoFilled, CaretTop, CaretBottom, Download} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 统计数据
const statistics = [
  {
    title: '安全目标达成率',
    value: '95.8%',
    compare: '环比上升2.3%',
    trend: 'up',
    tip: '安全目标指标达成数/安全目标指标总数'
  },
  {
    title: '预警指标数',
    value: '3',
    compare: '较上月增加1个',
    trend: 'up',
    tip: '当前处于预警状态的指标数量'
  },
  {
    title: '超限指标数',
    value: '1',
    compare: '较上月减少2个',
    trend: 'down',
    tip: '当前超出限制值的指标数量'
  },
  {
    title: '指标更新率',
    value: '98.2%',
    compare: '环比上升1.5%',
    trend: 'up',
    tip: '按时更新指标数/需要更新指标总数'
  }
]

// 表格数据
const tableData = ref([
  {
    code: 'KPI-001',
    name: '飞行事故率',
    category: 'safety',
    department: '飞行部',
    target: '0',
    warning: '0.5',
    current: '0',
    status: 'normal',
    frequency: '月度',
    updateTime: '2024-03-20 10:00:00',
    description: '每10000小时飞行事故发生次数',
    calculation: '事故次数/飞行小时数×10000',
    dataSource: '飞行品质监控系统'
  },
  {
    code: 'KPI-002',
    name: '维修放行准点率',
    category: 'operation',
    department: '维修部',
    target: '98%',
    warning: '95%',
    current: '94.5%',
    status: 'warning',
    frequency: '日度',
    updateTime: '2024-03-20 10:00:00',
    description: '维修放行准时航班数/总航班数',
    calculation: '准时放行航班数/总航班数×100%',
    dataSource: '维修管理系统'
  },
  {
    code: 'KPI-003',
    name: '人员资质符合率',
    category: 'management',
    department: '人力资源部',
    target: '100%',
    warning: '98%',
    current: '99.5%',
    status: 'normal',
    frequency: '月度',
    updateTime: '2024-03-20 10:00:00',
    description: '持有效资质人员数/应持资质人员总数',
    calculation: '有效资质人数/总人数×100%',
    dataSource: '人员资质管理系统'
  }
])

// 对话框控制
const trendDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentIndicator = ref<any>(null)
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 获取指标类别标签
const getCategoryLabel = (category: string) => {
  const map: Record<string, string> = {
    'safety': '安全目标',
    'operation': '运行指标',
    'management': '管理要求'
  }
  return map[category] || category
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'normal': '正常',
    'warning': '预警',
    'exceeded': '超限'
  }
  return map[status] || status
}

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    'normal': 'success',
    'warning': 'warning',
    'exceeded': 'danger'
  }
  return map[status] || ''
}

// 导出数据
const handleExport = () => {
  ElMessage.success('数据导出成功')
}

// 显示趋势分析
const showTrend = (row: any) => {
  currentIndicator.value = row
  trendDialogVisible.value = true
  setTimeout(() => {
    initChart()
  }, 100)
}

// 显示详情
const showDetail = (row: any) => {
  currentIndicator.value = row
  detailDialogVisible.value = true
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  const option = {
    title: {
      text: '近12个月趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['实际值', '目标值', '预警值']
    },
    xAxis: {
      type: 'category',
      data: ['2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09',
        '2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: [95, 96, 94, 95, 93, 95, 96, 97, 95, 96, 94, 94.5]
      },
      {
        name: '目标值',
        type: 'line',
        data: [98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98],
        lineStyle: {
          type: 'dashed'
        }
      },
      {
        name: '预警值',
        type: 'line',
        data: [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95],
        lineStyle: {
          type: 'dashed'
        }
      }
    ]
  }

  chart.setOption(option)
}

// 组件挂载时初始化
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})

// 处理窗口大小变化
const handleResize = () => {
  if (chart) {
    chart.resize()
  }
}
</script>

<style scoped>
.performance-container {
  padding: 20px;
}

.statistics {
  margin-bottom: 20px;
}

.stat-card {

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;

&
.up {
  color: #67C23A;
}

&
.down {
  color: #F56C6C;
}

}

.trend-info {
  font-size: 14px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

}

.monitor-card {

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

}

.trend-content {

.trend-header {
  margin-bottom: 20px;

h3 {
  margin: 0 0 10px;
}

.trend-info {
  color: #909399;

span {
  margin-right: 20px;
}

}
}

.chart-container {
  height: 400px;
}

}

:deep(.el-descriptions__label) {
  width: 120px;
  justify-content: flex-end;
}
</style> 