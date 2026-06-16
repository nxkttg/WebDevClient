```vue
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
  >
    <div class="mx-auto max-w-4xl px-6 py-10">
      <div class="mb-8">
        <NuxtLink
          to="/BlogPostsUi"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          ← Назад до постів
        </NuxtLink>
      </div>

      <div class="mb-6">
        <p
          class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600"
        >
          Blog Admin
        </p>

        <h1 class="text-4xl font-bold tracking-tight text-slate-950">
          Редагування поста
        </h1>

        <p class="mt-3 text-base text-slate-500">
          Онови заголовок, категорію, текст або статус публікації.
        </p>
      </div>

      <UCard class="shadow-sm">
        <div v-if="pageLoading" class="py-10 text-center text-slate-500">
          Завантаження поста...
        </div>

        <UForm
          v-else
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <UFormGroup label="Заголовок" name="title" required>
            <UInput
              v-model="state.title"
              placeholder="Наприклад: Мій перший пост про Laravel"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Slug" name="slug" hint="Можна залишити порожнім">
            <UInput
              v-model="state.slug"
              placeholder="miy-pershyi-post-pro-laravel"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Категорія" name="category_id" required>
            <select
              v-model="state.category_id"
              class="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option
                v-for="category in categoryOptions"
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </UFormGroup>

          <UFormGroup label="Короткий опис" name="excerpt" hint="Необовʼязково">
            <UTextarea
              v-model="state.excerpt"
              placeholder="Короткий опис статті"
              :rows="3"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Текст статті" name="content_raw" required>
            <UTextarea
              v-model="state.content_raw"
              placeholder="Основний текст статті"
              :rows="10"
              size="lg"
            />
          </UFormGroup>

          <div
            class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <label class="flex cursor-pointer items-center gap-3">
              <input
                v-model="state.is_published"
                type="checkbox"
                class="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <span>
                <span class="block text-sm font-medium text-slate-900">
                  Опублікувати пост
                </span>

                <span class="block text-sm text-slate-500">
                  Якщо увімкнено, пост буде позначений як опублікований.
                </span>
              </span>
            </label>
          </div>

          <div
            v-if="errorMessage"
            class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ errorMessage }}
          </div>

          <div
            class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end"
          >
            <NuxtLink
              to="/BlogPostsUi"
              class="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Скасувати
            </NuxtLink>

            <UButton
              type="submit"
              size="lg"
              icon="i-heroicons-check"
              :loading="loading"
            >
              Зберегти зміни
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

type Category = {
  id: number;
  title: string;
  slug: string | null;
  parent_id: number;
};

type CategoriesResponse = {
  data: Category[];
};

type Post = {
  id: number;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content_raw: string;
  is_published: boolean;
  category_id: number;
};

type PostResponse = {
  data: Post;
};

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const postId = String(route.params.id);

const pageLoading = ref(true);
const loading = ref(false);
const errorMessage = ref('');

const state = reactive({
  title: '',
  slug: '',
  category_id: '1',
  excerpt: '',
  content_raw: '',
  is_published: false,
});

const schema = z.object({
  title: z
    .string()
    .min(5, 'Заголовок має містити мінімум 5 символів')
    .max(200, 'Заголовок має містити максимум 200 символів'),

  slug: z
    .string()
    .max(200, 'Slug має містити максимум 200 символів')
    .optional()
    .or(z.literal('')),

  category_id: z.string().min(1, 'Оберіть категорію'),

  excerpt: z
    .string()
    .max(500, 'Короткий опис має містити максимум 500 символів')
    .optional()
    .or(z.literal('')),

  content_raw: z
    .string()
    .min(5, 'Текст статті має містити мінімум 5 символів')
    .max(10000, 'Текст статті має містити максимум 10000 символів'),

  is_published: z.boolean(),
});

const categoryOptions = ref([
  {
    label: '1. Корінь',
    value: '1',
  },
]);

const getCategories = async () => {
  try {
    const response = await $fetch<CategoriesResponse>(
      `${config.public.apiBase}/admin/blog/categories`,
      {
        query: {
          page: 1,
          per_page: 100,
        },
      },
    );

    if (response.data.length > 0) {
      categoryOptions.value = response.data.map((category) => ({
        label: `${category.id}. ${category.title}`,
        value: String(category.id),
      }));
    }
  } catch (error) {
    console.error('Помилка завантаження категорій:', error);
  }
};

const getPost = async () => {
  pageLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await $fetch<PostResponse>(
      `${config.public.apiBase}/admin/blog/posts/${postId}`,
    );

    state.title = response.data.title;
    state.slug = response.data.slug ?? '';
    state.category_id = String(response.data.category_id);
    state.excerpt = response.data.excerpt ?? '';
    state.content_raw = response.data.content_raw ?? '';
    state.is_published = Boolean(response.data.is_published);
  } catch (error) {
    console.error('Помилка завантаження поста:', error);
    errorMessage.value = 'Не вдалося завантажити пост.';
  } finally {
    pageLoading.value = false;
  }
};

const onSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    await $fetch(`${config.public.apiBase}/admin/blog/posts/${postId}`, {
      method: 'PUT',
      body: {
        title: state.title,
        slug: state.slug || null,
        category_id: Number(state.category_id),
        excerpt: state.excerpt || null,
        content_raw: state.content_raw,
        is_published: state.is_published,
      },
    });

    await router.push('/BlogPostsUi');
  } catch (error) {
    console.error('Помилка редагування поста:', error);
    errorMessage.value = 'Не вдалося зберегти зміни. Перевір дані у формі.';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getCategories();
  await getPost();
});
</script>
```
