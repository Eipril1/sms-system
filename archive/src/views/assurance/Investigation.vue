<template>
  <div class="investigation-container">
    <div class="page-header">
      <h2>事件调查</h2>
      <el-button type="primary" @click="handleAdd">新增调查</el-button>
    </div>

    <!-- 调查列表 -->
    <el-table :data="investigationList" v-loading="loading">
      <el-table-column prop="recordNumber" label="编号" width="180"/>
      <el-table-column prop="sourceNumber" label="来源编号" width="180"/>
      <el-table-column prop="eventType" label="事件类型"/>
      <el-table-column prop="investigationPlan" label="调查方案" show-overflow-tooltip/>
      <el-table-column prop="startDate" label="开始日期" width="180"/>
      <el-table-column prop="endDate" label="结束日期" width="180"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <InvestigationDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :data="currentItem"
        @success="handleDialogSuccess"
    />

    <!-- 查看对话框 -->
    <InvestigationDetail
        v-model:visible="detailVisible"
        :data="currentItem"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import request from '@/utils/request'
import InvestigationDialog from './components/InvestigationDialog.vue'
import InvestigationDetail from './components/InvestigationDetail.vue'

// 定义类型
interface InvestigationItem {
  id: number
  recordNumber: string
  sourceNumber: string
  eventType: string
  investigationPlan: string
  startDate: string
  endDate: string
  status: string

  [key: string]: any
}

// 状态定义
const loading = ref(false)
const investigationList = ref<InvestigationItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentItem = ref<InvestigationItem | null>(null)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const {data} = await request.get('/investigation/list', {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value
      }
    })
    investigationList.value = data.records
    total.value = data.total
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  currentItem.value = null
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: InvestigationItem) => {
  dialogType.value = 'edit'
  currentItem.value = {...row}
  dialogVisible.value = true
}

// 查看
const handleView = (row: InvestigationItem) => {
  currentItem.value = row
  detailVisible.value = true
}

// 删除
const handleDelete = async (row: InvestigationItem) => {
  try {
    await ElMessageBox.confirm('确认删除该调查记录？', '提示', {
      type: 'warning'
    })
    await request.delete(`/investigation/${row.id}`)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error(error)
    ElMessage.error('删除失败')
  }
}

// 状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待调查': 'warning',
    '调查中': 'primary',
    '已完成': 'success',
    '已关闭': 'info'
  }
  return map[status] || 'info'
}

// 分页相关
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getList()
}

// 对话框回调
const handleDialogSuccess = () => {
  dialogVisible.value = false
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.investigation-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 