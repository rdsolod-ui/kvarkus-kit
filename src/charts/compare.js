import { axis, result, models, figures } from "./common.js";
export function compare(kind, oct) {
  const a = figures(oct),
    b = oct ? [6, 8, 4, 5, 3] : [8, 5, 6, 4, 2];
  if (kind === "Waterfall") {
    const vals = oct ? [42, 18, -21, -2] : [37, 24, -19, -3];
    const names = ["Начало", "Поставка", "Выдачи", "Перевод", "Остаток"];
    let stock = 0;
    const offsets = [],
      sizes = [],
      net = [...vals, vals.reduce((s, n) => s + n, 0)];
    net.forEach((v, i) => {
      const next = i === net.length - 1 ? v : stock + v;
      offsets.push(i === net.length - 1 ? 0 : Math.min(stock, next));
      sizes.push(Math.abs(v));
      stock = next;
    });
    return result(
      ["Операция", "Автомобили"],
      names.map((n, i) => [n, net[i]]),
      {
        ...axis(names),
        series: [
          {
            type: "bar",
            stack: "w",
            data: offsets,
            itemStyle: { opacity: 0 },
            silent: true,
            tooltip: { show: false },
          },
          {
            name: "Автомобили",
            type: "bar",
            stack: "w",
            tooltip: { valueFormatter: (_, index) => net[index] },
            data: sizes.map((v, i) => ({
              value: v,
              itemStyle: { color: net[i] < 0 ? "#e38a5a" : undefined },
            })),
          },
        ],
      },
    );
  }
  if (kind === "Polar") {
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      v = [...a, oct ? 16 : 19, oct ? 13 : 16];
    return result(
      ["День", "Тест-драйвы"],
      days.map((n, i) => [n, v[i]]),
      {
        polar: { radius: "70%" },
        angleAxis: { type: "category", data: days },
        radiusAxis: {},
        series: [{ type: "bar", coordinateSystem: "polar", data: v }],
      },
    );
  }
  if (kind === "Bullet") {
    const targets = [15, 17, 13, 12, 10];
    return result(
      ["Модель", "Выдачи", "План"],
      models.map((n, i) => [n, a[i], targets[i]]),
      {
        ...axis(models, true),
        series: [
          {
            type: "bar",
            name: "План",
            data: targets,
            barWidth: 18,
            itemStyle: { opacity: 0.22 },
          },
          { type: "bar", name: "Выдачи", data: a, barWidth: 8, barGap: "-72%" },
          {
            type: "scatter",
            name: "Цель",
            symbol: "rect",
            symbolSize: [3, 23],
            data: targets.map((v, i) => [v, i]),
          },
        ],
      },
    );
  }
  const multi = ["Grouped", "Stack", "Percent"].includes(kind),
    pct = kind === "Percent",
    names = kind === "Grouped" ? ["Факт", "План"] : ["Кредит", "Свои средства"];
  if (kind === "Grouped") b.splice(0, b.length, 13, 15, 11, 9, 10);
  const numbers = pct ? a.map((v, i) => Math.round((v * 100) / (v + b[i]))) : a;
  let series = [
    {
      name: multi ? names[0] : "Автомобили",
      type: "bar",
      data: numbers,
      barMaxWidth: 42,
    },
  ];
  if (multi) {
    series.push({
      type: "bar",
      name: names[1],
      data: pct ? numbers.map((n) => 100 - n) : b,
      barMaxWidth: 42,
    });
    if (kind !== "Grouped") series.forEach((s) => (s.stack = "sales"));
  }
  if (kind === "Lollipop") {
    series[0].barWidth = 3;
    series.push({ type: "scatter", data: a, symbolSize: 17 });
  }
  if (kind === "Pictorial")
    series = [
      {
        name: "Выдачи",
        type: "pictorialBar",
        symbol: "roundRect",
        symbolRepeat: true,
        symbolMargin: 2,
        symbolSize: ["56%", 6],
        data: a,
      },
    ];
  const option = {
    ...axis(models, kind === "Horizontal"),
    series,
    legend: { show: multi, data: multi ? names : [] },
  };
  if (pct) option.yAxis = { max: 100, axisLabel: { formatter: "{value} %" } };
  return result(
    [
      "Модель",
      ...(multi ? names.map((n) => n + (pct ? ", %" : "")) : ["Автомобили"]),
    ],
    models.map((n, i) =>
      multi ? [n, numbers[i], pct ? 100 - numbers[i] : b[i]] : [n, a[i]],
    ),
    option,
  );
}
