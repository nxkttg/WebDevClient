export default defineNuxtConfig({
  // Додаємо дату сумісності, щоб прибрати WARN у терміналі
  compatibilityDate: '2026-04-02',
  app: {
    head: {
      script: [
        // Підключаємо Tailwind через CDN, щоб стилі працювали 100%
        { src: 'https://cdn.tailwindcss.com' },
      ],
    },
  },
  devtools: { enabled: true },
});
