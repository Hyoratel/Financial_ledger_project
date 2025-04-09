// 거래 목록 관리 (조회, 추가, 삭제)
// stores/transactionStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [], // 빈 배열로 초기화
    filteredTransactions: [],
  }),

  actions: {
    // ✅ JSON 서버에서 데이터 불러오기
    async fetchTransactions() {
      try {
        const response = await axios.get('http://localhost:3000/budget');
        this.transactions = response.data;
        this.filteredTransactions = response.data;
      } catch (error) {
        console.error('📛 거래 데이터 불러오기 실패:', error);
      }
    },

    // 거래 필터링
    filterTransactions(date, category) {
      this.filteredTransactions = this.transactions.filter((tx) => {
        const matchDate = !date || tx.date === date;
        const matchCategory = !category || tx.category === category;
        return matchDate && matchCategory;
      });
    },

    // 거래 삭제
    deleteTransaction(id) {
      this.transactions = this.transactions.filter((tx) => tx.id !== id);
      this.filteredTransactions = this.filteredTransactions.filter(
        (tx) => tx.id !== id
      );
    },
  },
});
