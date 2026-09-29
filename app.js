(() => {
  const TOPICS = window.TOPICS, ALL = window.CARDS;
  const ASOF = "09/2026"; // Stand der handgeschriebenen Wissenskarten
  const $ = (s) => document.querySelector(s);
  const feed = $("#feed"), chips = $("#chips"), sheet = $("#sheet"), toastEl = $("#toast");

  // --- Zustand (localStorage, darf fehlschlagen) ---
  let S = { rate: {}, prefs: {}, dive: {}, strength: 0.5, wishes: [], reports: {}, checks: {}, lastCheck: 0, notes: {}, arch: {}, seenAt: {}, badImg: {}, badSrc: {}, night: "auto", nightFrom: 23, sleep: 0, big: false, briefEd: "", briefSeen: null, profile: { name: "", emoji: "🙂" }, saved: [], savedNews: {}, seen: [] };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem("knowgram") || "{}")); } catch (e) {}
  for (const v of Object.values(S.rate)) if (!v.at) v.at = Date.now();   // Zeitstempel nachtragen (für das Abklingen alter Bewertungen)
  // Ältere Version: „liked“-Liste in Bewertungen (👍) überführen
  if (Array.isArray(S.liked)) {
    for (const id of S.liked) { const c = ALL.find((x) => x.id === id); if (c && !S.rate[id]) S.rate[id] = { r: 1, title: c.title, topic: c.topic, at: Date.now() }; }
    delete S.liked;
  }
  // Sync-Hook: wird nach jeder Änderung angestoßen (mit Wartezeit), außer beim stillen Speichern
  let onChange = null;
  const settingsSig = () => JSON.stringify([S.profile, S.prefs, S.strength, S.night, S.nightFrom, S.sleep, S.big]);
  let lastSig = settingsSig();
  const persist = (quiet) => {
    const sg = settingsSig();
    if (sg !== lastSig) { S.settingsAt = Date.now(); lastSig = sg; }   // Einstellungen: „wer zuletzt ändert, gewinnt“ beim Sync
    try { localStorage.setItem("knowgram", JSON.stringify(S)); } catch (e) {}
    if (quiet !== true && onChange) onChange();
  };
  const has = (k, id) => S[k].includes(id);
  const flip = (k, id) => { S[k] = has(k, id) ? S[k].filter((x) => x !== id) : [...S[k], id]; persist(); };

  const ratingOf = (id) => (S.rate[id] && S.rate[id].r) || 0;
  let mode = "feed", topic = "", lastId = null, finite = false;
  let NEWS = [], OTD = [], IMG = {}, BRIEF = [], RANK = [], CARD_BY_ID = {}, STEMS = {}, SERIES = {}, briefPending = false, newsPtr = 0, hiddenAt = 0;
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
      BRIEF = Array.isArray(j.briefing) ? j.briefing : [];
      RANK = Array.isArray(j.ranked) && j.ranked.length ? j.ranked.map((x) => x.id) : BRIEF;
      return true;
    } catch (e) { return false; }
  };

  // „Am heutigen Tag“ (onthisday.json): nur anzeigen, wenn die Daten zu heute passen
  const loadImages = async () => {
    try { const r = await fetch("images.json"); if (r.ok) IMG = await r.json(); } catch (e) { IMG = {}; }
  };

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
  // Meldungen haben ein Verfallsdatum (je Quelle); Abgelaufenes und schon Gesehenes kommt nicht mehr in den Feed
  const isFresh = (n) => (n.expires ? Date.parse(n.expires) : Date.parse(n.published) + 7 * 864e5) > Date.now();
  // Weltlage in drei Ausgaben: morgens (10 wichtigste), mittags (nur NEUES), abends (Tagesrückblick)
  const ED = { morgen: { icon: "🌅", name: "Weltlage am Morgen", chip: "🌅 Weltlage", n: 10 }, mittag: { icon: "☀️", name: "Update am Mittag", chip: "☀️ Update", n: 5 }, abend: { icon: "🌙", name: "Tagesrückblick", chip: "🌙 Rückblick", n: 7 } };
  const edition = () => { const hh = new Date().getHours(); return hh >= 5 && hh < 11 ? "morgen" : hh >= 11 && hh < 17 ? "mittag" : "abend"; };
  const dayKey = () => new Date().toDateString();
  const rankedFresh = () => RANK.map((id) => NEWS.find((n) => n.id === id)).filter((n) => n && isFresh(n));
  const briefItems = (ed = edition(), forBlock = false) => {
    let list = rankedFresh();
    if (ed === "abend") list = list.filter((n) => Date.now() - Date.parse(n.published) < 30 * 36e5);                 // was heute (und gestern Abend) wichtig war
    else if (ed === "mittag") { const done = (S.briefSeen && S.briefSeen.day === dayKey()) ? S.briefSeen.ids : []; list = list.filter((n) => !done.includes(n.id)); }   // nur Neues seit dem Morgen
    list = list.slice(0, ED[ed].n);
    if (ed === "mittag" && list.length < 2) return forBlock ? [] : briefItems("morgen");                              // zu wenig Neues: Block auslassen, Chip zeigt die Morgenlage
    return list.map((n, i, a) => ({ ...n, _b: { i: i + 1, n: a.length, ed } }));
  };
  const newsPool = () => {
    if (topic === "brief") return briefItems();
    const skip = new Set(RANK);                              // Überblick-Meldungen kommen nicht zusätzlich im normalen Strom
    return NEWS.filter(isFresh).filter((n) => !topic || topic === "news" || n.topic === topic)
      .filter((n) => topic === "news" || (!SEEN.has(n.id) && !skip.has(n.id)));
  };
  const wissenPool = () => (topic === "news" || topic === "brief" ? [] : [...ALL, ...OTD].filter((c) => (!topic || c.topic === topic) && seriesOk(c)));

  // --- Geschmack: vorsichtig und ausgewogen -----------------------------------
  // Ziele: (1) Bewertungen relativ zur Häufigkeit werten, nicht absolut (kein Schneeballeffekt),
  // (2) wenig Daten → kaum Wirkung (Glättung), (3) 👎 trifft vor allem die Karte, nur schwach das Thema,
  // (4) alte Bewertungen klingen ab, (5) kein Thema verschwindet, (6) Abwechslung und Entdecker-Karten.
  const META = {};                                     // Karten-ID → Thema (für Sichtungs-Statistik)
  const STOPW = new Set(("der die das den dem des ein eine einer eines einem einen und oder mit von für auf aus bei nach vor über unter durch zwischen ohne wegen sowie nicht auch noch nur dass sich sind wird werden wurde wurden hat haben mehr neue neuen wie was wer wo warum wann als im in am an zu zum zur ist war sein seine seiner ihre ihrer ihren "
    + "erste ersten viele vielen andere anderen alles alle allen unser unsere unseren etwa rund jahre jahren jahr diese diesen dieser dieses aber wenn seit kann können zwei drei vier fünf zeigt zeigen zeigte wenig wenige heute immer schon sehr ganz gibt gab gilt dabei damit dafür dazu dann doch also weil später früher zuerst deshalb selbst besteht bestätigt bekannt große großen kleine grund").split(" "));
  const stems = (t) => new Set((String(t || "").toLowerCase().replace(/_/g, " ").match(/[a-zäöüß]{4,}/g) || []).filter((w) => !STOPW.has(w)).map((w) => w.slice(0, 5)));
  const DF = {}, idf = (w) => Math.log((ALL.length || 1) / (DF[w] || 1));
  const indexMeta = () => {
    for (const c of [...ALL, ...OTD, ...NEWS]) META[c.id] = c.topic;
    for (const k of Object.keys(DF)) delete DF[k];
    for (const c of ALL) {
      CARD_BY_ID[c.id] = c; STEMS[c.id] = stems(`${c.title} ${c.q || ""} ${c.text}`);
      for (const w of STEMS[c.id]) DF[w] = (DF[w] || 0) + 1;
    }
    SERIES = {};
    for (const c of ALL) if (c.series) (SERIES[c.series] = SERIES[c.series] || []).push(c);
    for (const k of Object.keys(SERIES)) SERIES[k].sort((a, b) => a.part - b.part);
  };
  // Serien schalten sich der Reihe nach frei: Teil n erscheint im normalen Feed erst, wenn Teil n-1 gesehen wurde
  const seriesOk = (c) => {
    if (!c.series || c.part <= 1) return true;
    const prev = (SERIES[c.series] || []).find((x) => x.part === c.part - 1);
    return !prev || SEEN.has(prev.id);
  };
  const decay = (at) => Math.pow(0.5, (Date.now() - (at || Date.now())) / (45 * 864e5)); // Halbwertszeit 45 Tage
  const MIN_W = 0.35, MAX_W = 2, SMOOTH = 40, EXPLORE = 0.25, MAX_SHARE = 0.3;

  const checkVal = (k) => { const c = S.checks[k]; return c ? c.a * 0.5 * Math.pow(0.5, (Date.now() - c.at) / (90 * 864e5)) : 0; };
  // Aufräumen beim Start: Bewertungen alter Meldungen (>30 Tage) werden zu einem Themen-Zähler verdichtet und einzeln gelöscht;
  // alte „gesehen“-Zeitstempel (>120 Tage) und Notizen zu längst abgelaufenen Meldungen (>90 Tage) fallen weg.
  const compact = () => {
    const now = Date.now(), dyn = /^n[0-9a-f]{10}$|^otd\d/;
    let changed = false;
    for (const [id, v] of Object.entries(S.rate)) {
      if (!dyn.test(id) || now - (v.at || now) < 30 * 864e5) continue;
      const a = S.arch[v.topic] || (S.arch[v.topic] = { up: 0, down: 0, pos: 0, neg: 0, at: now });
      const f = decay(a.at); a.pos *= f; a.neg *= f; a.at = now;
      if (v.r > 0) { a.up++; a.pos += decay(v.at); } else { a.down++; a.neg += decay(v.at); }
      delete S.rate[id]; changed = true;
    }
    for (const [id, t] of Object.entries(S.seenAt)) if (now - t > 120 * 864e5) { delete S.seenAt[id]; changed = true; }
    for (const [id, v] of Object.entries(S.notes)) if (dyn.test(id) && now - (v.at || now) > 90 * 864e5) { delete S.notes[id]; changed = true; }
    if (changed) persist();
  };

  const topicStats = () => {
    const st = {};
    for (const k of Object.keys(TOPICS)) st[k] = { up: 0, down: 0, pos: 0, neg: 0, dive: S.dive[k] || 0, pref: (S.prefs[k] || 0) + checkVal(k), shown: 0 };
    for (const v of Object.values(S.rate)) {
      const x = st[v.topic]; if (!x) continue;
      if (v.r > 0) { x.up++; x.pos += decay(v.at); } else { x.down++; x.neg += decay(v.at); }
    }
    for (const [k, a] of Object.entries(S.arch)) {          // verdichtete alte Bewertungen
      const x = st[k]; if (!x) continue;
      x.up += a.up; x.down += a.down; x.pos += a.pos * decay(a.at); x.neg += a.neg * decay(a.at);
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

  // Schon gesehene Karten kommen erst nach und nach wieder (nach ~7 Tagen wieder voll)
  const cooldown = (id) => S.seenAt[id] ? Math.min(1, Math.max(0.05, (Date.now() - S.seenAt[id]) / (7 * 864e5))) : SEEN.has(id) ? 0.3 : 1;
  // gewichtetes Mischen; ein Teil der Plätze geht an selten gesehene Themen (Entdecken)
  const weightedShuffle = (list, W, st) => list
    .map((c) => {
      const explore = Math.random() < EXPLORE;
      const wt = (explore ? 1 / (1 + ((st[c.topic] || {}).shown || 0) / 3) : W[c.topic] || 1) * cooldown(c.id);
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

  // Themen-Check: höchstens eine Frage pro ~20 Std., nur zu Themen mit wenig Rückmeldung (nicht zu den Lieblingen → weniger Bestätigungs-Verzerrung)
  const pickCheck = (st) => {
    if (topic || Date.now() - (S.lastCheck || 0) < 20 * 36e5) return null;
    const cand = Object.entries(st).filter(([k, x]) => TOPICS[k] && x.shown >= 4 && x.up + x.down <= 1 && !S.prefs[k]
      && !(S.checks[k] && Date.now() - S.checks[k].at < 60 * 864e5));
    if (!cand.length) return null;
    const min = Math.min(...cand.map(([, x]) => x.up + x.down));
    const pool = cand.filter(([, x]) => x.up + x.down === min);
    const k = pool[Math.floor(Math.random() * pool.length)][0];
    S.lastCheck = Date.now(); persist();
    return { kind: "check", topic: k, shown: st[k].shown };
  };

  const nextBatch = () => {
    const st = topicStats(), W = weights(st), keep = (c) => ratingOf(c.id) >= 0 && !S.reports[c.id];   // 👎- und gemeldete Karten kommen nicht wieder
    const w = spread(weightedShuffle(wissenPool().filter(keep), W, st).sort((a, b) => SEEN.has(a.id) - SEEN.has(b.id))); // Ungesehenes zuerst
    const n = newsPool().filter((x) => keep(x) && (W[x.topic] || 1) >= MIN_W);
    if (topic === "brief") { finite = true; return n; }   // Reihenfolge = Wichtigkeit
    if (!w.length) { finite = true; return n.slice().sort((a, b) => SEEN.has(a.id) - SEEN.has(b.id)); }          // reine News-Ansicht: einmal durch, dann Ende
    finite = false;
    if (w.length > 1 && w[0].id === lastId) w.push(w.shift());
    lastId = w[w.length - 1].id;
    const out = [];
    w.forEach((c, i) => {
      out.push(c);
      if ((i + 1) % 3 === 0 && newsPtr < n.length) out.push(n[newsPtr++]);   // jede Meldung höchstens einmal
    });
    const ck = pickCheck(st);
    if (ck) out.splice(Math.min(12, out.length), 0, ck);
    if (briefPending) {                                       // einmal pro Tag: „Heute in der Welt“ vorne
      briefPending = false;
      const b = briefItems(edition(), true);
      if (b.length >= 2) {
        S.briefEd = `${dayKey()}|${edition()}`;
        if (!S.briefSeen || S.briefSeen.day !== dayKey()) S.briefSeen = { day: dayKey(), ids: [] };
        S.briefSeen.ids = [...new Set([...S.briefSeen.ids, ...b.map((x) => x.id)])];
        persist(); out.unshift(...b);
      }
    }
    return out;
  };

  // --- Vertiefen ---
  const promptFor = (c) => c.kind === "news" || c.kind === "otd"
    ? `Ordne diese Nachricht ein (Hintergrund, Beteiligte, unterschiedliche Sichtweisen, was noch unklar ist). Antworte auf Deutsch und nenne Quellen.\n\n${c.title}\n${c.text}\n(${c.source}, ${fmtDate(c.published)})\n${c.link}`
    : `Erkläre mir das Thema „${c.title}“ ausführlich auf Deutsch (Kontext, Hintergründe, Streitpunkte, Quellen zum Weiterlesen). Ausgangspunkt:\n${c.text}`;

  const openSheet = (c) => {
    const news = c.kind === "news", otd = c.kind === "otd", ext = news || otd;
    let dived = false;   // Interesse zählt erst, wenn wirklich ein Link/Prompt genutzt wird – nicht schon beim Öffnen des Menüs
    const dive = () => { if (!dived) { dived = true; S.dive[c.topic] = (S.dive[c.topic] || 0) + 1; persist(); } };
    const q = encodeURIComponent(otd ? c.text.slice(0, 80) : news ? c.title : c.q);
    const close = () => { sheet.hidden = true; sheet.replaceChildren(); };
    const link = (href, title, sub) => h("a", { class: "act", href, target: "_blank", rel: "noopener noreferrer", onclick: dive }, title, h("small", {}, sub));
    const parts = [h("h3", {}, c.title), h("div", { class: "sub" }, "Tiefer eintauchen")];
    if (ext) parts.push(link(safeUrl(c.link), otd ? "📖 Wikipedia-Artikel lesen" : "📰 Originalartikel lesen", otd ? c.date : `${c.source} · ${fmtDate(c.published)}`));
    else parts.push(link(`https://de.wikipedia.org/w/index.php?search=${q}`, "📖 Bei Wikipedia lesen", "Suche nach: " + c.q));
    parts.push(link(`https://duckduckgo.com/?q=${q}`, "🔎 Im Web recherchieren", "Weitere Quellen finden"));
    parts.push(h("button", { class: "act", onclick: async () => { dive(); toast((await copy(promptFor(c))) ? "Prompt kopiert – in Claude einfügen" : "Kopieren nicht möglich"); } }, "🤖 Mit Claude vertiefen", h("small", {}, "Kopiert einen fertigen Prompt")));
    const t = topicOf(c);
    parts.push(h("div", { class: "refs" },
      h("b", {}, ext ? "Einordnung" : "Wo du es prüfen kannst"),
      h("p", {}, otd ? "Quelle: Wikipedia, Rubrik „Am heutigen Tag“ – von Freiwilligen gepflegt, mit Belegen im verlinkten Artikel."
        : news
        ? `Angezeigt wird die Vorschau des Anbieters (${c.source}, ${c.type}), keine eigene Zusammenfassung. Vergleiche wichtige Themen mit mehr als einer Quelle.`
        : "Diese Karte wurde von einer KI geschrieben und ist nicht automatisch faktengeprüft. Verlässliche Anlaufstellen:"),
      ...(ext ? [] : t.refs.map(([n, u]) => h("a", { href: u, target: "_blank", rel: "noopener noreferrer" }, n)))));
    const REASONS = ["Sachlich falsch oder veraltet", "Einseitig oder unpassend formuliert", "Sonstiges Problem"];
    const report = () => {
      sheet.replaceChildren(h("div", { class: "sheet" },
        h("h3", {}, "Problem melden"),
        h("div", { class: "sub" }, "Das ist keine Geschmacks-Bewertung: Die Karte wird ausgeblendet und für die Prüfung vorgemerkt, dein Themen-Profil ändert sich dadurch nicht."),
        ...(imgFor(c) ? [h("button", { class: "act", onclick: () => {
          S.badImg[c.id] = 1;
          if (c.kind === "news") S.badSrc[c.source] = (S.badSrc[c.source] || 0) + 1;
          persist(); close(); toast(c.kind === "news" && S.badSrc[c.source] >= 3 ? `Bilder von ${c.source} werden künftig ausgeblendet` : "Bild ausgeblendet");
          document.querySelectorAll(`.card[data-id="${c.id}"]`).forEach((e) => { e.classList.remove("has-img"); const im = e.querySelector(".cover img"); if (im) im.remove(); const cr = e.querySelector(".credit"); if (cr) cr.remove(); });
        } }, "🖼️ Nur das Bild passt nicht", h("small", {}, "Die Karte bleibt, das Bild verschwindet"))] : []),
        ...REASONS.map((r) => h("button", { class: "act", onclick: () => {
          S.reports[c.id] = { reason: r, title: c.title, topic: c.topic, at: Date.now() }; persist();
          close(); toast("Danke – Karte wird nicht mehr gezeigt");
          document.querySelectorAll(`.card[data-id="${c.id}"]`).forEach((e) => { const nx = e.nextElementSibling; if (nx) nx.scrollIntoView({ behavior: "smooth" }); setTimeout(() => e.remove(), 500); });
        } }, r)),
        h("button", { class: "act", onclick: close }, "Abbrechen")));
    };
    parts.push(h("button", { class: "act", onclick: report }, "⚑ Problem melden", h("small", {}, "Falsch, veraltet oder einseitig?")));
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
    const nb = el.querySelector(".b-note"); if (nb) nb.classList.toggle("on", !!S.notes[id]);
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
    const im = imgFor(c);
    const credit = !im ? [] : c.kind === "news" ? [h("span", { class: "credit" }, `🖼️ Bild: ${c.source}`)]
      : [h("a", { class: "credit", href: safeUrl(im.page), target: "_blank", rel: "noopener noreferrer" }, `🖼️ ${im.desc ? (im.desc.length > 46 ? im.desc.slice(0, 45) + "…" : im.desc) + " · " : ""}${im.by} · ${im.lic}`)];
    if (c.kind === "otd") return h("div", { class: "meta" }, h("span", {}, `📅 ${c.date} · Wikipedia`));
    if (c.kind !== "news") return h("div", { class: "meta" }, h("span", {}, `📚 Wissenskarte · KI-verfasst · Stand ${ASOF}`), ...credit);
    const old = isOld(c.published), expired = !isFresh(c);
    return h("div", { class: "meta" },
      h("span", {}, `📰 ${c.source} · ${c.type}`),
      h("span", { class: old || expired ? "old" : "" }, `${expired ? "⏳ nicht mehr aktuell · " : old ? "⏳ " : "🕒 "}${fmtAge(c.published)} · ${fmtDate(c.published)}`),
      ...(c.also && c.also.length ? [h("span", { class: "also" }, "🔀 Auch bei: ", ...c.also.flatMap((a, i) => [i ? " · " : "", h("a", { href: safeUrl(a.link), target: "_blank", rel: "noopener noreferrer" }, a.source)]))] : []),
      ...credit,
      ...(c.tag ? [h("span", {}, `📍 ${c.tag}`)] : []),
      ...(c.lang === "en" ? [h("span", {}, "🇬🇧 englischsprachig")] : []));
  };

  // Karte gilt als gesehen, wenn sie zu 60 % sichtbar ist
  let seenTimer;
  const seenObs = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = e.target.dataset.id;
    if (!SEEN.has(id)) {
      SEEN.add(id); S.seen = [...SEEN].slice(-3000); S.seenAt[id] = Date.now();
      clearTimeout(seenTimer); seenTimer = setTimeout(persist, 800);
    }
  }), { root: feed, threshold: 0.6 });

  const checkEl = (c) => {
    const t = TOPICS[c.topic];
    const answer = (a, msg) => {
      S.checks[c.topic] = { a, at: Date.now() }; persist(); toast(msg);
      const nx = el.nextElementSibling; if (nx && nx.classList.contains("card")) setTimeout(() => nx.scrollIntoView({ behavior: "smooth" }), 250);
    };
    // Reihenfolge der Antworten zufällig, damit keine Position bevorzugt wird
    const opts = shuffle([["Öfter", 1], ["Wie bisher", 0], ["Seltener", -1]]).map(([label, a]) =>
      h("button", { class: "opt", onclick: () => answer(a, "Danke – ist notiert") }, label));
    const el = h("article", { class: "card check", style: `--c:${t.c}` },
      h("div", { class: "big" }, t.emoji),
      h("span", { class: "tag" }, "💬 Kurze Frage"),
      h("h2", {}, `${t.name}: Wie passt dir das im Feed?`),
      h("p", {}, `Du hast schon ${c.shown} Karten dazu gesehen, aber kaum bewertet. Wie oft sollen sie künftig vorkommen? Es gibt keine falsche Antwort.`),
      h("div", { class: "opts" }, ...opts),
      h("button", { class: "more", onclick: () => answer(0, "Okay, kein Problem") }, "Überspringen"));
    return el;
  };

  // Eigenes Cover als Rückfall (immer da) – deterministisch aus der Karten-ID, in Themenfarbe
  const hash = (str) => { let x = 2166136261; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; };
  const genCover = (id, color, topicKey) => {
    let seed = hash(id); const r = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    let shapes = "";
    for (let i = 0; i < 4; i++) {
      const x = +(r() * 100).toFixed(1), y = +(r() * 60).toFixed(1), z = +(10 + r() * 38).toFixed(1), o = (0.07 + r() * 0.16).toFixed(2);
      shapes += r() < 0.5
        ? `<circle cx='${x}' cy='${y}' r='${z}' fill='white' fill-opacity='${o}'/>`
        : `<rect x='${+(x - z / 2).toFixed(1)}' y='${+(y - z / 2).toFixed(1)}' width='${z}' height='${z}' rx='${+(z * 0.3).toFixed(1)}' transform='rotate(${Math.round(r() * 90)} ${x} ${y})' fill='white' fill-opacity='${o}'/>`;
    }
    shapes += (window.ART && (window.ART[topicKey] || window.ART._default)) || "";
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid slice'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${color}'/><stop offset='1' stop-color='#0b0d12'/></linearGradient></defs><rect width='100' height='100' fill='url(#g)'/>${shapes}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  };
  // Foto: Wissenskarten aus images.json (Wikimedia Commons, freie Lizenz), Meldungen mit Bild aus dem Feed; sonst nur das Cover
  const imgFor = (c) => {
    if (S.badImg[c.id]) return null;
    if (c.kind === "news") return c.img && (S.badSrc[c.source] || 0) < 3 ? { u: c.img, news: true } : null;   // Quelle mit 3× „Bild passt nicht“ → keine Bilder mehr
    if (c.kind) return null;
    const i = IMG[c.id];
    return i && i.u ? i : null;
  };
  const coverEl = (c, t) => {
    const el = h("div", { class: "cover" });
    el.style.backgroundImage = genCover(c.id, t.c, c.topic);
    const im = imgFor(c);
    if (!im) el.dataset.illu = "1";
    if (im) {
      const img = h("img", { alt: "", loading: "lazy", decoding: "async", referrerpolicy: "no-referrer", src: safeUrl(im.u) });
      img.addEventListener("error", () => { img.remove(); if (el.parentElement) el.parentElement.classList.add("illu"); });
      img.addEventListener("load", () => el.parentElement && el.parentElement.classList.add("has-img"));
      el.append(img);
    }
    return el;
  };

  // --- Notiz zu einer Karte (frei formuliert; ändert den Feed nicht automatisch)
  const openNote = (c) => {
    const close = () => { sheet.hidden = true; sheet.replaceChildren(); };
    const ta = h("textarea", { rows: "5", maxlength: "500", placeholder: "Was gefällt dir hier, was nicht? Ideen, Fragen, Wünsche …" });
    ta.value = (S.notes[c.id] && S.notes[c.id].t) || "";
    const save = () => {
      const t = ta.value.trim();
      if (!t) delete S.notes[c.id];
      else {
        S.notes[c.id] = { t: t.slice(0, 500), title: c.title, topic: c.topic, at: Date.now() };
        const keys = Object.keys(S.notes);
        if (keys.length > 200) delete S.notes[keys.sort((a, b) => S.notes[a].at - S.notes[b].at)[0]];
      }
      persist(); syncRail(c.id); close(); toast(t ? "Notiz gespeichert" : "Notiz gelöscht");
    };
    sheet.replaceChildren(h("div", { class: "sheet" },
      h("h3", {}, c.title), h("div", { class: "sub" }, "Deine Notiz zu dieser Karte"),
      ta,
      h("button", { class: "act", onclick: save }, "Speichern"),
      ...(S.notes[c.id] ? [h("button", { class: "act", onclick: () => { ta.value = ""; save(); } }, "Notiz löschen")] : []),
      h("button", { class: "act", onclick: close }, "Abbrechen")));
    sheet.hidden = false; sheet.onclick = (e) => { if (e.target === sheet) close(); };
    setTimeout(() => ta.focus(), 50);
  };

  // „Weiter im Thema“: verwandte Karten (Serien-Teile, ausdrückliche Verweise, sonst die inhaltlich nächsten) direkt unter der Karte einfügen
  const threadFor = (c) => {
    const out = [], used = new Set([c.id]);
    const add = (x) => { if (x && !used.has(x.id) && ratingOf(x.id) >= 0 && !S.reports[x.id]) { used.add(x.id); out.push(x); } };
    if (c.series) (SERIES[c.series] || []).filter((x) => x.part > c.part).forEach(add);
    (c.more || []).forEach((id) => add(CARD_BY_ID[id]));
    const mine = c.kind ? stems(`${c.title} ${c.text}`) : STEMS[c.id] || new Set();
    // Verwandtschaft konservativ: im selben Thema genügt ein gemeinsames Fachwort, über Themengrenzen hinweg braucht es mindestens drei
    // (reine Wortüberschneidung erzeugt bei kleinem Bestand sonst Zufallstreffer; gezielte Verweise stehen in `more`)
    const rel = ALL.filter((x) => !used.has(x.id) && (!x.series || x.part <= 1 || seriesOk(x)))
      .map((x) => {
        const shared = [...mine].filter((w) => (STEMS[x.id] || new Set()).has(w) && idf(w) >= 3.3), same = x.topic === c.topic;
        return { x, same, ok: (same && shared.length >= 1) || shared.length >= 3,
          sc: shared.reduce((a, w) => a + idf(w), 0) + (same ? 1.5 : 0) + Math.random() * 0.5 - (SEEN.has(x.id) ? 0.7 : 0) };
      }).sort((a, b) => b.sc - a.sc);
    for (const r of rel) { if (out.length >= 5) break; if (r.ok) add(r.x); }
    if (out.length < 3) for (const r of shuffle(rel.filter((q) => q.same)).sort((a, b) => SEEN.has(a.x.id) - SEEN.has(b.x.id))) { if (out.length >= 3) break; add(r.x); }   // sonst wenigstens im Thema bleiben
    return out.slice(0, 6);
  };
  const openThread = (c, el) => {
    if (el.dataset.thread) { const nx = el.nextElementSibling; if (nx) nx.scrollIntoView({ behavior: "smooth" }); return; }
    const list = threadFor(c);
    if (!list.length) return toast("Dazu gibt es noch nichts Weiteres");
    el.dataset.thread = "1";
    const cards = list.map((x, i) => cardEl(x, { thread: { i: i + 1, n: list.length } }));
    el.after(...cards);
    setTimeout(() => cards[0].scrollIntoView({ behavior: "smooth" }), 80);
    watchSentinel();
  };

  const cardEl = (c, opts = {}) => {
    if (c.kind === "check") return checkEl(c);
    const t = topicOf(c), news = c.kind === "news", wasSeen = SEEN.has(c.id), fresh = !wasSeen && !c.kind;
    const el = h("article", { class: "card", "data-id": c.id, style: `--c:${t.c}` },
      coverEl(c, t),
      h("div", { class: "big" }, news ? "📰" : c.kind === "otd" ? "📅" : t.emoji),
      h("span", { class: "tag" }, c._b ? `${ED[c._b.ed].icon} ${ED[c._b.ed].name} · ${c._b.i}/${c._b.n}` : `${t.emoji} ${news ? "Aktuell · " : c.kind === "otd" ? "Heute · " : ""}${t.name}`,
        ...(opts.thread ? [h("b", { class: "seriestag" }, `🕳️ Faden ${opts.thread.i}/${opts.thread.n}`)] : []),
        ...(c.series ? [h("b", { class: "seriestag" }, `📖 ${c.series} · Teil ${c.part}/${c.of}`)] : []), ...(fresh ? [h("b", { class: "new" }, "NEU")] : mode === "feed" && wasSeen ? [h("b", { class: "seenchip" }, S.seenAt[c.id] ? `✓ gesehen ${fmtAge(new Date(S.seenAt[c.id]).toISOString()).replace("vor ", "vor ")}` : "✓ gesehen")] : [])),
      h("h2", {}, c.title),
      c.text ? h("p", {}, c.text) : "",
      metaLine(c),
      h("div", { class: "acts" },
        h("button", { class: "more", onclick: () => openSheet(c) }, "Tiefer eintauchen →"),
        h("button", { class: "more alt", onclick: () => openThread(c, el) }, c.series && c.part < c.of ? "Nächster Teil →" : "🕳️ Weiter im Thema")),
      h("div", { class: "rail" },
        h("button", { class: "b-up" + (ratingOf(c.id) > 0 ? " on" : ""), "aria-label": "Mehr davon", onclick: () => rate(c, el, 1) }, "👍"),
        h("button", { class: "b-down" + (ratingOf(c.id) < 0 ? " on" : ""), "aria-label": "Weniger davon", onclick: () => rate(c, el, -1) }, "👎"),
        h("button", { class: "b-note" + (S.notes[c.id] ? " on" : ""), "aria-label": "Notiz", onclick: () => openNote(c) }, "💬"),
        h("button", { class: "b-save" + (has("saved", c.id) ? " on" : ""), "aria-label": "Speichern", onclick: () => toggleSave(c) }, "🔖"),
        h("button", { "aria-label": "Teilen", onclick: () => share(c) }, "↗")));
    if (!imgFor(c)) el.classList.add("illu");                  // ohne Foto: Illustration statt großem Emoji
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
    if (finite) feed.append(h("div", { class: "end" }, topic === "brief" ? `Das war die ${ED[edition()].name} ✅ – jetzt in Ruhe stöbern` : "Du bist auf dem neuesten Stand ✅"));
    watchSentinel();
  };

  // --- Profil (lokal, bleibt auf diesem Gerät) ---
  const exportJson = () => JSON.stringify({ app: "knowgram", v: 1, at: new Date().toISOString(), profile: S.profile, prefs: S.prefs, dive: S.dive, strength: S.strength, checks: S.checks, wishes: S.wishes, reports: S.reports, notes: S.notes, arch: S.arch, badImg: S.badImg, badSrc: S.badSrc, night: S.night, nightFrom: S.nightFrom, sleep: S.sleep, rate: S.rate, saved: S.saved }, null, 1);
  const importJson = (txt) => {
    const j = JSON.parse(txt);
    if (!j || j.app !== "knowgram" || j.v !== 1 || typeof j.rate !== "object") throw new Error("Format");
    const rate = {};
    for (const [id, v] of Object.entries(j.rate || {})) if (v && (v.r === 1 || v.r === -1)) rate[String(id).slice(0, 40)] = { r: v.r, title: String(v.title || "").slice(0, 200), topic: TOPICS[v.topic] ? v.topic : "", at: Number.isFinite(v.at) ? v.at : Date.now() };
    const prefs = {};
    for (const [k, v] of Object.entries(j.prefs || {})) if (TOPICS[k] && (v === 1 || v === -1)) prefs[k] = v;
    const dive = {};
    for (const [k, v] of Object.entries(j.dive || {})) if (TOPICS[k] && Number.isFinite(v)) dive[k] = Math.max(0, Math.min(999, v));
    const checks = {};
    for (const [k, v] of Object.entries(j.checks || {})) if (TOPICS[k] && v && [-1, 0, 1].includes(v.a)) checks[k] = { a: v.a, at: Number.isFinite(v.at) ? v.at : Date.now() };
    S.checks = checks;
    S.wishes = (Array.isArray(j.wishes) ? j.wishes : []).filter((w) => w && typeof w.t === "string").slice(0, 30).map((w) => ({ t: w.t.slice(0, 80), at: Number.isFinite(w.at) ? w.at : Date.now() }));
    const reports = {};
    for (const [id, v] of Object.entries(j.reports || {})) if (v && typeof v.reason === "string") reports[String(id).slice(0, 40)] = { reason: v.reason.slice(0, 60), title: String(v.title || "").slice(0, 200), topic: TOPICS[v.topic] ? v.topic : "", at: Number.isFinite(v.at) ? v.at : Date.now() };
    S.reports = reports;
    const notes = {};
    for (const [id, v] of Object.entries(j.notes || {})) if (v && typeof v.t === "string" && v.t.trim()) notes[String(id).slice(0, 40)] = { t: v.t.slice(0, 500), title: String(v.title || "").slice(0, 200), topic: TOPICS[v.topic] ? v.topic : "", at: Number.isFinite(v.at) ? v.at : Date.now() };
    S.notes = Object.fromEntries(Object.entries(notes).slice(-200));
    const num = (x) => (Number.isFinite(x) && x >= 0 ? Math.min(x, 1e6) : 0), arch = {};
    for (const [k, a] of Object.entries(j.arch || {})) if (TOPICS[k] && a) arch[k] = { up: num(a.up), down: num(a.down), pos: num(a.pos), neg: num(a.neg), at: Number.isFinite(a.at) ? a.at : Date.now() };
    S.arch = arch;
    S.badImg = Object.fromEntries(Object.keys(j.badImg || {}).slice(0, 2000).map((k) => [String(k).slice(0, 40), 1]));
    S.badSrc = Object.fromEntries(Object.entries(j.badSrc || {}).filter(([, v]) => Number.isFinite(v)).slice(0, 50).map(([k, v]) => [String(k).slice(0, 40), Math.min(99, v)]));
    if (["auto", "on", "off"].includes(j.night)) S.night = j.night;
    if ([20, 21, 22, 23].includes(j.nightFrom)) S.nightFrom = j.nightFrom;
    if ([0, 20, 40, 60].includes(j.sleep)) S.sleep = j.sleep;
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

    const wishIn = h("input", { placeholder: "z. B. Meeresbiologie, Architektur, Kryptografie …", maxlength: "80" });
    const wishList = h("div", { class: "pf-list" });
    const drawWishes = () => wishList.replaceChildren(...S.wishes.map((w, i) => h("div", { class: "it" }, h("span", {}, `💡 ${w.t}`),
      h("button", { onclick: () => { S.wishes.splice(i, 1); persist(); drawWishes(); } }, "entfernen"))));
    const addWish = () => { const t = wishIn.value.trim(); if (!t) return; if (S.wishes.length >= 30) return toast("Maximal 30 Wünsche"); S.wishes.push({ t: t.slice(0, 80), at: Date.now() }); wishIn.value = ""; persist(); drawWishes(); toast("Wunsch notiert"); };
    wishIn.addEventListener("keydown", (e) => { if (e.key === "Enter") addWish(); });
    drawWishes();
    const seg = (opts, cur, pick) => {
      const btns = opts.map(([label, v]) => {
        const b = h("button", { class: "seg" + (cur === v ? " on" : ""), onclick: () => { pick(v); btns.forEach((x) => x.classList.toggle("on", x === b)); } }, label);
        return b;
      });
      return h("div", { class: "segs" }, ...btns);
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
      sec("Abend & Schlaf",
        h("p", { class: "pf-note" }, "Abendmodus: wärmerer, gedimmter Farbton (Mond oben antippen wechselt schnell). „Auto“ schaltet ihn ab der gewählten Uhrzeit bis 6 Uhr ein."),
        seg([["Auto", "auto"], ["An", "on"], ["Aus", "off"]], S.night, (v) => { S.night = v; persist(); applyNight(); }),
        h("p", { class: "pf-note" }, "Auto ab"),
        seg([["20 Uhr", 20], ["21 Uhr", 21], ["22 Uhr", 22], ["23 Uhr", 23]], nightFrom(), (v) => { S.nightFrom = v; persist(); applyNight(); }),
        h("p", { class: "pf-note" }, `Schlaf-Timer: läuft erst ab ${nightFrom()} Uhr (bis 6 Uhr). Danach erscheint nach der eingestellten Zeit „Gute Nacht“; mit einem Tipp gibst du dir 10 Minuten mehr.`),
        seg([["Aus", 0], ["20 Min", 20], ["40 Min", 40], ["60 Min", 60]], S.sleep, (v) => { S.sleep = v; persist(); startSleep(v); }),
        h("p", { class: "pf-note" }, "Schrift"),
        seg([["Normal", false], ["Groß", true]], !!S.big, (v) => { S.big = v; persist(); applyNight(); })),
      sec("Meine Notizen",
        h("div", { class: "pf-list" }, ...(Object.keys(S.notes).length
          ? Object.entries(S.notes).sort((a, b) => b[1].at - a[1].at).slice(0, 10).map(([id, v]) => h("div", { class: "it" },
              h("span", {}, `${(TOPICS[v.topic] || {}).emoji || "•"} ${v.title}: „${v.t.length > 120 ? v.t.slice(0, 120) + " …" : v.t}“`),
              h("button", { onclick: () => { delete S.notes[id]; persist(); render(); } }, "löschen")))
          : [h("p", { class: "pf-empty" }, "Tippe bei einer Karte auf 💬, um eine Idee oder einen Gedanken festzuhalten. Notizen ändern den Feed nicht automatisch; sie sind für dich (und stehen im Export).")]))),
      sec("Feedback",
        h("p", { class: "pf-note" }, "Themenwunsch ohne Wertung: Was würdest du gern entdecken? Es fließt nicht in deine Bewertungen ein."),
        h("div", { class: "pf-wish" }, wishIn, h("button", { class: "seg", onclick: addWish }, "Hinzufügen")),
        wishList,
        h("p", { class: "pf-note" }, `Gemeldete Karten: ${Object.keys(S.reports).length}`),
        h("div", { class: "pf-list" }, ...Object.entries(S.reports).slice(-8).reverse().map(([id, v]) => h("div", { class: "it" },
          h("span", {}, `${(TOPICS[v.topic] || {}).emoji || "•"} ${v.title} – ${v.reason}`),
          h("button", { onclick: () => { delete S.reports[id]; persist(); render(); } }, "aufheben"))))),
      sec("Sync zwischen Geräten", syncBox()),
      sec("Sichern & Übertragen",
        h("button", { class: "act", onclick: async () => toast((await copy(exportJson())) ? "Geschmack kopiert" : "Kopieren nicht möglich") }, "📋 Geschmack kopieren", h("small", {}, "Als Text, z. B. zum Sichern oder um ihn Claude zu zeigen")),
        box,
        h("button", { class: "act", onclick: () => { try { importJson(box.value); toast("Geschmack geladen"); render(); } catch (e) { toast("Das ist kein gültiger Export"); } } }, "📥 Einfügen & laden"),
        h("button", { class: "act", onclick: () => { if (confirm("Wirklich alles zurücksetzen (Bewertungen, Gespeichertes, Profil)?")) { S = { rate: {}, prefs: {}, dive: {}, strength: 0.5, wishes: [], reports: {}, checks: {}, lastCheck: 0, notes: {}, arch: {}, seenAt: {}, badImg: {}, badSrc: {}, night: "auto", nightFrom: 23, sleep: 0, big: false, briefEd: "", briefSeen: null, profile: { name: "", emoji: "🙂" }, saved: [], savedNews: {}, seen: [] }; SEEN.clear(); persist(); render(); } } }, "🗑️ Alles zurücksetzen")));
  };

  const render = () => {
    obs && obs.disconnect();
    feed.replaceChildren(); feed.scrollTop = 0; newsPtr = 0;
    $("#app").dataset.mode = mode;
    briefPending = mode === "feed" && !topic && S.briefEd !== `${dayKey()}|${edition()}`;
    if (mode === "profile") { feed.append(renderProfile()); return; }
    if (mode === "saved") {
      const list = [...ALL.filter((c) => has("saved", c.id)), ...Object.values(S.savedNews)]
        .filter((c) => !topic || topic === "news" ? (topic !== "news" || c.kind === "news") : c.topic === topic);
      if (!list.length) feed.append(h("div", { class: "empty" }, "Noch nichts gespeichert. Tippe auf 🔖, um Karten hier zu sammeln."));
      else feed.append(...list.map(cardEl));
    } else appendBatch();
  };

  // --- Abendmodus & Schlaf-Timer ---
  const moon = $("#moon");
  const nightFrom = () => ([20, 21, 22, 23].includes(S.nightFrom) ? S.nightFrom : 23);   // „Auto“ gilt von dieser Uhrzeit bis 6 Uhr
  const nightOn = () => S.night === "on" || (S.night !== "off" && (new Date().getHours() >= nightFrom() || new Date().getHours() < 6));
  const applyNight = () => {
    const r = document.documentElement;
    r.dataset.night = nightOn() ? "1" : ""; r.dataset.big = S.big ? "1" : "";
    moon.classList.toggle("on", nightOn());
  };
  let sleepT, sleepTick, sleepGate, sleepEnd = 0;
  const inNight = () => { const hh = new Date().getHours(); return hh >= nightFrom() || hh < 6; };
  const updateMoon = () => {
    const left = sleepEnd ? Math.max(0, Math.ceil((sleepEnd - Date.now()) / 60000)) : 0;
    moon.textContent = left ? `🌙 ${left}′` : S.sleep > 0 ? `🌙 ab ${nightFrom()}` : "🌙";   // „ab 23“ = Timer wartet auf die Uhrzeit
  };
  const showGoodnight = () => {
    if ($("#goodnight")) return;
    const g = h("div", { id: "goodnight", class: "gn" },
      h("div", { class: "gn-moon" }, "🌙"), h("h2", {}, "Gute Nacht"),
      h("p", {}, "Genug für heute – der Rest wartet morgen auf dich."),
      h("button", { class: "act", onclick: () => { g.remove(); startSleep(10, true); } }, "Noch 10 Minuten"),
      h("button", { class: "gn-off", onclick: () => { g.remove(); S.sleep = 0; persist(); startSleep(0); } }, "Timer ausschalten"));
    $("#app").append(g);
  };
  // Der Timer ist erst in der Nacht-Zeit (Standard ab 23 Uhr) aktiv: davor wartet er, ab dann läuft die eingestellte Zeit
  const startSleep = (min, force) => {
    clearTimeout(sleepT); clearInterval(sleepTick); clearInterval(sleepGate); sleepEnd = 0;
    const arm = () => { sleepEnd = Date.now() + min * 60000; sleepT = setTimeout(showGoodnight, min * 60000); updateMoon(); };
    if (min > 0) {
      if (force || inNight()) arm();
      else sleepGate = setInterval(() => { if (inNight()) { clearInterval(sleepGate); arm(); } }, 30000);
      sleepTick = setInterval(updateMoon, 20000);
    }
    updateMoon();
  };
  moon.addEventListener("click", () => {
    const order = ["auto", "on", "off"]; S.night = order[(order.indexOf(S.night) + 1) % 3]; persist(); applyNight();
    toast(S.night === "auto" ? `Abendmodus: automatisch (${nightFrom()}–6 Uhr)` : S.night === "on" ? "Abendmodus: an" : "Abendmodus: aus");
  });
  setInterval(applyNight, 5 * 60000);

  // --- Sync zwischen Geräten (Supabase, ohne Konto: der Sync-Code ist das Geheimnis) ---
  const CFG = window.KG_CONFIG || {}, CODE_KEY = "knowgram_code", DYN = /^n[0-9a-f]{10}$|^otd\d/;
  const syncReady = () => !!(CFG.url && CFG.key);
  const getCode = () => { try { return localStorage.getItem(CODE_KEY) || ""; } catch (e) { return ""; } };
  const setCode = (c) => { try { if (c) localStorage.setItem(CODE_KEY, c); else localStorage.removeItem(CODE_KEY); } catch (e) {} };
  const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";                     // 32 Zeichen, ohne verwechselbare (0/O, 1/I)
  const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => ALPHA[b % 32]).join("");   // 24 × 5 Bit = 120 Bit
  const normCode = (t) => String(t || "").toUpperCase().split("").filter((ch) => ALPHA.includes(ch)).join("");
  const fmtCode = (c) => c.match(/.{1,4}/g).join("-");
  const rpc = async (fn, args) => {
    const r = await fetch(`${CFG.url}/rest/v1/rpc/${fn}`, { method: "POST", headers: { "Content-Type": "application/json", apikey: CFG.key }, body: JSON.stringify(args) });
    if (!r.ok) throw new Error(`${fn} ${r.status}`);
    return r.json();
  };
  const canon = (v) => Array.isArray(v) ? v.map(canon) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v;
  const SHARED = ["rate", "notes", "reports", "checks", "arch", "badImg", "badSrc", "dive", "seenAt", "seen", "saved", "savedNews", "wishes", "prefs", "profile", "strength", "night", "nightFrom", "sleep", "big", "settingsAt"];
  const packState = () => Object.fromEntries(SHARED.map((k) => [k, S[k]]));
  const newer = (a, b) => (((a && a.at) || 0) >= ((b && b.at) || 0) ? a : b);
  const mergeMaps = (a = {}, b = {}) => { const o = { ...a }; for (const [k, v] of Object.entries(b)) o[k] = k in o ? newer(o[k], v) : v; return o; };
  const maxMaps = (a = {}, b = {}) => { const o = { ...a }; for (const [k, v] of Object.entries(b)) o[k] = Math.max(o[k] || 0, v || 0); return o; };
  // Zusammenführen: Hinzugefügtes bleibt erhalten, bei Widerspruch gewinnt der neuere Eintrag; Einstellungen als Ganzes die neuere Seite.
  // (Gelöschtes wird nicht überall gelöscht – dafür geht nichts verloren.)
  const mergeStates = (L, R) => {
    const M = {};
    M.rate = mergeMaps(L.rate, R.rate);
    for (const [id, v] of Object.entries(M.rate)) if (DYN.test(id) && Date.now() - ((v && v.at) || 0) > 30 * 864e5) delete M.rate[id];   // alte Meldungs-Bewertungen sind schon verdichtet
    M.notes = mergeMaps(L.notes, R.notes); M.reports = mergeMaps(L.reports, R.reports);
    M.checks = mergeMaps(L.checks, R.checks); M.arch = mergeMaps(L.arch, R.arch);
    M.badImg = { ...(R.badImg || {}), ...(L.badImg || {}) };
    M.badSrc = maxMaps(L.badSrc, R.badSrc); M.dive = maxMaps(L.dive, R.dive); M.seenAt = maxMaps(L.seenAt, R.seenAt);
    M.seen = [...new Set([...(R.seen || []), ...(L.seen || [])])].slice(-3000);
    M.saved = [...new Set([...(R.saved || []), ...(L.saved || [])])];
    M.savedNews = { ...(R.savedNews || {}), ...(L.savedNews || {}) };
    const wl = {}; for (const w of [...(R.wishes || []), ...(L.wishes || [])]) if (w && w.t) wl[w.t] = wl[w.t] ? newer(wl[w.t], w) : w;
    M.wishes = Object.values(wl).slice(0, 30);
    const useR = (R.settingsAt || 0) > (L.settingsAt || 0), src = useR ? R : L, alt = useR ? L : R;
    for (const k of ["prefs", "profile", "strength", "night", "nightFrom", "sleep", "big"]) M[k] = src[k] !== undefined ? src[k] : alt[k];
    M.settingsAt = Math.max(L.settingsAt || 0, R.settingsAt || 0);
    return M;
  };
  let syncBusy = false, syncTimer = 0, applying = false, syncMsg = "";
  const applyMerged = (M) => {
    applying = true;
    for (const k of SHARED) if (M[k] !== undefined) S[k] = M[k];
    SEEN.clear(); S.seen.forEach((id) => SEEN.add(id));
    lastSig = settingsSig(); persist(true); applying = false;
    if (typeof applyNight === "function") { applyNight(); startSleep(S.sleep); }
  };
  const syncNow = async (manual) => {
    const code = getCode();
    if (!code || !syncReady() || syncBusy) return;
    syncBusy = true;
    try {
      const remote = await rpc("kg_get", { code });
      const before = JSON.stringify(canon(packState()));
      if (remote && remote.state) applyMerged(mergeStates(packState(), remote.state));
      const body = packState();
      if (!remote || !remote.state || JSON.stringify(canon(remote.state)) !== JSON.stringify(canon(body))) await rpc("kg_put", { code, new_state: body });
      S.syncAt = Date.now(); syncMsg = ""; persist(true);
      if (manual) toast("Synchronisiert");
      if (mode === "profile" && before !== JSON.stringify(canon(packState()))) render();     // Profil neu zeichnen, wenn sich etwas geändert hat
    } catch (e) { syncMsg = "Sync fehlgeschlagen – ich versuche es später erneut"; if (manual) toast(syncMsg); }
    finally { syncBusy = false; }
  };
  onChange = () => { if (applying || !getCode() || !syncReady()) return; clearTimeout(syncTimer); syncTimer = setTimeout(() => syncNow(false), 8000); };

  const syncBox = () => {
    const box = h("div");
    const draw = () => {
      const code = getCode(); let shown = false;
      const kids = [];
      if (!syncReady()) kids.push(h("p", { class: "pf-note" }, "Sync ist noch nicht eingerichtet."));
      else if (!code) {
        const inp = h("input", { placeholder: "Code von deinem anderen Gerät", autocomplete: "off", autocapitalize: "characters" });
        kids.push(
          h("p", { class: "pf-note" }, "Ohne Konto und E-Mail: Ein geheimer Sync-Code verbindet deine Geräte. Ein Gerät erzeugt ihn, die anderen geben ihn einmal ein."),
          h("button", { class: "act", onclick: () => { setCode(newCode()); syncNow(true); draw(); } }, "🔑 Sync einschalten", h("small", {}, "Erzeugt einen neuen Sync-Code")),
          inp,
          h("button", { class: "act", onclick: async () => {
            const c = normCode(inp.value);
            if (c.length !== 24) return toast("Der Code hat 24 Zeichen");
            try { const r = await rpc("kg_get", { code: c }); if (!r || !r.state) return toast("Diesen Code kenne ich nicht – Tippfehler?"); }
            catch (e) { return toast("Keine Verbindung zum Sync-Server"); }
            setCode(c); await syncNow(true); render();
          } }, "🔗 Mit Code verbinden", h("small", {}, "Lädt deine Daten von dort und führt sie zusammen")));
      } else {
        const codeEl = h("code", { class: "synccode" }, "••••-••••-••••-••••-••••-••••");
        kids.push(
          h("p", { class: "pf-note" }, "Sync ist an. Dein Code ist der Schlüssel zu deinen Daten – bewahre ihn sicher auf (z. B. im Passwortmanager). Ohne ihn kannst du die Daten nicht wiederherstellen; wer ihn kennt, kann sie lesen."),
          codeEl,
          h("div", { class: "segs" },
            h("button", { class: "seg", onclick: () => { shown = !shown; codeEl.textContent = shown ? fmtCode(code) : "••••-••••-••••-••••-••••-••••"; } }, "Anzeigen"),
            h("button", { class: "seg", onclick: async () => toast((await copy(fmtCode(code))) ? "Code kopiert" : "Kopieren nicht möglich") }, "Kopieren")),
          h("button", { class: "act", onclick: async () => { await syncNow(true); draw(); } }, "🔄 Jetzt synchronisieren", h("small", {}, S.syncAt ? `Zuletzt: ${new Date(S.syncAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}${syncMsg ? " · " + syncMsg : ""}` : syncMsg || "Noch nicht synchronisiert")),
          h("button", { class: "act", onclick: () => { if (confirm("Sync auf diesem Gerät beenden? Deine Daten bleiben hier und auf dem Server erhalten.")) { setCode(""); draw(); } } }, "Sync auf diesem Gerät beenden"));
      }
      box.replaceChildren(...kids);
    };
    draw();
    return box;
  };

  // --- Kopfbereich ---
  const drawChips = () => {
    const chip = (k, label, color) => h("button", { class: "chip" + (topic === k ? " on" : ""), "data-t": k, style: color ? `--c:${color}` : "", onclick: () => { topic = k; drawChips(); render(); } }, label);
    chips.replaceChildren(chip("", "Alle"), ...(briefItems().length >= 2 ? [chip("brief", ED[edition()].chip, "#2563eb")] : []), chip("news", "📰 Aktuell", "#e11d48"),
      ...Object.entries(TOPICS).filter(([k]) => ALL.some((c) => c.topic === k) || NEWS.some((n) => n.topic === k))
        .map(([k, t]) => chip(k, `${t.emoji} ${t.name}`, t.c)));
  };
  document.querySelectorAll(".modes button[data-mode]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    document.querySelectorAll(".modes button[data-mode]").forEach((x) => x.classList.toggle("on", x === b));
    render();
  }));

  // Beim Zurückkehren in die App nach längerer Pause: Nachrichten neu laden
  document.addEventListener("visibilitychange", async () => {
    if (document.hidden) { hiddenAt = Date.now(); return; }
    if (hiddenAt && Date.now() - hiddenAt > 2 * 60000) syncNow(false);
    if (hiddenAt && Date.now() - hiddenAt > 15 * 60000 && (await loadNews())) { indexMeta(); drawChips(); toast("Nachrichten aktualisiert"); }
  });

  applyNight(); startSleep(S.sleep);
  setTimeout(() => syncNow(false), 1500);          // beim Start abgleichen (falls Sync an)
  (async () => { await Promise.all([loadNews(), loadOtd(), loadImages()]); indexMeta(); compact(); drawChips(); render(); })();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
