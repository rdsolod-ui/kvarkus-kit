import React, { useState } from "react";
import Registry from "../ui/Registry.jsx";
import { initialModel } from "../model.js";
import "./examples.css";

export default function Example() {
  const [filter, setFilter] = useState("Все"),
    [row, setRow] = useState("");
  return (
    <>
      <Registry
        rows={initialModel.customers}
        customer
        filter={filter}
        onFilter={setFilter}
        onOpen={(r) => setRow(r.name)}
      />
      <output>{row}</output>
    </>
  );
}
