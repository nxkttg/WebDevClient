<template>
  <div class="min-h-screen bg-white font-sans text-gray-900">
    <nav
      class="bg-white border-b px-8 py-4 flex justify-center gap-12 sticky top-0 z-50"
    >
      <NuxtLink
        to="/"
        class="font-bold text-orange-500 border-b-2 border-orange-500 pb-1 uppercase tracking-wider text-sm"
        >Головна</NuxtLink
      >
      <NuxtLink
        to="/products"
        class="font-bold text-gray-400 hover:text-orange-500 transition uppercase tracking-wider text-sm"
        >Таблиця продуктів</NuxtLink
      >
    </nav>

    <main class="max-w-7xl mx-auto px-6 py-16">
      <div
        class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-left"
      >
        <div>
          <h1 class="text-4xl font-black text-gray-800 tracking-tight">
            Start Your 3 Day Free Trial
          </h1>
          <p class="text-gray-400 font-medium mt-2 text-lg">
            Оберіть свій ідеальний план для бізнесу
          </p>
        </div>

        <div class="flex items-center gap-4">
          <span
            class="text-green-500 text-xs font-bold flex items-center gap-1"
          >
            Save up to 20% ↑
          </span>
          <div
            class="bg-gray-100 p-1 rounded-lg flex border border-gray-200 shadow-sm"
          >
            <button
              class="bg-white px-6 py-2 rounded-md shadow-sm text-sm font-bold text-gray-800"
            >
              Annual
            </button>
            <button class="px-6 py-2 text-sm font-bold text-gray-400">
              Monthly
            </button>
          </div>
        </div>
      </div>

      <PricingPlans />
    </main>
  </div>
</template>
