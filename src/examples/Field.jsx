import React from "react";
import Field from "../ui/Field.jsx";

import "./examples.css";

export default function Example() {
  return (
    <div className="example-stack">
      <Field label="Имя" placeholder="Имя клиента" />
      <Field label="Сумма, ₽" type="number" min="0" />
      <Field label="Статус" options={["Активен", "VIP", "Новый"]} />
    </div>
  );
}
