<template>
  <component :is="layout">
    <!-- 실제 화면은 여기에 출력 -->
    <router-view></router-view>
  </component>

  <!-- 전역 모달이 있다면 여기에 -->
  <BaseModal v-if="modal.showForm" @close="modal.close">
    <template #header>
      {{ modal.editingTransaction ? '거래 수정' : '거래 추가' }}
    </template>

    <template #body>
      <TransactionForm
        :transaction="modal.editingTransaction"
        :date="modal.selectedDate"
        @completed="onAddComplete"
      />
    </template>

    <template #footer>
      <button form="transactionForm" type="submit">저장</button>
      <button @click="modal.close">닫기</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import BaseModal from './components/base/baseModal.vue';
import TransactionForm from './views/TransactionForm.vue';

import { useTransactionModalStore } from './stores/TransactionModalStore';
import { useTransactionStore } from './stores/transactionStore';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const modal = useTransactionModalStore();
const transactionStore = useTransactionStore();

const onAddComplete = () => {
  transactionStore.fetchTransactions();
  modal.close();
};

// // 현재 라우트 가져오기
const route = useRoute();

// 라우트의 meta 정보에 따라 레이아웃 변경
const layout = computed(() => {
  const layoutName = route.meta.layout;
  if (layoutName === 'auth') return AuthLayout;
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
