import React from "react";
import Avatar from "../ui/Avatar.jsx";

import "./examples.css";

export default function Example() {
  return (
    <div className="example-line">
      {["red", "blue", "violet"].map((tone, i) => (
        <Avatar
          key={tone}
          tone={tone}
          name={["Алина Волкова", "Марк Орлов", "Вера Белова"][i]}
        />
      ))}
    </div>
  );
}
