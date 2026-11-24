import React, { useState } from "react";
import Overview from "../ui/Overview.jsx";
import { initialModel, screens } from "../model.js";
import "./examples.css";

export default function Example() {
  const [selected, setSelected] = useState("");
  return (
    <>
      <div className="example-overview">
        <Overview model={initialModel} onMetric={setSelected} />
      </div>
      <output>{screens.find(([id]) => id === selected)?.[1]}</output>
    </>
  );
}
