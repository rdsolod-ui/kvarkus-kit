import { axis, result, weekly } from "./common.js";
export function trends(kind, oct) {
  const a = oct ? [12, 16, 14, 19] : [15, 24, 18, 29],
    b = oct ? [6, 9, 7, 10] : [8, 13, 10, 16];
  const rows = weekly.map((w, i) => [w, a[i], b[i]]);
  if (kind === "River") {
    const names = ["Кроссоверы", "Седаны", "Универсалы"],
      dates = weekly.map(
        (_, i) =>
          "2026-" +
          (oct ? "10" : "11") +
          "-" +
          String(i * 7 + 1).padStart(2, "0"),
      );
    const data = dates.flatMap((d, i) =>
      names.map((n, j) => [d, [a[i], b[i], i + 4][j], n]),
    );
    return result(["Дата", "Обращения", "Кузов"], data, {
      legend: { data: names },
      singleAxis: {
        type: "time",
        top: 42,
        bottom: 35,
        left: 32,
        right: 25,
        axisLabel: { formatter: "{dd}.{MM}" },
      },
      series: [{ type: "themeRiver", data, label: { show: false } }],
    });
  }
  const combined = kind === "Combo" || kind === "StackArea",
    seriesData = combined ? [a, b] : [a];
  const names =
    kind === "StackArea" ? ["Сайт", "Салон"] : ["Заявки", "Тест-драйвы"];
  const series = seriesData.map((values, i) => ({
    type: kind === "Combo" && i === 0 ? "bar" : "line",
    name: combined ? names[i] : "Количество",
    data: values,
    smooth: kind === "Smooth",
    step: kind === "Step" ? "end" : false,
    areaStyle: ["Area", "StackArea", "Spark"].includes(kind)
      ? { opacity: 0.2 }
      : undefined,
    stack: kind === "StackArea" ? "sum" : undefined,
    symbolSize: 7,
    showSymbol: kind !== "Spark",
    barMaxWidth: 42,
    lineStyle: { width: 3 },
  }));
  const option = {
    ...axis(weekly),
    series,
    legend: { show: combined, data: combined ? names : [] },
  };
  if (kind === "Spark") {
    option.xAxis.show = false;
    option.yAxis.show = false;
    option.grid = { left: 8, right: 8, top: 38, bottom: 18 };
  }
  return result(
    ["Дни месяца", ...(combined ? names : ["Количество"])],
    rows.map((r) => (combined ? r : r.slice(0, 2))),
    option,
  );
}
