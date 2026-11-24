import React from "react";
import Ring from "../ui/Ring.jsx";

import "./examples.css";

export default function Example() {
  return (
    <div className="example-ring">
      <Ring value={46} total={77} />
    </div>
  );
}
