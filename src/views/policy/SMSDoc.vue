<template>
  <div class="sms-doc-container">
    <div class="page-header">
      <h2>SMS文件管理</h2>
    </div>

    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="文件管理" name="file">
        <!-- 原有的文件管理内容 -->
      </el-tab-pane>
      
      <el-tab-pane label="规章管理" name="regulation">
        <regulation-manage />
      </el-tab-pane>
      
      <el-tab-pane label="符合性对标" name="compliance">
        <compliance-check />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RegulationManage from './SMSDoc/RegulationManage.vue'
import ComplianceCheck from './SMSDoc/ComplianceCheck.vue'

const activeTab = ref('file')
</script>

<style scoped>
.sms-doc-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}
</style> 