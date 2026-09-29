(() => {
  const TOPICS = window.TOPICS, ALL = window.CARDS;
  const ASOF = "09/2026"; // Stand der handgeschriebenen Wissenskarten
  const $ = (s) => document.querySelector(s);
  const feed = $("#feed"), chips = $("#chips"), sheet = $("#sheet"), toastEl = $("#toast");

  // --- Zustand (localStorage, darf fehlschlagen) ---
  let S = { liked: [], saved: [], savedNews: {} };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem("knowgram") || "{}")); } catch (e) {}
  const persist = () => { try { localStorage.setItem("knowgram", JSON.stringify(S)); } catch (e) {} };
  const has = (k, id) => S[k].includes(id);
  const flip = (k, id) => { S[k] = has(k, id) ? S[k].filter((x) => x !== id) : [...S[k], id]; persist(); };

  let mode = "feed", topic = "", lastId = null, finite = false;
  let NEWS = [], newsPtr = 0, hiddenAt = 0;

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
  const wissenPool = () => (topic === "news" ? [] : ALL.filter((c) => !topic || c.topic === topic));

  const nextBatch = () => {
    const w = shuffle(wissenPool()), n = newsPool();
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
  const promptFor = (c) => c.kind === "news"
    ? `Ordne diese Nachricht ein (Hintergrund, Beteiligte, unterschiedliche Sichtweisen, was noch unklar ist). Antworte auf Deutsch und nenne Quellen.\n\n${c.title}\n${c.text}\n(${c.source}, ${fmtDate(c.published)})\n${c.link}`
    : `Erkläre mir das Thema „${c.title}“ ausführlich auf Deutsch (Kontext, Hintergründe, Streitpunkte, Quellen zum Weiterlesen). Ausgangspunkt:\n${c.text}`;

  const openSheet = (c) => {
    const news = c.kind === "news";
    const q = encodeURIComponent(news ? c.title : c.q);
    const close = () => { sheet.hidden = true; sheet.replaceChildren(); };
    const link = (href, title, sub) => h("a", { class: "act", href, target: "_blank", rel: "noopener noreferrer" }, title, h("small", {}, sub));
    const parts = [h("h3", {}, c.title), h("div", { class: "sub" }, "Tiefer eintauchen")];
    if (news) parts.push(link(safeUrl(c.link), "📰 Originalartikel lesen", `${c.source} · ${fmtDate(c.published)}`));
    else parts.push(link(`https://de.wikipedia.org/w/index.php?search=${q}`, "📖 Bei Wikipedia lesen", "Suche nach: " + c.q));
    parts.push(link(`https://duckduckgo.com/?q=${q}`, "🔎 Im Web recherchieren", "Weitere Quellen finden"));
    parts.push(h("button", { class: "act", onclick: async () => toast((await copy(promptFor(c))) ? "Prompt kopiert – in Claude einfügen" : "Kopieren nicht möglich") }, "🤖 Mit Claude vertiefen", h("small", {}, "Kopiert einen fertigen Prompt")));
    const t = topicOf(c);
    parts.push(h("div", { class: "refs" },
      h("b", {}, news ? "Einordnung" : "Wo du es prüfen kannst"),
      h("p", {}, news
        ? `Angezeigt wird die Vorschau des Anbieters (${c.source}, ${c.type}), keine eigene Zusammenfassung. Vergleiche wichtige Themen mit mehr als einer Quelle.`
        : "Diese Karte wurde von einer KI geschrieben und ist nicht automatisch faktengeprüft. Verlässliche Anlaufstellen:"),
      ...(news ? [] : t.refs.map(([n, u]) => h("a", { href: u, target: "_blank", rel: "noopener noreferrer" }, n)))));
    parts.push(h("button", { class: "act", onclick: close }, "Schließen"));
    sheet.replaceChildren(h("div", { class: "sheet" }, ...parts));
    sheet.hidden = false;
    sheet.onclick = (e) => { if (e.target === sheet) close(); };
  };

  const share = async (c) => {
    const text = c.kind === "news" ? `${c.title}\n${c.link}\n– via Knowgram` : `${c.title}\n\n${c.text}\n\n– via Knowgram`;
    if (navigator.share) { try { await navigator.share({ title: c.title, text }); return; } catch (e) { if (e.name === "AbortError") return; } }
    toast((await copy(text)) ? "Text kopiert" : "Teilen nicht möglich");
  };

  const popHeart = (el) => { const p = h("div", { class: "pop" }, "❤️"); el.append(p); setTimeout(() => p.remove(), 700); };
  const syncRail = (id) => document.querySelectorAll(`[data-id="${id}"]`).forEach((el) => {
    el.querySelector(".b-like").classList.toggle("on", has("liked", id));
    el.querySelector(".b-save").classList.toggle("on", has("saved", id));
  });
  const like = (c, el, onlyAdd) => {
    if (onlyAdd && has("liked", c.id)) return popHeart(el);
    flip("liked", c.id); syncRail(c.id);
    if (has("liked", c.id)) popHeart(el);
  };
  const toggleSave = (c) => {
    flip("saved", c.id);
    if (c.kind === "news") { if (has("saved", c.id)) S.savedNews[c.id] = c; else delete S.savedNews[c.id]; persist(); }
    syncRail(c.id); toast(has("saved", c.id) ? "Gespeichert" : "Entfernt");
    if (mode === "saved") render();
  };

  // --- Karte ---
  const metaLine = (c) => {
    if (c.kind !== "news") return h("div", { class: "meta" }, h("span", {}, `📚 Wissenskarte · KI-verfasst · Stand ${ASOF}`));
    const old = isOld(c.published);
    return h("div", { class: "meta" },
      h("span", {}, `📰 ${c.source} · ${c.type}`),
      h("span", { class: old ? "old" : "" }, `${old ? "⏳ " : "🕒 "}${fmtAge(c.published)} · ${fmtDate(c.published)}`),
      ...(c.tag ? [h("span", {}, `📍 ${c.tag}`)] : []),
      ...(c.lang === "en" ? [h("span", {}, "🇬🇧 englischsprachig")] : []));
  };

  const cardEl = (c) => {
    const t = topicOf(c), news = c.kind === "news";
    const el = h("article", { class: "card", "data-id": c.id, style: `--c:${t.c}` },
      h("div", { class: "big" }, news ? "📰" : t.emoji),
      h("span", { class: "tag" }, `${t.emoji} ${news ? "Aktuell · " : ""}${t.name}`),
      h("h2", {}, c.title),
      c.text ? h("p", {}, c.text) : "",
      metaLine(c),
      h("button", { class: "more", onclick: () => openSheet(c) }, "Tiefer eintauchen →"),
      h("div", { class: "rail" },
        h("button", { class: "b-like" + (has("liked", c.id) ? " on" : ""), "aria-label": "Gefällt mir", onclick: () => like(c, el) }, "♥"),
        h("button", { class: "b-save" + (has("saved", c.id) ? " on" : ""), "aria-label": "Speichern", onclick: () => toggleSave(c) }, "🔖"),
        h("button", { "aria-label": "Teilen", onclick: () => share(c) }, "↗")));
    el.addEventListener("dblclick", () => like(c, el, true));
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

  const render = () => {
    obs && obs.disconnect();
    feed.replaceChildren(); feed.scrollTop = 0; newsPtr = 0;
    if (mode === "saved") {
      const list = [...ALL.filter((c) => has("saved", c.id)), ...Object.values(S.savedNews).map((n) => ({ ...n, kind: "news" }))]
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
    if (hiddenAt && Date.now() - hiddenAt > 15 * 60000 && (await loadNews())) { drawChips(); toast("Nachrichten aktualisiert"); }
  });

  (async () => { await loadNews(); drawChips(); render(); })();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
