<template>
  <div class="info-container">
    <div class="page-header">
      <h2>信息管理</h2>
    </div>

    <el-card class="content-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane name="voluntary" label="自愿报告">
          <voluntary-report/>
        </el-tab-pane>
        <el-tab-pane name="mandatory" label="强制报告">
          <mandatory-report/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import VoluntaryReport from './VoluntaryReport.vue'
import MandatoryReport from './MandatoryReport.vue'

// 设置默认激活的 tab 为自愿报告
const activeTab = ref('voluntary')
</script>

<style scoped>
.info-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.content-card {
  margin-bottom: 20px;
}
</style> 