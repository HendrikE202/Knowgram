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
Hendrik will Tiefe statt Kurzinfo („ich will was erfahren, nicht nur das Cover anschauen“), aber **keinen Roman**. Eine Karte besteht aus: Übersicht (`text`) → „Das Wichtigste“ (`points`, genau 3) → **weitere Inhalts-Slides** (`slides`: immer mindestens 2, bis zu 5 – so viele, wie der Stoff braucht, nie zum Auffüllen) → „Tiefer eintauchen“. **Höchstens 6 Inhalts-Slides zwischen Übersicht und Quellen** („Das Wichtigste“ zählt mit, Übersicht vorn und „Tiefer eintauchen“ hinten nicht). Reicher Stoff (Ereignisse, Verfahren, Zusammenhänge) bekommt 4–5, schlanker Stoff 2–3.
- Zusatz-Slide: `{ h: "🧩 Überschrift", text | points | steps | big:{n,l}, [img], [note] }`. Text ≤ 650 Zeichen, `points` 1–5, `steps` 2–7. `note` überschreibt die Fußzeile. **`img`** (optional): Suchbegriffe für ein passendes Wikimedia-Commons-Bild (2–3 kurze, konkrete Begriffe, Thema zuerst, z. B. `"Blue whale"` oder `"GPS satellite"`; lange Suchtexte finden nichts); die Bilder-Aktion löst sie in `images.json` auf (Schlüssel `<kartenid>#<slideindex>`), inkl. Urheberangabe. Nur setzen, wenn ein Bild die Aussage des Slides wirklich veranschaulicht (Diagramm, Ort, Objekt, Person) und **nicht das Titelbild der Karte wiederholt**. Kein Bild gefunden = kein Bild, nie ein Lückenfüller.
- **Abwechslung ist Pflicht:** Formate mischen (Fließtext, Stichpunkte, nummerierte Schritte/Zeitleiste, große Zahl), Überschriften und Anzahl variieren, Themen-typische Slides (Rechnung, Ablauf, Missverständnis, Beispiel, Zahlen, Kritik, Heute). Nie alle Karten im gleichen Muster.
- **Meldungen** (`summaries.json`, wichtigste 20 aus `news.json` → `ranked`): 3–5 Stichpunkte, `why`, plus mindestens 2 Zusatz-Slides („🧩 Hintergrund“ und „❓ Was noch unklar ist“ / „🔎 Was man nachschauen sollte“, ggf. ein dritter). Ohne Artikelzugriff (Sandbox/Routine sind oft gesperrt) nur allgemeines Hintergrundwissen mit `note: "🧩 Allgemeines Hintergrundwissen (KI), nicht aus dem Artikel · ohne Gewähr"` – nichts über den Artikel erfinden, Unbekanntes als „Was offen ist“ benennen.
- **Vor jedem Push:** `python3 tools/check_cards.py --new 10` muss ohne Fehler laufen (Format, Länge, Abwechslung der neuen Charge, Einordnungen der Top-Meldungen). Danach die Browser-Tests.
- **„Heute vor … Jahren“** (`onthisday.json`) wird wie eine Meldung behandelt: Einordnung mit Stichpunkten und mindestens 2 Zusatz-Slides in `summaries.json`.
- **Notizen des Nutzers (`notes`) sind Aufträge** („zu oberflächlich“, „mehr Details“): umsetzen, nicht nur lesen. Beim Umsetzen gilt der Standard oben; der Nutzer will Tiefe für Fortgeschrittene, keine Einsteiger-Kurzinfos.
- **Vor dem Schreiben oder Überarbeiten von Karten immer `tools/NUTZERWUENSCHE.md` lesen** (Zielniveau, Folgefragen, Checkliste). Kommentare des Nutzers gelten für alle ähnlichen Karten, nicht nur die kommentierte; neue Wünsche dort ergänzen.
