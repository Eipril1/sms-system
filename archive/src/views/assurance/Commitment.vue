<template>
  <div class="commitment-container">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>安全承诺</h2>
        <div class="toolbar">
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus/>
            </el-icon>
            新增承诺
          </el-button>
          <el-button type="primary" @click="handleBatchDelete" :disabled="!selectedRows.length">
            <el-icon>
              <Delete/>
            </el-icon>
            批量删除
            <template #default v-if="selectedRows.length">
              ({{ selectedRows.length }})
            </template>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="承诺人">
          <el-input v-model="searchForm.committer" placeholder="请输入承诺人" clearable/>
        </el-form-item>
        <el-form-item label="承诺类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="岗位安全承诺" value="position"/>
            <el-option label="项目安全承诺" value="project"/>
            <el-option label="专项安全承诺" value="special"/>
          </el-select>
        </el-form-item>
        <el-form-item label="承诺日期">
          <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="code" label="承诺编号" width="120"/>
        <el-table-column prop="type" label="承诺类型" width="120">
          <template #default="{ row }">
            {{ getCommitmentTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="committer" label="承诺人" width="100"/>
        <el-table-column prop="position" label="职位" width="120"/>
        <el-table-column prop="department" label="部门" width="120"/>
        <el-table-column prop="commitmentDate" label="承诺日期" width="120"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增承诺' : '编辑承诺'"
        width="60%"
    >
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="承诺类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="岗位安全承诺" value="position"/>
                <el-option label="项目安全承诺" value="project"/>
                <el-option label="专项安全承诺" value="special"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="承诺日期" prop="commitmentDate">
              <el-date-picker
                  v-model="form.commitmentDate"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="承诺人" prop="committer">
              <el-input v-model="form.committer" placeholder="请输入承诺人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="form.position" placeholder="请输入职位"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-input v-model="form.department" placeholder="请输入部门"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="生效中" value="active"/>
                <el-option label="已过期" value="expired"/>
                <el-option label="已撤销" value="revoked"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="承诺内容" prop="content">
          <el-input
              v-model="form.content"
              type="textarea"
              rows="4"
              placeholder="请输入承诺内容"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
              v-model="form.remark"
              type="textarea"
              rows="2"
              placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
        v-model="detailVisible"
        title="承诺详情"
        width="70%"
    >
      <div class="detail-content">
        <div class="section">
          <h4>基本信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">承诺编号：</span>
              <span>{{ currentItem?.code }}</span>
            </div>
            <div class="info-item">
              <span class="label">承诺类型：</span>
              <span>{{ getCommitmentTypeText(currentItem?.type) }}</span>
            </div>
            <div class="info-item">
              <span class="label">承诺日期：</span>
              <span>{{ currentItem?.commitmentDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态：</span>
              <el-tag :type="getStatusType(currentItem?.status)">
                {{ currentItem?.status }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="section">
          <h4>承诺人信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">承诺人：</span>
              <span>{{ currentItem?.committer }}</span>
            </div>
            <div class="info-item">
              <span class="label">职位：</span>
              <span>{{ currentItem?.position }}</span>
            </div>
            <div class="info-item">
              <span class="label">部门：</span>
              <span>{{ currentItem?.department }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h4>承诺内容</h4>
          <div class="content-box">
            <div class="text">{{ currentItem?.content }}</div>
          </div>
        </div>

        <div class="section" v-if="currentItem?.remark">
          <h4>备注</h4>
          <div class="content-box">
            <div class="text">{{ currentItem?.remark }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Plus, Delete} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'

// 搜索表单
const searchFormRef = ref()
const searchForm = ref({
  committer: '',
  type: '',
  dateRange: []
})

// 表格数据
const tableData = ref([
  {
    id: '1',
    code: 'SC2024001',
    type: 'position',
    committer: '张三',
    position: '施工队长',
    department: '施工部',
    commitmentDate: '2024-01-15',
    status: '生效中',
    content: '我承诺严格遵守安全生产规章制度，确保施工安全...',
    remark: '年度安全承诺'
  },
  {
    id: '2',
    code: 'SC2024002',
    type: 'project',
    committer: '李四',
    position: '项目经理',
    department: '工程部',
    commitmentDate: '2024-01-16',
    status: '生效中',
    content: '我承诺落实项目安全责任制，保障项目安全运行...',
    remark: '项目开工安全承诺'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

// 选中行
const selectedRows = ref<any[]>([])

// 表单相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = ref({
  type: '',
  commitmentDate: '',
  committer: '',
  position: '',
  department: '',
  status: 'active',
  content: '',
  remark: ''
})

const rules = {
  type: [{required: true, message: '请选择承诺类型', trigger: 'change'}],
  commitmentDate: [{required: true, message: '请选择承诺日期', trigger: 'change'}],
  committer: [{required: true, message: '请输入承诺人', trigger: 'blur'}],
  position: [{required: true, message: '请输入职位', trigger: 'blur'}],
  department: [{required: true, message: '请输入部门', trigger: 'blur'}],
  status: [{required: true, message: '请选择状态', trigger: 'change'}],
  content: [
    {required: true, message: '请输入承诺内容', trigger: 'blur'},
    {min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur'}
  ]
}

// 详情相关
const detailVisible = ref(false)
const currentItem = ref<any>(null)

// 方法定义
const handleSearch = () => {
  console.log('搜索条件：', searchForm.value)
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
}

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    type: '',
    commitmentDate: '',
    committer: '',
    position: '',
    department: '',
    status: 'active',
    content: '',
    remark: ''
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
  detailVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
      '确定要删除该承诺记录吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    console.log('删除：', row)
    ElMessage.success('删除成功')
  })
}

const handleBatchDelete = () => {
  if (!selectedRows.value.length) return
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条记录吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    console.log('批量删除：', selectedRows.value)
    ElMessage.success('删除成功')
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('表单数据：', form.value)
      dialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

// 工具方法
const getCommitmentTypeText = (type: string) => {
  const map: Record<string, string> = {
    position: '岗位安全承诺',
    project: '项目安全承诺',
    special: '专项安全承诺'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '生效中': 'success',
    '已过期': 'warning',
    '已撤销': 'info'
  }
  return map[status] || 'info'
}
</script>

<style scoped>
.commitment-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h2 {
  margin: 0;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}

.detail-content {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 16px 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .label {
  color: #666;
  min-width: 80px;
}

.content-box {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
}

.content-box .text {
  line-height: 1.6;
  white-space: pre-line;
}

.section {
  margin-bottom: 24px;
}

.section h4 {
  margin: 0 0 16px;
  color: #333;
}
</style> 