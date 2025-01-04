<template>
  <div class="compliance-container">
    <el-card class="regulation-card">
      <!-- 规章条款树 -->
      <div class="tree-header">
        <el-input
          v-model="searchKey"
          placeholder="搜索条款"
          prefix-icon="Search"
          clearable
          @input="filterNode"
        />
      </div>
      <el-tree
        ref="treeRef"
        :data="clauseTree"
        :props="{ label: 'clauseTitle' }"
        :filter-node-method="filterNode"
        node-key="id"
        highlight-current
        @node-click="handleNodeClick"
      />
    </el-card>
    
    <el-card class="compliance-card">
      <!-- 符合性声明表单 -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="章节号">
          <span class="clause-no">{{ currentClause?.clauseNo }}</span>
        </el-form-item>
        <el-form-item label="要素">
          <div class="clause-content">{{ currentClause?.requirement }}</div>
        </el-form-item>
        <el-form-item label="手册编号" prop="manualCode">
          <el-select v-model="form.manualCode" placeholder="请选择手册">
            <el-option label="DY-1Y-03" value="DY-1Y-03"/>
            <el-option label="SMS手册" value="SMS"/>
            <el-option label="运行手册" value="OM"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手册章节" prop="manualClause">
          <el-input v-model="form.manualClause" placeholder="如: 1.1.1"/>
        </el-form-item>
        <el-form-item label="符合性说明" prop="statement">
          <el-input
            type="textarea"
            v-model="form.statement"
            :rows="4"
            placeholder="请输入符合性说明"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 历史符合性记录 -->
      <div class="history-section" v-if="complianceHistory.length">
        <h3>历史记录</h3>
        <el-timeline>
          <el-timeline-item
            v-for="item in complianceHistory"
            :key="item.id"
            :timestamp="item.createTime"
            placement="top"
          >
            <el-card>
              <h4>{{ item.manualCode }} - {{ item.manualClause }}</h4>
              <p>{{ item.statement }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { RegulationClause, ComplianceForm } from '@/types/business'

// 定义树形数据
const clauseTree = ref<RegulationClause[]>([])

// 当前选中的条款
const currentClause = ref<RegulationClause | null>(null)

// 符合性表单
const form = ref<ComplianceForm>({
  manualCode: '',
  manualClause: '',
  statement: ''
})

// 处理节点点击
const handleNodeClick = (data: RegulationClause) => {
  currentClause.value = data
}

// 保存符合性声明
const handleSave = async () => {
  if (!currentClause.value) {
    ElMessage.warning('请选择规章条款')
    return
  }
  
  try {
    await fetch('/api/regulation/compliance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        regClauseId: currentClause.value.id,
        ...form.value
      })
    })
    ElMessage.success('保存成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('保存失败')
  }
}

// 加载条款树
const loadClauseTree = async () => {
  try {
    const res = await fetch('/api/regulation/clause-tree')
    const data = await res.json()
    clauseTree.value = data.data
  } catch (error) {
    console.error(error)
    ElMessage.error('加载失败')
  }
}

// 初始加载
loadClauseTree()
</script>

<style scoped>
.compliance-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  padding: 20px;
}

.tree-header {
  padding: 0 0 12px;
}

.clause-no {
  font-weight: bold;
  color: #409EFF;
}

.clause-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #666;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #409EFF;
}

.history-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}

.history-section h3 {
  margin: 0 0 16px;
  color: #303133;
}
</style> 