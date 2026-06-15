<template>
  <div class="p-6">
    <div class="flex gap-4 justify-between mb-4">
      <UInput
        v-model="search"
        placeholder="Пошук за заголовком або slug"
        @input="onSearch"
      />

      <USelect
        v-model="perPage"
        :items="perPageOptions"
        class="w-32"
        @change="changePerPage"
      />
    </div>

    <UTable
      :data="posts"
      :columns="columns"
      :loading="loading"
    >
      <template #user-cell="{ row }">
        {{ row.original.user?.name ?? '—' }}
      </template>

      <template #category-cell="{ row }">
        {{ row.original.category?.title ?? '—' }}
      </template>

      <template #title-cell="{ row }">
        <a
          :href="'/admin/blog/posts/' + row.original.id + '/edit'"
          class="text-blue-600 underline"
        >
          {{ row.original.title }}
        </a>
      </template>

      <template #published_at-cell="{ row }">
        {{ row.original.published_at ?? '—' }}
      </template>
    </UTable>

    <div class="flex justify-between items-center mt-4">
      <UButton
        :disabled="page <= 1"
        @click="changePage(page - 1)"
      >
        Назад
      </UButton>

      <div>
        Сторінка {{ page }} з {{ lastPage }}. Всього: {{ total }}
      </div>

      <UButton
        :disabled="page >= lastPage"
        @click="changePage(page + 1)"
      >
        Вперед
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
type Post = {
  id: number
  title: string
  slug: string
  published_at: string | null
  user?: {
    id: number
    name: string
  } | null
  category?: {
    id: number
    title: string
  } | null
}

type PostsResponse = {
  data: Post[]
  current_page: number
  per_page: number
  last_page: number
  total: number
}

const config = useRuntimeConfig()

const posts = ref<Post[]>([])
const page = ref(1)
const perPage = ref(10)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const sortBy = ref('id')
const sortDir = ref<'asc' | 'desc'>('desc')
const loading = ref(false)

const perPageOptions = [5, 10, 25, 50]

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
    accessorKey: 'published_at',
    header: 'Дата публікації',
  },
]

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const getPosts = async () => {
  loading.value = true

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
      }
    )

    posts.value = response.data
    page.value = response.current_page
    perPage.value = Number(response.per_page)
    lastPage.value = response.last_page
    total.value = response.total
  } catch (error) {
    console.error('Помилка завантаження постів:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (newPage: number) => {
  page.value = newPage
  getPosts()
}

const changePerPage = () => {
  page.value = 1
  getPosts()
}

const onSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    page.value = 1
    getPosts()
  }, 400)
}

onMounted(() => {
  getPosts()
})
</script>