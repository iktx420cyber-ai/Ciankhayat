(function(){
  const root = document.documentElement;
  const THEME_KEY = "kt_theme";
  const menuBtn = document.querySelector("[data-menu-btn]");
  const menu = document.querySelector("[data-menu]");
  const themeBtn = document.querySelector("[data-theme-btn]");

  function setTheme(t){
    root.setAttribute("data-theme", t);
    localStorage.setItem(THEME_KEY, t);
    const isDark = t === "dark";
    if (themeBtn){
      themeBtn.setAttribute("aria-label", isDark ? "Switch to light" : "Switch to dark");
      themeBtn.innerHTML = isDark ? iconSun() : iconMoon();
    }
  }

  function iconMoon(){
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  function iconSun(){
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" stroke-width="2"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  const saved = localStorage.getItem(THEME_KEY);
  setTheme(saved || "light");

  // menu
  function closeMenu(){
    if(!menu) return;
    menu.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  }
  menuBtn?.addEventListener("click", ()=>{
    if(!menu) return;
    const open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", (e)=>{
    if(!menu || !menuBtn) return;
    if(menu.contains(e.target) || menuBtn.contains(e.target)) return;
    closeMenu();
  });
  document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") closeMenu(); });

  themeBtn?.addEventListener("click", ()=>{
    const t = root.getAttribute("data-theme")==="dark" ? "light" : "dark";
    setTheme(t);
  });

  // Skills expand
  const skills = document.querySelectorAll("[data-skill]");
  const details = document.querySelector("[data-skill-details]");
  skills.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      if(!details) return;
      const title = btn.getAttribute("data-title") || "Skill";
      const text = btn.getAttribute("data-text") || "";
      details.innerHTML = `<b style="color:var(--text)">${title}</b><div style="margin-top:6px">${text}</div>`;
      details.classList.add("open");
      details.scrollIntoView({behavior:"smooth", block:"nearest"});
    });
  });

  // Articles page: filter + reader
  const articlesRoot = document.querySelector("[data-articles]");
  if(articlesRoot){
    const listEl = document.querySelector("[data-article-list]");
    const readerEl = document.querySelector("[data-reader]");
    const readerTitle = document.querySelector("[data-reader-title]");
    const readerMeta = document.querySelector("[data-reader-meta]");
    const readerContent = document.querySelector("[data-reader-content]");
    const backBtn = document.querySelector("[data-reader-back]");
    const qInput = document.querySelector("[data-search]");
    const tagSel = document.querySelector("[data-tag]");

    const data = window.KT_ARTICLES || [];
    const tags = Array.from(new Set(data.flatMap(a=>a.tags||[]))).sort();
    tags.unshift("All");
    if(tagSel){
      tagSel.innerHTML = tags.map(t=>`<option value="${t}">${t}</option>`).join("");
    }

    function render(items){
      if(!listEl) return;
      listEl.innerHTML = items.map(a=>`
        <article class="article" data-id="${a.id}">
          <h3>${a.title}</h3>
          <p>${a.summary}</p>
          <div class="chips">${(a.tags||[]).map(t=>`<span class="chip">${t}</span>`).join("")}</div>
        </article>
      `).join("");
      listEl.querySelectorAll(".article").forEach(el=>{
        el.addEventListener("click", ()=> openReader(el.getAttribute("data-id")));
      });
    }

    function filter(){
      const q = (qInput?.value || "").toLowerCase().trim();
      const t = tagSel?.value || "All";
      let items = data;
      if(t !== "All") items = items.filter(a=>(a.tags||[]).includes(t));
      if(q){
        items = items.filter(a=>
          a.title.toLowerCase().includes(q) ||
          (a.summary||"").toLowerCase().includes(q) ||
          (a.tags||[]).join(" ").toLowerCase().includes(q)
        );
      }
      render(items);
    }

    function openReader(id){
      const a = data.find(x=>String(x.id)===String(id));
      if(!a) return;
      readerTitle.textContent = a.title;
      readerMeta.textContent = `${a.date} · ${a.readTime} min read`;
      readerContent.innerHTML = a.html;
      readerEl.classList.add("open");
      listEl.parentElement.style.display = "none";
      readerEl.scrollIntoView({behavior:"smooth", block:"start"});
      history.replaceState(null,"", `#${a.id}`);
    }

    function closeReader(){
      readerEl.classList.remove("open");
      listEl.parentElement.style.display = "";
      history.replaceState(null,"", `#`);
    }

    qInput?.addEventListener("input", filter);
    tagSel?.addEventListener("change", filter);
    backBtn?.addEventListener("click", closeReader);

    render(data);

    // deep link
    const hash = location.hash.replace("#","");
    if(hash) openReader(hash);
  }

})();
