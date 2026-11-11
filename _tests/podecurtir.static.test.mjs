import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const h = ler("index.html");

// Trazidos do zethic-site (_tests/podecurtir-trabalhos.static.test.mjs) quando a página ganhou endereço próprio (21/10/2026).
test("título direto, sem vídeos de demonstração", () => {
  assert.doesNotMatch(h, /class="reel"|class="trabalhos"|<video/);
  // 07/11/2026: a página inicial é a loja; o título passou a ser a promessa do Perfil Pronto (igual ao zethic-site).
  assert.match(h, /<h1>Seu perfil pronto para vender, com preço fechado\.<\/h1>/);
  assert.doesNotMatch(h, /Você curte, a gente registra/);
});

// 28/10/2026 (decisão da Jéssica): a Pode Curtir não cita mais a Zethic.
test("visor da Pode Curtir, sem endosso da Zethic", () => {
  assert.match(ler("assets/img/podecurtir-icone.svg"), /fill="#FFD23F"/);
  assert.doesNotMatch(h, /marca da|parentOrganization|href="https:\/\/zethic\.net\/"/);
  // 11/11/2026 (pedido da Jéssica): a marca da Zethic aparece só como parceira, na seção de proteção e recuperação de conta, nunca como endosso da Pode Curtir.
  const semSecaoZethic = h.replace(/<section class="secao leve-junto" aria-labelledby="t-contas">[\s\S]*?<\/section>/, "");
  assert.doesNotMatch(semSecaoZethic, /zethic-marca\.svg/);
});

test("categoria clara, frente de redes sociais e preço da loja", () => {
  // 25/10/2026: o mercado é o Brasil inteiro, sem "em Campinas" no título. 28/10/2026: sem segurança na Pode Curtir.
  assert.match(h, /<title>Pode Curtir \| Perfil, redes, foto e vídeo com preço fechado<\/title>/);
  assert.match(h, /<li id="redes">[\s\S]*Perfil Pronto[\s\S]*Gestão mensal/);
  assert.doesNotMatch(h, /Conta protegida|[Ss]eguran[çc]a|senha/);
  // 07/11/2026: a loja fica na própria página inicial (#loja); /loja/ leva para lá com o mesmo trecho.
  assert.match(h, /id="loja"/);
  assert.match(h, /<a class="btn cheio" href="#loja"[^>]*>Escolher pelo meu Negócio<\/a>/);
});

test("endereço próprio: canônico e domínio", () => {
  assert.match(h, /<link rel="canonical" href="https:\/\/podecurtir\.zethic\.net\/">/);
  assert.equal(ler("CNAME").trim(), "podecurtir.zethic.net");
  assert.doesNotMatch(h, /zethic\.net\/podecurtir/);
});
