import { build } from "vite";
import fs from "node:fs";
import { entries } from "../src/examples/list.js";
import { describe } from "../src/examples/notes.js";
const output = "public/downloads";
fs.mkdirSync(output, { recursive: true });
const result = await build({
  configFile: false,
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  publicDir: false,
  logLevel: "warn",
  build: {
    write: false,
    lib: { entry: "src/sample.jsx", name: "KvarkusExample", formats: ["iife"] },
    assetsInlineLimit: Infinity,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
const produced = result.output || result[0].output;
const js = produced.find((f) => f.type === "chunk"),
  css = produced.find((f) => f.fileName.endsWith(".css"));
if (!js || !css) throw Error("Не собран автономный пример");
fs.writeFileSync(output + "/preview-runtime.js", js.code);
const licenses = [
  "react/LICENSE",
  "react-dom/LICENSE",
  "lucide-react/LICENSE",
  "@fontsource-variable/inter/LICENSE",
]
  .map((f) => fs.readFileSync("node_modules/" + f, "utf8"))
  .join("\n");
fs.writeFileSync(
  output + "/preview-runtime.css",
  "/*!\n" + licenses + "\n*/\n" + css.source,
);
const csv = (rows) =>
  rows
    .map((row) =>
      row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(";"),
    )
    .join("\r\n");
fs.writeFileSync(
  output + "/elements.csv",
  "\uFEFF" +
    csv([
      ["Раздел", "Название", "Компонент", "Исходник", "Движение", "Ссылка"],
      ...entries.map((e) => [
        e.category,
        e.title,
        e.id,
        e.component || e.id,
        describe(e)[1],
        "https://marketing.parkskazka.ru/kvarkus-kit/guide.html#kit/" +
          e.id,
      ]),
    ]),
);
