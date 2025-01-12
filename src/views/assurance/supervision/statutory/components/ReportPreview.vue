<template>
  <div class="report-preview">
    <div class="preview-header">
      <div class="header-actions">
        <el-button-group>
          <el-button @click="handlePrint">
            <el-icon><Printer /></el-icon>打印
          </el-button>
          <el-button @click="handleExportPDF">
            <el-icon><Document /></el-icon>导出PDF
          </el-button>
        </el-button-group>
        <el-button @click="$emit('close')">关闭</el-button>
      </div>
    </div>

    <div class="preview-content" ref="previewRef">
      <!-- 报告头部 -->
      <div class="report-title">
        <h1>{{ report.type }}自查报告</h1>
        <div class="report-no">报告编号：{{ report.reportNo }}</div>
      </div>

      <!-- 基本信息 -->
      <div class="report-section">
        <h2>一、基本信息</h2>
        <table class="info-table">
          <tr>
            <td class="label">自查类型：</td>
            <td>{{ report.type }}</td>
            <td class="label">责任部门：</td>
            <td>{{ report.department }}</td>
          </tr>
          <tr>
            <td class="label">检查时间：</td>
            <td>{{ report.checkTime }}</td>
            <td class="label">检查组长：</td>
            <td>{{ report.leader }}</td>
          </tr>
          <tr>
            <td class="label">检查组成员：</td>
            <td colspan="3">{{ report.members?.join('、') }}</td>
          </tr>
        </table>
      </div>

      <!-- 检查情况 -->
      <div class="report-section">
        <h2>二、检查情况</h2>
        <div class="check-stats">
          <div class="stat-item">
            <div class="stat-label">检查项总数</div>
            <div class="stat-value">{{ report.stats?.total || 0 }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">符合项</div>
            <div class="stat-value success">{{ report.stats?.pass || 0 }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">不符合项</div>
            <div class="stat-value danger">{{ report.stats?.fail || 0 }}</div>
          </div>
        </div>
      </div>

      <!-- 问题清单 -->
      <div class="report-section">
        <h2>三、问题清单</h2>
        <div class="issues-list">
          <div 
            v-for="(issue, index) in report.issues" 
            :key="index"
            class="issue-item"
          >
            <div class="issue-header">
              <span class="issue-no">问题 {{ index + 1 }}</span>
              <el-tag :type="issue.level === 'high' ? 'danger' : 'warning'">
                {{ issue.level === 'high' ? '重大问题' : '一般问题' }}
              </el-tag>
            </div>
            <div class="issue-content">
              <div class="content-row">
                <span class="row-label">检查依据：</span>
                <span class="row-value">{{ issue.standard }}</span>
              </div>
              <div class="content-row">
                <span class="row-label">问题描述：</span>
                <span class="row-value">{{ issue.description }}</span>
              </div>
              <div class="content-row">
                <span class="row-label">整改建议：</span>
                <span class="row-value">{{ issue.suggestion }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 结论建议 -->
      <div class="report-section">
        <h2>四、结论建议</h2>
        <div class="conclusion">{{ report.conclusion }}</div>
      </div>

      <!-- 签字区域 -->
      <div class="report-section signature-section">
        <div class="signature-row">
          <div class="signature-item">
            <div class="signature-label">检查组长：</div>
            <div class="signature-line"></div>
          </div>
          <div class="signature-item">
            <div class="signature-label">部门负责人：</div>
            <div class="signature-line"></div>
          </div>
        </div>
        <div class="report-date">{{ report.createTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Printer, Document } from '@element-plus/icons-vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const props = defineProps<{
  report: any
}>()

const previewRef = ref<HTMLElement>()

// 打印方法
const handlePrint = () => {
  window.print()
}

// 导出PDF
const handleExportPDF = async () => {
  if (!previewRef.value) return
  
  try {
    const canvas = await html2canvas(previewRef.value, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    
    const contentWidth = canvas.width
    const contentHeight = canvas.height
    
    // A4纸的尺寸[595.28,841.89]
    const pageHeight = (contentWidth / 592.28) * 841.89
    let leftHeight = contentHeight
    let position = 0
    const imgWidth = 595.28
    const imgHeight = (592.28 / contentWidth) * contentHeight
    
    const pdf = new jsPDF('p', 'pt', 'a4')
    
    if (leftHeight < pageHeight) {
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          pdf.addPage()
        }
      }
    }
    
    pdf.save(`${props.report.type}自查报告_${props.report.reportNo}.pdf`)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('导出失败')
  }
}
</script>

<style scoped>
.report-preview {
  padding: 20px;
}

.preview-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dcdfe6;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.report-title {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 24px;
    margin-bottom: 16px;
  }

  .report-no {
    color: #606266;
  }
}

.report-section {
  margin-bottom: 40px;

  h2 {
    font-size: 18px;
    margin-bottom: 20px;
    padding-left: 10px;
    border-left: 4px solid #409EFF;
  }
}

.info-table {
  width: 100%;
  border-collapse: collapse;

  td {
    padding: 12px;
    border: 1px solid #dcdfe6;

    &.label {
      width: 120px;
      background-color: #f5f7fa;
    }
  }
}

.check-stats {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.stat-item {
  text-align: center;

  .stat-label {
    color: #606266;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;

    &.success {
      color: #67c23a;
    }

    &.danger {
      color: #f56c6c;
    }
  }
}

.issues-list {
  .issue-item {
    margin-bottom: 20px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .issue-no {
    font-weight: 500;
  }
}

.content-row {
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  .row-label {
    color: #606266;
    margin-right: 8px;
  }
}

.signature-section {
  margin-top: 60px;
}

.signature-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
}

.signature-item {
  .signature-label {
    margin-bottom: 40px;
  }

  .signature-line {
    width: 160px;
    border-bottom: 1px solid #dcdfe6;
  }
}

.report-date {
  text-align: right;
  color: #606266;
}

@media print {
  .preview-header {
    display: none;
  }

  .preview-content {
    box-shadow: none;
    padding: 0;
  }
}
</style> 