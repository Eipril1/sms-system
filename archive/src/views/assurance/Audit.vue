<template>
  <div class="audit-container">
    <div class="page-header">
      <h2>监督审核</h2>
      <el-button-group>
        <el-button type="primary" @click="handleAdd('daily')">新增日常检查</el-button>
        <el-button type="success" @click="handleAdd('legal')">新增法定自查</el-button>
      </el-button-group>
    </div>

    <!-- 审核列表 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="日常检查" name="daily">
        <el-table :data="auditList" v-loading="loading">
          <el-table-column prop="recordNumber" label="编号" width="180"/>
          <el-table-column prop="checkProject" label="检查项目"/>
          <el-table-column prop="checkLocation" label="检查地点" width="180"/>
          <el-table-column prop="implementDept" label="实施部门" width="180"/>
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
      </el-tab-pane>

      <el-tab-pane label="法定自查" name="legal">
        <el-table :data="auditList" v-loading="loading">
          <el-table-column prop="recordNumber" label="编号" width="180"/>
          <el-table-column prop="checkProject" label="检查项目"/>
          <el-table-column prop="checkBasis" label="检查依据"/>
          <el-table-column prop="implementDept" label="实施部门" width="180"/>
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
    <AuditDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :audit-type="activeTab"
        :data="currentItem"
        @success="handleDialogSuccess"
    />

    <!-- 查看对话框 -->
    <AuditDetail
        v-model:visible="detailVisible"
        :data="currentItem"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import AuditDialog from './components/AuditDialog.vue'
import AuditDetail from './components/AuditDetail.vue'

// 定义类型
interface AuditItem {
  id: number
  recordNumber: string
  checkProject: string
  checkLocation?: string
  checkBasis?: string
  implementDept: string
  startDate: string
  endDate: string
  status: string

  [key: string]: any
}

// 状态定义
const loading = ref(false)
const activeTab = ref('daily')
const auditList = ref<AuditItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentItem = ref<AuditItem | null>(null)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      subType: String(activeTab.value),
      pageNum: String(currentPage.value),
      pageSize: String(pageSize.value)
    })
    const res = await fetch(`/api/audit/list?${params}`)
    const data = await res.json()
    if (data.code === 200) {
      auditList.value = data.data.records
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
const handleAdd = (type: 'daily' | 'legal') => {
  dialogType.value = 'add'
  activeTab.value = type
  currentItem.value = null
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: AuditItem) => {
  dialogType.value = 'edit'
  currentItem.value = {...row}
  dialogVisible.value = true
}

// 查看
const handleView = (row: AuditItem) => {
  currentItem.value = row
  detailVisible.value = true
}

// 删除
const handleDelete = async (row: AuditItem) => {
  try {
    await ElMessageBox.confirm('确认删除该审核记录？', '提示', {
      type: 'warning'
    })
    const res = await fetch(`/api/audit/${row.id}`, {method: 'DELETE'})
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
    '待审核': 'warning',
    '审核中': 'primary',
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
.audit-container {
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