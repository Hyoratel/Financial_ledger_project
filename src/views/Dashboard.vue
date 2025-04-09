<template>
  <div class="space-y-6">
    <!-- 상단 탭 메뉴 -->
    <div class="flex gap-4 border-b pb-2">
      <RouterLink
        to="/dashboard/summary"
        class="hover:text-blue-600 font-semibold"
        :class="{
          'text-blue-600 border-b-2 border-blue-600':
            $route.path.includes('summary'),
        }"
      >
        📊 월별 요약
      </RouterLink>
      <RouterLink
        to="/dashboard/income"
        class="hover:text-blue-600 font-semibold"
        :class="{
          'text-blue-600 border-b-2 border-blue-600':
            $route.path.includes('income'),
        }"
      >
        💵 수입 추이
      </RouterLink>
      <RouterLink
        to="/dashboard/spending"
        class="hover:text-blue-600 font-semibold"
        :class="{
          'text-blue-600 border-b-2 border-blue-600':
            $route.path.includes('spending'),
        }"
      >
        💸 지출 추이
      </RouterLink>
    </div>

    <!-- 서브 페이지 표시 영역 -->
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';

defineOptions({
  name: 'DashboardPage',
});

const $route = useRoute();
</script>

<style scoped>
.space-y-6 {
  max-width: 500px;
  margin: 0 auto;
}
.router-link-exact-active {
  font-weight: bold;
}
</style>
