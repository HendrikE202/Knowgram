#!/usr/bin/env python3
"""Qualitätsprüfung für Knowgram – die tägliche Routine MUSS das vor dem Push ausführen.

  python3 tools/check_cards.py            # prüft alle Karten und die Meldungs-Einordnungen
  python3 tools/check_cards.py --new 10   # zusätzlich: die letzten 10 Karten müssen abwechslungsreich sein

Exit-Code 1 bei Fehlern (dann NICHT pushen, sondern reparieren).
"""
import json, subprocess, sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FORMS = ("text", "points", "steps", "big")


def load_cards():
    js = "global.window={};require('./cards.js');console.log(JSON.stringify({c:window.CARDS,t:Object.keys(window.TOPICS)}))"
    out = subprocess.run(["node", "-e", js], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    d = json.loads(out)
    return d["c"], set(d["t"])


def slide_forms(s):
    return [f for f in FORMS if s.get(f)]


def check_slide(where, s, errs):
    if not isinstance(s, dict) or not s.get("h"):
        errs.append(f"{where}: Slide ohne Überschrift `h`"); return
    forms = slide_forms(s)
    if not forms:
        errs.append(f"{where}: Slide „{s['h']}“ ohne Inhalt (text/points/steps/big)"); return
    if s.get("text") and len(s["text"]) > 650:
        errs.append(f"{where}: Slide „{s['h']}“ zu lang ({len(s['text'])} Zeichen, max. 650)")
    for k, lo, hi in (("points", 1, 5), ("steps", 2, 7)):
        if s.get(k) and not (lo <= len(s[k]) <= hi):
            errs.append(f"{where}: Slide „{s['h']}“ hat {len(s[k])} {k} (erlaubt {lo}–{hi})")
    for k in ("points", "steps"):
        for x in s.get(k, []):
            if len(x) > 230:
                errs.append(f"{where}: Slide „{s['h']}“ – ein Eintrag ist zu lang ({len(x)} Zeichen)")
    if s.get("big") and not (s["big"].get("n") and s["big"].get("l")):
        errs.append(f"{where}: `big` braucht n und l")


def main():
    errs, warns = [], []
    cards, topics = load_cards()
    ids = [c["id"] for c in cards]
    if len(ids) != len(set(ids)):
        errs.append("doppelte Karten-IDs: " + ", ".join(i for i, n in Counter(ids).items() if n > 1))
    for c in cards:
        w = c["id"]
        if c.get("topic") not in topics:
            errs.append(f"{w}: unbekanntes Thema {c.get('topic')}")
        if not (c.get("title") and c.get("text") and c.get("q")):
            errs.append(f"{w}: title, text und q sind Pflicht")
        if len(c.get("points") or []) != 3:
            errs.append(f"{w}: `points` muss genau 3 Einträge haben")
        sl = c.get("slides") or []
        if not 1 <= len(sl) <= 3:
            errs.append(f"{w}: `slides` muss 1–3 Zusatz-Slides haben (hat {len(sl)}) – max. 6 Seiten je Karte insgesamt")
        for s in sl:
            check_slide(w, s, errs)
    # Abwechslung in der neuesten Charge
    if "--new" in sys.argv:
        n = int(sys.argv[sys.argv.index("--new") + 1])
        batch = cards[-n:]
        forms = Counter(f for c in batch for s in c.get("slides", []) for f in slide_forms(s))
        if len(forms) < 3:
            errs.append(f"Abwechslung: die letzten {n} Karten nutzen nur {sorted(forms)} – mindestens 3 verschiedene Formate (text/points/steps/big) mischen")
        if forms.get("steps", 0) < 2:
            errs.append("Abwechslung: mindestens 2 Slides mit `steps` (Ablauf/Zeitleiste) in der Charge")
        if forms.get("big", 0) < 1:
            errs.append("Abwechslung: mindestens 1 Slide mit `big` (große Zahl) in der Charge")
        counts = Counter(len(c.get("slides", [])) for c in batch)
        if len(counts) < 2:
            errs.append("Abwechslung: nicht alle Karten mit gleich vielen Zusatz-Slides ausstatten")
        first = Counter(c["slides"][0]["h"] for c in batch if c.get("slides"))
        for h, k in first.items():
            if k > 3:
                errs.append(f"Abwechslung: erste Zusatz-Überschrift „{h}“ kommt {k}× vor (max. 3)")
    # Meldungen: die wichtigsten müssen eine Einordnung mit Hintergrund-Slide haben
    try:
        news = json.loads((ROOT / "news.json").read_text(encoding="utf-8"))
        sums = json.loads((ROOT / "summaries.json").read_text(encoding="utf-8"))
        top = [x["id"] for x in news.get("ranked", [])[:20]] or news.get("briefing", [])
        have = {n["id"]: n for n in news["items"]}
        for i in top:
            n = have.get(i)
            if not n or len((n.get("text") or "")) < 40:
                continue                                             # ohne Vorschautext gibt es nichts einzuordnen
            s = sums.get(i)
            if not s:
                warns.append(f"Meldung {i} („{n['title'][:50]}“) hat noch keine Einordnung in summaries.json")
                continue
            if len(s.get("points", [])) < 2:
                errs.append(f"Meldung {i}: mindestens 2 Stichpunkte")
            if not s.get("slides"):
                warns.append(f"Meldung {i}: kein Hintergrund-Slide (`slides`)")
            for sl in s.get("slides", []):
                check_slide("Meldung " + i, sl, errs)
        for i in sums:
            if i not in have:
                warns.append(f"summaries.json enthält verschwundene Meldung {i} – entfernen")
    except FileNotFoundError:
        pass
    for w in warns:
        print("WARNUNG:", w)
    for e in errs:
        print("FEHLER:", e)
    print(f"{len(cards)} Karten geprüft · {len(errs)} Fehler · {len(warns)} Warnungen")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
