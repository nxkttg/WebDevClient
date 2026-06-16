```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <div class="mx-auto max-w-3xl px-6 py-10">
      <div class="mb-8">
        <NuxtLink
          to="/admin/blog/categories"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          ← Назад до категорій
        </NuxtLink>
      </div>

      <div class="mb-6">
        <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Blog Admin
        </p>

        <h1 class="text-4xl font-bold tracking-tight text-slate-950">
          Створення категорії
        </h1>

        <p class="mt-3 text-base text-slate-500">
          Додай нову категорію для статей блогу. Назва обовʼязкова, slug можна залишити порожнім.
        </p>
      </div>

      <UCard class="shadow-sm">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <UFormGroup
            label="Назва категорії"
            name="title"
            required
          >
            <UInput
              v-model="state.title"
              placeholder="Наприклад: Новини Laravel"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup
            label="Slug"
            name="slug"
            hint="Можна залишити порожнім"
          >
            <UInput
              v-model="state.slug"
              placeholder="novyny-laravel"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup
            label="Батьківська категорія"
            name="parent_id"
            required
          >
            <select
              v-model="state.parent_id"
              class="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option
                v-for="category in parentCategoryOptions"
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </UFormGroup>

          <UFormGroup
            label="Опис"
            name="description"
            hint="Необовʼязково"
          >
            <UTextarea
              v-model="state.description"
              placeholder="Короткий опис категорії"
              :rows="5"
              size="lg"
            />
          </UFormGroup>

          <div
            v-if="errorMessage"
            class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ errorMessage }}
          </div>

          <div class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <NuxtLink
              to="/admin/blog/categories"
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
              Зберегти категорію
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

type Category = {
  id: number
  title: string
  slug: string | null
  parent_id: number
  parent_title?: string | null
}

type CategoriesResponse = {
  data: Category[]
}

const config = useRuntimeConfig()
const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')

const state = reactive({
  title: '',
  slug: '',
  parent_id: '1',
  description: '',
})

const schema = z.object({
  title: z
    .string()
    .min(5, 'Назва має містити мінімум 5 символів')
    .max(200, 'Назва має містити максимум 200 символів'),

  slug: z
    .string()
    .max(200, 'Slug має містити максимум 200 символів')
    .optional()
    .or(z.literal('')),

  parent_id: z
    .string()
    .min(1, 'Оберіть батьківську категорію'),

  description: z
    .string()
    .max(500, 'Опис має містити максимум 500 символів')
    .optional()
    .or(z.literal('')),
})

const parentCategoryOptions = ref([
  {
    label: '1. Корінь',
    value: '1',
  },
])

const getParentCategories = async () => {
  try {
    const response = await $fetch<CategoriesResponse>(
      `${config.public.apiBase}/admin/blog/categories`,
      {
        query: {
          page: 1,
          per_page: 100,
        },
      }
    )

    if (response.data.length > 0) {
      parentCategoryOptions.value = response.data.map((category) => ({
        label: `${category.id}. ${category.title}`,
        value: String(category.id),
      }))

      state.parent_id = String(response.data[0].id)
    }
  } catch (error) {
    console.error('Помилка завантаження категорій:', error)
  }
}

const onSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await $fetch(`${config.public.apiBase}/admin/blog/categories`, {
      method: 'POST',
      body: {
        title: state.title,
        slug: state.slug || null,
        parent_id: Number(state.parent_id),
        description: state.description || null,
      },
    })

    await router.push('/admin/blog/categories')
  } catch (error) {
    console.error('Помилка створення категорії:', error)
    errorMessage.value = 'Не вдалося створити категорію. Перевір дані у формі.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getParentCategories()
})
</script>
```
