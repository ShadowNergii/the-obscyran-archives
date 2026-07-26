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
    signupOpen: false,                       // flip true to open Closed Alpha signup before the countdown ends
    signupEndpoint: "https://formspree.io/f/mqerwavg",  // Formspree AJAX endpoint for the Closed Alpha signup form

    launch: "2026-07-26T19:00:00Z",           // countdown target — when Closed Alpha signup opens (adjustable)
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

  /* ===== Closed Alpha signup gating ===== */
  function signupIsOpen() {
    if (PCO.signupOpen) { return true; }
    var t = new Date(PCO.launch).getTime();
    return !isNaN(t) && (t - Date.now() <= 0);
  }
  function setSignupFormOpen(open) {
    var btn = document.getElementById("signup-btn");
    var email = document.getElementById("signup-email");
    var cap = document.querySelector(".cd-caption");
    if (btn) { btn.disabled = !open; btn.textContent = open ? "Sign Up" : "Opens Soon"; }
    if (email) { email.disabled = !open; }
    if (cap && open) { cap.style.display = "none"; }  // countdown message replaces the caption once open
  }

  /* ===== countdown to signup opening (runs if #countdown is present) ===== */
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
      if (signupIsOpen()) {
        var hasForm = !!document.getElementById("signup");
        msg('Closed Alpha signup is <strong>OPEN</strong>' +
          (hasForm ? ' — request your invite below.' : ' — <a href="/" style="color:#fff;text-decoration:underline;">sign up on the home page</a>.'));
        setSignupFormOpen(true);
        clearInterval(t);
        return;
      }
      var diff = target.getTime() - Date.now();
      if (isNaN(diff)) { return; }
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

  /* ===== Closed Alpha signup form (runs if #signup is present) ===== */
  function initSignup() {
    var form = document.getElementById("signup");
    if (!form) { return; }
    var email = document.getElementById("signup-email");
    var note = document.getElementById("signup-note");
    setSignupFormOpen(signupIsOpen());
    function fail(text) { if (note) { note.textContent = text; note.className = "signup-note err"; } }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!signupIsOpen()) { return; }
      var value = (email && email.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { fail("Please enter a valid email address."); return; }
      if (!PCO.signupEndpoint) { fail("Signup isn’t wired up yet — join our Discord in the meantime."); return; }
      var btn = document.getElementById("signup-btn");
      if (btn) { btn.disabled = true; }
      if (note) { note.textContent = "Sending…"; note.className = "signup-note"; }
      fetch(PCO.signupEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "closed-alpha-signup", _subject: "PokéCyrus Online — Closed Alpha signup" })
      }).then(function (r) { if (!r.ok) { throw new Error(r.status); } return r; })
        .then(function () {
          form.innerHTML = '<div class="signup-done">You’re on the list! We’ll email your Closed Alpha invite. See you in Karel.</div>';
        })
        .catch(function () { if (btn) { btn.disabled = false; } fail("Something went wrong — try again, or join our Discord."); });
    });
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

  function start() { injectChrome(); initCountdown(); initPlay(); initSignup(); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", start); }
  else { start(); }
})();
