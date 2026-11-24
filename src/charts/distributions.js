import { axis, result, bodyTypes } from "./common.js";
export function distributions(kind, oct) {
  const models = [
    "Jolion",
    "Vesta",
    "Atlas",
    "Tiggo",
    "X50",
    "Octavia",
    "Tucson",
  ];
  const mileage = [6, 38, 18, 24, 9, 63, 52],
    prices = oct
      ? [2.2, 1.3, 3.1, 2.5, 2.2, 1.9, 2.4]
      : [2.4, 1.4, 3.3, 2.7, 2.1, 1.8, 2.5],
    leads = oct ? [9, 14, 12, 11, 8, 13, 9] : [12, 16, 13, 10, 11, 15, 8];
  if (["Scatter", "Bubble", "Effect"].includes(kind)) {
    const data = models.map((name, i) => ({
      name,
      value: [mileage[i], prices[i], leads[i]],
    }));
    return result(
      ["Модель", "Пробег, тыс. км", "Цена, млн ₽", "Запросы"],
      data.map((p) => [p.name, ...p.value]),
      {
        grid: { left: 44, right: 24, bottom: 36, top: 26 },
        xAxis: {
          type: "value",
          name: "тыс. км",
          nameLocation: "middle",
          nameGap: 22,
        },
        yAxis: { type: "value", name: "млн ₽" },
        series: [
          {
            type: kind === "Effect" ? "effectScatter" : "scatter",
            showEffectOn: "emphasis",
            rippleEffect: { scale: 2 },
            symbolSize: (v) => (kind === "Bubble" ? Math.sqrt(v[2]) * 6 : 13),
            data,
          },
        ],
      },
    );
  }
  if (kind === "Histogram") {
    const bins = ["1–1,5", "1,5–2", "2–2,5", "2,5–3", "3–3,5"],
      v = oct ? [5, 11, 17, 10, 7] : [6, 12, 21, 14, 8];
    return result(
      ["Цена, млн ₽", "Автомобили"],
      bins.map((s, i) => [s, v[i]]),
      {
        ...axis(bins),
        series: [{ type: "bar", data: v, barCategoryGap: "2%" }],
      },
    );
  }
  if (kind === "Box") {
    const values = bodyTypes.map((_, i) =>
      [1.1, 1.4, 1.7, 2, 2.35].map(
        (v) => +(v + (oct ? 0.18 : 0.28) * i).toFixed(2),
      ),
    );
    return result(
      ["Кузов", "Мин.", "Q1", "Медиана", "Q3", "Макс."],
      bodyTypes.map((b, i) => [b, ...values[i]]),
      {
        ...axis(bodyTypes),
        series: [{ name: "Цена, млн ₽", type: "boxplot", data: values }],
      },
    );
  }
  if (kind === "Candle") {
    const days = ["02", "06", "10", "14", "18", "22", "26"],
      v = days.map((_, i) => {
        const open = 1.8 + i * 0.04 + (oct ? 0 : 0.1),
          close = open + (i % 2 ? 0.12 : -0.08);
        return [
          open,
          close,
          Math.min(open, close) - 0.05,
          Math.max(open, close) + 0.07,
        ].map((n) => +n.toFixed(2));
      });
    return result(
      ["День", "Открытие", "Закрытие", "Мин.", "Макс."],
      days.map((s, i) => [s, ...v[i]]),
      {
        ...axis(days),
        yAxis: { type: "value", scale: true },
        series: [
          {
            type: "candlestick",
            name: "Цена, млн ₽",
            data: v,
            itemStyle: {
              color: "#0b9a82",
              color0: "#da586d",
              borderColor: "#0b9a82",
              borderColor0: "#da586d",
            },
          },
        ],
      },
    );
  }
  if (kind === "Parallel") {
    const rows = models.map((n, i) => [n, prices[i], mileage[i], leads[i]]);
    return result(
      ["Модель", "Цена, млн ₽", "Пробег, тыс. км", "Запросы"],
      rows,
      {
        parallel: { left: "13%", right: "13%", top: 50, bottom: 30 },
        parallelAxis: ["млн ₽", "тыс. км", "запросы"].map((name, dim) => ({
          dim,
          name,
        })),
        series: rows.map(([name, ...vals]) => ({
          type: "parallel",
          name,
          lineStyle: { width: 3, opacity: 0.8 },
          data: [vals],
        })),
      },
    );
  }
  const visualMap = {
    show: false,
    min: 0,
    max: 9,
    inRange: { color: ["#d0ebe9", "#54adab", "#175c85"] },
  };
  if (kind === "Calendar") {
    const month = "2026-" + (oct ? "10" : "11");
    const data = Array.from({ length: oct ? 31 : 30 }, (_, i) => [
      month + "-" + String(i + 1).padStart(2, "0"),
      (i * 7 + (oct ? 2 : 4)) % 10,
    ]);
    return result(["Дата", "Выдано"], data, {
      visualMap,
      calendar: {
        range: month,
        left: "13%",
        right: "6%",
        top: "17%",
        bottom: "10%",
        dayLabel: {
          firstDay: 1,
          nameMap: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        },
        monthLabel: { show: false },
        yearLabel: { show: false },
        cellSize: ["auto", "auto"],
      },
      series: [{ type: "heatmap", coordinateSystem: "calendar", data }],
    });
  }
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    hours = ["10:00", "12:00", "14:00", "16:00", "18:00"];
  const data = days.flatMap((_, i) =>
    hours.map((_, j) => [i, j, (i * 3 + j * 2 + (oct ? 1 : 4)) % 10]),
  );
  return result(
    ["День", "Время", "Тест-драйвы"],
    data.map(([x, y, v]) => [days[x], hours[y], v]),
    {
      ...axis(days),
      yAxis: { type: "category", data: hours },
      visualMap,
      series: [
        {
          type: "heatmap",
          data,
          itemStyle: { borderWidth: 2, borderColor: "transparent" },
          label: {
            show: true,
            color: "#181e30",
            backgroundColor: "#ffffffbb",
            borderRadius: 3,
            padding: 2,
          },
        },
      ],
    },
  );
}
