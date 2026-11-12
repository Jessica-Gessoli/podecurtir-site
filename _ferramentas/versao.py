#!/usr/bin/env python3
"""Atualiza a versão (?v=) do CSS e do JavaScript nas páginas da Pode Curtir.

Desde 12/11/2026 este repositório é a fonte da Pode Curtir (antes as páginas vinham do zethic-site, gerador
_ferramentas/gerar_marcas.py). O ?v=<10 primeiros caracteres do sha256 do arquivo> faz o navegador baixar o
arquivo novo assim que ele muda. Rode depois de mexer em qualquer arquivo de assets/css ou assets/js:

    python3 _ferramentas/versao.py          # atualiza as páginas
    python3 _ferramentas/versao.py --check  # só confere (sai com erro se alguma página estiver desatualizada)
"""
import hashlib, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
REF = re.compile(r'((?:href|src)=")(/assets/(?:css|js)/[^"?]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")')


def versao(caminho):
    return hashlib.sha256((RAIZ / caminho.lstrip("/")).read_bytes()).hexdigest()[:10]


def paginas():
    for p in sorted(RAIZ.rglob("*.html")):
        if any(parte.startswith((".", "_")) for parte in p.relative_to(RAIZ).parts):
            continue
        yield p


def main(conferir):
    desatualizadas = []
    for p in paginas():
        antes = p.read_text(encoding="utf-8")
        depois = REF.sub(lambda m: f"{m.group(1)}{m.group(2)}?v={versao(m.group(2))}{m.group(3)}", antes)
        if depois != antes:
            desatualizadas.append(str(p.relative_to(RAIZ)))
            if not conferir:
                p.write_text(depois, encoding="utf-8")
    if conferir and desatualizadas:
        print("Versão de CSS/JS desatualizada em:", ", ".join(desatualizadas))
        print("Rode: python3 _ferramentas/versao.py")
        return 1
    print("versões em dia" if not desatualizadas or conferir else "atualizadas: " + ", ".join(desatualizadas))
    return 0


if __name__ == "__main__":
    sys.exit(main("--check" in sys.argv))
