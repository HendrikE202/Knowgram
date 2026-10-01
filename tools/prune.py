#!/usr/bin/env python3
"""Räumt auf, was zu abgelaufenen Meldungen gehört, damit Dateien (und die App-Ladezeit) nicht ewig wachsen.

- summaries.json: Einordnungen von Meldungen/„Heute vor …“-Karten, die es nicht mehr gibt, fliegen raus.
- images.json: Bild-Einträge dynamischer Karten (n…/otd…), die es nicht mehr gibt, fliegen raus.
(articles.json räumt sich in fetch_articles.py selbst auf, news.json über „expires“ in fetch_news.py.)
Gespeicherte Meldungen behalten ihre Einordnung in der App selbst (Kopie im Gerätespeicher).
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DYN = re.compile(r"^n[0-9a-f]{10}$|^otd\d")


def main():
    news = json.loads((ROOT / "news.json").read_text(encoding="utf-8"))["items"]
    if len(news) < 20:                                  # lieber nichts löschen, wenn die Meldungsliste verdächtig klein ist
        print("Zu wenige Meldungen – nichts aufgeräumt"); return
    otd_p = ROOT / "onthisday.json"
    otd = json.loads(otd_p.read_text(encoding="utf-8")).get("items", []) if otd_p.exists() else []
    live = {n["id"] for n in news} | {o["id"] for o in otd}
    for name, key in (("summaries.json", lambda k: k), ("images.json", lambda k: k.split("#")[0])):
        p = ROOT / name
        d = json.loads(p.read_text(encoding="utf-8"))
        gone = [k for k in d if DYN.match(key(k)) and key(k) not in live]
        for k in gone:
            del d[k]
        if gone:
            p.write_text(json.dumps(d, ensure_ascii=False, indent=2 if name == "images.json" else 1) + "\n", encoding="utf-8")
        print(f"{name}: {len(gone)} abgelaufene Einträge entfernt, {len(d)} übrig")


if __name__ == "__main__":
    main()
