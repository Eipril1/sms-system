<template>
  <div class="supervision-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>监督审核</h2>
      </div>
    </div>

    <!-- 导航菜单 -->
    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      class="nav-menu"
      router
    >
      <el-menu-item index="/assurance/supervision/daily">
        <el-icon><CalendarIcon /></el-icon>日常检查
      </el-menu-item>
      <el-menu-item index="/assurance/supervision/statutory">
        <el-icon><DocumentIcon /></el-icon>法定自查
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
  Document as DocumentIcon 
} from '@element-plus/icons-vue'

const route = useRoute()

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  // 获取当前路径的前三段作为父级路径
  const pathSegments = route.path.split('/')
  return `/${pathSegments[1]}/${pathSegments[2]}/${pathSegments[3]}`
})
</script>

<style scoped>
.supervision-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.nav-menu {
  margin-bottom: 20px;
  background: #304156;
  border-bottom: none;
  padding: 4px;
  border-radius: 4px;
}

.nav-menu :deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  margin: 0 4px;
  border-radius: 4px;
  color: #fff !important;

  &.is-active {
    background-color: #409EFF !important;
    color: #fff !important;
    
    .el-icon {
      color: #fff !important;
    }
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: #fff !important;
    
    .el-icon {
      color: #fff !important;
    }
  }

  .el-icon {
    margin-right: 6px;
    font-size: 18px;
    color: #fff;
  }
}

.sub-page {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: 500px;
}
</style> 