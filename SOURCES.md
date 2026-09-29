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
| CBS Sports, Yahoo Sports | Sportmedien (englisch) | NFL |

- Angezeigt wird nur die **Vorschau des Anbieters** (Titel + Teaser) mit Link zum Original – keine KI-Zusammenfassung.
- Jede Meldung zeigt Quelle, Quellenart, Alter und Datum. Ab 3 Tagen wird sie mit ⏳ markiert, nach 7 Tagen entfernt.
- Stand 29.09.2026: Tagesschau, Deutschlandfunk, DW, hessenschau und Spektrum liefern zuverlässig; die NFL-Feeds (CBS, Yahoo) sind noch ungeprüft, ESPN lieferte keine Daten und wurde entfernt.

## Am heutigen Tag
Täglich 3 Ereignisse aus der Wikipedia-Rubrik „Am heutigen Tag“ (`tools/fetch_onthisday.py` → `onthisday.json`), mit Link zum Artikel.

## Wissenskarten (`cards.js`)
- Von einer KI geschrieben, **nicht automatisch faktengeprüft**; Stand steht auf jeder Karte.
- Pro Thema stehen in `TOPICS[..].refs` verlässliche Anlaufstellen (z. B. bpb, CERN, RKI, EZB, IPCC), die im Menü „Tiefer eintauchen" verlinkt sind.
- Neue Karten: bevorzugt belegbare, gut dokumentierte Fakten; bei Streitfragen die Unsicherheit in den Text schreiben.
