<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <!-- Logo区域 -->
      <div class="logo-container" :class="{ 'collapsed': isCollapse }">
        <img src="@/assets/logo.png" alt="瑞丽航空" class="logo">
      </div>
      
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409EFF"
        router
      >
        <!-- 1. 安全政策和目标 -->
        <el-sub-menu index="policy">
          <template #title>
            <el-icon><DocumentCopy /></el-icon>
            <span>安全政策和目标</span>
          </template>
          <el-menu-item index="/policy/commitment">管理者承诺</el-menu-item>
          <el-menu-item index="/policy/responsibility">安全责任</el-menu-item>
          <el-menu-item index="/policy/key-personnel">任命关键安全人员</el-menu-item>
          <el-menu-item index="/policy/emergency">应急预案协调</el-menu-item>
          <el-menu-item index="/policy/sms-doc">SMS文件</el-menu-item>
        </el-sub-menu>

        <!-- 2. 安全风险管理 -->
        <el-sub-menu index="risk">
          <template #title>
            <el-icon><WarningFilled /></el-icon>
            <span>安全风险管理</span>
          </template>
          <el-menu-item index="/risk/identification">危险源识别</el-menu-item>
          <el-menu-item index="/risk/assessment">风险评价和控制</el-menu-item>
        </el-sub-menu>

        <!-- 3. 安全保证 -->
        <el-sub-menu index="assurance">
          <template #title>
            <el-icon><CircleCheckFilled /></el-icon>
            <span>安全保证</span>
          </template>
          <el-menu-item index="/assurance/performance">安全绩效监测</el-menu-item>
          <el-menu-item index="/assurance/change">变更管理</el-menu-item>
          <el-menu-item index="/assurance/improvement">持续改进</el-menu-item>
        </el-sub-menu>

        <!-- 4. 安全促进 -->
        <el-sub-menu index="promotion">
          <template #title>
            <el-icon><Promotion /></el-icon>
            <span>安全促进</span>
          </template>
          <el-menu-item index="/promotion/training">安全培训教育</el-menu-item>
          <el-menu-item index="/promotion/communication">安全交流</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 主要内容区 -->
    <el-container>
      <el-header class="header">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleSidebar">
          <el-icon :size="20">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
        </div>
        
        <!-- 系统标题 -->
        <h1 class="system-title">安全管理系统</h1>
        
        <!-- 右侧用户信息等 -->
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Expand, Fold } from '@element-plus/icons-vue'

const route = useRoute()
const isCollapse = ref(false)
const activeMenu = computed(() => route.path)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
  transition: width 0.3s ease;
  overflow-x: hidden;
}

/* Logo样式 */
.logo-container {
  height: 80px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2b3649;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.logo-container.collapsed {
  height: 64px;
  padding: 8px;
}

.logo {
  height: 60px;
  width: auto;
  max-width: 160px;
  transition: all 0.3s ease;
  object-fit: contain;
}

.logo-container.collapsed .logo {
  height: 48px;
  max-width: 48px;
}

/* 头部样式 */
.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;  /* 为绝对定位的标题做准备 */
}

/* 系统标题样式 */
.system-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.toggle-button {
  color: #606266;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f5f7fa;
    color: #409EFF;
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
  color: #606266;
}

/* 菜单样式 */
.el-menu-vertical {
  border-right: none;
  margin-top: 10px;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}

.el-menu--collapse {
  width: 64px;
}

:deep(.el-menu) {
  background-color: #304156 !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #bfcbd9 !important;
  
  &:hover {
    color: #fff !important;
    background-color: #263445 !important;
  }
}

:deep(.el-menu-item.is-active) {
  color: #409EFF !important;
  background-color: #263445 !important;
  border-right: 3px solid #409EFF;
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #bfcbd9 !important;
}

/* 主要内容区样式 */
.el-main {
  background-color: #f0f2f5;
  padding: 20px;
  transition: margin-left 0.3s ease;
}

/* 响应式处理 */
@media screen and (max-width: 768px) {
  .aside {
    position: fixed;
    height: 100%;
    z-index: 1000;
  }
  
  .company-name {
    display: none;
  }
  
  .system-title {
    font-size: 12px;
  }
}

/* 修改子菜单样式 */
:deep(.el-sub-menu .el-menu-item) {
  background-color: #1f2d3d !important;
  
  &:hover {
    background-color: #001528 !important;
  }
  
  &.is-active {
    background-color: #263445 !important;
  }
}

/* 菜单图标颜色 */
:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  color: #bfcbd9;
}

:deep(.el-menu-item.is-active .el-icon) {
  color: #409EFF;
}
</style> 