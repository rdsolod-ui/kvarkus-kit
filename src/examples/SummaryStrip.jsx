import React from "react";
import SummaryStrip from "../ui/SummaryStrip.jsx";

import "./examples.css";

export default function Example() {
  const [selected, setSelected] = React.useState(0);
  return (
    <SummaryStrip
      selected={selected}
      onSelect={setSelected}
      items={[
        { label: "Всего", value: "24 500 000 ₽", detail: "10 клиентов" },
        { label: "Активен", value: 7 },
        { label: "VIP", value: 2 },
        { label: "Новый", value: 1 },
      ]}
    />
  );
}
