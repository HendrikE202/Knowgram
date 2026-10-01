#!/usr/bin/env python3
"""Holt Hendriks Bewertungen aus dem Sync (Supabase) und schreibt nur THEMEN-Gewichte nach taste.json.

Datenschutz: In taste.json landen weder Titel, Notizen, Wünsche noch Karten-IDs – nur je Thema eine Zahl.
(Das Repo ist öffentlich.) Notizen und Wünsche arbeitet weiterhin ein interaktives Claude von Hand in NUTZERWUENSCHE.md ein.

Gegen Filterblasen ist alles bewusst vorsichtig gebaut:
- Mindestens MIN_N Bewertungen je Thema, sonst gilt das Thema als „unbekannt“ (wird erkundet, nicht gewichtet).
- Die Punktzahl wird geglättet: (Likes − Dislikes) / (Likes + Dislikes + K). Wenige Bewertungen ergeben also nur schwache Werte.
- Ältere, verdichtete Bewertungen („arch“) zählen mit, aber nur halb.
- Das Ergebnis ist nur ein „Stups“ −1 / 0 / +1 je Thema und nie ein Ausschluss. Die Regeln dazu stehen in tools/ANWEISUNG_NEUE_KARTEN.md.

Benötigt die Umgebungsvariable KNOWGRAM_SYNC_CODE (GitHub-Secret). Fehlt sie oder ist der Server nicht erreichbar,
bleibt taste.json unverändert und das Skript endet ohne Fehler.
"""
import json, os, re, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
URL = "https://apipudwplhilusdqyemx.supabase.co/rest/v1/rpc/kg_summary"
KEY = "sb_publishable_0QNoSsrwGFtS1BV2ZdkQUA_7-rfuwQI"        # öffentlicher Schlüssel (steht auch in config.js)
MIN_N = 3          # ab so vielen Bewertungen zählt ein Thema
K = 4              # Glättung: je größer, desto vorsichtiger
STUPS = 0.25       # ab diesem Betrag gibt es einen Stups (+1/−1)


def normalize(code):
    return re.sub(r"[^A-Z0-9]", "", (code or "").upper())


def compute(summary):
    up, down = {}, {}
    for r in summary.get("ratings", []):
        t = r.get("topic")
        if not t: continue
        if r.get("r") == 1: up[t] = up.get(t, 0) + 1
        elif r.get("r") == -1: down[t] = down.get(t, 0) + 1
    half_up, half_down = {}, {}
    for t, a in (summary.get("arch") or {}).items():            # verdichtete ältere Bewertungen zählen halb
        half_up[t] = (a.get("up") or 0) * 0.5
        half_down[t] = (a.get("down") or 0) * 0.5
    topics = {}
    for t in set(up) | set(down) | set(half_up) | set(half_down):
        u = up.get(t, 0) + half_up.get(t, 0); d = down.get(t, 0) + half_down.get(t, 0)
        n = u + d
        score = (u - d) / (n + K)
        nudge = 0 if n < MIN_N else (1 if score >= STUPS else -1 if score <= -STUPS else 0)
        topics[t] = {"n": round(n, 1), "score": round(score, 2), "nudge": nudge}
    return {"topics": dict(sorted(topics.items())),
            "hinweis": "Nur ein leichter Stups (−1/0/+1), nie ein Ausschluss. Themen ohne Eintrag oder mit n < %d sind unbekannt und werden erkundet." % MIN_N}


def main():
    code = normalize(os.environ.get("KNOWGRAM_SYNC_CODE", ""))
    if len(code) != 24:
        print("KNOWGRAM_SYNC_CODE fehlt oder hat nicht 24 Zeichen – taste.json bleibt unverändert."); return
    req = urllib.request.Request(URL, data=json.dumps({"code": code}).encode(), method="POST",
                                 headers={"apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            summary = json.loads(r.read().decode())
    except Exception as e:
        print("Sync nicht erreichbar:", type(e).__name__); return
    if not summary:
        print("Kein Eintrag zu diesem Code – taste.json bleibt unverändert."); return
    out = compute(summary)
    out["generated"] = datetime.now(timezone.utc).isoformat(timespec="minutes")
    (ROOT / "taste.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    pos = [t for t, v in out["topics"].items() if v["nudge"] > 0]; neg = [t for t, v in out["topics"].items() if v["nudge"] < 0]
    print(f"taste.json: {len(out['topics'])} Themen, Stups + bei {len(pos)}, − bei {len(neg)}")


if __name__ == "__main__":
    main()
