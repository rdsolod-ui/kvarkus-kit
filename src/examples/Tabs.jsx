import React, { useState } from "react";
import Tabs from "../ui/Tabs.jsx";

import "./examples.css";

export default function Example() {
  const [value, setValue] = useState("Все");
  return (
    <Tabs
      items={["Все", "Новые авто", "С пробегом", "Трейд-ин"]}
      value={value}
      onChange={setValue}
    />
  );
}
