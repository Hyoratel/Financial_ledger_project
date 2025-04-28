<template>
  <form
    id="transactionForm"
    @submit.prevent="handleSubmit"
    class="transaction-form"
  >
    <label>
      날짜:
      <input type="date" v-model="form.date" />
      <div v-if="errors.date" class="error">{{ errors.date }}</div>
    </label>

    <label>
      유형:
      <select v-model="form.type">
        <option disabled value="">-- 선택 --</option>
        <option value="income">수입</option>
        <option value="expense">지출</option>
      </select>
      <div v-if="errors.type" class="error">{{ errors.type }}</div>
    </label>

    <div v-if="form.type" class="category-section">
      <label>카테고리 선택:</label>
      <SelectCategory @select="form.category = $event.value" />
      <div v-if="errors.category" class="error">{{ errors.category }}</div>
    </div>

    <label>
      금액:
      <input type="text" v-model="form.amount" @input="validateAmount" />
      <div v-if="errors.amount" class="error">{{ errors.amount }}</div>
    </label>

    <label>
      메모:
      <input type="text" v-model="form.memo" />
    </label>
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
const modal = useTransactionModalStore();

const form = ref({
  date: props.date || '',
  type: 'expense',
  category: '',
  amount: '',
  memo: '',
});

// 에러 메시지 관리
const errors = ref({
  date: '',
  type: '',
  category: '',
  amount: '',
});

const isEditMode = computed(() => !!props.transaction);

watch(
  () => props.transaction,
  (tx) => {
    if (tx) {
      form.value = {
        ...tx,
        amount: tx.amount.toString(),
      };
    } else {
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

// 금액 숫자만 입력
const validateAmount = (e) => {
  const val = e.target.value.replace(/[^0-9]/g, '');
  form.value.amount = val;
};

// ✨ 저장 처리
const handleSubmit = async () => {
  // 모든 에러 초기화
  errors.value = {
    date: '',
    type: '',
    category: '',
    amount: '',
  };

  let isValid = true;

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

  if (!isValid) return;

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
input,
select {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
/* ✨ 에러 문구 스타일 */
.error {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 4px;
}
</style>
