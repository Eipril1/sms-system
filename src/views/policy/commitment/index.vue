<template>
  <div class="commitment-container">
    <!-- 子导航菜单 -->
    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      class="sub-nav-menu"
      router
    >
      <el-menu-item index="/policy/commitment/policy">
        <el-icon><Document /></el-icon>安全政策管理
      </el-menu-item>
      <el-menu-item index="/policy/commitment/target">
        <el-icon><Aim /></el-icon>安全目标管理
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
import { Document, Aim } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.commitment-container {
  padding: 20px;
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

.sub-page {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: calc(100vh - 200px);
  box-shadow: var(--el-box-shadow-light);
}
</style> 