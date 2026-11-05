/* Pode Curtir — partes comuns da página inicial e das páginas de compra: identificação no rodapé, aviso de cookies
   com medição pelo Google Analytics 4 e pelo Pixel da Meta (só com aceite e só se GA4_ID ou PIXEL_ID estiverem
   preenchidos), eventos do caminho de compra, botões de copiar, desistência e página de confirmação.
   04/11/2026: os 4 marcos do caminho de compra são a visita (page_view), o clique em comprar (data-evento nos botões),
   o início do pagamento (InitiateCheckout, na loja) e a página de obrigado (page_view). Abrir qualquer página com
   ?interno=1 desliga a medição neste navegador; ?interno=0 religa. */
(function () {
  var C = window.PODECURTIR || {};
  var CHAVE = "podecurtir-consentimento-v1";

  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function gravar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* Identificação (Decreto 7.962/2013, art. 2º): o CNPJ aparece só quando estiver preenchido na configuração. */
  function identificacao() {
    var el = document.querySelectorAll("[data-cnpj]");
    for (var i = 0; i < el.length; i++) {
      if (C.CNPJ) { el[i].querySelector("span").textContent = C.CNPJ; el[i].hidden = false; }
    }
  }

  /* Acesso interno: as suas próprias visitas não entram na medição. */
  var interno = false;
  try {
    var qi = new URLSearchParams(location.search).get("interno");
    if (qi === "1") gravar("podecurtir-acesso-interno", "1");
    if (qi === "0") localStorage.removeItem("podecurtir-acesso-interno");
    interno = ler("podecurtir-acesso-interno") === "1";
  } catch (e) {}

  /* Pixel da Meta: nada é carregado sem aceite. */
  var pixelAtivo = false;
  function pixelValido() { return !interno && /^\d{10,20}$/.test(String(C.PIXEL_ID || "")); }
  function carregarPixel() {
    if (pixelAtivo || !pixelValido()) return;
    pixelAtivo = true;
    var f = window.fbq = function () { f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
    if (!window._fbq) window._fbq = f;
    f.push = f; f.loaded = true; f.version = "2.0"; f.queue = [];
    var s = document.createElement("script");
    s.async = true; s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    window.fbq("init", C.PIXEL_ID);
    window.fbq("track", "PageView");
  }

  /* Google Analytics 4: nada é carregado sem aceite; sem sinais de anúncio do Google. */
  var gaAtivo = false;
  function gaValido() { return !interno && /^G-[A-Z0-9]{4,20}$/.test(String(C.GA4_ID || "")); }
  function carregarGA() {
    if (gaAtivo || !gaValido()) return;
    gaAtivo = true;
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + C.GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", C.GA4_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  }
  function medicaoValida() { return pixelValido() || gaValido(); }
  function carregarMedicao() { carregarPixel(); carregarGA(); }

  /* Eventos: nomes da Meta nos padrões dela; no GA4, os equivalentes recomendados ou o próprio nome. */
  var META_PADRAO = { InitiateCheckout: 1, Lead: 1, Purchase: 1, ViewContent: 1, Contact: 1 };
  var GA_NOMES = { InitiateCheckout: "begin_checkout", Lead: "generate_lead", Purchase: "purchase", ViewContent: "view_item", Contact: "contact" };
  window.podecurtirEvento = function (nome, params) {
    if (pixelAtivo && typeof window.fbq === "function") window.fbq(META_PADRAO[nome] ? "track" : "trackCustom", nome, params || {});
    if (gaAtivo && typeof window.gtag === "function") window.gtag("event", GA_NOMES[nome] || nome, params || {});
  };
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-evento]");
    if (a) window.podecurtirEvento(a.getAttribute("data-evento"), { pagina: location.pathname });
  });

  function linkPrivacidade() {
    var a = document.querySelector("[data-link-privacidade]");
    return a ? a.getAttribute("href") + "#cookies" : "#";
  }

  function banner() {
    if (document.getElementById("pc-cookies")) return;
    var b = document.createElement("div");
    b.id = "pc-cookies"; b.className = "pc-cookies";
    b.setAttribute("role", "region"); b.setAttribute("aria-label", "Cookies");
    var w = document.createElement("div"); w.className = "wrap";
    var p = document.createElement("p");
    var quem = [];
    if (gaValido()) quem.push("do Google");
    if (pixelValido()) quem.push("da Meta");
    p.appendChild(document.createTextNode("Usamos cookies " + quem.join(" e ") + " para medir as visitas e os anúncios, só se você aceitar. Sem o seu aceite, nada é enviado. "));
    var a = document.createElement("a"); a.href = linkPrivacidade(); a.textContent = "Saiba mais";
    p.appendChild(a);
    var bt = document.createElement("div"); bt.className = "botoes";
    function botao(txt, cls, valor) {
      var x = document.createElement("button"); x.type = "button"; x.textContent = txt; x.className = cls;
      x.addEventListener("click", function () { gravar(CHAVE, valor); if (valor === "aceito") carregarMedicao(); b.remove(); });
      return x;
    }
    bt.appendChild(botao("Rejeitar todos", "nao", "recusado"));
    bt.appendChild(botao("Aceitar", "sim", "aceito"));
    w.appendChild(p); w.appendChild(bt); b.appendChild(w);
    document.body.appendChild(b);
  }

  function consentimento() {
    if (!medicaoValida()) return;
    var v = ler(CHAVE);
    if (v === "aceito") carregarMedicao(); else if (v !== "recusado") banner();
    var pref = document.querySelectorAll("[data-preferencias-cookies]");
    for (var i = 0; i < pref.length; i++) {
      pref[i].hidden = false;
      pref[i].addEventListener("click", function () {
        var antes = ler(CHAVE); gravar(CHAVE, "");
        if (antes === "aceito") { location.reload(); return; }
        banner();
      });
    }
  }

  /* Copiar texto: usa a área de transferência e, se ela recusar, seleciona o texto para copiar à mão. */
  window.podecurtirCopiar = function (botao, alvo) {
    var texto = alvo.value !== undefined ? alvo.value : alvo.textContent;
    function selecionar() {
      if (alvo.select) { alvo.focus(); alvo.select(); }
      botao.textContent = "Selecionado: copie com Ctrl+C";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () { botao.textContent = "Copiado"; }, selecionar);
    } else selecionar();
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-copiar]");
    if (!b) return;
    var alvo = document.getElementById(b.getAttribute("data-copiar"));
    if (alvo) window.podecurtirCopiar(b, alvo);
  });

  function whatsLink(texto) {
    return "https://wa.me/" + (C.WHATSAPP || "") + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }
  window.podecurtirWhats = whatsLink;

  function agora() {
    var d = new Date();
    function z(n) { return (n < 10 ? "0" : "") + n; }
    return z(d.getDate()) + "/" + z(d.getMonth() + 1) + "/" + d.getFullYear() + " às " + z(d.getHours()) + "h" + z(d.getMinutes());
  }
  window.podecurtirAgora = agora;

  /* Desistência (Decreto 7.962/2013, art. 5º): pela mesma ferramenta da compra. */
  function desistencia() {
    var f = document.getElementById("form-desistencia");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = f.nome.value.trim(), email = f.email.value.trim(), pedido = f.pedido.value.trim(), motivo = f.motivo.value.trim();
      var erro = document.getElementById("desistencia-erro");
      var falta = [];
      if (!nome) falta.push("nome");
      if (!/^\S+@\S+\.\S+$/.test(email)) falta.push("e-mail usado na compra");
      if (!pedido) falta.push("número do pedido ou data da compra");
      if (falta.length) { erro.textContent = "Falta preencher: " + falta.join(", ") + "."; erro.hidden = false; return; }
      erro.hidden = true;
      var quando = agora();
      var texto = "Quero desistir da minha compra na Pode Curtir.\nNome: " + nome + "\nE-mail da compra: " + email +
        "\nPedido ou data da compra: " + pedido + (motivo ? "\nMotivo (opcional): " + motivo : "") + "\nEnviado em " + quando + ".";
      var ok = document.getElementById("desistencia-ok"), manual = document.getElementById("desistencia-manual");
      function mostrarManual() {
        document.getElementById("desistencia-texto").value = texto;
        document.getElementById("desistencia-whats").href = whatsLink(texto);
        manual.hidden = false; f.hidden = true;
      }
      if (!C.FORM_ENDPOINT) { mostrarManual(); return; }
      fetch(C.FORM_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "desistencia", nome: nome, email: email, pedido: pedido, motivo: motivo, enviado_em: new Date().toISOString(), pagina: location.pathname })
      }).then(function (r) {
        if (!r.ok) throw new Error("status " + r.status);
        document.getElementById("desistencia-quando").textContent = quando;
        ok.hidden = false; f.hidden = true;
      }).catch(mostrarManual);
    });
  }

  /* Confirmação: o texto muda quando o pedido foi só de proposta. */
  function obrigado() {
    var el = document.querySelector("[data-obrigado]");
    if (!el) return;
    var tipo = new URLSearchParams(location.search).get("tipo");
    var blocos = document.querySelectorAll("[data-tipo]");
    for (var i = 0; i < blocos.length; i++) blocos[i].hidden = blocos[i].getAttribute("data-tipo") !== (tipo === "proposta" ? "proposta" : "compra");
  }

  function iniciar() { identificacao(); consentimento(); desistencia(); obrigado(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
