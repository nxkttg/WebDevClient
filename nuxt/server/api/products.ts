export default defineEventHandler(async () => {
  try {
    const response: any = await $fetch(
      'https://dummyjson.com/products?limit=100',
    );
    return response.products;
  } catch (e) {
    return [];
  }
});
