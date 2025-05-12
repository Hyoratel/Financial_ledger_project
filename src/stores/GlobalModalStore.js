// stores/GlobalModalStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalModalStore = defineStore('globalModal', () => {
  const isOpen = ref(false);
  const title = ref('');
  const message = ref('');
  const onConfirm = ref(null);

  const openAlert = ({ title: t, message: m, onConfirm: confirmFn = null }) => {
    title.value = t;
    message.value = m;
    onConfirm.value = confirmFn;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    title.value = '';
    message.value = '';
    onConfirm.value = null;
  };

  const confirm = () => {
    if (onConfirm.value) onConfirm.value();
    close();
  };

  return {
    isOpen,
    title,
    message,
    onConfirm,
    openAlert,
    close,
    confirm,
  };
});
