#!/usr/bin/env python3
"""Holt die Feeds aus feeds.json und schreibt news.json.

Nur Standardbibliothek. Kaputte Feeds werden übersprungen (Warnung, kein Abbruch);
alte Meldungen aus einem früheren news.json bleiben erhalten, bis sie zu alt sind.
Verwendet wird nur die Vorschau (Titel + Teaser) des Anbieters plus Link zum Original.
"""
import hashlib, html, json, re, sys, urllib.request
from collections import Counter
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "Knowgram/1.0 (persoenliche Lern-App; RSS-Leser)"
NS = {"atom": "http://www.w3.org/2005/Atom", "dc": "http://purl.org/dc/elements/1.1/",
      "media": "http://search.yahoo.com/mrss/", "content": "http://purl.org/rss/1.0/modules/content/"}
IMG_TAG = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I)
TAG = re.compile(r"<[^>]+>")


def clean(s, limit=320):
    s = html.unescape(TAG.sub(" ", s or "")).replace("\u00ad", "")
    s = re.sub(r"\s+", " ", s).strip()
    if len(s) > limit:
        s = s[:limit].rsplit(" ", 1)[0].rstrip(",;:") + " …"
    return s


def parse_date(s):
    if not s:
        return None
    try:
        d = parsedate_to_datetime(s.strip())
    except Exception:
        try:
            d = datetime.fromisoformat(s.strip().replace("Z", "+00:00"))
        except Exception:
            return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=timezone.utc)
    return d.astimezone(timezone.utc)


def text(el, path):
    x = el.find(path, NS)
    return x.text if x is not None and x.text else ""


# Bilder, die erkennbar Logos, Zählpixel, Werbung oder Stockfotos sind (0815) – lieber gar kein Bild als ein unpassendes
BAD_IMG = re.compile(
    r"logo|icon|favicon|default|placeholder|platzhalter|fallback|avatar|sprite|blank|pixel|cpx\.php|tracking|/ads?/|promo|"
    r"sponsor|betmgm|istock|shutterstock|adobestock|getty|depositphotos|stock[-_ ]?(photo|foto)|symbolbild|symbolfoto|"
    r"blaulicht|geldscheine|euro-?scheine|sparschwein|justitia|handschellen|banner|button", re.I)


def img_key(u):
    return u.split("?")[0].rsplit("/", 1)[-1].lower()


def drop_generic_images(items):
    """Entfernt Bilder mit verdächtigem Namen und Bilder, die bei mehreren Meldungen gleichzeitig auftauchen (Platzhalter)."""
    cnt = Counter(img_key(n["img"]) for n in items if n.get("img"))
    for n in items:
        u = n.get("img")
        if u and (BAD_IMG.search(u) or cnt[img_key(u)] > 1):
            n.pop("img", None)
    return items


STOP = set("""der die das den dem des ein eine einer eines einem einen und oder mit von für auf aus bei nach vor über unter
gegen durch zwischen ohne wegen sowie nicht auch noch nur dass sich sind wird werden wurde wurden hat haben soll sollen
will wollen kann können muss müssen mehr neue neuen neuer neues erste ersten ersten zwei drei vier fünf jahre jahren
prozent millionen milliarden euro heute gestern nach sagt sagte fordert zeigt gibt geben bleibt bleiben kommt kommen""".split())


def toks(title):
    return {w for w in re.findall(r"[a-zäöüß0-9][a-zäöüß0-9-]{3,}", title.lower()) if w not in STOP}


def similar(a, b):
    i = len(a & b)
    return i >= 3 or (i >= 2 and i / max(1, min(len(a), len(b))) >= 0.34)


def cluster(items):
    """Gruppiert Meldungen, die dasselbe Ereignis meinen (gemeinsame Kernwörter im Titel); ergänzt „also“ = andere Quellen."""
    de = [n for n in items if n.get("lang", "de") == "de"]
    tk = {n["id"]: toks(n["title"]) for n in de}
    parent = {n["id"]: n["id"] for n in de}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    for i, a in enumerate(de):
        for b in de[i + 1:]:
            if similar(tk[a["id"]], tk[b["id"]]):
                parent[find(a["id"])] = find(b["id"])
    groups = {}
    for n in de:
        groups.setdefault(find(n["id"]), []).append(n)
    for g in groups.values():
        for n in g:
            n.pop("also", None)
            others = [{"source": o["source"], "title": o["title"], "link": o["link"]} for o in g if o["source"] != n["source"]]
            seen, also = set(), []
            for o in others:                                  # pro Quelle nur eine
                if o["source"] not in seen:
                    seen.add(o["source"]); also.append(o)
            if also:
                n["also"] = also[:3]
    return list(groups.values())


# Weiche Themen gehören nicht in „Heute in der Welt“; harte Nachrichten-Signale zählen mehr
SOFT = re.compile(r"tipps?\b|ferien|kürbis|oktoberfest|wetter|horoskop|rezept|gewinnspiel|promi|royal|bundesliga|fußball|ticker|podcast|quiz|reise|urlaub|freizeit|kochen|garten|lifestyle|kino|serie\b|konzert|festival|mode\b|trend", re.I)
HARD = re.compile(r"krieg|angriff|regierung|minister|kanzler|präsident|wahl|gericht|urteil|sanktion|abkommen|verhandl|nato|\beu\b|ukraine|russland|china|usa|israel|iran|gaza|haushalt|inflation|zins|börse|konjunktur|klima|streik|rücktritt|festgenommen|verhaftet|anschlag|drohnen|explosion|erdbeben|katastrophe|tote|gesetz|bundestag|wirtschaft|energie|öl|gas", re.I)
PRIO = ["Tagesschau", "Deutschlandfunk", "Deutsche Welle", "hessenschau (hr)"]


def build_briefing(items, now, size=10):
    """„Heute in der Welt“: die wichtigsten Ereignisse – Wichtigkeit = von wie vielen Quellen berichtet, dazu Frische."""
    groups = cluster(items)
    scored = []
    for g in groups:
        cand = [n for n in g if n["topic"] in ("politik", "welt", "wirtschaft") and not SOFT.search(n["title"])]
        if not cand:
            continue
        srcs = len({n["source"] for n in g})
        rep = sorted(cand, key=lambda n: (0 if n.get("img") else 1, PRIO.index(n["source"]) if n["source"] in PRIO else 9, n["published"]))[0]
        age_h = (now - parse_date(rep["published"])).total_seconds() / 3600
        scored.append((10 * srcs + max(0.0, 24 - age_h) / 24 * 6 + (2 if rep.get("img") else 0) + (5 if HARD.search(rep["title"]) else 0), rep))
    scored.sort(key=lambda x: -x[0])
    out, per_topic, per_source = [], Counter(), Counter()
    for _, n in scored:
        if per_topic[n["topic"]] >= 4 or per_source[n["source"]] >= 5:
            continue
        out.append(n["id"]); per_topic[n["topic"]] += 1; per_source[n["source"]] += 1
        if len(out) >= size:
            break
    return out


def find_image(it):
    """Sucht ein Vorschaubild (enclosure, media:content/thumbnail, erstes <img>); nur https."""
    cands = []
    for e in it.findall("enclosure"):
        if (e.get("type") or "").startswith("image"):
            cands.append(e.get("url"))
    for tag in ("media:content", "media:thumbnail"):
        for e in it.findall(tag, NS):
            if tag.endswith("thumbnail") or (e.get("medium") == "image" or (e.get("type") or "").startswith("image")):
                cands.append(e.get("url"))
    for tag in ("description", "content:encoded"):
        m = IMG_TAG.search(text(it, tag))
        if m:
            cands.append(html.unescape(m.group(1)))
    for u in cands:
        if u and u.startswith("https://") and len(u) < 500 and not BAD_IMG.search(u):
            return u
    return ""


def entries(root):
    """Liefert (titel, teaser, link, datum, bild) für RSS 2.0 und Atom."""
    for it in root.iter("item"):
        yield (text(it, "title"), text(it, "description"), text(it, "link"),
               text(it, "pubDate") or text(it, "dc:date"), find_image(it))
    for e in root.iter("{http://www.w3.org/2005/Atom}entry"):
        link = ""
        for l in e.findall("atom:link", NS):
            if l.get("rel", "alternate") == "alternate":
                link = l.get("href", "")
                break
        yield (text(e, "atom:title"), text(e, "atom:summary") or text(e, "atom:content"),
               link, text(e, "atom:published") or text(e, "atom:updated"), "")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read()


def main():
    cfg = json.loads((ROOT / "feeds.json").read_text(encoding="utf-8"))
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=cfg.get("max_age_days", 7))
    out_path = ROOT / "news.json"

    try:
        old = json.loads(out_path.read_text(encoding="utf-8")).get("items", [])
    except Exception:
        old = []
    items = {n["link"]: n for n in old if n.get("link")}

    ok = failed = 0
    for f in cfg["feeds"]:
        try:
            root = ET.fromstring(fetch(f["url"]))
            got = []
            for title, desc, link, date, img in entries(root):
                d = parse_date(date)
                link = (link or "").strip()
                if not (title and link.startswith(("http://", "https://")) and d):
                    continue
                if any(k.lower() in title.lower() for k in f.get("skip", [])):
                    continue  # z. B. Werbung/Webinare
                got.append((d, {
                    "id": "n" + hashlib.sha1(link.encode()).hexdigest()[:10],
                    "topic": f["topic"], "title": clean(title, 160), "text": clean(desc),
                    "link": link, "published": d.isoformat(), "source": f["source"],
                    "type": f["type"], "lang": f.get("lang", "de"),
                    "expires": (d + timedelta(days=f.get("ttl_days", 7))).isoformat(),
                    **({"img": img} if img and f.get("images", True) else {}),
                    **({"tag": f["tag"]} if f.get("tag") else {}),
                }))
            got.sort(key=lambda x: x[0], reverse=True)
            for d, n in got[: f.get("max", 3)]:
                items[n["link"]] = n
            ok += 1
            print(f"OK    {f['id']}: {len(got)} Einträge gelesen")
        except Exception as e:
            failed += 1
            print(f"WARN  {f['id']}: {type(e).__name__}: {e}", file=sys.stderr)

    def alive(n):   # veraltete Meldungen fliegen raus: eigenes Verfallsdatum (je Quelle) und globales Höchstalter
        d = parse_date(n["published"]); ex = parse_date(n.get("expires") or "")
        return bool(d) and d >= cutoff and (ex is None or ex > now)
    fresh = [n for n in items.values() if alive(n)]
    fresh.sort(key=lambda n: n["published"], reverse=True)
    fresh = fresh[: cfg.get("max_items_total", 80)]

    if ok == 0:
        print("Kein Feed erreichbar – news.json bleibt unverändert.", file=sys.stderr)
        return 1
    fresh = drop_generic_images(fresh)
    briefing = build_briefing(fresh, now)
    out_path.write_text(json.dumps({"generated": now.isoformat(), "briefing": briefing, "items": fresh}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(fresh)} Meldungen geschrieben ({ok} Feeds ok, {failed} fehlgeschlagen), Überblick: {len(briefing)} Ereignisse, Bilder: {sum(1 for n in fresh if n.get('img'))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
