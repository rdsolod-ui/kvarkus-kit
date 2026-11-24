let runtime;
async function source(name) {
  const res = await fetch("./downloads/" + name);
  if (!res.ok) throw Error("Не удалось загрузить пример");
  return res.text();
}
export async function standalone(entry) {
  runtime ??= Promise.all([
    source("preview-runtime.js"),
    source("preview-runtime.css"),
  ]).catch((e) => {
    runtime = null;
    throw e;
  });
  const [js, css] = await runtime;
  const { theme, accent } = document.documentElement.dataset;
  return (
    '<!doctype html>\n<html lang="ru" data-theme="' +
    theme +
    '" data-accent="' +
    accent +
    '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' +
    entry.title +
    " · Кваркус Кит</title><style>" +
    css.replace(/<\/style/gi, "<\\/style") +
    '</style></head><body><div id="root" data-example="' +
    entry.id +
    '" data-theme="' +
    theme +
    '" data-accent="' +
    accent +
    '"></div><script>' +
    js.replace(/<\/script/gi, "<\\/script") +
    "</script></body></html>"
  );
}
export function download(text, type, name) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
