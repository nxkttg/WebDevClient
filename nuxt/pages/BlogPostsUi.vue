```vue
<template>
  <div class="min-h-screen bg-[#f6f7fb]">
    <div class="mx-auto max-w-7xl px-6 py-8">
      <div
        class="mb-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
      >
        <div
          class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div
              class="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
            >
              Blog Management
            </div>

            <h1 class="text-4xl font-bold tracking-tight text-slate-950">
              Статті блогу
            </h1>

            <p class="mt-3 max-w-2xl text-base text-slate-500">
              Керування статтями: перегляд, пошук, створення, редагування та
              видалення постів.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/admin/blog/categories"
              class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Категорії
            </NuxtLink>

            <NuxtLink
              to="/admin/blog/posts/create"
              class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Створити пост
            </NuxtLink>
          </div>
        </div>

        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <div class="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p class="text-sm font-medium text-slate-500">Всього постів</p>
            <p class="mt-2 text-3xl font-bold text-slate-950">
              {{ total }}
            </p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p class="text-sm font-medium text-slate-500">Поточна сторінка</p>
            <p class="mt-2 text-3xl font-bold text-slate-950">
              {{ page }} / {{ lastPage }}
            </p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p class="text-sm font-medium text-slate-500">На сторінці</p>
            <p class="mt-2 text-3xl font-bold text-slate-950">
              {{ perPage }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div class="border-b border-slate-200 p-6">
          <div class="grid gap-4 md:grid-cols-[1fr_190px]">
            <div class="relative">
              <span
                class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                🔍
              </span>

              <input
                v-model="search"
                type="text"
                placeholder="Пошук за заголовком або slug"
                class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                @input="onSearch"
              />
            </div>

            <select
              v-model="perPage"
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              @change="changePerPage"
            >
              <option :value="5">5 на сторінці</option>
              <option :value="10">10 на сторінці</option>
              <option :value="25">25 на сторінці</option>
              <option :value="50">50 на сторінці</option>
            </select>
          </div>
        </div>

        <div class="overflow-hidden">
          <UTable :data="posts" :columns="columns" :loading="loading">
            <template #id-cell="{ row }">
              <span class="font-semibold text-slate-500">
                #{{ row.original.id }}
              </span>
            </template>

            <template #user-cell="{ row }">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600"
                >
                  {{ getInitial(row.original.user?.name) }}
                </div>

                <span class="text-sm font-medium text-slate-700">
                  {{ row.original.user?.name ?? '—' }}
                </span>
              </div>
            </template>

            <template #category-cell="{ row }">
              <span
                class="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
              >
                {{ row.original.category?.title ?? 'Без категорії' }}
              </span>
            </template>

            <template #title-cell="{ row }">
              <div class="max-w-xl">
                <NuxtLink
                  :to="'/admin/blog/posts/' + row.original.id"
                  class="text-sm font-bold text-slate-950 transition hover:text-blue-600"
                >
                  {{ row.original.title }}
                </NuxtLink>

                <p class="mt-1 truncate text-xs text-slate-400">
                  {{ row.original.slug }}
                </p>
              </div>
            </template>

            <template #date_published-cell="{ row }">
              <span
                v-if="row.original.date_published"
                class="text-sm text-slate-600"
              >
                {{ row.original.date_published }}
              </span>

              <span
                v-else
                class="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
              >
                Чернетка
              </span>
            </template>

            <template #actions-cell="{ row }">
              <div class="flex justify-end">
                <UDropdownMenu :items="getActionItems(row.original)">
                  <button
                    class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    type="button"
                  >
                    ⋯
                  </button>
                </UDropdownMenu>
              </div>
            </template>
          </UTable>
        </div>

        <div
          v-if="posts.length === 0 && !loading"
          class="border-t border-slate-200 px-6 py-12 text-center"
        >
          <p class="text-base font-semibold text-slate-800">
            Постів не знайдено
          </p>

          <p class="mt-2 text-sm text-slate-500">
            Спробуй змінити пошук або створи новий пост.
          </p>
        </div>

        <div
          class="flex flex-col gap-4 border-t border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-sm text-slate-500">
            Показано сторінку <strong>{{ page }}</strong> з
            <strong>{{ lastPage }}</strong
            >, всього записів: <strong>{{ total }}</strong>
          </p>

          <div class="flex items-center gap-3">
            <button
              class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="page <= 1"
              @click="changePage(page - 1)"
            >
              Назад
            </button>

            <button
              class="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="page >= lastPage"
              @click="changePage(page + 1)"
            >
              Вперед
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Post = {
  id: number;
  title: string;
  slug: string;
  date_published: string | null;
  user?: {
    id: number;
    name: string;
  } | null;
  category?: {
    id: number;
    title: string;
  } | null;
};

type PostsResponse = {
  data: Post[];
  meta: {
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
  };
};

const config = useRuntimeConfig();
const router = useRouter();

const posts = ref<Post[]>([]);
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(1);
const total = ref(0);
const search = ref('');
const sortBy = ref('id');
const sortDir = ref<'asc' | 'desc'>('desc');
const loading = ref(false);

const columns = [
  {
    accessorKey: 'id',
    header: '#',
  },
  {
    accessorKey: 'user',
    header: 'Автор',
  },
  {
    accessorKey: 'category',
    header: 'Категорія',
  },
  {
    accessorKey: 'title',
    header: 'Заголовок',
  },
  {
    accessorKey: 'date_published',
    header: 'Публікація',
  },
  {
    accessorKey: 'actions',
    header: 'Дії',
  },
];

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const getInitial = (name?: string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

const getPosts = async () => {
  loading.value = true;

  try {
    const response = await $fetch<PostsResponse>(
      `${config.public.apiBase}/admin/blog/posts`,
      {
        query: {
          page: page.value,
          per_page: perPage.value,
          search: search.value,
          sort_by: sortBy.value,
          sort_dir: sortDir.value,
        },
      },
    );

    posts.value = response.data;
    page.value = response.meta.current_page;
    perPage.value = Number(response.meta.per_page);
    lastPage.value = response.meta.last_page;
    total.value = response.meta.total;
  } catch (error) {
    console.error('Помилка завантаження постів:', error);
    alert('Не вдалося завантажити пости');
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage: number) => {
  page.value = newPage;
  getPosts();
};

const changePerPage = () => {
  page.value = 1;
  getPosts();
};

const onSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    page.value = 1;
    getPosts();
  }, 400);
};

const deletePost = async (post: Post) => {
  const confirmed = confirm(`Видалити пост "${post.title}"?`);

  if (!confirmed) {
    return;
  }

  try {
    await $fetch(`${config.public.apiBase}/admin/blog/posts/${post.id}`, {
      method: 'DELETE',
    });

    await getPosts();
  } catch (error) {
    console.error('Помилка видалення поста:', error);
    alert('Не вдалося видалити пост');
  }
};

const getActionItems = (post: Post) => {
  return [
    [
      {
        label: 'Переглянути',
        icon: 'i-heroicons-eye',
        onSelect: () => {
          router.push(`/admin/blog/posts/${post.id}`);
        },
      },
      {
        label: 'Редагувати',
        icon: 'i-heroicons-pencil-square',
        onSelect: () => {
          router.push(`/admin/blog/posts/${post.id}/edit`);
        },
      },
      {
        label: 'Видалити',
        icon: 'i-heroicons-trash',
        color: 'error',
        onSelect: () => {
          deletePost(post);
        },
      },
    ],
  ];
};

onMounted(() => {
  getPosts();
});
</script>
```
