<script setup>
import { storeToRefs } from 'pinia';
const userStore = useUserStore();
const { name, isLoggedIn, welcomeMessage } = storeToRefs(userStore);
const inputName = ref('');

const handleLogin = () => {
  if (inputName.value) {
    userStore.login(inputName.value);
    inputName.value = '';
  }
};
</script>

<template>
  <div class="p-10 font-sans">
    <NuxtLink to="/" class="text-blue-500 mb-4 inline-block"
      >← На головну</NuxtLink
    >
    <h1 class="text-2xl font-bold mb-4">{{ welcomeMessage }}</h1>
    <div v-if="!isLoggedIn">
      <input
        v-model="inputName"
        placeholder="Введіть ваше ім'я"
        class="border p-2 rounded"
      />
      <button
        @click="handleLogin"
        class="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Увійти
      </button>
    </div>
    <div v-else>
      <p>Ви зайшли о: {{ userStore.loginTime }}</p>
      <button
        @click="userStore.logout"
        class="mt-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        Вийти
      </button>
    </div>
  </div>
</template>
