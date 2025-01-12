<template>
  <div class="daily-check">
    <!-- 子导航菜单 -->
    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      class="sub-nav-menu"
      router
    >
      <el-menu-item index="/assurance/supervision/daily/plan">
        <el-icon><CalendarIcon /></el-icon>检查计划
      </el-menu-item>
      <el-menu-item index="/assurance/supervision/daily/task">
        <el-icon><ListIcon /></el-icon>检查任务
      </el-menu-item>
      <el-menu-item index="/assurance/supervision/daily/items">
        <el-icon><FolderIcon /></el-icon>检查项管理
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Calendar as CalendarIcon,
  List as ListIcon,
  Folder as FolderIcon
} from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.daily-check {
  height: 100%;
}

.sub-nav-menu {
  margin-bottom: 20px;
  background: #304156;
  border-bottom: none;
  padding: 4px;
  border-radius: 4px;
}

/* 修改菜单项样式 */
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
      color: #fff !important;
    }

    &.is-active {
      background-color: #409EFF;
      color: #fff !important;
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
      vertical-align: middle;
    }
  }
}

.sub-page {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: 500px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
</style> 