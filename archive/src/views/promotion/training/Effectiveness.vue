<template>
  <div class="training-effectiveness">
    <!-- 效果管理 -->
    <el-tabs v-model="activeTab">
      <!-- 考核评估 -->
      <el-tab-pane label="考核评估" name="assessment">
        <div class="assessment-section">
          <!-- 考核记录 -->
          <el-table :data="assessmentList">
            <el-table-column prop="trainee" label="培训人员"/>
            <el-table-column prop="course" label="培训课程"/>
            <el-table-column prop="score" label="考核成绩"/>
            <el-table-column prop="result" label="评估结果"/>
            <!-- 其他列... -->
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 效果分析 -->
      <el-tab-pane label="效果分析" name="analysis">
        <div class="analysis-section">
          <!-- 统计图表 -->
          <div class="charts-container">
            <!-- 合格率趋势图 -->
            <div class="chart-item">
              <v-chart :option="passRateOption" autoresize/>
            </div>
            <!-- 培训效果分布图 -->
            <div class="chart-item">
              <v-chart :option="effectivenessOption" autoresize/>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import VChart from 'vue-echarts'
import * as echarts from 'echarts/core'
import {BarChart, LineChart, PieChart} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'

// 注册必需的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer
])

// 当前激活的标签页
const activeTab = ref('assessment')

// 考核记录列表
const assessmentList = ref([
  {
    trainee: '张机长',
    course: '飞行员年度复训',
    score: 95,
    result: '优秀'
  },
  {
    trainee: '李乘务长',
    course: '客舱服务标准培训',
    score: 88,
    result: '良好'
  }
])

// 合格率趋势图配置
const passRateOption = ref({
  title: {
    text: '培训合格率趋势'
  },
  xAxis: {
    type: 'category',
    data: ['飞行部', '机务部', '客舱部', '地面服务部']
  },
  yAxis: {
    type: 'value',
    min: 80,
    max: 100
  },
  series: [{
    data: [98, 95, 93, 97],
    type: 'line'
  }]
})

// 培训效果分布图配置
const effectivenessOption = ref({
  title: {
    text: '培训效果分布'
  },
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    data: [
      {value: 65, name: '优秀'},
      {value: 25, name: '良好'},
      {value: 8, name: '合格'},
      {value: 2, name: '待改进'}
    ]
  }]
})

// 导出考核记录
const handleExport = () => {
  // 实现导出逻辑
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.training-effectiveness {
  padding: 20px;
}

.assessment-section,
.analysis-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.chart-item {
  height: 400px;
}

.toolbar {
  margin-bottom: 20px;
}

/* 图表响应式布局 */
@media screen and (max-width: 1200px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style> 