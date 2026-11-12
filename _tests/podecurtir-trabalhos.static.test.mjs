import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";

// Trazido do zethic-site em 12/11/2026, quando a Pode Curtir passou a ter a fonte aqui (decisão da Jéssica:
// "tudo que é da Pode Curtir somente na Pode Curtir"). Os caminhos antigos da fonte são lidos nos arquivos publicados.
const caminho = (p) => p === "_fontes/podecurtir.html" ? "index.html" : p.replace(/^_fontes\/podecurtir\//, "").replace(/^_marcas\/podecurtir-site\//, "");
const ler = (p) => readFileSync(new URL("../" + caminho(p), import.meta.url), "utf8");

// 14/10/2026 (pedido da Goreti, aprovado pela Jéssica): os vídeos de demonstração saem até haver vídeos com edição mais elaborada;
// a página fica só com texto. O título "Você curte, a gente registra." foi trocado por um título direto.
test("Pode Curtir: sem vídeos de demonstração e com título direto", () => {
  const h = ler("_fontes/podecurtir.html");
  assert.doesNotMatch(h, /class="reel"|class="trabalhos"/);
  // 11/11/2026 (Jéssica, decisão de 10/11/2026): o único vídeo da página é o do caso Água na Boca, dentro da seção do caso.
  assert.equal((h.match(/<video/g) || []).length, 1, "só o vídeo do caso");
  const caso = h.match(/<section class="caso alt" id="caso-agua-na-boca"[\s\S]*?<\/section>/)[0];
  assert.match(caso, /<video /);
  // 07/11/2026 (benchmark de publicidade, aprovado pela Jéssica): o título diz o resultado e o preço fechado.
  assert.match(h, /<h1>Seu perfil pronto para vender, com preço fechado\.<\/h1>/);
  assert.doesNotMatch(h + ler("index.html"), /Você curte, a gente registra/);
});

// 14/10/2026 (aprovado pela Jéssica): símbolos novos das marcas. 28/10/2026: a Pode Curtir não cita mais a Zethic.
test("Símbolo: visor da Pode Curtir, sem endosso da Zethic", () => {
  const pc = ler("assets/img/podecurtir-icone.svg");
  assert.match(pc, /fill="#FFD23F"/);
  assert.doesNotMatch(ler("_fontes/podecurtir.html"), /marca da|parentOrganization/);
  // 11/11/2026 (pedido da Jéssica): a marca da Zethic aparece só como parceira, na seção de proteção e recuperação de conta, nunca como endosso da Pode Curtir.
  const semSecaoZethic = ler("_fontes/podecurtir.html").replace(/<section class="secao leve-junto" aria-labelledby="t-contas">[\s\S]*?<\/section>/, "");
  assert.doesNotMatch(semSecaoZethic, /zethic-marca\.svg/);
});

// 21/10/2026 (retorno da Lucinha, aprovado pela Jéssica): a página diz logo no título que categoria a Pode Curtir é,
// e mostra a frente de redes sociais (Perfil Pronto e gestão mensal), sem preço e sem pedir senha.
test("Pode Curtir: categoria clara e frente de redes sociais", () => {
  const h = ler("_fontes/podecurtir.html");
  // 10/11/2026 (Jéssica): o título diz primeiro o que a página vende (perfil e redes) e continua dizendo a categoria.
  assert.match(h, /<title>Pode Curtir \| Perfil, redes, foto e vídeo com preço fechado<\/title>/);
  assert.match(h, /<li id="redes">[\s\S]*Perfil Pronto[\s\S]*Gestão mensal/);
  // 04/11/2026: a regra "sem preço" caiu (site = preço pronto); o preço da página inicial é conferido no teste da loja.
  assert.doesNotMatch(h, /A publicação nas redes e os anúncios ficam com você/);
  // 28/10/2026 (fronteiras): a Pode Curtir não comunica segurança; a blindagem técnica de contas é da Zethic.
  assert.doesNotMatch(h, /Conta protegida|protegida pela Zethic|[Ss]eguran[çc]a|senha/);
});

test('Pode Curtir: prévia de link com imagem grande', () => {
  const h = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(h, /<meta property="og:image" content="https:\/\/podecurtir\.zethic\.net\/assets\/img\/og-podecurtir\.jpg">/);
  assert.match(h, /<meta name="twitter:card" content="summary_large_image">/);
  assert.ok(existsSync(new URL('../assets/img/og-podecurtir.jpg', import.meta.url)));
});

// 04/11/2026 (decisão da Jéssica): nome de cliente não aparece misturado com as marcas. As fotos da antiga seção de
// vídeos (pizzaria e dança) estavam sem uso desde 14/10/2026, mas continuavam no ar; saíram do site.
test("site: sem arquivo público com nome de cliente e sem as fotos da antiga seção de vídeos", () => {
  const nomes = [];
  const andar = (dir) => {
    for (const e of readdirSync(new URL("../" + dir, import.meta.url), { withFileTypes: true })) {
      if (e.isDirectory()) andar(dir + e.name + "/"); else nomes.push(dir + e.name);
    }
  };
  andar("assets/");
  for (const n of nomes) {
    // 11/11/2026 (Jéssica, decisão de 10/11/2026): o caso Água na Boca entra no site, só com arquivos agua-na-boca_virginia-*.
    const semCaso = n.replace(/^assets\/(img|video)\/agua-na-boca_virginia-[a-z0-9-]+\.(webp|jpg|mp4)$/, "");
    assert.doesNotMatch(semCaso, /torre-de-prata|torre_de_prata|agua-?na-?boca|aguanaboca|excellent|lucinha|pizzaria/i, n);
  }
  assert.ok(!existsSync(new URL("../assets/video/pode-curtir-torre-de-prata.jpg", import.meta.url)));
  assert.ok(!existsSync(new URL("../assets/video/pode-curtir-danca.jpg", import.meta.url)));
});
