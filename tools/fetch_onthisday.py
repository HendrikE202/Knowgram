#!/usr/bin/env python3
"""Holt „Am heutigen Tag“-Ereignisse der deutschsprachigen Wikipedia und schreibt onthisday.json.

Nur Standardbibliothek. Bei Fehlern bleibt die vorhandene Datei unverändert (Exit 0),
damit der News-Job nicht daran scheitert.
"""
import hashlib, html, json, os, re, sys, urllib.request
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
UA = "Knowgram/1.0 (persoenliche Lern-App; kontakt: github.com/HendrikE202/Knowgram)"
MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
# {mm}/{dd} werden ersetzt; per Umgebungsvariable überschreibbar (Tests)
URLS = [os.environ.get("OTD_URL") or "https://de.wikipedia.org/api/rest_v1/feed/onthisday/selected/{mm}/{dd}",
        "https://de.wikipedia.org/api/rest_v1/feed/onthisday/events/{mm}/{dd}"]
COUNT = 3


def clean(s, limit=340):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    s = re.sub(r"\s+", " ", s).strip()
    if len(s) > limit:
        s = s[:limit].rsplit(" ", 1)[0].rstrip(",;:") + " …"
    return s


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode("utf-8"))


def main():
    now = datetime.now(ZoneInfo("Europe/Berlin"))
    mm, dd = f"{now.month:02d}", f"{now.day:02d}"
    md = f"{mm}-{dd}"
    out = ROOT / "onthisday.json"
    try:
        if json.loads(out.read_text(encoding="utf-8")).get("md") == md:
            print("onthisday.json ist für heute schon aktuell")
            return 0
    except Exception:
        pass

    events = []
    for tpl in URLS:
        try:
            data = get(tpl.format(mm=mm, dd=dd))
            events = data.get("selected") or data.get("events") or []
            if events:
                break
        except Exception as e:
            print(f"WARN  {tpl}: {type(e).__name__}: {e}", file=sys.stderr)
    events = [e for e in events if e.get("text") and isinstance(e.get("year"), int) and e.get("pages")]
    if not events:
        print("Keine Ereignisse gefunden – onthisday.json bleibt unverändert.", file=sys.stderr)
        return 0

    # Verteilt über die Jahrhunderte auswählen (jeder Tag andere Startposition, aber reproduzierbar)
    events.sort(key=lambda e: e["year"])
    step = max(1, len(events) // COUNT)
    offset = int(hashlib.sha1(md.encode()).hexdigest(), 16) % step
    picks = [events[min(offset + i * step, len(events) - 1)] for i in range(COUNT)]

    items, seen = [], set()
    for e in picks:
        page = e["pages"][0]
        link = ((page.get("content_urls") or {}).get("desktop") or {}).get("page", "")
        text = clean(e["text"])
        if text in seen or not link.startswith("https://"):
            continue
        seen.add(text)
        ago = now.year - e["year"]
        items.append({
            "id": f"otd{now.year}{mm}{dd}{len(items)}", "kind": "otd", "topic": "geschichte", "md": md,
            "year": e["year"], "title": f"Heute vor {ago} Jahren" if ago > 0 else "Heute",
            "text": text, "link": link, "source": "Wikipedia", "type": "Wikipedia · Am heutigen Tag",
            "date": f"{now.day}. {MONATE[now.month - 1]} {e['year']}",
        })
    if not items:
        return 0
    out.write_text(json.dumps({"date": now.date().isoformat(), "md": md, "items": items}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(items)} Ereignisse für {md} geschrieben")
    return 0


if __name__ == "__main__":
    sys.exit(main())
