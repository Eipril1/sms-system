<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <!-- Logo区域 -->
      <div class="logo-container" :class="{ 'collapsed': isCollapse }" @click="goHome">
        <img src="@/assets/logo.png" alt="瑞丽航空" class="logo">
      </div>

      <!-- 导航菜单 -->
      <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :collapse="isCollapse"
          router
      >
        <!-- 安全政策和目标 -->
        <el-sub-menu index="/policy">
          <template #title>
            <el-icon>
              <ShieldIcon/>
            </el-icon>
            <span>安全政策和目标</span>
          </template>
          <el-menu-item index="/policy/commitment">
            <el-icon>
              <UserFilled/>
            </el-icon>
            <span>管理者承诺</span>
          </el-menu-item>
          <el-menu-item index="/policy/responsibility">
            <el-icon>
              <List/>
            </el-icon>
            <span>安全责任</span>
          </el-menu-item>
          <el-menu-item index="/policy/key-personnel">
            <el-icon>
              <User/>
            </el-icon>
            <span>任命关键安全人员</span>
          </el-menu-item>
          <el-menu-item index="/policy/emergency">
            <el-icon>
              <AlarmClock/>
            </el-icon>
            <span>应急预案协调</span>
          </el-menu-item>
          <el-menu-item index="/policy/sms-doc">
            <el-icon>
              <Document/>
            </el-icon>
            <span>SMS文件</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 2. 安全风险管理 -->
        <el-sub-menu index="/risk">
          <template #title>
            <el-icon>
              <WarningFilled/>
            </el-icon>
            <span>安全风险管理</span>
          </template>
          <el-menu-item index="/risk/assessment">
            <el-icon>
              <Search/>
            </el-icon>
            <span>风险识别与评估</span>
          </el-menu-item>
          <el-menu-item index="/risk/control">
            <el-icon>
              <DataLine/>
            </el-icon>
            <span>风险控制与跟踪</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 风险管理 -->
        <el-sub-menu index="/risk-management">
          <template #title>
            <el-icon>
              <Warning/>
            </el-icon>
            <span>风险管理</span>
          </template>

          <!-- 危险源查询 -->
          <el-menu-item index="/risk-management/hazard-query">
            <el-icon>
              <Search/>
            </el-icon>
            <span>危险源查询</span>
          </el-menu-item>

          <!-- 危险源管理动态变化 -->
          <el-menu-item index="/risk-management/hazard-dynamic">
            <el-icon>
              <DataLine/>
            </el-icon>
            <span>危险源管理动态变化</span>
          </el-menu-item>

          <!-- 风险评价标准 -->
          <el-menu-item index="/risk-management/evaluation-standards">
            <el-icon>
              <Files/>
            </el-icon>
            <span>风险评价标准</span>
          </el-menu-item>

          <!-- 风险管理方案 -->
          <el-menu-item index="/risk-management/management-plan">
            <el-icon>
              <Document/>
            </el-icon>
            <span>风险管理方案</span>
          </el-menu-item>

          <!-- 安全隐患动态控制 -->
          <el-menu-item index="/risk-management/safety-control">
            <el-icon>
              <Monitor/>
            </el-icon>
            <span>安全隐患动态控制</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 3. 安全保证 -->
        <el-sub-menu index="/assurance">
          <template #title>
            <el-icon>
              <ShieldIcon/>
            </el-icon>
            <span>安全保证</span>
          </template>
          <el-menu-item index="/assurance/Performance">
            <el-icon>
              <TrendCharts/>
            </el-icon>
            <span>安全绩效监测</span>
          </el-menu-item>
          <el-menu-item index="/assurance/change">
            <el-icon>
              <RefreshRight/>
            </el-icon>
            <span>变更管理</span>
          </el-menu-item>
          <el-menu-item index="/assurance/improvement">
            <el-icon>
              <Refresh/>
            </el-icon>
            <span>持续改进</span>
          </el-menu-item>
          <el-menu-item index="/assurance/info">
            <el-icon>
              <Message/>
            </el-icon>
            <span>信息管理</span>
          </el-menu-item>

          <el-menu-item index="/assurance/supervision">
            <el-icon>
              <Check/>
            </el-icon>
            <span>监督审核</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 4. 安全促进 -->
        <el-sub-menu index="/promotion">
          <template #title>
            <el-icon>
              <Promotion/>
            </el-icon>
            <span>安全促进</span>
          </template>
          <el-menu-item index="/promotion/training">
            <el-icon>
              <School/>
            </el-icon>
            <span>安全培训和教育</span>
          </el-menu-item>
          <el-menu-item index="/promotion/communication">
            <el-icon>
              <ChatDotRound/>
            </el-icon>
            <span>安全交流</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- SMS数据库 -->
        <el-sub-menu index="database">
          <template #title>
            <el-icon>
              <DataLine/>
            </el-icon>
            <span>SMS数据库</span>
          </template>
          <el-menu-item index="/database/hazard">危险源库</el-menu-item>
          <el-menu-item index="/database/hidden-danger">隐患库</el-menu-item>
          <el-menu-item index="/database/performance">绩效指标库</el-menu-item>
          <el-menu-item index="/database/checklist">检查单库</el-menu-item>
          <el-menu-item index="/database/self-inspection">法定自查库</el-menu-item>
          <el-menu-item index="/database/findings">发现项库</el-menu-item>
        </el-sub-menu>

        <!-- 安全与质量监督审核 -->
        <el-sub-menu index="/supervision">
          <template #title>
            <el-icon>
              <Monitor/>
            </el-icon>
            <span>安全与质量监督审核</span>
          </template>

          <!-- 1. 公司/部门监察与审核 -->
          <el-menu-item index="/supervision/audit">
            <el-icon>
              <Aim/>
            </el-icon>
            <span>公司/部门监察与审核</span>
          </el-menu-item>

          <!-- 2. 安全生产过程管理 -->
          <el-menu-item index="/supervision/safety-production">
            <el-icon>
              <SetUp/>
            </el-icon>
            <span>安全生产过程管理</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 纠正预防 -->
        <el-sub-menu index="/correction">
          <template #title>
            <el-icon>
              <Warning/>
            </el-icon>
            <span>纠正预防</span>
          </template>

          <!-- 工作任务分配 -->
          <el-menu-item index="/correction/task-assignment">
            <el-icon>
              <Document/>
            </el-icon>
            <span>工作任务分配</span>
          </el-menu-item>

          <!-- 发现问题 -->
          <el-menu-item index="/correction/issue-discovery">
            <el-icon>
              <Search/>
            </el-icon>
            <span>发现问题</span>
          </el-menu-item>

          <!-- 跟踪验证 -->
          <el-menu-item index="/correction/tracking-verification">
            <el-icon>
              <View/>
            </el-icon>
            <span>跟踪验证</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 系统管理 -->
        <el-sub-menu index="/system">
          <template #title>
            <el-icon>
              <Setting/>
            </el-icon>
            <span>系统管理</span>
          </template>

          <!-- 用户管理 -->
          <el-menu-item index="/system/users">
            <el-icon>
              <User/>
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>

          <!-- 角色管理 -->
          <el-menu-item index="/system/roles">
            <el-icon>
              <UserFilled/>
            </el-icon>
            <span>角色管理</span>
          </el-menu-item>

          <!-- 部门管理 -->
          <el-menu-item index="/system/departments">
            <el-icon>
              <OfficeBuilding/>
            </el-icon>
            <span>部门管理</span>
          </el-menu-item>

          <!-- 菜单管理 -->
          <el-menu-item index="/system/menus">
            <el-icon>
              <Menu/>
            </el-icon>
            <span>菜单管理</span>
          </el-menu-item>

          <!-- 字典管理 -->
          <el-menu-item index="/system/dict">
            <el-icon>
              <Collection/>
            </el-icon>
            <span>字典管理</span>
          </el-menu-item>

          <!-- 操作日志 -->
          <el-menu-item index="/system/logs/operation">
            <el-icon>
              <Operation/>
            </el-icon>
            <span>操作日志</span>
          </el-menu-item>

          <!-- 登录日志 -->
          <el-menu-item index="/system/logs/login">
            <el-icon>
              <Key/>
            </el-icon>
            <span>登录日志</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 主要内容区 -->
    <el-container>
      <el-header class="header">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleSidebar">
          <el-icon :size="20">
            <component :is="isCollapse ? 'Expand' : 'Fold'"/>
          </el-icon>
        </div>

        <!-- 系统标题 -->
        <h1 class="system-title">安全管理系统</h1>

        <!-- 右侧用户信息等 -->
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled"/>
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
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {
  Expand,
  Fold,
  UserFilled,
  List,
  User,
  AlarmClock,
  Document,
  Warning,
  WarningFilled,
  Search,
  DataLine,
  CircleCheckFilled,
  TrendCharts,
  RefreshRight,
  Refresh,
  Message,
  Check,
  Calendar,
  Promotion,
  School,
  ChatDotRound,
  Lock as ShieldIcon,
  Monitor,
  Aim,
  SetUp,
  Files,
  View,
  Setting,
  OfficeBuilding,
  Menu,
  Collection,
  Operation,
  Key
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const activeMenu = computed(() => route.path)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const goHome = () => {
  router.push('/')
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
  cursor: pointer;

&
:hover {
  opacity: 0.8;
}

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
  position: relative; /* 为绝对定位的标题做准备 */
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

&
:hover {
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

&
:hover {
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

&
:hover {
  background-color: #001528 !important;
}

&
.is-active {
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

/* 添加嵌套子菜单的样式 */
.nested-submenu :deep(.el-menu) {
  background-color: #263445 !important; /* 更深的背景色 */
}

.nested-submenu :deep(.el-sub-menu__title) {
  padding-left: 40px !important; /* 增加缩进 */
  background-color: #304156 !important;
}

.nested-menu-item {
  padding-left: 60px !important; /* 二级菜单项缩进更多 */
  background-color: #263445 !important;
}

/* 悬停效果 */
.nested-menu-item:hover {
  background-color: #1f2d3d !important;
}

/* 选中状态 */
.nested-menu-item.is-active {
  background-color: #1f2d3d !important;
}

/* 信息管理子菜单样式 */
.info-submenu :deep(.el-sub-menu__title) {
  margin: 4px 0;
  margin-left: 8px;
  border-radius: 4px;
  background-color: #1f2d3d !important;
}

.info-menu-group {
  margin: 4px 0;
  padding: 4px;
  background-color: #1a2638;
  border-radius: 4px;
  margin-left: 16px;
}

.info-menu-item {
  margin: 4px 0;
  border-radius: 4px;
  height: 40px !important;
  line-height: 40px !important;

&
:deep(.el-icon) {
  margin-right: 10px;
  font-size: 16px;
  color: #909399;
}

&
:hover {
  background-color: #283446 !important;
}

&
.is-active {
  background-color: #409EFF !important;

&
:deep(.el-icon) {
  color: #fff;
}

}
}

/* 覆盖原有的嵌套菜单样式 */
.info-submenu :deep(.el-menu) {
  background-color: transparent !important;
}

.info-menu-item {
  padding-left: 20px !important;
}

/* 安全保证子菜单样式 */
:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 4px 0;
  padding: 0 20px !important;

.el-icon {
  margin-right: 12px;
  font-size: 18px;
}

&
:hover {
  background-color: #263445 !important;
}

&
.is-active {
  background-color: #409EFF !important;
  color: #fff !important;

.el-icon {
  color: #fff !important;
}

}
}
</style> 