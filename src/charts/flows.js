import { result } from "./common.js";
const zones = ["Салон", "Склад", "Выдача", "Сервис"];
const centers = [
  [1, 1],
  [3, 1],
  [1, 3],
  [3, 3],
];
export const showroom = {
  type: "FeatureCollection",
  features: zones.map((name, i) => {
    const [x, y] = centers[i];
    return {
      type: "Feature",
      properties: { name },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [x - 0.94, y - 0.94],
            [x + 0.94, y - 0.94],
            [x + 0.94, y + 0.94],
            [x - 0.94, y + 0.94],
            [x - 0.94, y - 0.94],
          ],
        ],
      },
    };
  }),
};
export function flows(kind, oct) {
  if (kind === "Gantt") {
    const steps = ["Подготовка", "Осмотр", "Документы", "Выдача"],
      dates = oct
        ? [
            [1, 3],
            [3, 5],
            [4, 7],
            [7, 8],
          ]
        : [
            [2, 5],
            [4, 7],
            [6, 8],
            [8, 10],
          ];
    return result(
      ["Этап", "Начало, день", "Конец, день"],
      steps.map((s, i) => [s, ...dates[i]]),
      {
        grid: { left: 90, right: 18, top: 18, bottom: 32 },
        xAxis: { type: "value", min: 0, max: 12, minInterval: 1 },
        yAxis: { type: "category", data: steps, inverse: true },
        series: [
          {
            type: "custom",
            encode: { x: [1, 2], y: 0 },
            data: dates.map(([start, end], i) => [i, start, end]),
            renderItem: (params, api) => {
              const i = api.value(0),
                a = api.coord([api.value(1), i]),
                b = api.coord([api.value(2), i]),
                h = api.size([0, 1])[1] * 0.4;
              return {
                type: "rect",
                shape: {
                  x: a[0],
                  y: a[1] - h / 2,
                  width: b[0] - a[0],
                  height: h,
                  r: 5,
                },
                style: { fill: api.visual("color") },
                transition: ["shape"],
                enterFrom: { shape: { width: 0 } },
              };
            },
          },
        ],
      },
    );
  }
  if (kind === "Map" || kind === "Routes") {
    const v = oct ? [28, 14, 18, 8] : [37, 19, 22, 10];
    const areas = zones.map((name, i) => ({ name, value: v[i] }));
    const regional = {
      map: "kvarkus-showroom",
      roam: false,
      aspectScale: 1,
      layoutCenter: ["50%", "50%"],
      layoutSize: "85%",
      label: {
        show: true,
        color: "#152535",
        backgroundColor: "#ffffffd9",
        padding: [2, 4],
        borderRadius: 3,
      },
      itemStyle: {
        areaColor: "#acd4d3",
        borderWidth: 2,
        borderColor: "#54787b",
      },
    };
    if (kind === "Map")
      return result(
        ["Зона", "Посещения"],
        areas.map((a) => [a.name, a.value]),
        {
          visualMap: {
            show: false,
            min: 0,
            max: 45,
            inRange: { color: ["#cfe8e4", "#299198"] },
          },
          series: [{ type: "map", ...regional, data: areas }],
        },
      );
    const paths = [
        [0, 1],
        [1, 2],
        [3, 2],
      ],
      data = paths.map(([from, to], i) => ({
        name: zones[from] + " → " + zones[to],
        coords: [centers[from], centers[to]],
        value: v[i],
        lineStyle: { width: 1 + v[i] / 12 },
      }));
    return result(
      ["Маршрут", "Перемещения"],
      data.map((d) => [d.name, d.value]),
      {
        geo: { ...regional, label: { ...regional.label, position: "inside" } },
        series: [
          {
            type: "lines",
            coordinateSystem: "geo",
            symbol: ["circle", "arrow"],
            symbolSize: [5, 9],
            lineStyle: { color: "#c64c42", opacity: 0.9, curveness: 0.22 },
            data,
          },
        ],
      },
    );
  }
  const paths = [
    ["Сайт", "Визит", oct ? 24 : 32],
    ["Звонок", "Визит", oct ? 16 : 20],
    ["Визит", "Бронь", oct ? 22 : 28],
    ["Визит", "Без брони", oct ? 18 : 24],
  ];
  const nodes = [...new Set(paths.flatMap(([a, b]) => [a, b]))];
  const data = nodes.map((name) => ({ name })),
    links = paths.map(([source, target, value]) => ({ source, target, value }));
  if (kind === "Chord") {
    return result(["Источник", "Назначение", "Покупатели"], paths, {
      series: [
        {
          type: "chord",
          radius: ["53%", "65%"],
          data,
          links,
          label: { show: true, rotate: 0, fontSize: 10 },
        },
      ],
    });
  }
  const series =
    kind === "Sankey"
      ? {
          type: "sankey",
          left: 10,
          right: 76,
          top: 18,
          bottom: 18,
          nodeWidth: 16,
          nodeGap: 18,
          lineStyle: { color: "gradient", opacity: 0.45 },
          data,
          links,
          draggable: false,
        }
      : {
          type: "graph",
          layout: "none",
          left: "16%",
          right: "18%",
          top: "16%",
          bottom: "19%",
          symbolSize: 22,
          edgeSymbol: ["none", "arrow"],
          edgeSymbolSize: 8,
          label: { show: true, position: "bottom" },
          data: data.map((node, i) => ({
            ...node,
            x: [0, 1, 0, 2, 2][i],
            y: [0, 1, 2, 0, 2][i],
          })),
          links: links.map((l) => ({
            ...l,
            lineStyle: { width: l.value / 8, curveness: 0.08 },
          })),
        };
  return result(["Источник", "Назначение", "Покупатели"], paths, {
    series: [series],
  });
}
