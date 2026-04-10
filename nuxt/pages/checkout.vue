<script setup>
const route = useRoute()
const selectedPlan = route.query.plan || 'starter'

// Завантажуємо дані саме для того плану, який натиснув користувач
const { data: plan, pending } = await useFetch(`/api/subscription/details?plan=${selectedPlan}`)

const formData = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  fullName: 'dev4 dev4',
  address: '',
  consent: false
})

const handleCheckout = async () => {
  if (!formData.value.consent) return alert('Потрібна згода з умовами')
  const res = await $fetch('/api/subscription/create', { method: 'POST', body: formData.value })
  alert(res.message)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans pb-20">
    <Title>Checkout - {{ plan?.planName || 'Payment' }}</Title>

    <header class="bg-[#333] text-white py-4 text-center font-bold text-lg shadow-md mb-8">
      Checkout
    </header>

    <div class="max-w-6xl mx-auto px-4" v-if="!pending">
      <NuxtLink to="/" class="text-gray-400 hover:text-gray-600 mb-6 inline-block">« back</NuxtLink>

      <h1 class="text-3xl font-black text-gray-800 mb-2">You’re Almost In - Start Your 3-Day Free Trial Now!</h1>
      <p class="text-gray-500 mb-10">Set up your account to gain instant access!</p>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div class="lg:col-span-5 bg-white p-10 rounded-[40px] shadow-xl border-l-[12px]" :class="plan.color">
          <h2 class="text-2xl font-black">{{ plan.planName }}</h2>
          <div class="flex items-baseline gap-2 my-6">
            <span class="text-5xl font-black text-gray-900">${{ plan.monthlyPrice }}</span>
            <span class="text-gray-400 font-bold">/mo</span>
          </div>
          <p class="text-sm italic text-gray-400 mb-6">billed yearly at <span class="font-bold text-gray-700">${{ plan.newYearlyPrice }}</span></p>

          <div class="space-y-4 border-t pt-8">
            <div v-for="f in plan.features" :key="f" class="flex items-center gap-3 text-gray-600 font-medium text-sm">
              <span class="text-green-500">✦</span> {{ f }}
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <h3 class="text-xl font-black mb-6">Order Summary</h3>
          <div class="space-y-3 mb-8">
            <div class="flex justify-between text-gray-500"><span>Annual Plan</span><span>${{ plan.newYearlyPrice }}.00</span></div>
            <div class="flex justify-between font-black text-xl border-t pt-4"><span>Total Due</span><span>${{ plan.newYearlyPrice }}.00</span></div>
            <div class="flex justify-between font-black text-green-600 pt-2 text-lg"><span>Due Today</span><span>$0.00</span></div>
          </div>

          <form @submit.prevent="handleCheckout" class="space-y-6">
            <div class="space-y-4">
              <label class="block text-xs font-black uppercase tracking-widest text-gray-400">Card Details</label>
              <div class="grid grid-cols-4 gap-4">
                <input v-model="formData.cardNumber" placeholder="Card Number" class="col-span-2 p-4 border rounded-xl bg-gray-50 outline-none focus:border-orange-400">
                <input v-model="formData.expiry" placeholder="MM / YY" class="p-4 border rounded-xl bg-gray-50 outline-none focus:border-orange-400">
                <input v-model="formData.cvv" placeholder="CVV" class="p-4 border rounded-xl bg-gray-50 outline-none focus:border-orange-400">
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
              <input v-model="formData.fullName" class="w-full p-4 border rounded-xl bg-gray-50">
            </div>

            <div class="flex gap-4 items-start bg-blue-50 p-4 rounded-xl border border-blue-100">
              <input type="checkbox" v-model="formData.consent" class="mt-1 w-5 h-5 accent-orange-500">
              <p class="text-[11px] text-blue-800 leading-tight">
                I consent to the <b>Terms of Use</b>. After my 3-day trial, my account will be charged ${{ plan.newYearlyPrice }}.00 annually until I cancel.
              </p>
            </div>

            <button type="submit" class="w-full py-5 bg-[#ffb020] text-white font-black rounded-2xl shadow-lg hover:scale-[1.02] transition-transform uppercase">
              Start My Free Trial
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>