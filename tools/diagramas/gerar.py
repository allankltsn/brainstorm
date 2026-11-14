#!/usr/bin/env python3
"""Gera todos os diagramas SVG em docs/assets/. Uso: python3 tools/diagramas/gerar.py"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import ferramentas  # noqa: E402
import fluxos  # noqa: E402

n = 0
for fn in fluxos.ALL + ferramentas.ALL:
    p = fn()
    n += 1
    print("ok", p.relative_to(p.parents[3]))
print(f"{n} diagramas gerados")
