import React from "react";
import Metric from "../ui/Metric.jsx";
import { Banknote, KeyRound, Check } from "lucide-react";
import "./examples.css";

export default function Example() {
  return (
    <div className="example-metrics">
      <Metric
        icon={Banknote}
        label="Объём продаж"
        value="12,9 млн ₽"
        change="-14%"
      />
      <Metric
        icon={KeyRound}
        tone="violet"
        label="В работе"
        value="31"
        change="-9%"
      />
      <Metric
        icon={Check}
        tone="gold"
        label="Выдано"
        value="46"
        change="+32%"
      />
    </div>
  );
}
