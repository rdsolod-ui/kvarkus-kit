import React from "react";
import Room from "../ui/Room.jsx";

import "./examples.css";

export default function Example() {
  return (
    <div style={{ position: "relative", height: 300, isolation: "isolate" }}>
      <Room />
    </div>
  );
}
