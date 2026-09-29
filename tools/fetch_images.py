#!/usr/bin/env python3
"""Sucht zu jeder Wissenskarte ein passendes, frei lizenziertes Titelbild auf Wikimedia Commons.

Qualitätsregeln (lieber KEIN Bild als ein 0815-Bild – dann zeigt die App das eigene Cover):
  1. Artikelbild der Wikipedia, aber nur wenn der Artikel zur Karte passt und die Datei kein Logo/Wappen/
     Flagge/Icon o. Ä. ist, groß genug (>= 600 px) und im sinnvollen Format.
  2. Sonst Dateisuche bei Commons mit Relevanzprüfung: mindestens zwei Kernbegriffe der Karte müssen in
     Dateiname/Beschreibung/Kategorien vorkommen.
  3. Nur CC0 / CC BY / CC BY-SA / gemeinfrei (keine NC/ND, keine „Fair use“-Bilder).
  4. Handkorrektur möglich: tools/image_overrides.json  {"karten-id": null | "Dateiname.jpg"}.
Gespeichert werden NUR Adresse, Urheberangabe und Kurzbeschreibung (images.json), keine Bildkopien.
Bereits bearbeitete Karten werden übersprungen (`--refresh` für alles neu). Nur Standardbibliothek.
"""
import html, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "Knowgram/1.0 (persoenliche Lern-App; kontakt: github.com/HendrikE202/Knowgram)"
WIKI = os.environ.get("WIKI_BASE", "https://de.wikipedia.org")
COMMONS = os.environ.get("COMMONS_BASE", "https://commons.wikimedia.org")
DELAY = float(os.environ.get("IMG_DELAY", "1.2"))        # Pause zwischen Anfragen (Wikimedia bittet um Zurückhaltung)
MAX_PER_RUN = int(os.environ.get("IMG_MAX", "40"))       # pro Lauf höchstens so viele Karten; der Rest folgt beim nächsten Lauf
OK_LICENSE = re.compile(r"^(CC0|CC[ -]BY(?![ -]?NC)(?![ -]?ND)|Public domain|PD|gemeinfrei)", re.I)
BAD_FILE = re.compile(r"logo|icon|flag|flagge|wappen|coat[_ ]of[_ ]arms|signature|unterschrift|pictogram|piktogramm|banner|button|"
                      r"qsicon|ambox|stub|symbol|location[_ ]map|locator|karte[_ ]|blank|placeholder|no[_ ]image|portrait[_ ]placeholder", re.I)
STOP = set("der die das den dem des ein eine einer und oder mit von für auf aus bei nach vor über unter durch zwischen ohne "
           "wegen sowie nicht auch noch nur dass sich sind wird wurde hat haben mehr neue wie was wer wo warum wann als im in "
           "am an zu zum zur ist war sein seine ihre unser the and of".split())
CARD = re.compile(r'\{\s*id:\s*"([^"]+)",\s*topic:\s*"([^"]+)",\s*title:\s*"((?:[^"\\]|\\.)*)",\s*q:\s*"((?:[^"\\]|\\.)*)"')


class RateLimited(Exception):
    pass


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


def stems(text):
    """Grobe Wortstämme (erste 5 Buchstaben) – so passen „Kraken“/„Krake“ oder „Doppelspalt“/„Doppelspaltexperiment“ zusammen."""
    return {w[:5] for w in re.findall(r"[a-zäöüß0-9]{4,}", (text or "").lower().replace("_", " ")) if w not in STOP}


def meta(ii):
    ex = ii.get("extmetadata") or {}
    v = lambda k: (ex.get(k) or {}).get("value")
    return {"lic": strip(v("LicenseShortName"), 40), "by": strip(v("Artist")) or "Unbekannt",
            "desc": strip(v("ImageDescription"), 110), "cats": v("Categories") or "", "nonfree": v("NonFree") in ("true", "1")}


def acceptable(name, w, h, m):
    if BAD_FILE.search(name) or m["nonfree"] or not OK_LICENSE.match(m["lic"]):
        return False
    if w and w < 600:
        return False
    if w and h and not (0.55 <= w / h <= 2.4):
        return False
    return True


def entry(name, url, m, art=""):
    return {"u": url, "by": m["by"], "lic": m["lic"], **({"desc": m["desc"]} if m["desc"] else {}),
            "page": f"{COMMONS}/wiki/File:{urllib.parse.quote(name.replace(' ', '_'))}", "art": art}


def imageinfo(name, width=960):
    info = get(f"{COMMONS}/w/api.php?action=query&titles={urllib.parse.quote('File:' + name)}&prop=imageinfo"
               f"&iiprop=extmetadata|size|url&iiurlwidth={width}&format=json&formatversion=2")
    pg = (info.get("query", {}).get("pages") or [{}])[0]
    return (pg.get("imageinfo") or [{}])[0]


def find(q, title):
    want = stems(q + " " + title)
    # 1) Artikelbild – nur wenn der Artikel zur Karte passt
    d = get(f"{WIKI}/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=1"
            "&prop=pageimages|pageprops&piprop=thumbnail|name&pithumbsize=960&ppprop=disambiguation&format=json&formatversion=2")
    pg = ((d.get("query") or {}).get("pages") or [None])[0]
    if pg and "disambiguation" not in (pg.get("pageprops") or {}) and stems(pg.get("title", "")) & want:
        th, name = pg.get("thumbnail") or {}, pg.get("pageimage") or ""
        if name and "/wikipedia/commons/" in th.get("source", "") and th.get("source", "").startswith("https://"):
            ii = imageinfo(name)
            m = meta(ii)
            if acceptable(name, th.get("width"), th.get("height"), m):
                return entry(name, th["source"], m, pg.get("title", ""))
    # 2) Dateisuche bei Commons mit Relevanzprüfung
    d = get(f"{COMMONS}/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}"
            "&gsrlimit=10&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=960&format=json&formatversion=2")
    best, best_key = None, None
    for p in (d.get("query") or {}).get("pages") or []:
        ii = (p.get("imageinfo") or [{}])[0]
        name = (p.get("title") or "").replace("File:", "", 1)
        m = meta(ii)
        if not name or not ii.get("thumburl", "").startswith("https://") or not acceptable(name, ii.get("width"), ii.get("height"), m):
            continue
        hits = len(want & stems(name + " " + m["desc"] + " " + m["cats"]))
        if hits >= (1 if len(want) <= 2 else 2) and (best_key is None or (hits, ii.get("width", 0)) > best_key):
            best, best_key = entry(name, ii["thumburl"], m, ""), (hits, ii.get("width", 0))
    return best


def main():
    refresh = "--refresh" in sys.argv
    out_path = ROOT / "images.json"
    try:
        images = json.loads(out_path.read_text(encoding="utf-8"))
    except Exception:
        images = {}
    try:
        overrides = json.loads((ROOT / "tools" / "image_overrides.json").read_text(encoding="utf-8"))
    except Exception:
        overrides = {}
    cards = [(i, t, unesc(ti), unesc(q)) for i, t, ti, q in CARD.findall((ROOT / "cards.js").read_text(encoding="utf-8"))]
    todo = [c for c in cards if refresh or c[0] not in images or (c[0] in overrides and images.get(c[0], {}).get("ov") != overrides[c[0]])]
    batch, rest = todo[:MAX_PER_RUN], max(0, len(todo) - MAX_PER_RUN)
    found = missed = failed = 0
    stopped = False

    def save():
        valid = {c[0] for c in cards}
        out_path.write_text(json.dumps({k: v for k, v in images.items() if k in valid}, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")

    for n, (cid, _, title, q) in enumerate(batch, 1):
        try:
            if cid in overrides:                               # Handkorrektur
                ov = overrides[cid]
                if ov is None:
                    r = None
                else:
                    ii = imageinfo(ov)
                    m = meta(ii)
                    r = entry(ov, ii.get("thumburl") or ii.get("url"), m) if ii and OK_LICENSE.match(m["lic"]) else None
                images[cid] = {**r, "ov": ov} if r else {"none": True, "ov": ov}
            else:
                r = find(q, title)
                images[cid] = r if r else {"none": True}       # „kein Bild“ merken, damit wir nicht ständig neu suchen
            found += bool(r); missed += not r
        except RateLimited:
            print("Wikimedia bremst weiter – Lauf wird beendet, der Rest folgt beim nächsten Mal.", file=sys.stderr)
            stopped = True
            break
        except Exception as e:                                  # einzelne Karte scheitert -> später erneut versuchen
            failed += 1
            print(f"WARN  {cid} ({q}): {type(e).__name__}: {e}", file=sys.stderr)
        if n % 10 == 0:
            save()
    save()
    print(f"{len(cards)} Karten, {len(batch)} versucht: {found} Bilder gefunden, {missed} ohne passendes Bild (Cover), {failed} Fehler"
          f"{', abgebrochen (Rate-Limit)' if stopped else ''}; noch offen: {rest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
