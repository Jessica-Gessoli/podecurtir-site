/* Pode Curtir — loja com carrinho (/podecurtir/loja). Valores de 03/11/2026, aprovados pela Jéssica.
   Decisões de 04/11/2026: no site o pagamento é integral (entrada e saldo só na venda presencial); o parcelamento
   fica só no cartão, com um link para Pix ou boleto à vista e outro para cartão; a Gestão Completa é vendida aqui,
   com assinatura. O WhatsApp fica para orçamento.
   Decisão de 04/11/2026 (Ficha v1.17): "plus" no fechamento do pedido. Com um serviço pago no pedido, o cliente pode
   marcar plus de escopo fechado: sessão de fotos de 1 hora (R$ 500), capa e diagramação do e-book (R$ 1.500),
   proteção das contas e mentoria em IA de 1 hora com Jéssica Gessoli (R$ 400 cada) e Site Essencial da Zethic
   (R$ 3.000, preço de fundador, até 3x no cartão). Os feitos em parceria aparecem em linha separada, com o nome de
   quem faz; o contato continua sendo a Pode Curtir. Trabalhos maiores seguem como pedido de proposta.
   Pagamento pelo link do Asaas de cada item (ASAAS_LINKS em podecurtir-config.js). Com vários itens pagos,
   usa o CHECKOUT_ENDPOINT (n8n) se estiver preenchido; senão, mostra o link de cada item. */
(function () {
  var C = window.PODECURTIR || {};
  var LINKS = C.ASAAS_LINKS || {};
  var brl = function (v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 2 }); };
  var $ = function (id) { return document.getElementById(id); };
  var PRECO_AJUSTE = Number(C.PRECO_AJUSTE) || 500;

  var PROJ = [
    { id: "ajuste", nome: "Ajuste de Perfil", preco: PRECO_AJUSTE, prazo: "5 dias úteis", fundador: PRECO_AJUSTE === 500,
      desc: "Bio, nome, foto, link e botão de WhatsApp, destaques com capa, 3 posts fixados e checagem básica de segurança da conta." },
    { id: "arrumado", nome: "Perfil Arrumado", preco: 2000, parcelas: 3, em: "no", prazo: "15 dias úteis", fundador: true,
      desc: "Tudo do Ajuste de Perfil, mais análise de quem você segue, curadoria da grade, revisão das legendas e dos acessos e plano de 30 dias." },
    { id: "marca", nome: "Marca Completa", preco: 7500, parcelas: 6, em: "na", prazo: "30 dias úteis", fundador: true,
      desc: "Tudo do Perfil Arrumado, mais paleta, tipografia, símbolo e assinatura, modelos de capa, post e story e manual curto de uso." }
  ];
  var PLANOS = [
    { id: "essencial", nome: "Gestão Essencial", mensal: 1500, desc: "1 rede, 12 posts por mês e relatório mensal." },
    { id: "padrao", nome: "Gestão Padrão", mensal: 2800, desc: "2 redes, 16 posts e 4 Reels por mês, com relatório." },
    { id: "completa", nome: "Gestão Completa", mensal: 4500, desc: "3 redes, 20 posts e 8 Reels por mês." }
  ];
  var PROPOSTAS = [
    { id: "gravacao", marca: "pc", nome: "Gravação de foto e vídeo", plus: "plus_gravacao", desc: "Diária, evento ou sessão maior. O deslocamento entra na proposta." },
    { id: "livro", marca: "pc", nome: "Livro pronto", plus: "plus_livro", desc: "Revisão, capa, diagramação, publicação e divulgação." },
    { id: "protecao", marca: "jg", nome: "Proteção completa das contas", plus: "plus_protecao", desc: "Feita por Jéssica Gessoli, em parceria. Sem senha." },
    { id: "mentoria", marca: "jg", nome: "Mentoria e consultoria em IA", plus: "plus_mentoria", desc: "Você aprende a fazer com IA, no seu projeto. Com Jéssica Gessoli." },
    { id: "tech", marca: "ze", nome: "Site, app, automação e bot de WhatsApp", plus: "plus_site", desc: "Feitos pela Zethic, em parceria. Atendimento e dados das redes num lugar só." }
  ];
  /* Plus do fechamento do pedido: escopo fechado e preço próprio. Só entram com um serviço pago no pedido. */
  var PLUS = [
    { id: "plus_gravacao", marca: "pc", nome: "Sessão de fotos de 1 hora", preco: 500, prazo: "Edição pronta em até 14 dias depois da sessão",
      desc: "10 fotos editadas, em Campinas/SP. Fora de Campinas, o deslocamento é combinado antes e cobrado à parte." },
    { id: "plus_livro", marca: "pc", nome: "Capa e diagramação do e-book", preco: 1500, prazo: "Prazo combinado por escrito depois do briefing",
      desc: "Com o texto pronto, até 100 páginas: capa simples e diagramação do e-book. ISBN, ficha catalográfica e gráfica ficam com o autor." },
    { id: "plus_protecao", marca: "jg", nome: "Proteção das contas", preco: 400, prazo: "Data combinada depois do pagamento",
      desc: "1 hora a distância, até 3 contas do Negócio: verificação em duas etapas, e-mail e telefone de recuperação, revisão de acessos e acesso de parceiro, sem senha. Recuperar conta invadida fica fora e é cobrado por hora." },
    { id: "plus_mentoria", marca: "jg", nome: "Mentoria em IA · 1 hora", preco: 400, prazo: "Data combinada depois do pagamento",
      desc: "Por videochamada, nas ferramentas de IA que você já tem. Você aprende fazendo, no seu projeto." },
    { id: "plus_site", marca: "ze", nome: "Site Essencial", preco: 3000, parcelas: 3, em: "no", fundador: true, prazo: "Prazo combinado por escrito depois do briefing",
      desc: "Site de uma página com apresentação e serviços, botão de WhatsApp, formulário, mapa e cadastro no Google. Domínio e hospedagem ficam no nome do seu Negócio, à parte. Preço de fundador para os 3 primeiros clientes." }
  ];
  function plusDe(id) { return PLUS.filter(function (p) { return p.id === id; })[0]; }
  var MARCA = { pc: "PODE CURTIR", jg: "JÉSSICA GESSOLI", ze: "ZETHIC" };
  var MARCA_NOME = { pc: "Pode Curtir", jg: "Jéssica Gessoli", ze: "Zethic" };
  var COM = { jg: "com Jéssica Gessoli", ze: "com a Zethic" };

  var CHAVE = "podecurtir-carrinho-v1";
  var cart = { proj: [], plano: null, prop: [], plus: [] };
  try {
    var salvo = JSON.parse(sessionStorage.getItem(CHAVE) || "null");
    if (salvo && Array.isArray(salvo.proj) && Array.isArray(salvo.prop)) {
      cart = { proj: salvo.proj, plano: salvo.plano || null, prop: salvo.prop,
        plus: Array.isArray(salvo.plus) ? salvo.plus.filter(function (id) { return !!plusDe(id); }) : [] };
    }
  } catch (e) {}
  function salvar() { try { sessionStorage.setItem(CHAVE, JSON.stringify(cart)); } catch (e) {} }
  var aviso = "";
  var resumoAceito = null;

  /* Formas de pagamento de cada item. Parcelado só no cartão; Pix e boleto sempre à vista. */
  function formas(p) { return p.parcelas ? "Pix ou boleto à vista, ou cartão em até " + p.parcelas + "x sem juros" : "Pix, boleto ou cartão, à vista"; }
  function forma() { var r = document.querySelector('input[name="forma"]:checked'); return r ? r.value : ""; }
  function linkDe(p) { return LINKS[p.parcelas ? p.id + "_" + forma() : p.id]; }
  function comoPaga(p) { return p.parcelas ? (forma() === "cartao" ? "no cartão, em até " + p.parcelas + "x sem juros" : "no Pix ou boleto, à vista") : ""; }

  function tem(lista, id) { return lista.indexOf(id) >= 0; }
  function alterna(lista, id) { var i = lista.indexOf(id); if (i >= 0) lista.splice(i, 1); else lista.push(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function textoVagas() {
    var v = C.VAGAS_500_RESTANTES;
    var escada = "Preço de fundador: R$ 500 do 1º ao 3º cliente, R$ 750 do 4º ao 6º e R$ 1.200 a partir do 7º.";
    if (PRECO_AJUSTE === 500 && typeof v === "number" && v >= 0 && v <= 3) return "Restam " + v + " de 3 vagas a R$ 500. " + escada.replace("Preço de fundador: ", "Depois: ").replace("R$ 500 do 1º ao 3º cliente, ", "");
    return escada;
  }

  function catalogo() {
    $("grade-perfil").innerHTML = PROJ.map(function (p) {
      var on = tem(cart.proj, p.id);
      return '<article class="item"><h3>' + p.nome + '</h3><p class="preco num">' + brl(p.preco) + "</p><p>" + p.desc + "</p>" +
        (p.id === "ajuste" ? '<p class="vagas">' + textoVagas() + "</p>" : "") +
        '<dl class="meta"><div><dt>Prazo</dt><dd>' + p.prazo + ', a partir do briefing completo</dd></div><div><dt>Pagamento</dt><dd>Integral: ' + formas(p) + "</dd></div></dl>" +
        '<button class="por" type="button" data-proj="' + p.id + '" aria-pressed="' + on + '">' + (on ? "No pedido · tirar" : "Pôr no pedido") + "</button></article>";
    }).join("");
    $("grade-planos").innerHTML = PLANOS.map(function (p) {
      var on = cart.plano === p.id;
      return '<article class="item"><h3>' + p.nome + '</h3><p class="preco num">' + brl(p.mensal) + ' <small>por mês</small></p><p>' + p.desc + "</p>" +
        '<dl class="meta"><div><dt>Mínimo</dt><dd>3 meses = ' + brl(p.mensal * 3) + '</dd></div><div><dt>Pagamento</dt><dd>1ª mensalidade hoje; depois, todo mês</dd></div></dl>' +
        '<button class="por" type="button" data-plano="' + p.id + '" aria-pressed="' + on + '">' + (on ? "No pedido · tirar" : "Pôr no pedido") + "</button></article>";
    }).join("");
    $("lista-propostas").innerHTML = PROPOSTAS.map(function (a) {
      var on = tem(cart.prop, a.id);
      var x = a.plus ? plusDe(a.plus) : null;
      return '<div class="proposta"><div><span class="selo ' + a.marca + '">' + MARCA[a.marca] + "</span><strong>" + a.nome + "</strong><p>" + a.desc + "</p>" +
        (x ? '<p class="plus-dica">Ou como plus, no fechamento de um pedido: ' + x.nome + " por " + brl(x.preco) + ".</p>" : "") + "</div>" +
        '<button class="pedir" type="button" data-prop="' + a.id + '" aria-pressed="' + on + '">' + (on ? "Pedido · tirar" : "Pedir proposta") + "</button></div>";
    }).join("");
  }

  function totais() {
    var hoje = 0, plano = null, pagos = [], fundador = false;
    /* Preço de fundador (termos, item 2): só nos itens vendidos pelo preço dos 3 primeiros clientes.
       No Ajuste de Perfil, só a R$ 500; a R$ 750 ou R$ 1.200 não se pede depoimento nem autorização. */
    PROJ.forEach(function (p) { if (tem(cart.proj, p.id)) { hoje += p.preco; pagos.push({ id: p.id, nome: p.nome, valor: p.preco, parcelas: p.parcelas || 0, em: p.em || "" }); if (p.fundador) fundador = true; } });
    PLANOS.forEach(function (p) { if (cart.plano === p.id) { plano = p; hoje += p.mensal; pagos.push({ id: p.id, nome: p.nome, valor: p.mensal }); fundador = true; } });
    /* Plus só com um serviço pago no pedido. */
    var plus = pagos.length ? PLUS.filter(function (p) { return tem(cart.plus, p.id); }) : [];
    plus.forEach(function (p) {
      hoje += p.preco;
      pagos.push({ id: p.id, nome: p.nome, valor: p.preco, parcelas: p.parcelas || 0, em: p.em || "", marca: p.marca });
      if (p.fundador) fundador = true;
    });
    return { hoje: hoje, plano: plano, pagos: pagos, plus: plus, fundador: fundador, props: cart.prop.length,
      total: cart.proj.length + (plano ? 1 : 0) + plus.length + cart.prop.length };
  }
  function temPrincipal() { return cart.proj.length > 0 || !!cart.plano; }

  function linhas(comTirar) {
    var out = [];
    PROJ.forEach(function (p) {
      if (!tem(cart.proj, p.id)) return;
      out.push("<li><span>" + p.nome + '</span><span class="num">' + brl(p.preco) + "</span><small>Pagamento integral · " + formas(p) + "</small>" +
        (comTirar ? '<button class="tirar" type="button" data-proj="' + p.id + '">Tirar</button>' : "") + "</li>");
    });
    PLANOS.forEach(function (p) {
      if (cart.plano !== p.id) return;
      out.push("<li><span>" + p.nome + '</span><span class="num">' + brl(p.mensal) + "</span><small>1ª mensalidade · mínimo de 3 meses = " + brl(p.mensal * 3) + "</small>" +
        (comTirar ? '<button class="tirar" type="button" data-plano="' + p.id + '">Tirar</button>' : "") + "</li>");
    });
    if (temPrincipal()) PLUS.forEach(function (p) {
      if (!tem(cart.plus, p.id)) return;
      out.push('<li><span><span class="selo ' + p.marca + '">' + MARCA[p.marca] + "</span>" + p.nome + '</span><span class="num">' + brl(p.preco) + "</span><small>Plus · pagamento integral · " + formas(p) + "</small>" +
        (comTirar ? '<button class="tirar" type="button" data-plus="' + p.id + '">Tirar</button>' : "") + "</li>");
    });
    PROPOSTAS.forEach(function (a) {
      if (!tem(cart.prop, a.id)) return;
      out.push('<li><span><span class="selo ' + a.marca + '">' + MARCA[a.marca] + "</span>" + a.nome + "</span><span>proposta</span><small>Sem valor agora</small>" +
        (comTirar ? '<button class="tirar" type="button" data-prop="' + a.id + '">Tirar</button>' : "") + "</li>");
    });
    return out.join("");
  }

  function blocoTotais(t) {
    var h = "";
    if (t.pagos.length) h += '<div class="hoje"><span>Paga hoje</span><span class="num">' + brl(t.hoje) + "</span></div>";
    if (t.plano) h += '<div><span>Próximas 2 mensalidades</span><span class="num">' + brl(t.plano.mensal * 2) + "</span></div>";
    if (t.props) h += '<div><span>Pedidos de proposta</span><span class="num">' + t.props + "</span></div>";
    return h;
  }

  function carrinho() {
    var t = totais();
    $("contador").textContent = t.total;
    $("linhas").innerHTML = linhas(true);
    $("vazio").hidden = t.total > 0;
    $("totais").innerHTML = blocoTotais(t);
    $("totais").hidden = t.total === 0;
    $("continuar").disabled = t.total === 0;
    $("continuar").textContent = t.pagos.length ? "Continuar para o pagamento" : (t.total ? "Continuar para enviar o pedido" : "Continuar");
    $("aviso-carrinho").hidden = !aviso; $("aviso-carrinho").textContent = aviso;
  }

  function tudo() { catalogo(); carrinho(); salvar(); }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-proj],[data-plano],[data-prop],button[data-plus]");
    if (!b || $("vista-loja").hidden) return;
    aviso = "";
    if (b.dataset.plus) alterna(cart.plus, b.dataset.plus);
    if (b.dataset.proj) alterna(cart.proj, b.dataset.proj);
    if (b.dataset.plano) {
      var id = b.dataset.plano;
      if (cart.plano === id) cart.plano = null;
      else { if (cart.plano) aviso = "Um plano mensal por pedido: trocamos pelo " + PLANOS.filter(function (p) { return p.id === id; })[0].nome + "."; cart.plano = id; }
    }
    if (b.dataset.prop) alterna(cart.prop, b.dataset.prop);
    tudo();
  });

  $("ir-carrinho").addEventListener("click", function () {
    mostrar("loja");
    var reduz = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("carrinho").scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "start" });
  });

  function resumoContrato(t) {
    var itens = [];
    PROJ.forEach(function (p) {
      if (tem(cart.proj, p.id)) itens.push("<li><strong>" + p.nome + "</strong>: " + p.desc + " Prazo de " + p.prazo + ", contado a partir do briefing completo. Valor de " + brl(p.preco) +
        ", pago hoje por inteiro: " + formas(p) + ".</li>");
    });
    if (t.plano) itens.push("<li><strong>" + t.plano.nome + "</strong>: " + t.plano.desc + " " + brl(t.plano.mensal) + " por mês, mínimo de 3 meses (" + brl(t.plano.mensal * 3) +
      "). Depois do mínimo, aviso de 30 dias para sair. Com 7 dias de atraso, as publicações param até o pagamento.</li>");
    t.plus.forEach(function (p) {
      itens.push("<li><strong>" + p.nome + "</strong>" + (p.marca === "pc" ? "" : " (" + COM[p.marca] + ", em parceria; o seu contato continua sendo a Pode Curtir)") +
        ": " + p.desc + " " + p.prazo + ". Valor de " + brl(p.preco) + ", pago hoje por inteiro: " + formas(p) + ".</li>");
    });
    PROPOSTAS.forEach(function (a) {
      if (tem(cart.prop, a.id)) itens.push("<li><strong>" + a.nome + "</strong> (" + MARCA_NOME[a.marca] + "): pedido de proposta, sem valor e sem compromisso. A proposta chega por escrito em até 3 dias úteis.</li>");
    });
    return "<h3>O QUE VOCÊ ESTÁ CONTRATANDO</h3><ul>" + itens.join("") + "</ul>" +
      "<h3>CONDIÇÕES</h3><ul>" +
      "<li>Nada vai ao ar sem a sua aprovação por escrito; até 2 rodadas de ajuste por peça.</li>" +
      "<li>O acesso às suas contas é de parceiro, sem senha, e só com a sua autorização.</li>" +
      "<li>Se uma resposta ou um material seu atrasar, o prazo para pelo mesmo tempo.</li>" +
      "<li>Nenhum serviço garante número de seguidores, alcance ou vendas.</li>" +
      "<li>Fotos e vídeos: você usa sem prazo nas redes, no site e nos impressos do seu Negócio. Anúncio pago tem licença à parte.</li></ul>" +
      '<p class="limite"><strong>Desistência:</strong> em até 7 dias corridos da compra, pela página Desistir de uma compra, com devolução integral. Depois desse prazo e antes de o trabalho começar, devolução do valor pago menos 25% do valor total do serviço. Depois de 7 dias, com o trabalho em andamento, o valor pago cobre o trabalho já feito.</p>';
  }

  function mostrar(v) {
    $("vista-loja").hidden = v !== "loja";
    $("vista-checkout").hidden = v !== "checkout";
    window.scrollTo(0, 0);
  }

  /* Plus no fechamento: caixas para marcar, com escopo, preço e quem faz. */
  function plusLista() {
    var principal = temPrincipal();
    $("plus-campo").hidden = !principal;
    if (!principal) { $("plus-lista").innerHTML = ""; return; }
    $("plus-lista").innerHTML = PLUS.map(function (p) {
      var on = tem(cart.plus, p.id);
      return '<label class="plus-item" for="' + p.id + '"><input type="checkbox" id="' + p.id + '" data-plus="' + p.id + '"' + (on ? " checked" : "") + ">" +
        '<span class="plus-corpo"><span class="plus-topo"><span><span class="selo ' + p.marca + '">' + MARCA[p.marca] + "</span><strong>" + p.nome + "</strong></span>" +
        '<span class="num plus-preco">+ ' + brl(p.preco) + "</span></span>" +
        "<span>" + p.desc + "</span>" +
        '<span class="plus-meta">' + (p.marca === "pc" ? "" : "Em parceria, " + COM[p.marca] + ". ") + p.prazo + ". Pagamento: " + formas(p) + ".</span></span></label>";
    }).join("");
  }

  function montarCheckout() {
    var t = totais();
    var resumo = resumoContrato(t);
    /* O aceite vale para o pedido que a pessoa leu: se o resumo mudou, os aceites voltam a ficar em branco. */
    if (resumo !== resumoAceito) { $("aceite").checked = false; $("fundador").checked = false; resumoAceito = resumo; }
    $("resumo").innerHTML = resumo;
    $("linhas-2").innerHTML = linhas(false);
    $("totais-2").innerHTML = blocoTotais(t);
    $("fundador-campo").hidden = !t.fundador;
    var parc = t.pagos.filter(function (p) { return p.parcelas; });
    $("forma-campo").hidden = !parc.length;
    $("forma-cartao-txt").textContent = "Cartão de crédito, sem juros: " + parc.map(function (p) { return "até " + p.parcelas + "x " + p.em + " " + p.nome; }).join(" e ");
    $("pagar").textContent = t.pagos.length ? "Ir para o pagamento de " + brl(t.hoje) : "Enviar pedido de proposta";
    plusLista();
    return t;
  }

  $("continuar").addEventListener("click", function () {
    var t = montarCheckout();
    $("erro").hidden = true; $("resultado").hidden = true; $("form-checkout").hidden = false;
    mostrar("checkout");
    if (window.podecurtirEvento) window.podecurtirEvento("InitiateCheckout", { value: t.hoje, currency: "BRL" });
  });

  /* Marcar ou tirar um plus refaz o total e o resumo; se o resumo mudou, o aceite volta a ficar em branco. */
  $("plus-lista").addEventListener("change", function (e) {
    var id = e.target && e.target.dataset && e.target.dataset.plus;
    if (!id) return;
    var i = cart.plus.indexOf(id);
    if (e.target.checked && i < 0) cart.plus.push(id);
    if (!e.target.checked && i >= 0) cart.plus.splice(i, 1);
    salvar();
    carrinho();
    montarCheckout();
    var alvo = $(id); if (alvo) alvo.focus();
  });
  $("voltar").addEventListener("click", function () { mostrar("loja"); });

  function mensagem(t, d) {
    var l = ["Olá! Quero contratar pela loja da Pode Curtir:"];
    t.pagos.forEach(function (p) {
      l.push("- " + (p.marca ? "Plus: " : "") + p.nome + (p.marca && p.marca !== "pc" ? ", " + COM[p.marca] : "") +
        " (" + brl(p.valor) + " hoje" + (p.parcelas ? ", " + comoPaga(p) : "") + ")");
    });
    PROPOSTAS.forEach(function (a) { if (tem(cart.prop, a.id)) l.push("- Proposta: " + a.nome + " (" + MARCA_NOME[a.marca] + ")"); });
    l.push("Nome: " + d.nome, "E-mail: " + d.email, "WhatsApp: " + d.whats);
    l.push("Li e aceito o resumo do contrato em " + window.podecurtirAgora() + ".");
    if (t.fundador) l.push("Aceito o preço de fundador: depoimento com as minhas palavras e autorização para mostrar o trabalho.");
    return l.join("\n");
  }

  function registrar(dados) {
    if (!C.FORM_ENDPOINT) return Promise.resolve(false);
    return fetch(C.FORM_ENDPOINT, { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) })
      .then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  function obrigado(tipo) {
    var a = $("link-obrigado");
    location.href = a.getAttribute("href") + (tipo ? "?tipo=" + tipo : "");
  }

  function manual(titulo, texto, t) {
    $("resultado-titulo").textContent = titulo;
    $("resultado-texto").value = texto;
    $("resultado-whats").href = window.podecurtirWhats(texto);
    var links = t.pagos.map(function (p) {
      var url = linkDe(p);
      return url ? '<li><a class="pagar-item" href="' + esc(url) + '" rel="noopener">Pagar ' + esc(p.nome) + (p.parcelas ? " " + comoPaga(p) : "") + " · " + brl(p.valor) + "</a></li>"
        : "<li>" + esc(p.nome) + " · " + brl(p.valor) + ": pagamento em configuração</li>";
    });
    var todosComLink = t.pagos.length > 0 && t.pagos.every(function (p) { return !!linkDe(p); });
    $("resultado-instrucao").textContent = todosComLink
      ? "Toque em cada link para pagar. Depois, envie a mensagem abaixo pelo WhatsApp ou por e-mail para confirmarmos o seu pedido."
      : "Envie a mensagem abaixo pelo WhatsApp ou por e-mail. Se algum item ainda estiver com o pagamento em configuração, a gente responde com o link de pagamento.";
    $("resultado-links").innerHTML = links.join("");
    $("resultado-links").hidden = !links.length;
    $("resultado").hidden = false; $("form-checkout").hidden = true;
    $("resultado").scrollIntoView({ block: "start" });
  }

  $("form-checkout").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = totais();
    var d = { nome: $("nome").value.trim(), email: $("email").value.trim(), whats: $("whats").value.trim() };
    var falta = [];
    if (!d.nome) falta.push("nome");
    if (!/^\S+@\S+\.\S+$/.test(d.email)) falta.push("e-mail válido");
    if (d.whats.replace(/\D/g, "").length < 10) falta.push("WhatsApp com DDD");
    if (!$("aceite").checked) falta.push("aceite do resumo do contrato");
    if (t.fundador && !$("fundador").checked) falta.push("aceite do preço de fundador");
    if (t.pagos.some(function (p) { return p.parcelas; }) && !forma()) falta.push("forma de pagamento");
    if (falta.length) { $("erro").textContent = "Falta preencher: " + falta.join(", ") + "."; $("erro").hidden = false; return; }
    $("erro").hidden = true;
    var texto = mensagem(t, d);
    var pedido = {
      id: "PC-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
      tipo: t.pagos.length ? "compra" : "proposta", cliente: d, novidades: $("novidades").checked, avisos: $("avisos").checked,
      itens: t.pagos, plus: t.plus.map(function (p) { return p.id; }), propostas: cart.prop.slice(), hoje: t.hoje, forma: forma() || null,
      aceite: { contrato: true, fundador: t.fundador, em: new Date().toISOString() }, pagina: location.pathname
    };
    texto += "\nNúmero do pedido: " + pedido.id;

    if (!t.pagos.length) {
      if (window.podecurtirEvento) window.podecurtirEvento("Lead");
      registrar(pedido).then(function (ok) {
        if (ok) { cart = { proj: [], plano: null, prop: [], plus: [] }; salvar(); obrigado("proposta"); }
        else manual("Envie o seu pedido de proposta", texto, t);
      });
      return;
    }
    if (t.pagos.length === 1) {
      var url = linkDe(t.pagos[0]);
      if (url) {
        /* Sem registro (FORM_ENDPOINT vazio ou fora do ar), as propostas e o aceite iriam se perder no redirecionamento:
           mostra a mensagem pronta junto com o link de pagamento. */
        registrar(pedido).then(function (ok) {
          if (ok) location.href = url;
          else manual("Falta um passo: envie o pedido e pague pelo link", texto, t);
        });
        return;
      }
      manual("Pagamento em configuração", texto, t);
      return;
    }
    if (C.CHECKOUT_ENDPOINT) {
      fetch(C.CHECKOUT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pedido) })
        .then(function (r) { if (!r.ok) throw new Error("status " + r.status); return r.json(); })
        .then(function (j) { if (j && /^https:\/\//.test(j.url)) location.href = j.url; else throw new Error("sem url"); })
        .catch(function () { manual("Pague cada item pelo link", texto, t); });
      return;
    }
    /* Pedido com mais de um item: registra antes de mostrar os links, para a recuperação de pedido saber quem quase comprou. */
    registrar(pedido);
    manual(t.pagos.every(function (p) { return linkDe(p); }) ? "Pague cada item pelo link" : "Pagamento em configuração", texto, t);
  });

  tudo();
})();
