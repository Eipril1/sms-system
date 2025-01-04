<template>
  <div class="info-container">
    <!-- 顶部工具栏 -->
    <div class="content-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>发布信息
      </el-button>
    </div>

    <!-- 二级导航 -->
    <div class="sub-nav">
      <div 
        v-for="item in navItems" 
        :key="item.key"
        :class="['nav-item', { active: activeTab === item.key }]"
        @click="activeTab = item.key"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 安全通告、典型案例发布 -->
      <template v-if="activeTab === 'publish'">
        <el-table :data="publishList" border style="width: 100%">
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row }">
              <el-tag :type="row.type === 'notice' ? 'warning' : 'success'">
                {{ row.type === 'notice' ? '安全通告' : '典型案例' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="发布时间" width="160" />
          <el-table-column prop="publisher" label="发布人" width="120" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleView(row)">查看</el-button>
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 案例库查询 -->
      <template v-else>
        <!-- 搜索表单 -->
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="请输入关键词" />
          </el-form-item>
          <el-form-item label="案例类型">
            <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
              <el-option label="事故案例" value="accident" />
              <el-option label="隐患案例" value="hazard" />
              <el-option label="管理案例" value="management" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 案例列表 -->
        <el-table :data="caseList" border style="width: 100%">
          <el-table-column prop="title" label="案例标题" />
          <el-table-column prop="type" label="案例类型" width="120" />
          <el-table-column prop="industry" label="所属行业" width="120" />
          <el-table-column prop="date" label="发生日期" width="120" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleViewCase(row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

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

    <!-- 表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '发布信息' : '编辑信息'"
      width="60%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="信息类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="notice">安全通告</el-radio>
            <el-radio label="case">典型案例</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            action="#"
            :auto-upload="false"
            multiple
          >
            <el-button type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template> 

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

// 二级导航项
const navItems = [
  { key: 'publish', label: '安全通告、典型案例发布' },
  { key: 'case', label: '案例库查询' }
]

// 当前激活的标签
const activeTab = ref('publish')

// 发布列表数据
const publishList = ref([
  {
    title: '关于加强雨季运行安全管理的通知',
    type: 'notice',
    publishTime: '2024-01-15',
    publisher: '安全管理部'
  },
  {
    title: '某航空公司起落架故障处置典型案例分析',
    type: 'case',
    publishTime: '2024-01-10',
    publisher: '安全监察部'
  }
])

// 案例库数据
const caseList = ref([
  {
    title: '发动机空中停车事件分析',
    type: '事故案例',
    industry: '航空运输',
    date: '2023-12-01',
    content: '详细分析发动机故障原因及处置过程...'
  },
  {
    title: '跑道积水偏出事件警示',
    type: '事故案例',
    industry: '航空运输',
    date: '2023-11-15',
    content: '分析恶劣天气下的运行风险...'
  }
])

// 搜索表单
const searchForm = ref({
  keyword: '',
  type: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = ref({
  type: 'notice',
  title: '',
  content: '',
  attachments: []
})

// 表单验证规则
const rules = {
  type: [{ required: true, message: '请选择信息类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

// 处理搜索
const handleSearch = () => {
  // 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    type: ''
  }
  handleSearch()
}

// 新增信息
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    type: 'notice',
    title: '',
    content: '',
    attachments: []
  }
  dialogVisible.value = true
}

// 编辑信息
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 查看信息
const handleView = (row: any) => {
  // 实现查看逻辑
}

// 删除信息
const handleDelete = (row: any) => {
  // 实现删除逻辑
}

// 查看案例详情
const handleViewCase = (row: any) => {
  // 实现案例查看逻辑
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
    }
  })
}
</script> 

<style scoped>
.info-container {
  padding: 20px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 二级导航样式 */
.sub-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
}

.nav-item {
  padding: 8px 16px;
  color: #303133;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
  }

  &.active {
    color: #409eff;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

/* 表格内容样式 */
.content-area {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}
</style> 