<template>
  <div class="regulation-container">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="规章编号">
        <el-input v-model="searchForm.regNumber" placeholder="如: CCAR-398"/>
      </el-form-item>
      <el-form-item label="规章类型">
        <el-select v-model="searchForm.regType">
          <el-option label="CCAR" value="CCAR"/>
          <el-option label="AC" value="AC"/>
          <el-option label="其他" value="OTHER"/>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="searchForm.keyword" placeholder="请输入关键字"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleSync">同步规章</el-button>
        <el-button type="success" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 规章列表 -->
    <el-table :data="regulationList" v-loading="loading">
      <el-table-column prop="regNumber" label="规章编号" width="120"/>
      <el-table-column prop="regName" label="规章名称"/>
      <el-table-column prop="regType" label="类型" width="100"/>
      <el-table-column prop="publishDate" label="发布日期" width="120"/>
      <el-table-column prop="effectiveDate" label="生效日期" width="120"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link @click="handleViewDetail(row)">查看</el-button>
          <el-button link @click="handleCompliance(row)">符合性</el-button>
          <el-button link type="primary" @click="handleDownload(row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { RegulationItem } from '@/types/business'
import { useRouter } from 'vue-router'

// 定义接口
interface SearchForm {
  regNumber: string
  regType: string
  keyword: string
}

// 搜索表单
const searchForm = ref<SearchForm>({
  regNumber: '',
  regType: '',
  keyword: ''
})

// 规章列表
const regulationList = ref<RegulationItem[]>([])
const loading = ref(false)

// 查询方法
const handleSearch = async () => {
  try {
    loading.value = true
    const res = await fetch('/api/regulation/list', {
      method: 'GET',
      params: searchForm.value
    })
    const data = await res.json()
    regulationList.value = data.data
  } catch (error) {
    console.error(error)
    ElMessage.error('查询失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const handleViewDetail = (row: RegulationItem) => {
  // TODO: 实现查看详情
}

// 符合性声明
const handleCompliance = (row: RegulationItem) => {
  const router = useRouter()
  router.push(`/policy/sms-doc/regulation/compliance/${row.id}`)
}

// 同步规章数据
const handleSync = async () => {
  try {
    loading.value = true
    await fetch('/api/regulation/sync', {
      method: 'POST'
    })
    ElMessage.success('同步成功')
    handleSearch()
  } catch (error) {
    console.error(error)
    ElMessage.error('同步失败')
  } finally {
    loading.value = false
  }
}

// 初始加载
handleSearch()
</script>

<style scoped>
.regulation-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}
</style> 