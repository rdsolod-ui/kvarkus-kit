import React, { useState } from "react";
import RecordRow from "../ui/RecordRow.jsx";
import { initialModel } from "../model.js";
import "./examples.css";

export default function Example() {
  const [row, setRow] = useState(0);
  return (
    <RecordRow
      record={initialModel.customers[row]}
      onClick={() => setRow((row + 1) % initialModel.customers.length)}
    />
  );
}
