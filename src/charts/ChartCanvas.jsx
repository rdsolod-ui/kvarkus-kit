import React, { useLayoutEffect, useRef } from "react";
import * as echarts from "echarts/core";
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  ChordChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
} from "echarts/charts";
import {
  GridComponent,
  PolarComponent,
  RadarComponent,
  GeoComponent,
  SingleAxisComponent,
  ParallelComponent,
  CalendarComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
} from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
import { showroom } from "./flows.js";
echarts.use([
  SVGRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  ChordChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
  GridComponent,
  PolarComponent,
  RadarComponent,
  GeoComponent,
  SingleAxisComponent,
  ParallelComponent,
  CalendarComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
]);
echarts.registerMap("kvarkus-showroom", showroom);
function palette(host) {
  const s = getComputedStyle(host),
    token = (name) => s.getPropertyValue(name).trim();
  return [
    token("--red") || "#d44968",
    "#258d9b",
    "#a078d4",
    "#d28742",
    "#4c93cc",
    "#b86d91",
  ];
}
export default function ChartCanvas({
  option,
  title,
  reduced,
  theme,
  accent,
  replay,
  kind,
}) {
  const root = useRef(null),
    instance = useRef(null);
  useLayoutEffect(() => {
    const host = root.current;
    const chart = echarts.init(host, theme === "dark" ? "dark" : undefined, {
      renderer: "svg",
    });
    instance.current = chart;
    const ro = new ResizeObserver(() => {
      if (host.clientWidth && host.clientHeight)
        chart.resize({ animation: { duration: 0 } });
    });
    ro.observe(host);
    return () => {
      ro.disconnect();
      instance.current = null;
      chart.dispose();
    };
  }, [theme, reduced, kind, replay]);
  useLayoutEffect(() => {
    const chart = instance.current,
      host = root.current;
    const narrow = host.clientWidth < 510;
    const series = option.series.map((s, index) => ({
      ...s,
      id: kind + "-" + index,
      ...(reduced && s.type === "effectScatter" ? { type: "scatter" } : {}),
      ...(reduced && s.type === "custom" ? { animation: false } : {}),
      animationDelay: reduced ? 0 : (i) => Math.min(i, 12) * 15,
      animationDuration: reduced ? 0 : 650,
      animationDurationUpdate: reduced ? 0 : 360,
    }));
    chart.setOption(
      {
        ...option,
        series,
        color: palette(host),
        backgroundColor: "transparent",
        textStyle: {
          fontFamily: "Inter Variable, sans-serif",
          fontSize: narrow ? 10 : 12,
        },
        animation: !reduced,
        animationDuration: reduced ? 0 : 650,
        animationDurationUpdate: reduced ? 0 : 360,
        animationEasing: "cubicOut",
        animationEasingUpdate: "cubicInOut",
        tooltip: { trigger: "item", renderMode: "richText", confine: true },
        legend: {
          type: "scroll",
          top: 2,
          textStyle: { fontSize: 11 },
          ...option.legend,
          show: option.legend ? option.legend.show !== false : false,
          ...(option.legend?.bottom != null ? { top: "auto" } : {}),
        },
      },
      { replaceMerge: ["series"] },
    );
  }, [option, reduced, theme, accent, kind, replay]);
  return (
    <div
      className="chart-drawing"
      role="img"
      aria-label={title + ". Точные значения приведены в таблице ниже."}
      ref={root}
    />
  );
}
