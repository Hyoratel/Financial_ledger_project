// 📁 src/stores/categoryStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3000/';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    incomeCategory: [],
    expenseCategory: [],
    selectedType: 'expense', // 'income' 또는 'expense'
    loading: false,
    error: null,
  }),

  getters: {
    getIncomeCategories: (state) => {
      return [...state.incomeCategory].sort((a, b) => b - a);
    },
    getExpenseCategories: (state) => {
      return [...state.expenseCategory].sort((a, b) => b - a);
    },
  },

  actions: {
    // ✅ 수입 또는 지출 카테고리를 json-server에서 불러오기
    async fetchCategory(type) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_URL}${type}Category`);
        if (type === 'income') {
          this.incomeCategory = response.data;
        } else {
          this.expenseCategory = response.data;
        }
      } catch (error) {
        console.log(error);
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
