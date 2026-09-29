#!/usr/bin/env python3
"""Sucht zu jeder Wissenskarte ein frei lizenziertes Titelbild auf Wikimedia Commons.

Ablauf je Karte: Suchbegriff `q` -> Wikipedia-Artikel -> Artikelbild -> Lizenz bei Commons prüfen.
Nur Bilder mit CC0 / CC BY / CC BY-SA / gemeinfrei (keine NC/ND, keine „Fair use“-Bilder aus der
Wikipedia selbst). Gespeichert werden NUR die Adresse und die Urheberangabe (images.json) –
keine Bildkopien. Bereits gefundene Karten werden übersprungen (`--refresh` für alles neu).
Nur Standardbibliothek; Fehler einzelner Karten brechen den Lauf nicht ab.
"""
import html, json, os, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "Knowgram/1.0 (persoenliche Lern-App; kontakt: github.com/HendrikE202/Knowgram)"
WIKI = os.environ.get("WIKI_BASE", "https://de.wikipedia.org")
COMMONS = os.environ.get("COMMONS_BASE", "https://commons.wikimedia.org")
OK_LICENSE = re.compile(r"^(CC0|CC[ -]BY(?![ -]?NC)(?![ -]?ND)|Public domain|PD|gemeinfrei)", re.I)
CARD = re.compile(r'\{\s*id:\s*"([^"]+)",\s*topic:\s*"([^"]+)",\s*title:\s*"((?:[^"\\]|\\.)*)",\s*q:\s*"((?:[^"\\]|\\.)*)"')


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode("utf-8"))


def unesc(s):
    try:
        return json.loads('"' + s + '"')
    except Exception:
        return s


def strip(s, n=90):
    s = html.unescape(re.sub(r"<[^>]+>", "", s or ""))
    return re.sub(r"\s+", " ", s).strip()[:n]


def find(card_id, q):
    hits = get(f"{WIKI}/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&srlimit=1&format=json").get("query", {}).get("search", [])
    if not hits:
        return None
    title = hits[0]["title"]
    sm = get(f"{WIKI}/api/rest_v1/page/summary/{urllib.parse.quote(title.replace(' ', '_'), safe='')}")
    if sm.get("type") == "disambiguation":
        return None
    th, orig = (sm.get("thumbnail") or {}).get("source", ""), sm.get("originalimage") or {}
    m = re.search(r"/wikipedia/commons/(?:thumb/)?[0-9a-f]/[0-9a-f]{2}/([^/]+)", th or orig.get("source", ""))
    if not m:                       # kein Commons-Bild (z. B. lokales „Fair use“-Bild) -> nicht verwenden
        return None
    fname = urllib.parse.unquote(m.group(1))
    info = get(f"{COMMONS}/w/api.php?action=query&titles={urllib.parse.quote('File:' + fname)}&prop=imageinfo&iiprop=extmetadata&format=json&formatversion=2")
    ii = ((info.get("query", {}).get("pages") or [{}])[0].get("imageinfo") or [{}])[0].get("extmetadata") or {}
    lic = strip((ii.get("LicenseShortName") or {}).get("value"), 40)
    if not OK_LICENSE.match(lic) or (ii.get("NonFree") or {}).get("value") in ("true", "1"):
        return None
    width = orig.get("width") or 0
    if width >= 960 and "/thumb/" in th:
        url = re.sub(r"/\d+px-", "/960px-", th, count=1)
    else:
        url = orig.get("source") or th
    if not url.startswith("https://"):
        return None
    return {"u": url, "by": strip((ii.get("Artist") or {}).get("value")) or "Unbekannt", "lic": lic,
            "page": f"{COMMONS}/wiki/File:{urllib.parse.quote(fname.replace(' ', '_'))}", "art": title}


def main():
    refresh = "--refresh" in sys.argv
    out_path = ROOT / "images.json"
    try:
        images = json.loads(out_path.read_text(encoding="utf-8"))
    except Exception:
        images = {}
    cards = [(i, t, unesc(ti), unesc(q)) for i, t, ti, q in CARD.findall((ROOT / "cards.js").read_text(encoding="utf-8"))]
    todo = [c for c in cards if refresh or c[0] not in images]
    found = missed = failed = 0
    for cid, _, title, q in todo:
        try:
            r = find(cid, q)
            images[cid] = r if r else {"none": True}       # „kein Bild“ merken, damit wir nicht ständig neu suchen
            found += bool(r); missed += not r
        except Exception as e:
            failed += 1
            print(f"WARN  {cid} ({q}): {type(e).__name__}: {e}", file=sys.stderr)
        time.sleep(0.15)
    valid = {c[0] for c in cards}
    images = {k: v for k, v in images.items() if k in valid}   # gelöschte Karten aufräumen
    out_path.write_text(json.dumps(images, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    print(f"{len(cards)} Karten, {len(todo)} bearbeitet: {found} Bilder gefunden, {missed} ohne passendes Bild, {failed} Fehler")
    return 0


if __name__ == "__main__":
    sys.exit(main())
