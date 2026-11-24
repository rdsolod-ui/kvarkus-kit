import React, { useState } from "react";
import NavItem from "../ui/NavItem.jsx";
import { House, Shield } from "lucide-react";
import "./examples.css";

export default function Example() {
  const [active, setActive] = useState(0);
  return (
    <div>
      {[House, Shield].map((icon, i) => (
        <NavItem
          key={i}
          icon={icon}
          label={["Обзор", "Сделки"][i]}
          active={active === i}
          onClick={() => setActive(i)}
          badge={i === 1 ? 5 : undefined}
        />
      ))}
    </div>
  );
}
