<template>
  <div class="welcome-section">
    <h1>欢迎使用安全管理系统</h1>
    <p class="subtitle">{{ currentTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

const currentTime = ref(dayjs().format('YYYY年MM月DD日 HH:mm:ss dddd'))

const timer = ref<number>()

onMounted(() => {
  timer.value = window.setInterval(() => {
    currentTime.value = dayjs().format('YYYY年MM月DD日 HH:mm:ss dddd')
  }, 1000)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped lang="scss">
.welcome-section {
  padding: 24px;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  border-radius: 8px;
  color: white;
  
  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 500;
  }
  
  .subtitle {
    margin: 8px 0 0;
    font-size: 16px;
    opacity: 0.8;
  }
}
</style> 