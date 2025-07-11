// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const dict = {
    title:           { en:"LiveScore 21.0", nl:"LiveScore 21.0" },
    btn_settings:    { en:"⚙️ Settings", nl:"⚙️ Instellingen" },
    settings_title:  { en:"Settings", nl:"Instellingen" },
    settings_theme:  { en:"Theme:", nl:"Thema:" },
    theme_dark:      { en:"Dark", nl:"Donker" },
    theme_light:     { en:"Light", nl:"Licht" },
    settings_lang:   { en:"Language:", nl:"Taal:" },
    lang_en:         { en:"English", nl:"English" },
    lang_nl:         { en:"Nederlands", nl:"Nederlands" },
    info_tab:        { en:"INFO", nl:"INFO" },
    info_title:      { en:"Menu & Info", nl:"Menu & Info" },
    info_contact:    { en:"Contact", nl:"Contact" },
    bug_mail:        { en:"Mail if you find bugs!", nl:"Mail ons bij bugs!" },
    info_game:       { en:"Game Info", nl:"Game Info" },
    info_version:    { en:"Version: 21.0", nl:"Versie: 21.0" },
    info_last_update:{ en:"Last update: July 5, 2025", nl:"Laatste update: 5 juli 2025" },
    info_how:        { en:"How It Works", nl:"Hoe Werkt Het" },
    info_how_desc:   {
      en:"Choose “Matches & Results” for upcoming games & results.\nChoose “League Tables” for standings. Use checkboxes.",
      nl:"Kies “Matches & Results” voor aankomende wedstrijden & uitslagen.\nKies “League Tables” voor standen. Gebruik vinkjes."
    },
    info_next:       { en:"Next Update", nl:"Volgende Update" },
    modal_title:     { en:"Update 21.0", nl:"Update 21.0" },
    modal_message:   { en:"Bug fixes applied.", nl:"Een aantal bugs gefixt." },
    modal_next:      { en:"Next: July 10, 2025 – Some improvements", nl:"Volgende update: 10 juli 2025 – Een paar verbeteringen" },
    banner_update:   {
      en:"Hello, I hope you are enjoying the update. Unfortunately I have found out that I am unable to add more leagues at this time. This means that there are no more matches scheduled until the competitions start. Sorry for the inconvenience!",
      nl:"Hallo, hopelijk geniet je van de update. Helaas ben ik erachter gekomen dat ik op dit moment niet meer leagues kan toevoegen. Hierdoor zijn er tot de competities beginnen geen wedstrijden meer op de planning. Sorry voor het ongemak!"
    },
    start_title:     { en:"LiveScore", nl:"LiveScore" },
    start_desc:      {
      en:"View this week’s schedule, results & standings in one app.",
      nl:"Bekijk dit weekschema, uitslagen & standen in één app."
    },
    menu_matches:    { en:"Matches & Results", nl:"Wedstrijden & Uitslagen" },
    menu_matches_desc:{
      en:"Upcoming games & results.", nl:"Komende wedstrijden & uitslagen."
    },
    menu_standings:  { en:"League Tables", nl:"Standen" },
    menu_standings_desc:{
      en:"Current standings.", nl:"Huidige standen."
    },
    btn_back:        { en:"Back", nl:"Terug" },
    section_matches: { en:"Matches", nl:"Wedstrijden" },
    tab_week:        { en:"This Week", nl:"Deze Week" },
    tab_results:     { en:"Results", nl:"Uitslagen" },
    standings_select:{ en:"Select a competition.", nl:"Selecteer competitie." }
  };

  function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n-key]").forEach(el => {
      const key = el.getAttribute("data-i18n-key");
      if (dict[key] && dict[key][lang] !== undefined) {
        el.textContent = dict[key][lang];
      }
    });
    if (dict.title[lang]) document.title = dict.title[lang];
  }

  // Modal logic
  const modal = document.getElementById("update-modal");
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Theme & Language
  const themeSelect = document.getElementById("theme-select");
  const savedTheme = localStorage.getItem("ls-theme");
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
  themeSelect.value = document.documentElement.getAttribute("data-theme") || "dark";
  themeSelect.addEventListener("change", e => {
    document.documentElement.setAttribute("data-theme", e.target.value);
    localStorage.setItem("ls-theme", e.target.value);
  });

  const langSelect = document.getElementById("lang-select");
  const savedLang = localStorage.getItem("ls-lang") || "nl";
  langSelect.value = savedLang;
  applyTranslations(savedLang);
  langSelect.addEventListener("change", e => {
    localStorage.setItem("ls-lang", e.target.value);
    applyTranslations(e.target.value);
  });

  // Settings panel
  const settingsBtn   = document.getElementById("settings-btn");
  const settingsPane  = document.getElementById("settings-pane");
  const settingsClose = document.getElementById("settings-close");
  settingsBtn.addEventListener("click", e => { e.stopPropagation(); settingsPane.classList.add("open"); });
  settingsClose.addEventListener("click", () => settingsPane.classList.remove("open"));
  document.addEventListener("click", e => {
    if (settingsPane.classList.contains("open") 
        && !settingsPane.contains(e.target) 
        && e.target !== settingsBtn) {
      settingsPane.classList.remove("open");
    }
  });

  // Info panel
  const infoTab   = document.getElementById("info-tab");
  const infoPane  = document.getElementById("info-pane");
  const infoClose = document.getElementById("info-close");
  infoTab.addEventListener("click", e => {
    e.stopPropagation(); infoPane.classList.add("open"); infoTab.style.display="none";
  });
  infoClose.addEventListener("click", e => {
    e.stopPropagation(); infoPane.classList.remove("open"); infoTab.style.display="flex";
  });
  document.addEventListener("click", e => {
    if (infoPane.classList.contains("open") 
        && !infoPane.contains(e.target) 
        && e.target !== infoTab) {
      infoPane.classList.remove("open");
      infoTab.style.display="flex";
    }
  });

  // Main logic
  const startMenu     = document.getElementById("start-menu");
  const menuMatches   = document.getElementById("menu-matches");
  const menuStandings = document.getElementById("menu-standings");
  const content       = document.getElementById("content");
  const backBtn       = document.getElementById("back");
  const sectionTitle  = document.getElementById("section-title");
  const tabToday      = document.getElementById("tab-today");
  const tabResults    = document.getElementById("tab-results");
  const competitionInputs = Array.from(document.querySelectorAll(".comp-input"));
  const matchesContainer  = document.getElementById("matches");
  const matchesView       = document.getElementById("matches-view");
  const standingsView     = document.getElementById("standings-view");
  const leagueSelect      = document.getElementById("league-select");
  const leagueTableContainer = document.getElementById("league-table-container");

  function formatLabels(date) {
    const optA={weekday:"long"}, optB={day:"numeric",month:"long"};
    return {
      dayName: date.toLocaleDateString("en-GB",optA),
      dayMonth: date.toLocaleDateString("en-GB",optB)
    };
  }
  function toIso(d) {
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${dd}`;
  }

  async function fetchWeek() {
    matchesContainer.innerHTML = `<div class="message">Loading…</div>`;
    const today = new Date(); today.setHours(0,0,0,0);
    const end   = new Date(today); end.setDate(today.getDate()+6);
    const from  = toIso(today), to = toIso(end);
    const sel   = competitionInputs.filter(i=>i.checked).map(i=>i.value);
    if (!sel.length) {
      matchesContainer.innerHTML = `<div class="no-matches">Geen competitie geselecteerd.</div>`;
      return;
    }
    try {
      const resp = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${from}&dateTo=${to}`, {
        headers:{"X-Auth-Token":"c937388f53f6473cb5a61d158219af8f"}
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      const data = await resp.json();
      let list = (data.matches||[]).filter(m=>{
        const c=m.competition,id=c?.id?.toString();
        if (sel.includes(id)) return true;
        if ((c.code==="CL"||c.code==="UECL") && sel.includes("CL")) return true;
        return false;
      }).filter(m=>m.status!=="FINISHED")
        .sort((a,b)=> new Date(a.utcDate) - new Date(b.utcDate));
      matchesContainer.innerHTML = "";
      const ft = formatLabels(today).dayMonth, tt = formatLabels(end).dayMonth;
      const h2 = document.createElement("h2"); h2.textContent = `Week: ${ft} – ${tt}`; 
      matchesContainer.appendChild(h2);
      if (!list.length) {
        matchesContainer.innerHTML = `<div class="no-matches">Geen wedstrijden deze week.</div>`;
      } else {
        let cur = "";
        list.forEach(m=>{
          const dt = new Date(m.utcDate),
                {dayName,dayMonth} = formatLabels(dt),
                lbl = `${dayName} ${dayMonth}`;
          if (lbl !== cur) {
            cur = lbl;
            const dh = document.createElement("h3");
            dh.style.margin="20px 0 10px";
            dh.textContent = lbl;
            matchesContainer.appendChild(dh);
          }
          const t    = dt.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),
                card = document.createElement("div");
          card.className="card";
          card.innerHTML=`
            <div class="teams">${m.homeTeam?.name||"?"} vs ${m.awayTeam?.name||"?"}</div>
            <div class="details">Competition: ${m.competition?.name||"–"}<br/>Kick-off: ${t}</div>`;
          matchesContainer.appendChild(card);
        });
      }
    } catch(err) {
      matchesContainer.innerHTML = `<div class="error">${err.message}</div>`;
    }
  }

  async function fetchResults() {
    matchesContainer.innerHTML = `<div class="message">Loading…</div>`;
    const today = new Date(); today.setHours(0,0,0,0);
    const ago   = new Date(today); ago.setDate(today.getDate()-7);
    const from  = toIso(ago), to = toIso(today);
    const sel   = competitionInputs.filter(i=>i.checked).map(i=>i.value);
    if (!sel.length) {
      matchesContainer.innerHTML = `<div class="no-matches">Geen competitie geselecteerd.</div>`;
      return;
    }
    try {
      const resp = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${from}&dateTo=${to}`, {
        headers:{"X-Auth-Token":"c937388f53f6473cb5a61d158219af8f"}
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      const data = await resp.json();
      let list = (data.matches||[]).filter(m=>m.status==="FINISHED").filter(m=>{
        const c=m.competition,id=c?.id?.toString();
        if (sel.includes(id)) return true;
        if ((c.code==="CL"||c.code==="UECL") && sel.includes("CL")) return true;
        return false;
      }).sort((a,b)=> new Date(b.utcDate) - new Date(a.utcDate));
      matchesContainer.innerHTML = "";
      const ft = formatLabels(ago).dayMonth, tt = formatLabels(today).dayMonth;
      const h2 = document.createElement("h2"); h2.textContent = `Results: ${ft} – ${tt}`; 
      matchesContainer.appendChild(h2);
      if (!list.length) {
        matchesContainer.innerHTML = `<div class="no-matches">Geen uitslagen deze week.</div>`;
      } else {
        list.forEach(m=>{
          const dt = new Date(m.utcDate), ds = dt.toLocaleDateString("en-GB");
          const card = document.createElement("div"); card.className="card";
          card.innerHTML=`
            <div class="teams">${m.homeTeam?.name||"?"} vs ${m.awayTeam?.name||"?"}</div>
            <div class="details">Date: ${ds}</div>
            <div class="score">Score: ${m.score.fullTime.home||"-"}–${m.score.fullTime.away||"-"}</div>`;
          matchesContainer.appendChild(card);
        });
      }
    } catch(err) {
      matchesContainer.innerHTML = `<div class="error">${err.message}</div>`;
    }
  }

  function activateTab(tab) {
    if(tab==="today"){
      tabToday.classList.add("active");
      tabResults.classList.remove("active");
      fetchWeek();
    } else {
      tabResults.classList.add("active");
      tabToday.classList.remove("active");
      fetchResults();
    }
  }
  tabToday.addEventListener("click", ()=>activateTab("today"));
  tabResults.addEventListener("click", ()=>activateTab("results"));
  competitionInputs.forEach(cb=>cb.addEventListener("change", ()=>{
    if(tabToday.classList.contains("active")) fetchWeek(); else fetchResults();
  }));

  async function fetchStandings() {
    leagueTableContainer.innerHTML = `<div class="message">Loading…</div>`;
    try {
      const resp = await fetch(`https://api.football-data.org/v4/competitions/${leagueSelect.value}/standings`, {
        headers:{"X-Auth-Token":"c937388f53f6473cb5a61d158219af8f"}
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      const data = await resp.json();
      const total = (data.standings||[]).find(s=>s.type==="TOTAL");
      if (!total) {
        leagueTableContainer.innerHTML = `<div class="message">Geen data beschikbaar.</div>`;
        return;
      }
      let html = `<table><thead><tr>
        <th>Pos.</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
      </tr></thead><tbody>`;
      total.table.forEach(e=>{
        html += `<tr>
          <td>${e.position}</td><td>${e.team.name}</td><td>${e.playedGames}</td>
          <td>${e.won}</td><td>${e.draw}</td><td>${e.lost}</td>
          <td>${e.goalsFor}</td><td>${e.goalsAgainst}</td><td>${e.goalDifference}</td><td>${e.points}</td>
        </tr>`;
      });
      html += `</tbody></table>`;
      leagueTableContainer.innerHTML = html;
    } catch(err) {
      leagueTableContainer.innerHTML = `<div class="error">${err.message}</div>`;
    }
  }
  leagueSelect.addEventListener("change", fetchStandings);

  function showMatchesView() {
    sectionTitle.setAttribute("data-i18n-key","section_matches");
    sectionTitle.textContent = dict.section_matches[langSelect.value];
    standingsView.style.display="none";
    matchesView.style.display="block";
    leagueSelect.style.display="none";
    activateTab("today");
  }
  function showStandingsView() {
    sectionTitle.setAttribute("data-i18n-key","menu_standings");
    sectionTitle.textContent = dict.menu_standings[langSelect.value];
    matchesView.style.display="none";
    standingsView.style.display="block";
    leagueSelect.style.display="block";
    fetchStandings();
  }
  menuMatches.addEventListener("click", ()=>{
    startMenu.style.display="none"; content.style.display="flex"; showMatchesView();
  });
  menuStandings.addEventListener("click", ()=>{
    startMenu.style.display="none"; content.style.display="flex"; showStandingsView();
  });
  backBtn.addEventListener("click", ()=>{
    content.style.display="none"; startMenu.style.display="flex";
  });

  // Initial
  showMatchesView();
});
