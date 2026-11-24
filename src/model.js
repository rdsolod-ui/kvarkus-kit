export const screens = [
  ["overview", "Обзор", "Обзор"],
  ["agenda", "Календарь", "Календарь"],
  ["customers", "Клиенты", "Клиенты"],
  ["deals", "Сделки", "Сделки"],
  ["billing", "Счета", "Счета"],
  ["settings", "Настройки", "Настройки"],
];
export const demoDate = "2026-11-24";
export const groups = ["Новые авто", "С пробегом", "Трейд-ин"];
export const teamRoles = [
  "Менеджер по продажам",
  "Специалист по трейд-ин",
  "Администратор",
  "Только просмотр",
];
export const statuses = {
  customers: ["Активен", "VIP", "Новый"],
  deals: ["Переговоры", "Бронь", "Выдан"],
  billing: ["Выставлен", "На согласовании", "Оплачен"],
};
export const periods = ["Ноябрь", "За 7 дней", "За 30 дней", "За 90 дней"];
const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});
export const money = (value) => currency.format(value);
export const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
export const percent = (value, total) =>
  total ? Math.min(100, Math.max(0, Math.round((value * 100) / total))) : 0;

// Fictional showroom records. Amounts describe this demo, not market quotations.
const leads = [
  ["Анна Лебедева", "Haval Jolion Elite", 2450000, 0],
  ["Павел Миронов", "Škoda Octavia A8", 2180000, 1],
  ["Дарья Соколова", "Geely Monjaro Flagship", 4290000, 2],
  ["Максим Власов", "LADA Vesta SW Cross", 1840000, 0],
  ["Вера Котова", "Toyota RAV4", 3160000, 1],
  ["Никита Лукин", "Chery Tiggo 7 Pro Max", 2840000, 0],
  ["Ольга Белова", "Kia Sportage", 2380000, 2],
  ["Михаил Зуев", "Москвич 3", 1960000, 0],
  ["Лидия Громова", "Mazda CX-5", 2650000, 1],
  ["Артём Фомин", "Geely Atlas", 3250000, 0],
  ["Софья Орлова", "Haval F7", 3120000, 2],
  ["Денис Крылов", "Hyundai Tucson", 2430000, 1],
  ["Елена Ветрова", "Belgee X50", 2160000, 0],
  ["Лев Белов", "LADA Granta", 1120000, 0],
  ["Марина Давыдова", "Kia Cerato", 1810000, 1],
  ["Степан Чернов", "Chery Arrizo 8", 3080000, 0],
];
const stages = [0, 2, 1, 2, 2, 0, 2, 1, 2, 2, 1, 2, 2, 0, 2, 2];
const operationDates = [
  "11-24",
  "11-24",
  "11-23",
  "11-21",
  "11-19",
  "11-18",
  "11-17",
  "11-16",
  "11-13",
  "11-11",
  "11-10",
  "11-08",
  "11-05",
  "11-02",
  "10-29",
  "09-22",
];
const customers = leads.map(([name, vehicle, value, group], i) => ({
  id: "client-" + i,
  name,
  vehicle,
  value,
  group: groups[group],
  detail: vehicle,
  status: statuses.customers[i % 5 === 0 ? 2 : i % 4 === 0 ? 1 : 0],
}));
const deals = customers.map((client, i) => ({
  id: "sale-" + i,
  name: client.vehicle,
  vehicle: client.vehicle,
  buyer: client.name,
  detail: client.name,
  value: client.value,
  group: client.group,
  status: statuses.deals[stages[i]],
  date: "2026-" + operationDates[i],
}));
const billing = deals
  .filter((d) => d.status !== "Переговоры")
  .map((deal, i) => ({
    ...deal,
    id: "invoice-" + i,
    name: "Счёт АС-" + (101 + i),
    detail: deal.vehicle + " · " + deal.buyer,
    group: i % 3 === 0 ? "Бронирование" : "Покупка автомобиля",
    value: i % 3 === 0 ? 50000 : deal.value,
    status: statuses.billing[i % 3],
  }));
const appointments = [
  ["Подготовить Geely Atlas к тест-драйву", "Тест-драйв", 23],
  ["Тест-драйв Haval Jolion с Анной Лебедевой", "Тест-драйв", 24],
  ["Оценить Kia Sportage для трейд-ин", "Трейд-ин", 24],
  ["Согласовать условия покупки Geely Monjaro", "Продажа", 25],
  ["Передать комплект ключей от LADA Vesta", "Выдача", 25],
  ["Подтвердить бронь на Москвич 3", "Продажа", 26],
  ["Осмотреть Toyota RAV4 перед выдачей", "Выдача", 27],
  ["Подготовить договор на Geely Atlas", "Продажа", 28],
  ["Назначить повторный тест-драйв Mazda CX-5", "Тест-драйв", 30],
  ["Отправить счёт за бронирование", "Продажа", 24],
  ["Оформить акт передачи Škoda Octavia", "Выдача", 24],
];
export const initialModel = {
  customers,
  deals,
  billing,
  tasks: appointments.map(([name, category, day], i) => ({
    id: "activity-" + i,
    name,
    category,
    date: "2026-11-" + day,
    done: i >= 9,
    bucket: day < 24 ? "Просрочено" : day > 29 ? "Позже" : "На этой неделе",
  })),
  office: {
    name: "Автосалон «Кваркус»",
    email: "sales@example.com",
    city: "Казань",
    phone: "",
  },
  preferences: [true, true, false, true],
  team: [
    { name: "Алина Волкова", role: teamRoles[0] },
    { name: "Марк Орлов", role: teamRoles[1] },
    { name: "Вера Белова", role: teamRoles[2] },
  ],
};
const dayMs = 86400000;
export function salesReport(deals, period = 0) {
  const days = [24, 7, 30, 90][period] || 24;
  const start = Date.parse(demoDate) - (days - 1) * dayMs;
  const buckets = Array.from({ length: Math.min(8, days) }, (_, i) => ({
    start: start + Math.ceil((i * days) / Math.min(8, days)) * dayMs,
    amount: 0,
  }));
  let delivered = 0,
    booked = 0,
    total = 0;
  for (const deal of deals) {
    const day = (Date.parse(deal.date) - start) / dayMs;
    if (!Number.isInteger(day) || day < 0 || day >= days) continue;
    total++;
    if (deal.status === "Бронь") booked++;
    if (deal.status !== "Выдан") continue;
    delivered++;
    buckets[Math.floor((day * buckets.length) / days)].amount += deal.value;
  }
  return {
    delivered,
    booked,
    total,
    amount: buckets.reduce((sum, b) => sum + b.amount, 0),
    values: buckets.map((b) => b.amount),
    labels: buckets.map((b) =>
      new Date(b.start).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "UTC",
      }),
    ),
  };
}
const storageKey = "kvarkus.sales.v1";
export function readModel() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (
      saved &&
      ["customers", "deals", "billing", "tasks", "team"].every((key) =>
        Array.isArray(saved[key]),
      )
    )
      return { ...structuredClone(initialModel), ...saved };
  } catch {}
  return structuredClone(initialModel);
}
export function storeModel(value) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {}
}
