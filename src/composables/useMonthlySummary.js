// 월별 거래 데이터를 받아 총 수입/총 지출/순수입/수입 대비 비율/피드백 문구를 계산하는 composable
// 거래 입력 및 월별 요약 기능에서 재사용 가능

import { computed } from 'vue';

/**
 * useMonthlySummary
 * @param {Ref<Array>} transactionsRef - 월별 필터링된 거래 데이터
 * @returns {Object} { totalIncome, totalExpense, netIncome, balanceRatio, feedbackComment }
 */
export function useMonthlySummary(transactionsRef) {
  // 총 수입 계산
  const totalIncome = computed(() =>
    transactionsRef.value
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  // 총 지출 계산
  const totalExpense = computed(() =>
    transactionsRef.value
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  // 순수입 계산
  const netIncome = computed(() => totalIncome.value - totalExpense.value);

  // 수입 대비 순수입 비율 계산 (퍼센트 단위, 0~100)
  const balanceRatio = computed(() =>
    totalIncome.value === 0
      ? 0
      : Math.round((netIncome.value / totalIncome.value) * 100)
  );

  // 피드백 문구 계산
  const feedbackComment = computed(() => {
    const ratio = balanceRatio.value;
    if (ratio >= 75) return '이번 달은 여유롭네요!';
    if (ratio >= 50) return '이번 달은 괜찮은 편이에요.';
    if (ratio >= 25) return '이번 달은 조금 아껴야 해요.';
    return '이번 달은 지출이 너무 많아요...!';
  });

  return {
    totalIncome,
    totalExpense,
    netIncome,
    balanceRatio,
    feedbackComment,
  };
}
