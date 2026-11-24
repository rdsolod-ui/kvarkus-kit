import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./tokens.css";
import "./examples/examples.css";
import { entries } from "./examples/list.js";
import { setPreviewAppearance } from "./ui/Appearance.jsx";
import "./sample.css";
const examples = import.meta.glob("./examples/*.jsx", {
  eager: true,
  import: "default",
});
const options = new URLSearchParams(location.search);
const root = document.getElementById("root");
const id = root.dataset.example || options.get("id") || "Overview";
const entry = entries.find((e) => e.id === id) || entries[0];
const Example = examples["./examples/" + entry.id + ".jsx"];
const selectedTheme = root.dataset.theme || options.get("theme"),
  selectedAccent = root.dataset.accent || options.get("accent");
setPreviewAppearance({
  theme: selectedTheme || "dark",
  accent: selectedAccent || "coral",
});
document.title = entry.title + " · Кваркус Кит";
function Sample() {
  useEffect(() => {
    const element = document.querySelector(".sample");
    function resize() {
      if (parent !== window)
        parent.postMessage(
          {
            kind: "kvarkus-preview-size",
            height: Math.ceil(element.getBoundingClientRect().height),
          },
          location.origin,
        );
    }
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <main
      className={
        "sample demo-" +
        id +
        (entry.component === "ScreenDemo" ? " full-screen" : "")
      }
    >
      <Example />
    </main>
  );
}
createRoot(root).render(<Sample />);
