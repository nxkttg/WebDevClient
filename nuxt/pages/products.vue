<script setup>
import { storeToRefs } from 'pinia'

// 1. Завантаження даних продуктів
const { data: products } = await useFetch('/api/products')

// 2. ПІДКЛЮЧЕННЯ PINIA STORE (як вимагає завдання)
const subStore = useSubscriptionStore()
const { selectedPlan } = storeToRefs(subStore)

// 3. Стан для пошуку та пагінації
const q = ref('')
const page = ref(1)
const perPage = 5

// 4. Фільтрація списку за пошуковим запитом
const filtered = computed(() => {
  if (!products.value) return []
  return products.value.filter(p =>
    p.title.toLowerCase().includes(q.value.toLowerCase())
  )
})

// 5. Розрахунок рядків для поточної сторінки
const rows = computed(() => {
  const start = (page.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

// 6. Загальна кількість сторінок
const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))

// Скидаємо сторінку на першу при пошуку
watch(q, () => {
  page.value = 1
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8 text-left font-sans text-gray-900">
    <div class="max-w-7xl mx-auto">

      <div class="flex justify-between items-center mb-8">
        <NuxtLink to="/" class="text-orange-500 font-bold hover:underline italic flex items-center gap-2">
          <span>←</span> Назад на головну
        </NuxtLink>

        <div v-if="selectedPlan" class="bg-orange-100 text-orange-700 px-6 py-2 rounded-full text-sm font-black border border-orange-200 shadow-sm animate-pulse">
          АКТИВНИЙ ВИБІР: {{ selectedPlan.name }} — ${{ selectedPlan.price }}/міс
        </div>
        <div v-else class="text-gray-400 text-sm italic">
          План ще не обрано
        </div>
      </div>

      <div class="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">

        <div class="p-8 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div>
            <h2 class="text-2xl font-black italic uppercase tracking-tight text-gray-800">Product Database</h2>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage and view your inventory</p>
          </div>
          <div class="relative">
            <input
              v-model="q"
              type="text"
              placeholder="Search products..."
              class="border-2 border-gray-200 rounded-full px-6 py-3 outline-none focus:border-orange-400 shadow-sm w-80 transition-all"
            />
            <span class="absolute right-5 top-3.5 text-gray-300">🔍</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
            <tr class="bg-gray-50 text-gray-400 text-[11px] font-black uppercase italic border-b">
              <th class="p-6 text-left">Preview</th>
              <th class="p-6 text-left">Product Title</th>
              <th class="p-6 text-left">Price</th>
              <th class="p-6 text-center">Rating</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
            <tr v-for="p in rows" :key="p.id" class="hover:bg-orange-50/30 transition-colors group">
              <td class="p-6">
                <img :src="p.thumbnail" class="w-20 h-20 object-cover rounded-2xl shadow-md border-2 border-white group-hover:scale-110 transition-transform" />
              </td>
              <td class="p-6">
                <div class="font-black text-lg text-gray-800">{{ p.title }}</div>
                <div class="text-xs text-gray-400 uppercase font-bold tracking-tighter">{{ p.brand || 'General' }}</div>
              </td>
              <td class="p-6">
                <span class="font-black text-xl text-orange-600">${{ p.price }}</span>
              </td>
              <td class="p-6 text-center">
                  <span :class="[
                    'px-4 py-1.5 rounded-full font-black text-xs shadow-sm',
                    p.rating < 4.5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                  ]">
                    ★ {{ p.rating }}
                  </span>
              </td>
            </tr>
            <tr v-if="rows.length === 0">
              <td colspan="4" class="p-20 text-center text-gray-400 italic">
                No products found matching your search...
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="p-8 bg-gray-50/50 flex justify-center items-center gap-3 border-t">
          <button
            v-for="n in totalPages"
            :key="n"
            @click="page = n"
            :class="[
              'w-12 h-12 rounded-2xl font-black transition-all transform',
              n === page
                ? 'bg-orange-500 text-white shadow-lg scale-110'
                : 'bg-white text-gray-400 hover:bg-orange-100 hover:text-orange-500 border border-gray-200'
            ]"
          >
            {{ n }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Додаткові стилі для плавності */
.transition-all {
  transition: all 0.3s ease;
}
</style>