import React from "react";
import Bars from "../ui/Bars.jsx";
import { initialModel, salesReport, money } from "../model.js";
import "./examples.css";
export default function Example() {
  const report = salesReport(initialModel.deals);
  return (
    <div className="example-chart">
      <Bars
        values={report.values}
        labels={report.labels}
        amounts={report.values.map(money)}
        title="Стоимость выдач по датам"
      />
    </div>
  );
}
