import React from "react";
import Badge from "../ui/Badge.jsx";

import "./examples.css";

export default function Example() {
  return (
    <div className="example-line">
      {["green", "gold", "violet", "neutral"].map((tone, i) => (
        <Badge key={tone} tone={tone}>
          {["Активен", "Ожидает", "VIP", "Автосалон"][i]}
        </Badge>
      ))}
    </div>
  );
}
