<template>
  <div class="flex flex-wrap justify-center gap-8 py-4">
    <div
      v-for="plan in plans"
      :key="plan.name"
      class="w-[360px] p-8 bg-white border border-gray-100 rounded-[40px] shadow-2xl relative flex flex-col text-left"
    >
      <div
        :class="[
          'absolute top-0 left-0 w-full h-[8px] rounded-t-[40px]',
          plan.gradient,
        ]"
      ></div>

      <h3 class="text-2xl font-extrabold text-gray-800">
        {{ plan.name }} - Annual
      </h3>

      <div class="mt-4 mb-2">
        <span
          class="bg-gray-100 text-gray-400 text-[10px] font-black px-2 py-1 rounded uppercase italic tracking-widest text-left"
          >3-days free then:</span
        >
      </div>

      <div class="flex items-baseline gap-1 my-2">
        <span class="text-5xl font-black text-gray-900 tracking-tighter"
          >${{ plan.price }}</span
        >
        <span class="text-gray-400 font-medium">/month</span>
      </div>

      <p class="text-[13px] text-gray-400 italic">
        billed yearly at <span class="line-through">${{ plan.oldPrice }}</span>
        <span class="font-bold text-gray-700">${{ plan.newPrice }}</span>
      </p>

      <div class="mt-4">
        <span
          class="bg-green-50 text-green-600 border border-green-100 text-[13px] font-extrabold px-3 py-1.5 rounded-lg italic"
        >
          ${{ plan.savings }} in savings
        </span>
      </div>

      <button
        class="w-full mt-8 py-5 bg-[#ffb020] hover:bg-[#ffa000] text-white font-black rounded-2xl shadow-xl shadow-orange-100 transition-all uppercase text-[12px] tracking-[0.15em]"
      >
        Try It Free
      </button>

      <hr class="my-8 border-gray-50" />

      <ul class="space-y-4 flex-1">
        <li
          v-for="feat in plan.features"
          :key="feat.text"
          class="flex items-start gap-3"
        >
          <span class="text-[#a3e635] text-xl leading-none">✦</span>
          <div class="text-[14px] text-gray-600 leading-tight">
            <span class="font-bold text-gray-700">{{ feat.text }}</span>
            <p v-if="feat.sub" class="text-[11px] text-gray-400 mt-1">
              {{ feat.sub }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const plans = [
  {
    name: 'Starter',
    price: '83.25',
    oldPrice: '1,188',
    newPrice: '999',
    savings: '189',
    gradient: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    features: [
      { text: 'Primary user only', sub: '(extra team members for $35/month)' },
      { text: 'Save unlimited properties' },
      { text: '10,000 exports' },
      { text: '500 free skip traces' },
      { text: 'Imports $0.01' },
      { text: 'FREE daily product trainings' },
    ],
  },
  {
    name: 'Team',
    price: '207.50',
    oldPrice: '2,988',
    newPrice: '2,490',
    savings: '498',
    gradient: 'bg-gradient-to-r from-green-400 to-cyan-400',
    features: [
      {
        text: 'Primary user + 2 members',
        sub: '(extra team members for $25/month)',
      },
      { text: 'Save unlimited properties' },
      { text: '50,000 exports' },
      { text: '1,000 free skip traces' },
      { text: 'Imports $0.01' },
      { text: 'FREE daily product trainings' },
    ],
  },
  {
    name: 'Business',
    price: '457.50',
    oldPrice: '6,588',
    newPrice: '5,490',
    savings: '1,098',
    gradient: 'bg-gradient-to-r from-green-400 to-lime-500',
    features: [
      {
        text: 'Primary user + 6 members',
        sub: '(extra team members for $20/month)',
      },
      { text: 'Save unlimited properties' },
      { text: '100,000 exports' },
      { text: '2,000 free skip traces' },
      { text: 'Imports $0.01' },
      { text: 'FREE daily product trainings' },
    ],
  },
];
</script>
