<template>
  <div class="emergency-container">
    <div class="page-header">
      <h2>应急预案协调</h2>
      <el-button type="primary" @click="handleAdd">新增预案</el-button>
    </div>

    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="预案类型">
          <el-select v-model="searchForm.type" placeholder="请选择预案类型">
            <el-option label="综合预案" value="comprehensive"/>
            <el-option label="专项预案" value="special"/>
            <el-option label="现场处置方案" value="onsite"/>
          </el-select>
        </el-form-item>
        <el-form-item label="预案状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="在用" value="active"/>
            <el-option label="修订中" value="revising"/>
            <el-option label="已废止" value="obsolete"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预案列表 -->
    <el-card class="content-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="code" label="预案编号" width="120"/>
        <el-table-column prop="name" label="预案名称"/>
        <el-table-column prop="type" label="预案类型" width="120">
          <template #default="{ row }">
            {{ getEmergencyTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本号" width="100"/>
        <el-table-column prop="updateDate" label="更新日期" width="180"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handleDrill(row)">演练记录</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增预案' : '编辑预案'"
        width="60%"
    >
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="预案名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入预案名称"/>
        </el-form-item>
        <el-form-item label="预案类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择预案类型">
            <el-option label="综合预案" value="comprehensive"/>
            <el-option label="专项预案" value="special"/>
            <el-option label="现场处置方案" value="onsite"/>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号"/>
        </el-form-item>
        <el-form-item label="适用范围" prop="scope">
          <el-input
              v-model="form.scope"
              type="textarea"
              rows="3"
              placeholder="请输入适用范围"
          />
        </el-form-item>
        <el-form-item label="预案内容" prop="content">
          <el-input
              v-model="form.content"
              type="textarea"
              rows="6"
              placeholder="请输入预案内容"
          />
        </el-form-item>
        <el-form-item label="协调部门">
          <el-select
              v-model="form.departments"
              multiple
              placeholder="请选择协调部门"
          >
            <el-option label="安全监察部" value="safety"/>
            <el-option label="运行控制部" value="operation"/>
            <el-option label="维修工程部" value="maintenance"/>
          </el-select>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
              action="/api/upload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
          >
            <el-button type="primary">上传附件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传预案文件、流程图等相关材料
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 演练记录对话框 -->
    <el-dialog
        v-model="drillDialogVisible"
        :title="`${currentItem?.name} - 演练记录`"
        width="70%"
    >
      <div class="drill-header">
        <h4>演练记录列表</h4>
        <el-button type="primary" size="small" @click="handleAddDrill">
          新增演练记录
        </el-button>
      </div>
      <el-table :data="drillRecords" border style="width: 100%">
        <el-table-column prop="date" label="演练日期" width="180"/>
        <el-table-column prop="type" label="演练类型" width="120"/>
        <el-table-column prop="participants" label="参与部门"/>
        <el-table-column prop="leader" label="演练负责人" width="120"/>
        <el-table-column prop="result" label="演练结果" width="100">
          <template #default="{ row }">
            <el-tag :type="row.result === '通过' ? 'success' : 'warning'">
              {{ row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDrill(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// 查询表单
const searchForm = ref({
  type: '',
  status: ''
})

// 表格数据
const tableData = ref([
  {
    code: 'EP2024001',
    name: '航空器故障应急预案',
    type: 'special',
    version: 'V2.0',
    updateDate: '2024-01-01',
    status: '在用',
    scope: '适用于航空器发生故障时的应急处置',
    content: '1. 应急响应程序\n2. 处置流程\n3. 职责分工',
    departments: ['safety', 'operation', 'maintenance'],
    attachments: [
      {name: '应急预案文件.pdf', url: '#'},
      {name: '流程图.pdf', url: '#'}
    ]
  }
])

// 演练记录数据
const drillRecords = ref([
  {
    date: '2024-02-15',
    type: '桌面演练',
    participants: '安全监察部、运行控制部',
    leader: '张三',
    result: '通过',
    summary: '演练达到预期目标，发现并整改3个问题点'
  }
])

// 对话框控制
const dialogVisible = ref(false)
const drillDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentItem = ref<any>(null)

// 表单数据
const form = ref({
  name: '',
  type: '',
  version: '',
  scope: '',
  content: '',
  departments: [] as string[],
  attachments: []
})

// 方法实现
const getEmergencyTypeText = (type: string) => {
  const map: Record<string, string> = {
    'comprehensive': '综合预案',
    'special': '专项预案',
    'onsite': '现场处置方案'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '在用': 'success',
    '修订中': 'warning',
    '已废止': 'info'
  }
  return map[status] || ''
}

const handleSearch = () => {
  // 实现查询逻辑
}

const resetSearch = () => {
  searchForm.value = {
    type: '',
    status: ''
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    type: '',
    version: '',
    scope: '',
    content: '',
    departments: [],
    attachments: []
  }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.value = {...row}
  dialogVisible.value = true
}

const handleView = (row: any) => {
  currentItem.value = row
  // 实现查看逻辑
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该预案？', '提示', {
    type: 'warning'
  })
}

const handleDrill = (row: any) => {
  currentItem.value = row
  drillDialogVisible.value = true
}

const handleAddDrill = () => {
  // 实现添加演练记录逻辑
}

const handleViewDrill = (row: any) => {
  // 实现查看演练记录详情逻辑
}

const handleSubmit = () => {
  dialogVisible.value = false
  ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
}

const handleUploadSuccess = (response: any) => {
  ElMessage.success('上传成功')
}

const handleUploadError = () => {
  ElMessage.error('上传失败')
}
</script>

<style scoped>
.emergency-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.content-card {
  margin-bottom: 20px;
}

.drill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.el-upload__tip {
  color: #666;
  font-size: 12px;
  margin-top: 5px;
}
</style> 