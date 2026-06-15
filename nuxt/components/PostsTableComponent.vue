<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-center">
      <div class="w-full">
        <nav class="bg-gray-100 mb-4 p-4 rounded">
          <a href="/admin/blog/posts/create" class="text-blue-600 underline">
            Додати
          </a>
        </nav>

        <div class="mb-4">
          <input
            v-model="search"
            type="text"
            placeholder="Пошук за заголовком або slug"
            class="border p-2 w-full rounded"
            @input="onSearch"
          />
        </div>

        <div class="mb-4">
          <label>
            Кількість на сторінці:
            <select
              v-model="perPage"
              class="border p-2 rounded"
              @change="changePerPage"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </label>
        </div>

        <div class="border rounded">
          <table class="table-auto w-full border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-2 cursor-pointer" @click="changeSort('id')">
                  #
                </th>
                <th class="border p-2">Автор</th>
                <th class="border p-2">Категорія</th>
                <th
                  class="border p-2 cursor-pointer"
                  @click="changeSort('title')"
                >
                  Заголовок
                </th>
                <th
                  class="border p-2 cursor-pointer"
                  @click="changeSort('published_at')"
                >
                  Дата публікації
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="post in posts" :key="post.id">
                <td class="border p-2">{{ post.id }}</td>
                <td class="border p-2">{{ post.user?.name ?? '—' }}</td>
                <td class="border p-2">{{ post.category?.title ?? '—' }}</td>
                <td class="border p-2">
                  <NuxtLink
                    :to="'/admin/blog/posts/' + post.id"
                    class="text-blue-600 underline"
                  >
                    {{ post.title }}
                  </NuxtLink>
                </td>
                <td class="border p-2">{{ post.date_published ?? '—' }}</td>
              </tr>

              <tr v-if="posts.length === 0">
                <td colspan="5" class="border p-4 text-center">Даних немає</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex gap-2 items-center mt-4">
          <button
            class="border p-2 rounded disabled:opacity-50"
            :disabled="page <= 1"
            @click="changePage(page - 1)"
          >
            Назад
          </button>

          <span class="p-2"> Сторінка {{ page }} з {{ lastPage }} </span>

          <button
            class="border p-2 rounded disabled:opacity-50"
            :disabled="page >= lastPage"
            @click="changePage(page + 1)"
          >
            Вперед
          </button>
        </div>

        <div class="mt-2 text-sm text-gray-600">
          Всього записів: {{ total }}
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

const posts = ref<Post[]>([]);
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(1);
const total = ref(0);
const search = ref('');
const sortBy = ref('id');
const sortDir = ref<'asc' | 'desc'>('desc');
const loading = ref(false);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

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

const changeSort = (column: string) => {
  if (sortBy.value === column) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortDir.value = 'asc';
  }

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

onMounted(() => {
  getPosts();
});
</script>
