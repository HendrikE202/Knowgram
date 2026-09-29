#!/usr/bin/env python3
"""Holt die Feeds aus feeds.json und schreibt news.json.

Nur Standardbibliothek. Kaputte Feeds werden übersprungen (Warnung, kein Abbruch);
alte Meldungen aus einem früheren news.json bleiben erhalten, bis sie zu alt sind.
Verwendet wird nur die Vorschau (Titel + Teaser) des Anbieters plus Link zum Original.
"""
import hashlib, html, json, re, sys, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "Knowgram/1.0 (persoenliche Lern-App; RSS-Leser)"
NS = {"atom": "http://www.w3.org/2005/Atom", "dc": "http://purl.org/dc/elements/1.1/"}
TAG = re.compile(r"<[^>]+>")


def clean(s, limit=320):
    s = html.unescape(TAG.sub(" ", s or ""))
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


def entries(root):
    """Liefert (titel, teaser, link, datum) für RSS 2.0 und Atom."""
    for it in root.iter("item"):
        yield (text(it, "title"), text(it, "description"), text(it, "link"),
               text(it, "pubDate") or text(it, "dc:date"))
    for e in root.iter("{http://www.w3.org/2005/Atom}entry"):
        link = ""
        for l in e.findall("atom:link", NS):
            if l.get("rel", "alternate") == "alternate":
                link = l.get("href", "")
                break
        yield (text(e, "atom:title"), text(e, "atom:summary") or text(e, "atom:content"),
               link, text(e, "atom:published") or text(e, "atom:updated"))


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
            for title, desc, link, date in entries(root):
                d = parse_date(date)
                link = (link or "").strip()
                if not (title and link.startswith(("http://", "https://")) and d):
                    continue
                got.append((d, {
                    "id": "n" + hashlib.sha1(link.encode()).hexdigest()[:10],
                    "topic": f["topic"], "title": clean(title, 160), "text": clean(desc),
                    "link": link, "published": d.isoformat(), "source": f["source"],
                    "type": f["type"], "lang": f.get("lang", "de"),
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

    fresh = [n for n in items.values() if parse_date(n["published"]) and parse_date(n["published"]) >= cutoff]
    fresh.sort(key=lambda n: n["published"], reverse=True)
    fresh = fresh[: cfg.get("max_items_total", 80)]

    if ok == 0:
        print("Kein Feed erreichbar – news.json bleibt unverändert.", file=sys.stderr)
        return 1
    out_path.write_text(json.dumps({"generated": now.isoformat(), "items": fresh}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(fresh)} Meldungen geschrieben ({ok} Feeds ok, {failed} fehlgeschlagen)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
