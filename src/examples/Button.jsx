import React, { useState } from "react";
import Button from "../ui/Button.jsx";
import { Plus } from "lucide-react";
import "./examples.css";

export default function Example() {
  const [count, setCount] = useState(0);
  return (
    <div className="example-line">
      <Button icon={Plus} onClick={() => setCount(count + 1)}>
        Оформить выдачу
      </Button>
      <Button variant="quiet" onClick={() => setCount(0)}>
        Отмена
      </Button>
      <output>{count}</output>
    </div>
  );
}
