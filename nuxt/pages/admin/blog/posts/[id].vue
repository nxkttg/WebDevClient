<template>
  <div class="container mx-auto p-6">
    <NuxtLink to="/BlogPosts" class="text-blue-600 underline mb-4 inline-block">
      ← Назад до списку
    </NuxtLink>

    <div v-if="loading" class="p-4">Завантаження...</div>

    <div v-else-if="errorMessage" class="p-4 text-red-600">
      {{ errorMessage }}
    </div>

    <article v-else-if="post" class="border rounded p-6">
      <h1 class="text-3xl font-bold mb-4">
        {{ post.title }}
      </h1>

      <div class="text-sm text-gray-600 mb-4">
        <div>
          <strong>Автор:</strong>
          {{ post.user?.name ?? '—' }}
        </div>

        <div>
          <strong>Категорія:</strong>
          {{ post.category?.title ?? '—' }}
        </div>

        <div>
          <strong>Дата публікації:</strong>
          {{ post.published_at ?? '—' }}
        </div>

        <div>
          <strong>Slug:</strong>
          {{ post.slug }}
        </div>
      </div>

      <div v-if="post.excerpt" class="mb-4 italic text-gray-700">
        {{ post.excerpt }}
      </div>

      <div class="prose max-w-none whitespace-pre-line">
        {{ post.content_raw }}
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content_raw: string;
  content_html: string;
  is_published: boolean | number;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  user?: {
    id: number;
    name: string;
  } | null;
  category?: {
    id: number;
    title: string;
  } | null;
};

type PostResponse = {
  success: boolean;
  data: Post;
  message?: string;
};

const route = useRoute();
const config = useRuntimeConfig();

const post = ref<Post | null>(null);
const loading = ref(true);
const errorMessage = ref('');

const getPost = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await $fetch<PostResponse>(
      `${config.public.apiBase}/blog/posts/${route.params.id}`,
    );

    post.value = response.data;
  } catch (error) {
    console.error('Помилка завантаження поста:', error);
    errorMessage.value = 'Не вдалося завантажити пост';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getPost();
});
</script>
