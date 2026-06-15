export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/ui'],

  compatibilityDate: '2026-04-02',

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost/api',
    },
  },

  app: {
    head: {
      script: [{ src: 'https://cdn.tailwindcss.com' }],
    },
  },

  devtools: { enabled: true },
});
