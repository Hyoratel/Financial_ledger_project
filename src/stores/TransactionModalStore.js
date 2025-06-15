/** TransactionModalStore
 * 거래내역 관련 모달 상태 및 동작을 관리하는 스토어
 * '리스트 보기', '거래 입력/수정 폼', '삭제 확인' 모달 기능을 제공
 */

import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTransactionModalStore = defineStore('transactionModal', () => {
  // 모달 전체 열림 여부
  const isOpen = ref(false);

  // 현재 모달 모드 ('list', 'form', 'confirm-delete' 중 하나)
  const mode = ref('list');

  // 현재 선택된 날짜
  const selectedDate = ref('');

  // 수정 중인 거래 데이터 (없으면 null)
  const editingTransaction = ref(null);

  // 삭제 확인 대상 거래 ID
  const confirmDeleteId = ref(null);

  // 삭제 확인 중 여부
  const isConfirmingDelete = ref(false);

  // 거래 리스트 모달 열기
  // - date: 선택한 날짜 (기본값 '')
  const openList = (date = '') => {
    selectedDate.value = date;
    mode.value = 'list';
    isOpen.value = true;
    editingTransaction.value = null;
  };

  // 거래 수정 모달 열기 (기존 거래 클릭 시 사용)
  // - tx: 수정할 거래 데이터
  const editTransaction = (tx) => {
    openForm(tx.date, tx);
  };

  // 거래 입력/수정 폼 모달 열기
  // - date: 선택한 날짜 (기본값 '')
  // - transaction: 수정할 거래 데이터 (기본값 null)
  const openForm = (date = '', transaction = null) => {
    selectedDate.value = date;
    mode.value = 'form';
    isOpen.value = true;
    editingTransaction.value = transaction;
  };

  // 삭제 확인 모달 열기
  // - id: 삭제할 거래의 ID
  const openDeleteConfirm = (id) => {
    confirmDeleteId.value = id;
    isConfirmingDelete.value = true;
    isOpen.value = true;
    mode.value = 'confirm-delete';
  };

  // 모달 닫기 및 상태 초기화
  const close = () => {
    isOpen.value = false;
    mode.value = 'list';
    selectedDate.value = '';
    editingTransaction.value = null;
    confirmDeleteId.value = null;
    isConfirmingDelete.value = false;
  };

  // 외부에서 사용할 상태 및 메서드 반환
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
