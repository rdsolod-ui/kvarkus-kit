import React, { useState } from "react";
import Header from "../ui/Header.jsx";
import Button from "../ui/Button.jsx";
import { Plus } from "lucide-react";
import "./examples.css";

export default function Example() {
  const [num, setNum] = useState(0);
  return (
    <Header title="Обзор" subtitle={"Автосалон «Кваркус» · " + num}>
      <Button icon={Plus} onClick={() => setNum(num + 1)}>
        Оформить выдачу
      </Button>
    </Header>
  );
}
