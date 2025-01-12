<template>
  <div class="archive-statistics">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总归档数</span>
              <el-tag type="info">全部</el-tag>
            </div>
          </template>
          <div class="stat-value">{{ statistics.total }}</div>
          <div class="stat-trend">
            <span>较上月</span>
            <span :class="['trend-value', statistics.totalTrend > 0 ? 'up' : 'down']">
              {{ Math.abs(statistics.totalTrend) }}%
              <el-icon>
                <CaretTop v-if="statistics.totalTrend > 0" />
                <CaretBottom v-else />
              </el-icon>
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" v-for="(stat, type) in statistics.byType" :key="type">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ type }}</span>
              <el-tag>{{ stat.count }}</el-tag>
            </div>
          </template>
          <el-progress
            :percentage="stat.percentage"
            :color="getProgressColor(type)"
          />
          <div class="stat-detail">
            <span>占比 {{ stat.percentage }}%</span>
            <span>本月新增 {{ stat.monthlyNew }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图表 -->
    <el-row :gutter="20" class="stat-charts">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>归档趋势</span>
              <el-radio-group v-model="trendTimeRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="quarter">季</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="trendChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>部门分布</span>
              <el-select v-model="deptChartType" size="small">
                <el-option label="饼图" value="pie" />
                <el-option label="柱状图" value="bar" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="deptChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 标签分析 -->
    <el-card class="tag-analysis">
      <template #header>
        <div class="card-header">
          <span>标签分析</span>
          <el-button-group>
            <el-button size="small" :type="tagViewType === 'cloud' ? 'primary' : ''" @click="tagViewType = 'cloud'">
              词云图
            </el-button>
            <el-button size="small" :type="tagViewType === 'list' ? 'primary' : ''" @click="tagViewType = 'list'">
              列表
            </el-button>
          </el-button-group>
        </div>
      </template>
      <div class="tag-content">
        <template v-if="tagViewType === 'cloud'">
          <div class="tag-cloud">
            <span
              v-for="tag in tagList"
              :key="tag.name"
              class="tag-item"
              :style="{
                fontSize: `${12 + tag.weight * 4}px`,
                opacity: 0.5 + tag.weight * 0.5
              }"
            >
              {{ tag.name }}
            </span>
          </div>
        </template>
        <template v-else>
          <el-table :data="tagList" style="width: 100%">
            <el-table-column prop="name" label="标签名称" />
            <el-table-column prop="count" label="使用次数" width="120" />
            <el-table-column prop="percentage" label="使用占比" width="120">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.percentage"
                  :stroke-width="10"
                  :show-text="false"
                />
                <span>{{ row.percentage }}%</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 统计数据
const statistics = ref({
  total: 256,
  totalTrend: 12.5,
  byType: {
    '自查报告': { count: 120, percentage: 46.9, monthlyNew: 15 },
    '整改报告': { count: 85, percentage: 33.2, monthlyNew: 8 },
    '验收报告': { count: 51, percentage: 19.9, monthlyNew: 5 }
  }
})

// 趋势图表
const trendTimeRange = ref('month')
const trendChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['自查报告', '整改报告', '验收报告']
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
      name: '自查报告',
      type: 'line',
      data: [15, 12, 18, 20, 15, 22]
    },
    {
      name: '整改报告',
      type: 'line',
      data: [10, 8, 12, 15, 10, 16]
    },
    {
      name: '验收报告',
      type: 'line',
      data: [5, 6, 8, 10, 8, 12]
    }
  ]
}))

// 部门分布图表
const deptChartType = ref('pie')
const deptChartOption = computed(() => {
  const data = [
    { name: '飞行部', value: 85 },
    { name: '维修部', value: 65 },
    { name: '运控部', value: 45 },
    { name: '客舱部', value: 35 },
    { name: '安全部', value: 26 }
  ]

  if (deptChartType.value === 'pie') {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)'
            }
          },
          data
        }
      ]
    }
  }

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        data: data.map(item => item.value)
      }
    ]
  }
})

// 标签分析
const tagViewType = ref('cloud')
const tagList = ref([
  { name: '安全隐患', count: 85, percentage: 33.2, weight: 1 },
  { name: '设备维护', count: 65, percentage: 25.4, weight: 0.8 },
  { name: '人员培训', count: 45, percentage: 17.6, weight: 0.6 },
  { name: '流程优化', count: 35, percentage: 13.7, weight: 0.4 },
  { name: '制度完善', count: 26, percentage: 10.1, weight: 0.3 }
])

// 获取进度条颜色
const getProgressColor = (type: string) => {
  const colors = {
    '自查报告': '#409EFF',
    '整改报告': '#67C23A',
    '验收报告': '#E6A23C'
  }
  return colors[type as keyof typeof colors] || '#909399'
}
</script>

<style scoped>
.archive-statistics {
  padding: 20px;
}

.stat-cards {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 12px 0;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 13px;

  .trend-value {
    display: flex;
    align-items: center;
    gap: 4px;

    &.up {
      color: #f56c6c;
    }

    &.down {
      color: #67c23a;
    }
  }
}

.stat-detail {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: #909399;
  font-size: 13px;
}

.stat-charts {
  margin-bottom: 20px;
}

.chart-card {
  .chart-container {
    height: 300px;
  }
}

.tag-analysis {
  .tag-content {
    min-height: 200px;
  }
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;

  .tag-item {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: #409EFF;
      transform: scale(1.1);
    }
  }
}
</style> 