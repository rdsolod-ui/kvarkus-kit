import React from "react";
import { Banknote, KeyRound, CarFront } from "lucide-react";
import Metric from "./Metric.jsx";
import Bars from "./Bars.jsx";
import Ring from "./Ring.jsx";
import { money, salesReport } from "../model.js";
import "./Overview.css";

export default function Overview({ model, period = 0, onMetric }) {
  const report = salesReport(model.deals, period);
  const amount =
    report.amount >= 1000000
      ? (report.amount / 1000000).toLocaleString("ru-RU", {
          maximumFractionDigits: 2,
        }) + " млн ₽"
      : money(report.amount);
  return (
    <div className="overview">
      <Metric
        icon={Banknote}
        label="Объём продаж"
        value={amount}
        onClick={() => onMetric("deals")}
      />
      <Metric
        icon={KeyRound}
        label="Забронировано"
        value={report.booked}
        tone="violet"
        onClick={() => onMetric("deals")}
      />
      <Metric
        icon={CarFront}
        label="Выдано авто"
        value={report.delivered}
        tone="gold"
        onClick={() => onMetric("deals")}
      />
      <Bars
        values={report.values}
        labels={report.labels}
        amounts={report.values.map(money)}
        title="Стоимость выдач по датам"
      />
      <Ring
        value={report.delivered}
        total={report.total}
        label="Доля сделок с выдачей"
      />
    </div>
  );
}
