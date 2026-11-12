// Pode Curtir: destaques do topo no mesmo modelo dos banners da Zethic (12/11/2026, Jéssica).
// Troca a cada 7 s, com barrinha de tempo nos nomes e botão Pausar.
// Para sozinha com o mouse em cima, com o foco num controle, com a aba em segundo plano ou com o topo fora da tela.
// Com "reduzir movimento" ligado no aparelho, não troca sozinha; os nomes continuam funcionando.
// Sem JavaScript, fica o destaque 1 parado.
(function () {
  var TEMPO = 7000;
  var v = document.querySelector(".pc-vitrine");
  if (!v) return;
  var slides = Array.prototype.slice.call(v.querySelectorAll(".slide"));
  var pontos = Array.prototype.slice.call(v.querySelectorAll(".ponto"));
  var pausa = v.querySelector(".pausa");
  var ctrl = v.querySelector(".vitrine-ctrl");
  if (slides.length < 2) return;
  var calmo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var atual = 0, timer = null, pausadaPelaPessoa = calmo, mouse = false, foco = false, fora = false;

  function mostrar(i) {
    atual = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) {
      var ativo = k === atual;
      if (ativo) {
        var img = s.querySelector("img");
        if (img && img.loading === "lazy") img.loading = "eager";
      }
      s.classList.toggle("ativo", ativo);
      s.setAttribute("aria-hidden", ativo ? "false" : "true");
    });
    pontos.forEach(function (p, k) {
      p.classList.toggle("ativo", k === atual);
      p.setAttribute("aria-current", k === atual ? "true" : "false");
    });
    reiniciarBarra();
  }

  // Reinicia a barrinha do destaque atual, para acompanhar o tempo da troca.
  function reiniciarBarra() {
    var barra = pontos[atual] && pontos[atual].querySelector(".barra");
    if (!barra) return;
    barra.classList.remove("barra");
    void barra.offsetWidth;
    barra.classList.add("barra");
  }

  function rodando() { return !pausadaPelaPessoa && !mouse && !foco && !fora && !document.hidden; }

  function tocar() {
    clearInterval(timer);
    timer = null;
    var r = rodando();
    v.classList.toggle("pausado", !r);
    if (r) timer = setInterval(function () { mostrar(atual + 1); }, TEMPO);
  }

  function rotuloPausa() {
    pausa.textContent = pausadaPelaPessoa ? "Reproduzir" : "Pausar";
    pausa.setAttribute("aria-label", pausadaPelaPessoa ? "Retomar a troca automática dos destaques" : "Pausar a troca automática dos destaques");
  }

  pontos.forEach(function (p, k) { p.addEventListener("click", function () { mostrar(k); tocar(); }); });
  pausa.addEventListener("click", function () { pausadaPelaPessoa = !pausadaPelaPessoa; rotuloPausa(); if (!pausadaPelaPessoa) reiniciarBarra(); tocar(); });
  v.addEventListener("mouseenter", function () { mouse = true; tocar(); });
  v.addEventListener("mouseleave", function () { mouse = false; tocar(); });
  v.addEventListener("focusin", function () { foco = true; tocar(); });
  v.addEventListener("focusout", function (e) { if (!v.contains(e.relatedTarget)) { foco = false; tocar(); } });
  document.addEventListener("visibilitychange", tocar);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { fora = !e[0].isIntersecting; tocar(); }, { threshold: 0.25 }).observe(v);
  }

  // O topo cabe na primeira tela: mede o que vem acima dele (cabeçalho e faixa da campanha) e desconta da altura.
  function medir() {
    var alto = Math.max(0, Math.round(v.getBoundingClientRect().top + window.scrollY));
    document.documentElement.style.setProperty("--alto-topo", alto + "px");
  }
  medir();
  window.addEventListener("resize", medir);
  window.addEventListener("load", medir);

  ctrl.hidden = false;
  v.classList.add("js-vitrine");
  mostrar(0);
  rotuloPausa();
  // Só começa a trocar depois que a página terminou de carregar, para não disputar com a foto principal.
  if (document.readyState === "complete") tocar();
  else { v.classList.add("pausado"); window.addEventListener("load", tocar); }
})();
