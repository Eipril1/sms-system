<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <el-button type="primary" @click="handleBack">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'

const router = useRouter()
const handleBack = () => router.push('/')
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 0;
}
</style> 