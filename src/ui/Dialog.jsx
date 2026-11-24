import React from "react";
import { useMotion } from "../motion.js";
import { useEffect, useRef, useId } from "react";
import { X } from "lucide-react";
import "./Dialog.css";

export default function Dialog({ title, children, onClose, sheet = false }) {
  const ref = useRef(null);
  useMotion(sheet ? "sheet" : "pop", sheet, ref);
  const id = useId();
  useEffect(() => {
    const el = ref.current;
    const previous = document.activeElement;
    el.showModal();
    return () => {
      el.close();
      previous?.focus?.();
    };
  }, []);
  return (
    <dialog
      className={"dialog" + (sheet ? " sheet" : "")}
      ref={ref}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) {
          const r = e.target.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <header>
        <h2 id={id}>{title}</h2>
        <button className="close" aria-label="Закрыть" onClick={onClose}>
          <X />
        </button>
      </header>
      {children}
    </dialog>
  );
}
