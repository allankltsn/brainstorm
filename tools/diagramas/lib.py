"""Biblioteca mínima para gerar diagramas SVG em grade (sem dependências).

Uso: crie um `D`, adicione nós em células (coluna, linha), ligue com `edge` e chame `save`.
O texto é quebrado automaticamente; se não couber no nó, o script falha para o layout ser ajustado.
"""
from __future__ import annotations

import html
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "assets"

# tipo -> (borda, preenchimento)
KINDS = {
    "guilda": ("#2dd4bf", "#0b2f31"),
    "ext": ("#60a5fa", "#0e2340"),
    "gap": ("#f87171", "#3b1414"),
    "human": ("#fbbf24", "#3a2b0a"),
    "data": ("#94a3b8", "#1b2538"),
    "sec": ("#a78bfa", "#251b47"),
    "ok": ("#4ade80", "#0f2f1d"),
}
LEGEND = {
    "guilda": "guilda (núcleo)",
    "ext": "ferramenta externa",
    "gap": "lacuna ou risco",
    "human": "decisão humana",
    "data": "dado ou artefato",
    "sec": "segurança e gates",
    "ok": "resultado",
}
BG = "#0b1220"
CARD = "#0f1a2e"
TEXT = "#e2e8f0"
MUTED = "#94a3b8"
LINE = "#64748b"
FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"


def esc(s: str) -> str:
    return html.escape(s, quote=False)


def tw(s: str, size: float, bold: bool = False) -> float:
    return len(s) * size * (0.62 if bold else 0.57)


def wrap(s: str, size: float, width: float, bold: bool = False) -> list[str]:
    out: list[str] = []
    for part in s.split("\n"):
        cur = ""
        for w in part.split():
            t = (cur + " " + w).strip()
            if tw(t, size, bold) <= width or not cur:
                cur = t
            else:
                out.append(cur)
                cur = w
        out.append(cur)
    return out


class D:
    def __init__(self, folder, name, title, subtitle, cols, rows, cw=200, ch=84, gx=56, gy=46,
                 note=None, mx=36, width=None, height=None):
        self.folder, self.name, self.title, self.subtitle = folder, name, title, subtitle
        self.cols, self.rows, self.cw, self.ch, self.gx, self.gy = cols, rows, cw, ch, gx, gy
        self.mx, self.top, self.note = mx, 116, note
        self.nodes: dict[str, dict] = {}
        self.edges: list[dict] = []
        self.groups: list[dict] = []
        self.raw: list[str] = []
        self.used: set[str] = set()
        self.width = width or (mx * 2 + cols * cw + (cols - 1) * gx)
        grid_h = rows * ch + (rows - 1) * gy
        self.height = height or (self.top + grid_h + 64)

    # ---------- geometria ----------
    def box(self, col, row, cs=1, rs=1):
        x = self.mx + col * (self.cw + self.gx)
        y = self.top + row * (self.ch + self.gy)
        return (x, y, cs * self.cw + (cs - 1) * self.gx, rs * self.ch + (rs - 1) * self.gy)

    # ---------- elementos ----------
    def node(self, id, col, row, label, sub="", kind="data", cs=1, rs=1, badge=None):
        self.nodes[id] = dict(box=self.box(col, row, cs, rs), label=label, sub=sub, kind=kind, badge=badge)
        self.used.add(kind)

    def abs_node(self, id, x, y, w, h, label, sub="", kind="data", badge=None):
        self.nodes[id] = dict(box=(x, y, w, h), label=label, sub=sub, kind=kind, badge=badge)
        self.used.add(kind)

    def group(self, col, row, cs, rs, title, kind="data"):
        x, y, w, h = self.box(col, row, cs, rs)
        pad = min(22, self.gx / 2 - 6)
        self.groups.append(dict(box=(x - pad, y - 30, w + 2 * pad, h + 30 + pad), title=title, kind=kind))
        self.used.add(kind)

    def edge(self, a, b, label="", dash=False, color=None, bidir=False, route=None):
        self.edges.append(dict(a=a, b=b, label=label, dash=dash, color=color or LINE, bidir=bidir, route=route))

    def text(self, x, y, t, size=12, fill=MUTED, anchor="start", bold=False):
        w = ' font-weight="700"' if bold else ""
        self.raw.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}"{w}>{esc(t)}</text>')

    # ---------- roteamento ----------
    @staticmethod
    def _anchor(b, side):
        x, y, w, h = b
        return {"r": (x + w, y + h / 2), "l": (x, y + h / 2), "t": (x + w / 2, y), "b": (x + w / 2, y + h)}[side]

    def _route(self, ea):
        a, b = self.nodes[ea["a"]]["box"], self.nodes[ea["b"]]["box"]
        ax, ay, aw, ah = a
        bx, by, bw, bh = b
        acx, acy, bcx, bcy = ax + aw / 2, ay + ah / 2, bx + bw / 2, by + bh / 2
        force = ea["route"]
        if force is None:
            if min(ay + ah, by + bh) - max(ay, by) > min(ah, bh) * 0.4:
                force = "row"
            elif min(ax + aw, bx + bw) - max(ax, bx) > min(aw, bw) * 0.4:
                force = "col"
            else:
                force = "h" if abs(bcx - acx) >= abs(bcy - acy) else "v"
        if force == "row":
            y = (max(ay, by) + min(ay + ah, by + bh)) / 2
            if bcx > acx:
                return [(ax + aw, y), (bx, y)]
            return [(ax, y), (bx + bw, y)]
        if force == "col":
            x = (max(ax, bx) + min(ax + aw, bx + bw)) / 2
            if bcy > acy:
                return [(x, ay + ah), (x, by)]
            return [(x, ay), (x, by + bh)]
        if force == "h":
            sx = ax + aw if bcx > acx else ax
            ey = by if bcy > acy else by + bh
            return [(sx, acy), (bcx, acy), (bcx, ey)]
        sy = ay + ah if bcy > acy else ay
        ex = bx if bcx > acx else bx + bw
        return [(acx, sy), (acx, bcy), (ex, bcy)]

    # ---------- desenho ----------
    def _node_svg(self, nid, n):
        x, y, w, h = n["box"]
        stroke, fill = KINDS[n["kind"]]
        lines = wrap(n["label"], 13.5, w - 22, True)
        sub = wrap(n["sub"], 11, w - 22) if n["sub"] else []
        th = len(lines) * 17 + (len(sub) * 14 + 5 if sub else 0)
        if th > h - 12:
            raise ValueError(f"{self.name}: texto do nó '{nid}' não cabe ({th}px > {h - 12}px): {n['label']!r}")
        y0 = y + (h - th) / 2 + 13
        out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="11" fill="{fill}" stroke="{stroke}" stroke-width="1.6"/>']
        cx = x + w / 2
        for i, ln in enumerate(lines):
            out.append(f'<text x="{cx}" y="{y0 + i * 17:.1f}" font-size="13.5" font-weight="700" fill="{TEXT}" text-anchor="middle">{esc(ln)}</text>')
        base = y0 + len(lines) * 17 + 1
        for i, ln in enumerate(sub):
            out.append(f'<text x="{cx}" y="{base + i * 14:.1f}" font-size="11" fill="{MUTED}" text-anchor="middle">{esc(ln)}</text>')
        if n["badge"]:
            bw = tw(n["badge"], 9.5, True) + 14
            out.append(f'<rect x="{x + w - bw - 8}" y="{y - 8}" width="{bw}" height="16" rx="8" fill="{BG}" stroke="{stroke}" stroke-width="1.2"/>')
            out.append(f'<text x="{x + w - bw / 2 - 8}" y="{y + 3.5}" font-size="9.5" font-weight="700" fill="{stroke}" text-anchor="middle">{esc(n["badge"])}</text>')
        return "\n".join(out)

    def render(self):
        defs, body, labels = [], [], []
        colors = {e["color"] for e in self.edges}
        for c in colors:
            cid = c.lstrip("#")
            defs.append(
                f'<marker id="ar{cid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
                f'<path d="M0,0 L10,5 L0,10 z" fill="{c}"/></marker>')
        for g in self.groups:
            x, y, w, h = g["box"]
            stroke, _ = KINDS[g["kind"]]
            body.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{CARD}" stroke="{stroke}" stroke-width="1.2" stroke-dasharray="6 5" opacity="0.95"/>')
            body.append(f'<text x="{x + 14}" y="{y + 20}" font-size="12" font-weight="700" fill="{stroke}">{esc(g["title"])}</text>')
        for e in self.edges:
            pts = self._route(e)
            d = "M" + " L".join(f"{px:.1f},{py:.1f}" for px, py in pts)
            cid = e["color"].lstrip("#")
            dash = ' stroke-dasharray="6 5"' if e["dash"] else ""
            start = f' marker-start="url(#ar{cid})"' if e["bidir"] else ""
            body.append(f'<path d="{d}" fill="none" stroke="{e["color"]}" stroke-width="1.8"{dash} marker-end="url(#ar{cid})"{start}/>')
            if e["label"]:
                segs = list(zip(pts, pts[1:]))
                (p, q) = max(segs, key=lambda s: abs(s[0][0] - s[1][0]) + abs(s[0][1] - s[1][1]))
                mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2
                lw = tw(e["label"], 10.5) + 12
                labels.append(f'<rect x="{mx - lw / 2:.1f}" y="{my - 9:.1f}" width="{lw:.1f}" height="18" rx="9" fill="{BG}" stroke="{LINE}" stroke-width="0.8"/>')
                labels.append(f'<text x="{mx:.1f}" y="{my + 4:.1f}" font-size="10.5" fill="{TEXT}" text-anchor="middle">{esc(e["label"])}</text>')
        nodes = [self._node_svg(i, n) for i, n in self.nodes.items()]
        # legenda e nota
        foot_y = self.height - 30
        leg = []
        lx = self.mx
        order = [k for k in KINDS if k in self.used]
        for k in order:
            stroke, fill = KINDS[k]
            leg.append(f'<rect x="{lx}" y="{foot_y - 9}" width="12" height="12" rx="3" fill="{fill}" stroke="{stroke}" stroke-width="1.4"/>')
            leg.append(f'<text x="{lx + 18}" y="{foot_y + 1}" font-size="10.5" fill="{MUTED}">{esc(LEGEND[k])}</text>')
            lx += 18 + tw(LEGEND[k], 10.5) + 22
        note = []
        if self.note:
            for i, ln in enumerate(wrap(self.note, 11, self.width - 2 * self.mx)):
                note.append(f'<text x="{self.mx}" y="{foot_y + 24 + i * 14}" font-size="11" fill="{MUTED}">{esc(ln)}</text>')
        extra_h = 0
        if self.note:
            extra_h = 14 + len(wrap(self.note, 11, self.width - 2 * self.mx)) * 14
        H = self.height + extra_h
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.width}" height="{H}" viewBox="0 0 {self.width} {H}" '
            f'font-family="{FONT}" role="img" aria-label="{esc(self.title)}">\n'
            f'<title>{esc(self.title)}</title>\n<defs>{"".join(defs)}</defs>\n'
            f'<rect width="{self.width}" height="{H}" rx="16" fill="{BG}"/>\n'
            f'<rect x="{self.mx}" y="28" width="34" height="4" rx="2" fill="#2dd4bf"/>\n'
            f'<text x="{self.mx}" y="58" font-size="20" font-weight="800" fill="{TEXT}">{esc(self.title)}</text>\n'
            f'<text x="{self.mx}" y="80" font-size="12.5" fill="{MUTED}">{esc(self.subtitle)}</text>\n'
            + "\n".join(body) + "\n" + "\n".join(self.raw) + "\n" + "\n".join(nodes) + "\n" + "\n".join(labels) + "\n"
            + "\n".join(leg) + "\n" + "\n".join(note) + "\n</svg>\n"
        )

    def save(self):
        d = OUT / self.folder
        d.mkdir(parents=True, exist_ok=True)
        p = d / f"{self.name}.svg"
        p.write_text(self.render(), encoding="utf-8")
        return p
