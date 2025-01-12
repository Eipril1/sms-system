<template>
  <div class="report-template">
    <div class="template-header">
      <h3>报告模板管理</h3>
      <el-button type="primary" @click="handleAddTemplate">
        <el-icon><Plus /></el-icon>新建模板
      </el-button>
    </div>

    <!-- 模板列表 -->
    <el-table :data="templateList" style="width: 100%">
      <el-table-column prop="name" label="模板名称" />
      <el-table-column prop="type" label="适用类型">
        <template #default="{ row }">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" width="120" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handlePreview(row)">预览</el-button>
          <el-button 
            link 
            :type="row.status === 'active' ? 'warning' : 'success'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'active' ? '停用' : '启用' }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 模板编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentTemplate ? '编辑模板' : '新建模板'"
      width="800px"
    >
      <el-form :model="templateForm" label-width="100px">
        <el-form-item label="模板名称" required>
          <el-input v-model="templateForm.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="适用类型" required>
          <el-select v-model="templateForm.type" placeholder="请选择适用类型">
            <el-option label="运行合格审定" value="运行合格审定" />
            <el-option label="维修管理" value="维修管理" />
            <el-option label="训练大纲" value="训练大纲" />
          </el-select>
        </el-form-item>
        <el-form-item label="报告结构">
          <div class="template-sections">
            <draggable
              v-model="templateForm.sections"
              handle=".section-drag"
              item-key="id"
            >
              <template #item="{ element, index }">
                <div class="section-item">
                  <div class="section-header">
                    <el-icon class="section-drag"><DragHandle /></el-icon>
                    <span class="section-title">{{ element.title }}</span>
                    <div class="section-actions">
                      <el-button 
                        link 
                        type="danger" 
                        @click="removeSection(index)"
                      >
                        删除
                      </el-button>
                    </div>
                  </div>
                  <div class="section-content">
                    <el-form-item label="标题">
                      <el-input v-model="element.title" />
                    </el-form-item>
                    <el-form-item label="类型">
                      <el-select v-model="element.type">
                        <el-option label="文本" value="text" />
                        <el-option label="表格" value="table" />
                        <el-option label="列表" value="list" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="提示文本">
                      <el-input
                        v-model="element.placeholder"
                        type="textarea"
                        :rows="2"
                      />
                    </el-form-item>
                    <el-form-item label="是否必填">
                      <el-switch v-model="element.required" />
                    </el-form-item>
                  </div>
                </div>
              </template>
            </draggable>
            <div class="add-section">
              <el-button type="dashed" @click="addSection">
                <el-icon><Plus /></el-icon>添加章节
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveTemplate">保存</el-button>
      </template>
    </el-dialog>

    <!-- 模板预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="模板预览"
      width="800px"
      append-to-body
    >
      <div class="template-preview">
        <div 
          v-for="section in currentTemplate?.sections"
          :key="section.id"
          class="preview-section"
        >
          <h4>{{ section.title }}</h4>
          <div class="preview-content">
            <template v-if="section.type === 'text'">
              <el-input
                type="textarea"
                :rows="4"
                :placeholder="section.placeholder"
                disabled
              />
            </template>
            <template v-else-if="section.type === 'table'">
              <el-table :data="[]" border>
                <el-table-column label="示例列" />
              </el-table>
            </template>
            <template v-else-if="section.type === 'list'">
              <el-empty description="列表内容" />
            </template>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, DragHandle } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'

// 模板列表
const templateList = ref([
  {
    id: 1,
    name: '运行合格审定自查报告模板',
    type: '运行合格审定',
    creator: '张三',
    updateTime: '2024-03-15 10:00:00',
    status: 'active',
    sections: [
      {
        id: 1,
        title: '基本信息',
        type: 'text',
        placeholder: '请输入基本信息',
        required: true
      },
      {
        id: 2,
        title: '检查概述',
        type: 'text',
        placeholder: '请输入检查概述',
        required: true
      }
    ]
  }
])

// 当前编辑的模板
const currentTemplate = ref<any>(null)
const dialogVisible = ref(false)
const previewVisible = ref(false)

// 模板表单
const templateForm = ref({
  name: '',
  type: '',
  sections: []
})

// 新建模板
const handleAddTemplate = () => {
  currentTemplate.value = null
  templateForm.value = {
    name: '',
    type: '',
    sections: []
  }
  dialogVisible.value = true
}

// 编辑模板
const handleEdit = (row: any) => {
  currentTemplate.value = row
  templateForm.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}

// 预览模板
const handlePreview = (row: any) => {
  currentTemplate.value = row
  previewVisible.value = true
}

// 切换状态
const handleToggleStatus = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确认${row.status === 'active' ? '停用' : '启用'}该模板？`
    )
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success('操作成功')
  } catch {
    // 取消操作
  }
}

// 删除模板
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该模板？', '提示', {
      type: 'warning'
    })
    const index = templateList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      templateList.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch {
    // 取消操作
  }
}

// 添加章节
const addSection = () => {
  templateForm.value.sections.push({
    id: Date.now(),
    title: '新章节',
    type: 'text',
    placeholder: '',
    required: false
  })
}

// 删除章节
const removeSection = (index: number) => {
  templateForm.value.sections.splice(index, 1)
}

// 保存模板
const handleSaveTemplate = () => {
  if (!templateForm.value.name || !templateForm.value.type) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (currentTemplate.value) {
    // 更新模板
    const index = templateList.value.findIndex(
      item => item.id === currentTemplate.value.id
    )
    if (index > -1) {
      templateList.value[index] = {
        ...currentTemplate.value,
        ...templateForm.value,
        updateTime: new Date().toLocaleString()
      }
    }
  } else {
    // 新建模板
    templateList.value.push({
      id: Date.now(),
      ...templateForm.value,
      creator: '当前用户',
      updateTime: new Date().toLocaleString(),
      status: 'active'
    })
  }

  dialogVisible.value = false
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.report-template {
  padding: 20px;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
  }
}

.template-sections {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
}

.section-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 12px;
  background-color: #fff;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;

  .section-drag {
    cursor: move;
    margin-right: 12px;
    color: #909399;
  }

  .section-title {
    flex: 1;
    font-weight: 500;
  }
}

.section-content {
  padding: 16px;
}

.add-section {
  text-align: center;
  margin-top: 16px;

  .el-button {
    width: 100%;
    border-style: dashed;
  }
}

.template-preview {
  .preview-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0 0 12px;
      color: #303133;
    }
  }
}
</style> 