# Anweisung: täglich 10 neue Wissenskarten

Du erweiterst die Wissenskarten von Knowgram (Repo HendrikE202/Knowgram, Branch main). Knowgram ist Hendriks persönliche Instagram-artige Lern-App zum passiven Weiterbilden. Alle Inhalte sind auf Deutsch.

## Ablauf
1. Lies `CLAUDE.md` und `cards.js`. Notiere dir alle vorhandenen Titel, Suchbegriffe (`q`) und Themen (`window.TOPICS`), damit du nichts doppelt schreibst.
2. Schreibe genau **10 neue Karten**. Wähle die Themen so: die 5 Themen mit den wenigsten Karten plus 5 zufällige weitere. Höchstens 2 Karten pro Thema. Nur Themen aus `window.TOPICS`, außer `wissenschaft` (das ist nur für Nachrichten).
3. Füge die Karten in `cards.js` **vor** der schließenden Klammer `];` von `window.CARDS` ein, mit dem Kommentar `// ---- Neu <Datum>`. Ändere keine anderen Dateien.
4. Führe **`python3 tools/check_cards.py --new 10`** aus – das prüft Felder, Slide-Format, Längen und die Abwechslung der neuen Charge (mind. 3 Formate, mind. 2× `steps`, mind. 1× `big`, unterschiedliche Slide-Anzahl, keine Überschrift öfter als 3×) und die Einordnungen der Top-Meldungen. Bei „FEHLER“ reparieren. Zusätzlich prüfe mit einem kleinen Node-Skript: genau 10 Karten mehr als vorher, IDs eindeutig, Thema existiert, alle Felder gefüllt (auch `points` mit 3 Einträgen), Datei lässt sich laden (`window` vorher als `{}` definieren). Bei Fehlern reparieren; wenn das nicht klappt, **nicht pushen**.
5. Vor dem Commit: `git config user.name "Hendrik Hannes Eiler"` und `git config user.email "197228237+HendrikE202@users.noreply.github.com"`. Commit-Nachricht: `Neue Wissenskarten (<Datum>)`. Keine Zusatzzeilen, keine Co-Authored-By-Zeile, keine Session-Links. Vor dem Push `git pull --rebase origin main` (ein Bot aktualisiert `news.json` und `onthisday.json`), dann auf `main` pushen.
6. Antworte am Ende nur mit der Liste der 10 Titel.

## Kartenformat
```js
{ id: "<Themenkürzel><Nummer>", topic: "<Schlüssel aus TOPICS>", title: "...", q: "<Suchbegriff für Wikipedia>", points: ["...", "...", "..."], text: "..." }
```
- **id:** dasselbe Kürzel wie bei den vorhandenen Karten des Themas (ge, ph, ko, pl, ku, it, po, te, me, bi, zo, wi, we, ps, sp, ma, ch, kl, ra, nf, sw, db, sc, cd, ki, bf, ar – im Zweifel das Kürzel aus vorhandenen IDs des Themas ablesen) plus die nächste freie Nummer.
- **title:** kurz, weckt Neugier, gern als Frage oder überraschende Aussage.
- **points:** genau 3 Stichpunkte für die zweite Seite der Karte („Das Wichtigste“, per Wisch nach links). Je höchstens ~18 Wörter, die Kernfakten (wer, was, wann, Zahl, Folge) in knapper Form, **nur aus dem Kartentext abgeleitet** – nichts Neues dazuerfinden. Optional `why: "..."` (ein Satz: Warum ist das wichtig?).
- **text:** 40–60 Wörter, EIN Gedanke, konkret (Name, Zahl oder Jahr), anschaulich, ohne Fachjargon. Deutsche Anführungszeichen „so“ verwenden, keine geraden `"`.
- Mische Bekanntes mit echten Nischenthemen, die kaum jemand kennt.
- Die Themen sw, db, sc, cd, ki, bf sind für Hendriks Ausbildung (Fachinformatiker Anwendungsentwicklung, AP2), sein Studium (Wirtschaftsinformatik) und die Arbeit gedacht: praxisnah, prüfungsrelevant und korrekt, mit konkretem Beispiel. Bei Fachbegriffen die übliche deutsche Schreibweise verwenden.

## Rabbit Holes: Serien und Verweise (wichtig für die Vision)
Hendrik will abends in Rabbit Holes fallen. Deshalb gilt:
- **Mindestens jeden zweiten Tag eine Serie** aus 4–6 Karten zu einem spannenden Faden (z. B. ein Ereignis, eine Erfindung, eine Person). Die Karten einer Serie erhalten nach `q` die Felder `series: "Serientitel", part: 1, of: 5,`. Jede Karte hört mit einer Cliffhanger-Frage und `→ Teil n+1` auf. Alle Teile einer Serie gehören in denselben Lauf und dasselbe Thema (oder eng verwandte Themen).
- Die übrigen Karten sind Einzelkarten. Jede Karte darf zusätzlich `more: ["id1", "id2"],` mit 1–3 IDs **bereits vorhandener**, inhaltlich verwandter Karten haben (auch aus anderen Themen) – das sind die Türen zum nächsten Kaninchenloch.
- **slides (PFLICHT, 2–5 je Karte, so viele wie der Stoff braucht):** weitere Wisch-Seiten nach „Das Wichtigste“, z. B. `{ h: "🧩 Hintergrund", text: "..." }`, `{ h: "🔢 Zahlen & Fakten", points: ["...","..."] }`, `{ h: "❓ Häufiges Missverständnis", text: "..." }`, `{ h: "🔗 Zusammenhang", text: "..." }`. Der Leser will wirklich etwas erfahren, aber es soll **kein Roman** werden: weder zum Auffüllen strecken noch wichtigen Stoff weglassen. Faustregel: schlanker Stoff 2–3 Zusatz-Slides, reicher Stoff (Ablauf, Ursachen und Folgen, Zahlen, Kritik, Heute) 4–5. **Insgesamt höchstens 6 Inhalts-Slides zwischen Übersicht und „Tiefer eintauchen“** („Das Wichtigste“ zählt mit; Übersicht und Quellen-Seite zählen nicht). Weniger als 2 Zusatz-Slides lehnt das Prüfskript ab. Formate mischen: `text`, `points`, `steps` (nummerierte Schritte/Zeitleiste) und `big: {n, l}` (große Zahl mit Erklärung) – nicht jede Karte im gleichen Muster, Überschriften und Reihenfolge variieren. Jeder Slide: kurz (≤ ~60 Wörter), überprüfbare Fakten, nichts erfinden, kein Füllmaterial.
- **Bilder in Slides (`img`, optional, wo es passt):** Bei Slides, die etwas Sichtbares erklären (Ort, Objekt, Person, Diagramm, Versuchsaufbau), setzt du `img: "<2–3 kurze Suchbegriffe für Wikimedia Commons, Thema zuerst>"`, z. B. `"Great Wave Kanagawa"` oder `"Blue whale"` (lange Suchtexte finden nichts). Die Bilder-Aktion sucht das Bild (nur frei lizenziert, mit Urheberangabe, mit Relevanzprüfung); findet sie keins, bleibt der Slide ohne Bild. Gute Kandidaten: ca. jede zweite Karte bekommt auf einem Slide ein Bild. Nicht das Titelbild der Karte wiederholen (das ist schon das Artikelbild zu `q`), lieber einen anderen Aspekt wählen (z. B. Diagramm, Detail, Karte, Vergleich).
- Reihenfolge der Felder: `id, topic, title, q, series, part, of, more, points, why, slides, text` (nur die nötigen).
- Gesamtzahl bleibt 10 Karten pro Lauf (eine Serie zählt mit ihren Teilen).

## Geschmack und Wünsche berücksichtigen (optional)
Nur wenn die Umgebungsvariable `KNOWGRAM_SYNC_CODE` gesetzt ist (der geheime Sync-Code von Hendrik – niemals ausgeben, loggen oder ins Repo schreiben):
```
curl -s -X POST "https://apipudwplhilusdqyemx.supabase.co/rest/v1/rpc/kg_summary" \
  -H "apikey: sb_publishable_0QNoSsrwGFtS1BV2ZdkQUA_7-rfuwQI" -H "Content-Type: application/json" \
  -d "{\"code\":\"$KNOWGRAM_SYNC_CODE\"}"
```
Die Antwort enthält: `ratings` (👍 `r:1` / 👎 `r:-1` mit Titel und Thema), `prefs` (Lieblingsthemen `1`, „weniger“ `-1`), `checks` (Antworten auf „Öfter/Wie bisher/Seltener“), `wishes` (Themenwünsche), `notes` (freie Notizen zu Karten), `reports` (gemeldete Karten mit Grund) und `arch` (verdichtete ältere Bewertungen). Schlägt der Aufruf fehl (Netz gesperrt, Variable fehlt), einfach ohne diese Infos weitermachen.
So verwenden:
- **Themenwünsche** (`wishes`) ernst nehmen: pro Lauf höchstens 2 Karten zu einem Wunsch, gern als Anfang einer Serie.
- **Notizen** (`notes`) lesen: sie zeigen, was gefällt oder stört; daraus Tonfall, Länge und Themen ableiten.
- **Gemeldete Karten** (`reports`): Karte in `cards.js` prüfen. „Sachlich falsch/veraltet“ → korrigieren oder streichen; „einseitig“ → ausgewogener formulieren. Erledigte Fälle in der Antwort erwähnen.
- **Geschmack** (`ratings`, `prefs`, `checks`) nur als leichte Gewichtung: höchstens 3 der 10 Karten dürfen sich danach richten. Die übrigen gehen weiter an die Themen mit den wenigsten Karten. Nie ein Thema komplett weglassen (keine Filterblase).

## Meldungen einordnen: `summaries.json` (zweite Seite bei Nachrichten)
Zu den wichtigsten aktuellen Meldungen (**die ersten 20 in `ranked` von `news.json`, bei fehlendem `ranked` die IDs in `briefing`; jede davon MUSS eine Einordnung haben**) schreibst du kurze Einordnungen in `summaries.json` (Objekt: Meldungs-ID → `{ "points": ["...", "...", "..."], "why": "..." }`). Die App zeigt sie auf der zweiten Seite („Das Wichtigste“) mit dem Hinweis „KI-Einordnung“.
- Grundlage NUR: Titel, Vorschautext (`text`) und die Titel der anderen Quellen (`also`) aus `news.json`. Wenn du Webzugriff hast, darfst du den Originalartikel (`link`) lesen – aber in **eigenen Worten**, ohne Sätze zu übernehmen.
- **Ausführlicher, wenn du den Artikel lesen kannst:** 3–5 Stichpunkte (je höchstens ~22 Wörter) und optional `slides` wie bei den Wissenskarten (Format siehe oben), z. B. `{ "h": "🧩 Hintergrund", "text": "..." }`, `{ "h": "🔢 Zahlen", "points": ["..."] }`, `{ "h": "👥 Beteiligte", "points": ["..."] }`, `{ "h": "🕰️ Wie es dazu kam", "steps": ["..."] }`. Höchstens 5 Zusatz-Slides je Meldung (mit „Das Wichtigste“ max. 6). Ohne Artikelzugriff bleibt es bei 2–3 Stichpunkten aus Titel und Vorschau.
- **Jede Einordnung braucht mindestens 2 Zusatz-Slides: „🧩 Hintergrund“ plus „❓ Was noch unklar ist“ / „🔎 Was man nachschauen sollte“ / „🕰️ Wie es weitergeht“ (ein dritter ist erlaubt)** (Begriffe, Vorgeschichte, Zusammenhang). Kannst du den Artikel nicht lesen (die Umgebung ist oft gesperrt), schreibst du den Hintergrund aus **allgemeinem, sicherem Wissen** und setzt bei dem Slide `"note": "🧩 Allgemeines Hintergrundwissen (KI), nicht aus dem Artikel · ohne Gewähr"`. Über das konkrete Ereignis nichts hinzufügen, was nicht in Titel/Vorschau steht; Unbekanntes als Slide „❓ Was offen ist“ benennen. Schwaches Thema ohne sicheres Hintergrundwissen: lieber nur „Was offen ist“.
- `why` = ein vorsichtiger Satz, warum es wichtig ist. Nichts dazuerfinden, Unklares weglassen („bisher unklar“ ist erlaubt), keine Wertungen, keine Prognosen.
- Bestehende Einträge behalten, solange die Meldung noch in `news.json` steht; Einträge zu verschwundenen Meldungen entfernen. Höchstens 30 Einträge. Danach `python3 tools/check_cards.py` ausführen (es warnt bei Top-Meldungen ohne Einordnung oder ohne Hintergrund-Slide).
- Zusammen mit den Karten in einem Commit (`Neue Wissenskarten (<Datum>)`) oder – falls nur Einordnungen anfallen – in einem eigenen Commit „Einordnungen (<Datum>)“.

## Qualität (wichtig – es gibt keine automatische Faktenprüfung)
- Schreibe nur Fakten, bei denen du dir sicher bist. Im Zweifel eine andere Karte wählen.
- Umstrittenes oder unsichere Zahlen ausdrücklich so benennen („Schätzungen zufolge“, „umstritten“).
- Zeitabhängige Angaben immer mit Jahr versehen. Keine Tagesnachrichten, dafür gibt es `news.json`.
- Bei politisch umstrittenen Fragen sachlich und ausgewogen bleiben.
- Nichts erfinden: keine Zitate, Studien oder Zahlen, die du nicht sicher weißt.
