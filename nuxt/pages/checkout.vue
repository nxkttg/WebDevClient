<script setup>
import { storeToRefs } from 'pinia';

// 1. Підключаємо стор підписки
const subStore = useSubscriptionStore();
// Отримуємо вибраний план із глобального стану Pinia
const { selectedPlan } = storeToRefs(subStore);

// 2. Захист сторінки: якщо план не обрано, повертаємо на головну
onMounted(() => {
  if (!selectedPlan.value) {
    navigateTo('/');
  }
});

// 3. Стан форми оплати
const formData = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  fullName: 'dev4 dev4',
  consent: false,
});

const isSubmitting = ref(false);

// 4. Функція обробки оплати
const handleCheckout = async () => {
  if (!formData.value.consent) {
    alert('Будь ласка, підтвердіть згоду з умовами');
    return;
  }

  isSubmitting.value = true;
  try {
    // Відправляємо дані на твій API
    const res = await $fetch('/api/subscription/create', {
      method: 'POST',
      body: {
        ...formData.value,
        planId: selectedPlan.value.id,
      },
    });
    alert(res.message || 'Оплата успішна!');
  } catch (err) {
    alert('Помилка при обробці платежу');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 pb-20 font-sans text-left"
    v-if="selectedPlan"
  >
    <Title>Checkout - {{ selectedPlan.name }}</Title>

    <header
      class="bg-[#333] text-white py-4 text-center font-bold text-lg shadow-md mb-8"
    >
      Checkout
    </header>

    <div class="max-w-6xl mx-auto px-4">
      <NuxtLink
        to="/"
        class="text-gray-400 hover:text-gray-600 mb-6 inline-block transition-colors"
      >
        « back to plans
      </NuxtLink>

      <h1 class="text-4xl font-black text-gray-800 mb-2 italic">
        You’re Almost In!
      </h1>
      <p class="text-gray-500 mb-10 font-medium">
        Start your 3-day free trial and gain instant access.
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div
          class="lg:col-span-5 bg-white p-10 rounded-[40px] shadow-xl border-l-[12px] border-orange-400"
        >
          <h2 class="text-2xl font-black text-gray-800">
            {{ selectedPlan.name }} Plan
          </h2>

          <div
            class="bg-orange-50 text-orange-400 text-[10px] inline-block px-2 py-1 rounded mt-4 font-black uppercase tracking-widest italic"
          >
            Annual Subscription
          </div>

          <div class="flex items-baseline gap-2 my-6">
            <span class="text-5xl font-black text-gray-900 tracking-tighter"
              >${{ selectedPlan.price }}</span
            >
            <span class="text-gray-400 font-bold">/mo</span>
          </div>

          <div class="p-6 bg-gray-50 rounded-2xl mb-8">
            <p
              class="text-gray-500 text-xs uppercase font-black tracking-widest"
            >
              Total due after trial:
            </p>
            <p class="text-3xl font-black text-gray-800">
              ${{ selectedPlan.newPrice }}.00
            </p>
          </div>

          <div class="space-y-4 border-t pt-8">
            <div
              v-for="feat in selectedPlan.features"
              :key="feat.text"
              class="flex items-center gap-3 text-gray-600 font-medium text-sm"
            >
              <span class="text-green-500">✦</span>
              {{ typeof feat === 'string' ? feat : feat.text }}
            </div>
          </div>
        </div>

        <div
          class="lg:col-span-7 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100"
        >
          <h3 class="text-xl font-black mb-8 uppercase tracking-tight">
            Payment Details
          </h3>

          <form @submit.prevent="handleCheckout" class="space-y-6">
            <div class="space-y-2">
              <label
                class="block text-xs font-black uppercase tracking-widest text-gray-400"
                >Card Information</label
              >
              <div class="grid grid-cols-4 gap-2">
                <input
                  v-model="formData.cardNumber"
                  type="text"
                  placeholder="Card Number"
                  class="col-span-2 p-4 border rounded-xl bg-gray-50 outline-none focus:border-orange-400 transition-all"
                />
                <input
                  v-model="formData.expiry"
                  type="text"
                  placeholder="MM/YY"
                  class="p-4 border rounded-xl bg-gray-50 outline-none focus:border-orange-400 transition-all"
                />
                <input
                  v-model="formData.cvv"
                  type="text"
                  placeholder="CVV"
                  class="p-4 border rounded-xl bg-gray-50 outline-none focus:border-orange-400 transition-all"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label
                class="block text-xs font-black uppercase tracking-widest text-gray-400"
                >Cardholder Name</label
              >
              <input
                v-model="formData.fullName"
                type="text"
                class="w-full p-4 border rounded-xl bg-gray-50 outline-none focus:border-orange-400 transition-all font-bold"
              />
            </div>

            <div
              class="flex gap-4 items-start bg-blue-50 p-5 rounded-2xl border border-blue-100 mt-4"
            >
              <input
                type="checkbox"
                v-model="formData.consent"
                class="mt-1 w-5 h-5 accent-orange-500 cursor-pointer"
              />
              <p class="text-[11px] text-blue-800 leading-relaxed font-medium">
                I agree to the <b>Terms of Service</b>. My card will be charged
                <b>${{ selectedPlan.newPrice }}.00</b> annually after the 3-day
                trial period unless I cancel my subscription.
              </p>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-5 bg-[#ffb020] hover:bg-[#ffa000] disabled:bg-gray-300 text-white font-black rounded-2xl shadow-xl hover:scale-[1.01] transition-all uppercase tracking-[0.2em] text-[13px]"
            >
              {{ isSubmitting ? 'Processing...' : 'Complete Purchase' }}
            </button>

            <p
              class="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4"
            >
              🔒 SSL Encrypted & Secure Payment
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
