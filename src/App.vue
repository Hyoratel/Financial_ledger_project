<template>
  <component :is="layout">
    <!-- 실제 화면은 여기에 출력 -->
    <router-view />
  </component>

  <!-- 전역 모달이 있다면 여기에 -->
  <!-- <BaseModal v-if="uiStore.showModal" /> -->
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

// 현재 라우트 가져오기
const route = useRoute();

// 라우트의 meta 정보에 따라 레이아웃 변경
const layout = computed(() => {
  const layoutName = route.meta.layout;
  // if (layoutName === 'auth') return AuthLayout;
  return DefaultLayout;
});
</script>

<style>
/* 전체 앱에 적용할 전역 스타일이 있다면 여기에 */
body {
  margin: 0;
  font-family: 'Pretendard', sans-serif;
}
</style>
