<template>
  <div class="plan-container">
    <!-- 顶部标签页 -->
    <el-tabs v-model="activeTab" class="plan-tabs">
      <!-- 培训计划制定 -->
      <el-tab-pane label="培训计划制定" name="planning">
        <div class="plan-content">
          <!-- 工具栏 -->
          <div class="content-header">
            <el-button type="primary" @click="handleAddPlan">
              <el-icon>
                <Plus/>
              </el-icon>
              新增计划
            </el-button>
          </div>

          <!-- 计划列表 -->
          <el-table :data="planList" border style="width: 100%">
            <el-table-column prop="code" label="培训编号" width="120"/>
            <el-table-column prop="name" label="培训名称"/>
            <el-table-column prop="type" label="培训类型" width="140">
              <template #default="{ row }">
                {{ utils.getTrainingTypeText(row.type) }}
              </template>
            </el-table-column>
            <el-table-column prop="trainer" label="培训讲师" width="120"/>
            <el-table-column prop="startDate" label="开始日期" width="120"/>
            <el-table-column prop="endDate" label="结束日期" width="120"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="utils.getStatusType(row.status)">
                  {{ utils.getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleViewPlan(row)">查看</el-button>
                <el-button type="primary" link @click="handleEditPlan(row)">编辑</el-button>
                <el-button type="success" link @click="handleExamPlan(row)">考勤</el-button>
                <el-button type="danger" link @click="handleDeletePlan(row)">删除</el-button>
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
        </div>
      </el-tab-pane>

      <!-- 讲师管理 -->
      <el-tab-pane label="讲师管理" name="trainer">
        <div class="trainer-content">
          <!-- 工具栏 -->
          <div class="content-header">
            <el-button type="primary" @click="handleAddTrainer">
              <el-icon>
                <Plus/>
              </el-icon>
              新增讲师
            </el-button>
          </div>

          <!-- 讲师列表 -->
          <el-table :data="trainerList" border style="width: 100%">
            <el-table-column prop="name" label="讲师姓名"/>
            <el-table-column prop="specialty" label="专业领域"/>
            <el-table-column prop="qualification" label="资质证书"/>
            <el-table-column prop="experience" label="培训经验"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                  {{ row.status === 'active' ? '在职' : '离职' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditTrainer(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDeleteTrainer(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 人员管理 -->
      <el-tab-pane label="人员管理" name="personnel">
        <div class="personnel-content">
          <!-- 工具栏 -->
          <div class="content-header">
            <el-button type="primary" @click="handleAddPersonnel">
              <el-icon>
                <Plus/>
              </el-icon>
              新增人员
            </el-button>
          </div>

          <!-- 人员列表 -->
          <el-table :data="personnelList" border style="width: 100%">
            <el-table-column prop="name" label="姓名"/>
            <el-table-column prop="department" label="部门"/>
            <el-table-column prop="position" label="岗位"/>
            <el-table-column prop="trainingStatus" label="培训状态">
              <template #default="{ row }">
                <el-tag :type="utils.getTrainingStatusType(row.trainingStatus)">
                  {{ utils.getStatusText(row.trainingStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditPersonnel(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDeletePersonnel(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 计划表单对话框 -->
    <el-dialog
        v-model="planDialogVisible"
        :title="planDialogType === 'add' ? '新增培训计划' : '编辑培训计划'"
        width="60%"
    >
      <el-form ref="planFormRef" :model="planForm" :rules="planRules" label-width="100px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="planForm.name" placeholder="请输入计划名称"/>
        </el-form-item>
        <el-form-item label="培训类型" prop="type">
          <el-select v-model="planForm.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="三级安全教育" value="three-level"/>
            <el-option label="特种作业培训" value="special"/>
            <el-option label="安全管理培训" value="management"/>
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                  v-model="planForm.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                  v-model="planForm.endDate"
                  type="date"
                  placeholder="选择结束日期"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="培训讲师" prop="trainer">
          <el-select v-model="planForm.trainer" placeholder="请选择讲师" style="width: 100%">
            <el-option
                v-for="trainer in trainerList"
                :key="trainer.id"
                :label="trainer.name"
                :value="trainer.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="培训地点" prop="location">
          <el-input v-model="planForm.location" placeholder="请输入培训地点"/>
        </el-form-item>
        <el-form-item label="培训内容" prop="content">
          <el-input
              v-model="planForm.content"
              type="textarea"
              :rows="3"
              placeholder="请输入培训内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="planDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitPlan">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 讲师表单对话框 -->
    <el-dialog
        v-model="trainerDialogVisible"
        :title="trainerDialogType === 'add' ? '新增讲师' : '编辑讲师'"
        width="50%"
    >
      <el-form ref="trainerFormRef" :model="trainerForm" :rules="trainerRules" label-width="100px">
        <el-form-item label="讲师姓名" prop="name">
          <el-input v-model="trainerForm.name" placeholder="请输入讲师姓名"/>
        </el-form-item>
        <el-form-item label="专业领域" prop="specialty">
          <el-select v-model="trainerForm.specialty" placeholder="请选择专业领域" multiple style="width: 100%">
            <el-option label="安全生产" value="safety"/>
            <el-option label="特种作业" value="special"/>
            <el-option label="应急管理" value="emergency"/>
            <el-option label="职业健康" value="health"/>
          </el-select>
        </el-form-item>
        <el-form-item label="资质证书" prop="qualification">
          <el-input v-model="trainerForm.qualification" placeholder="请输入资质证书"/>
        </el-form-item>
        <el-form-item label="培训经验" prop="experience">
          <el-input
              v-model="trainerForm.experience"
              type="textarea"
              :rows="3"
              placeholder="请输入培训经验"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="trainerForm.status">
            <el-radio label="active">在职</el-radio>
            <el-radio label="inactive">离职</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="trainerForm.contact" placeholder="请输入联系方式"/>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
              v-model="trainerForm.remarks"
              type="textarea"
              :rows="2"
              placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="trainerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitTrainer">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 人员表单对话框 -->
    <el-dialog
        v-model="personnelDialogVisible"
        :title="personnelDialogType === 'add' ? '新增人员' : '编辑人员'"
        width="50%"
    >
      <el-form ref="personnelFormRef" :model="personnelForm" :rules="personnelRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="personnelForm.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-cascader
              v-model="personnelForm.department"
              :options="departmentOptions"
              :props="{ checkStrictly: true }"
              placeholder="请选择部门"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="岗位" prop="position">
          <el-select v-model="personnelForm.position" placeholder="请选择岗位" style="width: 100%">
            <el-option label="操作工" value="operator"/>
            <el-option label="技术员" value="technician"/>
            <el-option label="管理人员" value="manager"/>
            <el-option label="安全员" value="safety-officer"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="employeeId">
          <el-input v-model="personnelForm.employeeId" placeholder="请输入工号"/>
        </el-form-item>
        <el-form-item label="入职日期" prop="entryDate">
          <el-date-picker
              v-model="personnelForm.entryDate"
              type="date"
              placeholder="选择入职日期"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="personnelForm.contact" placeholder="请输入联系方式"/>
        </el-form-item>
        <el-form-item label="培训状态" prop="trainingStatus">
          <el-select v-model="personnelForm.trainingStatus" placeholder="请选择状态" style="width: 100%">
            <el-option label="待培训" value="pending"/>
            <el-option label="培训中" value="training"/>
            <el-option label="已完成" value="completed"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
              v-model="personnelForm.remarks"
              type="textarea"
              :rows="2"
              placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="personnelDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitPersonnel">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'

// 当前激活的标签页
const activeTab = ref('planning')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 搜索表单
const searchForm = ref({
  name: '',
  type: ''
})

// 对话框显示控制
const planDialogVisible = ref(false)
const trainerDialogVisible = ref(false)
const personnelDialogVisible = ref(false)

// 对话框类型
const planDialogType = ref<'add' | 'edit'>('add')
const trainerDialogType = ref<'add' | 'edit'>('add')
const personnelDialogType = ref<'add' | 'edit'>('add')

// 表单引用
const planFormRef = ref()
const trainerFormRef = ref()
const personnelFormRef = ref()

// 培训计划列表
const planList = ref([
  {
    code: 'TR202401',
    name: '飞行员年度复训',
    type: 'regular', // 定期培训
    trainer: '王教员',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    status: 'ongoing'
  },
  {
    code: 'TR202402',
    name: '客舱服务标准培训',
    type: 'special', // 专项培训
    trainer: '李教员',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    status: 'planned'
  },
  {
    code: 'TR202403',
    name: '机务人员资质认证',
    type: 'certification', // 资质认证
    trainer: '张教员',
    startDate: '2024-03-10',
    endDate: '2024-03-15',
    status: 'completed'
  }
])

// 培训类型选项
const trainingTypes = [
  {value: 'regular', label: '定期复训'},
  {value: 'special', label: '专项培训'},
  {value: 'certification', label: '资质认证'},
  {value: 'emergency', label: '应急处置'},
  {value: 'newStaff', label: '新员工入职'}
]

// 合并所有工具方法到一个对象中
const utils = {
  // 获取培训类型文本
  getTrainingTypeText: (type: string) => {
    const map: Record<string, string> = {
      regular: '定期复训',
      special: '专项培训',
      certification: '资质认证',
      emergency: '应急处置',
      newStaff: '新员工入职'
    }
    return map[type] || type
  },

  // 获取状态类型
  getStatusType: (status: string) => {
    const map: Record<string, string> = {
      planned: 'info',
      ongoing: 'warning',
      completed: 'success',
      cancelled: 'danger'
    }
    return map[status] || 'info'
  },

  // 获取状态文本
  getStatusText: (status: string) => {
    const map: Record<string, string> = {
      planned: '待开始',
      ongoing: '进行中',
      completed: '已完成',
      cancelled: '已取消'
    }
    return map[status] || status
  }
}

// 讲师表单
const trainerForm = ref({
  name: '',
  specialty: [],
  qualification: '',
  experience: '',
  status: 'active',
  contact: '',
  remarks: ''
})

// 讲师表单验证规则
const trainerRules = {
  name: [{required: true, message: '请输入讲师姓名', trigger: 'blur'}],
  specialty: [{required: true, message: '请选择专业领域', trigger: 'change'}],
  qualification: [{required: true, message: '请输入资质证书', trigger: 'blur'}],
  status: [{required: true, message: '请选择状态', trigger: 'change'}],
  contact: [{required: true, message: '请输入联系方式', trigger: 'blur'}]
}

// 部门选项
const departmentOptions = [
  {
    value: 'production',
    label: '生产部',
    children: [
      {value: 'workshop1', label: '一车间'},
      {value: 'workshop2', label: '二车间'}
    ]
  },
  {
    value: 'safety',
    label: '安全部'
  },
  {
    value: 'technology',
    label: '技术部'
  }
]

// 人员表单
const personnelForm = ref({
  name: '',
  department: [],
  position: '',
  employeeId: '',
  entryDate: '',
  contact: '',
  trainingStatus: 'pending',
  remarks: ''
})

// 人员表单验证规则
const personnelRules = {
  name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
  department: [{required: true, message: '请选择部门', trigger: 'change'}],
  position: [{required: true, message: '请选择岗位', trigger: 'change'}],
  employeeId: [{required: true, message: '请输入工号', trigger: 'blur'}],
  entryDate: [{required: true, message: '请选择入职日期', trigger: 'change'}],
  contact: [{required: true, message: '请输入联系方式', trigger: 'blur'}],
  trainingStatus: [{required: true, message: '请选择培训状态', trigger: 'change'}]
}

// 处理搜索
const handleSearch = () => {
  // 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    name: '',
    type: ''
  }
  handleSearch()
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

// 培训计划相关方法
const handleAddPlan = () => {
  planDialogType.value = 'add'
  planForm.value = {
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    target: '',
    content: '',
    method: '',
    location: '',
    budget: 0
  }
  planDialogVisible.value = true
}

const handleEditPlan = (row: any) => {
  planDialogType.value = 'edit'
  planForm.value = {...row}
  planDialogVisible.value = true
}

const handleViewPlan = (row: any) => {
  // 实现查看逻辑
}

const handleDeletePlan = (row: any) => {
  ElMessageBox.confirm('确认删除该培训计划吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

const handleSubmitPlan = async () => {
  if (!planFormRef.value) return
  await planFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      planDialogVisible.value = false
      ElMessage.success('保存成功')
      handleSearch()
    }
  })
}

// 讲师相关方法
const handleAddTrainer = () => {
  trainerDialogType.value = 'add'
  trainerForm.value = {
    name: '',
    specialty: [],
    qualification: '',
    experience: '',
    status: 'active',
    contact: '',
    remarks: ''
  }
  trainerDialogVisible.value = true
}

const handleEditTrainer = (row: any) => {
  trainerDialogType.value = 'edit'
  trainerForm.value = {...row}
  trainerDialogVisible.value = true
}

const handleDeleteTrainer = (row: any) => {
  ElMessageBox.confirm('确认删除该讲师吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

const handleSubmitTrainer = async () => {
  if (!trainerFormRef.value) return
  await trainerFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      trainerDialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

// 人员相关方法
const handleAddPersonnel = () => {
  personnelDialogType.value = 'add'
  personnelForm.value = {
    name: '',
    department: [],
    position: '',
    employeeId: '',
    entryDate: '',
    contact: '',
    trainingStatus: 'pending',
    remarks: ''
  }
  personnelDialogVisible.value = true
}

const handleEditPersonnel = (row: any) => {
  personnelDialogType.value = 'edit'
  personnelForm.value = {...row}
  personnelDialogVisible.value = true
}

const handleDeletePersonnel = (row: any) => {
  ElMessageBox.confirm('确认删除该人员吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

const handleSubmitPersonnel = async () => {
  if (!personnelFormRef.value) return
  await personnelFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      personnelDialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

// 工具方法
const getTrainingTypeText = (type: string) => {
  const map: Record<string, string> = {
    'three-level': '三级安全教育',
    'special': '特种作业培训',
    'management': '安全管理培训'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    completed: 'success'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '未开始',
    processing: '进行中',
    completed: '已完成'
  }
  return map[status] || status
}

const getTrainingStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    training: 'warning',
    completed: 'success'
  }
  return map[status] || 'info'
}

const getTrainingStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待培训',
    training: '培训中',
    completed: '已完成'
  }
  return map[status] || status
}

const selectedPlan = ref<any>(null)

// 选择计划
const handleSelectPlan = (row: any) => {
  selectedPlan.value = row
}

// 添加培训人员
const handleAddTrainee = () => {
  // 实现添加培训人员的逻辑
}

// 移除培训人员
const handleRemoveTrainee = (trainee: any) => {
  ElMessageBox.confirm('确认移除该培训人员吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现移除逻辑
    ElMessage.success('移除成功')
  })
}
</script>

<style scoped>
.plan-container {
  background: #f5f7fa;
  min-height: 100%;
}

/* 标签页样式 */
.plan-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* 内容区域样式 */
.plan-content,
.trainer-content,
.personnel-content {
  margin-top: 20px;
}

/* 工具栏样式 */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8faff;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

/* 表格样式 */
.el-table {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-table__header) {
  background-color: #f5f7fa;
}

:deep(.el-table__header th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa !important;
}

/* 标签样式 */
:deep(.el-tag) {
  border-radius: 12px;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
}

:deep(.el-tag--success) {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}

:deep(.el-tag--warning) {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
}

:deep(.el-tag--info) {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}

/* 按钮样式 */
:deep(.el-button--primary) {
  --el-button-hover-bg-color: #66b1ff;
  --el-button-hover-border-color: #66b1ff;
}

:deep(.el-button--text) {
  padding: 4px 8px;
}

:deep(.el-button--link) {

&
.el-button--primary {
  color: #409eff;

&
:hover {
  color: #66b1ff;
}

}
&
.el-button--success {
  color: #67c23a;

&
:hover {
  color: #85ce61;
}

}
&
.el-button--danger {
  color: #f56c6c;

&
:hover {
  color: #f78989;
}

}
}

/* 分页样式 */
.pagination {
  margin-top: 20px;
  padding: 16px 0;
  text-align: right;
  background: #fff;
  border-radius: 4px;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 20px;
  background: #f5f7fa;
  border-top: 1px solid #dcdfe6;
}

/* 表单样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;

&
:hover {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

&
.is-focus {
  box-shadow: 0 0 0 1px #409eff inset;
}

}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-radio__label) {
  color: #606266;
}

/* 自定义标签页样式 */
:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #dcdfe6;
}

:deep(.el-tabs__item) {
  font-size: 15px;
  color: #606266;

&
.is-active {
  color: #409eff;
  font-weight: 600;
}

&
:hover {
  color: #409eff;
}

}

:deep(.el-tabs__active-bar) {
  background-color: #409eff;
  height: 3px;
}

/* 标签页样式 */
:deep(.el-tabs__nav) {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 4px;
}

:deep(.el-tabs__item) {
  font-size: 15px;
  color: #303133;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  transition: all 0.3s;
  border-radius: 4px;

&
.is-active {
  color: #409eff;
  font-weight: 600;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

&
:hover {
  color: #409eff;
}

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

&
:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

&
.active {
  color: #409eff;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

}

/* 修改表格头部文字颜色 */
:deep(.el-table__header th) {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: 600;
}

/* 修改表格内容文字颜色 */
:deep(.el-table__body td) {
  color: #303133;
}
</style> 