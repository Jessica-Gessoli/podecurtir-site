import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";

// 11/11/2026 (Jéssica, mapa de mídias e decisão de 10/11/2026): fotos e vídeo de clientes na página inicial da Pode Curtir.
// Topo com fotos que passam (12/11/2026; antes, 1 foto fixa), faixa de prova, "Exemplo real" nos cards, caso Água na Boca, retrato da Lucia Vidotto e "Quem faz".

// Trazido do zethic-site em 12/11/2026, quando a Pode Curtir passou a ter a fonte aqui (decisão da Jéssica:
// "tudo que é da Pode Curtir somente na Pode Curtir"). Os caminhos antigos da fonte são lidos nos arquivos publicados.
const caminho = (p) => p === "_fontes/podecurtir.html" ? "index.html" : p.replace(/^_fontes\/podecurtir\//, "").replace(/^_marcas\/podecurtir-site\//, "");
const ler = (p) => readFileSync(new URL("../" + caminho(p), import.meta.url), "utf8");
const existe = (p) => existsSync(new URL("../" + caminho(p), import.meta.url));
const h = ler("_fontes/podecurtir.html");
const secao = (re) => { const m = h.match(re); assert.ok(m, "seção ausente: " + re); return m[0]; };
const caso = secao(/<section class="caso alt" id="caso-agua-na-boca"[\s\S]*?<\/section>/);
const prova = secao(/<section class="prova"[\s\S]*?<\/section>/);
const quemFaz = secao(/<section class="quem-faz"[\s\S]*?<\/section>/);
const lucia = secao(/<section class="caso-curto" id="caso-lucia-vidotto"[\s\S]*?<\/section>/);
const imgs = h.match(/<img [^>]*>/g) || [];

test("casos: ordem das seções segue o mapa de mídias", () => {
  const pos = (s) => { const i = h.indexOf(s); assert.ok(i >= 0, s); return i; };
  assert.ok(pos('class="hero pc-vitrine"') < pos('<section class="prova"'), "foto no topo, antes da faixa");
  assert.ok(pos('<section class="prova"') < pos('<section id="loja"'), "faixa de prova antes da loja");
  assert.ok(pos('<section id="loja"') < pos('id="caso-agua-na-boca"'), "caso depois da loja");
  assert.ok(pos('id="caso-agua-na-boca"') < pos('id="como"'), "caso antes de Como funciona a compra");
  assert.ok(pos('id="t-garantias"') < pos('<section class="quem-faz"') && pos('<section class="quem-faz"') < pos('id="t-faz"'),
    "Quem faz logo depois de Combinado por escrito");
});

test("casos: só o quadro 1 do topo tem prioridade alta; as outras carregam tarde", () => {
  const altas = imgs.filter((i) => /fetchpriority="high"/.test(i));
  assert.equal(altas.length, 1);
  assert.match(altas[0], /agua-na-boca_virginia-com-a-cesta-800\.jpg/);
  assert.doesNotMatch(altas[0], /loading="lazy"/);
  for (const i of imgs) {
    if (/fetchpriority="high"/.test(i) || /zethic-marca\.svg|jessica-gessoli-podecurtir/.test(i)) continue;
    assert.match(i, /loading="lazy"/, i);
  }
});

// 12/11/2026 (Jéssica): topo no mesmo modelo dos banners da Zethic — foto de fundo que passa, texto próprio em cada
// destaque, nomes com barrinha de tempo e Pausar; destaque 1 com o título da página e as garantias.
test("topo: 3 destaques no modelo da Zethic, destaque 1 visível sem JavaScript, controles acessíveis", () => {
  const hero = h.match(/<div class="hero pc-vitrine"[\s\S]*?<button type="button" class="pausa">Pausar<\/button>\s*<\/div>\s*<\/div>/)[0];
  assert.doesNotMatch(hero, /<video|style="/i, "sem vídeo e sem estilo inline (CSP)");
  const s = hero.match(/<article class="slide[^"]*"[^>]*>/g);
  assert.equal(s.length, 3);
  assert.match(s[0], /class="slide ativo"/);
  for (const [i, a] of s.entries()) assert.match(a, new RegExp('role="group" aria-roledescription="destaque" aria-label="' + (i + 1) + ' de 3: '));
  assert.equal((hero.match(/<h1>/g) || []).length, 1, "um só h1, no destaque 1");
  assert.ok(hero.indexOf("<h1>") < hero.indexOf('aria-label="2 de 3'), "h1 no destaque 1");
  assert.ok(hero.indexOf('<ul class="selos"') < hero.indexOf('aria-label="2 de 3'), "garantias no destaque 1");
  assert.equal((hero.match(/<button type="button" class="ponto[^"]*"/g) || []).length, 3);
  assert.match(hero, /<div class="wrap vitrine-ctrl" hidden>/, "controles só aparecem com JavaScript");
  assert.match(hero, /lucia-vidotto_01-800\.jpg/, "ensaio da Lucia Vidotto no topo");
  assert.match(hero, /Foto: Alpha/);
  assert.match(hero, /href="#caso-agua-na-boca" data-evento="ver_caso"/);
  assert.match(h, /<script src="\/assets\/js\/podecurtir-vitrine\.js(\?v=[0-9a-f]{10})?" defer><\/script>/);
});

test("topo: script troca a cada 7 s, pausa sozinho e respeita reduzir movimento", () => {
  const js = ler("assets/js/podecurtir-vitrine.js");
  assert.match(js, /var TEMPO = 7000;/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /pausadaPelaPessoa = calmo/);
  for (const ev of ["mouseenter", "focusin", "visibilitychange"]) assert.match(js, new RegExp('"' + ev + '"'));
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /window\.addEventListener\("load", tocar\)/, "só troca depois de a página carregar");
  assert.doesNotMatch(js, /innerHTML/);
  const css = ler("assets/css/podecurtir.css");
  assert.match(css, /@media \(prefers-reduced-motion:no-preference\)\{\s*\.js-vitrine \.slide\.ativo \.slide-img img\{animation:pc-aproxima/);
  assert.match(css, /animation:pc-progresso 7s linear/);
});

test("casos: toda imagem nova tem largura, altura, alt descritivo e versões WebP em tamanhos", () => {
  const novas = imgs.filter((i) => /agua-na-boca_virginia-|lucia-vidotto_|jessica-gessoli_quem-faz/.test(i));
  assert.ok(novas.length >= 17, "imagens novas: " + novas.length);
  for (const i of novas) {
    assert.match(i, / width="\d+" height="\d+"/, i);
    const alt = (i.match(/alt="([^"]*)"/) || [])[1] || "";
    // 12/11/2026: no topo, a mesma foto aparece desfocada como fundo (decorativa, alt vazio) e nítida com alt descritivo.
    const fonte = i.match(/src="([^"]+)"/)[1];
    const fundoDecorativo = alt === "" && novas.some((o) => o !== i && o.includes('src="' + fonte + '"') && /alt="[^"]{20,}"/.test(o));
    assert.ok(alt.length >= 20 || fundoDecorativo, "alt curto: " + i);
    assert.doesNotMatch(alt, /\.(jpe?g|webp|png)|IMG_|agua-na-boca_|lucia-vidotto_/i, "alt com nome de arquivo: " + alt);
    const src = i.match(/src="([^"]+)"/)[1];
    assert.ok(existe(src.slice(1)), "arquivo ausente: " + src);
  }
  for (const pic of h.match(/<picture>[\s\S]*?<\/picture>/g).filter((p) => /agua-na-boca_virginia-|lucia-vidotto_|jessica-gessoli_quem-faz/.test(p))) {
    const srcset = pic.match(/<source type="image\/webp" srcset="([^"]+)"/);
    assert.ok(srcset, "sem WebP: " + pic);
    const tamanhos = srcset[1].split(",").map((s) => s.trim().split(" ")[0]);
    assert.ok(tamanhos.length >= 2 && tamanhos.length <= 3, "2 ou 3 tamanhos: " + srcset[1]);
    for (const t of tamanhos) assert.ok(existe(t.slice(1)), "arquivo ausente: " + t);
    assert.match(pic, /sizes="/);
  }
});

test("casos: nomes de arquivo seguem o padrão por cliente", () => {
  const usados = [...h.matchAll(/\/assets\/(?:img|video)\/([^"\s,]+)/g)].map((m) => m[1])
    .filter((n) => /agua|lucia|quem-faz/.test(n));
  assert.ok(usados.length > 0);
  for (const n of usados) assert.match(n, /^(agua-na-boca_virginia-|lucia-vidotto_0[13]-|jessica-gessoli_quem-faz-)/, n);
});

test("casos: faixa de prova com 4 miniaturas, legenda aprovada e link Ver o caso", () => {
  assert.equal((prova.match(/<img /g) || []).length, 4);
  assert.match(prova, /<figcaption>Dona Virgínia com as baguetes<\/figcaption>/);
  assert.match(prova, /agua-na-boca_virginia-cesta-pronta-960\.jpg/);
  assert.match(prova, /<a class="prova-link" href="#caso-agua-na-boca" data-evento="ver_caso">Ver o caso<\/a>/);
});

test("casos: Água na Boca diz que ela é cliente, mostra antes e depois e não inventa números nem depoimento", () => {
  assert.match(caso, /Ela é cliente da Pode Curtir\./);
  assert.match(caso, /@aguanaboca\.oficial1/);
  assert.match(caso, /Cabreúva\/SP/);
  for (const t of ["Quem é", "Antes", "O que foi feito", "Resultado"]) assert.match(caso, new RegExp("<h3>" + t + "</h3>"));
  assert.match(caso, /perfil-antes-1080\.jpg/);
  assert.match(caso, /perfil-depois-1080\.jpg/);
  assert.equal((caso.match(/<ul class="caso-fotos">[\s\S]*?<\/ul>/)[0].match(/<img /g) || []).length, 5, "5 fotos + a do Quem é = 6");
  // Números só se forem medidos; depoimento só com as palavras dela. Hoje não há nenhum dos dois.
  assert.doesNotMatch(caso, /\d+\s*(%|seguidores|pedidos|vendas|curtidas)|<blockquote|<q>|★/i);
  // O "depois" é recortado acima do link da bio, e no Reel do site a linha do link é coberta: é o WhatsApp real da
  // Dona Virgínia, e o contato dela não vai para o site sem autorização assinada (Jéssica, 12/11/2026).
  assert.doesNotMatch(caso + ler("assets/js/podecurtir-loja.js"), /wa\.me\/55489|5548999888644/);
  assert.match(caso, /<a class="btn rosa" href="#t-perfil" data-evento="quero_o_mesmo">Quero o mesmo para o meu Negócio<\/a>/);
  // 12/11/2026 (Jéssica): ela comprou a sessão de fotos e a reformulação do Instagram; o botão leva ao Perfil Pronto.
  assert.match(caso, /<\/div>\n      <p class="caso-cta-linha">Perfil Pronto com Sessão de fotos<\/p>/);
  assert.match(caso, /Ela contratou a sessão de fotos e a reformulação do Instagram\./);
});

test("casos: vídeo sem som automático, com pôster, preload none, legenda na tela e até 10 MB", () => {
  const v = caso.match(/<video [^>]*>/)[0];
  assert.match(v, /preload="none"/);
  assert.match(v, / controls/);
  assert.match(v, /playsinline/);
  assert.match(v, /poster="\/assets\/img\/agua-na-boca_virginia-reel-poster-720\.jpg"/);
  assert.match(v, /data-evento-play="play_video_caso"/);
  assert.doesNotMatch(v, /autoplay/);
  assert.match(caso, /<source src="\/assets\/video\/agua-na-boca_virginia-reel\.mp4" type="video\/mp4">/);
  // 12/11/2026 (Jéssica): saem do Reel do site as telas "RESULTADO (número real em janeiro)", "Follow back / Follow"
  // e "Veja os pacotes no link da bio"; o vídeo passa de 42 s para cerca de 32 s.
  assert.match(caso, /Reel do caso, 32 segundos, sem áudio/);
  const mb = statSync(new URL("../assets/video/agua-na-boca_virginia-reel.mp4", import.meta.url)).size / 1e6;
  assert.ok(mb <= 10, "vídeo com " + mb.toFixed(1) + " MB");
  assert.ok(existe("assets/img/agua-na-boca_virginia-reel-poster-720.jpg"));
  // O vídeo tem 720 px de largura: sem width:100% ele estoura a tela do celular (visto no teste no navegador, 11/11/2026).
  assert.match(ler("assets/css/podecurtir.css"), /\.caso-video video\{display:block;width:100%;height:auto;/);
  const csp = h.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  assert.match(csp, /media-src 'self'/, "sem media-src o vídeo é bloqueado");
});

test("casos: eventos GA4 ver_caso, play_video_caso e quero_o_mesmo, só com aceite de cookies", () => {
  const comum = ler("assets/js/podecurtir-comum.js");
  assert.match(comum, /document\.addEventListener\("play", function \(e\) \{[\s\S]*?getAttribute\("data-evento-play"\)[\s\S]*?window\.podecurtirEvento\([\s\S]*?\}, true\);/);
  // podecurtirEvento só envia com o Pixel ou o GA4 ativos, e eles só carregam depois do aceite.
  assert.match(comum, /if \(gaAtivo && typeof window\.gtag === "function"\) window\.gtag\("event"/);
  assert.match(h, /data-evento="ver_caso"/);
  assert.match(h, /data-evento="quero_o_mesmo"/);
  assert.match(ler("assets/js/podecurtir-loja.js"), /<a class="exemplo" href="#caso-agua-na-boca" data-evento="ver_caso">/);
});

test("casos: miniatura Exemplo real no Ajuste de Perfil, no Perfil Arrumado e na Sessão de fotos, com imagens que o espelho copia", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  const mapa = js.match(/var EXEMPLO = \{[\s\S]*?\n  \};/)[0];
  for (const id of ["ajuste", "arrumado", "gravacao"]) assert.match(mapa, new RegExp("\\n    " + id + ": \\{ img: \""));
  assert.match(js, /exemplo\(p\.id\) \+/);
  assert.match(js, /exemplo\(a\.id\) \+ "<\/div>"/);
  // O gerador das marcas só copia as imagens citadas no HTML: as da miniatura precisam aparecer na página.
  for (const m of mapa.matchAll(/img: "([^"]+)", webp: (\d+), jpg: (\d+)/g)) {
    assert.ok(h.includes(`/assets/img/${m[1]}-${m[2]}.webp`), m[1] + " webp");
    assert.ok(h.includes(`/assets/img/${m[1]}-${m[3]}.jpg`), m[1] + " jpg");
  }
});

test("casos: Lucia Vidotto com 1 foto de cada figurino, sem texto de apresentação nem crédito", () => {
  assert.match(lucia, /lucia-vidotto_01-800\.jpg/);
  assert.match(lucia, /lucia-vidotto_03-800\.jpg/);
  assert.equal((lucia.match(/<img /g) || []).length, 2);
  // 12/11/2026 (Jéssica): saíram o texto de apresentação e a linha de crédito do bloco dos retratos.
  assert.doesNotMatch(lucia, /class="intro"|class="credito"/);
  assert.match(h, /<a href="#caso-lucia-vidotto">Ver os retratos da Lucia Vidotto<\/a>/);
});

test("casos: Quem faz apresenta a Pode Curtir, com crédito da Alpha, sem cargo nem link da marca Jéssica Gessoli", () => {
  assert.match(quemFaz, /jessica-gessoli_quem-faz-1024\.jpg/);
  assert.match(quemFaz, /<figcaption>Foto: Alpha<\/figcaption>/);
  assert.doesNotMatch(quemFaz, /jessicagessoli|@jessicagessoli|instagram\.com|fundadora|diretora|executiva|CEO|especialista|Zethic/i);
});

test("casos: espelho da Pode Curtir tem as imagens e o vídeo", () => {
  const usados = new Set([...h.matchAll(/\/assets\/(?:img|video)\/(?:agua-na-boca_virginia-|lucia-vidotto_|jessica-gessoli_quem-faz)[^"\s,]+/g)].map((m) => m[0]));
  for (const u of usados) assert.ok(existe("_marcas/podecurtir-site" + u), "falta no espelho: " + u);
});

// 12/11/2026 (Jéssica, benchmark: minimalismo e assertividade): loja em abas, um grupo por vez; tipo de Negócio abre o
// grupo por onde começar; link para uma seção escondida abre o grupo dela; lista "O que a gente faz" recolhida.
test("loja em abas: grupos cobrem todas as seções, tipo abre o grupo e âncora abre o grupo certo", () => {
  const js = ler("assets/js/podecurtir-loja.js");
  assert.match(h, /<div class="abas-loja" id="abas-loja" role="group" aria-label="Grupos de serviços"><\/div>/);
  const secoes = [...h.matchAll(/<section class="secao[^"]*" aria-labelledby="(t-[a-z]+)"/g)].map((m) => m[1]);
  const grupos = js.slice(js.indexOf("var GRUPOS = ["), js.indexOf("var grupo = "));
  for (const s of secoes) assert.match(grupos, new RegExp('"' + s + '"'), "seção sem aba: " + s);
  assert.match(grupos, /\{ id: "tudo", nome: "Ver tudo", secoes: null \}/);
  assert.match(js, /if \(tt && tt\.foco\) grupo = grupoDaSecao\(tt\.foco\[0\]\)/);
  assert.match(js, /grupo = grupoDaSecao\(escondida\.getAttribute\("aria-labelledby"\)\)/);
  assert.match(h, /<details class="frentes-mais">\s*<summary>Ver a lista completa do que a gente faz<\/summary>/);
});

// 12/11/2026 (Jéssica): a foto da Lucia Vidotto é da Alpha. O bloco leva para o que a Pode Curtir faz com a foto
// (livro, e-book, perfil) e não para ensaio, para não esbarrar no trabalho da Alpha.
test("retratos da Lucia Vidotto levam para livro, e-book e perfil, não para ensaio", () => {
  assert.doesNotMatch(lucia, /ensaio de retrato feito pela Pode Curtir|Pedir proposta de ensaio/i);
  assert.match(lucia, /<a href="#proposta-livro">Livro pronto/);
  assert.match(lucia, /<a href="#t-conteudo">E-book/);
  assert.match(lucia, /<a href="#t-perfil">Perfil Pronto/);
  assert.match(ler("assets/js/podecurtir-loja.js"), /'" id="proposta-' \+ a\.id \+ '"/);
  assert.doesNotMatch(h, /retrato feito pela Pode Curtir/);
});
