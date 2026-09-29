# Knowgram – Vision, Stand und Aufgaben

*Zuletzt aktualisiert: 30.09.2026. Diese Datei ist die zentrale To-do-Liste (für Hendrik und für Claude-Sitzungen).*

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
- [x] **„Weiter im Thema“:** Tipp fügt bis zu 5 verwandte Karten direkt darunter ein (Serien-Teile, `more`-Verweise, sonst konservativ im selben Thema). **Offen:** die Routine soll gezielte `more`-Verweise schreiben, weil reine Wortähnlichkeit bei kleinem Bestand nur grob taugt
- [x] **Kartenserien:** „Teil n/N“, schalten sich der Reihe nach frei; erste Serie „Der Dreißigjährige Krieg“ (5 Teile) live. **Offen:** Routine schreibt regelmäßig neue Serien (Anweisung ist ergänzt)
- [ ] **Vom Ereignis zum Hintergrund:** Meldung → verlinkte Hintergrundkarte („Wie kam es dazu?“, „Was steckt dahinter?“)
- [ ] „Zufälliges Kaninchenloch“-Knopf: springt in ein selten gesehenes Thema

### B) Auf dem Laufenden bleiben (Weltgeschehen)
- [x] **„Heute in der Welt“:** bis zu 10 Ereignisse, automatisch nach Berichterstattung mehrerer Quellen + Frische + harten Signalen gewählt (weiche Themen ausgeschlossen), als Startblock einmal pro Tag und über den Chip „🌍 Heute“; „🔀 Auch bei: …“ zeigt die anderen Quellen. **Offen:** Qualität an echten Tagen beobachten (Gewichtung nachschärfen)
- [ ] **Einordnungskarte „Warum ist das wichtig?“** zu den Top-Meldungen (durch die Routine erzeugt, als „KI-Einordnung“ gekennzeichnet, mit Link zu den Originalquellen)
- [ ] Abend-Zusammenfassung („Das war heute wichtig“) als letzte Karte des Tages; Wochenrückblick
- [ ] Mehr Quellen/Perspektiven prüfen (z. B. weitere Fachmedien, Wirtschaft, Wissenschaft); Hessen nur bei wirklich Spannendem
- [ ] Hinweis „Entwicklung läuft“ bei Nachrichten, die sich schnell ändern

### C) Abend-/Bett-Modus
- [x] Abendmodus: wärmerer, gedimmter Farbton (Auto 20–6 Uhr / An / Aus, Mond oben), Schrift optional groß
- [x] Optionaler **Schlaf-Timer** (20/40/60 Min., danach „Gute Nacht“, +10 Min. per Tipp oder ausschalten)
- [ ] „Weiterlesen morgen“: Karte für später vormerken

### D) Sichtbar und lebendig (Kurzgesagt-Gefühl)
- [x] Bildqualität: Wissenskarten nur mit passendem Artikel/relevanter Dateisuche, ohne Logos/Wappen/Flaggen, Mindestgröße; Meldungen ohne Logos/Zählpixel/Werbung/Stockfotos/Duplikate; „Bild passt nicht“ lernt pro Quelle (3× → Bilder dieser Quelle aus). **Offen:** gefundene Bilder stichprobenartig prüfen; Handkorrektur über `tools/image_overrides.json`
- [ ] Eigene Illustrationen/Animationen (einfache SVGs) für Serien-Auftakt und Top-Themen
- [ ] Sanfte Übergänge, Ladezustände, „Neue Meldungen“-Hinweis

### E) Konto und Sync (Supabase)
- [ ] Hendrik legt Supabase-Projekt an (Region Frankfurt), schickt **nur** URL + öffentlichen Schlüssel
- [ ] Login (E-Mail/Passwort), Tabellen mit Row Level Security, lokal-zuerst + Sync im Hintergrund, Migration des lokalen Profils
- [ ] Aufbewahrungsregeln serverseitig (News-Bewertungen >30 Tage verdichten, „gesehen“ >120 Tage löschen, Notizen zu abgelaufenen Meldungen >90 Tage)
- [ ] Täglicher Ping gegen die Pausierung kostenloser Projekte
- [ ] Routine liest Geschmack, Notizen, Themenwünsche und Meldungen (eingeschränkter Lese-Schlüssel als geheimer Wert der Routine, nicht im Repo)

### F) Inhaltsqualität
- [ ] Einordnungskarte „Warum ist das wichtig?“ zu den Top-Meldungen (KI-Einordnung mit Quellenlinks) – braucht Routine oder API
- [ ] Zweiter Prüfdurchlauf der Routine: gemeldete Karten prüfen/korrigieren/entfernen
- [ ] Jede Karte mit konkreter Quelle (Link) statt nur Suchbegriff
- [ ] Karten mit Zeitbezug automatisch zur Überprüfung vormerken („Stand“ älter als 12 Monate)
- [ ] Ausgewogenheit bei Politik/Weltgeschehen (mehrere Sichtweisen, klare Trennung Fakt/Einschätzung)

### G) Technik und Betrieb
- [ ] Auf echtem Handy testen (iOS/Android): Scrollgefühl, Installation, Offline
- [ ] `cards.js` → JSON, sobald >500 Karten; einfache automatische Tests (Konsole, Feed, Filter)
- [ ] GitHub-Actions-Versionen aktualisieren (Node-20-Warnung); geplante Jobs können nach 60 Tagen Inaktivität pausieren → im Blick behalten
- [ ] Bilder-Backfill: läuft täglich mit 40 Karten/Lauf (erster Durchgang: 23 von 40 mit Bild, Treffer inhaltlich passend); Ergebnis stichprobenartig kontrollieren
- [ ] Datenschutz/Impressum, falls die App öffentlich wird (Rechte an Meldungs-Bildern beachten: dann nur Commons-Bilder + eigene Cover)

## Aufgaben für Hendrik
- [ ] App am Handy öffnen (`https://hendrike202.github.io/Knowgram/`), zum Startbildschirm hinzufügen, Eindruck melden
- [ ] Routine „Neue Wissenskarten“ (claude.ai → Routinen): Repo `HendrikE202/Knowgram` zuweisen, Push auf `main` erlauben, Connectors abwählen, einmal „Run now“ testen; Name ändern
- [ ] Supabase-Projekt anlegen (siehe E)
- [ ] Alten Branch `claude/gracious-heisenberg-82qzi8` im Repo `Abschlussprojekt` auf GitHub löschen (Branches → Papierkorb)
- [ ] Ein paar neue Karten stichprobenartig gegenlesen (KI-verfasst, nicht faktengeprüft)

## Offene Entscheidungen
- Konto: E-Mail+Passwort oder Link per E-Mail?
- ~~Weltlage-Umfang~~ → entschieden: 10 Karten. ~~Schlaf-Timer~~ → entschieden: Abendmodus + Timer.
- Konto: Ist ein Login überhaupt nötig? Alternativen für eine Einzelperson: (1) nur lokal + Export, (2) Sync-Code ohne E-Mail, (3) E-Mail-Login. Login war als Grundlage für Sync zwischen Geräten und für das Lesen deines Geschmacks durch die Routine gedacht.
- Weltlage: Zeitpunkt (morgens/abends) und ob eine Abend-Zusammenfassung gewünscht ist
- Illustrationen: einfache SVG-Grafiken von Claude oder externer Bild-Dienst (Kosten)?

## Ideen-Speicher (ungeordnet)
- Themenpfade wie „Von Gutenberg bis zum Internet“ (Serie über mehrere Themen)
- „Was wäre wenn?“- und „Missverständnis der Woche“-Formate
- Karte des Tages mit kurzer Audio-Version (später)
- Geteilte Sammlungen mit Freunden (nur bei Öffentlichmachung)
- Kartenherkunft sichtbar: „von Hand“ / „Routine“ / „News“ / „Wikipedia“
