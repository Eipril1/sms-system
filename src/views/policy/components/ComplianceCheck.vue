<template>
  <div class="compliance-check">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="规章编号">
          <el-select
              v-model="searchForm.regNumber"
              placeholder="请选择规章"
              clearable
              @change="handleRegulationChange"
          >
            <el-option label="CCAR-121" value="CCAR-121"/>
            <el-option label="CCAR-135" value="CCAR-135"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 选中规章后显示内容 -->
    <div v-if="searchForm.regNumber" class="main-content">
      <!-- 左侧目录树 -->
      <el-card class="tree-card">
        <template #header>
          <div class="card-header">
            <span>规章目录</span>
            <el-input
                v-model="searchKey"
                placeholder="搜索条款"
                clearable
                style="width: 180px"
            />
          </div>
        </template>
        <el-tree
            ref="treeRef"
            :data="clauseTree"
            :props="defaultProps"
            node-key="id"
            highlight-current
            @node-click="handleNodeClick"
        />
      </el-card>

      <!-- 右侧表格 -->
      <div class="table-container">
        <el-table :data="complianceList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="60" align="center"/>
          <el-table-column prop="chapter" label="章节" width="100"/>
          <el-table-column prop="content" label="要素" show-overflow-tooltip/>
          <el-table-column prop="compliance" label="符合性" width="200">
            <template #default="{ row }">
              <div class="compliance-cell">
                <el-tag :type="getComplianceTagType(row.compliance)">
                  {{ getComplianceText(row.compliance) }}
                </el-tag>
                <span class="compliance-ref">{{ row.complianceRef }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="primary" link @click="handleView(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 未选中规章时显示提示 -->
    <el-empty
        v-else
        description="请先选择规章"
        :image-size="200"
    />

    <!-- 编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'edit' ? '编辑符合性声明' : '查看符合性声明'"
        width="60%"
    >
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="条款编号">
          <span>{{ currentItem?.chapter }}</span>
        </el-form-item>
        <el-form-item label="条款内容">
          <div class="clause-content">{{ currentItem?.content }}</div>
        </el-form-item>
        <el-form-item label="符合性说明">
          <el-input
              v-model="form.compliance"
              type="textarea"
              :rows="4"
              placeholder="请输入符合性说明"
              :disabled="dialogType === 'view'"
          />
        </el-form-item>
        <el-form-item label="证据材料">
          <el-upload
              v-if="dialogType === 'edit'"
              action="/api/file/upload"
              :file-list="form.evidences"
              :on-success="handleUploadSuccess"
              :on-remove="handleRemove"
              multiple
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
          <div v-else>
            <div v-for="file in form.evidences" :key="file.url" class="evidence-item">
              <el-link :href="file.url" target="_blank">{{ file.name }}</el-link>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="符合性结论">
          <el-radio-group v-model="form.conclusion" :disabled="dialogType === 'view'">
            <el-radio label="compliant">符合</el-radio>
            <el-radio label="partial">部分符合</el-radio>
            <el-radio label="non-compliant">不符合</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="改进建议" v-if="form.conclusion !== 'compliant'">
          <el-input
              v-model="form.suggestion"
              type="textarea"
              :rows="3"
              placeholder="请输入改进建议"
              :disabled="dialogType === 'view'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave" v-if="dialogType === 'edit'">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {ElMessage} from 'element-plus'

interface ComplianceItem {
  chapter: string
  content: string
  compliance: string
  complianceRef: string
}

// 搜索表单
const searchForm = ref({
  regNumber: ''
})

// 搜索关键字
const searchKey = ref('')

// 当前规章的目录树数据
const clauseTree = ref<any[]>([])

// 当前规章的符合性列表
const complianceList = ref<ComplianceItem[]>([])

// 监听规章选择变化
const handleRegulationChange = async (value: string) => {
  if (!value) {
    clauseTree.value = []
    complianceList.value = []
    return
  }

  try {
    // TODO: 调用后端API获取规章数据
    // 这里模拟数据
    if (value === 'CCAR-121') {
      clauseTree.value = [
        {
          id: '1',
          label: '第一章 总则',
          children: [
            {
              id: '1.1',
              label: '1.1 目的',
              chapter: '1.目的',
              content: '本咨询通告依据中国民用航空规章...'
            },
            {
              id: '1.2',
              label: '1.2 适用范围',
              chapter: '2.适用范围',
              content: '本咨询通告适用于按照CCAR-121部运行的航空运营人...'
            }
          ]
        }
      ]

      complianceList.value = [
        {
          chapter: '1.目的',
          content: '本咨询通告依据中国民用航空规章《大型飞机公共航空运输承运人运行合格审定规则》...',
          compliance: 'compliant',
          complianceRef: 'DY-1Y-03.1.1.1.1'
        },
        {
          chapter: '2.适用范围',
          content: '本咨询通告适用于按照CCAR-121部运行的航空运营人...',
          compliance: 'partial',
          complianceRef: 'DY-1Y-03.1.1.1.2'
        }
      ]
    }
  } catch (error) {
    ElMessage.error('获取规章数据失败')
  }
}

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref<'edit' | 'view'>('edit')
const currentItem = ref<ComplianceItem | null>(null)

// 表单数据
const form = ref({
  compliance: '',
  evidences: [],
  conclusion: 'compliant',
  suggestion: ''
})

// 获取符合性标签类型
const getComplianceTagType = (compliance: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger'> = {
    compliant: 'success',
    partial: 'warning',
    'non-compliant': 'danger'
  }
  return map[compliance] || 'info'
}

// 获取符合性文本
const getComplianceText = (compliance: string) => {
  const map: Record<string, string> = {
    compliant: '符合',
    partial: '部分符合',
    'non-compliant': '不符合'
  }
  return map[compliance] || compliance
}

// 编辑
const handleEdit = (row: ComplianceItem) => {
  dialogType.value = 'edit'
  currentItem.value = row
  // TODO: 加载详细数据
  dialogVisible.value = true
}

// 查看
const handleView = (row: ComplianceItem) => {
  dialogType.value = 'view'
  currentItem.value = row
  // TODO: 加载详细数据
  dialogVisible.value = true
}

// 文件上传成功
const handleUploadSuccess = (response: any, file: any) => {
  form.value.evidences.push({
    name: file.name,
    url: response.data
  })
  ElMessage.success('上传成功')
}

// 移除文件
const handleRemove = (file: any) => {
  const index = form.value.evidences.findIndex((item: any) => item.url === file.url)
  if (index > -1) {
    form.value.evidences.splice(index, 1)
  }
}

// 保存
const handleSave = () => {
  // TODO: 实现保存逻辑
  ElMessage.success('保存成功')
  dialogVisible.value = false
}

// 树形配置
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 节点点击
const handleNodeClick = (data: any) => {
  if (!data.children) {
    // 如果是叶子节点,可以直接编辑
    handleEdit({
      chapter: data.chapter,
      content: data.content,
      compliance: 'compliant',
      complianceRef: ''
    })
  }
}
</script>

<style scoped>
.compliance-check {
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.search-card {
  margin-bottom: 20px;
}

.main-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 140px);
}

.tree-card {
  width: 360px;
  overflow: auto;
}

.table-container {
  flex: 1;
  overflow: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.compliance-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.compliance-ref {
  color: #666;
  font-size: 13px;
}

.clause-content {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 10px;
}

.evidence-item {
  margin-bottom: 8px;
}

:deep(.el-upload-list) {
  max-height: 300px;
  overflow: auto;
}

:deep(.el-empty) {
  margin-top: 160px;
}

.tree-card, .table-container {

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: #f5f7fa;
}

}

:deep(.el-dialog) {
  min-width: 800px;
  margin: 0 auto;
}

:deep(.el-table) {

.el-table__cell {
  padding: 12px 0;
}

}
</style> 