/** CategoryStore
 * 수입(income) 및 지출(expense) 카테고리 목록을 상태로 관리하고,
 * json-server에서 카테고리 데이터를 비동기로 불러오는 기능 제공
 */
import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3000/';

export const useCategoryStore = defineStore('category', {
  // 상태 정의
  state: () => ({
    incomeCategory: [], // 수입 카테고리 목록
    expenseCategory: [], // 지출 카테고리 목록
    selectedType: 'expense', // 현재 선택된 카테고리 유형 ('income' 또는 'expense')
    loading: false, // 데이터 로딩 여부
    error: null, // 에러 상태
  }),

  // getter 정의
  getters: {
    // 수입 카테고리 목록 반환 (정렬된 복사본 제공)
    getIncomeCategories: (state) => {
      return [...state.incomeCategory].sort((a, b) => b - a);
    },
    // 지출 카테고리 목록 반환 (정렬된 복사본 제공)
    getExpenseCategories: (state) => {
      return [...state.expenseCategory].sort((a, b) => b - a);
    },
  },

  // action 정의
  actions: {
    // 수입 또는 지출 카테고리 데이터를 json-server에서 불러오기
    async fetchCategory(type) {
      this.loading = true;
      this.error = null;

      try {
        // API 요청: 'incomeCategory' 또는 'expenseCategory' 엔드포인트 호출
        const response = await axios.get(`${API_URL}${type}Category`);

        // 응답 데이터를 상태에 저장
        if (type === 'income') {
          this.incomeCategory = response.data;
        } else {
          this.expenseCategory = response.data;
        }
      } catch (error) {
        console.log(error);
        this.error = error; // 에러 상태 저장
      } finally {
        this.loading = false; // 로딩 완료 처리
      }
    },
  },
});
