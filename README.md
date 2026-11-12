# Pode Curtir

Site da Pode Curtir, publicado em https://podecurtir.zethic.net pelo GitHub Pages.

Desde 12/11/2026 este repositório é a fonte da Pode Curtir: tudo o que é da Pode Curtir fica só aqui. As páginas
são editadas direto nos arquivos deste repositório. Antes elas eram geradas no `Jessica-Gessoli/zethic-site` e
copiadas para cá; isso acabou.

## Onde fica cada coisa

| O quê | Onde |
| --- | --- |
| Página inicial (loja, casos, dúvidas) | `index.html` |
| Termos, privacidade, desistência, parceiros, obrigado | `termos/`, `privacidade/`, `desistencia/`, `parceiros/`, `loja/obrigado/` |
| Endereço antigo da loja (leva para `/#loja`) | `loja/index.html` |
| Cardápios de exemplo e os dados de cada um | `cardapio/exemplo/`, `cardapio/exemplo-delivery/` (dados em `dados/`) |
| Estilo e scripts | `assets/css/`, `assets/js/` |
| Fotos e vídeo | `assets/img/`, `assets/video/` |
| Testes | `_tests/` |

## Antes de abrir um PR

1. Mudou algum arquivo de `assets/css` ou `assets/js`? Rode `python3 _ferramentas/versao.py` para atualizar o
   `?v=` nas páginas (o navegador baixa o arquivo novo).
2. Rode os testes: `node --test _tests/*.mjs`

## O que continua no zethic-site

- `zethic.net/podecurtir`, que só leva para este site (endereço antigo).
- A página `zethic.net/fale`, que ainda aceita `?utm_source=podecurtir` para links antigos. Os botões deste site
  vão direto para o WhatsApp da Pode Curtir.
- A planilha de pedidos (Apps Script), que atende as três marcas, e o gerador de cardápio, que é tecnologia da Zethic.
