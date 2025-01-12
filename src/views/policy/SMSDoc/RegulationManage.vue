<template>
  <div class="regulation-manage">
    <!-- 规章分类标签页 -->
    <el-tabs v-model="activeTab">
      <el-tab-pane label="法律法规" name="laws">
        <regulation-table :data="lawsData" />
      </el-tab-pane>
      <el-tab-pane label="行政规章" name="administrative">
        <regulation-table :data="administrativeData" />
      </el-tab-pane>
      <el-tab-pane label="部门规章" name="departmental">
        <regulation-table :data="departmentalData" />
      </el-tab-pane>
      <el-tab-pane label="行业标准" name="standards">
        <regulation-table :data="standardsData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RegulationTable from './components/RegulationTable.vue'

// 当前激活的标签页
const activeTab = ref('laws')

// 模拟规章数据
const lawsData = [
  {
    id: 1,
    code: 'CCAR-121',
    name: '大型飞机公共航空运输承运人运行合格审定规则',
    publishDate: '2017-01-01',
    status: '现行有效'
  },
  {
    id: 2,
    code: 'CCAR-135',
    name: '小型商业运输和空中游览运营人运行合格审定规则',
    publishDate: '2016-08-01',
    status: '现行有效'
  }
  // ... 更多数据
]
</script>

<style scoped>
.regulation-manage {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}
</style> 