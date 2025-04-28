<template>
  <component :is="layout">
    <router-view></router-view>
  </component>

  <BaseModal v-if="modal.isOpen" @close="modal.close">
    <template #header>
      {{
        modal.mode === 'form'
          ? modal.editingTransaction
            ? '거래 수정'
            : '거래 추가'
          : modal.mode === 'confirm-delete'
          ? '삭제 확인'
          : '거래 내역'
      }}
    </template>

    <template #body>
      <div v-if="modal.mode === 'list'">
        <div v-if="transactionsForSelectedDate.length">
          <div
            v-for="tx in transactionsForSelectedDate"
            :key="tx.id"
            class="transaction-list-item"
          >
            <div class="info">
              <div class="date">{{ tx.date }}</div>
              <div class="content">
                {{ tx.category }}
                <span :class="['amount', tx.type]">
                  {{ tx.amount.toLocaleString() }}원
                </span>
              </div>
            </div>
            <div class="actions">
              <button
                class="action-button edit"
                @click="modal.openForm(tx.date, tx)"
              >
                수정
              </button>
              <button
                class="action-button delete"
                @click="modal.openDeleteConfirm(tx.id)"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
        <div v-else>거래가 없습니다.</div>
      </div>

      <TransactionForm
        v-else-if="modal.mode === 'form'"
        :transaction="modal.editingTransaction"
        :date="modal.selectedDate"
        @completed="onTransactionCompleted"
      />

      <div v-else-if="modal.mode === 'confirm-delete'" class="confirm-delete">
        <p>정말 삭제하시겠습니까?</p>
      </div>
    </template>

    <template #footer>
      <div class="footer-actions">
        <template v-if="modal.mode === 'list'">
          <button
            class="modal-button"
            @click="modal.openForm(modal.selectedDate)"
          >
            + 거래 추가
          </button>
        </template>

        <template v-if="modal.mode === 'form'">
          <button class="modal-button" type="submit" form="transactionForm">
            저장
          </button>
        </template>

        <template v-if="modal.mode === 'confirm-delete'">
          <button class="modal-button" @click="confirmDelete">삭제</button>
        </template>

        <button class="modal-button" @click="modal.close">닫기</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BaseModal from './components/base/baseModal.vue';
import TransactionForm from './views/TransactionForm.vue';
import { useTransactionModalStore } from '@/stores/TransactionModalStore';
import { useTransactionStore } from '@/stores/transactionStore';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const modal = useTransactionModalStore();
const transactionStore = useTransactionStore();
const route = useRoute();

const transactionsForSelectedDate = computed(() => {
  return transactionStore.transactions.filter(
    (tx) => tx.date === modal.selectedDate
  );
});

async function onTransactionCompleted() {
  await transactionStore.fetchTransactions();
  modal.close();
}

async function confirmDelete() {
  if (modal.confirmDeleteId) {
    await transactionStore.deleteTransaction(modal.confirmDeleteId);
    await transactionStore.fetchTransactions();
    modal.close();
  }
}

const layout = computed(() => {
  const layoutName = route.meta.layout;
  return layoutName === 'auth' ? AuthLayout : DefaultLayout;
});
</script>

<style scoped>
.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.modal-button {
  padding: 8px 16px;
  background-color: #5e4b3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.modal-button:hover {
  background-color: #4b3a2b;
}
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
}
.content {
  font-size: 1rem;
}
.amount.income {
  color: #007bff;
  font-weight: bold;
}
.amount.expense {
  color: #dc3545;
  font-weight: bold;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.confirm-delete {
  text-align: center;
  padding: 20px;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.action-button {
  padding: 4px 12px;
  font-size: 0.8rem;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button.edit {
  color: #333;
}

.action-button.delete {
  color: #dc3545;
}

.action-button:hover {
  background-color: #f1f1f1;
}
</style>
