/* Cardápio Pronto (Pode Curtir; página e app pela Zethic, em parceria) — 08/11/2026.
   Pedido pelo WhatsApp, sem taxa por pedido: a pessoa escolhe os itens e o site monta a mensagem.
   Nada é enviado a servidor nenhum; o pedido só vale depois que o restaurante confirma pelo WhatsApp. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var corpo = document.body;
  var numero = corpo.getAttribute("data-whatsapp") || "";
  var inicio = corpo.getAttribute("data-inicio") || "Olá! Quero fazer um pedido:";
  var pedido = {};
  var brl = function (v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
  function item(id) { return document.querySelector('.item[data-id="' + id + '"]'); }
  function totais() {
    var qtd = 0, total = 0;
    Object.keys(pedido).forEach(function (id) {
      var el = item(id); qtd += pedido[id]; total += pedido[id] * Number(el.getAttribute("data-preco"));
    });
    return { qtd: qtd, total: total };
  }
  function mensagem() {
    var t = totais(), l = [inicio];
    Object.keys(pedido).forEach(function (id) {
      var el = item(id);
      l.push(pedido[id] + "x " + el.getAttribute("data-nome") + " (" + brl(pedido[id] * Number(el.getAttribute("data-preco"))) + ")");
    });
    l.push("Total: " + brl(t.total));
    var tipo = document.querySelector('input[name="tipo"]:checked');
    if (tipo) l.push("Como prefiro: " + tipo.value);
    var nome = $("nome").value.trim(); if (nome) l.push("Nome: " + nome);
    var obs = $("obs").value.trim(); if (obs) l.push("Observação: " + obs);
    return l.join("\n");
  }
  function atualizar() {
    document.querySelectorAll(".qtd").forEach(function (q) {
      var n = pedido[q.getAttribute("data-id")] || 0;
      q.querySelector(".n").textContent = n;
      q.querySelector(".n").hidden = !n; q.querySelector(".menos").hidden = !n;
    });
    var t = totais();
    $("barra").hidden = !t.qtd;
    $("barra-qtd").textContent = t.qtd; $("barra-total").textContent = brl(t.total); $("total").textContent = brl(t.total);
    $("linhas").innerHTML = "";
    Object.keys(pedido).forEach(function (id) {
      var el = item(id), li = document.createElement("li"), a = document.createElement("span"), b = document.createElement("span");
      a.textContent = pedido[id] + "x " + el.getAttribute("data-nome");
      b.textContent = brl(pedido[id] * Number(el.getAttribute("data-preco")));
      li.appendChild(a); li.appendChild(b); $("linhas").appendChild(li);
    });
    $("enviar").href = "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensagem());
    if (!t.qtd) $("painel").hidden = true;
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    var q = b.closest(".qtd");
    if (q) {
      var id = q.getAttribute("data-id");
      if (b.classList.contains("mais")) pedido[id] = (pedido[id] || 0) + 1;
      if (b.classList.contains("menos")) { pedido[id] = (pedido[id] || 0) - 1; if (pedido[id] <= 0) delete pedido[id]; }
      atualizar(); return;
    }
    if (b.id === "abrir") { $("painel").hidden = false; $("nome").focus(); }
    if (b.id === "fechar") $("painel").hidden = true;
  });
  $("painel").addEventListener("click", function (ev) { if (ev.target === $("painel")) $("painel").hidden = true; });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") $("painel").hidden = true; });
  ["nome", "obs"].forEach(function (id) { $(id).addEventListener("input", atualizar); });
  document.querySelectorAll('input[name="tipo"]').forEach(function (r) { r.addEventListener("change", atualizar); });
  atualizar();
})();
