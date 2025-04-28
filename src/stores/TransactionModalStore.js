// TransactionModalStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTransactionModalStore = defineStore('transactionModal', () => {
  const isOpen = ref(false); // 모달 열림/닫힘
  const mode = ref('list'); // 'list' or 'form'
  const selectedDate = ref('');
  const editingTransaction = ref(null);
  const confirmDeleteId = ref(null); //삭제할 ID 저장
  const isConfirmingDelete = ref(false); //삭제 확인 모달 열기 여부

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
  const openDeleteConfirm = (id) => {
    confirmDeleteId.value = id;
    isConfirmingDelete.value = true;
    isOpen.value = true; //모달 열기
    mode.value = 'confirm-delete'; //모달 모드 구분
  };
  const close = () => {
    isOpen.value = false;
    mode.value = 'list'; //모드 초기화
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
    openList,
    openForm,
    openDeleteConfirm,
    close,
  };
});
