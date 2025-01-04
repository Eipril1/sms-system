<template>
  <div class="training-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>安全培训教育</h2>
      </div>
    </div>

    <!-- 导航菜单 -->
    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      class="nav-menu"
      router
    >
      <el-menu-item index="/promotion/training/plan">培训计划</el-menu-item>
      <el-menu-item index="/promotion/training/implementation">培训实施</el-menu-item>
      <el-menu-item index="/promotion/training/effectiveness">效果管理</el-menu-item>
    </el-menu>

    <!-- 确保添加 router-view -->
    <div class="sub-page">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Plus, TrendCharts, Document, VideoPlay, DataLine } from '@element-plus/icons-vue'

const route = useRoute()

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 搜索表单
const searchForm = ref({
  type: '',
  status: '',
  dateRange: []
})

// 分析对话框
const analysisVisible = ref(false)

// 处理搜索
const handleSearch = () => {
  // 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    type: '',
    status: '',
    dateRange: []
  }
  handleSearch()
}

// 新增培训
const handleAdd = () => {
  // 实现新增逻辑
}

// 显示分析
const showAnalysis = () => {
  analysisVisible.value = true
}
</script>

<style scoped>
.training-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h2 {
  margin: 0;
}

.toolbar {
  display: flex;
  gap: 10px;
}

.search-card {
  margin-bottom: 20px;
}

.nav-menu {
  margin-bottom: 20px;
  background: #304156;
  border-bottom: none;
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.nav-menu :deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  margin: 0 4px;
  border-radius: 4px;
  color: #fff !important;

  &.is-active {
    background-color: #f5f7fa !important;
    color: #409eff !important;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  &:hover {
    background-color: #f5f7fa !important;
    color: #409eff !important;
  }

  .el-icon {
    margin-right: 6px;
    font-size: 18px;
  }
}

.nav-menu :deep(.el-menu-item.is-active)::after {
  display: none;
}

.sub-page {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: 500px;
}

/* 分析对话框样式 */
.analysis-dialog {
  --el-dialog-margin-top: 2vh;
}

.analysis-dialog :deep(.el-dialog__body) {
  padding: 0;
  height: calc(95vh - 53px);
  overflow-y: auto;
}

.analysis-container {
  padding: 24px;
  background-color: #f5f7fa;
  height: 100%;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.analysis-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
</style> 