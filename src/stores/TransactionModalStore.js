import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTransactionModalStore = defineStore('transactionModal', () => {
  const showForm = ref(false);
  const selectedDate = ref('');
  const editingTransaction = ref(null);

  // 거래 추가 모달 열기
  const openForm = (date = '') => {
    selectedDate.value = date;
    editingTransaction.value = null;
    showForm.value = true;
  };

  // 거래 수정 모달 열기
  const editTransaction = (tx) => {
    console.log('📦 editTransaction called!', tx);
    editingTransaction.value = { ...tx };
    selectedDate.value = tx.date;
    showForm.value = true;
  };

  // 모달 닫기
  const close = () => {
    showForm.value = false;
    selectedDate.value = '';
    editingTransaction.value = null;
  };

  return {
    showForm,
    selectedDate,
    editingTransaction,
    openForm,
    editTransaction,
    close,
  };
});
