# Anweisung: täglich 10 neue Wissenskarten

Du erweiterst die Wissenskarten von Knowgram (Repo HendrikE202/Knowgram, Branch main). Knowgram ist Hendriks persönliche Instagram-artige Lern-App zum passiven Weiterbilden. Alle Inhalte sind auf Deutsch.

## Ablauf
1. Lies `CLAUDE.md` und `cards.js`. Notiere dir alle vorhandenen Titel, Suchbegriffe (`q`) und Themen (`window.TOPICS`), damit du nichts doppelt schreibst.
2. Schreibe genau **10 neue Karten**. Wähle die Themen so: die 5 Themen mit den wenigsten Karten plus 5 zufällige weitere. Höchstens 2 Karten pro Thema. Nur Themen aus `window.TOPICS`, außer `wissenschaft` (das ist nur für Nachrichten).
3. Füge die Karten in `cards.js` **vor** der schließenden Klammer `];` von `window.CARDS` ein, mit dem Kommentar `// ---- Neu <Datum>`. Ändere keine anderen Dateien.
4. Prüfe mit einem kleinen Node-Skript: genau 10 Karten mehr als vorher, IDs eindeutig, Thema existiert, alle Felder gefüllt, Datei lässt sich laden (`window` vorher als `{}` definieren). Bei Fehlern reparieren; wenn das nicht klappt, **nicht pushen**.
5. Vor dem Commit: `git config user.name "Hendrik Hannes Eiler"` und `git config user.email "197228237+HendrikE202@users.noreply.github.com"`. Commit-Nachricht: `Neue Wissenskarten (<Datum>)`. Keine Zusatzzeilen, keine Co-Authored-By-Zeile, keine Session-Links. Vor dem Push `git pull --rebase origin main` (ein Bot aktualisiert `news.json` und `onthisday.json`), dann auf `main` pushen.
6. Antworte am Ende nur mit der Liste der 10 Titel.

## Kartenformat
```js
{ id: "<Themenkürzel><Nummer>", topic: "<Schlüssel aus TOPICS>", title: "...", q: "<Suchbegriff für Wikipedia>", text: "..." }
```
- **id:** dasselbe Kürzel wie bei den vorhandenen Karten des Themas (ge, ph, ko, pl, ku, it, po, te, me, bi, zo, wi, we, ps, sp, ma, ch, kl, ra, nf, sw, db, sc, cd, ki, bf – im Zweifel das Kürzel aus vorhandenen IDs des Themas ablesen) plus die nächste freie Nummer.
- **title:** kurz, weckt Neugier, gern als Frage oder überraschende Aussage.
- **text:** 40–60 Wörter, EIN Gedanke, konkret (Name, Zahl oder Jahr), anschaulich, ohne Fachjargon. Deutsche Anführungszeichen „so“ verwenden, keine geraden `"`.
- Mische Bekanntes mit echten Nischenthemen, die kaum jemand kennt.
- Die Themen sw, db, sc, cd, ki, bf sind für Hendriks Ausbildung (Fachinformatiker Anwendungsentwicklung, AP2), sein Studium (Wirtschaftsinformatik) und die Arbeit gedacht: praxisnah, prüfungsrelevant und korrekt, mit konkretem Beispiel. Bei Fachbegriffen die übliche deutsche Schreibweise verwenden.

## Qualität (wichtig – es gibt keine automatische Faktenprüfung)
- Schreibe nur Fakten, bei denen du dir sicher bist. Im Zweifel eine andere Karte wählen.
- Umstrittenes oder unsichere Zahlen ausdrücklich so benennen („Schätzungen zufolge“, „umstritten“).
- Zeitabhängige Angaben immer mit Jahr versehen. Keine Tagesnachrichten, dafür gibt es `news.json`.
- Bei politisch umstrittenen Fragen sachlich und ausgewogen bleiben.
- Nichts erfinden: keine Zitate, Studien oder Zahlen, die du nicht sicher weißt.
