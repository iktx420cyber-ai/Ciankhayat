
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if(saved){ root.setAttribute("data-theme", saved); }

  const themeBtn = document.querySelector("[data-theme-toggle]");
  if(themeBtn){
    themeBtn.addEventListener("click", () => {
      const next = (root.getAttribute("data-theme")==="dark") ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateThemeIcon();
    });
  }

  function updateThemeIcon(){
    const isDark = root.getAttribute("data-theme")==="dark";
    document.querySelectorAll("[data-theme-icon]").forEach(el => {
      el.innerHTML = isDark ? icons.sun : icons.moon;
      el.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  // Mobile menu
  const menuBtn = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-mobile-nav]");
  if(menuBtn && nav){
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("hidden");
    });
  }

  // Skills “story” behavior (homepage)
  const stories = document.getElementById("skillsStories");
  const detail = document.getElementById("skillDetail");
  if(stories && detail){
    stories.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-skill]");
      if(!btn) return;
      const title = btn.getAttribute("data-title");
      const pct = btn.getAttribute("data-pct");
      const desc = btn.getAttribute("data-desc");
      const extra = btn.getAttribute("data-extra");
      const icon = btn.querySelector("[data-skill-icon]")?.innerHTML || "";
      detail.querySelector("[data-sd-title]").textContent = `${title} (${pct}%)`;
      detail.querySelector("[data-sd-desc]").textContent = desc;
      detail.querySelector("[data-sd-extra]").textContent = extra || "";
      detail.querySelector("[data-sd-icon]").innerHTML = icon;
      detail.classList.remove("hidden");
      // Highlight selected
      stories.querySelectorAll("[data-skill]").forEach(b=>b.setAttribute("aria-current","false"));
      btn.setAttribute("aria-current","true");
    });
  }

  // Articles page: simple reader routing (?id=)
  const articlesData = window.__ARTICLES__ || [];
  const listEl = document.getElementById("articleList");
  const readerEl = document.getElementById("articleReader");
  const searchEl = document.getElementById("articleSearch");
  const tagEl = document.getElementById("tagFilter");

  function renderList(){
    if(!listEl) return;
    const q = (searchEl?.value || "").trim().toLowerCase();
    const tag = tagEl?.value || "all";
    listEl.innerHTML = "";
    const filtered = articlesData.filter(a => {
      const hay = (a.title+" "+a.summary+" "+a.tags.join(" ")).toLowerCase();
      const okQ = !q || hay.includes(q);
      const okT = (tag==="all") || a.tags.includes(tag);
      return okQ && okT;
    });
    filtered.forEach(a => {
      const card = document.createElement("div");
      card.className = "articleCard";
      card.innerHTML = `
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(a.summary)}</p>
        <div class="tags">${a.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
      `;
      card.addEventListener("click", () => openReader(a.id));
      listEl.appendChild(card);
    });
  }

  function openReader(id){
    const a = articlesData.find(x=>x.id===id);
    if(!a || !readerEl) return;
    readerEl.innerHTML = `
      <div class="reader">
        <h1>${escapeHtml(a.title)}</h1>
        <div class="meta">${escapeHtml(a.meta)}</div>
        ${a.body.map(p=>`<p>${escapeHtml(p)}</p>`).join("")}
        <div style="margin-top:12px">
          <a class="btn" href="articles.html">← Back to topics</a>
        </div>
      </div>
    `;
    const url = new URL(window.location.href);
    url.searchParams.set("id", id);
    window.history.replaceState({}, "", url);
    readerEl.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function bootArticles(){
    if(!listEl && !readerEl) return;
    // build tag list
    if(tagEl){
      const set = new Set();
      articlesData.forEach(a=>a.tags.forEach(t=>set.add(t)));
      tagEl.innerHTML = `<option value="all">All tags</option>` + [...set].sort().map(t=>`<option value="${escapeAttr(t)}">${escapeHtml(t)}</option>`).join("");
      tagEl.addEventListener("change", renderList);
    }
    if(searchEl){
      searchEl.addEventListener("input", renderList);
    }
    renderList();

    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    if(id){
      openReader(id);
    }
  }

  function escapeHtml(s){ return (s||"").replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }
  function escapeAttr(s){ return escapeHtml(s).replace(/"/g, "&quot;"); }

  const icons = {
    moon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    download:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v10"/><path d="m7 12 5 5 5-5"/><path d="M5 21h14"/></svg>`
  };
  updateThemeIcon();

  // Replace inline icon slots
  document.querySelectorAll("[data-menu-icon]").forEach(el=>el.innerHTML = icons.menu);
  document.querySelectorAll("[data-download-icon]").forEach(el=>el.innerHTML = icons.download);

  bootArticles();
})();
