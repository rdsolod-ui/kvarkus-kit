import fs from "node:fs";
import path from "node:path";
import { zipSync } from "fflate";
import { entries } from "../src/examples/list.js";
const root = process.cwd(),
  output = "public/downloads";
fs.mkdirSync(output, { recursive: true });
const bytes = (file) => new Uint8Array(fs.readFileSync(file));
const encode = (text) => new TextEncoder().encode(text);
const manifest = JSON.parse(fs.readFileSync("package.json", "utf8"));
function dependencies(file, files) {
  if (files[file]) return;
  files[file] = bytes(file);
  if (!/\.(jsx?|css)$/.test(file)) return;
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(
    /(?:from\s+|import\s*\(\s*|import\s*|url\(\s*)['"](\.[^'"]+)['"]/g,
  )) {
    const target = path.posix.normalize(
      path.posix.join(path.posix.dirname(file), match[1]),
    );
    if (!target.startsWith("src/"))
      throw Error("Invalid project import " + target);
    dependencies(target, files);
  }
}
const html = fs.readFileSync("index.html", "utf8");
for (const { id, title } of entries) {
  const files = {};
  dependencies("src/examples/" + id + ".jsx", files);
  dependencies("src/tokens.css", files);
  dependencies("src/sample.css", files);
  files["src/main.jsx"] = encode(
    `import React from 'react';\nimport {createRoot} from 'react-dom/client';\nimport './tokens.css';\nimport './sample.css';\nimport Example from './examples/${id}.jsx';\ncreateRoot(document.getElementById('root')).render(<main className="sample"><Example/></main>);\n`,
  );
  files["index.html"] = encode(
    html.replace("Кваркус Кит · Продажи автомобилей", title + " · Кваркус Кит"),
  );
  files["vite.config.js"] = encode("export default {base:'./'};\n");
  files["package.json"] = encode(
    JSON.stringify(
      {
        ...manifest,
        scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
      },
      null,
      2,
    ),
  );
  files["package-lock.json"] = bytes("package-lock.json");
  files["README.md"] = encode(
    "# " +
      title +
      "\n\nNode.js 22.12+, npm ci, npm run dev. Пример находится в src/examples/" +
      id +
      ".jsx. Для сборки — npm run build.\n\n" +
      fs.readFileSync("README.md", "utf8").split("## Материалы")[1],
  );
  fs.writeFileSync(output + "/" + id + ".zip", zipSync(files, { level: 6 }));
}
const files = {};
function add(folder) {
  for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
    const f = path.posix.join(folder, item.name);
    if (item.isDirectory()) add(f);
    else if (!f.endsWith("/room.jpg")) files[f] = bytes(f);
  }
}
add("src");
add("scripts");
if (fs.existsSync("docs/screenshots")) add("docs/screenshots");
for (const f of [
  "index.html",
  "public/preview.jpg",
  "guide.html",
  "sample.html",
  "package.json",
  "package-lock.json",
  "vite.config.js",
  "README.md",
  ".gitignore",
])
  files[f] = bytes(f);
fs.writeFileSync(output + "/kvarkus-kit.zip", zipSync(files, { level: 6 }));
console.log(
  "Packaged " + entries.length + " examples and full editable source.",
);
