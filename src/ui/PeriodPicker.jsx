import React from "react";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Check } from "lucide-react";
import { periods } from "../model.js";
import "./PeriodPicker.css";

export default function PeriodPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div
      className="period"
      ref={ref}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          ref.current.querySelector("button").focus();
        }
      }}
    >
      <button
        className="period-trigger"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <CalendarDays />
        {periods[value]}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="period-menu">
          {periods.map((p, i) => (
            <button
              key={p}
              aria-pressed={value === i}
              onClick={() => {
                onChange(i);
                setOpen(false);
                ref.current.querySelector("button").focus();
              }}
            >
              {p}
              {value === i && <Check />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
