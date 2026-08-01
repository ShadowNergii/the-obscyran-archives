/* ===== PokéCyrus Online — shared site chrome & launch logic ===== */
(function () {
  "use strict";

  /* ============================================================
     RELEASE — MANUAL SWITCHES
     `live` gates the /play client links: the download buttons and
     the browser-play link. While false they show "Available at
     Launch" and never expose a client link.

     CD DIRECTIVE: keep downloads and client links DISABLED. Do NOT
     set `live: true` until the Creative Director explicitly lifts
     this. Nothing else on the site may expose a client link.

     The Closed Alpha signup was removed on CD instruction
     (2026-07-28); `screens` below drives the homepage gallery that
     replaced it.
     ============================================================ */
  var PCO = {
    live: false,  // HELD false by CD directive — see note above; do not flip without CD sign-off

    /* Homepage screenshot gallery. Drop files in assets/screens/ and add an entry
       here in display order — see assets/screens/README.md. An empty list simply
       hides the gallery section, so the page never shows an empty frame. */
    screens: [
      { file: "01-ocana-town.jpg",     caption: "Ocana Town",              alt: "Ocana Town — Pokemon Center, bank and tree-lined streets" },
      { file: "02-mi-gorda-coast.jpg", caption: "Mi Gorda Town",           alt: "The Mi Gorda coast — palms, a moored boat and open water" },
      { file: "03-flora-garden.jpg",   caption: "Route 3 · Flora Garden",  alt: "The Flora Garden on Route 3, a clearing thick with wildflowers" },
      { file: "04-lupies-forest.jpg",  caption: "Lupies Forest",           alt: "A winding trail through the dense canopy of Lupies Forest" }
    ],

    discord: "https://discord.com/invite/rmTHCNPzrq",
    browser: "https://play.theobscyranarchives.net/",
    downloads: [
      { label: "Windows",              sub: "Installer (.exe)", url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.2_x64-setup.exe" },
      { label: "macOS · Apple Silicon", sub: "Apple M-series",  url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.2_aarch64.app.tar.gz" },
      { label: "macOS · Intel",        sub: "Intel Macs",       url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.2_x64.app.tar.gz" },
      { label: "Linux · AppImage",     sub: "Portable",         url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.2_amd64.AppImage" },
      { label: "Linux · .deb",         sub: "Debian / Ubuntu",  url: "https://play.theobscyranarchives.net/client/PokeCyrus.Online_0.3.2_amd64.deb" }
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

  /* ===== homepage screenshot gallery (runs if #screens is present) =====
     Built from PCO.screens. With no entries the section stays hidden, so the
     page never renders an empty gallery frame. */
  function initScreens() {
    var section = document.getElementById("screens");
    var grid = document.getElementById("screens-grid");
    if (!section || !grid) { return; }
    var shots = (PCO.screens || []).filter(function (s) { return s && s.file; });
    if (!shots.length) { section.style.display = "none"; return; }

    grid.innerHTML = shots.map(function (s, i) {
      var cap = s.caption || "";
      var alt = s.alt || cap || "PokeCyrus Online screenshot";
      return '<figure class="shot">' +
        '<button type="button" class="shot-btn" data-shot="' + i + '" aria-label="Enlarge: ' + esc(alt) + '">' +
          '<img src="/assets/screens/' + encodeURIComponent(s.file) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async" />' +
        '</button>' +
        (cap ? '<figcaption>' + esc(cap) + '</figcaption>' : '') +
      '</figure>';
    }).join("");

    // Lightbox: one element reused, closed on backdrop click or Escape.
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("hidden", "");
    box.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
                    '<figure><img alt="" /><figcaption></figcaption></figure>';
    document.body.appendChild(box);
    var lbImg = box.querySelector("img"), lbCap = box.querySelector("figcaption");
    var lastFocus = null;

    function open(i) {
      var s = shots[i]; if (!s) { return; }
      lastFocus = document.activeElement;
      lbImg.src = "/assets/screens/" + encodeURIComponent(s.file);
      lbImg.alt = s.alt || s.caption || "PokeCyrus Online screenshot";
      lbCap.textContent = s.caption || "";
      box.removeAttribute("hidden");
      document.body.style.overflow = "hidden";
      box.querySelector(".lightbox-close").focus();
    }
    function close() {
      box.setAttribute("hidden", "");
      lbImg.src = "";
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
    }
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".shot-btn") : null;
      if (btn) { open(Number(btn.getAttribute("data-shot"))); }
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || (e.target.classList && e.target.classList.contains("lightbox-close"))) { close(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !box.hasAttribute("hidden")) { close(); }
    });
  }

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function start() { injectChrome(); initPlay(); initScreens(); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", start); }
  else { start(); }
})();
