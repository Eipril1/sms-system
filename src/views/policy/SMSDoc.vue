<template>
  <div class="sms-doc-container">
    <!-- 顶部标题和按钮 -->
    <div class="page-header">
      <h2>SMS文件管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">+ 新增文件</el-button>
      </div>
    </div>

    <!-- 标签页切换 -->
    <el-tabs v-model="activeTab" class="main-tabs">
      <!-- 文件管理标签页 -->
      <el-tab-pane label="文件管理" name="file">
        <!-- 搜索栏 -->
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="文件类型">
            <el-select v-model="searchForm.type" clearable>
              <el-option label="管理手册" value="manual"/>
              <!-- 其他选项 -->
            </el-select>
          </el-form-item>
          <el-form-item label="文件状态">
            <el-select v-model="searchForm.status" clearable>
              <el-option label="生效" value="active"/>
              <!-- 其他选项 -->
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 文件列表 -->
        <el-table :data="fileList" v-loading="loading">
          <!-- 原有的表格列 -->
        </el-table>
      </el-tab-pane>

      <!-- 规章管理标签页 -->
      <el-tab-pane label="规章管理" name="regulation">
        <router-view v-if="activeTab === 'regulation'"></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前激活的标签页
const activeTab = ref('file')

// 监听标签页变化
watch(activeTab, (newVal) => {
  if (newVal === 'regulation') {
    router.push('/policy/sms-doc/regulation')
  }
})

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes('/regulation')) {
      activeTab.value = 'regulation'
    } else {
      activeTab.value = 'file'
    }
  },
  { immediate: true }
)

// 搜索表单
const searchForm = ref({
  type: '',
  status: ''
})

// 文件列表数据
const fileList = ref([])
const loading = ref(false)

// 搜索方法
const handleSearch = () => {
  // 实现搜索逻辑
}

// 重置方法
const handleReset = () => {
  searchForm.value = {
    type: '',
    status: ''
  }
  handleSearch()
}

// 新增文件
const handleAdd = () => {
  // 实现新增逻辑
}
</script>

<style scoped>
.sms-doc-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
}

.search-form {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.main-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 20px;
}
</style> 