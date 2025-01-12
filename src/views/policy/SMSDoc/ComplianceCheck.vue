<template>
  <div class="compliance-check">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索规章名称/编号"
          class="search-input"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select 
          v-model="selectedRegulation" 
          placeholder="请选择规章" 
          filterable
          class="regulation-select"
          @change="handleRegulationChange"
        >
          <el-option
            v-for="item in filteredRegulations"
            :key="item.id"
            :label="`${item.code} ${item.name}`"
            :value="item.id"
          >
            <div class="regulation-option">
              <span class="regulation-code">{{ item.code }}</span>
              <span class="regulation-name">{{ item.name }}</span>
            </div>
          </el-option>
        </el-select>
      </div>
      <div class="toolbar-right" v-if="selectedRegulation">
        <el-button type="primary" @click="handleAdd">新增对标</el-button>
        <el-button type="success" @click="handleExport">导出对标表</el-button>
      </div>
    </div>

    <!-- 规章内容和对标表格 -->
    <div v-if="selectedRegulation" class="content-wrapper">
      <!-- 规章信息 -->
      <div class="regulation-info">
        <h3>{{ currentRegulation?.name }}</h3>
        <p>编号：{{ currentRegulation?.code }}</p>
        <p>状态：{{ currentRegulation?.status }}</p>
      </div>

      <!-- 对标表格 -->
      <el-table :data="complianceData" border style="width: 100%">
        <el-table-column label="章节" prop="chapter" width="100" />
        <el-table-column label="要素" prop="requirement" min-width="300" />
        <el-table-column label="符合性" prop="compliance" width="150">
          <template #default="{ row }">
            <el-tag :type="getComplianceType(row.compliance)">
              {{ getComplianceLabel(row.compliance) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="对应文件" prop="document" min-width="200" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 未选择规章时的提示 -->
    <el-empty v-else description="请先选择需要对标的规章" />

    <!-- 对标编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增对标' : '编辑对标'"
      width="60%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="章节" prop="chapter">
          <el-input v-model="form.chapter" />
        </el-form-item>
        <el-form-item label="要素" prop="requirement">
          <el-input
            v-model="form.requirement"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="符合性" prop="compliance">
          <el-select v-model="form.compliance">
            <el-option label="完全符合" value="DY-1Y-03" />
            <el-option label="部分符合" value="DY-1Y-02" />
            <el-option label="不符合" value="DY-1Y-01" />
          </el-select>
        </el-form-item>
        <el-form-item label="对应文件" prop="document">
          <el-input v-model="form.document" />
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
import { ref, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 搜索关键词
const searchKeyword = ref('')

// 规章列表
const regulationList = ref([
  {
    id: 1,
    code: 'CCAR-121',
    name: '大型飞机公共航空运输承运人运行合格审定规则',
    status: '现行有效'
  },
  {
    id: 2,
    code: 'CCAR-135',
    name: '小型商业运输和空中游览运营人运行合格审定规则',
    status: '现行有效'
  },
  {
    id: 3,
    code: 'CCAR-145',
    name: '民用航空器维修单位合格审定规则',
    status: '现行有效'
  },
  {
    id: 4,
    code: 'CCAR-91',
    name: '一般运行和飞行规则',
    status: '现行有效'
  }
])

// 过滤后的规章列表
const filteredRegulations = computed(() => {
  if (!searchKeyword.value) return regulationList.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return regulationList.value.filter(item => 
    item.code.toLowerCase().includes(keyword) || 
    item.name.toLowerCase().includes(keyword)
  )
})

// 搜索处理
const handleSearch = () => {
  // 如果当前选中的规章不在过滤结果中，清空选择
  if (selectedRegulation.value && 
      !filteredRegulations.value.some(item => item.id === selectedRegulation.value)) {
    selectedRegulation.value = undefined
    complianceData.value = []
  }
}

// 选中的规章
const selectedRegulation = ref<number>()
const currentRegulation = computed(() => 
  regulationList.value.find(item => item.id === selectedRegulation.value)
)

// 表格数据
const complianceData = ref<any[]>([])

// 规章切换处理
const handleRegulationChange = async (value: number) => {
  try {
    // TODO: 调用API获取对应规章的对标数据
    complianceData.value = [
      {
        chapter: '1.目的',
        requirement: '本咨询通告依据中国民用航空规章《大型飞机公共航空运输承运人运行合格审定规则》(CCAR-121 部)和《小型商业运输和空中游览运营人运行合格审定规则》(CCAR-135 部)制定...',
        compliance: 'DY-1Y-03',
        document: '1.1.1.1'
      }
    ]
  } catch (error) {
    ElMessage.error('获取对标数据失败')
  }
}

// 获取符合性标签类型
const getComplianceType = (compliance: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger'> = {
    'DY-1Y-03': 'success',
    'DY-1Y-02': 'warning',
    'DY-1Y-01': 'danger'
  }
  return map[compliance] || 'info'
}

// 获取符合性标签文本
const getComplianceLabel = (compliance: string) => {
  const map: Record<string, string> = {
    'DY-1Y-03': '完全符合',
    'DY-1Y-02': '部分符合',
    'DY-1Y-01': '不符合'
  }
  return map[compliance] || compliance
}

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const form = ref({
  chapter: '',
  requirement: '',
  compliance: '',
  document: ''
})

// 表单验证规则
const rules = {
  chapter: [{ required: true, message: '请输入章节', trigger: 'blur' }],
  requirement: [{ required: true, message: '请输入要素', trigger: 'blur' }],
  compliance: [{ required: true, message: '请选择符合性', trigger: 'change' }],
  document: [{ required: true, message: '请输入对应文件', trigger: 'blur' }]
}

// 操作方法
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  form.value = {
    chapter: '',
    requirement: '',
    compliance: '',
    document: ''
  }
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  form.value = { ...row }
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该对标记录吗？', '提示', {
    type: 'warning'
  }).then(() => {
    // TODO: 调用删除API
    ElMessage.success('删除成功')
  })
}

const handleExport = () => {
  // TODO: 实现导出功能
  console.log('导出对标表')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // TODO: 调用保存API
      dialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}
</script>

<style scoped>
.compliance-check {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  display: flex;
  gap: 10px;
  flex: 1;
  max-width: 800px;
}

.search-input {
  width: 200px;
}

.regulation-select {
  width: 500px;
}

.regulation-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.regulation-code {
  color: #409EFF;
  font-weight: bold;
  white-space: nowrap;
}

.regulation-name {
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.content-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.regulation-info {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.regulation-info h3 {
  margin: 0 0 10px;
  color: #303133;
}

.regulation-info p {
  margin: 5px 0;
  color: #606266;
}

:deep(.el-table) {
  margin-bottom: 20px;
}

.el-tag {
  width: 80px;
  text-align: center;
}
</style>