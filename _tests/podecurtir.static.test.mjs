import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const h = ler("index.html");

// Trazidos do zethic-site (_tests/podecurtir-trabalhos.static.test.mjs) quando a página ganhou endereço próprio (21/10/2026).
test("título direto, sem vídeos de demonstração", () => {
  assert.doesNotMatch(h, /class="reel"|class="trabalhos"|<video/);
  assert.match(h, /<h1>Produtora de foto, vídeo e redes sociais\.<\/h1>/);
  assert.doesNotMatch(h, /Você curte, a gente registra/);
});

// 28/10/2026 (decisão da Jéssica): a Pode Curtir não cita mais a Zethic.
test("visor da Pode Curtir, sem endosso da Zethic", () => {
  assert.match(ler("assets/img/podecurtir-icone.svg"), /fill="#FFD23F"/);
  assert.doesNotMatch(h, /marca da|parentOrganization|href="https:\/\/zethic\.net\/"/);
  assert.doesNotMatch(h, /zethic-marca\.svg/);
});

test("categoria clara, frente de redes sociais e preço da loja", () => {
  // 25/10/2026: o mercado é o Brasil inteiro, sem "em Campinas" no título. 28/10/2026: sem segurança na Pode Curtir.
  assert.match(h, /<title>Pode Curtir \| Produtora de foto, vídeo e redes sociais<\/title>/);
  assert.match(h, /<li id="redes">[\s\S]*Perfil Pronto[\s\S]*Gestão mensal/);
  assert.doesNotMatch(h, /Conta protegida|[Ss]eguran[çc]a|senha/);
  // 04/11/2026: a página inicial mostra preço (site = preço pronto) e leva à loja do próprio endereço.
  assert.match(h, /id="precos"/);
  assert.match(h, /href="\/loja\/#t-perfil"/);
});

test("endereço próprio: canônico e domínio", () => {
  assert.match(h, /<link rel="canonical" href="https:\/\/podecurtir\.zethic\.net\/">/);
  assert.equal(ler("CNAME").trim(), "podecurtir.zethic.net");
  assert.doesNotMatch(h, /zethic\.net\/podecurtir/);
});
