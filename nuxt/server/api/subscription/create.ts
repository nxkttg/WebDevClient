export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Тут зазвичай логіка збереження в базу або оплати
  console.log('Отримано дані форми:', body);

  return {
    status: 'success',
    message: 'Підписка успішно створена!',
  };
});
