<!--
  SelectCategory.vue

  - 현재 선택된 수입/지출 타입에 따라 카테고리 리스트 표시
  - 클릭 시 선택된 카테고리를 부모로 emit('select', category) 이벤트 전달
  - 거래 입력 폼(TransactionForm) 등에서 카테고리 선택용으로 사용
-->

<template>
  <div class="select-category">
    <ul class="category-list">
      <li
        v-for="category in categories"
        :key="category.id"
        @click="handleSelect(category)"
        :class="{ selected: selectedCategory?.id === category.id }"
      >
        {{ category.value }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';

const emit = defineEmits(['select']);

const categoryStore = useCategoryStore();
const selectedCategory = ref(null);

// 현재 선택된 타입(income or expense)에 따라 카테고리 리스트 반환
const categories = computed(() =>
  categoryStore.selectedType === 'income'
    ? categoryStore.incomeCategory
    : categoryStore.expenseCategory
);

// 카테고리 선택 시 처리
const handleSelect = (category) => {
  selectedCategory.value = category;
  emit('select', category); // 부모로 전달
};
</script>

<style scoped>
.select-category {
  padding: 1rem;
}
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}
.category-list li {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.2s;
}
.category-list li.selected {
  background-color: #2c7be5;
  color: white;
  font-weight: bold;
}
</style>
