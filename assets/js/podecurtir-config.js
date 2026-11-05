/* Pode Curtir — configuração da loja e das páginas de compra (/podecurtir/loja, termos, privacidade, desistência).
   Um só lugar para preencher antes de publicar. Campos vazios deixam a função desligada, sem erro.

   ASAAS_LINKS: link de pagamento do Asaas de cada item (https://www.asaas.com/...). Vazio = "pagamento em configuração".
     Decisão de 04/11/2026: no site o pagamento é integral. Perfil Arrumado e Marca Completa têm dois links:
     _pix (Pix ou boleto, à vista) e _cartao (só cartão, em até 3x e 6x sem juros). O parcelamento fica só no cartão.
     O link do Ajuste de Perfil a R$ 500 aceita 3 vendas (as vagas de fundador); depois ele fecha sozinho.
     Plus do fechamento do pedido (04/11/2026, Ficha v1.17): plus_gravacao (R$ 500), plus_livro (R$ 1.500),
     plus_protecao e plus_mentoria (R$ 400 cada, Jéssica Gessoli) e o Site Essencial da Zethic (R$ 3.000), com dois links:
     plus_site_pix e plus_site_cartao (até 3x). Os links do Site Essencial aceitam 3 vendas (vagas de fundador).
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
    plus_gravacao: "",
    plus_livro: "",
    plus_protecao: "",
    plus_mentoria: "",
    plus_site_pix: "",
    plus_site_cartao: ""
  },
  PRECO_AJUSTE: 500,
  VAGAS_500_RESTANTES: null,
  CHECKOUT_ENDPOINT: "",
  FORM_ENDPOINT: "",
  PIXEL_ID: "",
  GA4_ID: "",
  CNPJ: "67.678.226/0001-17",
  WHATSAPP: "5519983310769",
  WHATSAPP_TEXTO: "(19) 98331-0769",
  EMAIL: "podecurtir@zethic.net"
};
