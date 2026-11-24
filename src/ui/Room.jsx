import React, { useEffect, useRef } from "react";
import "./Room.css";
export default function Room() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current,
      ctx = canvas.getContext("2d");
    if (!ctx) return;
    function draw() {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      if (!w || !h) return;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      for (let strand = 0; strand < 34; strand++) {
        const v = strand / 33;
        ctx.fillStyle = "rgba(255,255,255," + (0.22 + 0.46 * (1 - v)) + ")";
        ctx.beginPath();
        for (let x = -12; x < w + 10; x += Math.max(7, w / 170)) {
          const u = x / w,
            angle = u * 5.6 + v * 0.9;
          const y =
            h *
            (0.62 +
              0.19 * Math.sin(angle) +
              0.18 * Math.sin(u * 2.8 - 1.6) +
              v * (0.14 + 0.085 * Math.cos(u * 6)));
          const radius = 0.55 + v * 0.68;
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();
    return () => observer.disconnect();
  }, []);
  return (
    <div className="room" aria-hidden="true">
      <canvas className="particle-wave" ref={ref} />
    </div>
  );
}
