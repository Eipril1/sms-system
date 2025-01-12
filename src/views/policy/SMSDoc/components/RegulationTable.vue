<template>
  <div class="regulation-table">
    <el-table :data="data" border style="width: 100%">
      <el-table-column prop="code" label="规章编号" width="120" />
      <el-table-column prop="name" label="规章名称" min-width="300" />
      <el-table-column prop="publishDate" label="发布日期" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '现行有效' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="primary" @click="handleCheck(row)">对标</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
interface RegulationData {
  id: number
  code: string
  name: string
  publishDate: string
  status: string
}

defineProps<{
  data: RegulationData[]
}>()

const handleView = (row: RegulationData) => {
  console.log('查看规章:', row)
}

const handleCheck = (row: RegulationData) => {
  console.log('规章对标:', row)
}
</script>

<style scoped>
.regulation-table {
  margin-top: 20px;
}
</style> 