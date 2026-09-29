#!/usr/bin/env python3
"""Sucht zu jeder Wissenskarte ein frei lizenziertes Titelbild auf Wikimedia Commons.

Ablauf je Karte: Suchbegriff `q` -> Wikipedia-Artikel -> Artikelbild -> Lizenz bei Commons prüfen.
Nur Bilder mit CC0 / CC BY / CC BY-SA / gemeinfrei (keine NC/ND, keine „Fair use“-Bilder aus der
Wikipedia selbst). Gespeichert werden NUR die Adresse und die Urheberangabe (images.json) –
keine Bildkopien. Bereits gefundene Karten werden übersprungen (`--refresh` für alles neu).
Nur Standardbibliothek; Fehler einzelner Karten brechen den Lauf nicht ab.
"""
import html, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "Knowgram/1.0 (persoenliche Lern-App; kontakt: github.com/HendrikE202/Knowgram)"
WIKI = os.environ.get("WIKI_BASE", "https://de.wikipedia.org")
COMMONS = os.environ.get("COMMONS_BASE", "https://commons.wikimedia.org")
OK_LICENSE = re.compile(r"^(CC0|CC[ -]BY(?![ -]?NC)(?![ -]?ND)|Public domain|PD|gemeinfrei)", re.I)
DELAY = float(os.environ.get("IMG_DELAY", "1.2"))        # Pause zwischen Anfragen (Wikimedia bittet um Zurückhaltung)
MAX_PER_RUN = int(os.environ.get("IMG_MAX", "40"))       # pro Lauf höchstens so viele Karten; der Rest folgt beim nächsten Lauf


class RateLimited(Exception):
    pass


CARD = re.compile(r'\{\s*id:\s*"([^"]+)",\s*topic:\s*"([^"]+)",\s*title:\s*"((?:[^"\\]|\\.)*)",\s*q:\s*"((?:[^"\\]|\\.)*)"')


def get(url):
    """GET mit Wartezeit bei 429/503 (Retry-After); nach 3 Versuchen wird der Lauf sauber abgebrochen."""
    for attempt in range(3):
        time.sleep(DELAY)
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code not in (429, 503):
                raise
            wait = min(int(e.headers.get("Retry-After", "30") or 30), 120) * (attempt + 1)
            print(f"WARN  {e.code} – warte {wait}s (Versuch {attempt + 1}/3)", file=sys.stderr)
            time.sleep(wait)
    raise RateLimited()


def unesc(s):
    try:
        return json.loads('"' + s + '"')
    except Exception:
        return s


def strip(s, n=90):
    s = html.unescape(re.sub(r"<[^>]+>", "", s or ""))
    return re.sub(r"\s+", " ", s).strip()[:n]


def find(card_id, q):
    """Zwei Anfragen: (1) Suche + Artikelbild in einem Aufruf, (2) Lizenz des Bildes bei Commons."""
    d = get(f"{WIKI}/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=1"
            "&prop=pageimages|pageprops&piprop=thumbnail|name&pithumbsize=960&ppprop=disambiguation&format=json&formatversion=2")
    pages = (d.get("query") or {}).get("pages") or []
    if not pages:
        return None
    pg = pages[0]
    if "disambiguation" in (pg.get("pageprops") or {}):
        return None
    th, name = (pg.get("thumbnail") or {}).get("source", ""), pg.get("pageimage") or ""
    if not th or not name or "/wikipedia/commons/" not in th:   # kein Commons-Bild (z. B. lokales „Fair use“-Bild) -> nicht verwenden
        return None
    info = get(f"{COMMONS}/w/api.php?action=query&titles={urllib.parse.quote('File:' + name)}&prop=imageinfo&iiprop=extmetadata&format=json&formatversion=2")
    ii = ((info.get("query", {}).get("pages") or [{}])[0].get("imageinfo") or [{}])[0].get("extmetadata") or {}
    lic = strip((ii.get("LicenseShortName") or {}).get("value"), 40)
    if not OK_LICENSE.match(lic) or (ii.get("NonFree") or {}).get("value") in ("true", "1"):
        return None
    if not th.startswith("https://"):
        return None
    return {"u": th, "by": strip((ii.get("Artist") or {}).get("value")) or "Unbekannt", "lic": lic,
            "page": f"{COMMONS}/wiki/File:{urllib.parse.quote(name.replace(' ', '_'))}", "art": pg.get("title", "")}


def main():
    refresh = "--refresh" in sys.argv
    out_path = ROOT / "images.json"
    try:
        images = json.loads(out_path.read_text(encoding="utf-8"))
    except Exception:
        images = {}
    cards = [(i, t, unesc(ti), unesc(q)) for i, t, ti, q in CARD.findall((ROOT / "cards.js").read_text(encoding="utf-8"))]
    todo = [c for c in cards if refresh or c[0] not in images]
    batch, rest = todo[:MAX_PER_RUN], max(0, len(todo) - MAX_PER_RUN)
    found = missed = failed = 0
    stopped = False

    def save():
        valid = {c[0] for c in cards}
        out_path.write_text(json.dumps({k: v for k, v in images.items() if k in valid}, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")

    for n, (cid, _, title, q) in enumerate(batch, 1):
        try:
            r = find(cid, q)
            images[cid] = r if r else {"none": True}       # „kein Bild“ merken, damit wir nicht ständig neu suchen
            found += bool(r); missed += not r
        except RateLimited:
            print("Wikimedia bremst weiter – Lauf wird beendet, der Rest folgt beim nächsten Mal.", file=sys.stderr)
            stopped = True
            break
        except Exception as e:                              # einzelne Karte scheitert -> später erneut versuchen
            failed += 1
            print(f"WARN  {cid} ({q}): {type(e).__name__}: {e}", file=sys.stderr)
        if n % 10 == 0:
            save()
    save()
    print(f"{len(cards)} Karten, {len(batch)} versucht: {found} Bilder gefunden, {missed} ohne passendes Bild, {failed} Fehler"
          f"{', abgebrochen (Rate-Limit)' if stopped else ''}; noch offen: {rest + (len(batch) - found - missed - failed if stopped else 0)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
