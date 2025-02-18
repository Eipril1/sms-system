<template>
  <div class="audit-container">
    <!-- 子导航菜单 -->
    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      class="sub-nav-menu"
      router
    >
      <el-menu-item index="/assurance/performance/audit/sms">
        <el-icon><Aim /></el-icon>SMS审核
      </el-menu-item>
      <el-menu-item index="/assurance/performance/audit/safety">
        <el-icon><Search /></el-icon>安全检查
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
import type { Ref } from 'vue'
import { ref, computed } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRoute } from 'vue-router'
import { Aim, Search } from '@element-plus/icons-vue'

const route: RouteLocationNormalizedLoaded = useRoute()
const activeMenu: Ref<string> = computed(() => route.path)
</script>

<style scoped>
.audit-container {
  height: 100%;
  padding: 20px;
  background-color: var(--el-bg-color);
}

.sub-nav-menu {
  margin-bottom: 20px;
  background: #304156;
  border-bottom: none;
  padding: 4px;
  border-radius: 4px;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
  background-color: transparent;

  .el-menu-item {
    height: 40px;
    line-height: 40px;
    margin: 0 4px;
    border-radius: 4px;
    color: #fff !important;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.is-active {
      background-color: var(--el-color-primary);
      font-weight: 500;
      border-bottom: none;

      &::after {
        display: none;
      }

      .el-icon {
        color: #fff !important;
      }
    }

    .el-icon {
      margin-right: 8px;
      font-size: 16px;
      color: #fff;
    }
  }
}

.sub-page {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: calc(100vh - 200px);
  box-shadow: var(--el-box-shadow-light);
}
</style> 