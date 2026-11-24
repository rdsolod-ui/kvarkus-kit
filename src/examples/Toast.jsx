import React, { useState } from "react";
import Toast from "../ui/Toast.jsx";
import Button from "../ui/Button.jsx";
import "./examples.css";

export default function Example() {
  const [on, setOn] = useState(false);
  return (
    <>
      <Button onClick={() => setOn(!on)}>
        Показать или скрыть уведомление
      </Button>
      <Toast message={on ? "Запись сохранена" : ""} />
    </>
  );
}
