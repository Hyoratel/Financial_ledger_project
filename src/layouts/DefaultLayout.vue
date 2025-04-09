<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- 네비게이션 바 -->
    <nav class="bg-white shadow-md p-4 flex gap-4">
      <RouterLink to="/" class="font-semibold hover:text-blue-600"
        >🏠 홈</RouterLink
      >
      <RouterLink to="/dashboard" class="font-semibold hover:text-blue-600"
        >📊 대시보드</RouterLink
      >
    </nav>

    <!-- 실제 페이지 내용 -->
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.min-h-screen {
  max-width: 500px;
  margin: 0 auto;
}
</style>
