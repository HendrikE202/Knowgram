# Knowgram – Vision, Stand und Aufgaben

*Zuletzt aktualisiert: 29.09.2026 (Abend). Diese Datei ist die zentrale To-do-Liste (für Hendrik und für Claude-Sitzungen).*

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
- Feed als PWA (Reels-artig), 146 Wissenskarten in 28 Themen (inkl. Beruf/Studium, Archäologie, NFL), Themen-Chips, „✓ gesehen“/„NEU“
- Nachrichten: 13 Quellen per GitHub-Job alle 3 Std., Verfallsdatum je Quelle, Bild/Quelle/Alter sichtbar; „Am heutigen Tag“ (Wikipedia)
- **🌍 Heute in der Welt** (bis 10 Ereignisse, mehrere Quellen verglichen), **Serien + „Weiter im Thema“** (erste Serie: Dreißigjähriger Krieg)
- **Abendmodus** (Auto ab 23 Uhr, einstellbar) und **Schlaf-Timer** (20/40/60 Min., „Gute Nacht“)
- 👍/👎, ausgewogene Personalisierung, Themen-Check, Problem melden, Themenwünsche, Notizen (💬), lokales Profil mit Export/Import, automatisches Aufräumen alter Daten
- Bilder: Wissenskarten (Wikimedia Commons, frei lizenziert, mit Relevanzprüfung), Meldungen (ohne Logos/Werbung/Stockfotos), eigene Cover; „Bild passt nicht“ lernt pro Quelle
- Täglicher Karten-Lauf als Routine (10 Karten/Tag) – Auftrag in `tools/ANWEISUNG_NEUE_KARTEN.md`

# TO-DO-LISTE

## 1) Für dich (Hendrik) – kurz und konkret
- [ ] **Am Handy testen:** `https://hendrike202.github.io/Knowgram/` öffnen, zum Startbildschirm hinzufügen, Scrollgefühl/Abendmodus/Timer ausprobieren und melden, was stört
- [ ] **Routine „Neue Wissenskarten“ fertig einrichten** (claude.ai → Routinen): Repo `HendrikE202/Knowgram` zuweisen, Push auf `main` erlauben, Connectors abwählen, Namen ändern, einmal „Run now“ testen und prüfen, ob 10 Karten in `cards.js` landen
- [ ] **Fehlgeschlagene Bilder-Jobs:** Link oder Fehlertext aus der GitHub-Mail schicken (Actions → roter Eintrag); falls es nach den Änderungen wieder rot wird
- [ ] **Supabase-Projekt anlegen** (wenn du daheim bist, Region Frankfurt): nur Projekt-URL und **öffentlichen** Schlüssel schicken – niemals `service_role` oder Datenbank-Passwort
- [ ] **Alten Branch löschen:** Repo `Abschlussprojekt` → Branches → `claude/gracious-heisenberg-82qzi8` → Papierkorb (nichts geht verloren)
- [ ] **Stichproben gegenlesen:** ein paar neue Karten (KI-verfasst, nicht faktengeprüft) und die gefundenen Titelbilder ansehen; unpassende über „Problem melden“ markieren
- [ ] Repo `Knowgram` auf **privat** stellen, falls gewünscht (Settings → General → Danger Zone; Pages braucht dann ein bezahltes Konto oder einen anderen Dienst)

## 2) Entscheidungen von dir
- [ ] **Schlaf-Timer:** Soll er erst ab 23 Uhr aktiv werden (vorher frei scrollen), oder wie jetzt jederzeit?
- [ ] **Anmeldung:** nur lokal + Export / **Sync-Code** ohne E-Mail (mein Vorschlag) / E-Mail-Login
- [ ] **Weltlage:** Zeitpunkt (morgens/abends) und ob eine **Abend-Zusammenfassung** („Das war heute wichtig“) gewünscht ist
- [ ] **Illustrationen:** einfache SVG-Grafiken von Claude oder externer Bild-Dienst (Kosten)?

## 3) Für Claude – nach Priorität
### Bald (Kern der Vision)
- [ ] **Supabase-Anbindung** (sobald URL + Schlüssel da sind): Tabellen mit Row Level Security, lokal-zuerst + Sync, Migration des lokalen Profils, Aufbewahrungsregeln serverseitig, täglicher Ping gegen Pausierung, Lesezugriff der Routine auf Geschmack/Notizen/Wünsche/Meldungen (eingeschränkter Schlüssel als Routine-Geheimnis)
- [ ] **Einordnungskarte „Warum ist das wichtig?“** zu den Top-Meldungen (KI-Einordnung, gekennzeichnet, mit Quellenlinks; Routine oder API)
- [ ] **Gezielte Verknüpfungen:** Routine schreibt `more`-Verweise und regelmäßig neue Serien (Anweisung steht), Ergebnisse prüfen
- [ ] **Vom Ereignis zum Hintergrund:** Meldung → verlinkte Hintergrundkarte („Wie kam es dazu?“)
- [ ] **Qualität von „Heute in der Welt“** an echten Tagen beobachten und nachschärfen
- [ ] **Bilder-Backfill** kontrollieren (täglich 40 Karten, 04:37 UTC), schwache Treffer über `tools/image_overrides.json` korrigieren

### Danach
- [ ] Abend-Zusammenfassung als letzte Karte des Tages; Wochenrückblick
- [ ] „Weiterlesen morgen“: Karte für später vormerken; „Zufälliges Kaninchenloch“-Knopf
- [ ] Eigene Illustrationen/Animationen (Serien-Auftakt, Top-Themen); sanfte Übergänge, Ladezustände, „Neue Meldungen“-Hinweis
- [ ] Hinweis „Entwicklung läuft“ bei sich schnell ändernden Nachrichten
- [ ] Mehr Quellen/Perspektiven (Wirtschaft, Wissenschaft, Fachmedien); Hessen nur bei wirklich Spannendem
- [ ] Inhaltsqualität: Zweitprüfung gemeldeter Karten durch die Routine, konkrete Quelle (Link) je Karte, Karten mit älterem „Stand“ zur Überprüfung vormerken, ausgewogene Darstellung bei Politik (Fakt vs. Einschätzung)

### Technik und Betrieb
- [ ] Auf echtem Handy (iOS/Android) prüfen: Scrollgefühl, Installation, Offline
- [ ] Automatische Tests (Konsole, Feed, Filter, Abendmodus) ins Repo übernehmen
- [ ] `cards.js` → JSON, sobald >500 Karten
- [ ] GitHub-Actions-Versionen aktualisieren (Node-20-Warnung); geplante Jobs können nach 60 Tagen ohne Aktivität pausieren → im Blick behalten
- [ ] Datenschutz/Impressum, falls die App öffentlich wird (dann Meldungs-Bilder nur noch aus Commons + eigene Cover)

## Ideen-Speicher (ungeordnet)
- Themenpfade wie „Von Gutenberg bis zum Internet“ (Serie über mehrere Themen)
- „Was wäre wenn?“- und „Missverständnis der Woche“-Formate
- Karte des Tages mit kurzer Audio-Version (später)
- Geteilte Sammlungen mit Freunden (nur bei Öffentlichmachung)
- Kartenherkunft sichtbar: „von Hand“ / „Routine“ / „News“ / „Wikipedia“
