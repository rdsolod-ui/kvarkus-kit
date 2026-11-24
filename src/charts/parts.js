import { result, bodyTypes, named } from "./common.js";
export function parts(kind, oct) {
  const values = oct ? [33, 21, 11, 8] : [42, 26, 14, 9];
  if (kind === "Gauge") {
    const fact = oct ? 36 : 42,
      plan = 50,
      pct = (fact * 100) / plan;
    return result(["Выдано", "План", "Выполнение, %"], [[fact, plan, pct]], {
      series: [
        {
          type: "gauge",
          radius: "81%",
          min: 0,
          max: 100,
          progress: { show: true, width: 10 },
          axisLine: { lineStyle: { width: 10 } },
          axisLabel: { distance: 12, fontSize: 10 },
          splitLine: { length: 8 },
          axisTick: { length: 3 },
          detail: { valueAnimation: true, formatter: "{value}%", fontSize: 24 },
          data: [{ value: pct }],
        },
      ],
    });
  }
  if (kind === "Radar") {
    const labels = ["Цена", "Оснащение", "Дизайн", "Комфорт", "Динамика"],
      a = oct ? [66, 70, 55, 82, 70] : [84, 72, 70, 86, 67],
      b = [72, 84, 89, 62, 81];
    return result(
      ["Критерий, баллы", "Jolion", "Atlas"],
      labels.map((s, i) => [s, a[i], b[i]]),
      {
        legend: { data: ["Jolion", "Atlas"] },
        radar: {
          radius: "58%",
          center: ["50%", "57%"],
          indicator: labels.map((name) => ({ name, max: 100 })),
        },
        series: [
          {
            type: "radar",
            areaStyle: { opacity: 0.14 },
            data: [
              { name: "Jolion", value: a },
              { name: "Atlas", value: b },
            ],
          },
        ],
      },
    );
  }
  if (kind === "Funnel") {
    const names = ["Заявки", "Контакты", "Тест-драйвы", "Договоры", "Выдачи"],
      v = oct ? [122, 92, 65, 41, 36] : [145, 104, 76, 50, 42];
    return result(
      ["Этап", "Покупатели"],
      names.map((s, i) => [s, v[i]]),
      {
        series: [
          {
            type: "funnel",
            left: "6%",
            width: "85%",
            top: 15,
            bottom: 12,
            minSize: "25%",
            gap: 3,
            label: {
              position: "inside",
              color: "#111",
              backgroundColor: "#ffffffe6",
              padding: [2, 5],
              borderRadius: 3,
            },
            data: named(names, v),
          },
        ],
      },
    );
  }
  if (["Tree", "Treemap", "Sunburst"].includes(kind)) {
    const leaves = [
      ["Новые", "Jolion", values[0]],
      ["Новые", "Vesta", values[1]],
      ["С пробегом", "Octavia", values[2]],
      ["С пробегом", "Tucson", values[3]],
    ];
    const data = ["Новые", "С пробегом"].map((name) => ({
      name,
      children: leaves
        .filter((r) => r[0] === name)
        .map(([, name, value]) => ({ name, value })),
    }));
    const series =
      kind === "Tree"
        ? {
            type: "tree",
            data: [{ name: "Склад", children: data }],
            left: "11%",
            right: "22%",
            top: "12%",
            bottom: "12%",
            symbolSize: 10,
            expandAndCollapse: false,
            label: { position: "top" },
          }
        : kind === "Treemap"
          ? {
              type: "treemap",
              data,
              breadcrumb: { show: false },
              roam: false,
              nodeClick: false,
              upperLabel: { show: true, height: 22 },
              label: { show: true },
              itemStyle: { gapWidth: 3 },
            }
          : {
              type: "sunburst",
              radius: ["9%", "90%"],
              nodeClick: false,
              data,
              label: { fontSize: 10 },
            };
    return result(["Сегмент", "Модель", "Автомобили"], leaves, {
      series: [series],
    });
  }
  return result(
    ["Кузов", "Автомобили"],
    bodyTypes.map((n, i) => [n, values[i]]),
    {
      legend: { bottom: 0, data: bodyTypes },
      series: [
        {
          type: "pie",
          center: ["50%", "44%"],
          radius: kind === "Donut" ? ["40%", "70%"] : "69%",
          roseType: kind === "Rose" ? "radius" : undefined,
          label: { show: false },
          data: named(bodyTypes, values),
          itemStyle: { borderRadius: 4 },
          emphasis: { scaleSize: 5 },
        },
      ],
    },
  );
}
