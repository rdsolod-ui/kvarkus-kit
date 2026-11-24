import React, { useState } from "react";
import Toggle from "../ui/Toggle.jsx";

import "./examples.css";

export default function Example() {
  const [on, setOn] = useState(true);
  return (
    <Toggle
      label="Срок брони"
      description="До истечения срока"
      checked={on}
      onChange={setOn}
    />
  );
}
