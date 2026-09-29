# Quellen & Verlässlichkeit

Keine Quelle ist neutral. Knowgram zeigt deshalb bei jeder Karte, woher sie kommt, und mischt mehrere Anbieter.

## Aktuelle Meldungen (`feeds.json`)
| Anbieter | Art | Themen |
|---|---|---|
| Tagesschau (ARD) | Öffentlich-rechtlich | Inland, Ausland, Wirtschaft, Wissen |
| Deutschlandfunk | Öffentlich-rechtlich | Nachrichten |
| Deutsche Welle | Öffentlich-rechtlich (Auslandsrundfunk) | Ausland |
| hessenschau (hr) | Öffentlich-rechtlich | nur 1 Meldung pro Abruf (Hessen-Bezug) |
| Spektrum der Wissenschaft | Wissenschaftsmagazin | Wissenschaft |
| ESPN | Sportmedium (englisch) | NFL |

- Angezeigt wird nur die **Vorschau des Anbieters** (Titel + Teaser) mit Link zum Original – keine KI-Zusammenfassung.
- Jede Meldung zeigt Quelle, Quellenart, Alter und Datum. Ab 3 Tagen wird sie mit ⏳ markiert, nach 7 Tagen entfernt.
- Die Feed-URLs sind aus dem Gedächtnis eingetragen und noch **nicht live geprüft** (siehe README).

## Wissenskarten (`cards.js`)
- Von einer KI geschrieben, **nicht automatisch faktengeprüft**; Stand steht auf jeder Karte.
- Pro Thema stehen in `TOPICS[..].refs` verlässliche Anlaufstellen (z. B. bpb, CERN, RKI, EZB, IPCC), die im Menü „Tiefer eintauchen" verlinkt sind.
- Neue Karten: bevorzugt belegbare, gut dokumentierte Fakten; bei Streitfragen die Unsicherheit in den Text schreiben.
