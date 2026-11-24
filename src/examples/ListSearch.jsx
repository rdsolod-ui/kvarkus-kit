import React, { useState } from "react";
import ListSearch from "../ui/ListSearch.jsx";

export default function Example() {
  const [value, setValue] = useState("");
  return <ListSearch value={value} onChange={setValue} />;
}
