import React, { useState } from "react";
import { useMotion, movements } from "../motion.js";
import Button from "./Button.jsx";
import "./MotionDemo.css";
export default function MotionDemo({ kind = "section" }) {
  const [step, setStep] = useState(0);
  const ref = useMotion(kind, step);
  return (
    <div className="motion-demo">
      <div ref={ref} className="motion-object">
        <i />
        <strong>{movements[kind].name}</strong>
        <span>{movements[kind].duration} мс</span>
      </div>
      <Button variant="quiet" onClick={() => setStep((n) => n + 1)}>
        Повторить движение
      </Button>
    </div>
  );
}
