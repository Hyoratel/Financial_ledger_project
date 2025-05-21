// 📁 stores/TransactionModalStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTransactionModalStore = defineStore('transactionModal', () => {
  const isOpen = ref(false); // 전체 모달 열림 여부
  const mode = ref('list'); // 'list', 'form', 'confirm-delete' 중 하나
  const selectedDate = ref('');
  const editingTransaction = ref(null);
  const confirmDeleteId = ref(null);
  const isConfirmingDelete = ref(false);

  // 거래 리스트 모달 열기
  const openList = (date = '') => {
    selectedDate.value = date;
    mode.value = 'list';
    isOpen.value = true;
    editingTransaction.value = null;
  };

  const editTransaction = (tx) => {
    openForm(tx.date, tx);
  };
  // 거래 입력/수정 폼 모달 열기
  const openForm = (date = '', transaction = null) => {
    selectedDate.value = date;
    mode.value = 'form';
    isOpen.value = true;
    editingTransaction.value = transaction;
  };

  // 삭제 확인 모달 열기
  const openDeleteConfirm = (id) => {
    confirmDeleteId.value = id;
    isConfirmingDelete.value = true;
    isOpen.value = true;
    mode.value = 'confirm-delete';
  };

  // 모달 닫기
  const close = () => {
    isOpen.value = false;
    mode.value = 'list';
    selectedDate.value = '';
    editingTransaction.value = null;
    confirmDeleteId.value = null;
    isConfirmingDelete.value = false;
  };

  return {
    isOpen,
    mode,
    selectedDate,
    editingTransaction,
    confirmDeleteId,
    isConfirmingDelete,
    editTransaction,
    openList,
    openForm,
    openDeleteConfirm,
    close,
  };
});
