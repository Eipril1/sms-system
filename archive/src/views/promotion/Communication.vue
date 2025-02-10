<template>
  <div class="communication-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>安全交流</h2>
      </div>
    </div>

    <!-- 导航菜单 -->
    <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        class="nav-menu"
        router
    >
      <el-menu-item index="/promotion/communication/info">
        <el-icon>
          <Message/>
        </el-icon>
        信息交流
      </el-menu-item>
      <el-menu-item index="/promotion/communication/activity">
        <el-icon>
          <Calendar/>
        </el-icon>
        会议活动
      </el-menu-item>
    </el-menu>

    <!-- 子路由内容 -->
    <div class="sub-page">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"/>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {Message, Calendar} from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
/* 复用之前的导航样式 */
.communication-container {
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

&
.is-active {
  background-color: #f5f7fa !important;
  color: #409eff !important;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

&
:hover {
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
</style> 