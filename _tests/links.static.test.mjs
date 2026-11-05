import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";

// Todo link interno precisa apontar para um arquivo deste repositório.
// Páginas da Zethic (fale, privacidade, ferramentas) usam endereço completo https://zethic.net/...
const raiz = new URL("../", import.meta.url);
const paginas = [];
const varre = dir => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name.startsWith("_")) continue;
    const p = new URL(e.name + (e.isDirectory() ? "/" : ""), dir);
    if (e.isDirectory()) varre(p); else if (e.name.endsWith(".html") || e.name.endsWith(".css")) paginas.push(p);
  }
};
varre(raiz);

test("links e arquivos internos existem", () => {
  for (const p of paginas) {
    const texto = readFileSync(p, "utf8");
    const caminhos = [...texto.matchAll(/(?:href|src)="(\/[^"#?]*)|srcset="([^"]+)"|url\((\/[^)]+)\)/g)]
      .flatMap(m => m[2] ? m[2].split(",").map(s => s.trim().split(" ")[0]) : [m[1] || m[3]]);
    for (const c of caminhos) {
      const alvo = c.endsWith("/") ? c + "index.html" : c;
      assert.ok(existsSync(new URL("." + alvo, raiz)), `${p.pathname.split("/").slice(-2).join("/")}: ${c} não existe`);
    }
  }
});

test("nenhum link para o endereço antigo em zethic.net", () => {
  for (const p of paginas) {
    const texto = readFileSync(p, "utf8");
    assert.doesNotMatch(texto, /zethic\.net\/(en\/)?(jessicagessoli|podecurtir)\b/, p.pathname);
  }
});
