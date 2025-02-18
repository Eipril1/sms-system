<template>
  <div class="quick-access">
    <el-row :gutter="20">
      <el-col :span="8" v-for="item in quickAccessItems" :key="item.id">
        <el-card 
          class="quick-access-item" 
          :class="item.type" 
          shadow="hover"
          @click="handleQuickAccess(item)"
        >
          <div class="icon-wrapper">
            <el-icon :size="32">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="item-info">
            <h3>{{ item.title }}</h3>
            <p v-if="item.count !== undefined">
              <el-badge :value="item.count" :max="99" type="danger">
                待处理
              </el-badge>
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const quickAccessItems = ref([
  { 
    id: 1, 
    title: '自愿报告', 
    icon: 'Document', 
    count: 12, 
    type: 'info', 
    route: '/assurance/info/voluntary-report'
  },
  { 
    id: 2, 
    title: '强制报告', 
    icon: 'Warning', 
    count: 5, 
    type: 'warning', 
    route: '/assurance/info/mandatory-report'
  },
  { 
    id: 3, 
    title: '日常检查', 
    icon: 'List', 
    count: 8, 
    type: 'check', 
    route: '/assurance/supervision/daily'
  },
  { 
    id: 4, 
    title: '法定检查', 
    icon: 'Calendar', 
    count: 3, 
    type: 'audit', 
    route: '/assurance/supervision/statutory'
  },
  { 
    id: 5, 
    title: '风险管理', 
    icon: 'Histogram', 
    type: 'risk', 
    route: '/risk'
  },
  { 
    id: 6, 
    title: '系统设置', 
    icon: 'Setting', 
    type: 'setting', 
    route: '/settings'
  }
])

const handleQuickAccess = (item: any) => {
  if (item.route) {
    router.push(item.route)
  }
}
</script>

<style scoped lang="scss">
.quick-access-item {
  height: 120px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  &.info { background: linear-gradient(135deg, #36a3ff 0%, #5abeff 100%); }
  &.warning { background: linear-gradient(135deg, #ff7a45 0%, #ff9c6e 100%); }
  &.check { background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%); }
  &.audit { background: linear-gradient(135deg, #722ed1 0%, #9254de 100%); }
  &.risk { background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%); }
  &.setting { background: linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%); }
  
  .icon-wrapper {
    text-align: center;
    margin-bottom: 12px;
    
    .el-icon {
      color: white;
    }
  }
  
  .item-info {
    text-align: center;
    color: white;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: normal;
    }
  }
}
</style> 