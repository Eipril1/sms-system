<template>
  <div class="check-task">
    <div class="page-header">
      <h2>检查任务</h2>
      <el-button type="primary" @click="handleAdd">新增任务</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="任务编号">
          <el-input v-model="searchForm.taskNo" placeholder="请输入编号" clearable />
        </el-form-item>
        <el-form-item label="检查部门">
          <el-select v-model="searchForm.department" placeholder="请选择" clearable>
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
            v-model="searchForm.checkTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="未开始" value="pending" />
            <el-option label="进行中" value="processing" />
            <el-option label="已完成" value="completed" />
          </el-select>
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
      <el-table-column prop="taskNo" label="任务编号" width="140" />
      <el-table-column prop="checkProject" label="检查项目" min-width="200" show-overflow-tooltip />
      <el-table-column prop="department" label="检查部门" width="120" />
      <el-table-column prop="checkTeam" label="检查组成员" width="150" />
      <el-table-column prop="checkTime" label="检查时间" width="160" />
      <el-table-column prop="checkLocation" label="检查地点" width="120" />
      <el-table-column prop="itemCount" label="检查项数量" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
          <el-button link type="success" @click="handleExecute(row)">执行检查</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="检查项目" prop="checkProject">
          <el-input v-model="form.checkProject" />
        </el-form-item>
        <el-form-item label="检查部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择">
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查组成员" prop="checkTeam">
          <el-select
            v-model="form.checkTeam"
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
        <el-form-item label="检查时间" prop="checkTime">
          <el-date-picker
            v-model="form.checkTime"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="检查地点" prop="checkLocation">
          <el-input v-model="form.checkLocation" />
        </el-form-item>
        
        <!-- 检查项选择 -->
        <el-form-item label="检查项" prop="checkItems">
          <el-card class="check-items-card">
            <template #header>
              <div class="items-header">
                <span>已选择 {{ form.checkItems.length }} 项</span>
                <el-button type="primary" link @click="showItemSelector = true">
                  从检查项库选择
                </el-button>
              </div>
            </template>
            <el-table :data="form.checkItems" style="width: 100%">
              <el-table-column prop="itemNo" label="编号" width="100" />
              <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
              <el-table-column prop="standard" label="检查标准" show-overflow-tooltip />
              <el-table-column label="操作" width="80">
                <template #default="{ $index }">
                  <el-button link type="danger" @click="removeCheckItem($index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 检查项选择器对话框 -->
    <el-dialog
      v-model="showItemSelector"
      title="选择检查项"
      width="900px"
      append-to-body
    >
      <el-form :inline="true" :model="itemSearchForm" class="item-search">
        <el-form-item label="检查类型">
          <el-select v-model="itemSearchForm.type" placeholder="请选择" clearable>
            <el-option label="运行检查" value="operation" />
            <el-option label="维修检查" value="maintenance" />
            <el-option label="安全检查" value="safety" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="itemSearchForm.keyword" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchItems">搜索</el-button>
          <el-button @click="resetItemSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        ref="itemSelectorTable"
        :data="checkItemsList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="itemNo" label="编号" width="100" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="content" label="检查内容" show-overflow-tooltip />
        <el-table-column prop="standard" label="检查标准" show-overflow-tooltip />
      </el-table>

      <template #footer>
        <el-button @click="showItemSelector = false">取消</el-button>
        <el-button type="primary" @click="confirmSelectItems">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, TableInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 部门选项
const departmentOptions = [
  { label: '飞行部', value: '飞行部' },
  { label: '维修部', value: '维修部' },
  { label: '运控部', value: '运控部' },
  { label: '客舱部', value: '客舱部' },
  { label: '安全部', value: '安全部' }
]

// 审核人员选项
const auditorOptions = [
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '赵六', value: '赵六' },
  { label: '陈工', value: '陈工' },
  { label: '刘工', value: '刘工' }
]

// 搜索表单
const searchForm = reactive({
  taskNo: '',
  department: '',
  checkTime: [],
  status: ''
})

// 表格数据
const tableData = ref([
  {
    taskNo: 'RLJC-2024001',
    checkProject: '次日航班风险评估检查',
    department: '运控部',
    checkTeam: ['张三', '李四'],
    checkTime: '2024-03-15 09:00',
    checkLocation: '运控中心',
    itemCount: 12,
    status: '已完成',
    checkItems: []
  },
  {
    taskNo: 'RLJC-2024002',
    checkProject: '机组资质检查',
    department: '飞行部',
    checkTeam: ['王五', '赵六'],
    checkTime: '2024-03-16 14:00',
    checkLocation: '飞行部',
    itemCount: 15,
    status: '进行中',
    checkItems: []
  },
  {
    taskNo: 'RLJC-2024003',
    checkProject: '航线维修质量检查',
    department: '维修部',
    checkTeam: ['陈工', '刘工'],
    checkTime: '2024-03-17 10:00',
    checkLocation: '机务维修区',
    itemCount: 20,
    status: '未开始',
    checkItems: []
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  taskNo: '',
  checkProject: '',
  department: '',
  checkTeam: [],
  checkTime: '',
  checkLocation: '',
  checkItems: [] as any[]
})

// 表单验证规则
const rules = {
  checkProject: [{ required: true, message: '请输入检查项目', trigger: 'blur' }],
  department: [{ required: true, message: '请选择检查部门', trigger: 'change' }],
  checkTeam: [{ required: true, message: '请选择检查组成员', trigger: 'change' }],
  checkTime: [{ required: true, message: '请选择检查时间', trigger: 'change' }],
  checkLocation: [{ required: true, message: '请输入检查地点', trigger: 'blur' }],
  checkItems: [{ required: true, message: '请选择检查项', trigger: 'change' }]
}

// 检查项选择器
const showItemSelector = ref(false)
const itemSelectorTable = ref<TableInstance>()
const selectedItems = ref<any[]>([])

// 检查项搜索
const itemSearchForm = reactive({
  type: '',
  keyword: ''
})

// 检查项列表
const checkItemsList = ref([
  {
    itemNo: 'CX-001',
    type: '运行检查',
    content: '检查飞行计划的制定是否符合规范',
    standard: '符合CCAR-121部运行规范要求'
  },
  {
    itemNo: 'CX-002',
    type: '维修检查',
    content: '检查航线维修记录的填写',
    standard: '按维修手册要求填写完整、准确'
  },
  {
    itemNo: 'CX-003',
    type: '安全检查',
    content: '检查应急设备的完好性',
    standard: '设备完好、数量齐全、位置正确'
  }
])

// 获取状态标签类型
const getStatusType = (status: string): 'success' | 'warning' | 'info' => {
  const map: Record<string, 'success' | 'warning' | 'info'> = {
    '已完成': 'success',
    '进行中': 'warning',
    '未开始': 'info'
  }
  return map[status] || 'info'
}

// 方法定义
const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索条件：', searchForm)
}

const handleReset = () => {
  searchForm.taskNo = ''
  searchForm.department = ''
  searchForm.checkTime = []
  searchForm.status = ''
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(form, {
    taskNo: '',
    checkProject: '',
    department: '',
    checkTeam: [],
    checkTime: '',
    checkLocation: '',
    checkItems: []
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleView = (row: any) => {
  // 实现查看逻辑
  console.log('查看任务：', row)
}

const handleExecute = (row: any) => {
  // 实现执行检查逻辑
  console.log('执行检查：', row)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该检查任务？', '提示', {
      type: 'warning'
    })
    // 实现删除逻辑
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      dialogVisible.value = false
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
    }
  })
}

// 检查项选择相关方法
const searchItems = () => {
  // 实现检查项搜索逻辑
  console.log('搜索检查项：', itemSearchForm)
}

const resetItemSearch = () => {
  itemSearchForm.type = ''
  itemSearchForm.keyword = ''
}

const handleSelectionChange = (selection: any[]) => {
  selectedItems.value = selection
}

const removeCheckItem = (index: number) => {
  form.checkItems.splice(index, 1)
}

const confirmSelectItems = () => {
  form.checkItems = [...form.checkItems, ...selectedItems.value]
  showItemSelector.value = false
  selectedItems.value = []
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 重新加载数据
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.check-items-card {
  margin-bottom: 20px;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-search {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 