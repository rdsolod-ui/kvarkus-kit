import React from "react";
import Progress from "./Progress.jsx";
import "./PlanCard.css";

export default function PlanCard({ value = 72 }) {
  return (
    <div className="plan-card">
      <strong>Тест-драйвы</strong>
      <small>{value}% слотов занято</small>
      <Progress value={value} label="Загрузка тест-драйвов" />
    </div>
  );
}
