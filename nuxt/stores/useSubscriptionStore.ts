import { defineStore } from 'pinia';

export const useSubscriptionStore = defineStore('subscription', () => {
  // 1. Стан (State): тут ми зберігаємо об'єкт плану
  // Використовуємо ref() для створення реактивного стану
  const selectedPlan = ref(null);

  // 2. Дія (Action): функція для зміни вибраного плану
  function selectPlan(plan: any) {
    selectedPlan.value = plan;
  }

  // 3. Очищення (Action): корисно після завершення оплати
  function clearPlan() {
    selectedPlan.value = null;
  }

  // Повертаємо все, що хочемо використовувати в компонентах
  return {
    selectedPlan,
    selectPlan,
    clearPlan,
  };
});
