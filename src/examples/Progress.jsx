import React, { useState } from "react";
import Progress from "../ui/Progress.jsx";

import "./examples.css";

export default function Example() {
  const [value, setValue] = useState(72);
  return (
    <div className="example-stack">
      <Progress value={value} />
      <input
        type="range"
        aria-label="Загрузка"
        value={value}
        onChange={(e) => setValue(+e.target.value)}
      />
    </div>
  );
}
