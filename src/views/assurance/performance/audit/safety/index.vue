<template>
  <div class="safety-check">
    <!-- 子导航菜单 -->
    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      class="sub-nav-menu"
      router
    >
      <el-menu-item index="/assurance/performance/audit/safety/plan">
        <el-icon><Calendar /></el-icon>检查计划
      </el-menu-item>
      <el-menu-item index="/assurance/performance/audit/safety/task">
        <el-icon><List /></el-icon>检查任务
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
import { Calendar, List } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.safety-check {
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
      background-color: #409EFF;
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