/* ===== PokéCyrus Online — shared site chrome & launch logic ===== */
(function () {
  "use strict";

  /* ============================================================
     ALPHA RELEASE — SINGLE MANUAL SWITCH
     `live` stays false until the Alpha is confirmed fun & playable.
     Set it to true and redeploy to go live everywhere at once:
       - the countdown flips to "LIVE"
       - every Play / download / browser button activates
     The countdown is only a soft "launching soon" indicator; its
     reaching zero does NOT release the Alpha.
     ============================================================ */
  var PCO = {
    live: false,
    launch: "2026-07-26T19:00:00Z",           // soft countdown target (adjustable)
    discord: "https://discord.com/invite/rmTHCNPzrq",
    browser: "https://play.theobscyranarchives.net/",
    downloads: [
      { label: "Windows",              sub: "Installer (.exe)", url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.0_x64-setup.exe" },
      { label: "macOS · Apple Silicon", sub: "Apple M-series",  url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.0_aarch64.app.tar.gz" },
      { label: "macOS · Intel",        sub: "Intel Macs",       url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.0_x64.app.tar.gz" },
      { label: "Linux · AppImage",     sub: "Portable",         url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.0_amd64.AppImage" },
      { label: "Linux · .deb",         sub: "Debian / Ubuntu",  url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.0_amd64.deb" }
    ]
  };
  window.PCO = PCO;

  var BRAND = '<span class="pc">PokéCyrus</span> <span class="on">Online</span>';
  var NAV = [
    { href: "/vision",    label: "Vision" },
    { href: "/karel",     label: "Karel" },
    { href: "/guides",    label: "Guides" },
    { href: "/market",    label: "Market" },
    { href: "/community", label: "Community" }
  ];
  var FOOT = [
    { href: "/",           label: "Home" },
    { href: "/play",       label: "Play" },
    { href: "/vision",     label: "Vision" },
    { href: "/karel",      label: "Karel" },
    { href: "/guides",     label: "Guides" },
    { href: "/market",     label: "Market" },
    { href: "/dispatches", label: "Dispatches" },
    { href: "/community",  label: "Community" },
    { href: "/faq",        label: "FAQ" }
  ];

  function curPath() {
    var p = location.pathname.replace(/\/+$/, "");
    return p === "" ? "/" : p;
  }
  function isActive(href) {
    var p = curPath();
    if (href === "/") { return p === "/"; }
    return p === href || p.indexOf(href + "/") === 0;
  }

  function injectChrome() {
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (isActive(n.href) ? ' class="active"' : '') + '>' + n.label + '</a>';
    }).join("");
    var nav =
      '<nav class="topbar"><div class="nav">' +
        '<a class="brand" href="/">' + BRAND + '</a>' +
        '<div class="links">' + links +
          '<a class="btn btn-red' + (isActive("/play") ? ' active' : '') + '" href="/play">Play Now</a>' +
        '</div>' +
      '</div></nav>';
    document.body.insertAdjacentHTML("afterbegin", nav);

    var footLinks = FOOT.map(function (n) {
      return '<a href="' + n.href + '">' + n.label + '</a>';
    }).join("");
    var footer =
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="brand">' + BRAND + '</div>' +
        '<nav class="foot-links">' + footLinks + '</nav>' +
        '<p><a class="discord" href="' + PCO.discord + '" target="_blank" rel="noopener">Join our Discord community →</a></p>' +
        '<p class="disclaimer">PokéCyrus Online is a free, non-commercial fan-made MMORPG inspired by the Pokémon franchise. ' +
        'Pokémon and related names, characters, and trademarks are owned by Nintendo, Game Freak, and The Pokémon Company. ' +
        'PokéCyrus Online and The Obscyran Archives are not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company.</p>' +
      '</div></footer>';
    document.body.insertAdjacentHTML("beforeend", footer);
  }

  /* ===== countdown (runs if #countdown is present) ===== */
  function initCountdown() {
    var wrap = document.getElementById("countdown");
    var live = document.getElementById("cd-live");
    if (!wrap && !live) { return; }
    var elD = document.getElementById("cd-days"), elH = document.getElementById("cd-hours"),
        elM = document.getElementById("cd-mins"), elS = document.getElementById("cd-secs");
    var target = new Date(PCO.launch);
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function msg(html) { if (wrap) { wrap.style.display = "none"; } if (live) { live.style.display = "block"; live.innerHTML = html; } }
    function tick() {
      if (PCO.live) { msg('The Alpha is <strong>LIVE</strong> — <a href="/play" style="color:#fff;text-decoration:underline;">choose how to play</a>.'); clearInterval(t); return; }
      var diff = target.getTime() - Date.now();
      if (isNaN(diff)) { return; }
      if (diff <= 0) { msg("Launching soon — final checks underway."); return; }
      if (wrap) { wrap.style.display = ""; } if (live) { live.style.display = "none"; }
      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;
      if (elD) { elD.textContent = d; } if (elH) { elH.textContent = pad(h); }
      if (elM) { elM.textContent = pad(m); } if (elS) { elS.textContent = pad(s); }
    }
    var t = setInterval(tick, 1000); tick();
  }

  /* ===== play / download buttons (runs if the containers are present) ===== */
  function initPlay() {
    var browserEl = document.getElementById("play-browser");
    var dlEl = document.getElementById("play-downloads");
    if (!browserEl && !dlEl) { return; }
    if (!PCO.live) {
      if (browserEl) { browserEl.innerHTML = '<span class="btn btn-outline btn-block is-disabled" aria-disabled="true">Available at Launch</span>'; }
      if (dlEl) { dlEl.innerHTML = '<span class="btn btn-red btn-block is-disabled" aria-disabled="true">Available at Launch</span><div class="dl-note">Windows · macOS · Linux</div>'; }
      return;
    }
    if (browserEl) { browserEl.innerHTML = '<a class="btn btn-outline btn-block" href="' + PCO.browser + '" target="_blank" rel="noopener">Play in Browser</a>'; }
    if (dlEl) {
      dlEl.innerHTML = PCO.downloads.map(function (d) {
        return '<a class="btn btn-red dl-btn" href="' + d.url + '" download><span>' + d.label + '</span><small>' + d.sub + '</small></a>';
      }).join("");
    }
  }

  function start() { injectChrome(); initCountdown(); initPlay(); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", start); }
  else { start(); }
})();
