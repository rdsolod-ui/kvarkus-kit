import { useLayoutEffect, useRef } from "react";
export const movements = {
  section: {
    name: "Появление раздела",
    duration: 300,
    frames: [
      { opacity: 0, transform: "translateY(9px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
  },
  sheet: {
    name: "Краевая панель",
    duration: 260,
    frames: [
      { opacity: 0, transform: "translateX(32px)" },
      { opacity: 1, transform: "translateX(0)" },
    ],
  },
  pop: {
    name: "Раскрытие",
    duration: 180,
    frames: [
      { opacity: 0, transform: "translateY(4px) scale(.985)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ],
  },
  value: {
    name: "Смена значения",
    duration: 210,
    frames: [
      { opacity: 0.35, transform: "translateY(4px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
  },
};
export function useMotion(kind, change, existing) {
  const own = useRef(null),
    ref = existing || own;
  useLayoutEffect(() => {
    const el = ref.current,
      media = matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || media.matches || !el.animate) return;
    const { duration, frames } = movements[kind];
    const animation = el.animate(frames, {
      duration,
      easing: "cubic-bezier(.2,.75,.22,1)",
    });
    const interrupt = () => {
      if (media.matches) animation.cancel();
    };
    media.addEventListener("change", interrupt);
    return () => {
      animation.cancel();
      media.removeEventListener("change", interrupt);
    };
  }, [kind, change, ref]);
  return ref;
}
