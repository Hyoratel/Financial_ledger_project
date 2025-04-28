import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // ✅ 로그인 사용자 정보 사용

// 💰 거래 관련 상태 및 로직을 관리하는 Pinia 스토어 정의
export const useTransactionStore = defineStore('transaction', () => {
  // 📦 거래 내역 목록
  const transactions = ref([]);

  // 📂 카테고리 목록 (서버에서 별도 관리)
  const incomeCategory = ref([]);
  const expenseCategory = ref([]);

  // ✅ 로그인한 사용자 ID 기준으로 거래 내역 불러오기
  const fetchTransactions = async () => {
    try {
      const authStore = useAuthStore(); // 사용자 인증 정보 가져오기
      if (!authStore.user?.id) return; // 사용자 정보 없으면 중단

      // 사용자별 거래 데이터 가져오기
      const res = await axios.get(
        `http://localhost:3000/budget?userId=${authStore.user.id}`
      );
      transactions.value = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      // ✅ 날짜 내림차순(최신순) 정렬해서 저장!
    } catch (error) {
      console.error('📛 거래 데이터 불러오기 실패:', error);
    }
  };

  // 📦 모든 데이터 (거래 + 카테고리) 동시 로딩
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

      transactions.value = tx.data;
      incomeCategory.value = income.data;
      expenseCategory.value = expense.data;
    } catch (error) {
      console.error('📛 데이터 로딩 실패:', error);
    }
  };

  // ❌ 거래 항목 삭제
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/budget/${id}`); // 삭제 요청
      await fetchTransactions(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('❌ 삭제 오류:', error);
    }
  };

  // ➕ 거래 항목 추가
  const addTransaction = async (item) => {
    try {
      await axios.post('http://localhost:3000/budget', item); // 새 거래 추가
      await fetchTransactions(); // 추가 후 목록 갱신
    } catch (error) {
      console.error('❌ 거래 저장 실패:', error);
      alert('거래 저장 중 오류가 발생했습니다.');
    }
  };

  // 🔄 거래 항목 수정
  const updateTransaction = async (updatedTransaction) => {
    try {
      await axios.put(
        `http://localhost:3000/budget/${updatedTransaction.id}`,
        updatedTransaction
      );
      await fetchTransactions(); // 수정 후 목록 갱신
    } catch (error) {
      console.error('❌ 업데이트 오류:', error);
    }
  };

  // 🧩 외부에서 사용할 수 있는 state와 함수들 반환
  return {
    transactions,
    incomeCategory,
    expenseCategory,
    fetchTransactions,
    fetchData,
    deleteTransaction,
    addTransaction,
    updateTransaction,
  };
});
