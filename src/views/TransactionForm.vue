<template>
  <form
    id="transactionForm"
    @submit.prevent="handleSubmit"
    class="transaction-form"
  >
    <label>
      날짜:
      <input type="date" v-model="form.date" required />
    </label>

    <label>
      유형:
      <select v-model="form.type" required>
        <option disabled value="">-- 선택 --</option>
        <option value="income">수입</option>
        <option value="expense">지출</option>
      </select>
    </label>

    <div v-if="form.type" class="category-section">
      <label>카테고리 선택:</label>
      <SelectCategory @select="form.category = $event.value" />
      <div v-if="form.category" class="selected-category">
        선택됨: {{ form.category }}
      </div>
    </div>

    <label>
      금액:
      <input
        type="text"
        v-model="form.amount"
        @input="validateAmount"
        required
      />
    </label>

    <label>
      메모:
      <input type="text" v-model="form.memo" />
    </label>

    <div class="button-group">
      <button type="submit">저장</button>
      <button type="button" @click="modal.close()">닫기</button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useTransactionModalStore } from '@/stores/TransactionModalStore';
import SelectCategory from '@/components/SelectCategory.vue';

const props = defineProps({
  transaction: Object,
  date: String,
});

const emit = defineEmits(['completed']);

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const modal = useTransactionModalStore(); // ✅ 호출 빠진 거 수정!!

// 📝 폼 상태
const form = ref({
  date: props.date || '',
  type: 'expense', // 기본값
  category: '',
  amount: '',
  memo: '',
});

// 🧩 수정 모드 여부
const isEditMode = computed(() => !!props.transaction);

// ✅ transaction 값 감지해서 form 채우기
watch(
  () => props.transaction,
  (tx) => {
    if (tx) {
      form.value = {
        ...tx,
        amount: tx.amount.toString(), // 문자열로 변환
      };
    } else {
      // 새 거래 추가인 경우
      form.value = {
        date: props.date || '',
        type: 'expense',
        category: '',
        amount: '',
        memo: '',
      };
    }
  },
  { immediate: true }
);

// ✅ 유형 바뀌면 카테고리 초기화 및 fetch
watch(
  () => form.value.type,
  (newType) => {
    categoryStore.selectedType = newType;
    form.value.category = '';
    if (newType) {
      categoryStore.fetchCategory(newType);
    }
  },
  { immediate: true }
);

// 금액 입력 숫자만 허용
const validateAmount = (e) => {
  const val = e.target.value.replace(/[^0-9]/g, '');
  form.value.amount = val;
};

// 저장 처리
const handleSubmit = async () => {
  const payload = {
    ...form.value,
    userId: authStore.user.id,
    amount: parseInt(form.value.amount),
  };

  if (isEditMode.value) {
    await transactionStore.updateTransaction(payload);
  } else {
    await transactionStore.addTransaction(payload);
  }

  emit('completed');
};
</script>

<style scoped>
.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.category-section {
  padding: 0.5rem 0;
}
.selected-category {
  font-size: 0.9rem;
  color: #444;
  margin-top: 5px;
}
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
input,
select {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>

<!-- 수정모드일 때 form 자동 세팅 -->
<!-- form 초기화 : 새 거랠 추가시 date만 props로 받고 나머지는 빈값 세팅 -->
<!-- 저장/닫기 버튼 활성화 -->
