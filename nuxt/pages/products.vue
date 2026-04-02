<script setup>
const { data: products } = await useFetch('/api/products');
const q = ref('');
const page = ref(1);
const perPage = 5;

const filtered = computed(() => {
  if (!products.value) return [];
  return products.value.filter((p) =>
    p.title.toLowerCase().includes(q.value.toLowerCase()),
  );
});

const rows = computed(() => {
  const start = (page.value - 1) * perPage;
  return filtered.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage));
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8 text-gray-900 text-left">
    <div class="max-w-7xl mx-auto">
      <NuxtLink
        to="/"
        class="text-orange-500 font-bold mb-6 inline-block hover:underline italic"
      >
        ← Назад на головну
      </NuxtLink>

      <div
        class="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div
          class="p-8 border-b flex justify-between items-center bg-gray-50/50"
        >
          <h2 class="text-2xl font-black italic uppercase tracking-tight">
            Product Database
          </h2>
          <input
            v-model="q"
            type="text"
            placeholder="Search..."
            class="border-2 border-gray-200 rounded-full px-6 py-2 outline-none focus:border-orange-400 shadow-sm w-64"
          />
        </div>

        <table class="w-full">
          <thead>
            <tr
              class="bg-gray-50 text-gray-400 text-[11px] font-black uppercase italic border-b"
            >
              <th class="p-6 text-left">Фото</th>
              <th class="p-6 text-left">Назва</th>
              <th class="p-6 text-left">Ціна</th>
              <th class="p-6 text-center">Оцінка</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="p in rows"
              :key="p.id"
              class="hover:bg-orange-50/30 transition"
            >
              <td class="p-6">
                <img
                  :src="p.thumbnail"
                  class="w-20 h-20 object-cover rounded-xl shadow-sm border border-white"
                />
              </td>
              <td class="p-6 font-black text-lg">{{ p.title }}</td>
              <td class="p-6 font-black text-xl text-orange-600">
                ${{ p.price }}
              </td>
              <td class="p-6 text-center">
                <span
                  :class="[
                    'px-4 py-1.5 rounded-full font-black text-xs',
                    p.rating < 4.5
                      ? 'bg-red-50 text-red-500'
                      : 'bg-green-50 text-green-500',
                  ]"
                >
                  ★ {{ p.rating }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="p-6 bg-gray-50/50 flex justify-center gap-2 border-t">
          <button
            v-for="n in totalPages"
            :key="n"
            @click="page = n"
            :class="[
              'w-10 h-10 rounded-full font-black',
              n === page
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-200',
            ]"
          >
            {{ n }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
