<template>
  <div class="risk-trend">
    <div class="header">
      <span>风险趋势</span>
      <el-radio-group v-model="timeRange" size="small">
        <el-radio-button label="week">周</el-radio-button>
        <el-radio-button label="month">月</el-radio-button>
        <el-radio-button label="year">年</el-radio-button>
      </el-radio-group>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const timeRange = ref('month')
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 更新图表数据
const updateChart = () => {
  if (!chart) return
  
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

  const data = dataMap[timeRange.value]
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
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
      data: data.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '高风险',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#F56C6C' },
        data: data.high
      },
      {
        name: '中风险',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#E6A23C' },
        data: data.medium
      },
      {
        name: '低风险',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#67C23A' },
        data: data.low
      }
    ]
  }
  
  chart.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  chart?.resize()
}

// 监听时间范围变化
watch(timeRange, () => {
  updateChart()
})

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped lang="scss">
.risk-trend {
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

.chart-container {
  height: 300px;
}
</style> 