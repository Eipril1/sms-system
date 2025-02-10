<script setup lang="ts">
import {ref} from 'vue'

// 定义类型
interface CorrectionItem {
  id: number
  recordNumber: string
  sourceNumber: string
  problemType: string
  description: string
  responsibleDept: string
  planCompleteTime: string
  verificationResult?: string
  completionStatus?: string
  status: string
  isClosed: boolean

  [key: string]: any
}

// 状态定义
const correctionList = ref<CorrectionItem[]>([])

// 实际使用的代码
</script>