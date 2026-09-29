# Knowgram – Vision, Stand und Aufgaben

*Zuletzt aktualisiert: 29.09.2026. Diese Datei ist die zentrale To-do-Liste (für Hendrik und für Claude-Sitzungen).*

## Vision
**Abends im Bett in Rabbit Holes fallen** – endlos scrollen, dabei etwas lernen, informativ bleiben und **auf dem Laufenden über das Weltgeschehen** sein. Kein Schul-Gefühl: keine Tests, kein Punktedruck. Neugier statt Pflicht.

### Leitprinzipien
1. **Stöbern statt Lernen:** kurze Karten, neugierig machender Aufhänger, nie abfragen.
2. **Ein Faden führt zum nächsten:** jede Karte soll Lust auf „und dann?“ machen (Rabbit Hole).
3. **Richtig und aktuell:** nichts Falsches, nichts Veraltetes – Quelle und Datum sichtbar, Meldungen verfallen, Meldungen von Fehlern werden ernst genommen.
4. **Ausgewogen:** Personalisierung darf nie zur Blase werden (Gewichte begrenzt, Entdecker-Karten, Themen-Check, 👎 trifft nur die Karte).
5. **Privat, sparsam, sauber:** keine toten Daten (Verfall + Aufräumen), keine Schlüssel im Repo.
6. **Ehrlich:** KI-verfasste Inhalte sind gekennzeichnet; Fakten werden nicht automatisch geprüft.

## Erledigt (Stand jetzt)
- Feed als PWA (Reels-artig), 142 Wissenskarten in 28 Themen (inkl. Beruf/Studium, Archäologie, NFL), Themen-Chips
- Nachrichten: 13 Quellen per GitHub-Job alle 3 Std., Verfallsdatum je Quelle, Bild/Quelle/Alter sichtbar; „Am heutigen Tag“ (Wikipedia)
- 👍/👎, ausgewogene Personalisierung, Themen-Check, Problem melden, Themenwünsche, Notizen (💬), lokales Profil mit Export/Import
- Titelbilder (Wikimedia Commons, freie Lizenz) + eigene Cover; „✓ gesehen“; Aufräumen alter Daten
- Täglicher Karten-Lauf als Routine (10 Karten/Tag) – Auftrag in `tools/ANWEISUNG_NEUE_KARTEN.md`

## Als Nächstes (nach Priorität)

### A) Rabbit Holes – der Kern der Vision
- [ ] **„Weiter im Thema“:** jede Karte verweist auf 2–3 verwandte Karten; Tipp darauf startet einen kurzen Faden (5–8 Karten), danach zurück in den Feed
- [ ] **Kartenserien:** zusammengehörige Karten mit „Teil 2/6“ und Cliffhanger-Frage am Ende („Und was passierte danach?“); die Routine schreibt ganze Serien statt Einzelkarten
- [ ] **Vom Ereignis zum Hintergrund:** Meldung → verlinkte Hintergrundkarte („Wie kam es dazu?“, „Was steckt dahinter?“)
- [ ] „Zufälliges Kaninchenloch“-Knopf: springt in ein selten gesehenes Thema

### B) Auf dem Laufenden bleiben (Weltgeschehen)
- [ ] **„Heute in der Welt“:** täglich die 5 wichtigsten Ereignisse (aus Tagesschau/DLF/DW/hessenschau) als kompakte Startkarten – jeweils mit Quelle, Uhrzeit und, wo sinnvoll, **mehreren Quellen zum Vergleich**
- [ ] **Einordnungskarte „Warum ist das wichtig?“** zu den Top-Meldungen (durch die Routine erzeugt, als „KI-Einordnung“ gekennzeichnet, mit Link zu den Originalquellen)
- [ ] Abend-Zusammenfassung („Das war heute wichtig“) als letzte Karte des Tages; Wochenrückblick
- [ ] Mehr Quellen/Perspektiven prüfen (z. B. weitere Fachmedien, Wirtschaft, Wissenschaft); Hessen nur bei wirklich Spannendem
- [ ] Hinweis „Entwicklung läuft“ bei Nachrichten, die sich schnell ändern

### C) Abend-/Bett-Modus
- [ ] Abenddunkel: wärmerer Farbton, gedimmt, größere Schrift optional, keine grellen Flächen
- [ ] Optionaler sanfter **Schlaf-Timer** (z. B. nach 20/40 Min. „Gute Nacht – genug für heute“), damit der Feed nicht ungewollt bis 3 Uhr läuft
- [ ] „Weiterlesen morgen“: Karte für später vormerken

### D) Sichtbar und lebendig (Kurzgesagt-Gefühl)
- [ ] Gefundene Titelbilder prüfen (passt Bild zur Karte?), schwache aussortieren
- [ ] Eigene Illustrationen/Animationen (einfache SVGs) für Serien-Auftakt und Top-Themen
- [ ] Sanfte Übergänge, Ladezustände, „Neue Meldungen“-Hinweis

### E) Konto und Sync (Supabase)
- [ ] Hendrik legt Supabase-Projekt an (Region Frankfurt), schickt **nur** URL + öffentlichen Schlüssel
- [ ] Login (E-Mail/Passwort), Tabellen mit Row Level Security, lokal-zuerst + Sync im Hintergrund, Migration des lokalen Profils
- [ ] Aufbewahrungsregeln serverseitig (News-Bewertungen >30 Tage verdichten, „gesehen“ >120 Tage löschen, Notizen zu abgelaufenen Meldungen >90 Tage)
- [ ] Täglicher Ping gegen die Pausierung kostenloser Projekte
- [ ] Routine liest Geschmack, Notizen, Themenwünsche und Meldungen (eingeschränkter Lese-Schlüssel als geheimer Wert der Routine, nicht im Repo)

### F) Inhaltsqualität
- [ ] Zweiter Prüfdurchlauf der Routine: gemeldete Karten prüfen/korrigieren/entfernen
- [ ] Jede Karte mit konkreter Quelle (Link) statt nur Suchbegriff
- [ ] Karten mit Zeitbezug automatisch zur Überprüfung vormerken („Stand“ älter als 12 Monate)
- [ ] Ausgewogenheit bei Politik/Weltgeschehen (mehrere Sichtweisen, klare Trennung Fakt/Einschätzung)

### G) Technik und Betrieb
- [ ] Auf echtem Handy testen (iOS/Android): Scrollgefühl, Installation, Offline
- [ ] `cards.js` → JSON, sobald >500 Karten; einfache automatische Tests (Konsole, Feed, Filter)
- [ ] GitHub-Actions-Versionen aktualisieren (Node-20-Warnung); geplante Jobs können nach 60 Tagen Inaktivität pausieren → im Blick behalten
- [ ] Bilder-Backfill: läuft täglich mit 40 Karten/Lauf; Ergebnis kontrollieren
- [ ] Datenschutz/Impressum, falls die App öffentlich wird (Rechte an Meldungs-Bildern beachten: dann nur Commons-Bilder + eigene Cover)

## Aufgaben für Hendrik
- [ ] App am Handy öffnen (`https://hendrike202.github.io/Knowgram/`), zum Startbildschirm hinzufügen, Eindruck melden
- [ ] Routine „Neue Wissenskarten“ (claude.ai → Routinen): Repo `HendrikE202/Knowgram` zuweisen, Push auf `main` erlauben, Connectors abwählen, einmal „Run now“ testen; Name ändern
- [ ] Supabase-Projekt anlegen (siehe E)
- [ ] Alten Branch `claude/gracious-heisenberg-82qzi8` im Repo `Abschlussprojekt` auf GitHub löschen (Branches → Papierkorb)
- [ ] Ein paar neue Karten stichprobenartig gegenlesen (KI-verfasst, nicht faktengeprüft)

## Offene Entscheidungen
- Konto: E-Mail+Passwort oder Link per E-Mail?
- Wie viel „Weltlage“ am Tag ist genug (5 Karten? 10)? Zeitpunkt (morgens/abends)?
- Schlaf-Timer: gewünscht oder nur Abendmodus?
- Illustrationen: einfache SVG-Grafiken von Claude oder externer Bild-Dienst (Kosten)?

## Ideen-Speicher (ungeordnet)
- Themenpfade wie „Von Gutenberg bis zum Internet“ (Serie über mehrere Themen)
- „Was wäre wenn?“- und „Missverständnis der Woche“-Formate
- Karte des Tages mit kurzer Audio-Version (später)
- Geteilte Sammlungen mit Freunden (nur bei Öffentlichmachung)
- Kartenherkunft sichtbar: „von Hand“ / „Routine“ / „News“ / „Wikipedia“
