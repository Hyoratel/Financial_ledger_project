<template>
  <component :is="layout">
    <!-- 실제 화면은 여기에 출력 -->
    <router-view></router-view>
  </component>

  <!-- 전역 모달이 있다면 여기에 -->
  <BaseModal v-if="modal.isOpen" @close="modal.close">
    <template #header>
      {{
        modal.mode === 'form'
          ? modal.editingTransaction
            ? '거래 수정'
            : '거래 추가'
          : '거래 내역'
      }}
    </template>

    <template #body>
      <!-- ✨ 여기서 분기 처리! -->
      <div v-if="modal.mode === 'list'">
        <div v-if="transactionsForSelectedDate.length > 0">
          <div v-for="tx in transactionsForSelectedDate" :key="tx.id">
            {{ tx.category }} -
            <span :class="tx.type">{{ tx.amount.toLocaleString() }}원</span>
          </div>
        </div>
        <div v-else>거래가 없습니다.</div>

        <button @click="modal.openForm(modal.selectedDate)">+ 거래 추가</button>
      </div>

      <TransactionForm
        v-else-if="modal.mode === 'form'"
        :transaction="modal.editingTransaction"
        :date="modal.selectedDate"
        @completed="onTransactionCompleted"
      />
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

const transactionsForSelectedDate = computed(() => {
  return transactionStore.transactions.filter(
    (tx) => tx.date === modal.selectedDate
  );
});

const onAddComplete = async () => {
  await transactionStore.fetchTransactions(); //데이터 새로고침
  modal.showForm = false;
  modal.showList = true;
  modal.close(); //모달 닫기
};

async function onTransactionCompleted() {
  await transactionStore.fetchTransactions(); //거래 새로고침
  modal.close();
}

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
