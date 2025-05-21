import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
//이재성 부트스트랩 import 추가
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
//useAuthStore import 추가
import { useAuthStore } from './stores/authStore';
const app = createApp(App);

app.use(createPinia());
app.use(router);
const authStore = useAuthStore();
const savedUser = localStorage.getItem('user');
if (savedUser) {
  authStore.user = JSON.parse(savedUser);
  authStore.isLoggedIn = true;
}
app.mount('#app');
