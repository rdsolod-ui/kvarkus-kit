import React from "react";
import { CheckCircle2 } from "lucide-react";
import "./Toast.css";

export default function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={message ? "toast" : "toast-empty"}
    >
      {message && (
        <>
          <CheckCircle2 />
          {message}
        </>
      )}
    </div>
  );
}
