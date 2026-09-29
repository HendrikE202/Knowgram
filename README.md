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
- Die Feed-URLs wurden noch nicht live geprüft. Nach dem ersten Lauf in den Actions-Logs nach `WARN` suchen und URLs in `feeds.json` korrigieren.

## Online stellen (GitHub Pages)
Settings → Pages → „Deploy from a branch" → `main` / `/ (root)`. Danach die Adresse am Handy öffnen und „Zum Startbildschirm hinzufügen".

## Roadmap
1. ✅ Feed-Prototyp mit Wissenskarten
2. ✅ News-Pipeline (RSS → `news.json`), Quelle/Alter pro Karte
3. Regelmäßig neue Wissenskarten (automatisch)
4. Bilder/Animationen, Kartenserien
5. Vertiefung mit Recherche und Folgefragen direkt in der App
6. Personalisierung (Likes/Verweildauer → Themengewichte)
