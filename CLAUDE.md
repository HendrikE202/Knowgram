# Knowgram – Projektregeln

Persönliche Instagram/Reels-artige Lern-App (PWA), Doomscrollen mit Wissen. Nutzer liest auf Deutsch.

- **Kein Build-Schritt**: reines HTML/CSS/JS, läuft mit `python3 -m http.server`. Keine Abhängigkeiten im Frontend.
- **Karten** (`cards.js`): Felder `id, topic, title, q, points, slides, text` (+ optional `series/part/of/more/why`). Ein Gedanke pro Karte, ca. 40–60 Wörter, deutscher Text, Hook im Titel. IDs eindeutig. Nur belegbare Fakten; Unsicherheit im Text benennen.
- **News** (`tools/fetch_news.py` → `news.json`): nur Titel + Teaser des Anbieters + Link, nie Volltexte. Läuft per GitHub Action (`.github/workflows/news.yml`). `news.json` nicht von Hand ändern.
- **Sicherheit**: Nutzer-/Feed-Text nur per `textContent`, Links nur `http(s)`. Nie Keys/Passwörter ins Repo.
- Vor Commits testen: Feed im Headless-Browser laden (keine Konsolenfehler, Endlos-Nachladen, Filter, Speichern).

## Produktvision (Kurzfassung, Details in ROADMAP.md)
Hendrik will abends im Bett in **Rabbit Holes** scrollen, nebenbei lernen und **über das Weltgeschehen auf dem Laufenden** bleiben. Stöbern statt Lernen: keine Tests. Karten sollen Lust auf den nächsten Schritt machen (Serien, „Weiter im Thema“), Quelle und Datum sind immer sichtbar, Falsches/Veraltetes wird entfernt, Personalisierung bleibt ausgewogen (nie Blase). Neue Aufgaben und Entscheidungen immer in `ROADMAP.md` festhalten und erledigte Punkte dort abhaken.

## Qualitätsstandard für JEDE Karte (verbindlich, nicht neu diskutieren)
Hendrik will Tiefe statt Kurzinfo. Eine Karte besteht aus: Übersicht (`text`) → „Das Wichtigste“ (`points`, genau 3) → **2–3 Zusatz-Slides** (`slides`, immer mindestens 2, nie schematisch; 3, wenn der Stoff es hergibt) → „Tiefer eintauchen“. **Höchstens 6 Seiten je Karte** (die App schneidet Überschüssiges ab).
- Zusatz-Slide: `{ h: "🧩 Überschrift", text | points | steps | big:{n,l} }`, optional `note` (überschreibt die Fußzeile). Text ≤ 650 Zeichen, `points` 1–5, `steps` 2–7.
- **Abwechslung ist Pflicht:** Formate mischen (Fließtext, Stichpunkte, nummerierte Schritte/Zeitleiste, große Zahl), Überschriften und Anzahl variieren, Themen-typische Slides (Rechnung, Ablauf, Missverständnis, Beispiel, Zahlen, Kritik, Heute). Nie alle Karten im gleichen Muster.
- **Meldungen** (`summaries.json`, wichtigste 20 aus `news.json` → `ranked`): 3–5 Stichpunkte, `why`, plus mindestens 2 Zusatz-Slides („🧩 Hintergrund“ und „❓ Was noch unklar ist“ / „🔎 Was man nachschauen sollte“, ggf. ein dritter). Ohne Artikelzugriff (Sandbox/Routine sind oft gesperrt) nur allgemeines Hintergrundwissen mit `note: "🧩 Allgemeines Hintergrundwissen (KI), nicht aus dem Artikel · ohne Gewähr"` – nichts über den Artikel erfinden, Unbekanntes als „Was offen ist“ benennen.
- **Vor jedem Push:** `python3 tools/check_cards.py --new 10` muss ohne Fehler laufen (Format, Länge, Abwechslung der neuen Charge, Einordnungen der Top-Meldungen). Danach die Browser-Tests.
