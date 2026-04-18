import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const name = ref('Гість');
  const isLoggedIn = ref(false);
  const loginTime = ref<string | null>(null);

  const welcomeMessage = computed(() => `Вітаємо, ${name.value}!`);

  function login(userName: string) {
    name.value = userName;
    isLoggedIn.value = true;
    loginTime.value = new Date().toLocaleTimeString();
  }

  function logout() {
    name.value = 'Гість';
    isLoggedIn.value = false;
    loginTime.value = null;
  }

  return { name, isLoggedIn, loginTime, welcomeMessage, login, logout };
});
