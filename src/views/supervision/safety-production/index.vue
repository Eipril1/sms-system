<template>
  <div class="safety-production-container">
    <!-- 左侧文件夹树 -->
    <div class="folder-tree">
      <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="['1']"
          @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <el-icon>
              <Folder/>
            </el-icon>
            <span>{{ node.label }}</span>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 右侧内容区 -->
    <div class="content-area">
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="过程名称">
            <el-input v-model="searchForm.name" placeholder="请输入名称" clearable/>
          </el-form-item>
          <el-form-item label="适用部门">
            <el-select v-model="searchForm.department" placeholder="请选择" clearable>
              <el-option label="运行部" value="operation"/>
              <el-option label="维修部" value="maintenance"/>
              <el-option label="安全部" value="safety"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 标签页切换 -->
      <div class="tabs-area">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="关联检查单" name="checklist">
            <div class="tab-content">
              <el-table :data="checklistData" border>
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="name" label="检查单名称" min-width="200"/>
                <el-table-column prop="department" label="适用部门" width="120"/>
                <el-table-column prop="createTime" label="制定日期" width="180"/>
                <el-table-column prop="planDate" label="计划完成日期" width="180"/>
                <el-table-column prop="status" label="处理状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="{ row }">
                    <el-button link type="primary" @click="handleView(row)">查看</el-button>
                    <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关联整改计划" name="improvement">
            <!-- 整改计划内容 -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Folder} from '@element-plus/icons-vue'

// 树形数据
const treeData = [
  {
    id: '1',
    label: '航空安全',
    children: [
      {id: '1-1', label: '维修安全'},
      {id: '1-2', label: '维修实施'},
      {id: '1-3', label: '维修管理'},
      {id: '1-4', label: '车辆管理'},
      {id: '1-5', label: '航材管理'},
      {id: '1-6', label: '生产管理'},
      {id: '1-7', label: '飞行标准'},
      {id: '1-8', label: '飞行实施'},
      {id: '1-9', label: '飞行管理'},
      {id: '1-10', label: '运行控制'},
      {id: '1-11', label: '签派放行'}
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}

// 搜索表单
const searchForm = ref({
  name: '',
  department: ''
})

// 当前激活的标签页
const activeTab = ref('checklist')

// 检查单数据
const checklistData = ref([
  {
    name: '1月份管理检查计划',
    department: '运行部',
    createTime: '2025-01-15',
    planDate: '2025/01/15-2025/01/20',
    status: '待处理'
  }
])

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待处理': 'warning',
    '进行中': 'primary',
    '已完成': 'success'
  }
  return map[status] || ''
}

// 树节点点击
const handleNodeClick = (data: any) => {
  console.log('选中节点:', data)
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 查看
const handleView = (row: any) => {
  console.log('查看:', row)
}

// 编辑
const handleEdit = (row: any) => {
  console.log('编辑:', row)
}
</script>

<style scoped>
.safety-production-container {
  padding: 20px;
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
}

.folder-tree {
  width: 220px;
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  overflow-y: auto;
}

.content-area {
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  flex-direction: column;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-area {
  margin-bottom: 20px;
}

.tabs-area {
  flex: 1;
  overflow: hidden;
}

.tab-content {
  height: 100%;
  overflow-y: auto;
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f5f7fa;
}

:deep(.el-tabs__content) {
  height: calc(100% - 40px);
  overflow: hidden;
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style> 