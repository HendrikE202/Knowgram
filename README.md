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

## Roadmap
1. ✅ Feed-Prototyp mit handgeschriebenen Karten
2. Karten-Pipeline (Claude-generiert + RSS-News), Faktencheck/Quellenpflicht
3. Vertiefung mit Recherche und Folgefragen direkt in der App
4. Personalisierung (Likes/Verweildauer → Themengewichte)
