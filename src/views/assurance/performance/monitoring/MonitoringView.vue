<template>
  <div class="monitoring-container">
    <!-- 子导航菜单 -->
    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      class="sub-nav-menu"
      router
    >
      <el-menu-item index="/assurance/performance/monitoring/home">
        <el-icon><HomeFilled /></el-icon>首页
      </el-menu-item>
      <el-menu-item index="/assurance/performance/monitoring/management">
        <el-icon><Management /></el-icon>安全绩效管理
      </el-menu-item>
      <el-menu-item index="/assurance/performance/monitoring/report">
        <el-icon><Document /></el-icon>安全报告
      </el-menu-item>
      <el-menu-item index="/assurance/performance/monitoring/investigation">
        <el-icon><Search /></el-icon>事件调查
      </el-menu-item>
      <el-menu-item index="/assurance/performance/monitoring/flight-data">
        <el-icon><DataLine /></el-icon>飞行数据分析
      </el-menu-item>
      <el-menu-item index="/assurance/performance/monitoring/system-evaluation">
        <el-icon><TrendCharts /></el-icon>安全信息综合分析和系统评价
      </el-menu-item>
    </el-menu>

    <!-- 子路由内容 -->
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  HomeFilled,
  Management,
  Document,
  Search,
  DataLine,
  TrendCharts
} from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.monitoring-container {
  height: 100%;
}

.sub-nav-menu {
  margin-bottom: 20px;
  background: #f5f7fa;
  padding: 4px;
  border-radius: 4px;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
  background-color: transparent;

  .el-menu-item {
    height: 36px;
    line-height: 36px;
    margin: 0 4px;
    border-radius: 4px;

    &.is-active {
      background-color: var(--el-color-primary);
      color: #fff;
      font-weight: 500;
      border-bottom: none;

      &::after {
        display: none;
      }

      .el-icon {
        color: #fff;
      }
    }

    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}
</style> 