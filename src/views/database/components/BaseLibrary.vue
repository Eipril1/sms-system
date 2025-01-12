<template>
  <div class="library-container">
    <!-- 搜索工具栏 -->
    <div class="toolbar">
      <div class="search-area">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入关键词搜索"
          clearable
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <slot name="extra-search"></slot>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <div class="action-area">
        <slot name="actions">
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="success" @click="handleExport">导出</el-button>
        </slot>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <slot name="columns"></slot>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增' : '编辑'"
      width="50%"
    >
      <slot name="form"></slot>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  keyword: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

// 修改搜索处理函数，添加 emit
const emit = defineEmits(['search', 'reset'])

const handleSearch = () => {
  emit('search', searchForm.keyword)
}

const resetSearch = () => {
  searchForm.keyword = ''
  emit('reset')
}

const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该记录？', '提示', {
    type: 'warning'
  }).then(() => {
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

const handleExport = () => {
  // TODO: 实现导出逻辑
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  handleSearch()
}

const handleSubmit = () => {
  // TODO: 实现提交逻辑
  dialogVisible.value = false
  ElMessage.success('保存成功')
}

// 在 script setup 中添加 props 定义
const props = defineProps<{
  data?: any[]
}>()

// 监听 props.data 的变化
watch(() => props.data, (newData) => {
  if (newData) {
    tableData.value = newData
    total.value = newData.length
  }
}, { immediate: true })

// 暴露方法供父组件使用
defineExpose({
  handleSearch,
  resetSearch
})
</script>

<style scoped>
.library-container {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 200px;
}

.action-area {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 