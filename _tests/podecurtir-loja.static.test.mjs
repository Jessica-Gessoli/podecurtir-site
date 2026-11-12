import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";

// Trazido do zethic-site em 12/11/2026, quando a Pode Curtir passou a ter a fonte aqui (decisão da Jéssica:
// "tudo que é da Pode Curtir somente na Pode Curtir"). Os caminhos antigos da fonte são lidos nos arquivos publicados.
const caminho = (p) => p === "_fontes/podecurtir.html" ? "index.html" : p.replace(/^_fontes\/podecurtir\//, "").replace(/^_marcas\/podecurtir-site\//, "");
const ler = (p) => readFileSync(new URL("../" + caminho(p), import.meta.url), "utf8");
const PAGINAS = ["_fontes/podecurtir.html", "_fontes/podecurtir/loja/obrigado/index.html", "_fontes/podecurtir/termos/index.html",
  "_fontes/podecurtir/privacidade/index.html", "_fontes/podecurtir/desistencia/index.html", "_fontes/podecurtir/parceiros/index.html"];
const JS = ["assets/js/podecurtir-config.js", "assets/js/podecurtir-comum.js", "assets/js/podecurtir-loja.js"];

// 03/11/2026 (aprovado pela Jéssica): a Pode Curtir vende pelo site. Preço publicado só na Pode Curtir.
test("configuração única, com pagamento e Pixel desligados até serem preenchidos", () => {
  const ctx = { window: {} };
  vm.runInNewContext(ler("assets/js/podecurtir-config.js"), ctx);
  const c = ctx.window.PODECURTIR;
  assert.deepEqual(Object.keys(c.ASAAS_LINKS).sort(),
    ["ajuste", "arrumado_cartao", "arrumado_pix", "completa", "essencial", "marca_cartao", "marca_pix", "padrao",
      "plus_gravacao", "plus_livro", "plus_mentoria", "plus_protecao", "plus_recuperacao", "plus_site_cartao", "plus_site_pix",
      // 08/11/2026: seção para especialistas, produtoras e empresas
      "acabamento", "diag_esp", "esp_marca", "esp_news", "esp_portavozes", "esp_produtora", "video_presenca",
      // 08/11/2026: seção para restaurantes, lanchonetes e bares
      "cardapio", "cardapio_mensal",
      // 09/11/2026 (D4): Portfólio da empresa
      "portfolio",
      // 10/11/2026: Tradução do cardápio, Catálogo Pronto e Cuidado do Catálogo
      "traducao", "catalogo", "catalogo_mensal",
      // 10/11/2026: Vídeo de conversa
      "conversa",
      // 11/11/2026: serviços da categoria Agência de marketing no Google
      "campanha", "anuncio", "relatorio",
      // 12/11/2026: itens novos (preços pelo mercado e Kit de Vendas)
      "diag_perfil", "teste3", "presenca4", "presenca8", "kit_catalogo", "kit_apresentacao", "kit_oferta"].sort());
  for (const v of Object.values(c.ASAAS_LINKS)) assert.ok(v === "" || /^https:\/\/(www\.)?asaas\.com\//.test(v), "link do Asaas inválido: " + v);
  assert.ok([497, 597].includes(c.PRECO_AJUSTE), "preço do Ajuste fora da escada aprovada em 12/11/2026");
  assert.ok(c.PIXEL_ID === "" || /^\d{10,20}$/.test(c.PIXEL_ID));
  assert.equal(c.WHATSAPP, "5519983310769");
  assert.equal(c.EMAIL, "podecurtir@zethic.net");
});

// 12/11/2026 (Jéssica): preços pelo mercado, com finais em 7 (documento "preços da loja pelo mercado").
test("preços pelo mercado, de 12/11/2026", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  assert.match(js, /preco: 997, parcelas: 3/);
  assert.match(js, /preco: 3997, parcelas: 6/);
  assert.match(js, /mensal: 997, depois/);
  assert.match(js, /mensal: 1797, depois/);
  assert.match(js, /mensal: 2997, depois/);
  assert.match(js, /R\$ 497 para os 3 primeiros clientes\. Depois, R\$ 597\./);
  assert.match(js, /id: "diag_perfil", nome: "Diagnóstico do perfil", preco: 97,/);
  assert.match(js, /id: "conversa", secao: "esp", nome: "Vídeo de conversa · 1 Reel", preco: 197,/);
  assert.match(js, /id: "teste3", secao: "esp", nome: "Vídeo de conversa · Teste de 3 Reels", preco: 397,/);
  for (const [id, v] of [["kit_catalogo", 297], ["kit_apresentacao", 797], ["kit_oferta", 1997]])
    assert.match(js, new RegExp(`id: "${id}", secao: "kit", nome: "[^"]+", preco: ${v},`));
  assert.match(js, /\$\("grade-kit"\)\.innerHTML/);
  assert.match(ler("_fontes/podecurtir.html"), /id="grade-kit"/);
  // finais em 7 (preço psicológico, Sebrae) em todo preço fechado da loja
  // O Site Essencial (R$ 3.000) é preço da Zethic e segue a página de compra da Zethic até a Jéssica decidir.
  for (const m of js.matchAll(/(?:preco|mensal): (\d+)/g)) if (m[1] !== "3000") assert.ok(/7$/.test(m[1]), "preço sem final 7: " + m[1]);
});

test("páginas de compra: CSP sem inline, identificação e links de termos, privacidade e desistência", () => {
  for (const p of PAGINAS) {
    const h = ler(p);
    const csp = h.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
    assert.ok(csp, p + ": sem CSP");
    assert.doesNotMatch(csp[1], /unsafe-inline|unsafe-eval/, p);
    assert.doesNotMatch(h, /<script>|style="|onclick=/, p + ": script ou estilo inline");
    assert.match(h, /R\. Teófilo Braga, 489, Sala 05/, p);
    assert.match(h, /podecurtir@zethic\.net/, p);
    assert.match(h, /98331-0769/, p);
    assert.match(h, /data-cnpj hidden|CNPJ 67\.678\.226\/0001-17/, p);
    assert.match(h, /href="\/termos\/"/, p);
    assert.match(h, /href="\/privacidade\/" data-link-privacidade/, p);
    assert.match(h, /href="\/desistencia\/"/, p);
  }
});

test("regras das marcas nas páginas de compra", () => {
  for (const p of [...PAGINAS, ...JS]) {
    const h = ler(p);
    assert.doesNotMatch(h, /golpe/i, p + ": a Pode Curtir não fala de golpe");
    assert.doesNotMatch(h, /\bPME\b|pequena e média empresa/i, p);
    assert.doesNotMatch(h, /\bMEI\b/, p + ": sem o rótulo MEI");
    // 11/11/2026 (Jéssica, decisão de 10/11/2026): a Água na Boca aparece no topo e na miniatura "Exemplo real" dos
    // cards (12/11/2026: a seção do caso saiu). Fora disso, nome de cliente continua proibido.
    const semCaso = p === "_fontes/podecurtir.html"
      ? h.replace(/<div class="hero pc-vitrine"[\s\S]*?<button type="button" class="pausa">/, "")
      : p === "assets/js/podecurtir-loja.js" ? h.replace(/var EXEMPLO = \{[\s\S]*?\n  \}/, "") : h;
    assert.doesNotMatch(semCaso, /Virgínia|Água na Boca|Lucinha|Excellent/i, p + ": sem nome de cliente fora do caso aprovado");
    assert.doesNotMatch(h, /Lucinha|Excellent/i, p);
  }
});

test("desistência: devolução integral em 7 dias (CDC art. 49); depois, retenção de 25% antes do início", () => {
  const t = ler("_fontes/podecurtir/termos/index.html");
  assert.match(t, /Em até 7 dias corridos da compra pela loja:<\/strong> você pode desistir/);
  assert.match(t, /recebe de volta o valor integral, como prevê o art\. 49 do Código de Defesa do Consumidor/);
  assert.match(t, /Depois de 7 dias, antes de o trabalho começar:<\/strong> o valor pago é devolvido com desconto de 25% do valor total do serviço/);
  assert.match(t, /Depois de 7 dias, com o trabalho em andamento:<\/strong> o valor pago cobre o trabalho já feito/);
  const d = ler("_fontes/podecurtir/desistencia/index.html");
  assert.match(d, /id="form-desistencia"/);
  assert.match(d, /em até 7 dias corridos da compra, sem dar motivo, e recebe o valor integral/);
  assert.match(d, /desconto de 25% do valor total do serviço/);
  assert.match(ler("_fontes/podecurtir/loja/obrigado/index.html"), /Em até 7 dias corridos da compra/);
  assert.match(ler("assets/js/podecurtir-loja.js"), /em até 7 dias corridos da compra, pela página Desistir de uma compra, com devolução integral/);
  for (const p of ["_fontes/podecurtir/termos/index.html", "_fontes/podecurtir/desistencia/index.html", "_fontes/podecurtir/loja/obrigado/index.html", "assets/js/podecurtir-loja.js"]) {
    assert.doesNotMatch(ler(p), /Antes de o trabalho começar, você pode desistir|desistir antes de o trabalho começar, sem dar motivo/, p);
  }
});

test("CNPJ preenchido na configuração, sem o rótulo MEI", () => {
  const c = ler("assets/js/podecurtir-config.js");
  assert.match(c, /CNPJ: "\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}"/);
  assert.doesNotMatch(c, /\bMEI\b/);
});

// 04/11/2026: GA4 e Pixel da Meta só depois do aceite; aviso de cookies só com um dos dois configurado.
test("medição só depois do aceite e aviso de cookies só com GA4 ou Pixel configurado", () => {
  const js = ler("assets/js/podecurtir-comum.js");
  assert.match(js, /if \(!medicaoValida\(\)\) return;/);
  assert.match(js, /if \(v === "aceito"\) carregarMedicao\(\); else if \(v !== "recusado"\) banner\(\);/);
  assert.match(js, /function carregarMedicao\(\) \{ carregarPixel\(\); carregarGA\(\); \}/);
  assert.match(js, /allow_google_signals: false/);
  assert.match(js, /"Rejeitar todos"/);
  const ctx = { window: {} };
  vm.runInNewContext(ler("assets/js/podecurtir-config.js"), ctx);
  const ga = ctx.window.PODECURTIR.GA4_ID;
  assert.ok(ga === "" || /^G-[A-Z0-9]{4,20}$/.test(ga), "GA4_ID inválido");
  const priv = ler("_fontes/podecurtir/privacidade/index.html");
  assert.match(priv, /Google Analytics, só se você aceitar/);
});

// 04/11/2026 (pedido da Jéssica: o site como máquina de vendas; decisão de 04/11 "site = preço pronto"): a página
// inicial passa a mostrar preço. Substitui a regra de 21/10/2026 "nenhum preço na página inicial". O preço da página
// inicial precisa ser o mesmo da loja: mudou na loja, muda aqui.
// 07/11/2026 (aprovado pela Jéssica): página única de venda. A loja entra na página inicial, no lugar dos cartões
// de preço que repetiam a loja (substitui a regra de 04/11 "preço da página inicial igual ao da loja": agora o preço
// existe num lugar só). /podecurtir/loja/ leva para /podecurtir#loja, com o mesmo trecho.
test("página única: loja na página inicial, comprar antes do WhatsApp e endereço antigo levando para lá", () => {
  const h = ler("_fontes/podecurtir.html");
  // 12/11/2026: o topo virou destaques no modelo da Zethic; a chamada principal fica no destaque 1.
  const hero = h.split('<div class="hero pc-vitrine"')[1].split('aria-label="2 de 3')[0];
  // 10/11/2026 (Jéssica): a chamada principal leva à escolha pelo tipo de Negócio, no topo da loja.
  // 12/11/2026 (benchmark): um botão de destaque por tela; o WhatsApp no topo vira link, depois do botão de compra.
  assert.match(hero, /<a class="btn cheio" href="#loja"[^>]*>Escolher pelo meu Negócio<\/a>\s*<a class="link-claro" href="https:\/\/wa\.me\/5519983310769\?text=[^"]+"/);
  assert.doesNotMatch(h, /class="oferta"/, "cartões de preço repetidos voltaram");
  for (const id of ['id="loja"', 'id="vista-loja"', 'id="vista-checkout" hidden', 'id="grade-perfil"', 'id="grade-contas"', 'id="grade-planos"',
    'id="lista-propostas"', 'id="carrinho"', 'id="ir-carrinho"', 'id="tipos-opcoes"', 'id="link-obrigado" href="/loja/obrigado/"'])
    assert.ok(h.includes(id), "falta " + id);
  assert.match(h, /<script src="\/assets\/js\/podecurtir-loja\.js(\?v=[0-9a-f]{10})?" defer><\/script>/);
  assert.match(h, /href="#loja"[^>]*>Comprar online/);
  assert.match(h, /Preço de fundador: 3 vagas por serviço, em troca de depoimento/);
  assert.equal((h.match(/<h1[ >]/g) || []).length, 1, "uma h1 só");
  assert.doesNotMatch(h, /href="\/loja\/"/);
  // identificação também na página inicial (Decreto 7.962/2013, art. 2º)
  assert.match(h, /R\. Teófilo Braga, 489, Sala 05/);
  assert.match(h, /CNPJ 67\.678\.226\/0001-17/);
  assert.match(h, /href="\/parceiros\/">Seja parceiro/);
  const r = ler("_fontes/podecurtir/loja/index.html");
  assert.match(r, /<meta name="robots" content="noindex, follow">/);
  // 10/11/2026 (Jéssica): o endereço oficial no Google é podecurtir.zethic.net.
  assert.match(r, /<link rel="canonical" href="https:\/\/podecurtir\.zethic\.net\/">/);
  assert.match(r, /<meta http-equiv="refresh" content="0; url=https:\/\/podecurtir\.zethic\.net\/#loja">/);
  assert.match(r, /<script src="\/assets\/js\/podecurtir-redireciona\.js(\?v=[0-9a-f]{10})?"><\/script>/);
  // 08/11/2026: os parâmetros (?interno=1, utm_*, negocio) vão junto para o destino.
  assert.match(ler("assets/js/podecurtir-redireciona.js"), /location\.replace\(c\.href\.split\("#"\)\[0\]\.split\("\?"\)\[0\] \+ location\.search \+ \(location\.hash && location\.hash\.length > 1 \? location\.hash : "#loja"\)\)/);
  assert.doesNotMatch(ler("sitemap.xml"), /podecurtir\/loja\//);
  // review do PR #106: link para um trecho da página, no fechamento, volta à loja antes de rolar; faixa final legível no escuro
  const js = ler("assets/js/podecurtir-loja.js");
  assert.match(js, /if \(!alvo \|\| !\$\("vista-loja"\)\.contains\(alvo\) \|\| !\$\("vista-loja"\)\.hidden\) return false;/);
  assert.match(js, /window\.addEventListener\("hashchange", function \(\) \{ irPara\(location\.hash\); \}\);/);
});

// 07/11/2026 (pedido da Jéssica: as cores não mudam no celular em modo escuro): toda a Pode Curtir é sempre clara.
test("Pode Curtir sempre clara, sem modo escuro", () => {
  assert.doesNotMatch(ler("assets/css/podecurtir-loja.css"), /prefers-color-scheme/);
  assert.doesNotMatch(ler("assets/css/podecurtir.css"), /prefers-color-scheme/);
  for (const f of ["_fontes/podecurtir.html", "_fontes/podecurtir/termos/index.html", "_fontes/podecurtir/privacidade/index.html",
    "_fontes/podecurtir/desistencia/index.html", "_fontes/podecurtir/parceiros/index.html", "_fontes/podecurtir/loja/obrigado/index.html"]) {
    assert.match(ler(f), /<meta name="color-scheme" content="light">/, f);
  }
});

// 07/11/2026 (pedido da Jéssica: as páginas se ligam de frente para trás e de trás para frente): o mesmo mapa no
// rodapé de todas as páginas e um bloco "Continue por aqui" no fim de cada página de apoio, sempre com a volta à loja.
test("páginas ligadas nos dois sentidos", () => {
  const todas = ["_fontes/podecurtir.html", ...PAGINAS.slice(1)];
  const mapa = ['href="/#loja"', 'href="/#como"', 'href="/#duvidas"', 'href="/termos/"',
    'href="/privacidade/" data-link-privacidade', 'href="/desistencia/"', 'href="/parceiros/"'];
  for (const p of todas) {
    const rodape = ler(p).split('<footer class="ident">')[1];
    assert.ok(rodape, p + ": sem rodapé");
    const linha = rodape.split('<p class="mapa">')[1];
    assert.ok(linha, p + ": sem mapa no rodapé");
    for (const m of mapa) assert.ok(linha.split("</p>")[0].includes(m), p + ": mapa sem " + m);
    assert.doesNotMatch(ler(p), /href="\/loja\/(#[^"]*)?"/, p + ": link para o endereço antigo da loja");
  }
  for (const p of PAGINAS.slice(1)) {
    const seguir = ler(p).split('<nav class="wrap seguir" aria-label="Continue por aqui">')[1];
    assert.ok(seguir, p + ": sem Continue por aqui");
    assert.match(seguir.split("</nav>")[0], /href="\/#(loja|como)"/, p);
  }
  const h = ler("_fontes/podecurtir.html");
  for (const destino of ["/termos/", "/privacidade/", "/desistencia/", "/parceiros/"])
    assert.ok(h.split('<footer class="ident">')[0].includes('href="' + destino + '"'), "página inicial sem link no conteúdo para " + destino);
});

// 04/11/2026: página de parceiros sem promessa de renda, sem cara de emprego e com a regra de publicidade do CONAR.
test("seja parceiro: sem promessa de renda, sem vínculo e com marcação de publicidade", () => {
  const h = ler("_fontes/podecurtir/parceiros/index.html");
  assert.match(h, /Sem vínculo de emprego, sem horário e sem exclusividade/);
  assert.match(h, /Não há promessa de volume de pedidos nem de renda/);
  assert.match(h, /#publi/);
  assert.doesNotMatch(h, /R\$ ?\d|ganhe até|renda extra garantida/i);
});

test("loja: preço de fundador só nos itens a preço de fundador, aceite zerado quando o pedido muda e nada se perde sem registro", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  assert.match(js, /fundador: PRECO_AJUSTE === 497/);
  assert.match(js, /if \(t\.fundador && !\$\("fundador"\)\.checked\)/);
  assert.match(js, /\$\("fundador-campo"\)\.hidden = !t\.fundador;/);
  assert.doesNotMatch(js, /t\.pagos\.length && !\$\("fundador"\)/);
  assert.match(js, /if \(resumo !== resumoAceito\) \{ \$\("aceite"\)\.checked = false;/);
  assert.match(js, /if \(ok\) \{ marcarPagamento\(t\.hoje\); location\.href = url; \}\s*else manual\(/);
  assert.doesNotMatch(js, /registrar\(pedido\); location\.href = url;/);
});

// 04/11/2026 (decisões da Jéssica): no site, preço pronto e pagamento integral; parcelado só no cartão, com um link
// para Pix ou boleto à vista e outro para cartão; a Gestão Completa é vendida no site, com assinatura; WhatsApp para orçamento.
test("site: pagamento integral, parcelado só no cartão e Gestão Completa com assinatura", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  assert.match(js, /function linkDe\(p\) \{ return LINKS\[p\.parcelas \? p\.id \+ "_" \+ forma\(\) : p\.id\]; \}/);
  assert.match(js, /&& !forma\(\)\) falta\.push\("forma de pagamento"\)/);
  assert.doesNotMatch(js, /p\.agora|t\.saldo|Entrada de 50%|saldo antes da entrega/);
  const propostas = js.split("var PROPOSTAS")[1].split("];")[0];
  assert.doesNotMatch(propostas, /Gestão Completa/);
  const loja = ler("_fontes/podecurtir.html");
  assert.match(loja, /<input type="radio" id="forma-pix" name="forma" value="pix">/);
  assert.match(loja, /<input type="radio" id="forma-cartao" name="forma" value="cartao">/);
  assert.match(loja, /por Pix, boleto ou cartão/);
  const t = ler("_fontes/podecurtir/termos/index.html");
  assert.doesNotMatch(t, /entrada de 50%|gestão Completa\)/i);
  assert.match(t, /Perfil Arrumado pode ser parcelado em até 3x e a Marca Completa em até 6x, sem juros/);
  const ctx = { window: {} };
  vm.runInNewContext(ler("assets/js/podecurtir-config.js"), ctx);
  for (const [k, v] of Object.entries(ctx.window.PODECURTIR.ASAAS_LINKS)) {
    if (k.startsWith("plus_") && v === "") continue; // plus: "pagamento em configuração" até o link existir
    // 08/11/2026: itens da seção para especialistas também ficam em configuração até a Jéssica criar os links
    if (["diag_esp", "video_presenca", "acabamento", "esp_marca", "esp_produtora", "esp_news", "esp_portavozes"].includes(k) && v === "") continue;
    // 08/11/2026: cardápio de restaurante, em configuração até a Jéssica criar os links
    if (["cardapio", "cardapio_mensal"].includes(k) && v === "") continue;
    // 09/11/2026 (D4): Portfólio da empresa, em configuração até a Jéssica criar o link
    if (k === "portfolio" && v === "") continue;
    // 10/11/2026: Vídeo de conversa, em configuração até a Jéssica criar o link
    if (k === "conversa" && v === "") continue;
    // 11/11/2026: campanha, revisão de anúncio e relatório mensal, em configuração até a Jéssica criar os links
    if (["campanha", "anuncio", "relatorio"].includes(k) && v === "") continue;
    // 12/11/2026: itens novos, em configuração até a Jéssica criar os links
    if (["diag_perfil", "teste3", "presenca4", "presenca8", "kit_catalogo", "kit_apresentacao", "kit_oferta"].includes(k) && v === "") continue;
    assert.match(v, /^https:\/\/www\.asaas\.com\/000\/c\/[a-z0-9]{16}$/, k);
  }
});

// 04/11/2026 (decisão da Jéssica, Ficha v1.17): plus no fechamento do pedido, marcado pelo cliente, com escopo e preço
// fechados; os feitos em parceria em linha separada, com o nome de quem faz; trabalhos maiores seguem por proposta.
test("plus no fechamento: preços aprovados, só com serviço pago, parceria identificada e aceite renovado", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  const plus = js.split("var PLUS = [")[1].split("];")[0];
  assert.match(plus, /id: "plus_gravacao", marca: "pc", nome: "Sessão de fotos de 1 hora", preco: 497,/);
  assert.match(plus, /id: "plus_livro", marca: "pc", nome: "Capa e diagramação do e-book", preco: 997,/);
  assert.match(plus, /id: "plus_protecao", marca: "ze", nome: "Proteção das contas", preco: 397,/);
  assert.match(plus, /id: "plus_mentoria", marca: "jg", nome: "Monte o seu fluxo com IA · 1 hora", preco: 297,/);
  assert.match(plus, /id: "plus_site", marca: "ze", nome: "Site Essencial", preco: 3000, parcelas: 3, em: "no", fundador: true,/);
  assert.match(js, /var plus = PLUS\.filter\(function \(p\) \{ return tem\(cart\.plus, p\.id\) && \(principal \|\| p\.avulso\) && !\(p\.id === "plus_protecao" && bonusValido\(\)\); \}\);/);
  assert.match(js, /" \(" \+ COM\[p\.marca\] \+ ", em parceria; o seu contato continua sendo a Pode Curtir\)"/);
  assert.match(js, /var COM = \{ jg: "com Jéssica Gessoli", ze: "com a Zethic" \};/);
  assert.match(js, /\$\("plus-lista"\)\.addEventListener\("change"/);
  assert.match(js, /if \(resumo !== resumoAceito\) \{ \$\("aceite"\)\.checked = false;/);
  const loja = ler("_fontes/podecurtir.html");
  assert.match(loja, /<fieldset id="plus-campo" hidden>/);
  assert.match(loja, /<div class="plus-lista" id="plus-lista"><\/div>/);
  const t = ler("_fontes/podecurtir/termos/index.html");
  assert.match(t, /<strong>Plus no fechamento do pedido:<\/strong>/);
  assert.match(t, /O Site Essencial pode ser parcelado em até 3x no cartão de crédito, sem juros/);
});

// 06/11/2026 (protótipo aprovado pela Jéssica): tipo de Negócio com sugestão; segurança das contas vendida sozinha,
// feita por Jéssica Gessoli em parceria, sem promessa de recuperar a conta; preço depois das vagas de fundador em cada item.
test("tipos de Negócio, segurança das contas avulsa e preço depois das vagas de fundador", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  for (const id of ["doceria", "salao", "consultorio", "outro"]) assert.match(js, new RegExp('id: "' + id + '"'));
  assert.match(js, /regra de publicidade do seu conselho profissional/);
  const plus = js.split("var PLUS = [")[1].split("];")[0];
  assert.match(plus, /id: "plus_protecao", marca: "ze", nome: "Proteção das contas", preco: 397, avulso: true,/);
  assert.match(plus, /id: "plus_recuperacao", marca: "ze", nome: "Recuperação de conta", preco: 397, avulso: true,/);
  assert.match(plus, /não há garantia de recuperação/);
  // 07/11/2026 (pedido da Jéssica): e-book e mentoria em IA também se compram sozinhos, na seção "Livro e IA".
  assert.doesNotMatch(plus, /id: "plus_(gravacao|site)"[^}]*avulso: true/);
  assert.match(plus, /id: "plus_livro"[^}]*avulso: true, secao: "conteudo"/);
  assert.match(plus, /id: "plus_mentoria"[^}]*avulso: true, secao: "ia"/);
  assert.match(ler("_fontes/podecurtir.html"), /<div class="grade" id="grade-ia"><\/div>/);
  assert.match(ler("_fontes/podecurtir.html"), /<div class="grade" id="grade-conteudo"><\/div>/);
  assert.match(js, /id: "produto_digital", marca: "pc", nome: "Produto digital e curso online"/);
  assert.match(js, /Depois, R\$ 1\.297\./);
  assert.match(js, /Depois, R\$ 4\.997\./);
  assert.match(js, /A partir do 4º cliente, R\$ 1\.297 por mês\./);
  assert.match(js, /A partir do 4º cliente, R\$ 2\.197 por mês\./);
  assert.match(js, /A partir do 4º cliente, R\$ 3\.997 por mês\./);
  const loja = ler("_fontes/podecurtir.html");
  assert.match(loja, /<div class="tipos-opcoes" id="tipos-opcoes"><\/div>/);
  assert.match(loja, /<div class="grade" id="grade-contas"><\/div>/);
  assert.match(loja, /Feitas pela Zethic, em parceria\. Você leva só se quiser, junto com o seu pedido ou sozinhas\. O seu contato continua sendo a Pode Curtir\./);
  const ctx = { window: {} };
  vm.runInNewContext(ler("assets/js/podecurtir-config.js"), ctx);
  assert.ok("plus_recuperacao" in ctx.window.PODECURTIR.ASAAS_LINKS);
  const t = ler("_fontes/podecurtir/termos/index.html");
  assert.match(t, /também podem ser compradas sozinhas, na faixa Leve junto, da Zethic; nenhuma compra depende delas/);
});

// 07/11/2026 (benchmark de publicidade, aprovado pela Jéssica): compra medida na confirmação, tipo e item medidos na
// loja, e link por persona (?negocio=) que abre a loja com a sugestão pronta.
test("medição de compra e link por persona", () => {
  const loja = ler("assets/js/podecurtir-loja.js");
  const comum = ler("assets/js/podecurtir-comum.js");
  assert.match(loja, /new URLSearchParams\(location\.search\)\.get\("negocio"\)/);
  assert.match(loja, /medir\("EscolheuTipo"/);
  assert.match(loja, /medir\("AddToCart"/);
  assert.match(loja, /if \(ok\) \{ marcarPagamento\(t\.hoje\); location\.href = url; \}/);
  // review do PR #111: valor do item clicado, marca também no checkout único e mede o plus do fechamento
  assert.match(loja, /if \(a\) marcarPagamento\(Number\(a\.getAttribute\("data-valor"\)\) \|\| 0\);/);
  assert.match(loja, /data-valor="' \+ p\.valor \+ '"/);
  assert.match(loja, /\{ marcarPagamento\(t\.hoje\); location\.href = j\.url; \}/);
  assert.match(loja, /cart\.plus\.push\(id\); medir\("AddToCart", \{ content_name: id \}\);/);
  assert.match(comum, /AddToCart: "add_to_cart", EscolheuTipo: "escolheu_tipo"/);
  assert.match(comum, /window\.podecurtirEvento\("Purchase", \{ value: p\.valor, currency: "BRL" \}\)/);
  assert.match(comum, /Date\.now\(\) - p\.em < 7 \* 24 \* 3600 \* 1000/);
});

// 07/11/2026 (pedido da Jéssica): campanhas automáticas até o Carnaval, trocadas pela data de São Paulo.
test("campanhas mudam sozinhas pela data e somem depois de 25/01/2027", () => {
  const js = ler("assets/js/podecurtir-comum.js");
  const arr = js.split("var CAMPANHAS = ")[1].split("];")[0] + "]";
  const fn = js.match(/function campanhaPara\(dia\) \{[\s\S]*?return null;\n  \}/)[0];
  const ctx = {};
  vm.runInNewContext("var CAMPANHAS = " + arr + ";\n" + fn + "\nthis.f = campanhaPara;", ctx);
  const id = (d) => { const c = ctx.f(d); return c ? c.id : null; };
  assert.equal(id("2026-11-08"), null);
  assert.equal(id("2026-11-09"), "onda1");
  assert.equal(id("2026-11-20"), "onda1");
  assert.equal(id("2026-11-21"), null);
  assert.equal(id("2026-11-27"), "onda2");
  assert.equal(id("2026-12-23"), "onda3");
  assert.equal(id("2026-12-31"), "pausa");
  assert.equal(id("2027-01-15"), "onda4");
  assert.equal(id("2027-01-25"), "onda4b");
  assert.equal(id("2027-01-26"), null);
  assert.equal(id("2027-02-09"), null);
  // sem número de vagas nem preço que dependa de vaga nos textos
  assert.doesNotMatch(arr, /R\$ (500|750|1\.200)|vagas? restam/);
  assert.match(js, /timeZone: "America\/Sao_Paulo"/);
  assert.match(js, /function iniciar\(\) \{ aplicarCampanha\(\);/);
  const loja = ler("assets/js/podecurtir-loja.js");
  // 08/11/2026: o bônus continua só nos 3 planos de Gestão da campanha, não nos planos novos para especialistas
  assert.match(loja, /c\.bonus && \(tem\(cart\.proj, "arrumado"\) \|\| tem\(cart\.proj, "marca"\) \|\| tem\(GESTAO, cart\.plano\)\)/);
  assert.match(loja, /var GESTAO = \["essencial", "padrao", "completa"\];/);
  assert.match(loja, /Bônus Black Friday: Proteção das contas incluída, sem custo \(campanha até 30\/11\)\./);
  assert.match(ler("assets/css/podecurtir-loja.css"), /\.campanha\{background:var\(--flash\)/);
  // review do PR #117: loja certa no site próprio, Proteção paga some com o bônus, bônus vai no pedido registrado
  assert.match(js, /document\.querySelector\('a\[href\$="#loja"\]'\)/);
  assert.match(loja, /!\(p\.id === "plus_protecao" && bonusValido\(\)\)/);
  assert.match(loja, /bonus: bonusValido\(\) \? \["plus_protecao"\] : \[\]/);
});

// 08/11/2026 (Jéssica: "Vamos subir todos no site", com benchmark de mercado e de lucro): 9 produtos para
// especialistas, produtoras e empresas. Preço de fundador e preço depois em cada um; Blog (Zethic) e Licença como
// pedido de proposta com valor de referência; Gestão de marca de especialista com 1 vaga de fundador.
test("seção para especialistas, produtoras e empresas: preços aprovados e regras das marcas", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  const proj = js.split("var PROJ = [")[1].split("];")[0];
  const planos = js.split("var PLANOS = [")[1].split("];")[0];
  const props = js.split("var PROPOSTAS = [")[1].split("];")[0];
  assert.match(proj, /id: "diag_esp", secao: "esp", nome: "Diagnóstico de marca de especialista", preco: 497,[^}]*Depois, R\$ 697\./);
  assert.match(proj, /id: "video_presenca", secao: "esp", nome: "Presença em vídeo · treino individual", preco: 1497,[^}]*Depois, R\$ 2\.497\./);
  assert.match(proj, /id: "acabamento", secao: "esp", nome: "Acabamento de vídeo · 4 vídeos", preco: 397,[^}]*Depois, R\$ 497/);
  // 10/11/2026 (descoberta "Edição de vídeo com IA" aprovada): Vídeo de conversa, R$ 450 de fundador e R$ 700 depois,
  // com IA informada e a autorização de quem aparece, que também está nos termos
  assert.match(proj, /id: "conversa", secao: "esp", nome: "Vídeo de conversa · 1 Reel", preco: 197,[^}]*Teste de 3 Reels sai por R\$ 397\.[^}]*Edição com apoio de IA, sem mudar o que foi dito\.[^}]*autorização de todos que aparecem ou falam/);
  assert.match(js, /conversa: "Para uma boa conversa virar vídeo para as redes, sem você editar\."/);
  assert.match(ler("_fontes/podecurtir/termos/index.html"), /Pessoas que aparecem ou falam:<\/strong> quando você envia material/);
  assert.match(planos, /id: "esp_marca", secao: "esp", nome: "Gestão de marca de especialista", mensal: 4997, depois: "Preço de fundador para 1 cliente\. Depois, R\$ 6\.997 por mês\."/);
  assert.match(planos, /id: "esp_produtora", secao: "esp", nome: "Coordenação da sua produtora", mensal: 1997,[^}]*R\$ 2\.497 por mês/);
  assert.match(planos, /id: "esp_news", secao: "esp", nome: "Newsletter pronta · 2 edições por mês", mensal: 1197,[^}]*R\$ 1\.497 por mês/);
  assert.match(planos, /id: "esp_portavozes", secao: "esp", nome: "Programa de porta-vozes · 2 porta-vozes", mensal: 3997,[^}]*R\$ 4\.997 por mês[^}]*10% de desconto a partir do 3º e 15% a partir do 5º/);
  assert.match(props, /id: "blog", marca: "ze", nome: "Blog que publica sozinho",[^}]*a partir de R\$ 1\.500 \(preço de fundador\)/);
  assert.match(props, /id: "licenca", marca: "pc", nome: "Licença do método de produção",[^}]*A partir de R\$ 2\.400 por ano \(preço de fundador\); renovação anual de R\$ 1\.200/);
  assert.match(js, /id: "especialista", nome: "Especialista, consultor ou palestrante", proj: \["diag_esp"\]/);
  // a seção não usa número de vídeos por hora de gravação nem cita área técnica do piloto
  assert.doesNotMatch(js, /vídeos em 4 horas|Cibersegurança/);
  assert.match(js, /\$\("grade-esp"\)\.innerHTML = daSecao\(PROJ, "esp"\)\.map\(cardProj\)\.join\(""\) \+ daSecao\(PLANOS, "esp"\)\.map\(cardPlano\)\.join\(""\);/);
  const loja = ler("_fontes/podecurtir.html");
  assert.match(loja, /<h2 id="t-esp">Para especialistas, produtoras e empresas<\/h2>/);
  assert.match(loja, /<div class="grade" id="grade-esp"><\/div>/);
  const termos = ler("_fontes/podecurtir/termos/index.html");
  assert.match(termos, /Versão de 12\/11\/2026/);
  assert.match(termos, /Para especialistas, produtoras e empresas:<\/strong> Diagnóstico de marca de especialista, Presença em vídeo, Acabamento de vídeo e Vídeo de conversa têm pagamento integral/);
});

// 08/11/2026 (review do podecurtir-site #3): a compra conta até 7 dias depois da ida ao Asaas, porque o boleto vence em 2 dias úteis.
test("compra: janela de atribuição cobre o prazo do boleto", () => {
  const js = ler("assets/js/podecurtir-comum.js");
  assert.match(js, /Date\.now\(\) - p\.em < 7 \* 24 \* 3600 \* 1000\)/);
  assert.doesNotMatch(js, /48 \* 3600 \* 1000/);
  assert.match(ler("_fontes/podecurtir/termos/index.html"), /vence 2 dias úteis depois de gerado/);
});

// 08/11/2026 (Jéssica): proteção e recuperação de conta são da Zethic, numa faixa "Leve junto · opcional" com as cores
// da Zethic, depois do portfólio da Pode Curtir. "Venda casada" nunca aparece no site (CDC, art. 39, I).
test("faixa Leve junto da Zethic: separada do portfólio, opcional e sem venda casada", () => {
  const h = ler("_fontes/podecurtir.html"), js = ler("assets/js/podecurtir-loja.js"), css = ler("assets/css/podecurtir-loja.css");
  assert.match(h, /<section class="secao leve-junto" aria-labelledby="t-contas">[\s\S]*<span class="selo ze">ZETHIC<\/span>Leve junto · opcional[\s\S]*Feitas pela Zethic, em parceria/);
  assert.ok(h.indexOf('id="t-esp"') < h.indexOf('id="t-contas"') && h.indexOf('id="t-contas"') < h.indexOf('id="t-propostas"'), "faixa depois do portfólio e antes dos pedidos de proposta");
  assert.match(js, /id: "protecao", marca: "ze", nome: "Proteção das contas da equipe inteira"/);
  assert.match(css, /\.leve-junto\{background:#02041A;/);
  // Review do Codex no #124: o pedido avulso leva a seção, para a mensagem dizer "Leve junto (Zethic)".
  assert.match(js, /marca: p\.marca, secao: p\.secao \|\| "" \}\);/);
  for (const f of ["_fontes/podecurtir.html", "assets/js/podecurtir-loja.js", "assets/js/podecurtir-comum.js", "_fontes/podecurtir/termos/index.html"])
    assert.doesNotMatch(ler(f).replace(/No site nunca se usa "venda casada"/, ""), /venda casada/i, f);
  assert.doesNotMatch(h + js + ler("assets/js/podecurtir-comum.js"), /(Proteção das contas|Recuperação de conta)[^<"]{0,80}Jéssica Gessoli|feita por Jéssica Gessoli/);
});

// 08/11/2026 (revisão de publicidade pedida pela Jéssica): cada item diz para que serve, sem prometer resultado;
// a escada Perfil Pronto → Gestão mensal fica junta, e Livro e IA vai para depois dos especialistas.
test("Pode Curtir: benefício por item sem promessa e ordem da loja", () => {
  const h = ler("_fontes/podecurtir.html");
  const js = ler("assets/js/podecurtir-loja.js");
  const para = js.match(/var PARA = \{[\s\S]*?\n  \};/)[0];
  for (const id of ["ajuste", "arrumado", "marca", "essencial", "padrao", "completa", "plus_recuperacao"]) assert.match(para, new RegExp("\\b" + id + ": \"Para "), id);
  assert.doesNotMatch(para, /garant|[Ss]eguran[çc]a|golpe|seguidores|vendas? garantid|mais vendas|\d+ ?%/);
  // 12/11/2026 (remodelação): o benefício fica à vista logo depois do preço; a descrição abre em "Ver o que está incluído".
  assert.match(js, /"<\/p>" \+ beneficio\(p\) \+/);
  assert.match(js, /detalhes\("<p>" \+ p\.desc \+ "<\/p>"/);
  assert.match(js, /<details class="detalhes"><summary>Ver o que está incluído<\/summary>/);
  assert.doesNotMatch(js, /checagem básica de segurança/);
  assert.ok(h.indexOf('id="t-perfil"') < h.indexOf('id="t-planos"') && h.indexOf('id="t-planos"') < h.indexOf('id="t-esp"') && h.indexOf('id="t-esp"') < h.indexOf('id="t-conteudo"') && h.indexOf('id="t-conteudo"') < h.indexOf('id="t-contas"'));
  assert.match(h, /<summary>Vocês garantem seguidores ou vendas\?<\/summary>\s*<p>Não\./);
  assert.match(h, /tem 7 dias para desistir, com devolução integral\.<\/p>/);
});

// 08/11/2026 (Jéssica aprovou): cardápio de restaurante. Pode Curtir vende e cuida do conteúdo; página e app
// (instalável pelo navegador) pela Zethic, em parceria. Projeto R$ 1.500 (depois R$ 2.400); mensal R$ 290 (depois R$ 460).
test("Pode Curtir: cardápio de restaurante com a Zethic em parceria", () => {
  const h = ler("_fontes/podecurtir.html");
  const js = ler("assets/js/podecurtir-loja.js");
  const cfg = ler("assets/js/podecurtir-config.js");
  assert.match(js, /id: "cardapio", secao: "rest", nome: "Cardápio Pronto", preco: 997, prazo: "10 dias úteis", fundador: true,/);
  assert.match(js, /Depois, R\$ 1\.197\."[\s\S]*Página e app feitos pela Zethic, em parceria\./);
  assert.match(js, /id: "cardapio_mensal", secao: "rest", nome: "Cuidado do Cardápio", mensal: 197, depois: "[^"]*Depois, R\$ 297 por mês\."/);
  assert.match(js, /id: "restaurante", nome: "Restaurante, lanchonete ou bar", proj: \["cardapio"\]/);
  assert.match(js, /\$\("grade-rest"\)\.innerHTML = daSecao\(PROJ, "rest"\)/);
  assert.match(h, /<h2 id="t-rest">Para restaurantes, lanchonetes e bares<\/h2><p>[^<]*feitos pela Zethic, em parceria; o seu contato continua sendo a Pode Curtir\. <a href="\/cardapio\/exemplo\/"[^>]*>Veja um cardápio de exemplo<\/a> ou <a href="\/cardapio\/exemplo-delivery\/"[^>]*>um de delivery<\/a>\.<\/p>/);
  // 08/11/2026 (aprovado pela Jéssica): cozinhas de delivery, sem salão, também citadas no subtítulo.
  assert.match(h, /Também para cozinhas de delivery, sem salão: o cardápio vira o link de pedidos no WhatsApp e no Instagram\./);
  assert.ok(h.indexOf('id="t-planos"') < h.indexOf('id="t-rest"') && h.indexOf('id="t-rest"') < h.indexOf('id="t-esp"'));
  assert.match(cfg, /cardapio: "[^"]*",\s*cardapio_mensal: "[^"]*"/);
  assert.match(ler("_fontes/podecurtir/termos/index.html"), /<strong>Para restaurantes, lanchonetes e bares:<\/strong>/);
  // 08/11/2026 (Jéssica aprovou): 1 troca = 1 item; pacote avulso de 5 trocas por R$ 90; 12 meses no ar incluídos,
  // depois R$ 120 por ano ou sem custo com o Cuidado; no encerramento, o cliente recebe a planilha e o PDF.
  assert.match(js, /12 meses no ar incluídos\./);
  // D1 (08/11/2026): cardápio impresso da entrada e link no Perfil da Empresa no Google, sem mudar o preço.
  assert.match(js, /cardápio impresso para a entrada \(PDF pronto para a gráfica, com os mesmos preços\)/);
  assert.match(js, /link no Instagram e no Perfil da Empresa no Google/);
  assert.match(js, /1 troca = mudar um item: preço, nome, descrição, foto ou disponibilidade/);
  assert.match(ler("_fontes/podecurtir/termos/index.html"), /pacote de até 5 por R\$ 90, feitas em até 2 dias úteis[\s\S]*recebe a planilha e o PDF/);
  assert.match(ler("_fontes/podecurtir/termos/index.html"), /a hospedagem custa R\$ 120 por ano, ou não tem custo para quem tem o Cuidado do Cardápio/);
});

// D3 (08/11/2026, aprovado pela Jéssica): cardápio de exemplo, com restaurante fictício e identificado como exemplo,
// gerado pela planilha (_ferramentas/cardapio/gerar_cardapio.py). O digital e o impresso saem dos mesmos dados.
test("Pode Curtir: cardápio de exemplo gerado da planilha, com os mesmos preços no digital e no impresso", () => {
  const d = ler("_fontes/podecurtir/cardapio/exemplo/index.html");
  const imp = ler("_fontes/podecurtir/cardapio/exemplo/imprimir/index.html");
  const cfg = JSON.parse(ler("_fontes/podecurtir/cardapio/exemplo/dados/restaurante.json"));
  for (const h of [d, imp]) {
    const csp = h.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
    assert.ok(csp && !/unsafe-inline|unsafe-eval/.test(csp[1]));
    assert.doesNotMatch(h, /<script>|style="|onclick=/);
    assert.match(h, /<meta name="robots" content="noindex">/);
    assert.match(h, /Cardápio de exemplo, com restaurante, pratos e preços fictícios\./);
    assert.match(h, /Alérgenos conforme informado pelo restaurante/);
  }
  assert.match(cfg.aviso, /fictícios/);
  const linhas = ler("_fontes/podecurtir/cardapio/exemplo/dados/cardapio.csv").trim().split("\n").slice(1);
  assert.ok(linhas.length >= 10);
  const brl = (v) => "R$ " + Number(v).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  for (const l of linhas) {
    const cols = l.match(/("[^"]*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, "").replace(/^"|"$/g, ""));
    const [, nome, , preco] = cols;
    assert.ok(d.includes('data-nome="' + nome + '" data-preco="' + Number(preco).toFixed(2) + '"'), "digital sem " + nome);
    assert.ok(d.includes(brl(preco)) && imp.includes(brl(preco)), "preço diferente: " + nome);
    assert.ok(imp.includes("<b>" + nome + "</b>"), "impresso sem " + nome);
  }
  const m = JSON.parse(ler("_fontes/podecurtir/cardapio/exemplo/manifest.webmanifest"));
  assert.equal(m.display, "standalone");
  assert.ok(existsSync(new URL("../cardapio/exemplo/qr.svg", import.meta.url)));
  assert.ok(existsSync(new URL("../cardapio/exemplo/cardapio-impresso.pdf", import.meta.url)));
  const js = ler("assets/js/cardapio.js");
  assert.match(js, /"https:\/\/wa\.me\/" \+ numero \+ "\?text=" \+ encodeURIComponent\(mensagem\(\)\)/);
  assert.doesNotMatch(js, /fetch\(|XMLHttpRequest|localStorage/);
});

// 08/11/2026 (aprovado pela Jéssica): tipo "Cozinha de delivery (em casa)" e segundo exemplo, sem mesa, balcão
// nem cardápio impresso, gerado pela mesma planilha com "impresso": false e "opcoes_pedido".
test("Pode Curtir: cozinha de delivery tem tipo próprio e cardápio de exemplo sem salão", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  assert.match(js, /\{ id: "cozinha_delivery", nome: "Cozinha de delivery \(em casa\)", proj: \["cardapio"\]/);
  assert.match(js, /fica na bio do Instagram e na mensagem de saudação do WhatsApp/);
  assert.ok(js.indexOf('id: "cozinha_delivery"') < js.indexOf('id: "outro"'));
  assert.doesNotMatch(js, /href=\\?"\//, "link /podecurtir/ no JS quebraria no espelho");
  const base = "_fontes/podecurtir/cardapio/exemplo-delivery/";
  const d = ler(base + "index.html");
  const csp = d.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
  assert.ok(csp && !/unsafe-inline|unsafe-eval/.test(csp[1]));
  assert.doesNotMatch(d, /<script>|style="|onclick=/);
  assert.match(d, /<meta name="robots" content="noindex">/);
  assert.match(d, /Cardápio de exemplo, com cozinha, pratos e preços fictícios\./);
  assert.match(d, /Alérgenos conforme informado pela cozinha/);
  assert.match(d, /O pedido só vale depois que a cozinha confirmar pelo WhatsApp\./);
  // sem salão: nada de mesa, balcão, "comer aqui" nem cardápio impresso
  assert.doesNotMatch(d, /balcão|Comer aqui|mesa|imprimir\/|cardápio impresso/i);
  assert.match(d, /value="Entrega" checked> Entrega<\/label>/);
  assert.match(d, /value="Retirada combinada"> Retirada combinada<\/label>/);
  assert.ok(!existsSync(new URL("../" + base + "imprimir/index.html", import.meta.url)));
  assert.ok(!existsSync(new URL("../" + base + "cardapio-impresso.pdf", import.meta.url)));
  const linhas = ler(base + "dados/cardapio.csv").trim().split("\n").slice(1);
  assert.ok(linhas.length >= 6);
  for (const l of linhas) {
    const cols = l.match(/("[^"]*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, "").replace(/^"|"$/g, ""));
    assert.ok(d.includes('data-nome="' + cols[1] + '" data-preco="' + Number(cols[3]).toFixed(2) + '"'), "digital sem " + cols[1]);
  }
  assert.equal(JSON.parse(ler(base + "manifest.webmanifest")).display, "standalone");
});

// 09/11/2026 (D4 aprovada pela Jéssica): Portfólio da empresa, R$ 1.200 de fundador e R$ 1.900 depois;
// nada de cliente, número ou depoimento inventado. D5: o curso pode ter a área montada pela Zethic, em parceria.
test("Portfólio da empresa e área de cursos da Zethic em parceria", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  const proj = js.split("var PROJ = [")[1].split("];")[0];
  assert.match(proj, /id: "portfolio", nome: "Portfólio da empresa", preco: 1197, prazo: "10 dias úteis", fundador: true,\s*depois: "Preço de fundador para os 3 primeiros clientes\. Depois, R\$ 1\.497\."/);
  assert.match(proj, /Clientes, números e depoimentos entram só se você enviar, com autorização\./);
  assert.match(js, /portfolio: "Para mandar uma apresentação pronta/);
  assert.match(js, /id: "produto_digital"[^}]*a área de cursos pode ser montada pela Zethic, em parceria\./);
});

// 10/11/2026 (Jéssica, por benchmark): prazo da tradução e regras do catálogo depois de 12 meses, iguais às do cardápio.
test("Pode Curtir: tradução em 5 dias úteis e catálogo com as mesmas regras do cardápio depois de 12 meses", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  const termos = ler("_fontes/podecurtir/termos/index.html");
  assert.match(js, /id: "traducao", secao: "rest", nome: "Tradução do cardápio · inglês e espanhol", preco: 597, prazo: "5 dias úteis"/);
  assert.match(termos, /em até 5 dias úteis do pedido, com tradução e revisão/);
  assert.match(termos, /atualizado nos três idiomas e conta como uma troca só/);
  const cat = termos.split("<strong>Catálogo no celular:</strong>")[1].split("</li>")[0];
  assert.match(cat, /12 meses no ar\. Depois, a hospedagem custa R\$ 120 por ano, ou não tem custo para quem tem o Cuidado do Catálogo\./);
  assert.match(cat, /pacote de até 5 por R\$ 90, feitas em até 2 dias úteis/);
  assert.match(cat, /recebe a planilha com os itens/);
  assert.match(js, /id: "catalogo_mensal"[\s\S]*O catálogo fica no ar sem custo de hospedagem\./);
});

// 10/11/2026 (Jéssica): o que é vendido em parceria com a Jéssica Gessoli fica numa faixa no mesmo formato da Zethic,
// com as cores da marca dela. O rótulo é "Em parceria" (não "Leve junto"), porque a sessão se compra sozinha.
test("faixa da Jéssica Gessoli: mesmo formato da Zethic, cores da marca dela", () => {
  const h = ler("_fontes/podecurtir.html"), css = ler("assets/css/podecurtir-loja.css");
  assert.match(h, /<section class="secao leve-junto jg" aria-labelledby="t-ia">[\s\S]*<span class="selo jg">JÉSSICA GESSOLI<\/span>Em parceria<\/p><h2 id="t-ia">Aprenda a fazer com IA/);
  assert.match(css, /\.leve-junto\.jg\{background:#12352B;/);
  assert.match(css, /\.leve-junto\.jg \.por\{background:#D9B76E;color:#12352B\}/);
});

// 10/11/2026 (Jéssica): os serviços em parceria ficam juntos. O portfólio da Pode Curtir (inclusive o E-book pronto)
// vem antes; depois, lado a lado, a faixa da Jéssica Gessoli e a da Zethic; por fim, os pedidos de proposta.
test("parcerias juntas: E-book antes, Jéssica Gessoli e Zethic lado a lado", () => {
  const h = ler("_fontes/podecurtir.html");
  const ordem = ["t-esp", "t-conteudo", "t-ia", "t-contas", "t-propostas"].map((id) => h.indexOf(`aria-labelledby="${id}"`));
  assert.ok(ordem.every((v) => v > 0), "todas as seções existem");
  assert.deepEqual([...ordem].sort((a, b) => a - b), ordem, "ordem: especialistas, e-book, Jéssica Gessoli, Zethic, propostas");
  assert.match(h, /aria-labelledby="t-ia">[\s\S]*?<\/section>\s*<section class="secao leve-junto" aria-labelledby="t-contas">/);
});

// 10/11/2026 (Jéssica): as propostas da Jéssica Gessoli e da Zethic ficam dentro da faixa de cada marca;
// no "Pedir proposta" ficam só as da Pode Curtir.
test("propostas das parceiras dentro das faixas; Pedir proposta só da Pode Curtir", () => {
  const h = ler("_fontes/podecurtir.html"), js = ler("assets/js/podecurtir-loja.js");
  assert.match(h, /aria-labelledby="t-ia">[\s\S]*?<div class="lista-propostas" id="propostas-jg"><\/div>[\s\S]*?<\/section>/);
  assert.match(h, /aria-labelledby="t-contas">[\s\S]*?<div class="lista-propostas" id="propostas-ze"><\/div>[\s\S]*?<\/section>/);
  assert.match(js, /\$\("lista-propostas"\)\.innerHTML = propostasDa\("pc"\);/);
  assert.match(js, /\$\("propostas-jg"\)\.innerHTML = propostasDa\("jg"\);/);
  assert.match(js, /\$\("propostas-ze"\)\.innerHTML = propostasDa\("ze"\);/);
});

// 11/11/2026 (Jéssica: "deixe disponível no site todos os serviços que apareceram no Google", categoria Agência de marketing).
test("Pode Curtir: serviços da categoria Agência de marketing do Google, com preço de fundador ou por proposta", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  assert.match(js, /id: "campanha", nome: "Campanha de data comemorativa", preco: 897,[\s\S]*?Depois, R\$ 1\.197\./);
  assert.match(js, /id: "anuncio", nome: "Revisão de anúncio pela psicologia do consumidor", preco: 397,[\s\S]*?Depois, R\$ 597\.[\s\S]*?Sem exame de cérebro e sem promessa de resultado\./);
  assert.match(js, /id: "relatorio", nome: "Relatório de marketing mensal", mensal: 197,[\s\S]*?Preço de fundador para os 3 primeiros clientes\./);
  const propostas = js.split("var PROPOSTAS")[1].split("];")[0];
  for (const id of ["email", "seo", "consultoria", "esporte", "loja_online", "afiliados", "prospeccao", "ligacoes"])
    assert.match(propostas, new RegExp('id: "' + id + '", marca: "pc"'), id);
  // Ligações só para a base própria, com aceite, respeitando o Não Me Ligue (Procon-SP) e a LGPD.
  assert.match(propostas, /só para quem já é cliente e autorizou o contato, respeitando o Não Me Ligue do Procon-SP e a LGPD\. Sem ligação para lista comprada\./);
  // Os planos de Gestão da Black Friday continuam só os 3 de sempre.
  assert.match(js, /var GESTAO = \["essencial", "padrao", "completa"\];/);
});

test("preço de fundador: depoimento é do site e avaliação no Google é opcional (12/11/2026)", () => {
  const loja = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const termos = readFileSync(new URL("../termos/index.html", import.meta.url), "utf8");
  assert.match(loja, /avaliação no Google não faz parte da troca e é sempre opcional/);
  assert.match(loja, /Avaliar no Google é opcional\./);
  assert.match(termos, /nunca é pedida em troca de desconto/);
});
