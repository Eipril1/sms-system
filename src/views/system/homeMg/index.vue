<template>
  <div class="home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-wrapper">
      <WelcomeSection />
    </div>

    <!-- 快捷入口 -->
    <div class="quick-access-wrapper">
      <QuickAccess />
    </div>

    <!-- 顶部工具栏 -->
    <div class="dashboard-toolbar">
      <el-button type="primary" @click="showSettings = true">
        <el-icon><Tools /></el-icon>
        <span>自定义仪表盘</span>
      </el-button>
      <el-button @click="saveLayout">
        <el-icon><Upload /></el-icon>
        <span>保存布局</span>
      </el-button>
    </div>

    <!-- 拖拽布局区域 -->
    <VueDraggable
      v-model="layout"
      class="dashboard-layout"
      :animation="200"
      handle=".drag-handle"
      item-key="id"
    >
      <template #item="{ element }">
        <div class="dashboard-item" :class="{ 'is-visible': element.visible }">
          <!-- 组件标题栏 -->
          <div class="item-header">
            <el-icon class="drag-handle"><Operation /></el-icon>
            <span>{{ element.title }}</span>
            <div class="item-actions">
              <el-button 
                link 
                type="primary" 
                @click="toggleVisible(element)"
              >
                <el-icon>
                  <RemoveFilled v-if="element.visible" />
                  <CirclePlusFilled v-else />
                </el-icon>
              </el-button>
            </div>
          </div>
          
          <!-- 组件内容区 -->
          <component 
            v-if="element.visible" 
            :is="element.component"
            v-bind="element.props"
          />
        </div>
      </template>
    </VueDraggable>

    <!-- 配置抽屉 -->
    <el-drawer
      v-model="showSettings"
      title="自定义仪表盘"
      size="300px"
    >
      <el-form>
        <el-form-item label="显示组件">
          <el-checkbox-group v-model="visibleComponents">
            <el-checkbox 
              v-for="item in availableComponents" 
              :key="item.id"
              :label="item.id"
            >
              {{ item.title }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSettings = false">取消</el-button>
        <el-button type="primary" @click="applySettings">应用</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import VueDraggable from 'vuedraggable'
import {
  Tools,
  Upload,
  Operation,
  RemoveFilled,
  CirclePlusFilled
} from '@element-plus/icons-vue'

// 引入各个组件
import WelcomeSection from '@/views/home/components/WelcomeSection.vue'
import QuickAccess from '@/views/home/components/QuickAccess.vue'
import TaskStatistics from '@/views/home/components/TaskStatistics.vue'
import RiskTrend from '@/views/home/components/RiskTrend.vue'
import LatestFiles from '@/views/home/components/LatestFiles.vue'
import Notifications from '@/views/home/components/Notifications.vue'

// 可用组件配置（移除欢迎区域和快捷入口）
const availableComponents = [
  {
    id: 'taskStats',
    title: '待办任务',
    component: TaskStatistics,
    visible: true,
    props: {}
  },
  {
    id: 'riskTrend',
    title: '风险趋势',
    component: RiskTrend,
    visible: true,
    props: {}
  },
  {
    id: 'latestFiles',
    title: '最新文件',
    component: LatestFiles,
    visible: true,
    props: {}
  },
  {
    id: 'notifications',
    title: '通知公告',
    component: Notifications,
    visible: true,
    props: {}
  }
]

// 布局数据
const layout = ref([...availableComponents])
const showSettings = ref(false)
const visibleComponents = ref(availableComponents.map(item => item.id))

// 切换组件显示状态
const toggleVisible = (element: any) => {
  element.visible = !element.visible
}

// 应用设置
const applySettings = () => {
  layout.value.forEach(item => {
    item.visible = visibleComponents.value.includes(item.id)
  })
  showSettings.value = false
  ElMessage.success('设置已应用')
}

// 保存布局
const saveLayout = () => {
  localStorage.setItem('dashboard-layout', JSON.stringify({
    layout: layout.value,
    visibleComponents: visibleComponents.value
  }))
  ElMessage.success('布局已保存')
}

// 初始化时加载保存的布局
const initLayout = () => {
  const savedLayout = localStorage.getItem('dashboard-layout')
  if (savedLayout) {
    const { layout: savedLayoutData, visibleComponents: savedVisible } = JSON.parse(savedLayout)
    layout.value = savedLayoutData
    visibleComponents.value = savedVisible
  }
}

// 页面加载时初始化
initLayout()
</script>

<style scoped lang="scss">
.home-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100%;
}

.welcome-wrapper,
.quick-access-wrapper {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.dashboard-toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  min-height: 200px;
}

.dashboard-item {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  
  &:not(.is-visible) {
    opacity: 0.5;
  }
}

.item-header {
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .drag-handle {
    cursor: move;
    color: #909399;
  }
  
  .item-actions {
    margin-left: auto;
  }
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style> 