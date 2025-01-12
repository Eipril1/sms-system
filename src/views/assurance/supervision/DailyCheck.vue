<template>
  <div class="daily-check">
    <div class="page-header">
      <h2>日常检查</h2>
      <el-button type="primary" @click="handleAdd">新增检查任务</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="检查单编号">
          <el-input v-model="searchForm.recordNumber" placeholder="请输入编号" clearable />
        </el-form-item>
        <el-form-item label="被检查部门">
          <el-select v-model="searchForm.responsibleDept" placeholder="请选择" clearable>
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查时间">
          <el-date-picker
            v-model="searchForm.occurTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="recordNumber" label="检查单编号" width="140" />
      <el-table-column prop="checkProject" label="监督审核项目" min-width="200" show-overflow-tooltip />
      <el-table-column prop="title" label="检查对象" width="150" />
      <el-table-column prop="responsibleDept" label="被检查部门" width="120" />
      <el-table-column prop="auditTeamMembers" label="审核组成员" width="150" />
      <el-table-column prop="occurTime" label="检查时间" width="160" />
      <el-table-column prop="checkLocation" label="检查地点" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="primary" @click="handleItems(row)">检查项</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增检查任务' : '编辑检查任务'"
      width="800px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="监督审核项目" prop="checkProject">
          <el-input v-model="form.checkProject" />
        </el-form-item>
        <el-form-item label="检查对象" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="被检查部门" prop="responsibleDept">
          <el-select v-model="form.responsibleDept" placeholder="请选择">
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核组成员" prop="auditTeamMembers">
          <el-select
            v-model="form.auditTeamMembers"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in auditorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查时间" prop="occurTime">
          <el-date-picker
            v-model="form.occurTime"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="检查地点" prop="checkLocation">
          <el-input v-model="form.checkLocation" />
        </el-form-item>
        <el-form-item label="检查依据/重点" prop="checkBasis">
          <el-input
            v-model="form.checkBasis"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  recordNumber: '',
  responsibleDept: '',
  occurTime: []
})

// 表格数据
const tableData = ref([
  {
    recordNumber: 'RLJC-2024001',
    checkProject: '次日航班风险评估检查',
    title: '运行控制部航班签派员',
    responsibleDept: '运控部',
    auditTeamMembers: ['张三', '李四'],
    occurTime: '2024-03-15 09:00',
    checkLocation: '运控中心',
    checkBasis: '《次日航班运行风险评估程序》《运行手册》、局方/公司安全运行文件',
    status: '已完成'
  },
  {
    recordNumber: 'RLJC-2024002',
    checkProject: '机组资质检查',
    title: '飞行部B737机型机组',
    responsibleDept: '飞行部',
    auditTeamMembers: ['王五', '赵六'],
    occurTime: '2024-03-16 14:00',
    checkLocation: '飞行部',
    checkBasis: '《机组资质管理规定》《训练大纲》',
    status: '进行中'
  },
  {
    recordNumber: 'RLJC-2024003',
    checkProject: '航线维修质量检查',
    title: '维修工程部航线一组',
    responsibleDept: '维修部',
    auditTeamMembers: ['陈工', '刘工'],
    occurTime: '2024-03-17 10:00',
    checkLocation: '机务维修区',
    checkBasis: '《航线维修手册》《维修工程管理手册》',
    status: '未开始'
  },
  {
    recordNumber: 'RLJC-2024004',
    checkProject: '客舱应急设备检查',
    title: '客舱部乘务组',
    responsibleDept: '客舱部',
    auditTeamMembers: ['张安全', '李质量'],
    occurTime: '2024-03-18 08:30',
    checkLocation: '培训中心',
    checkBasis: '《客舱安全手册》《应急程序手册》',
    status: '未开始'
  },
  {
    recordNumber: 'RLJC-2024005',
    checkProject: '危险品运输检查',
    title: '货运部危险品操作人员',
    responsibleDept: '货运部',
    auditTeamMembers: ['王安全', '赵工程'],
    occurTime: '2024-03-19 13:30',
    checkLocation: '货运仓库',
    checkBasis: '《危险品运输手册》《货物操作手册》',
    status: '未开始'
  }
])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(5)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  recordNumber: '',
  checkProject: '',
  title: '',
  responsibleDept: '',
  auditTeamMembers: [],
  occurTime: '',
  checkLocation: '',
  checkBasis: ''
})

// 审核人员选项
const auditorOptions = [
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '赵六', value: '赵六' },
  { label: '陈工', value: '陈工' },
  { label: '刘工', value: '刘工' },
  { label: '张安全', value: '张安全' },
  { label: '李质量', value: '李质量' },
  { label: '王安全', value: '王安全' },
  { label: '赵工程', value: '赵工程' }
]

// 表单验证规则
const rules = {
  checkProject: [{ required: true, message: '请输入监督审核项目', trigger: 'blur' }],
  title: [{ required: true, message: '请输入检查对象', trigger: 'blur' }],
  responsibleDept: [{ required: true, message: '请选择被检查部门', trigger: 'change' }],
  auditTeamMembers: [{ required: true, message: '请选择审核组成员', trigger: 'change' }],
  occurTime: [{ required: true, message: '请选择检查时间', trigger: 'change' }],
  checkLocation: [{ required: true, message: '请输入检查地点', trigger: 'blur' }]
}

// 获取状态标签类型
const getStatusType = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    '未开始': 'info',
    '进行中': 'warning',
    '已完成': 'success'
  }
  return map[status] || 'info'
}

// 方法定义
const handleSearch = () => {
  // 实现搜索逻辑
}

const handleReset = () => {
  searchForm.recordNumber = ''
  searchForm.responsibleDept = ''
  searchForm.occurTime = []
}

const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleView = (row: any) => {
  // 实现查看逻辑
}

const handleItems = (row: any) => {
  // 实现检查项管理逻辑
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 重新加载数据
}

// 更新部门选项
const departmentOptions = [
  { label: '飞行部', value: '飞行部' },
  { label: '维修部', value: '维修部' },
  { label: '运控部', value: '运控部' },
  { label: '客舱部', value: '客舱部' },
  { label: '货运部', value: '货运部' },
  { label: '安全部', value: '安全部' }
]
</script>

<style scoped>
.daily-check {
  height: 100%;
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 