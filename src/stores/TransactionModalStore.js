// TransactionModalStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTransactionModalStore = defineStore('transactionModal', () => {
  const isOpen = ref(false); // 모달 열림/닫힘
  const mode = ref('list'); // 'list' or 'form'
  const selectedDate = ref('');
  const editingTransaction = ref(null);

  const openList = (date = '') => {
    selectedDate.value = date;
    mode.value = 'list';
    isOpen.value = true;
    editingTransaction.value = null;
  };

  const openForm = (date = '', transaction = null) => {
    selectedDate.value = date;
    mode.value = 'form';
    isOpen.value = true;
    editingTransaction.value = transaction; //수정할 거래 데이터 저장
  };

  const close = () => {
    isOpen.value = false;
    mode.value = 'list';
    selectedDate.value = '';
    editingTransaction.value = null;
  };

  return {
    isOpen,
    mode,
    selectedDate,
    editingTransaction,
    openList,
    openForm,
    close,
  };
});
