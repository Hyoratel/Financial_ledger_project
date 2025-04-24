<template>
  <form @submit.prevent="handleSubmit" class="transaction-form">
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

    <!-- <button type="submit">{{ isEditMode ? '수정' : '저장' }}</button> -->
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import { useCategoryStore } from '@/stores/categoryStore';
import SelectCategory from '@/components/SelectCategory.vue'; // ✅ 추가

const props = defineProps({
  transaction: Object,
  date: String,
});

const emit = defineEmits(['completed']);

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const form = ref({
  date: props.date || '',
  type: '',
  category: '',
  amount: '',
  memo: '',
});

// 수정 모드일 때 초기값 설정
const isEditMode = computed(() => !!props.transaction);

if (isEditMode.value) {
  form.value = {
    ...props.transaction,
    amount: props.transaction.amount.toString(),
  };
}

// 유형 변경될 때 categoryStore 상태 반영
watch(
  () => form.value.type,
  (newType) => {
    categoryStore.selectedType = newType;
    form.value.category = ''; // 선택 초기화
    if (newType) {
      categoryStore.fetchCategory(newType); // json-server에서 가져오기
    }
  },
  { immediate: true }
);

// 숫자만 입력
const validateAmount = (e) => {
  const val = e.target.value.replace(/[^0-9]/g, '');
  form.value.amount = val;
};

// 저장 또는 수정
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
input,
select {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
