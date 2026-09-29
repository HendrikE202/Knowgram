# Knowgram – Projektregeln

Persönliche Instagram/Reels-artige Lern-App (PWA), Doomscrollen mit Wissen. Nutzer liest auf Deutsch.

- **Kein Build-Schritt**: reines HTML/CSS/JS, läuft mit `python3 -m http.server`. Keine Abhängigkeiten im Frontend.
- **Karten** (`cards.js`): Felder `id, topic, title, text, q`. Ein Gedanke pro Karte, ca. 40–60 Wörter, deutscher Text, Hook im Titel. IDs eindeutig (Kürzel + Nummer). Nur belegbare Fakten; Unsicherheit im Text benennen.
- **News** (`tools/fetch_news.py` → `news.json`): nur Titel + Teaser des Anbieters + Link, nie Volltexte. Läuft per GitHub Action (`.github/workflows/news.yml`). `news.json` nicht von Hand ändern.
- **Sicherheit**: Nutzer-/Feed-Text nur per `textContent`, Links nur `http(s)`. Nie Keys/Passwörter ins Repo.
- Vor Commits testen: Feed im Headless-Browser laden (keine Konsolenfehler, Endlos-Nachladen, Filter, Speichern).

## Produktvision (Kurzfassung, Details in ROADMAP.md)
Hendrik will abends im Bett in **Rabbit Holes** scrollen, nebenbei lernen und **über das Weltgeschehen auf dem Laufenden** bleiben. Stöbern statt Lernen: keine Tests. Karten sollen Lust auf den nächsten Schritt machen (Serien, „Weiter im Thema“), Quelle und Datum sind immer sichtbar, Falsches/Veraltetes wird entfernt, Personalisierung bleibt ausgewogen (nie Blase). Neue Aufgaben und Entscheidungen immer in `ROADMAP.md` festhalten und erledigte Punkte dort abhaken.
