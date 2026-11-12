import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";

// 12/11/2026 (Jéssica: "tudo que é da Pode Curtir somente na Pode Curtir"): este repositório é a fonte.
// Cada página chama o CSS e o JavaScript com ?v=<hash do arquivo>, para o navegador baixar o arquivo novo quando ele muda.
// Mudou um arquivo de assets/css ou assets/js? Rode: python3 _ferramentas/versao.py
const raiz = new URL("../", import.meta.url);
const paginas = [];
const varre = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name.startsWith("_")) continue;
    const p = new URL(e.name + (e.isDirectory() ? "/" : ""), dir);
    if (e.isDirectory()) varre(p); else if (e.name.endsWith(".html")) paginas.push(p);
  }
};
varre(raiz);

test("CSS e JavaScript com a versão do arquivo atual em todas as páginas", () => {
  let total = 0;
  for (const p of paginas) {
    for (const m of readFileSync(p, "utf8").matchAll(/(?:href|src)="(\/assets\/(?:css|js)\/[^"?]+\.(?:css|js))(\?v=([0-9a-f]+))?"/g)) {
      const h = createHash("sha256").update(readFileSync(new URL("." + m[1], raiz))).digest("hex").slice(0, 10);
      assert.equal(m[3], h, p.pathname + ": " + m[1] + " sem a versão atual; rode python3 _ferramentas/versao.py");
      total++;
    }
  }
  assert.ok(total > 10);
});
