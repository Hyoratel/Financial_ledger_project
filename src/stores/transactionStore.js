// stores/transactionStore.js
import { defineStore } from 'pinia';
import axios from 'axios'; // 또는 service로 분리 가능

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [], // 기존 budget → 명확한 이름으로 변경
    filteredTransactions: [], // 필터링된 거래
    incomeCategory: [],
    expenseCategory: [],
  }),

  actions: {
    async fetchData() {
      try {
        const [transactionRes, incomeRes, expenseRes] = await Promise.all([
          axios.get('/api/budget'),
          axios.get('/api/incomeCategory'),
          axios.get('/api/expenseCategory'),
        ]);
        this.transactions = transactionRes.data;
        this.filteredTransactions = transactionRes.data; // 기본값 설정
        this.incomeCategory = incomeRes.data;
        this.expenseCategory = expenseRes.data;
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    },

    filterTransactions(date, category) {
      this.filteredTransactions = this.transactions.filter((tx) => {
        const matchDate = !date || tx.date === date;
        const matchCategory = !category || tx.category === category;
        return matchDate && matchCategory;
      });
    },

    deleteTransaction(id) {
      this.transactions = this.transactions.filter((tx) => tx.id !== id);
      this.filteredTransactions = this.filteredTransactions.filter(
        (tx) => tx.id !== id
      );
    },

    async addTransaction(item) {
      try {
        const response = await axios.post('/api/budget', item);
        this.transactions.push(response.data); // 서버에서 저장된 데이터 사용
        this.filteredTransactions.push(response.data);
      } catch (error) {
        console.error('거래 저장 실패:', error);
        alert('거래 저장 중 오류가 발생했습니다.');
      }
    },
  },
});
