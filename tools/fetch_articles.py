#!/usr/bin/env python3
"""Holt zu jeder Meldung in news.json den Textanfang des Originalartikels und schreibt articles.json.

Warum: Die Feeds liefern nur Titel + Teaser (~190 Zeichen). Damit die App (und die Routine, die Einordnungen
schreibt) wirklich wissen, worum es geht, lädt die GitHub-Action – die normales Internet hat – die ersten
Absätze des Artikels. Gespeichert wird nur ein kurzer Auszug (~1500 Zeichen) pro Meldung; der Link zum
Original bleibt. Seiten mit Bezahlschranke oder Abrufsperre werden übersprungen (kein Abbruch).

Nur Standardbibliothek. Aufruf: python tools/fetch_articles.py [--max N]
"""
import html, json, re, sys, time, urllib.request, urllib.parse
from html.parser import HTMLParser
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (compatible; Knowgram/1.0; persoenliche Lern-App)"
LIMIT = 1500          # Zeichen, die pro Artikel gespeichert werden
MAX_NEW = 120         # höchstens so viele neue Artikel pro Lauf (höflich + schnell)
RETRY_AFTER = 3       # so oft wird ein fehlgeschlagener Abruf höchstens versucht
SKIP_TAGS = {"script", "style", "nav", "footer", "aside", "form", "figure", "header", "noscript", "button", "svg", "iframe"}
JUNK = re.compile(
    r"cookie|newsletter|datenschutz|abonnier|abo\b|©|copyright|anzeige|werbung|lesen sie (auch|mehr)|mehr zum thema|"
    r"teilen sie|jetzt (lesen|anmelden|testen)|javascript|zum Artikel|bildrechte|bildquelle|foto:|mehr lesen|"
    r"skript wurde nicht|zustimmung|standortdaten|iframe|verarbeitungszweck|consent|sign up|subscribe|advertisement|all rights reserved|follow us|read more|click here", re.I)


class Extract(HTMLParser):
    """Sammelt <p>-Texte; bevorzugt solche innerhalb von <article>/<main>."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0; self.art = 0; self.main = 0; self.p = None
        self.in_art, self.in_main, self.anywhere, self.chunks = [], [], [], []
        self.ld = []; self._ld = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script" and "ld+json" in (a.get("type") or ""):
            self._ld = True; self.ld.append("")
        if tag in SKIP_TAGS and tag != "header":
            self.skip += 1
        if tag == "article": self.art += 1
        if tag == "main": self.main += 1
        if tag == "p" and not self.skip: self.p = []

    def handle_endtag(self, tag):
        if tag == "script": self._ld = False
        if tag in SKIP_TAGS and tag != "header" and self.skip: self.skip -= 1
        if tag == "article" and self.art: self.art -= 1
        if tag == "main" and self.main: self.main -= 1
        if tag == "p" and self.p is not None:
            t = re.sub(r"\s+", " ", "".join(self.p)).strip(); self.p = None
            if t:
                self.anywhere.append(t)
                if self.art: self.in_art.append(t)
                if self.main: self.in_main.append(t)

    def handle_data(self, data):
        if self._ld and self.ld: self.ld[-1] += data
        elif self.p is not None and not self.skip: self.p.append(data)
        elif not self.skip and self.p is None and len(data.strip()) >= 80:            # Ersatz: lange Textblöcke außerhalb von <p> (manche Seiten nutzen <div>/<span>)
            self.chunks.append(re.sub(r"\s+", " ", data).strip())


def ld_body(blocks):
    def walk(o):
        if isinstance(o, dict):
            if isinstance(o.get("articleBody"), str): yield o["articleBody"]
            for v in o.values(): yield from walk(v)
        elif isinstance(o, list):
            for v in o: yield from walk(v)
    for b in blocks:
        try:
            for t in walk(json.loads(b)):
                if len(t) > 300: return t
        except Exception:
            continue
    return ""


def good(paras, teaser):
    out, tl = [], re.sub(r"\W+", "", teaser.lower())[:60]
    for p in paras:
        p = html.unescape(p).replace("­", "").strip()
        if len(p) < 60 or JUNK.search(p): continue
        if tl and re.sub(r"\W+", "", p.lower()).startswith(tl[:40]): continue   # der Teaser steht ohnehin schon oben
        if p in out: continue
        out.append(p)
    return out


def excerpt(paras):
    txt, n = [], 0
    for p in paras:
        txt.append(p); n += len(p)
        if n >= LIMIT: break
    s = "\n".join(txt)
    if len(s) > LIMIT:
        cut = s[:LIMIT]
        m = max(cut.rfind(". "), cut.rfind("? "), cut.rfind("! "), cut.rfind(".\n"))
        s = cut[:m + 1] if m > LIMIT * 0.5 else cut.rsplit(" ", 1)[0] + " …"
    return s


def extract(raw, teaser=""):
    x = Extract()
    try: x.feed(raw)
    except Exception: pass
    body = ld_body(x.ld)
    paras = []
    if body:
        paras = [p for p in re.split(r"\n+|(?<=[.!?])\s{2,}", body) if p.strip()]
    for cand in (paras, x.in_art, x.in_main, x.anywhere, x.chunks, x.anywhere + x.chunks):
        g = good(cand, teaser)
        if sum(map(len, g)) >= 250: return excerpt(g)
    return ""


def fetch(url):
    url = urllib.parse.quote(url, safe=":/?&=%#@+,;~!$'()*[]")      # Umlaute/Leerzeichen in Links (z. B. DW) sauber codieren
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "de,en;q=0.7"})
    with urllib.request.urlopen(req, timeout=20) as r:
        raw = r.read(2_000_000)
        cs = r.headers.get_content_charset() or "utf-8"
    return raw.decode(cs, errors="replace")


def main():
    mx = MAX_NEW
    if "--max" in sys.argv: mx = int(sys.argv[sys.argv.index("--max") + 1])
    news = json.loads((ROOT / "news.json").read_text(encoding="utf-8"))
    items = news["items"]
    path = ROOT / "articles.json"
    arts = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    ids = {i["id"] for i in items}
    arts = {k: v for k, v in arts.items() if k in ids}          # Abgelaufenes fliegt raus
    rank = {r["id"]: r["s"] for r in news.get("ranked", [])}
    todo = [i for i in items if i["id"] not in arts or (arts[i["id"]].get("fail", 0) and arts[i["id"]]["fail"] < RETRY_AFTER and not arts[i["id"]].get("t"))]
    todo.sort(key=lambda i: -rank.get(i["id"], 0))               # wichtige zuerst
    done = fails = 0
    for it in todo[:mx]:
        try:
            raw = fetch(it["link"]); t = extract(raw, it.get("text", ""))
            if not t:
                x = Extract(); x.feed(raw)
                print(f"  kein Text: {it['source']} · {len(raw)} Zeichen, <p>: {len(x.anywhere)}, in article: {len(x.in_art)}, Blöcke: {len(x.chunks)}, ld-json: {len(ld_body(x.ld))} · {it['link'][:90]}", file=sys.stderr)
        except Exception as e:
            print(f"  Abruf fehlgeschlagen: {it['source']} – {type(e).__name__}", file=sys.stderr); t = ""
        old = arts.get(it["id"], {})
        if t:
            arts[it["id"]] = {"t": t, "src": it["source"], "at": datetime.now(timezone.utc).isoformat(timespec="minutes")}; done += 1
        else:
            arts[it["id"]] = {"fail": old.get("fail", 0) + 1}; fails += 1
        time.sleep(0.6)
    path.write_text(json.dumps(arts, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    have = sum(1 for v in arts.values() if v.get("t"))
    print(f"Artikeltexte: {done} neu, {fails} ohne Text, gesamt {have}/{len(items)}")


if __name__ == "__main__":
    main()
