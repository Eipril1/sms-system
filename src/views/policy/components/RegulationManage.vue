<template>
  <div class="regulation-manage">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon>
          <Plus/>
        </el-icon>
        新增规章
      </el-button>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="规章编号">
          <el-input v-model="searchForm.regNumber" placeholder="请输入规章编号" clearable/>
        </el-form-item>
        <el-form-item label="规章类型">
          <el-select v-model="searchForm.regType" placeholder="请选择类型" clearable>
            <el-option label="CCAR" value="CCAR"/>
            <el-option label="AC" value="AC"/>
            <el-option label="其他" value="OTHER"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 规章列表 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="regNumber" label="规章编号" width="120"/>
      <el-table-column prop="regType" label="规章类型" width="100"/>
      <el-table-column prop="title" label="规章标题"/>
      <el-table-column prop="publishDate" label="发布日期" width="120"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '有效' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleView(row)">查看</el-button>
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" link @click="handleCompliance(row)">符合性声明</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'

// 搜索表单
const searchForm = ref({
  regNumber: '',
  regType: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格数据
const tableData = ref([
  {
    regNumber: 'CCAR-121',
    regType: 'CCAR',
    title: '大型飞机公共航空运输承运人运行合格审定规则',
    publishDate: '2024-01-01',
    status: '有效'
  }
])

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    regNumber: '',
    regType: ''
  }
  handleSearch()
}

// 新增
const handleAdd = () => {
  // TODO: 实现新增逻辑
}

// 编辑
const handleEdit = (row: any) => {
  // TODO: 实现编辑逻辑
}

// 查看
const handleView = (row: any) => {
  // TODO: 实现查看逻辑
}

// 符合性声明
const handleCompliance = (row: any) => {
  // TODO: 实现符合性声明逻辑
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该规章？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.regulation-manage {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 