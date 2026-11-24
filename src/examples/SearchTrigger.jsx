import React, { useState } from "react";
import SearchTrigger from "../ui/SearchTrigger.jsx";
import { screens } from "../model.js";
import "./examples.css";
export default function Example() {
  const [query, setQuery] = useState("");
  const results = screens.filter(([, title]) =>
    title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div>
      <SearchTrigger
        value={query}
        onChange={setQuery}
        onEnter={() => setQuery(results[0]?.[1] || query)}
      />
      {query && (
        <output aria-live="polite">
          {results.map(([, title]) => title).join(" · ") || "Ничего не найдено"}
        </output>
      )}
    </div>
  );
}
