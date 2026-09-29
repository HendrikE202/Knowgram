# Knowgram

Doomscrollen, aber mit Wissen: ein Instagram/Reels-artiger Feed mit kurzen deutschen Wissenskarten
(Geschichte, Physik, Kosmologie, Philosophie, Kunst, IT, Politik, Technik, Medizin, Biologie, Zoologie).

## Starten
```
cd Knowgram
npx http-server -p 8080     # oder: python3 -m http.server 8080
```
Dann `http://localhost:8080` öffnen (am Handy im selben WLAN über die IP des Rechners; für die
Installation als PWA später per HTTPS hosten).

## Bedienung
- Hoch/runter wischen = nächste Karte, Doppeltipp = Herz, 🔖 speichern, ↗ teilen
- „Tiefer eintauchen": Wikipedia, Websuche oder fertiger Prompt für Claude
- Themen-Chips oben filtern den Feed

## Aufbau
- `cards.js` – Themen und Karten (`id, topic, title, text, q`)
- `app.js` – Feed, Endlos-Nachladen, Likes/Speichern (localStorage)
- `sw.js`, `manifest.webmanifest` – PWA/Offline

## Aktuelle Nachrichten
- `feeds.json` listet die Quellen (siehe `SOURCES.md`), `tools/fetch_news.py` schreibt `news.json`.
- Der Job `.github/workflows/news.yml` läuft alle 3 Stunden auf GitHub und committet neue Meldungen. Manuell starten: Actions → „News aktualisieren" → Run workflow.
- Lokal testen: `python3 tools/fetch_news.py` (braucht Internet).
- Kaputte Feeds erscheinen in den Actions-Logs als `WARN` und werden übersprungen; URLs dann in `feeds.json` korrigieren.
- Zusätzlich holt `tools/fetch_onthisday.py` täglich „Am heutigen Tag“-Karten aus der Wikipedia (`onthisday.json`).
- Ungesehene Karten kommen im Feed zuerst und tragen das Label „NEU“.

## Bilder
- **Wissenskarten:** `tools/fetch_images.py` (GitHub-Job `images.yml`, montags und bei neuen Karten) sucht je Karte ein Bild bei Wikimedia Commons und schreibt Adresse + Urheberangabe nach `images.json`. Nur freie Lizenzen (CC0, CC BY, CC BY-SA, gemeinfrei); keine Bildkopien im Repo. Die Angabe „Autor · Lizenz“ steht auf der Karte und verlinkt zur Quelle. Passt ein Bild nicht: „Problem melden → Nur das Bild passt nicht“.
- **Meldungen:** Das Vorschaubild aus dem Feed wird verlinkt (nicht kopiert) und mit „Bild: Quelle“ gekennzeichnet. Für den privaten Gebrauch gedacht; bei einer öffentlichen Version nur Commons-Bilder und eigene Cover verwenden.
- **Eigene Cover:** Jede Karte hat ein automatisch erzeugtes Cover in der Themenfarbe (Rückfall, falls kein Foto passt).

## Rabbit Holes, Weltlage, Abend
- **Serien:** Karten mit `series/part/of` erscheinen der Reihe nach („Teil 2/5“ erst nach Teil 1). **🕳️ Weiter im Thema** bzw. **Nächster Teil →** fügt verwandte Karten direkt darunter ein (auch verschachtelt). `more: ["id"]` in einer Karte setzt gezielte Verweise.
- **🌍 Heute in der Welt:** `tools/fetch_news.py` gruppiert gleiche Ereignisse quellenübergreifend (`also`), wählt bis zu 10 (`briefing` in `news.json`); die App zeigt sie einmal pro Tag vorn und über den Chip „🌍 Heute“.
- **Bildfilter (Meldungen):** Logos, Zählpixel, Werbung, Stockfotos und mehrfach verwendete Bilder werden verworfen.
- **Abendmodus** (Mond oben, Auto 20–6 Uhr), **Schlaf-Timer** und größere Schrift: Profil → „Abend & Schlaf“.

## Feed sauber halten
- Meldungen haben ein Verfallsdatum je Quelle (`ttl_days` in `feeds.json`, z. B. Nachrichten 2–4 Tage, Wissenschaft 14) und verschwinden dann aus `news.json` und dem Feed. Schon gesehene Meldungen kommen nicht wieder.
- Schon gesehene Karten tragen „✓ gesehen“ und kommen erst nach und nach wieder (Abklingzeit ~7 Tage). Karten mit 👎 oder Meldung kommen nicht wieder.
- Aufräumen beim Start: Bewertungen alter Meldungen (>30 Tage) werden zu einem Themen-Zähler verdichtet und einzeln gelöscht; alte „gesehen“-Zeitstempel (>120 Tage) und Notizen zu längst abgelaufenen Meldungen (>90 Tage) fallen weg.
- 💬 Notiz pro Karte (frei formuliert, max. 500 Zeichen). Notizen ändern den Feed nicht automatisch, sie stehen im Profil und im Export.

## Geschmack & Profil
- Jede Karte: 👍 mehr davon / 👎 weniger davon (Doppeltipp = 👍). 👎-Karten kommen nicht wieder.
- Der Feed gewichtet Themen nach Bewertungen, „Tiefer eintauchen“ und Lieblingsthemen; ca. jede 5. Karte ist bewusst eine Überraschung.
- **Bewusst ausgewogen:** Die Gewichte sind auf 0,35× bis 2× begrenzt, ein Thema verschwindet nie. Bewertungen zählen relativ zur Häufigkeit, bei wenig Daten kaum, fehlende 👍 sind kein Minus, ein 👎 senkt vor allem die eine Karte (Thema nur leicht), alte Bewertungen klingen ab (Halbwertszeit 45 Tage), nie 3 gleiche Themen hintereinander, ca. jede 4. Karte ist ein Entdecker-Tipp. Stärke einstellbar im Profil (Aus/Sanft/Mittel/Stark).
- **Feedback (getrennt vom Geschmack):** (1) Themen-Check: höchstens 1× pro ~20 Std. eine neutrale Frage („Öfter / Wie bisher / Seltener“, Antwortreihenfolge zufällig) zu Themen mit wenig Rückmeldung, nicht zu den Lieblingen; wirkt nur schwach und klingt ab. (2) „Problem melden“ im Vertiefen-Menü (falsch/veraltet, einseitig, sonstiges): blendet die Karte aus und ändert dein Themen-Profil nicht. (3) Themenwünsche im Profil, ohne Wertung. Alles steht im Export.
- Tab „Profil“: Lieblingsthemen wählen, Geschmacks-Übersicht, Export/Import als Text. Das Profil liegt nur lokal im Browser (kein echter Account, kein Sync).

## Online stellen (GitHub Pages)
Settings → Pages → „Deploy from a branch" → `main` / `/ (root)`. Danach die Adresse am Handy öffnen und „Zum Startbildschirm hinzufügen".

## Roadmap
1. ✅ Feed-Prototyp mit Wissenskarten
2. ✅ News-Pipeline (RSS → `news.json`), Quelle/Alter pro Karte
3. Regelmäßig neue Wissenskarten (automatisch)
4. Bilder/Animationen, Kartenserien
5. Vertiefung mit Recherche und Folgefragen direkt in der App
6. Personalisierung (Likes/Verweildauer → Themengewichte)
