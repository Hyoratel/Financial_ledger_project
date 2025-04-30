<template>
  <!-- 거래 입력/수정 폼 -->
  <form
    id="transactionForm"
    @submit.prevent="handleSubmit"
    class="transaction-form"
  >
    <!-- 날짜 입력 -->
    <label>
      날짜:
      <input type="date" v-model="form.date" />
      <div v-if="errors.date" class="error">{{ errors.date }}</div>
    </label>

    <!-- 수입/지출 유형 선택 -->
    <label>
      유형:
      <select v-model="form.type">
        <option disabled value="">-- 선택 --</option>
        <option value="income">수입</option>
        <option value="expense">지출</option>
      </select>
      <div v-if="errors.type" class="error">{{ errors.type }}</div>
    </label>

    <!-- 유형이 선택됐을 때만 카테고리 영역 표시 -->
    <div v-if="form.type" class="category-section">
      <label>카테고리 선택:</label>
      <SelectCategory @select="form.category = $event.value" />
      <div v-if="errors.category" class="error">{{ errors.category }}</div>
    </div>

    <!-- 금액 입력 -->
    <label>
      금액:
      <input type="text" v-model="form.amount" @input="validateAmount" />
      <div v-if="errors.amount" class="error">{{ errors.amount }}</div>
    </label>

    <!-- 메모 입력 -->
    <label>
      메모:
      <input type="text" v-model="form.memo" />
    </label>
  </form>
</template>

<script setup>
// 🔹 vue 기본 기능 가져오기
import { ref, computed, watch } from 'vue';

// 🔹 Pinia store 가져오기
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useTransactionModalStore } from '@/stores/TransactionModalStore';

// 🔹 카테고리 선택 컴포넌트 가져오기
import SelectCategory from '@/components/SelectCategory.vue';

// 🔹 부모 컴포넌트로부터 받는 props 정의
const props = defineProps({
  transaction: Object, // 수정할 거래 정보 (optional)
  date: String, // 기본 날짜 값 (optional)
});

// 🔹 완료 이벤트 emit
const emit = defineEmits(['completed']);

// 🔹 필요한 스토어 초기화
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const modal = useTransactionModalStore();

// 🔹 입력폼 데이터 관리
const form = ref({
  date: props.date || '', // 기본 날짜
  type: 'expense', // 기본 유형: 지출
  category: '',
  amount: '',
  memo: '',
});

// 🔹 입력폼 에러 메시지 관리
const errors = ref({
  date: '',
  type: '',
  category: '',
  amount: '',
});

// 🔹 수정 모드 여부 판별
const isEditMode = computed(() => !!props.transaction);

// 🔹 거래 수정모드일 경우, 기존 거래 데이터로 폼 초기화
watch(
  () => props.transaction,
  (tx) => {
    if (tx) {
      form.value = {
        ...tx,
        amount: tx.amount.toString(), // 숫자를 문자열로 변환 (input은 string)
      };
    } else {
      // 신규 등록 모드일 경우 빈 값 초기화
      form.value = {
        date: props.date || '',
        type: 'expense',
        category: '',
        amount: '',
        memo: '',
      };
    }
  },
  { immediate: true } // 최초에도 반영되게 설정
);

// 🔹 유형(type) 변경 시, 해당 유형에 맞는 카테고리 새로 불러오기
watch(
  () => form.value.type,
  (newType) => {
    categoryStore.selectedType = newType;
    form.value.category = ''; // 유형 바뀌면 카테고리 초기화
    if (newType) {
      categoryStore.fetchCategory(newType); // 서버/스토어에서 카테고리 다시 로딩
    }
  },
  { immediate: true }
);

// 🔹 금액 입력 시 숫자만 허용
const validateAmount = (e) => {
  const val = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남김
  form.value.amount = val;
};

// 🔹 거래 저장 처리
const handleSubmit = async () => {
  // 모든 에러 초기화
  errors.value = {
    date: '',
    type: '',
    category: '',
    amount: '',
  };

  let isValid = true; // 기본적으로 유효성 true로 시작

  // 🔹 유효성 체크
  if (!form.value.date) {
    errors.value.date = '날짜를 입력해주세요.';
    isValid = false;
  }
  if (!form.value.type) {
    errors.value.type = '유형을 선택해주세요.';
    isValid = false;
  }
  if (!form.value.category) {
    errors.value.category = '카테고리를 선택해주세요.';
    isValid = false;
  }
  if (!form.value.amount) {
    errors.value.amount = '금액을 입력해주세요.';
    isValid = false;
  }

  // 🔹 유효성 실패 시 중단
  if (!isValid) return;

  // 🔹 서버에 보낼 최종 데이터 구성
  const payload = {
    ...form.value,
    userId: authStore.user.id, // 로그인 사용자 ID 추가
    amount: parseInt(form.value.amount), // 금액은 숫자 타입으로 변환
  };

  // 🔹 수정모드/등록모드 구분
  if (isEditMode.value) {
    await transactionStore.updateTransaction(payload);
  } else {
    await transactionStore.addTransaction(payload);
  }

  // 완료 이벤트 발생 (부모 컴포넌트에서 모달 닫기 등 처리)
  emit('completed');
};
</script>

<style scoped>
/* 🔹 폼 레이아웃 스타일 */
.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 🔹 카테고리 선택 영역 스타일 */
.category-section {
  padding: 0.5rem 0;
}

/* 🔹 선택된 카테고리 표시 텍스트 스타일 */
.selected-category {
  font-size: 0.9rem;
  color: #444;
  margin-top: 5px;
}

/* 🔹 input, select 공통 스타일 */
input,
select {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 🔹 에러 문구 스타일 */
.error {
  color: #dc3545; /* 빨간색 */
  font-size: 0.8rem;
  margin-top: 4px;
}
</style>
