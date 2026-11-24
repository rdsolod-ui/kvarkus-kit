import React, { useState } from "react";
import Portal from "../Portal.jsx";
import "./ScreenDemo.css";
export default function ScreenDemo({ initial = "overview" }) {
  const [page, setPage] = useState(initial);
  return (
    <div className="screen-demo">
      <Portal page={page} onNavigate={setPage} />
    </div>
  );
}
