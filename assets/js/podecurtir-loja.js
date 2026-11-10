/* Pode Curtir — loja com carrinho (na página inicial /podecurtir desde 07/11/2026; /podecurtir/loja leva para lá). Valores de 03/11/2026, aprovados pela Jéssica.
   Decisões de 04/11/2026: no site o pagamento é integral (entrada e saldo só na venda presencial); o parcelamento
   fica só no cartão, com um link para Pix ou boleto à vista e outro para cartão; a Gestão Completa é vendida aqui,
   com assinatura. O WhatsApp fica para orçamento.
   Decisão de 04/11/2026 (Ficha v1.17): "plus" no fechamento do pedido. Com um serviço pago no pedido, o cliente pode
   marcar plus de escopo fechado: sessão de fotos de 1 hora (R$ 500), capa e diagramação do e-book (R$ 1.500),
   proteção das contas e mentoria em IA de 1 hora com Jéssica Gessoli (R$ 400 cada) e Site Essencial da Zethic
   (R$ 3.000, preço de fundador, até 3x no cartão). Os feitos em parceria aparecem em linha separada, com o nome de
   quem faz; o contato continua sendo a Pode Curtir. Trabalhos maiores seguem como pedido de proposta.
   Pagamento pelo link do Asaas de cada item (ASAAS_LINKS em podecurtir-config.js). Com vários itens pagos,
   usa o CHECKOUT_ENDPOINT (n8n) se estiver preenchido; senão, mostra o link de cada item.
   Decisões de 06/11/2026 (protótipo aprovado pela Jéssica): escolha do tipo de Negócio no topo (doceria, salão,
   consultório ou outro), com sugestão de por onde começar; seção "Proteção e recuperação de conta" (07/11: sem a palavra segurança na Pode Curtir, regra de 28/10) com a Proteção das contas e a
   Recuperação de conta (R$ 400 cada, em parceria), que podem ser compradas sozinhas ("avulso");
   08/11/2026 (Jéssica): proteção e recuperação de conta passam para a Zethic (blindagem técnica de contas é da Zethic,
   regra de 28/10) e aparecem numa faixa "Leve junto · opcional", com as cores da Zethic, depois do portfólio da Pode Curtir.
   No site nunca se usa "venda casada" (CDC, art. 39, I): a faixa é opcional e não condiciona nenhuma compra.
   o preço depois das vagas de fundador aparece em cada item.
   Decisão de 08/11/2026 (Jéssica: "Vamos subir todos no site", com benchmark de mercado e de lucro): seção
   "Para especialistas, produtoras e empresas" (secao: "esp"), com Diagnóstico, Presença em vídeo, Acabamento de vídeo
   e 4 planos mensais; Blog que publica sozinho (com a Zethic) e Licença do método entram como pedido de proposta,
   com o valor de referência na descrição. A Gestão de marca de especialista tem 1 vaga de fundador. */
(function () {
  var C = window.PODECURTIR || {};
  var LINKS = C.ASAAS_LINKS || {};
  var brl = function (v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 2 }); };
  var $ = function (id) { return document.getElementById(id); };
  var PRECO_AJUSTE = Number(C.PRECO_AJUSTE) || 500;

  var PROJ = [
    { id: "ajuste", nome: "Ajuste de Perfil", preco: PRECO_AJUSTE, prazo: "5 dias úteis", fundador: PRECO_AJUSTE === 500,
      desc: "Bio, nome, foto, link e botão de WhatsApp, destaques com capa, 3 posts fixados e revisão básica dos acessos da conta." },
    { id: "arrumado", nome: "Perfil Arrumado", preco: 2000, parcelas: 3, em: "no", prazo: "15 dias úteis", fundador: true,
      depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 3.200.",
      desc: "Tudo do Ajuste de Perfil, mais análise de quem você segue, curadoria da grade, revisão das legendas e dos acessos e plano de 30 dias." },
    { id: "marca", nome: "Marca Completa", preco: 7500, parcelas: 6, em: "na", prazo: "30 dias úteis", fundador: true,
      depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 12.000.",
      desc: "Tudo do Perfil Arrumado, mais paleta, tipografia, símbolo e assinatura, modelos de capa, post e story e manual curto de uso." },
    /* 09/11/2026 (D4 aprovada pela Jéssica): portfólio da empresa, preço de fundador para os 3 primeiros clientes. */
    { id: "portfolio", nome: "Portfólio da empresa", preco: 1200, prazo: "10 dias úteis", fundador: true,
      depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 1.900.",
      desc: "Apresentação da empresa em PDF de 10 a 12 páginas, com texto real: quem é, o que faz, para quem, como trabalha e como contratar. Clientes, números e depoimentos entram só se você enviar, com autorização. Fotos novas: some a sessão de fotos de 1 hora no fechamento do pedido." },
    { id: "diag_esp", secao: "esp", nome: "Diagnóstico de marca de especialista", preco: 1500, prazo: "10 dias úteis", fundador: true,
      depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 2.400. Se você contratar a Gestão de marca de especialista em até 30 dias, o valor vira crédito na 1ª mensalidade.",
      desc: "Leitura dos seus canais, do que você já publica e de quem já trabalha com você (produtora, mentora, editor), posicionamento em uma frase e plano de 30 dias." },
    { id: "video_presenca", secao: "esp", nome: "Presença em vídeo · treino individual", preco: 1500, prazo: "2 encontros em até 15 dias", fundador: true,
      depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 2.400.",
      desc: "2 encontros de 2 horas, online ou em Campinas/SP: roteiro falado, teleprompter, postura, voz e ritmo, com gravação de teste e devolutiva por escrito. Para render mais em cada gravação." },
    { id: "acabamento", secao: "esp", nome: "Acabamento de vídeo · 4 vídeos", preco: 600, prazo: "5 dias úteis", fundador: true,
      depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 960 (R$ 240 por vídeo).",
      desc: "Para quem já tem o vídeo editado: capa, gancho nos 3 primeiros segundos e legendas para cada rede. R$ 150 por vídeo." },
    /* 08/11/2026 (Jéssica aprovou): cardápio de restaurante. A Pode Curtir vende e cuida do conteúdo; a página e o app
       (instalável pelo navegador, sem loja de apps) são feitos pela Zethic, em parceria (regra de 28/10: tecnologia é da Zethic). */
    { id: "cardapio", secao: "rest", nome: "Cardápio Pronto", preco: 1500, prazo: "10 dias úteis", fundador: true,
      depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 2.400.",
      desc: "Até 30 itens: textos dos pratos, categorias, preços e alérgenos que você informar. Cardápio no celular, que abre pelo QR code e pode ser instalado na tela como um app, com QR code para mesas e balcão, cardápio impresso para a entrada (PDF pronto para a gráfica, com os mesmos preços), botão de pedido pelo WhatsApp sem taxa por pedido e link no Instagram e no Perfil da Empresa no Google. 12 meses no ar incluídos. Página e app feitos pela Zethic, em parceria." },
    /* 10/11/2026 (Jéssica): itens com link no Asaas criados em 09/11/2026. Tradução junto do cardápio; catálogo para
       quem vende produto ou serviço (doceria, salão, loja), no mesmo modelo do cardápio, com a Zethic em parceria. */
    { id: "traducao", secao: "rest", nome: "Tradução do cardápio · inglês e espanhol", preco: 300, prazo: "10 dias úteis", fundador: true,
      depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 480.",
      desc: "Para quem tem ou leva junto o Cardápio Pronto: o cardápio também em inglês e espanhol, com nomes, descrições e categorias dos pratos (até 30 itens), para atender turistas sem traduzir na hora." },
    { id: "catalogo", secao: "cat", nome: "Catálogo Pronto", preco: 1500, prazo: "10 dias úteis", fundador: true,
      depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 2.400.",
      desc: "Até 30 itens com nome, descrição, preço e foto que você enviar. Catálogo no celular, que abre pelo QR code e pelo link na bio, com botão de pedido pelo WhatsApp sem taxa por pedido e link no Instagram e no Perfil da Empresa no Google. 12 meses no ar incluídos. Página e app feitos pela Zethic, em parceria." }
  ];
  var PLANOS = [
    { id: "essencial", nome: "Gestão Essencial", mensal: 1500, depois: "Preço de fundador. A partir do 4º cliente, R$ 2.400 por mês.", desc: "1 rede, 12 posts por mês e relatório mensal." },
    { id: "padrao", nome: "Gestão Padrão", mensal: 2800, depois: "Preço de fundador. A partir do 4º cliente, R$ 4.480 por mês.", desc: "2 redes, 16 posts e 4 Reels por mês, com relatório." },
    { id: "completa", nome: "Gestão Completa", mensal: 4500, depois: "Preço de fundador. A partir do 4º cliente, R$ 7.200 por mês.", desc: "3 redes, 20 posts e 8 Reels por mês." },
    { id: "esp_marca", secao: "esp", nome: "Gestão de marca de especialista", mensal: 7650, depois: "Preço de fundador para 1 cliente. Depois, R$ 12.240 por mês.",
      desc: "A sua marca de ponta a ponta: estratégia, roteiros, coordenação da produtora e da mentora que você já tem, acabamento, publicação, newsletter e relatório. Você grava, confere os fatos e aprova." },
    { id: "esp_produtora", secao: "esp", nome: "Coordenação da sua produtora", mensal: 3150, depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 5.040 por mês.",
      desc: "Para quem já tem produtora ou editor e não quer coordenar: padrão de edição, calendário de gravação, prazos, revisões e aceite das entregas. Até 21 horas por mês." },
    { id: "esp_news", secao: "esp", nome: "Newsletter pronta · 2 edições por mês", mensal: 1200, depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 1.920 por mês.",
      desc: "Pauta, texto com fontes, capa e texto pronto para publicar no LinkedIn. Com blog no site, a edição também entra lá." },
    { id: "esp_portavozes", secao: "esp", nome: "Programa de porta-vozes · 2 porta-vozes", mensal: 5800, depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 9.200 por mês.",
      desc: "Para empresas: posts e roteiros de vídeo para 2 líderes, com calendário e aprovação numa rotina só. Mais porta-vozes por proposta: 10% de desconto a partir do 3º e 15% a partir do 5º." },
    { id: "cardapio_mensal", secao: "rest", nome: "Cuidado do Cardápio", mensal: 290, depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 460 por mês.",
      desc: "Para quem já tem o Cardápio Pronto: até 10 trocas por mês (1 troca = mudar um item: preço, nome, descrição, foto ou disponibilidade), 1 post do prato da semana e relatório dos pratos mais vistos. O cardápio fica no ar sem custo de hospedagem. Nada entra no ar sem a sua aprovação." },
    { id: "catalogo_mensal", secao: "cat", nome: "Cuidado do Catálogo", mensal: 290, depois: "Preço de fundador para os 3 primeiros clientes. Depois, R$ 460 por mês.",
      desc: "Para quem já tem o Catálogo Pronto: até 10 trocas por mês (1 troca = mudar um item: preço, nome, descrição, foto ou disponibilidade), 1 post do produto da semana e relatório dos produtos mais vistos. Nada entra no ar sem a sua aprovação." }
  ];
  /* Planos de Gestão que entram na campanha de Black Friday (a Proteção das contas de bônus vale só para eles). */
  var GESTAO = ["essencial", "padrao", "completa"];
  var PROPOSTAS = [
    { id: "gravacao", marca: "pc", nome: "Sessão de fotos, ensaio e gravação de vídeo", plus: "plus_gravacao", desc: "Produto, ambiente ou retrato profissional; diária, evento ou sessão maior. O deslocamento entra na proposta." },
    { id: "livro", marca: "pc", nome: "Livro pronto", plus: "plus_livro", desc: "Revisão, capa, diagramação, publicação e divulgação." },
    { id: "produto_digital", marca: "pc", nome: "Produto digital e curso online", desc: "Roteiro, gravação e edição das aulas, capa e materiais do curso ou do produto. A plataforma (Hotmart ou outra) e as vendas ficam no nome do autor; a área de cursos pode ser montada pela Zethic, em parceria." },
    { id: "protecao", marca: "ze", nome: "Proteção das contas da equipe inteira", plus: "plus_protecao", desc: "Mais de 3 contas ou a equipe toda. Feita pela Zethic, em parceria. Sem senha." },
    { id: "mentoria", marca: "jg", nome: "Mentoria e consultoria em IA", plus: "plus_mentoria", desc: "Você aprende a fazer com IA, no seu projeto. Com Jéssica Gessoli." },
    { id: "tech", marca: "ze", nome: "Site, app, automação e bot de WhatsApp", plus: "plus_site", desc: "Feitos pela Zethic, em parceria. Atendimento e dados das redes num lugar só." },
    { id: "blog", marca: "ze", nome: "Blog que publica sozinho", desc: "Feito pela Zethic, em parceria: área de blog no site do seu Negócio, com textos programados que entram no ar sozinhos na data. Implantação a partir de R$ 1.500 (preço de fundador); a proposta confirma se o seu site é compatível." },
    { id: "licenca", marca: "pc", nome: "Licença do método de produção", desc: "Para produtoras e agências: o fluxo de produção da Pode Curtir, com treino de 8 horas da equipe, modelos e listas de conferência. A partir de R$ 2.400 por ano (preço de fundador); renovação anual de R$ 1.200." }
  ];
  /* Plus do fechamento do pedido: escopo fechado e preço próprio. Só entram com um serviço pago no pedido,
     menos os marcados "avulso", que também se compram sozinhos: proteção e recuperação de conta (06/11/2026, seção "contas")
     e, desde 07/11/2026, capa e diagramação do e-book e mentoria em IA de 1 hora (seção "conteudo"). */
  var PLUS = [
    { id: "plus_gravacao", marca: "pc", nome: "Sessão de fotos de 1 hora", preco: 500, prazo: "Edição pronta em até 14 dias depois da sessão",
      desc: "10 fotos editadas, em Campinas/SP. Fora de Campinas, o deslocamento é combinado antes e cobrado à parte." },
    { id: "plus_livro", marca: "pc", nome: "Capa e diagramação do e-book", preco: 1500, avulso: true, secao: "conteudo", prazo: "Prazo combinado por escrito depois do briefing",
      desc: "Com o texto pronto, até 100 páginas: capa simples e diagramação do e-book. ISBN, ficha catalográfica e gráfica ficam com o autor." },
    { id: "plus_protecao", marca: "ze", nome: "Proteção das contas", preco: 400, avulso: true, secao: "contas", prazo: "Data combinada depois do pagamento",
      desc: "1 hora a distância, até 3 contas do Negócio: verificação em duas etapas, e-mail e telefone de recuperação, revisão de acessos e acesso de parceiro, sem senha. Conta já invadida ou bloqueada: Recuperação de conta." },
    { id: "plus_recuperacao", marca: "ze", nome: "Recuperação de conta", preco: 400, avulso: true, secao: "contas", prazo: "Data combinada depois do pagamento",
      desc: "1 hora a distância, para conta invadida ou bloqueada, pelos canais oficiais da plataforma. A decisão de devolver a conta é da plataforma; por isso, não há garantia de recuperação." },
    { id: "plus_mentoria", marca: "jg", nome: "Mentoria em IA · 1 hora", preco: 400, avulso: true, secao: "conteudo", prazo: "Data combinada depois do pagamento",
      desc: "Por videochamada, nas ferramentas de IA que você já tem. Você aprende fazendo, no seu projeto." },
    { id: "plus_site", marca: "ze", nome: "Site Essencial", preco: 3000, parcelas: 3, em: "no", fundador: true, prazo: "Prazo combinado por escrito depois do briefing",
      desc: "Site de uma página com apresentação e serviços, botão de WhatsApp, formulário, mapa e cadastro no Google. Domínio e hospedagem ficam no nome do seu Negócio, à parte. Preço de fundador para os 3 primeiros clientes." }
  ];
  /* Benefício de cada item (08/11/2026, revisão de publicidade pedida pela Jéssica): uma linha "para quê", antes da
     descrição. Diz a finalidade, nunca promete resultado (CDC, art. 37; nenhum serviço garante seguidores ou vendas). */
  var PARA = {
    ajuste: "Para quem chega ao seu perfil entender o que você vende e chamar no WhatsApp.",
    arrumado: "Para o perfil mostrar o tamanho do seu Negócio, sem você precisar aprender a fazer.",
    marca: "Para o seu Negócio ter a mesma cara em tudo e ser reconhecido de longe.",
    portfolio: "Para mandar uma apresentação pronta depois da primeira conversa com um cliente.",
    diag_esp: "Para saber o que ajustar antes de investir em mais conteúdo.",
    video_presenca: "Para gravar com naturalidade e perder menos tempo em cada gravação.",
    acabamento: "Para o vídeo que você já tem prender a atenção nos primeiros segundos.",
    essencial: "Para a sua rede ficar ativa todo mês sem você parar de atender.",
    padrao: "Para mostrar o seu trabalho em vídeo toda semana.",
    completa: "Para estar em 3 redes sem montar uma equipe.",
    esp_marca: "Para a sua marca andar sem você coordenar ninguém.",
    esp_produtora: "Para a sua produtora entregar no seu padrão, sem você cobrar prazo.",
    esp_news: "Para o seu nome aparecer para quem já segue você, duas vezes por mês.",
    esp_portavozes: "Para os líderes da empresa aparecerem com frequência, sem travar a agenda.",
    cardapio: "Para o cliente ver o cardápio no celular e pedir pelo WhatsApp, sem taxa por pedido.",
    cardapio_mensal: "Para preço novo e prato novo entrarem no ar sem você mexer no cardápio.",
    traducao: "Para o turista entender o cardápio e pedir sem ajuda.",
    catalogo: "Para o cliente ver o que você vende no celular e pedir pelo WhatsApp, sem taxa por pedido.",
    catalogo_mensal: "Para preço novo e produto novo entrarem no ar sem você mexer no catálogo.",
    plus_livro: "Para o seu texto virar um e-book pronto para vender ou presentear.",
    plus_mentoria: "Para você fazer com IA, no seu projeto, com alguém do lado.",
    plus_protecao: "Para as contas do Negócio ficarem mais difíceis de invadir.",
    plus_recuperacao: "Para tentar reaver a conta pelos canais oficiais, com quem conhece o caminho."
  };
  function beneficio(p) { return PARA[p.id] ? '<p class="beneficio">' + PARA[p.id] + "</p>" : ""; }
  function plusDe(id) { return PLUS.filter(function (p) { return p.id === id; })[0]; }
  /* Tipo de Negócio (06/11/2026): sugestão de por onde começar, a partir das personas de clientes (hipótese até as entrevistas). */
  var TIPOS = [
    { id: "doceria", nome: "Doceria ou confeitaria", proj: ["ajuste"], plano: null, plus: ["plus_gravacao"], prop: [],
      txt: "Comece pelo <strong>Ajuste de Perfil</strong>: bio que diz o que você vende, cardápio nos destaques e botão de WhatsApp para encomendar. Se as fotos do celular não mostram o capricho dos doces, some a <strong>sessão de fotos de 1 hora</strong> no fechamento do pedido.", foco: ["t-perfil", "t-cat", "t-planos", "t-contas", "t-propostas"] },
    { id: "salao", nome: "Salão ou estúdio de beleza", proj: [], plano: "padrao", plus: [], prop: [], alt: ["arrumado"],
      txt: "A <strong>Gestão Padrão</strong> tem 4 Reels por mês para mostrar o seu trabalho sem você parar de atender. Prefere sem mensalidade? O <strong>Perfil Arrumado</strong> é um projeto com começo, meio e fim.", foco: ["t-perfil", "t-cat", "t-planos", "t-contas", "t-propostas"] },
    { id: "consultorio", nome: "Consultório de saúde", proj: ["arrumado"], plano: null, plus: [], prop: ["gravacao"],
      txt: "O <strong>Perfil Arrumado</strong> organiza o seu perfil com discrição, e o <strong>ensaio de fotos</strong> sai por proposta. Antes do primeiro post, você confirma a regra de publicidade do seu conselho profissional. Nada de foto, relato ou dado de paciente.", foco: ["t-perfil", "t-planos", "t-contas", "t-propostas"] },
    { id: "especialista", nome: "Especialista, consultor ou palestrante", proj: ["diag_esp"], plano: null, plus: [], prop: [],
      txt: "Comece pelo <strong>Diagnóstico de marca de especialista</strong>: o que você já tem, quem já trabalha com você e o plano de 30 dias. Se você já paga produtora e mentora e não quer mais coordenar todo mundo, a <strong>Gestão de marca de especialista</strong> cuida de tudo.", foco: ["t-esp", "t-perfil", "t-conteudo", "t-propostas"] },
    { id: "restaurante", nome: "Restaurante, lanchonete ou bar", proj: ["cardapio"], plano: null, plus: ["plus_gravacao"], prop: [],
      txt: "Comece pelo <strong>Cardápio Pronto</strong>: cardápio no celular, QR code nas mesas e pedido pelo WhatsApp, sem taxa por pedido. Se as fotos dos pratos não mostram o capricho da cozinha, some a <strong>sessão de fotos de 1 hora</strong> no fechamento do pedido. Depois, o <strong>Cuidado do Cardápio</strong> mantém preços e pratos em dia.", foco: ["t-rest", "t-perfil", "t-contas", "t-propostas"] },
    { id: "cozinha_delivery", nome: "Cozinha de delivery (em casa)", proj: ["cardapio"], plano: null, plus: ["plus_gravacao"], prop: [],
      txt: "Sem salão e sem balcão? O <strong>Cardápio Pronto</strong> vira o seu link de pedidos: fica na bio do Instagram e na mensagem de saudação do WhatsApp, e o cliente escolhe, vê o total e manda o pedido montado, sem taxa por pedido. O exemplo de delivery está na seção para restaurantes, logo abaixo. Depois, o <strong>Cuidado do Cardápio</strong> mantém preços e pratos em dia.", foco: ["t-rest", "t-perfil", "t-contas", "t-propostas"] },
    { id: "outro", nome: "Outro Negócio", proj: [], plano: null, plus: [], prop: [],
      txt: "Veja os três níveis do Perfil Pronto logo abaixo. Se o seu caso for diferente, peça proposta, sem compromisso." }
  ];
  var tipo = null;
  function tipoAtual() { return TIPOS.filter(function (t) { return t.id === tipo; })[0] || null; }
  function sugerido(tipoItem, id) {
    var t = tipoAtual(); if (!t) return false;
    if (tipoItem === "plano") return t.plano === id;
    if (tipoItem === "proj") return tem(t.proj, id) || tem(t.alt || [], id);
    return tem(t[tipoItem] || [], id);
  }
  /* 10/11/2026 (Jéssica): escolher o tipo de Negócio mostra só as seções que servem para ele (foco), com um botão
     para ver tudo. "Outro Negócio" e quem não escolhe veem a loja inteira. */
  var verTudo = false;
  function focar() {
    var t = tipoAtual(), foco = t && t.foco && !verTudo ? t.foco : null;
    Array.prototype.forEach.call(document.querySelectorAll(".layout section.secao[aria-labelledby]"), function (sec) {
      sec.hidden = !!foco && foco.indexOf(sec.getAttribute("aria-labelledby")) < 0;
    });
    $("foco").hidden = !foco;
  }
  function tipos() {
    focar();
    $("tipos-opcoes").innerHTML = TIPOS.map(function (t) {
      return '<button class="pedir" type="button" data-tipo="' + t.id + '" aria-pressed="' + (tipo === t.id) + '">' + t.nome + "</button>";
    }).join("");
    var t = tipoAtual();
    $("sugestao").hidden = !t;
    if (t) {
      var algo = t.proj.length || t.plano || t.plus.length || t.prop.length;
      $("sugestao").innerHTML = "<p>" + t.txt + "</p>" + (algo ? '<button class="pedir" type="button" id="usar-sugestao">Pôr a sugestão no pedido</button>' : "");
    }
  }
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
  /* Medição (07/11/2026, benchmark de publicidade aprovado pela Jéssica): tipo de Negócio escolhido, item posto no
     pedido e, ao seguir para o Asaas, o valor guardado para a página de confirmação registrar a compra (Purchase). */
  function medir(nome, params) { if (window.podecurtirEvento) window.podecurtirEvento(nome, params); }
  var PAGAMENTO = "podecurtir-pagamento-v1";
  function marcarPagamento(valor) {
    try { localStorage.setItem(PAGAMENTO, JSON.stringify({ valor: valor, em: Date.now() })); } catch (e) {}
  }
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
    var marcaSug = '<span class="marca-sugestao">PARA O SEU NEGÓCIO</span>';
    function cardProj(p) {
      var on = tem(cart.proj, p.id), sug = sugerido("proj", p.id);
      return '<article class="item' + (sug ? " sugerido" : "") + '">' + (sug ? marcaSug : "") + "<h3>" + p.nome + '</h3><p class="preco num">' + brl(p.preco) + "</p>" + beneficio(p) + "<p>" + p.desc + "</p>" +
        (p.id === "ajuste" ? '<p class="vagas">' + textoVagas() + "</p>" : (p.depois ? '<p class="vagas">' + p.depois + "</p>" : "")) +
        '<dl class="meta"><div><dt>Prazo</dt><dd>' + p.prazo + ', a partir do briefing completo</dd></div><div><dt>Pagamento</dt><dd>Integral: ' + formas(p) + "</dd></div></dl>" +
        '<button class="por" type="button" data-proj="' + p.id + '" aria-pressed="' + on + '">' + (on ? "No pedido · tirar" : "Pôr no meu pedido") + "</button></article>";
    }
    function cardPlano(p) {
      var on = cart.plano === p.id, sug = sugerido("plano", p.id);
      return '<article class="item' + (sug ? " sugerido" : "") + '">' + (sug ? marcaSug : "") + "<h3>" + p.nome + '</h3><p class="preco num">' + brl(p.mensal) + ' <small>por mês</small></p>' + beneficio(p) + "<p>" + p.desc + "</p>" +
        (p.depois ? '<p class="vagas">' + p.depois + "</p>" : "") +
        '<dl class="meta"><div><dt>Mínimo</dt><dd>3 meses = ' + brl(p.mensal * 3) + '</dd></div><div><dt>Pagamento</dt><dd>1ª mensalidade hoje; depois, todo mês</dd></div></dl>' +
        '<button class="por" type="button" data-plano="' + p.id + '" aria-pressed="' + on + '">' + (on ? "No pedido · tirar" : "Pôr no meu pedido") + "</button></article>";
    }
    function daSecao(lista, secao) { return lista.filter(function (p) { return (p.secao || "") === secao; }); }
    $("grade-perfil").innerHTML = daSecao(PROJ, "").map(cardProj).join("");
    function avulsos(secao) {
      return PLUS.filter(function (p) { return p.avulso && p.secao === secao; }).map(function (p) {
        var on = tem(cart.plus, p.id);
        return '<article class="item"><h3>' + ((secao === "conteudo" || secao === "contas") && p.marca !== "pc" ? '<span class="selo ' + p.marca + '">' + MARCA[p.marca] + "</span>" : "") + p.nome + '</h3><p class="preco num">' + brl(p.preco) + "</p>" + beneficio(p) + "<p>" + p.desc + "</p>" +
          '<dl class="meta"><div><dt>Quando</dt><dd>' + p.prazo + '</dd></div><div><dt>Pagamento</dt><dd>Integral: ' + formas(p) + "</dd></div></dl>" +
          '<button class="por" type="button" data-plus="' + p.id + '" aria-pressed="' + on + '">' + (on ? "No pedido · tirar" : "Pôr no meu pedido") + "</button></article>";
      }).join("");
    }
    $("grade-contas").innerHTML = avulsos("contas");
    $("grade-conteudo").innerHTML = avulsos("conteudo");
    $("grade-planos").innerHTML = daSecao(PLANOS, "").map(cardPlano).join("");
    $("grade-rest").innerHTML = daSecao(PROJ, "rest").map(cardProj).join("") + daSecao(PLANOS, "rest").map(cardPlano).join("");
    $("grade-esp").innerHTML = daSecao(PROJ, "esp").map(cardProj).join("") + daSecao(PLANOS, "esp").map(cardPlano).join("");
    $("grade-cat").innerHTML = daSecao(PROJ, "cat").map(cardProj).join("") + daSecao(PLANOS, "cat").map(cardPlano).join("");
    $("lista-propostas").innerHTML = PROPOSTAS.map(function (a) {
      var on = tem(cart.prop, a.id);
      var x = a.plus ? plusDe(a.plus) : null;
      return '<div class="proposta' + (sugerido("prop", a.id) ? " sugerido" : "") + '"><div><span class="selo ' + a.marca + '">' + MARCA[a.marca] + "</span><strong>" + a.nome + "</strong><p>" + a.desc + "</p>" +
        (x ? '<p class="plus-dica">Ou como plus, no fechamento de um pedido: ' + x.nome + " por " + brl(x.preco) + ".</p>" : "") + "</div>" +
        '<button class="pedir" type="button" data-prop="' + a.id + '" aria-pressed="' + on + '">' + (on ? "Pedido · tirar" : "Quero uma proposta") + "</button></div>";
    }).join("");
  }

  function totais() {
    var hoje = 0, plano = null, pagos = [], fundador = false;
    /* Preço de fundador (termos, item 2): só nos itens vendidos pelo preço dos 3 primeiros clientes.
       No Ajuste de Perfil, só a R$ 500; a R$ 750 ou R$ 1.200 não se pede depoimento nem autorização. */
    PROJ.forEach(function (p) { if (tem(cart.proj, p.id)) { hoje += p.preco; pagos.push({ id: p.id, nome: p.nome, valor: p.preco, parcelas: p.parcelas || 0, em: p.em || "" }); if (p.fundador) fundador = true; } });
    PLANOS.forEach(function (p) { if (cart.plano === p.id) { plano = p; hoje += p.mensal; pagos.push({ id: p.id, nome: p.nome, valor: p.mensal }); fundador = true; } });
    /* Plus só com um serviço pago no pedido; os "avulso" (contas, e-book e mentoria em IA) também sozinhos. */
    var principal = pagos.length > 0;
    /* Com o bônus da Black Friday, a Proteção das contas sai da cobrança (review do PR #117). */
    var plus = PLUS.filter(function (p) { return tem(cart.plus, p.id) && (principal || p.avulso) && !(p.id === "plus_protecao" && bonusValido()); });
    plus.forEach(function (p) {
      hoje += p.preco;
      pagos.push({ id: p.id, nome: p.nome, valor: p.preco, parcelas: p.parcelas || 0, em: p.em || "", marca: p.marca, secao: p.secao || "" });
      if (p.fundador) fundador = true;
    });
    return { hoje: hoje, plano: plano, pagos: pagos, plus: plus, fundador: fundador, props: cart.prop.length,
      total: cart.proj.length + (plano ? 1 : 0) + plus.length + cart.prop.length };
  }
  function temPrincipal() { return cart.proj.length > 0 || !!cart.plano; }

  /* Campanha de Black Friday (23 a 30/11/2026, em podecurtir-comum.js): Perfil Arrumado, Marca Completa ou qualquer
     Gestão mensal no pedido ganham a Proteção das contas. Aparece no pedido e na mensagem, para o bônus ser cumprido. */
  function bonusValido() {
    var c = window.podecurtirCampanha && window.podecurtirCampanha();
    return !!(c && c.bonus && (tem(cart.proj, "arrumado") || tem(cart.proj, "marca") || tem(GESTAO, cart.plano)));
  }
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
    PLUS.forEach(function (p) {
      if (!tem(cart.plus, p.id) || !(temPrincipal() || p.avulso) || (p.id === "plus_protecao" && bonusValido())) return;
      out.push('<li><span><span class="selo ' + p.marca + '">' + MARCA[p.marca] + "</span>" + p.nome + '</span><span class="num">' + brl(p.preco) + "</span><small>" + (p.avulso && !temPrincipal() ? (p.secao === "contas" ? "Leve junto · Zethic" : "Livro e IA") : "Plus") + " · pagamento integral · " + formas(p) + "</small>" +
        (comTirar ? '<button class="tirar" type="button" data-plus="' + p.id + '">Tirar</button>' : "") + "</li>");
    });
    PROPOSTAS.forEach(function (a) {
      if (!tem(cart.prop, a.id)) return;
      out.push('<li><span><span class="selo ' + a.marca + '">' + MARCA[a.marca] + "</span>" + a.nome + "</span><span>proposta</span><small>Sem valor agora</small>" +
        (comTirar ? '<button class="tirar" type="button" data-prop="' + a.id + '">Tirar</button>' : "") + "</li>");
    });
    if (bonusValido()) out.push('<li class="bonus"><span>Bônus Black Friday: Proteção das contas</span><span class="num">' + brl(0) + "</span><small>Incluída até 30/11 · feita pela Zethic · data combinada depois do pagamento</small></li>");
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

  function tudo() { tipos(); catalogo(); carrinho(); salvar(); }

  document.addEventListener("click", function (e) {
    if ($("vista-loja").hidden || !e.target.closest) return;
    var tb = e.target.closest("[data-tipo]");
    if (tb) {
      tipo = tipo === tb.dataset.tipo ? null : tb.dataset.tipo;
      verTudo = false;
      if (tipo) medir("EscolheuTipo", { tipo: tipo });
      tudo(); return;
    }
    if (e.target.closest("#ver-tudo")) { verTudo = true; medir("VerTudo", { tipo: tipo || "" }); focar(); return; }
    if (e.target.closest("#usar-sugestao")) {
      var t = tipoAtual();
      cart = { proj: t.proj.slice(), plano: t.plano, prop: t.prop.slice(), plus: t.plus.slice() };
      aviso = "Sugestão para " + t.nome.toLowerCase() + " no pedido. Você pode trocar à vontade.";
      medir("AddToCart", { content_name: "sugestao_" + t.id });
      tudo();
    }
  });

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-proj],[data-plano],[data-prop],button[data-plus]");
    if (!b || $("vista-loja").hidden) return;
    aviso = "";
    var item = b.dataset.plus || b.dataset.proj || b.dataset.plano || b.dataset.prop;
    var lista = b.dataset.plus ? cart.plus : b.dataset.proj ? cart.proj : b.dataset.prop ? cart.prop : null;
    if (lista ? !tem(lista, item) : cart.plano !== item) medir("AddToCart", { content_name: item });
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
    if (e.target.checked && i < 0) { cart.plus.push(id); medir("AddToCart", { content_name: id }); }
    if (!e.target.checked && i >= 0) cart.plus.splice(i, 1);
    salvar();
    catalogo();
    carrinho();
    montarCheckout();
    var alvo = $(id); if (alvo) alvo.focus();
  });
  $("voltar").addEventListener("click", function () { mostrar("loja"); });

  /* Página única (07/11/2026, review do PR #106): no fechamento, um link para um trecho da página (#loja, #como,
     #duvidas, no cabeçalho ou no rodapé) volta à loja antes de rolar, porque esses trechos ficam dentro da vista da loja. */
  function irPara(hash) {
    var alvo = hash && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    if (!alvo || !$("vista-loja").contains(alvo) || !$("vista-loja").hidden) return false;
    mostrar("loja");
    alvo.scrollIntoView();
    return true;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href*='#']") : null;
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname) return;
    if (irPara(a.hash)) { e.preventDefault(); if (location.hash !== a.hash) history.pushState(null, "", a.hash); }
  });
  window.addEventListener("hashchange", function () { irPara(location.hash); });

  function mensagem(t, d) {
    var l = ["Olá! Quero contratar pela loja da Pode Curtir:"];
    t.pagos.forEach(function (p) {
      l.push("- " + (p.marca ? (temPrincipal() ? "Plus: " : (p.secao === "contas" ? "Leve junto (Zethic): " : "Livro e IA: ")) : "") + p.nome + (p.marca && p.marca !== "pc" ? ", " + COM[p.marca] : "") +
        " (" + brl(p.valor) + " hoje" + (p.parcelas ? ", " + comoPaga(p) : "") + ")");
    });
    PROPOSTAS.forEach(function (a) { if (tem(cart.prop, a.id)) l.push("- Proposta: " + a.nome + " (" + MARCA_NOME[a.marca] + ")"); });
    l.push("Nome: " + d.nome, "E-mail: " + d.email, "WhatsApp: " + d.whats);
    l.push("Li e aceito o resumo do contrato em " + window.podecurtirAgora() + ".");
    if (t.fundador) l.push("Aceito o preço de fundador: depoimento com as minhas palavras e autorização para mostrar o trabalho.");
    if (bonusValido()) l.push("Bônus Black Friday: Proteção das contas incluída, sem custo (campanha até 30/11).");
    return l.join("\n");
  }

  function registrar(dados) {
    if (!C.FORM_ENDPOINT) return Promise.resolve(false);
    // text/plain evita a verificação prévia do navegador, que o Google Apps Script não atende.
    // keepalive: o envio continua mesmo se a cliente tocar no link de pagamento antes de ele terminar.
    return fetch(C.FORM_ENDPOINT, { method: "POST", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(dados) })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { return !!(j && j.ok); }).catch(function () { return false; });
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
      return url ? '<li><a class="pagar-item" href="' + esc(url) + '" data-valor="' + p.valor + '" rel="noopener">Pagar ' + esc(p.nome) + (p.parcelas ? " " + comoPaga(p) : "") + " · " + brl(p.valor) + "</a></li>"
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
      aceite: { contrato: true, fundador: t.fundador, em: new Date().toISOString() }, pagina: location.pathname,
      campanha: (window.podecurtirCampanha && window.podecurtirCampanha()) ? window.podecurtirCampanha().id : null,
      bonus: bonusValido() ? ["plus_protecao"] : [],
      links: t.pagos.filter(function (p) { return !!linkDe(p); }).map(function (p) { return { nome: p.nome, valor: p.valor, url: linkDe(p) }; })
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
          if (ok) { marcarPagamento(t.hoje); location.href = url; }
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
        .then(function (j) { if (j && /^https:\/\//.test(j.url)) { marcarPagamento(t.hoje); location.href = j.url; } else throw new Error("sem url"); })
        .catch(function () { manual("Pague cada item pelo link", texto, t); });
      return;
    }
    /* Pedido com mais de um item: registra antes de mostrar os links, para a recuperação de pedido saber quem quase comprou. */
    registrar(pedido);
    manual(t.pagos.every(function (p) { return linkDe(p); }) ? "Pague cada item pelo link" : "Pagamento em configuração", texto, t);
  });

  /* Link por persona: ?negocio=doceria (ou salao, consultorio, outro) abre a loja com o tipo já escolhido. */
  var doLink = new URLSearchParams(location.search).get("negocio");
  if (doLink && TIPOS.some(function (x) { return x.id === doLink; })) {
    tipo = doLink;
    /* Depois do load: a medição só liga quando as partes comuns terminam de iniciar (aceite de cookies). */
    window.addEventListener("load", function () { medir("EscolheuTipo", { tipo: doLink, origem: "link" }); });
  }

  document.addEventListener("click", function (e) {
    /* Cada link do Asaas paga um item só: guarda o valor daquele item (review do PR #111). */
    var a = e.target.closest && e.target.closest("a.pagar-item");
    if (a) marcarPagamento(Number(a.getAttribute("data-valor")) || 0);
  });

  tudo();
})();
