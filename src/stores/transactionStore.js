/**TransactionStore
 * 거래 내역(수입/지출) 데이터와 카테고리 데이터를 상태로 관리하며
 * 거래 추가, 수정, 삭제, 월별 필터링 기능을 제공하는 스토어
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // 로그인 사용자 정보 사용

export const useTransactionStore = defineStore('transaction', () => {
  // 거래 내역 목록
  const transactions = ref([]);

  // 수입 카테고리 목록
  const incomeCategory = ref([]);

  // 지출 카테고리 목록
  const expenseCategory = ref([]);

  // 현재 선택된 월 (기본값: 오늘 기준 'YYYY-MM' 문자열)
  const selectedMonth = ref(getCurrentMonth());

  // 오늘 날짜 기준으로 'YYYY-MM' 문자열 반환
  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  }

  // 선택된 월을 갱신
  function setSelectedMonth(newMonth) {
    selectedMonth.value = newMonth;
  }

  // 선택된 월에 해당하는 거래만 필터링해서 반환
  const filteredTransactionsByMonth = computed(() =>
    transactions.value.filter((tx) => tx.date.startsWith(selectedMonth.value))
  );

  // 로그인한 사용자 ID 기준으로 거래 내역 불러오기
  const fetchTransactions = async () => {
    try {
      const authStore = useAuthStore(); // 사용자 인증 정보 가져오기
      if (!authStore.user?.id) return; // 사용자 정보 없으면 중단

      // 사용자별 거래 데이터 가져오기
      const res = await axios.get(
        `http://localhost:3000/budget?userId=${authStore.user.id}`
      );

      // 거래 내역을 날짜 내림차순(최신순)으로 정렬 후 저장
      transactions.value = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    } catch (error) {
      console.error('거래 데이터 불러오기 실패:', error);
    }
  };

  // 거래, 수입 카테고리, 지출 카테고리 데이터를 동시에 불러오기
  const fetchData = async () => {
    try {
      const authStore = useAuthStore();
      if (!authStore.user?.id) return;

      // 거래, 수입 카테고리, 지출 카테고리 데이터를 병렬 요청
      const [tx, income, expense] = await Promise.all([
        axios.get(`http://localhost:3000/budget?userId=${authStore.user.id}`),
        axios.get('http://localhost:3000/incomeCategory'),
        axios.get('http://localhost:3000/expenseCategory'),
      ]);

      // 응답 결과 상태에 저장
      transactions.value = tx.data;
      incomeCategory.value = income.data;
      expenseCategory.value = expense.data;
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  // 거래 항목 삭제
  const deleteTransaction = async (id) => {
    try {
      // 거래 삭제 요청
      await axios.delete(`http://localhost:3000/budget/${id}`);

      // 삭제 후 거래 목록 다시 불러오기
      await fetchTransactions();
    } catch (error) {
      console.error('삭제 오류:', error);
    }
  };

  // 거래 항목 추가
  const addTransaction = async (item) => {
    try {
      // 거래 추가 요청
      await axios.post('http://localhost:3000/budget', item);

      // 추가 후 거래 목록 다시 불러오기
      await fetchTransactions();
    } catch (error) {
      console.error('거래 저장 실패:', error);
      alert('거래 저장 중 오류가 발생했습니다.');
    }
  };

  // 거래 항목 수정
  const updateTransaction = async (updatedTransaction) => {
    try {
      // 거래 수정 요청
      await axios.put(
        `http://localhost:3000/budget/${updatedTransaction.id}`,
        updatedTransaction
      );

      // 수정 후 거래 목록 다시 불러오기
      await fetchTransactions();
    } catch (error) {
      console.error('업데이트 오류:', error);
    }
  };

  // 외부에서 사용할 수 있는 상태 및 메서드 반환
  return {
    transactions,
    incomeCategory,
    expenseCategory,
    selectedMonth,
    setSelectedMonth,
    filteredTransactionsByMonth,
    fetchTransactions,
    fetchData,
    deleteTransaction,
    addTransaction,
    updateTransaction,
  };
});
