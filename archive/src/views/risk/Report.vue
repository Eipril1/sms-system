<template>
  <div class="report-container">
    <div class="page-header">
      <h2>信息报告</h2>
      <el-button-group>
        <el-button type="primary" @click="handleAdd('forced')">新增强制报告</el-button>
        <el-button type="success" @click="handleAdd('voluntary')">新增自愿报告</el-button>
      </el-button-group>
    </div>

    <!-- 报告列表 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="强制报告" name="forced">
        <el-table :data="reportList" v-loading="loading">
          <el-table-column prop="recordNumber" label="编号" width="180"/>
          <el-table-column prop="occurDate" label="事发日期" width="180"/>
          <el-table-column prop="flightNo" label="航班号" width="120"/>
          <el-table-column prop="eventType" label="事件类型"/>
          <el-table-column prop="is396Event" label="396事件" width="100">
            <template #default="{ row }">
              <el-tag :type="row.is396Event ? 'danger' : 'info'">
                {{ row.is396Event ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="needInvestigation" label="需要调查" width="100">
            <template #default="{ row }">
              <el-tag :type="row.needInvestigation ? 'warning' : 'info'">
                {{ row.needInvestigation ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
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
      </el-tab-pane>

      <el-tab-pane label="自愿报告" name="voluntary">
        <el-table :data="reportList" v-loading="loading">
          <el-table-column prop="recordNumber" label="编号" width="180"/>
          <el-table-column prop="occurDate" label="事发日期" width="180"/>
          <el-table-column prop="eventType" label="事件类型"/>
          <el-table-column prop="hopeHandleDept" label="希望处理部门"/>
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
      </el-tab-pane>
    </el-tabs>

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
    <ReportDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :report-type="activeTab"
        :data="currentItem"
        @success="handleDialogSuccess"
    />

    <!-- 查看对话框 -->
    <ReportDetail
        v-model:visible="detailVisible"
        :data="currentItem"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import ReportDialog from './components/ReportDialog.vue'
import ReportDetail from './components/ReportDetail.vue'

// 定义类型
interface ReportItem {
  id: number
  recordNumber: string
  occurDate: string
  occurTime: string
  flightNo?: string
  aircraftNo?: string
  eventType: string
  description: string
  impact: string
  is396Event?: boolean
  needInvestigation?: boolean
  hopeHandleDept?: string
  status: string

  [key: string]: any
}

// 状态定义
const loading = ref(false)
const activeTab = ref('forced')
const reportList = ref<ReportItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentItem = ref<ReportItem | null>(null)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      recordType: activeTab.value,
      pageNum: String(currentPage.value),
      pageSize: String(pageSize.value)
    })
    const res = await fetch(`/api/report/list?${params}`)
    const data = await res.json()
    if (data.code === 200) {
      reportList.value = data.data.records
      total.value = data.data.total
    } else {
      ElMessage.error(data.message || '获取数据失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 新增
const handleAdd = (type: 'forced' | 'voluntary') => {
  dialogType.value = 'add'
  activeTab.value = type
  currentItem.value = null
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: ReportItem) => {
  dialogType.value = 'edit'
  currentItem.value = {...row}
  dialogVisible.value = true
}

// 查看
const handleView = (row: ReportItem) => {
  currentItem.value = row
  detailVisible.value = true
}

// 删除
const handleDelete = async (row: ReportItem) => {
  try {
    await ElMessageBox.confirm('确认删除该报告？', '提示', {
      type: 'warning'
    })
    const res = await fetch(`/api/report/${row.id}`, {method: 'DELETE'})
    const data = await res.json()
    if (data.code === 200) {
      ElMessage.success('删除成功')
      getList()
    } else {
      ElMessage.error(data.message || '删除失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('删除失败')
  }
}

// 状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待处理': 'warning',
    '处理中': 'primary',
    '已完成': 'success',
    '已关闭': 'info'
  }
  return map[status] || 'info'
}

// Tab切换
const handleTabChange = () => {
  currentPage.value = 1
  getList()
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
.report-container {
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