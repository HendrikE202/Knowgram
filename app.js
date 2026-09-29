(() => {
  const TOPICS = window.TOPICS, ALL = window.CARDS;
  const ASOF = "09/2026"; // Stand der handgeschriebenen Wissenskarten
  const $ = (s) => document.querySelector(s);
  const feed = $("#feed"), chips = $("#chips"), sheet = $("#sheet"), toastEl = $("#toast");

  // --- Zustand (localStorage, darf fehlschlagen) ---
  let S = { rate: {}, prefs: {}, dive: {}, strength: 0.5, profile: { name: "", emoji: "🙂" }, saved: [], savedNews: {}, seen: [] };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem("knowgram") || "{}")); } catch (e) {}
  for (const v of Object.values(S.rate)) if (!v.at) v.at = Date.now();   // Zeitstempel nachtragen (für das Abklingen alter Bewertungen)
  // Ältere Version: „liked“-Liste in Bewertungen (👍) überführen
  if (Array.isArray(S.liked)) {
    for (const id of S.liked) { const c = ALL.find((x) => x.id === id); if (c && !S.rate[id]) S.rate[id] = { r: 1, title: c.title, topic: c.topic, at: Date.now() }; }
    delete S.liked;
  }
  const persist = () => { try { localStorage.setItem("knowgram", JSON.stringify(S)); } catch (e) {} };
  const has = (k, id) => S[k].includes(id);
  const flip = (k, id) => { S[k] = has(k, id) ? S[k].filter((x) => x !== id) : [...S[k], id]; persist(); };

  const ratingOf = (id) => (S.rate[id] && S.rate[id].r) || 0;
  let mode = "feed", topic = "", lastId = null, finite = false;
  let NEWS = [], OTD = [], newsPtr = 0, hiddenAt = 0;
  const SEEN = new Set(S.seen);

  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    kids.flat().forEach((c) => el.append(c));
    return el;
  };
  const toast = (msg) => {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => (toastEl.hidden = true), 1800);
  };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const copy = async (t) => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } };
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "#");
  const topicOf = (c) => TOPICS[c.topic] || TOPICS.welt;

  // --- Nachrichten laden (news.json wird alle paar Stunden von GitHub aktualisiert) ---
  const loadNews = async () => {
    try {
      const r = await fetch("news.json?t=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      NEWS = (j.items || []).map((n) => ({ ...n, kind: "news" }))
        .sort((a, b) => new Date(b.published) - new Date(a.published));
      return true;
    } catch (e) { return false; }
  };

  // „Am heutigen Tag“ (onthisday.json): nur anzeigen, wenn die Daten zu heute passen
  const loadOtd = async () => {
    try {
      const r = await fetch("onthisday.json?t=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error(r.status);
      const j = await r.json(), d = new Date();
      const md = String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      OTD = j.md === md ? j.items || [] : [];
    } catch (e) { OTD = []; }
  };

  // --- Zeitangaben ---
  const fmtAge = (iso) => {
    const min = (Date.now() - new Date(iso)) / 60000;
    if (min < 60) return `vor ${Math.max(1, Math.round(min))} Min.`;
    if (min < 1440) return `vor ${Math.round(min / 60)} Std.`;
    const d = Math.round(min / 1440);
    return `vor ${d} ${d === 1 ? "Tag" : "Tagen"}`;
  };
  const fmtDate = (iso) => new Date(iso).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const isOld = (iso) => Date.now() - new Date(iso) > 3 * 864e5;

  // --- Feed-Aufbau: Wissenskarten gemischt, jede 3. Karte eine aktuelle Meldung ---
  const newsPool = () => NEWS.filter((n) => !topic || topic === "news" || n.topic === topic);
  const wissenPool = () => (topic === "news" ? [] : [...ALL, ...OTD].filter((c) => !topic || c.topic === topic));

  // --- Geschmack: vorsichtig und ausgewogen -----------------------------------
  // Ziele: (1) Bewertungen relativ zur Häufigkeit werten, nicht absolut (kein Schneeballeffekt),
  // (2) wenig Daten → kaum Wirkung (Glättung), (3) 👎 trifft vor allem die Karte, nur schwach das Thema,
  // (4) alte Bewertungen klingen ab, (5) kein Thema verschwindet, (6) Abwechslung und Entdecker-Karten.
  const META = {};                                     // Karten-ID → Thema (für Sichtungs-Statistik)
  const indexMeta = () => { for (const c of [...ALL, ...OTD, ...NEWS]) META[c.id] = c.topic; };
  const decay = (at) => Math.pow(0.5, (Date.now() - (at || Date.now())) / (45 * 864e5)); // Halbwertszeit 45 Tage
  const MIN_W = 0.35, MAX_W = 2, SMOOTH = 40, EXPLORE = 0.25, MAX_SHARE = 0.3;

  const topicStats = () => {
    const st = {};
    for (const k of Object.keys(TOPICS)) st[k] = { up: 0, down: 0, pos: 0, neg: 0, dive: S.dive[k] || 0, pref: S.prefs[k] || 0, shown: 0 };
    for (const v of Object.values(S.rate)) {
      const x = st[v.topic]; if (!x) continue;
      if (v.r > 0) { x.up++; x.pos += decay(v.at); } else { x.down++; x.neg += decay(v.at); }
    }
    for (const id of SEEN) { const x = st[META[id]]; if (x) x.shown++; }
    for (const x of Object.values(st)) x.pos += 0.5 * Math.min(x.dive, 4);   // Vertiefen = schwaches Interesse
    return st;
  };

  const weights = (st = topicStats()) => {
    const g = Math.max(0, S.strength ?? 0.5), w = {};
    let N = 0, P = 0, D = 0;
    for (const x of Object.values(st)) { N += x.shown; P += x.pos; D += x.neg; }
    // Grundraten über alle Themen; Untergrenzen verhindern, dass ein einzelnes 👎/👍 bei wenig Daten riesig wirkt
    const qb = Math.max(0.06, (P + 1) / (N + 10)), db = Math.max(0.06, (D + 0.5) / (N + 10));
    for (const [k, x] of Object.entries(st)) {
      const q = (x.pos + SMOOTH * qb) / (x.shown + SMOOTH);             // geglättete 👍-Rate des Themas
      const d = (x.neg + SMOOTH * db) / (x.shown + SMOOTH);             // geglättete 👎-Rate des Themas
      // einseitig: fehlende 👍 sind KEIN Minus (man likt ohnehin nicht alles); nur echte 👎 senken, nur echte 👍 heben
      let r = Math.pow(Math.max(1, q / qb), g) * Math.pow(Math.min(1, db / d), 0.7 * g);
      r *= Math.pow(1.6, g * x.pref);                                   // Lieblingsthema ×1,6 / „weniger“ ×0,63 (nur weich)
      w[k] = Math.min(MAX_W, Math.max(MIN_W, r));
    }
    return w;
  };

  // gewichtetes Mischen; ein Teil der Plätze geht an selten gesehene Themen (Entdecken)
  const weightedShuffle = (list, W, st) => list
    .map((c) => {
      const explore = Math.random() < EXPLORE;
      const wt = explore ? 1 / (1 + ((st[c.topic] || {}).shown || 0) / 3) : W[c.topic] || 1;
      return { c, k: -Math.log(Math.random() || 1e-9) / wt };
    }).sort((a, b) => a.k - b.k).map((x) => x.c);

  // Abwechslung: nie 3 gleiche Themen hintereinander, kein Thema über ~30 % einer Charge
  const spread = (list) => {
    const pool = list.slice(), out = [], cnt = {};
    while (pool.length) {
      const last = out.slice(-2).map((c) => c.topic);
      const run3 = (c) => last.length === 2 && last[0] === c.topic && last[1] === c.topic;
      const ok = (c) => !run3(c) && (cnt[c.topic] || 0) < MAX_SHARE * (out.length + 4);
      let i = pool.findIndex(ok);
      if (i < 0) i = pool.findIndex((c) => !run3(c));
      if (i < 0) i = 0;
      const [c] = pool.splice(i, 1);
      out.push(c); cnt[c.topic] = (cnt[c.topic] || 0) + 1;
    }
    return out;
  };

  const nextBatch = () => {
    const st = topicStats(), W = weights(st), keep = (c) => ratingOf(c.id) >= 0;   // 👎-Karten kommen nicht wieder
    const w = spread(weightedShuffle(wissenPool().filter(keep), W, st).sort((a, b) => SEEN.has(a.id) - SEEN.has(b.id))); // Ungesehenes zuerst
    const n = newsPool().filter((x) => keep(x) && (W[x.topic] || 1) >= MIN_W);
    if (!w.length) { finite = true; return n; }          // reine News-Ansicht: einmal durch, dann Ende
    finite = false;
    if (w.length > 1 && w[0].id === lastId) w.push(w.shift());
    lastId = w[w.length - 1].id;
    const out = [];
    w.forEach((c, i) => {
      out.push(c);
      if ((i + 1) % 3 === 0 && n.length) out.push(n[newsPtr++ % n.length]);
    });
    return out;
  };

  // --- Vertiefen ---
  const promptFor = (c) => c.kind === "news" || c.kind === "otd"
    ? `Ordne diese Nachricht ein (Hintergrund, Beteiligte, unterschiedliche Sichtweisen, was noch unklar ist). Antworte auf Deutsch und nenne Quellen.\n\n${c.title}\n${c.text}\n(${c.source}, ${fmtDate(c.published)})\n${c.link}`
    : `Erkläre mir das Thema „${c.title}“ ausführlich auf Deutsch (Kontext, Hintergründe, Streitpunkte, Quellen zum Weiterlesen). Ausgangspunkt:\n${c.text}`;

  const openSheet = (c) => {
    const news = c.kind === "news", otd = c.kind === "otd", ext = news || otd;
    S.dive[c.topic] = (S.dive[c.topic] || 0) + 1; persist();
    const q = encodeURIComponent(otd ? c.text.slice(0, 80) : news ? c.title : c.q);
    const close = () => { sheet.hidden = true; sheet.replaceChildren(); };
    const link = (href, title, sub) => h("a", { class: "act", href, target: "_blank", rel: "noopener noreferrer" }, title, h("small", {}, sub));
    const parts = [h("h3", {}, c.title), h("div", { class: "sub" }, "Tiefer eintauchen")];
    if (ext) parts.push(link(safeUrl(c.link), otd ? "📖 Wikipedia-Artikel lesen" : "📰 Originalartikel lesen", otd ? c.date : `${c.source} · ${fmtDate(c.published)}`));
    else parts.push(link(`https://de.wikipedia.org/w/index.php?search=${q}`, "📖 Bei Wikipedia lesen", "Suche nach: " + c.q));
    parts.push(link(`https://duckduckgo.com/?q=${q}`, "🔎 Im Web recherchieren", "Weitere Quellen finden"));
    parts.push(h("button", { class: "act", onclick: async () => toast((await copy(promptFor(c))) ? "Prompt kopiert – in Claude einfügen" : "Kopieren nicht möglich") }, "🤖 Mit Claude vertiefen", h("small", {}, "Kopiert einen fertigen Prompt")));
    const t = topicOf(c);
    parts.push(h("div", { class: "refs" },
      h("b", {}, ext ? "Einordnung" : "Wo du es prüfen kannst"),
      h("p", {}, otd ? "Quelle: Wikipedia, Rubrik „Am heutigen Tag“ – von Freiwilligen gepflegt, mit Belegen im verlinkten Artikel."
        : news
        ? `Angezeigt wird die Vorschau des Anbieters (${c.source}, ${c.type}), keine eigene Zusammenfassung. Vergleiche wichtige Themen mit mehr als einer Quelle.`
        : "Diese Karte wurde von einer KI geschrieben und ist nicht automatisch faktengeprüft. Verlässliche Anlaufstellen:"),
      ...(ext ? [] : t.refs.map(([n, u]) => h("a", { href: u, target: "_blank", rel: "noopener noreferrer" }, n)))));
    parts.push(h("button", { class: "act", onclick: close }, "Schließen"));
    sheet.replaceChildren(h("div", { class: "sheet" }, ...parts));
    sheet.hidden = false;
    sheet.onclick = (e) => { if (e.target === sheet) close(); };
  };

  const share = async (c) => {
    const text = c.link ? `${c.title}\n${c.text}\n${c.link}\n– via Knowgram` : `${c.title}\n\n${c.text}\n\n– via Knowgram`;
    if (navigator.share) { try { await navigator.share({ title: c.title, text }); return; } catch (e) { if (e.name === "AbortError") return; } }
    toast((await copy(text)) ? "Text kopiert" : "Teilen nicht möglich");
  };

  const popEmoji = (el, e) => { const p = h("div", { class: "pop" }, e); el.append(p); setTimeout(() => p.remove(), 700); };
  const syncRail = (id) => document.querySelectorAll(`[data-id="${id}"]`).forEach((el) => {
    el.querySelector(".b-up").classList.toggle("on", ratingOf(id) > 0);
    el.querySelector(".b-down").classList.toggle("on", ratingOf(id) < 0);
    el.querySelector(".b-save").classList.toggle("on", has("saved", id));
  });
  // r = 1 (mehr davon) oder -1 (weniger davon); erneutes Tippen nimmt die Bewertung zurück
  const rate = (c, el, r, onlyAdd) => {
    if (ratingOf(c.id) === r) {
      if (onlyAdd) return popEmoji(el, "👍");
      delete S.rate[c.id];
    } else S.rate[c.id] = { r, title: c.title, topic: c.topic, at: Date.now() };
    persist(); syncRail(c.id);
    if (ratingOf(c.id) > 0) popEmoji(el, "👍");
    if (ratingOf(c.id) < 0) {
      toast("Okay, weniger davon");
      const nx = el.nextElementSibling;
      if (nx && nx.classList.contains("card")) setTimeout(() => nx.scrollIntoView({ behavior: "smooth" }), 250);
    }
  };
  const toggleSave = (c) => {
    flip("saved", c.id);
    if (c.kind) { if (has("saved", c.id)) S.savedNews[c.id] = c; else delete S.savedNews[c.id]; persist(); }
    syncRail(c.id); toast(has("saved", c.id) ? "Gespeichert" : "Entfernt");
    if (mode === "saved") render();
  };

  // --- Karte ---
  const metaLine = (c) => {
    if (c.kind === "otd") return h("div", { class: "meta" }, h("span", {}, `📅 ${c.date} · Wikipedia`));
    if (c.kind !== "news") return h("div", { class: "meta" }, h("span", {}, `📚 Wissenskarte · KI-verfasst · Stand ${ASOF}`));
    const old = isOld(c.published);
    return h("div", { class: "meta" },
      h("span", {}, `📰 ${c.source} · ${c.type}`),
      h("span", { class: old ? "old" : "" }, `${old ? "⏳ " : "🕒 "}${fmtAge(c.published)} · ${fmtDate(c.published)}`),
      ...(c.tag ? [h("span", {}, `📍 ${c.tag}`)] : []),
      ...(c.lang === "en" ? [h("span", {}, "🇬🇧 englischsprachig")] : []));
  };

  // Karte gilt als gesehen, wenn sie zu 60 % sichtbar ist
  let seenTimer;
  const seenObs = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = e.target.dataset.id;
    if (!SEEN.has(id)) {
      SEEN.add(id); S.seen = [...SEEN].slice(-3000);
      clearTimeout(seenTimer); seenTimer = setTimeout(persist, 800);
    }
  }), { root: feed, threshold: 0.6 });

  const cardEl = (c) => {
    const t = topicOf(c), news = c.kind === "news", fresh = !SEEN.has(c.id) && !c.kind;
    const el = h("article", { class: "card", "data-id": c.id, style: `--c:${t.c}` },
      h("div", { class: "big" }, news ? "📰" : c.kind === "otd" ? "📅" : t.emoji),
      h("span", { class: "tag" }, `${t.emoji} ${news ? "Aktuell · " : c.kind === "otd" ? "Heute · " : ""}${t.name}`, ...(fresh ? [h("b", { class: "new" }, "NEU")] : [])),
      h("h2", {}, c.title),
      c.text ? h("p", {}, c.text) : "",
      metaLine(c),
      h("button", { class: "more", onclick: () => openSheet(c) }, "Tiefer eintauchen →"),
      h("div", { class: "rail" },
        h("button", { class: "b-up" + (ratingOf(c.id) > 0 ? " on" : ""), "aria-label": "Mehr davon", onclick: () => rate(c, el, 1) }, "👍"),
        h("button", { class: "b-down" + (ratingOf(c.id) < 0 ? " on" : ""), "aria-label": "Weniger davon", onclick: () => rate(c, el, -1) }, "👎"),
        h("button", { class: "b-save" + (has("saved", c.id) ? " on" : ""), "aria-label": "Speichern", onclick: () => toggleSave(c) }, "🔖"),
        h("button", { "aria-label": "Teilen", onclick: () => share(c) }, "↗")));
    el.addEventListener("dblclick", () => rate(c, el, 1, true));
    seenObs.observe(el);
    return el;
  };

  // --- Endlos-Feed ---
  let obs;
  const watchSentinel = () => {
    obs && obs.disconnect();
    if (finite) return;
    const cards = feed.querySelectorAll(".card");
    const trigger = cards[Math.max(0, cards.length - 3)];
    if (!trigger) return;
    obs = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) appendBatch(); }, { root: feed, threshold: 0.5 });
    obs.observe(trigger);
  };
  const appendBatch = () => {
    const batch = nextBatch();
    if (!batch.length) { if (!feed.children.length) feed.append(h("div", { class: "empty" }, topic === "news" || NEWS.length === 0 && !wissenPool().length ? "Noch keine Meldungen. Der Nachrichten-Abruf läuft alle paar Stunden." : "Hier ist noch nichts.")); return; }
    feed.append(...batch.map(cardEl));
    if (finite) feed.append(h("div", { class: "end" }, "Du bist auf dem neuesten Stand ✅"));
    watchSentinel();
  };

  // --- Profil (lokal, bleibt auf diesem Gerät) ---
  const exportJson = () => JSON.stringify({ app: "knowgram", v: 1, at: new Date().toISOString(), profile: S.profile, prefs: S.prefs, dive: S.dive, strength: S.strength, rate: S.rate, saved: S.saved }, null, 1);
  const importJson = (txt) => {
    const j = JSON.parse(txt);
    if (!j || j.app !== "knowgram" || j.v !== 1 || typeof j.rate !== "object") throw new Error("Format");
    const rate = {};
    for (const [id, v] of Object.entries(j.rate || {})) if (v && (v.r === 1 || v.r === -1)) rate[String(id).slice(0, 40)] = { r: v.r, title: String(v.title || "").slice(0, 200), topic: TOPICS[v.topic] ? v.topic : "", at: Number.isFinite(v.at) ? v.at : Date.now() };
    const prefs = {};
    for (const [k, v] of Object.entries(j.prefs || {})) if (TOPICS[k] && (v === 1 || v === -1)) prefs[k] = v;
    const dive = {};
    for (const [k, v] of Object.entries(j.dive || {})) if (TOPICS[k] && Number.isFinite(v)) dive[k] = Math.max(0, Math.min(999, v));
    S.rate = rate; S.prefs = prefs; S.dive = dive; if ([0, 0.5, 1, 1.5].includes(j.strength)) S.strength = j.strength;
    S.profile = { name: String((j.profile && j.profile.name) || "").slice(0, 24), emoji: String((j.profile && j.profile.emoji) || "🙂").slice(0, 4) };
    if (Array.isArray(j.saved)) S.saved = j.saved.filter((x) => typeof x === "string").slice(0, 2000);
    persist();
  };

  const renderProfile = () => {
    const sec = (title, ...kids) => h("section", { class: "pf-sec" }, h("h3", {}, title), ...kids);
    const nameIn = h("input", { placeholder: "Dein Name (optional)", maxlength: "24", value: S.profile.name });
    nameIn.addEventListener("input", () => { S.profile.name = nameIn.value; persist(); });
    const emos = ["🙂", "🦊", "🐙", "🦉", "🚀", "🧠", "🎨", "⚡"].map((e) => {
      const b = h("button", { class: "emo" + (S.profile.emoji === e ? " on" : ""), onclick: () => { S.profile.emoji = e; persist(); emos.forEach((x) => x.classList.toggle("on", x === b)); } }, e);
      return b;
    });

    const bars = h("div");
    const drawBars = () => {
      const st = topicStats(), W = weights(st);
      const rows = Object.entries(st).map(([k, x]) => ({ k, x, w: W[k] })).filter((r) => r.x.up || r.x.down || r.x.dive || r.x.pref).sort((a, b) => b.w - a.w);
      bars.replaceChildren(...(rows.length
        ? rows.map(({ k, x, w }) => {
            const thin = x.up + x.down < 3 && x.shown < 8;
            return h("div", { class: "pf-row" },
              h("div", { class: "pf-lbl" }, `${TOPICS[k].emoji} ${TOPICS[k].name}`, h("small", {}, `👍 ${x.up} · 👎 ${x.down}${x.dive ? ` · 🔎 ${x.dive}` : ""} · ×${w.toFixed(1)}${thin ? " · noch wenig Daten" : ""}`)),
              h("div", { class: "pf-bar" }, h("i", { class: w >= 1 ? "pos" : "neg", style: `width:${Math.min(50, Math.abs(Math.log2(w)) * 40)}%` })));
          })
        : [h("p", { class: "pf-empty" }, "Bewerte ein paar Karten mit 👍 und 👎 – dann siehst du hier, was dir gefällt. Themen mit wenig Daten bleiben neutral.")]));
    };
    drawBars();

    const strengthBtns = [["Aus", 0], ["Sanft", 0.5], ["Mittel", 1], ["Stark", 1.5]].map(([label, v]) => {
      const b = h("button", { class: "seg" + ((S.strength ?? 0.5) === v ? " on" : ""), onclick: () => { S.strength = v; persist(); strengthBtns.forEach((x) => x.classList.toggle("on", x === b)); drawBars(); } }, label);
      return b;
    });

    const prefChips = Object.entries(TOPICS).map(([k, t]) => {
      const b = h("button", { style: `--c:${t.c}` });
      const paint = () => { const v = S.prefs[k] || 0; b.className = "pchip" + (v > 0 ? " pos" : v < 0 ? " neg" : ""); b.textContent = `${v > 0 ? "❤️ " : v < 0 ? "🚫 " : ""}${t.emoji} ${t.name}`; };
      b.addEventListener("click", () => { const v = S.prefs[k] || 0, n = v === 0 ? 1 : v === 1 ? -1 : 0; if (n) S.prefs[k] = n; else delete S.prefs[k]; persist(); paint(); drawBars(); });
      paint(); return b;
    });

    const recent = (sign) => {
      const items = Object.entries(S.rate).filter(([, v]) => v.r === sign).slice(-10).reverse();
      return items.length ? items.map(([id, v]) => h("div", { class: "it" },
        h("span", {}, `${(TOPICS[v.topic] || {}).emoji || "•"} ${v.title}`),
        h("button", { onclick: () => { delete S.rate[id]; persist(); render(); } }, "zurücksetzen"))) : [h("p", { class: "pf-empty" }, "Noch nichts.")];
    };

    const tile = (n, label) => h("div", { class: "tile" }, h("b", {}, String(n)), label);
    const box = h("textarea", { rows: "4", placeholder: "Exportierten Geschmack hier einfügen …" });

    return h("div", { class: "profile" },
      sec("Dein Profil",
        h("div", { class: "pf-me" }, nameIn),
        h("div", { class: "pf-emos" }, ...emos),
        h("p", { class: "pf-note" }, "Lokales Beispiel-Profil: Es bleibt auf diesem Gerät. Ein echter Account mit Sync folgt.")),
      h("div", { class: "tiles" }, tile(SEEN.size, "gesehen"), tile(Object.keys(S.rate).length, "bewertet"), tile(S.saved.length, "gespeichert")),
      sec("Was interessiert dich?", h("p", { class: "pf-note" }, "Tippen: ❤️ mehr davon → 🚫 weniger → neutral"), h("div", { class: "pf-chips" }, ...prefChips)),
      sec("Dein Geschmack", bars,
        h("p", { class: "pf-note" }, "Wie stark soll sich der Feed anpassen?"),
        h("div", { class: "segs" }, ...strengthBtns),
        h("p", { class: "pf-note" }, "„Aus“ = reine Abwechslung. Selbst bei „Stark“ bleiben alle Themen im Feed: Lieblinge kommen höchstens doppelt so oft, andere mindestens etwa ein Drittel so oft. Ein 👎 betrifft vor allem die eine Karte. Rund jede vierte Karte ist ein Entdecker-Tipp aus selten gesehenen Themen.")),
      sec("Zuletzt 👍", h("div", { class: "pf-list" }, ...recent(1))),
      sec("Zuletzt 👎", h("div", { class: "pf-list" }, ...recent(-1))),
      sec("Sichern & Übertragen",
        h("button", { class: "act", onclick: async () => toast((await copy(exportJson())) ? "Geschmack kopiert" : "Kopieren nicht möglich") }, "📋 Geschmack kopieren", h("small", {}, "Als Text, z. B. zum Sichern oder um ihn Claude zu zeigen")),
        box,
        h("button", { class: "act", onclick: () => { try { importJson(box.value); toast("Geschmack geladen"); render(); } catch (e) { toast("Das ist kein gültiger Export"); } } }, "📥 Einfügen & laden"),
        h("button", { class: "act", onclick: () => { if (confirm("Wirklich alles zurücksetzen (Bewertungen, Gespeichertes, Profil)?")) { S = { rate: {}, prefs: {}, dive: {}, strength: 0.5, profile: { name: "", emoji: "🙂" }, saved: [], savedNews: {}, seen: [] }; SEEN.clear(); persist(); render(); } } }, "🗑️ Alles zurücksetzen")));
  };

  const render = () => {
    obs && obs.disconnect();
    feed.replaceChildren(); feed.scrollTop = 0; newsPtr = 0;
    $("#app").dataset.mode = mode;
    if (mode === "profile") { feed.append(renderProfile()); return; }
    if (mode === "saved") {
      const list = [...ALL.filter((c) => has("saved", c.id)), ...Object.values(S.savedNews)]
        .filter((c) => !topic || topic === "news" ? (topic !== "news" || c.kind === "news") : c.topic === topic);
      if (!list.length) feed.append(h("div", { class: "empty" }, "Noch nichts gespeichert. Tippe auf 🔖, um Karten hier zu sammeln."));
      else feed.append(...list.map(cardEl));
    } else appendBatch();
  };

  // --- Kopfbereich ---
  const drawChips = () => {
    const chip = (k, label, color) => h("button", { class: "chip" + (topic === k ? " on" : ""), "data-t": k, style: color ? `--c:${color}` : "", onclick: () => { topic = k; drawChips(); render(); } }, label);
    chips.replaceChildren(chip("", "Alle"), chip("news", "📰 Aktuell", "#e11d48"),
      ...Object.entries(TOPICS).filter(([k]) => ALL.some((c) => c.topic === k) || NEWS.some((n) => n.topic === k))
        .map(([k, t]) => chip(k, `${t.emoji} ${t.name}`, t.c)));
  };
  document.querySelectorAll(".modes button").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    document.querySelectorAll(".modes button").forEach((x) => x.classList.toggle("on", x === b));
    render();
  }));

  // Beim Zurückkehren in die App nach längerer Pause: Nachrichten neu laden
  document.addEventListener("visibilitychange", async () => {
    if (document.hidden) { hiddenAt = Date.now(); return; }
    if (hiddenAt && Date.now() - hiddenAt > 15 * 60000 && (await loadNews())) { indexMeta(); drawChips(); toast("Nachrichten aktualisiert"); }
  });

  (async () => { await Promise.all([loadNews(), loadOtd()]); indexMeta(); drawChips(); render(); })();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
