<script setup lang="ts">
const { data: productsData } = await useFetch<{ products: any[] }>(
  'https://dummyjson.com/products?limit=100',
);
const products = computed(() => productsData.value?.products || []);

const search = ref('');
const page = ref(1);
const itemsPerPage = ref(5);
const sortCol = ref('id');
const sortDir = ref<'asc' | 'desc'>('asc');

const sortBy = (col: string) => {
  if (sortCol.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortCol.value = col;
    sortDir.value = 'asc';
  }
};

const filteredRows = computed(() => {
  if (!search.value) return products.value;
  const q = search.value.toLowerCase();
  return products.value.filter(
    (p: any) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q),
  );
});

const sortedRows = computed(() => {
  return [...filteredRows.value].sort((a: any, b: any) => {
    let aVal = a[sortCol.value];
    let bVal = b[sortCol.value];
    const modifier = sortDir.value === 'asc' ? 1 : -1;
    return aVal > bVal ? modifier : -modifier;
  });
});

const totalPages = computed(() =>
  Math.ceil(sortedRows.value.length / itemsPerPage.value),
);
const paginatedRows = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return sortedRows.value.slice(start, start + itemsPerPage.value);
});

watch(search, () => (page.value = 1));
</script>

<template>
  <section class="max-w-7xl mx-auto pb-20 text-left">
    <h2 class="text-[28px] font-bold text-gray-800 tracking-tight mb-6">
      Таблиця продуктів
    </h2>

    <div class="flex justify-between items-center mb-4">
      <div
        class="text-xs font-bold text-gray-400 uppercase tracking-widest italic"
      >
        Показано {{ paginatedRows.length }} з
        {{ filteredRows.length }} результатів
      </div>
      <input
        v-model="search"
        type="text"
        placeholder="Пошук..."
        class="border border-gray-200 rounded-lg px-4 py-1.5 text-sm outline-none focus:border-emerald-500 shadow-sm"
      />
    </div>

    <div
      class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead
            class="bg-gray-50 border-b text-gray-400 uppercase text-[11px] font-bold tracking-widest italic"
          >
            <tr>
              <th
                @click="sortBy('id')"
                class="p-4 cursor-pointer hover:text-emerald-500"
              >
                #
              </th>
              <th class="p-4">Фото</th>
              <th
                @click="sortBy('title')"
                class="p-4 cursor-pointer hover:text-emerald-500"
              >
                Назва
              </th>
              <th class="p-4">Опис</th>
              <th
                @click="sortBy('brand')"
                class="p-4 cursor-pointer hover:text-emerald-500"
              >
                Бренд
              </th>
              <th
                @click="sortBy('category')"
                class="p-4 cursor-pointer hover:text-emerald-500"
              >
                Категорія
              </th>
              <th
                @click="sortBy('price')"
                class="p-4 text-right cursor-pointer hover:text-emerald-500"
              >
                Ціна
              </th>
              <th
                @click="sortBy('rating')"
                class="p-4 text-center cursor-pointer hover:text-emerald-500"
              >
                Оцінка
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="product in paginatedRows"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="p-4 text-gray-300 italic">{{ product.id }}</td>
              <td class="p-4">
                <img
                  :src="product.thumbnail"
                  class="w-[100px] h-[100px] object-cover rounded-xl border border-gray-100 shadow-sm"
                />
              </td>
              <td class="p-4 font-bold text-gray-900">{{ product.title }}</td>
              <td class="p-4">
                <p class="text-xs text-gray-500 line-clamp-2 max-w-[200px]">
                  {{ product.description }}
                </p>
              </td>
              <td class="p-4 text-gray-500">{{ product.brand || 'N/A' }}</td>
              <td class="p-4 text-gray-400 font-bold text-[10px] uppercase">
                {{ product.category }}
              </td>
              <td class="p-4 text-right font-black text-gray-900 text-base">
                ${{ product.price }}
              </td>
              <td class="p-4 text-center">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-lg font-black text-[12px]',
                    product.rating < 4.5
                      ? 'text-red-500 bg-red-50'
                      : 'text-emerald-500 bg-emerald-50',
                  ]"
                >
                  ★ {{ product.rating }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-6 bg-gray-50 border-t flex justify-center gap-2">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="page = p"
          :class="[
            'w-9 h-9 rounded-full font-black flex items-center justify-center transition-all',
            p === page
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'text-gray-400 hover:bg-gray-200',
          ]"
        >
          {{ p }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
