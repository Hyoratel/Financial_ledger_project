<template>
  <!-- 레이아웃 컴포넌트 적용 (DefaultLayout 또는 AuthLayout) -->
  <component :is="layout">
    <router-view></router-view>
    <!-- 현재 라우트에 해당하는 화면 표시 -->
  </component>

  <!-- 거래 관련 모달: 열려있을 때만 렌더링 -->
  <BaseModal v-if="modal.isOpen" @close="modal.close">
    <!-- 모달 헤더 영역 -->
    <template #header>
      {{
        // 모달 모드(form, confirm-delete, list)에 따라 제목 다르게 표시
        modal.mode === 'form'
          ? modal.editingTransaction
            ? '거래 수정'
            : '거래 추가'
          : modal.mode === 'confirm-delete'
          ? '삭제 확인'
          : '거래 내역'
      }}
    </template>

    <!-- 모달 본문 영역 -->
    <template #body>
      <!-- 거래 리스트 보기 모드 -->
      <div v-if="modal.mode === 'list'">
        <div v-if="transactionsForSelectedDate.length">
          <!-- 선택한 날짜의 거래 내역이 있을 경우 -->
          <div
            v-for="tx in transactionsForSelectedDate"
            :key="tx.id"
            class="transaction-list-item"
          >
            <div class="info">
              <div class="date">{{ tx.date }}</div>
              <!-- 거래 날짜 -->
              <div class="content">
                {{ tx.category }}
                <!-- 거래 카테고리 -->
                <span :class="['amount', tx.type]">
                  {{ tx.amount.toLocaleString() }}원
                  <!-- 거래 금액 -->
                </span>
              </div>
            </div>
            <div class="actions">
              <!-- 거래 수정 버튼 -->
              <button
                class="action-button edit"
                @click="modal.openForm(tx.date, tx)"
              >
                수정
              </button>
              <!-- 거래 삭제 버튼 -->
              <button
                class="action-button delete"
                @click="modal.openDeleteConfirm(tx.id)"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
        <div v-else>거래가 없습니다.</div>
        <!-- 거래 없을 때 메시지 -->
      </div>

      <!-- 거래 입력 또는 수정 모드 -->
      <TransactionForm
        v-else-if="modal.mode === 'form'"
        :transaction="modal.editingTransaction"
        :date="modal.selectedDate"
        @completed="onTransactionCompleted"
      />

      <!-- 거래 삭제 확인 모드 -->
      <div v-else-if="modal.mode === 'confirm-delete'" class="confirm-delete">
        <p>정말 삭제하시겠습니까?</p>
      </div>
    </template>

    <!-- 모달 푸터 영역 -->
    <template #footer>
      <div class="footer-actions">
        <!-- 거래 리스트 모드에서 '거래 추가' 버튼 표시 -->
        <template v-if="modal.mode === 'list'">
          <button
            class="modal-button"
            @click="modal.openForm(modal.selectedDate)"
          >
            + 거래 추가
          </button>
        </template>

        <!-- 거래 입력/수정 모드에서 '저장' 버튼 표시 -->
        <template v-if="modal.mode === 'form'">
          <button class="modal-button" type="submit" form="transactionForm">
            저장
          </button>
        </template>

        <!-- 삭제 확인 모드에서 '삭제' 버튼 표시 -->
        <template v-if="modal.mode === 'confirm-delete'">
          <button class="modal-button" @click="confirmDelete">삭제</button>
        </template>

        <!-- 어떤 모드에서든 '닫기' 버튼 항상 표시 -->
        <button class="modal-button" @click="modal.close">닫기</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
// 🔹 Vue3 Composition API 방식으로 작성

// 기본 vue 기능 가져오기
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// 🔹 컴포넌트 가져오기
import BaseModal from './components/base/baseModal.vue';
import TransactionForm from './views/TransactionForm.vue';

// 🔹 Pinia 스토어 가져오기
import { useTransactionModalStore } from '@/stores/TransactionModalStore';
import { useTransactionStore } from '@/stores/transactionStore';

// 🔹 레이아웃 컴포넌트 가져오기
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

// 🔹 모달 상태, 거래 데이터 스토어 초기화
const modal = useTransactionModalStore();
const transactionStore = useTransactionStore();
const route = useRoute();

// 🔹 선택된 날짜의 거래 내역만 필터링
const transactionsForSelectedDate = computed(() => {
  return transactionStore.transactions.filter(
    (tx) => tx.date === modal.selectedDate
  );
});

// 🔹 거래 등록/수정 완료 후 데이터 새로 불러오기 + 모달 닫기
async function onTransactionCompleted() {
  await transactionStore.fetchTransactions();
  modal.close();
}

// 🔹 거래 삭제 확인 후 삭제 수행 + 데이터 새로 불러오기 + 모달 닫기
async function confirmDelete() {
  if (modal.confirmDeleteId) {
    await transactionStore.deleteTransaction(modal.confirmDeleteId);
    await transactionStore.fetchTransactions();
    modal.close();
  }
}

// 🔹 현재 페이지의 메타(layout) 값에 따라 레이아웃 컴포넌트 선택
const layout = computed(() => {
  const layoutName = route.meta.layout;
  return layoutName === 'auth' ? AuthLayout : DefaultLayout;
});
</script>

<style scoped>
/* 🔹 모달 푸터 버튼 영역 스타일 */
.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* 🔹 모달 버튼 스타일 */
.modal-button {
  padding: 8px 16px;
  background-color: #5e4b3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.modal-button:hover {
  background-color: #4b3a2b;
}

/* 🔹 거래 리스트 아이템 스타일 */
.transaction-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

/* 🔹 거래 정보 영역 스타일 */
.info {
  display: flex;
  flex-direction: column;
}
.content {
  font-size: 1rem;
}

/* 🔹 수입 금액 스타일 */
.amount.income {
  color: #007bff;
  font-weight: bold;
}

/* 🔹 지출 금액 스타일 */
.amount.expense {
  color: #dc3545;
  font-weight: bold;
}

/* 🔹 수정/삭제 버튼 영역 스타일 */
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 🔹 액션 버튼 기본 스타일 */
.action-button {
  padding: 4px 12px;
  font-size: 0.8rem;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.action-button.edit {
  color: #333;
}
.action-button.delete {
  color: #dc3545;
}
.action-button:hover {
  background-color: #f1f1f1;
}

/* 🔹 삭제 확인 영역 스타일 */
.confirm-delete {
  text-align: center;
  padding: 20px;
}
</style>
