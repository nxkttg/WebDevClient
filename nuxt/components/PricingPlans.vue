<script setup>
// 1. Підключаємо стор підписки (Pinia)
const subStore = useSubscriptionStore();

// 2. Повний масив даних (включаючи id, назви, ціни, градієнти та список переваг)
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '83.25',
    oldPrice: '1,188',
    newPrice: '999',
    savings: '189',
    // ВИПРАВЛЕНО: Градієнти тепер плавніші
    gradient: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600',
    features: [
      { text: 'Primary user only', sub: '(extra team members for $35/month)' },
      { text: 'Save unlimited properties' },
      { text: '10,000 exports', sub: '(additional exports at $0.02 each)' },
      { text: '500 free skip traces' },
      { text: 'Imports $0.01' },
      { text: 'FREE daily product trainings' },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: '207.50',
    oldPrice: '2,988',
    newPrice: '2,490',
    savings: '498',
    // ВИПРАВЛЕНО: Градієнти тепер плавніші
    gradient: 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500',
    features: [
      {
        text: 'Primary user + 2 free team members',
        sub: '(extra team members for $25/month)',
      },
      { text: 'Save unlimited properties' },
      { text: '50,000 exports', sub: '(additional exports at $0.01 each)' },
      { text: '1,000 free skip traces' },
      { text: 'Imports $0.01' },
      { text: 'FREE daily product trainings' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: '457.50',
    oldPrice: '6,588',
    newPrice: '5,490',
    savings: '1,098',
    // ВИПРАВЛЕНО: Градієнти тепер плавніші
    gradient: 'bg-gradient-to-r from-green-400 via-lime-500 to-yellow-500',
    features: [
      {
        text: 'Primary user + 6 free team members',
        sub: '(extra team members for $20/month)',
      },
      { text: 'Save unlimited properties' },
      { text: '100,000 exports', sub: '(additional exports at $0.01 each)' },
      { text: '2,000 free skip traces' },
      { text: 'Imports $0.01' },
      { text: 'FREE daily product trainings' },
    ],
  },
];

// 3. Логіка вибору плану
const handlePlanSelection = (plan) => {
  subStore.selectPlan(plan); // Записуємо весь об'єкт плану в Pinia
  navigateTo('/checkout'); // Переходимо на сторінку оплати
};
</script>

<template>
  <div
    class="flex flex-wrap justify-center gap-8 py-12 px-4 bg-gray-50 font-sans text-left"
  >
    <div
      v-for="plan in plans"
      :key="plan.id"
      class="w-[360px] p-8 bg-white border border-gray-100 rounded-[40px] shadow-xl relative flex flex-col transition-all hover:shadow-2xl hover:scale-[1.01] overflow-hidden"
    >
      <div
        :class="['absolute top-0 left-0 w-full h-[10px] z-10', plan.gradient]"
      ></div>

      <div class="pt-2 flex flex-col flex-1">
        <h3 class="text-2xl font-extrabold text-gray-800">
          {{ plan.name }} - Annual
        </h3>

        <div class="mt-4 mb-2 flex items-center gap-2">
          <span
            class="bg-gray-100 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest text-left"
          >
            3-days free then:
          </span>
        </div>

        <div class="flex items-baseline gap-1 my-3">
          <span class="text-5xl font-black text-gray-900 tracking-tighter"
            >${{ plan.price }}</span
          >
          <span class="text-gray-400 font-medium text-sm">/month</span>
        </div>

        <p class="text-[13px] text-gray-400 italic font-medium">
          billed yearly at
          <span class="line-through">${{ plan.oldPrice }}</span>
          <span class="font-bold text-gray-700 decoration-auto"
            >${{ plan.newPrice }}</span
          >
        </p>

        <div class="mt-5">
          <span
            class="bg-green-50 text-green-600 border border-green-100 text-[13px] font-extrabold px-4 py-2 rounded-xl italic shadow-inner inline-block"
          >
            ${{ plan.savings }} in savings
          </span>
        </div>

        <button
          @click="handlePlanSelection(plan)"
          class="w-full mt-10 py-5 bg-[#ffb020] hover:bg-[#ffa000] text-white font-black rounded-2xl shadow-lg shadow-orange-100 transition-all uppercase text-[12px] tracking-[0.2em] text-center transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Try It Free
        </button>

        <hr class="my-10 border-gray-100" />

        <ul class="space-y-5 flex-1 pb-4">
          <li
            v-for="feat in plan.features"
            :key="feat.text"
            class="flex items-start gap-4"
          >
            <svg
              class="w-5 h-5 mt-0.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#a3e635"
                stroke="#84cc16"
                stroke-width="1"
                stroke-linejoin="round"
              />
            </svg>
            <div class="text-[14px] text-gray-600 leading-snug font-medium">
              <span class="font-bold text-gray-800">{{ feat.text }}</span>
              <p
                v-if="feat.sub"
                class="text-[11px] text-gray-400 mt-1 leading-tight"
              >
                {{ feat.sub }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Додаткові стилі для покращення візуалу */
.font-sans {
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

/* Плавна анімація для всього */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
