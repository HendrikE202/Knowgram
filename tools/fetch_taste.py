#!/usr/bin/env python3
"""Holt Hendriks Bewertungen aus dem Sync (Supabase) und schreibt nur THEMEN-Gewichte nach taste.json.

Datenschutz: In taste.json landen weder Titel, Notizen, Wünsche noch Karten-IDs – nur je Thema eine Zahl.
(Das Repo ist öffentlich.) Notizen und Wünsche arbeitet weiterhin ein interaktives Claude von Hand in NUTZERWUENSCHE.md ein.

Gegen Filterblasen ist alles bewusst vorsichtig gebaut (und relativ gerechnet, weil fast alles geliked wird):
- Plus (+1): Das Thema wurde deutlich öfter bewertet als der Durchschnitt (mindestens 1,5× und mindestens MIN_N) UND fast nur geliked.
- Minus (−1): Mindestens 3 Dislikes UND ein Dislike-Anteil von mindestens 40 %. Einzelne Dislikes (z. B. zwei Spiele-Tests in „IT“) reichen nie.
- Sonst 0. Ältere, verdichtete Bewertungen („arch“) zählen halb.
- Das Ergebnis ist nur ein „Stups“ −1 / 0 / +1 je Thema und nie ein Ausschluss. Die Regeln dazu stehen in tools/ANWEISUNG_NEUE_KARTEN.md.

Zusätzlich steht in taste.json ein „plan“: wie viele neue Karten die Routine schreiben soll (10 / 5 / 0).
Grund sind Pausen bei Inaktivität und ein Stau ungesehener Karten – damit sich nichts anhäuft, wenn Hendrik länger nicht da ist.
(Es stehen nur Tage und Zahlen drin, keine Zeitpunkte und keine Inhalte.)

Benötigt die Umgebungsvariable KNOWGRAM_SYNC_CODE (GitHub-Secret). Fehlt sie oder ist der Server nicht erreichbar,
bleibt taste.json unverändert und das Skript endet ohne Fehler.
"""
import json, os, re, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
URL = "https://apipudwplhilusdqyemx.supabase.co/rest/v1/rpc/kg_summary"
KEY = "sb_publishable_0QNoSsrwGFtS1BV2ZdkQUA_7-rfuwQI"        # öffentlicher Schlüssel (steht auch in config.js)
MIN_N = 3          # ab so vielen Bewertungen zählt ein Thema für ein Plus
PLUS_FAKTOR = 1.5  # Plus nur, wenn das Thema so viel öfter bewertet wurde wie der Durchschnitt
MIN_DOWNS = 3      # Minus nur ab so vielen Dislikes
MIN_DOWN_ANTEIL = 0.4
# Tempo-Plan: Pause bei Inaktivität bzw. zu viel Ungesehenem, damit sich nichts anstaut
VOLL = 10          # Karten pro Lauf im Normalfall
IDLE_HALB, IDLE_PAUSE = 5, 10          # Tage ohne Aktivität: ab 5 halbe Menge, ab 10 Pause
BACKLOG_HALB, BACKLOG_PAUSE = 40, 80   # ungesehene Karten: ab 40 halbe Menge, ab 80 Pause


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
    allt = set(up) | set(down) | set(half_up) | set(half_down)
    ns = {t: up.get(t, 0) + down.get(t, 0) + half_up.get(t, 0) + half_down.get(t, 0) for t in allt}
    mean_n = (sum(ns.values()) / len(ns)) if ns else 0
    topics = {}
    for t in allt:
        u = up.get(t, 0) + half_up.get(t, 0); d = down.get(t, 0) + half_down.get(t, 0)
        n = u + d
        dislike_share = d / n if n else 0
        nudge = 0
        if d >= MIN_DOWNS and dislike_share >= MIN_DOWN_ANTEIL:
            nudge = -1
        elif n >= max(MIN_N, PLUS_FAKTOR * mean_n) and dislike_share <= 0.1:
            nudge = 1
        topics[t] = {"n": round(n, 1), "downs": round(d, 1), "nudge": nudge}
    return {"topics": dict(sorted(topics.items())),
            "hinweis": "Nur ein leichter Stups (-1/0/+1), nie ein Ausschluss. Themen ohne Eintrag sind unbekannt und werden erkundet. Plus = deutlich öfter bewertet als der Durchschnitt und fast nur geliked; Minus = mindestens 3 Dislikes und mindestens 40 Prozent."}


def card_ids():
    try:
        txt = (ROOT / "cards.js").read_text(encoding="utf-8")
    except Exception:
        return set()
    return set(re.findall(r'\{\s*id:\s*"([a-z]+\d+)"', txt))


def plan(summary, now=None):
    """Wie viele neue Karten soll die Routine schreiben? Nur Zahlen, keine Inhalte."""
    now = now or datetime.now(timezone.utc)
    idle = None
    try:
        last = datetime.fromisoformat(str(summary.get("updated_at")).replace("Z", "+00:00"))
        idle = max(0, (now - last).days)
    except Exception:
        pass
    ids = card_ids()
    unseen = None
    if ids and isinstance(summary.get("seen"), list):
        unseen = len(ids - set(summary["seen"]))
    karten, gruende = VOLL, []
    if idle is not None:
        if idle >= IDLE_PAUSE: karten = 0; gruende.append(f"seit {idle} Tagen keine Aktivität")
        elif idle >= IDLE_HALB: karten = min(karten, VOLL // 2); gruende.append(f"seit {idle} Tagen wenig Aktivität")
    if unseen is not None:
        if unseen >= BACKLOG_PAUSE: karten = 0; gruende.append(f"{unseen} ungesehene Karten")
        elif unseen >= BACKLOG_HALB: karten = min(karten, VOLL // 2); gruende.append(f"{unseen} ungesehene Karten")
    return {"cards": karten, "idle_days": idle, "unseen_cards": unseen,
            "grund": ", ".join(gruende) if gruende else "normal"}


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
    out["plan"] = plan(summary)
    out["generated"] = datetime.now(timezone.utc).isoformat(timespec="minutes")
    (ROOT / "taste.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    pos = [t for t, v in out["topics"].items() if v["nudge"] > 0]; neg = [t for t, v in out["topics"].items() if v["nudge"] < 0]
    print(f"taste.json: {len(out['topics'])} Themen, Stups + bei {len(pos)}, − bei {len(neg)}; Plan: {out['plan']}")


if __name__ == "__main__":
    main()
