<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-7xl px-6 py-8">
      <div
        class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            Категорії блогу
          </h1>

          <p class="mt-2 text-sm text-slate-500">
            Перегляд, пошук, створення, редагування та видалення категорій.
          </p>
        </div>

        <UButton
          to="/admin/blog/categories/create"
          icon="i-heroicons-plus"
          size="lg"
        >
          Створити категорію
        </UButton>
      </div>

      <UCard>
        <div class="mb-6 grid gap-4 md:grid-cols-[1fr_180px]">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Пошук за назвою або slug"
            size="lg"
            @input="onSearch"
          />

          <USelect
            v-model="perPage"
            :items="perPageOptions"
            size="lg"
            @change="changePerPage"
          />
        </div>

        <UTable
          :data="categories"
          :columns="columns"
          :loading="loading"
          class="rounded-lg"
        >
          <template #parent_title-cell="{ row }">
            <span class="text-slate-600">
              {{ row.original.parent_title ?? '—' }}
            </span>
          </template>

          <template #actions-cell="{ row }">
            <UDropdownMenu :items="getActionItems(row.original)">
              <UButton
                icon="i-heroicons-ellipsis-vertical"
                color="neutral"
                variant="ghost"
                aria-label="Дії"
              />
            </UDropdownMenu>
          </template>
        </UTable>

        <div
          class="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="text-sm text-slate-500">
            Всього категорій: <strong>{{ total }}</strong>
          </div>

          <div class="flex items-center gap-3">
            <UButton
              color="neutral"
              variant="soft"
              :disabled="page <= 1"
              @click="changePage(page - 1)"
            >
              Назад
            </UButton>

            <span class="text-sm text-slate-600">
              Сторінка {{ page }} з {{ lastPage }}
            </span>

            <UButton
              color="neutral"
              variant="soft"
              :disabled="page >= lastPage"
              @click="changePage(page + 1)"
            >
              Вперед
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
type Category = {
  id: number;
  title: string;
  slug: string | null;
  parent_id: number;
  parent_title?: string | null;
};

type CategoriesResponse = {
  data: Category[];
  meta: {
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
  };
};

const config = useRuntimeConfig();
const router = useRouter();

const categories = ref<Category[]>([]);
const loading = ref(false);

const page = ref(1);
const perPage = ref(10);
const lastPage = ref(1);
const total = ref(0);
const search = ref('');

const perPageOptions = [
  { label: '5 на сторінці', value: 5 },
  { label: '10 на сторінці', value: 10 },
  { label: '25 на сторінці', value: 25 },
  { label: '50 на сторінці', value: 50 },
];

const columns = [
  {
    accessorKey: 'id',
    header: '#',
  },
  {
    accessorKey: 'title',
    header: 'Назва',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'parent_title',
    header: 'Батьківська категорія',
  },
  {
    accessorKey: 'actions',
    header: 'Дії',
  },
];

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const getCategories = async () => {
  loading.value = true;

  try {
    const response = await $fetch<CategoriesResponse>(
      `${config.public.apiBase}/admin/blog/categories`,
      {
        query: {
          page: page.value,
          per_page: perPage.value,
          search: search.value,
        },
      },
    );

    categories.value = response.data;
    page.value = response.meta.current_page;
    perPage.value = Number(response.meta.per_page);
    lastPage.value = response.meta.last_page;
    total.value = response.meta.total;
  } catch (error) {
    console.error('Помилка завантаження категорій:', error);
    alert('Не вдалося завантажити категорії');
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage: number) => {
  page.value = newPage;
  getCategories();
};

const changePerPage = () => {
  page.value = 1;
  getCategories();
};

const onSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    page.value = 1;
    getCategories();
  }, 400);
};

const deleteCategory = async (category: Category) => {
  const confirmed = confirm(`Видалити категорію "${category.title}"?`);

  if (!confirmed) {
    return;
  }

  try {
    await $fetch(
      `${config.public.apiBase}/admin/blog/categories/${category.id}`,
      {
        method: 'DELETE',
      },
    );

    await getCategories();
  } catch (error) {
    console.error('Помилка видалення категорії:', error);
    alert('Не вдалося видалити категорію');
  }
};

const getActionItems = (category: Category) => {
  return [
    [
      {
        label: 'Редагувати',
        icon: 'i-heroicons-pencil-square',
        onSelect: () => {
          router.push(`/admin/blog/categories/${category.id}/edit`);
        },
      },
      {
        label: 'Видалити',
        icon: 'i-heroicons-trash',
        color: 'error',
        onSelect: () => {
          deleteCategory(category);
        },
      },
    ],
  ];
};

onMounted(() => {
  getCategories();
});
</script>
