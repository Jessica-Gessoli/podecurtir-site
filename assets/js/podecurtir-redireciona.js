/* Pode Curtir — o endereço antigo da loja leva para a loja na página inicial, com o mesmo trecho (07/11/2026).
   O destino vem do link canônico da página, para funcionar também no site próprio da marca.
   08/11/2026: leva junto os parâmetros (?interno=1, utm_*, negocio) para não perder a medição nem a campanha. */
(function () {
  var c = document.querySelector('link[rel="canonical"]');
  if (!c) return;
  location.replace(c.href.split("#")[0].split("?")[0] + location.search + (location.hash && location.hash.length > 1 ? location.hash : "#loja"));
})();
