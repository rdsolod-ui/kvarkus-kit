import React, { useState } from "react";
import Sidebar from "../ui/Sidebar.jsx";

import "./examples.css";

export default function Example() {
  const [page, setPage] = useState("overview"),
    [fold, setFold] = useState(false),
    [group, setGroup] = useState("Все");
  return (
    <div className={"example-side" + (fold ? " narrow" : "")}>
      <Sidebar
        page={page}
        group={group}
        collapsed={fold}
        onCollapse={() => setFold(!fold)}
        onNavigate={setPage}
        onGroup={setGroup}
        onSearch={() => setPage("customers")}
        onProfile={() => setPage("settings")}
      />
    </div>
  );
}
