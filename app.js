(() => {
  const TOPICS = window.TOPICS, ALL = window.CARDS;
  const $ = (s) => document.querySelector(s);
  const feed = $("#feed"), chips = $("#chips"), sheet = $("#sheet"), toastEl = $("#toast");

  // --- Zustand (localStorage, darf fehlschlagen) ---
  let S = { liked: [], saved: [] };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem("knowgram") || "{}")); } catch (e) {}
  const persist = () => { try { localStorage.setItem("knowgram", JSON.stringify(S)); } catch (e) {} };
  const has = (k, id) => S[k].includes(id);
  const flip = (k, id) => { S[k] = has(k, id) ? S[k].filter((x) => x !== id) : [...S[k], id]; persist(); };

  let mode = "feed", topic = "";
  let lastId = null;

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
  const pool = () => ALL.filter((c) => !topic || c.topic === topic);

  // Nächster Stapel: gemischt, ohne dass die letzte Karte sofort wiederkommt
  const nextBatch = () => {
    let b = shuffle(pool());
    if (b.length > 1 && b[0].id === lastId) b.push(b.shift());
    lastId = b[b.length - 1].id;
    return b;
  };

  // --- Karten ---
  const promptFor = (c) =>
    `Erkläre mir das Thema „${c.title}" ausführlich auf Deutsch (Kontext, Hintergründe, Streitpunkte, Quellen zum Weiterlesen). Ausgangspunkt:\n${c.text}`;

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; }
  };

  const openSheet = (c) => {
    const q = encodeURIComponent(c.q);
    const close = () => { sheet.hidden = true; sheet.replaceChildren(); };
    sheet.replaceChildren(h("div", { class: "sheet" },
      h("h3", {}, c.title),
      h("div", { class: "sub" }, "Tiefer eintauchen"),
      h("a", { class: "act", href: `https://de.wikipedia.org/w/index.php?search=${q}`, target: "_blank", rel: "noopener" }, "📖 Bei Wikipedia lesen", h("small", {}, "Suche nach: " + c.q)),
      h("a", { class: "act", href: `https://duckduckgo.com/?q=${q}`, target: "_blank", rel: "noopener" }, "🔎 Im Web recherchieren", h("small", {}, "Weitere Quellen finden")),
      h("button", { class: "act", onclick: async () => { toast((await copy(promptFor(c))) ? "Prompt kopiert – in Claude einfügen" : "Kopieren nicht möglich"); } }, "🤖 Mit Claude vertiefen", h("small", {}, "Kopiert einen fertigen Prompt")),
      h("button", { class: "act", onclick: close }, "Schließen")));
    sheet.hidden = false;
    sheet.onclick = (e) => { if (e.target === sheet) close(); };
  };

  const share = async (c) => {
    const text = `${c.title}\n\n${c.text}\n\n– via Knowgram`;
    if (navigator.share) { try { await navigator.share({ title: c.title, text }); return; } catch (e) { if (e.name === "AbortError") return; } }
    toast((await copy(text)) ? "Text kopiert" : "Teilen nicht möglich");
  };

  const like = (c, cardEl, force) => {
    if (force && has("liked", c.id)) { popHeart(cardEl); return; }
    flip("liked", c.id); syncRail(c.id);
    if (has("liked", c.id)) popHeart(cardEl);
  };
  const popHeart = (el) => { const p = h("div", { class: "pop" }, "❤️"); el.append(p); setTimeout(() => p.remove(), 700); };

  const syncRail = (id) => {
    document.querySelectorAll(`[data-id="${id}"]`).forEach((el) => {
      el.querySelector(".b-like").classList.toggle("on", has("liked", id));
      el.querySelector(".b-save").classList.toggle("on", has("saved", id));
    });
  };

  const cardEl = (c) => {
    const t = TOPICS[c.topic];
    const el = h("article", { class: "card", "data-id": c.id, style: `--c:${t.c}` },
      h("div", { class: "big" }, t.emoji),
      h("span", { class: "tag" }, `${t.emoji} ${t.name}`),
      h("h2", {}, c.title),
      h("p", {}, c.text),
      h("button", { class: "more", onclick: () => openSheet(c) }, "Tiefer eintauchen →"),
      h("div", { class: "rail" },
        h("button", { class: "b-like" + (has("liked", c.id) ? " on" : ""), "aria-label": "Gefällt mir", onclick: () => like(c, el) }, "♥"),
        h("button", { class: "b-save" + (has("saved", c.id) ? " on" : ""), "aria-label": "Speichern", onclick: () => { flip("saved", c.id); syncRail(c.id); toast(has("saved", c.id) ? "Gespeichert" : "Entfernt"); if (mode === "saved") render(); } }, "🔖"),
        h("button", { "aria-label": "Teilen", onclick: () => share(c) }, "↗")));
    el.addEventListener("dblclick", () => like(c, el, true));
    return el;
  };

  // --- Endloser Feed ---
  let obs;
  const appendBatch = () => {
    const batch = nextBatch();
    feed.append(...batch.map(cardEl));
    watchSentinel();
  };
  const watchSentinel = () => {
    obs && obs.disconnect();
    const cards = feed.querySelectorAll(".card");
    const trigger = cards[Math.max(0, cards.length - 3)];
    if (!trigger) return;
    obs = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) appendBatch(); }, { root: feed, threshold: 0.5 });
    obs.observe(trigger);
  };

  const render = () => {
    obs && obs.disconnect();
    feed.replaceChildren(); feed.scrollTop = 0;
    if (mode === "saved") {
      const list = ALL.filter((c) => has("saved", c.id) && (!topic || c.topic === topic));
      if (!list.length) feed.append(h("div", { class: "empty" }, "Noch nichts gespeichert. Tippe auf 🔖, um Karten hier zu sammeln."));
      else feed.append(...list.map(cardEl));
    } else appendBatch();
  };

  // --- Kopfbereich ---
  const drawChips = () => {
    chips.replaceChildren(
      h("button", { class: "chip" + (topic ? "" : " on"), "data-t": "", onclick: () => setTopic("") }, "Alle"),
      ...Object.entries(TOPICS).map(([k, t]) =>
        h("button", { class: "chip" + (topic === k ? " on" : ""), "data-t": k, style: `--c:${t.c}`, onclick: () => setTopic(k) }, `${t.emoji} ${t.name}`)));
  };
  const setTopic = (k) => { topic = k; drawChips(); render(); };
  document.querySelectorAll(".modes button").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    document.querySelectorAll(".modes button").forEach((x) => x.classList.toggle("on", x === b));
    render();
  }));

  drawChips(); render();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
