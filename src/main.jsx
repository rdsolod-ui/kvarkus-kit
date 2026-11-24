import React, { useState, useEffect, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./tokens.css";
import "./guide-theme.css";
import Portal from "./Portal.jsx";
import Shell from "./shell.jsx";
import { applyAppearance } from "./ui/Appearance.jsx";
import { screens } from "./model.js";
const Library = lazy(() => import("./Library.jsx")),
  ReferenceMap = lazy(() => import("./ReferenceMap.jsx"));
const getRoute = () =>
  location.hash.slice(1) ||
  (location.pathname.endsWith("/guide.html") ? "kit" : "screen/overview");
function App() {
  const [route, setRoute] = useState(getRoute);
  useEffect(() => {
    const update = () => setRoute(getRoute());
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const [section, id] = route.split("/");
  const alias = {
    patients: "customers",
    authorizations: "deals",
    ScreenPatients: "ScreenCustomers",
    ScreenAuthorizations: "ScreenDeals",
  };
  const target = alias[id] || id;
  const page = screens.find(([key]) => key === target) || screens[0];
  useEffect(() => {
    if (section !== "map")
      document.title =
        (section === "kit" ? "Справочник" : page[1]) + " · Кваркус Кит";
  }, [section, page]);
  return (
    <>
      <Shell section={section} />
      <Suspense fallback={<p role="status">Загрузка…</p>}>
        {section === "map" ? (
          <ReferenceMap route={route} />
        ) : section === "kit" ? (
          <Library id={target} />
        ) : (
          <Portal page={page[0]} />
        )}
      </Suspense>
    </>
  );
}
applyAppearance();
createRoot(document.getElementById("root")).render(<App />);
