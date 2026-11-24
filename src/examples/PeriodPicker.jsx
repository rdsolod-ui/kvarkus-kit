import React, { useState } from "react";
import PeriodPicker from "../ui/PeriodPicker.jsx";

import "./examples.css";

export default function Example() {
  const [period, setPeriod] = useState(0);
  return (
    <div className="example-period">
      <PeriodPicker value={period} onChange={setPeriod} />
    </div>
  );
}
