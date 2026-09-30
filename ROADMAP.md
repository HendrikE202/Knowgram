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
- **Karussell (Wischen nach links):** Karte → ✨ Das Wichtigste (3 Stichpunkte, für alle 146 Karten) → 🔎 Tiefer eintauchen; weiße Punkte zeigen die Seite; externe Links nur auf der letzten Seite
- Feed als PWA (Reels-artig), 146 Wissenskarten in 28 Themen (inkl. Beruf/Studium, Archäologie, NFL), Themen-Chips, „✓ gesehen“/„NEU“
- Nachrichten: 13 Quellen per GitHub-Job alle 3 Std., Verfallsdatum je Quelle, Bild/Quelle/Alter sichtbar; „Am heutigen Tag“ (Wikipedia)
- **🌍 Heute in der Welt** (bis 10 Ereignisse, mehrere Quellen verglichen), **Serien + „Weiter im Thema“** (erste Serie: Dreißigjähriger Krieg)
- **Abendmodus** (Auto ab 23 Uhr, einstellbar) und **Schlaf-Timer** (20/40/60 Min., „Gute Nacht“)
- 👍/👎, ausgewogene Personalisierung, Themen-Check, Problem melden, Themenwünsche, Notizen (💬), lokales Profil mit Export/Import, automatisches Aufräumen alter Daten
- Bilder: Wissenskarten (Wikimedia Commons, frei lizenziert, mit Relevanzprüfung), Meldungen (ohne Logos/Werbung/Stockfotos), eigene Cover; „Bild passt nicht“ lernt pro Quelle
- Täglicher Karten-Lauf als Routine (10 Karten/Tag) – Auftrag in `tools/ANWEISUNG_NEUE_KARTEN.md`

# TO-DO-LISTE

## 1) Für dich (Hendrik) – kurz und konkret
- [ ] **⏳ VORGEMERKT (30.09.2026, wollte er am Computer machen): Routine an Supabase anbinden.** Dann liest die Routine täglich Bewertungen, Notizen, Wünsche und gemeldete Karten. Schritte: (1) Sync-Code der **Home-Bildschirm-App** kopieren (Profil → Sync; *nicht* der alte `UR7T-…`-Safari-Code; nie in den Chat), (2) in den Einstellungen der Routine-Umgebung („Default“) Variable `KNOWGRAM_SYNC_CODE` setzen, (3) Domain `apipudwplhilusdqyemx.supabase.co` bei Network access erlauben, (4) Routine einmal manuell ausführen und im Protokoll prüfen, dass Notizen/Bewertungen gelesen wurden. **Claude: bei Sitzungsstart erinnern, falls Hendrik es nicht erwähnt.**
- [ ] **Am Handy testen:** `https://hendrike202.github.io/Knowgram/` öffnen, zum Startbildschirm hinzufügen, Scrollgefühl/Abendmodus/Timer ausprobieren und melden, was stört
- [ ] **Routine „Neue Wissenskarten“ fertig einrichten** (claude.ai → Routinen): Repo `HendrikE202/Knowgram` zuweisen, Push auf `main` erlauben, Connectors abwählen, Namen ändern, einmal „Run now“ testen und prüfen, ob 10 Karten in `cards.js` landen
- [ ] **Fehlgeschlagene Bilder-Jobs:** Link oder Fehlertext aus der GitHub-Mail schicken (Actions → roter Eintrag); falls es nach den Änderungen wieder rot wird
- [ ] **Supabase-Projekt anlegen** (wenn du daheim bist, Region Frankfurt): nur Projekt-URL und **öffentlichen** Schlüssel schicken – niemals `service_role` oder Datenbank-Passwort
- [ ] **Alten Branch löschen:** Repo `Abschlussprojekt` → Branches → `claude/gracious-heisenberg-82qzi8` → Papierkorb (nichts geht verloren)
- [ ] **Stichproben gegenlesen:** ein paar neue Karten (KI-verfasst, nicht faktengeprüft) und die gefundenen Titelbilder ansehen; unpassende über „Problem melden“ markieren
- [ ] Repo `Knowgram` auf **privat** stellen, falls gewünscht (Settings → General → Danger Zone; Pages braucht dann ein bezahltes Konto oder einen anderen Dienst)

## 2) Entscheidungen von dir
- ~~Schlaf-Timer~~ → entschieden und umgesetzt: aktiv erst ab 23 Uhr (folgt der Abendmodus-Zeit).
- ~~Anmeldung~~ → entschieden: Sync-Code ohne E-Mail (umgesetzt).
- ~~Weltlage~~ → entschieden und umgesetzt: drei Ausgaben (morgens 10, mittags nur Neues, abends Tagesrückblick).
- ~~Illustrationen~~ → entschieden: eigene SVG-Grafiken (kostenlos) für Karten ohne Foto, umgesetzt; zusätzlich Bilder aus dem Netz (Wikimedia + Openverse).

## 3) Für Claude – nach Priorität
### Bald (Kern der Vision)
- [x] **Supabase-Sync ohne Konto** (Sync-Code): Tabelle `kg_state` (gesperrt) + Funktionen `kg_get`/`kg_put`/`kg_summary`, App-Sync mit Zusammenführen, Profil → „Sync zwischen Geräten“. **Offen:** Sync am Handy einschalten und Code sicher aufbewahren; Routine bekommt `KNOWGRAM_SYNC_CODE` und darf `*.supabase.co` erreichen; täglicher Ping gegen die Pausierung des kostenlosen Projekts (der Sync selbst hält es meist wach)
- [ ] **Einordnung der Top-Meldungen** (`summaries.json`, zweite Seite): die App kann sie schon anzeigen, die Routine schreibt sie (Anweisung ist ergänzt); Qualität prüfen, ob Einordnungen wirklich nichts Erfundenes enthalten
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

## Fehlerprotokoll (was schiefging und was noch anzusehen ist)

### Noch offen – bitte ansehen
- [ ] **Fehlgeschlagene Bilder-Jobs:** Ursache nicht sicher bekannt (Logs waren für Claude nicht lesbar). Vermutet: Jobs verdrängten sich gegenseitig (abgebrochene Läufe) und Wikimedia bremste („429“). Bereits geändert: nur noch 1×/Tag, kein Push-Auslöser, Fehler lösen keinen Alarm aus. **Prüfen:** GitHub → Actions → „Titelbilder suchen“ nach dem nächsten Lauf (04:37 UTC) – grün? Falls rot: Fehlertext schicken.
- [ ] **Routine „Neue Wissenskarten“** ist von Claude nicht bearbeitbar und lief noch nie: erster Lauf morgen früh. **Prüfen:** Ob 10 Karten in `cards.js` landen und die Routine pushen darf (sonst Repo zuweisen/Push erlauben).
- [ ] **Alter Branch** `claude/gracious-heisenberg-82qzi8` in `Abschlussprojekt` existiert noch (Löschen per Git wurde von der Umgebung abgelehnt).
- [ ] **Zwei Commits mit „Claude“ als Mitautor** (`f2ead1c`, `9ce43ee`) stehen noch in der Historie von `Knowgram` (Umschreiben wurde abgelehnt; du hast es akzeptiert). Neue Commits laufen unter deinem Namen.
- [ ] **Nur im simulierten Browser getestet:** Nichts davon lief bisher auf einem echten Handy (Scrollen, Installation, Abendmodus, Timer, Offline).
- [ ] **Bilder und Weltlage:** Ob die gefundenen Titelbilder wirklich passen und ob „Heute in der Welt“ die richtigen Ereignisse wählt, ist nur an wenigen Beispielen gesehen.
- [ ] **Karteninhalte sind KI-verfasst und ungeprüft** (besonders Zahlen und Jahre, z. B. Exoplaneten-Zahl, BRICS, EU); Stichproben gegenlesen.
- [ ] **Öffentliches Repo:** enthält keine Schlüssel, ist aber für alle sichtbar; Pages braucht bei privat ein bezahltes Konto.

### Aufgetreten und behoben
- Knowgram lag zunächst im falschen Repo (`Abschlussprojekt`) → in eigenes Repo verschoben.
- Repo-Anlage durch Claude schlug fehl (403) → von dir angelegt.
- News-Feed ESPN (NFL) lieferte nichts (`ParseError`) → durch CBS Sports und Yahoo Sports ersetzt (laufen).
- Nachrichten-Bilder waren teils Logos, Zählpixel (Golem), Werbung (CBS), Stockfotos (Spektrum) → Filter; Karten-Bilder nur noch mit Relevanzprüfung und ohne Logos/Wappen.
- Wikimedia „429 Too Many Requests“ → weniger Anfragen, Pausen, Abbruch nach 2 Versuchen, User-Agent mit Projekt-Adresse.
- Personalisierung: ein einzelnes 👎 senkte ein Thema auf ×0,4 (zu stark) → geglättet (~×0,9); „Menü öffnen“ zählte schon als Interesse → zählt jetzt erst bei Klick auf einen Link.
- Meldungen wiederholten sich im Feed, wenn nur wenige übrig waren → jede nur noch einmal.
- „Weiter im Thema“ schlug zufällige Karten vor (Wortüberschneidung, Jahreszahlen) → konservativ im selben Thema.
- Lokale hessenschau-Gerichtsmeldung stand in „Heute in der Welt“ → Lokales nur noch bei mehreren Quellen.
- Mehrfach 503-Fehler beim Push/Fetch (Umgebung/Proxy) → Wiederholungen mit Wartezeit; GitHub-Werkzeuge zeitweise nicht erreichbar.


## Variable Slides (neu)
- Karten haben 2–6 Wisch-Seiten: Übersicht, „Das Wichtigste“, optionale `slides` (Hintergrund, Zahlen, Missverständnis …), „Tiefer eintauchen“. Maximal 6, so viele wie nötig.
- Erste 6 Karten (ph1, ko1, ps1, ar2, bi1, ge1) haben Zusatz-Slides; weitere sollen nach und nach folgen (Routine schreibt sie bei neuen Karten selbst).

## Slides: so viele wie nötig, mit Bildern (neu)
- Regel: bis zu 6 Inhalts-Slides zwischen Übersicht und „Tiefer eintauchen“ („Das Wichtigste“ zählt mit), mindestens 2 Zusatz-Slides je Karte – Tiefe statt Kurzinfo, aber kein Roman.
- Bilder in Slides: `img: "Suchbegriffe"` am Slide, aufgelöst durch `tools/fetch_images.py` (Commons, Lizenz- und Relevanzprüfung, Urheberangabe, keine Doppelungen). Kein Treffer = kein Bild. Handkorrektur: `tools/image_overrides.json` mit `"karte#index": null | "Datei.jpg"`.
- Offen: Trefferquote der Slide-Bilder beobachten und schlechte Treffer per Override entfernen.
