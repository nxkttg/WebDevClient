// Завдання 1: Змінні та математичні операції
const a = 10;
const b = 5;

console.log("Сума:", a + b);
console.log("Різниця:", a - b);
console.log("Множення:", a * b);
console.log("Ділення:", a / b);

// Завдання 2: Робота з рядками
const firstName = "Марія";
const lastName = "Ковальчук";
const fullName = firstName + " " + lastName;

console.log(`Привіт, ${fullName}!`);

// Завдання 3: Умовний оператор (if/else)
let age = 20;

if (age >= 18) {
  console.log("Доступ дозволено");
} else {
  console.log("Доступ заборонено");
}

// Завдання 4: Цикл for
console.log("Числа від 1 до 10:");
for (let i = 1; i <= 10; i++) {
  console.log(i);
}

// Завдання 5: Функції
function square(number) {
  return number * number;
}

const result = square(5);
console.log("Квадрат числа 5 дорівнює:", result);

// Завдання 6: Робота з масивами
const fruits = ["Яблуко", "Банан", "Апельсин"];
fruits.push("Ківі");

console.log("Список фруктів:", fruits);