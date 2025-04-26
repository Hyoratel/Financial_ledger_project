<template>
  <component :is="layout">
    <!-- 실제 화면 -->
    <router-view></router-view>
  </component>

  <!-- 전역 모달 -->
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
      <!-- ✨ 리스트 모드 -->
      <div v-if="modal.mode === 'list'">
        <div v-if="transactionsForSelectedDate.length > 0">
          <div
            v-for="tx in transactionsForSelectedDate"
            :key="tx.id"
            class="transaction-list-item"
          >
            <div class="info">
              <div class="date">{{ tx.date }}</div>
              <div class="content">
                {{ tx.category }}
                <span :class="['amount', tx.type]"
                  >{{ tx.amount.toLocaleString() }}원</span
                >
              </div>
            </div>
            <div class="actions">
              <button @click="modal.openForm(tx.date, tx)">수정</button>
              <button @click="deleteTransaction(tx.id)">삭제</button>
            </div>
          </div>
        </div>

        <!-- 거래 없을 때 -->
        <div v-else>거래가 없습니다.</div>

        <!-- 거래 추가 버튼 (하단 중앙) -->
        <div class="add-button">
          <button @click="modal.openForm(modal.selectedDate)">
            + 거래 추가
          </button>
        </div>
      </div>

      <!-- ✨ 폼 모드 -->
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

async function onTransactionCompleted() {
  await transactionStore.fetchTransactions();
  modal.close();
}

const deleteTransaction = async (id) => {
  await transactionStore.deleteTransaction(id); //스토어에서 삭제
  await transactionStore.fetchTransactions(); //삭제 후 목록 갱신신
};
const route = useRoute();

const layout = computed(() => {
  const layoutName = route.meta.layout;
  if (layoutName === 'auth') return AuthLayout;
  return DefaultLayout;
});
</script>

<style scoped>
/* 🧩 리스트 항목 스타일 */
.transaction-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date {
  font-size: 0.75rem;
  color: #999;
}

.content {
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 금액 색상 */
.amount.income {
  color: #007bff;
  font-weight: bold;
}

.amount.expense {
  color: #dc3545;
  font-weight: bold;
}

/* 버튼 영역 */
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.actions button {
  padding: 4px 10px;
  font-size: 0.8rem;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.actions button:hover {
  background-color: #eee;
}

/* 하단 중앙 추가 버튼 */
.add-button {
  margin-top: 20px;
  text-align: center;
}

.add-button button {
  background-color: #5e4b3c;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button button:hover {
  background-color: #4b3a2b;
}
</style>
