/* Pode Curtir — configuração da loja e das páginas de compra (/podecurtir/loja, termos, privacidade, desistência).
   Um só lugar para preencher antes de publicar. Campos vazios deixam a função desligada, sem erro.

   ASAAS_LINKS: link de pagamento do Asaas de cada item (https://www.asaas.com/...). Vazio = "pagamento em configuração".
     Decisão de 04/11/2026: no site o pagamento é integral. Perfil Arrumado e Marca Completa têm dois links:
     _pix (Pix ou boleto, à vista) e _cartao (só cartão, em até 3x e 6x sem juros). O parcelamento fica só no cartão.
     O link do Ajuste de Perfil a R$ 500 aceita 3 vendas (as vagas de fundador); depois ele fecha sozinho.
     Plus do fechamento do pedido (04/11/2026, Ficha v1.17): plus_gravacao (R$ 500), plus_livro (R$ 1.500),
     plus_mentoria (R$ 300 desde 10/11/2026, Jéssica Gessoli), plus_protecao (R$ 400, Zethic desde 08/11/2026) e o Site Essencial da Zethic (R$ 3.000), com dois links:
     plus_site_pix e plus_site_cartao (até 3x). Os links do Site Essencial aceitam 3 vendas (vagas de fundador).
     plus_recuperacao (06/11/2026): Recuperação de conta, R$ 400, Zethic desde 08/11/2026. Link criado pela Jéssica em 08/11/2026
     ("Zethic · Recuperação de conta"): cobrança avulsa, sem limite, boleto com 2 dias úteis.
     Seção "Para especialistas, produtoras e empresas" (08/11/2026), links criados pela Jéssica em 08/11/2026:
     diag_esp (R$ 1.500), video_presenca (R$ 1.500) e acabamento (R$ 600), cobrança avulsa com limite de 3 vendas;
     assinaturas mensais esp_marca (R$ 7.650/mês, limite de 1 venda: 1 vaga de fundador), esp_produtora (R$ 3.150/mês),
     esp_news (R$ 1.200/mês) e esp_portavozes (R$ 5.800/mês), com limite de 3 vendas.
     Seção "Para restaurantes, lanchonetes e bares" (08/11/2026): cardapio (Cardápio Pronto, R$ 1.500, avulsa, limite de 3 vendas)
     e cardapio_mensal (Cuidado do Cardápio, R$ 290/mês, assinatura mensal, limite de 3 vendas). Vazios até os links do Asaas existirem.
     portfolio (09/11/2026): Portfólio da empresa, R$ 1.200, avulsa, limite de 3 vendas (vagas de fundador).
     Links de cardapio, cardapio_mensal e portfolio criados pela Jéssica em 09/11/2026 ("Pergunte ao cliente": Pix, boleto ou cartão à vista).
     10/11/2026: traducao (Tradução do cardápio, R$ 300), catalogo (Catálogo Pronto, R$ 1.500) e catalogo_mensal
     (Cuidado do Catálogo, R$ 290/mês) entram na loja com os links criados pela Jéssica em 09/11/2026.
     10/11/2026: conversa (Vídeo de conversa · 1 Reel, R$ 450, avulsa, limite de 3 vendas: vagas de fundador).
       Link criado pela Jéssica em 10/11/2026 ("Pode Curtir · Vídeo de conversa · 1 Reel"; Pix ou boleto, à vista).
   PRECO_AJUSTE: preço atual do Ajuste de Perfil (500 do 1º ao 3º cliente, 750 do 4º ao 6º, 1200 a partir do 7º).
     Ao trocar o preço, troque também ASAAS_LINKS.ajuste pelo link do novo valor.
   VAGAS_500_RESTANTES: número de vagas que ainda restam a R$ 500 (0 a 3). null = não mostra contador.
   CHECKOUT_ENDPOINT: webhook do n8n que cria o checkout do Asaas com vários itens e devolve {"url": "..."}.
   FORM_ENDPOINT: webhook do n8n que recebe pedidos de proposta, registros de aceite e pedidos de desistência.
     Os dois endereços precisam estar em connect-src da Content-Security-Policy de cada página.
   PIXEL_ID: ID do Pixel da Meta (só números). Vazio = sem Pixel.
   GA4_ID: ID do Google Analytics 4 (G-XXXXXXXXXX), de uma propriedade só da Pode Curtir. Vazio = sem GA4.
     Com os dois vazios, não há aviso de cookies e nada é medido. Os dois só carregam depois do aceite.
   CNPJ: aparece no rodapé das páginas de compra. Confirmado em 24/10/2026 que o cadastro público mostra o endereço comercial. */
window.PODECURTIR = {
  ASAAS_LINKS: {
    ajuste: "https://www.asaas.com/000/c/8y9i7j6tn0nciy6p",
    arrumado_pix: "https://www.asaas.com/000/c/ri88rm53g1ho0r3s",
    arrumado_cartao: "https://www.asaas.com/000/c/o7ozykq6zs6kffd5",
    marca_pix: "https://www.asaas.com/000/c/qvtle9n6cvdb43u6",
    marca_cartao: "https://www.asaas.com/000/c/zi5jnhcqegikurxz",
    essencial: "https://www.asaas.com/000/c/w0wqpjqh5gh5op0m",
    padrao: "https://www.asaas.com/000/c/jcx1lg6s4dhb98m2",
    completa: "https://www.asaas.com/000/c/ldnzy8vagtnkbe96",
    plus_gravacao: "https://www.asaas.com/000/c/3hce0zj5lhqvgmoj",
    plus_livro: "https://www.asaas.com/000/c/llkzmhqmezcnople",
    plus_protecao: "https://www.asaas.com/000/c/gwimu5et7i82l2pr",
    plus_mentoria: "https://www.asaas.com/000/c/bleaqfjo9hhlmm9y",
    plus_recuperacao: "https://www.asaas.com/000/c/o5x0l3fdrjw9eynw",
    plus_site_pix: "https://www.asaas.com/000/c/bzy6eqhwdy5pq3pn",
    plus_site_cartao: "https://www.asaas.com/000/c/bl6t7cfoy5huw01o",
    diag_esp: "https://www.asaas.com/000/c/yyzfzbh9qvvdxo0b",
    video_presenca: "https://www.asaas.com/000/c/ctyub2hyq7sputnt",
    acabamento: "https://www.asaas.com/000/c/v17f48g42t7l0hst",
    esp_marca: "https://www.asaas.com/000/c/s5gmbgdpjsl81kz5",
    esp_produtora: "https://www.asaas.com/000/c/u9z9xmhpvrih1djw",
    esp_news: "https://www.asaas.com/000/c/bwl1vrxgogd4gjf0",
    esp_portavozes: "https://www.asaas.com/000/c/5p56v1dqcbo9c7ru",
    cardapio: "https://www.asaas.com/000/c/28hpw39ejqiye702",
    cardapio_mensal: "https://www.asaas.com/000/c/u88t39zwkmx4mk18",
    portfolio: "https://www.asaas.com/000/c/e4x0doisfcrifhv3",
    traducao: "https://www.asaas.com/000/c/3ekakcujuy6c6i5z",
    catalogo: "https://www.asaas.com/000/c/fe4h3vg1sbr7v9z7",
    catalogo_mensal: "https://www.asaas.com/000/c/4ewi5pnx43l09jko",
    /* 11/11/2026: em configuração até a Jéssica criar os links (campanha R$ 900, anuncio R$ 450, relatorio R$ 390/mês). */
    campanha: "",
    anuncio: "",
    relatorio: "",
    conversa: "https://www.asaas.com/000/c/wf7ewn1yu7e49okd"
  },
  PRECO_AJUSTE: 500,
  VAGAS_500_RESTANTES: null,
  CHECKOUT_ENDPOINT: "",
  FORM_ENDPOINT: "",
  PIXEL_ID: "1671150877849822",
  GA4_ID: "G-VHRDBYRE0P",
  CNPJ: "67.678.226/0001-17",
  WHATSAPP: "5519983310769",
  WHATSAPP_TEXTO: "(19) 98331-0769",
  EMAIL: "podecurtir@zethic.net"
};
