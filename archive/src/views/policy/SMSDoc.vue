<template>
  <div class="sms-doc-container">
    <div class="page-header">
      <h2>SMS文件管理</h2>
    </div>

    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="文件管理" name="file">
        <!-- 文件管理内容 -->
        <div class="file-manage">
          <!-- 搜索区域 -->
          <el-card class="search-card">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="文件类型">
                <el-select
                    v-model="searchForm.type"
                    placeholder="请选择类型"
                    clearable
                    style="width: 160px"
                >
                  <el-option label="部门月报" value="monthly"/>
                  <el-option label="安全会议纪要" value="meeting"/>
                  <el-option label="安全简报" value="bulletin"/>
                  <el-option label="管理手册" value="manual"/>
                </el-select>
              </el-form-item>
              <el-form-item label="部门">
                <el-select
                    v-model="searchForm.department"
                    placeholder="请选择部门"
                    clearable
                    style="width: 160px"
                >
                  <el-option label="运行部" value="operation"/>
                  <el-option label="维修部" value="maintenance"/>
                  <el-option label="安全监察部" value="safety"/>
                </el-select>
              </el-form-item>
              <el-form-item label="日期">
                <el-date-picker
                    v-model="searchForm.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 360px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 文件列表 -->
          <el-table :data="fileList" border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"/>
            <el-table-column prop="name" label="文件名称" min-width="200">
              <template #default="{ row }">
                <el-link type="primary" @click="handleView(row)">{{ row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="文件类型" width="120">
              <template #default="{ row }">
                <el-tag>{{ getFileTypeName(row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="部门" width="120">
              <template #default="{ row }">
                {{ getDepartmentName(row.department) }}
              </template>
            </el-table-column>
            <el-table-column prop="uploadTime" label="上传时间" width="180"/>
            <el-table-column prop="uploader" label="上传人" width="120"/>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleDownload(row)">下载</el-button>
                <el-button type="primary" link @click="handleView(row)">查看</el-button>
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
      </el-tab-pane>

      <el-tab-pane label="规章管理" name="regulation">
        <regulation-manage/>
      </el-tab-pane>

      <el-tab-pane label="符合性对标" name="compliance">
        <compliance-check/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import RegulationManage from '@/views/policy/components/RegulationManage.vue'
import ComplianceCheck from '@/views/policy/components/ComplianceCheck.vue'

// 当前激活的标签页
const activeTab = ref('file')

// 搜索表单
const searchForm = ref({
  type: '',
  department: '',
  date: []
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 文件列表数据
const fileList = ref([
  {
    name: '2024年1月运行部安全月报',
    type: 'monthly',
    department: 'operation',
    uploadTime: '2024-02-01 10:00:00',
    uploader: '张三',
    url: 'http://example.com/file1.pdf'
  },
  {
    name: '2024年第一季度安全工作会议纪要',
    type: 'meeting',
    department: 'safety',
    uploadTime: '2024-01-15 14:30:00',
    uploader: '李四',
    url: 'http://example.com/file2.pdf'
  },
  {
    name: '2024年1月安全简报第1期',
    type: 'bulletin',
    department: 'safety',
    uploadTime: '2024-01-10 09:00:00',
    uploader: '王五',
    url: 'http://example.com/file3.pdf'
  },
  {
    name: '维修部安全管理手册V2.0',
    type: 'manual',
    department: 'maintenance',
    uploadTime: '2024-01-05 16:00:00',
    uploader: '赵六',
    url: 'http://example.com/file4.pdf'
  }
])

// 获取文件类型名称
const getFileTypeName = (type: string) => {
  const map: Record<string, string> = {
    monthly: '部门月报',
    meeting: '会议纪要',
    bulletin: '安全简报',
    manual: '管理手册'
  }
  return map[type] || type
}

// 获取部门名称
const getDepartmentName = (department: string) => {
  const map: Record<string, string> = {
    operation: '运行部',
    maintenance: '维修部',
    safety: '安全监察部'
  }
  return map[department] || department
}

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索条件:', searchForm.value)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    type: '',
    department: '',
    date: []
  }
  handleSearch()
}

// 下载文件
const handleDownload = (row: any) => {
  window.open(row.url)
}

// 查看文件
const handleView = (row: any) => {
  window.open(row.url)
}

// 删除文件
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该文件？', '提示', {
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
.sms-doc-container {
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

:deep(.el-table) {
  margin-top: 20px;
}

.file-manage {
  min-height: calc(100vh - 200px);
}
</style> 