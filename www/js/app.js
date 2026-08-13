/* ================================================================
   VEN-TEC PIP-READER  -  application logic (ES5, legacy WebView safe)
   No arrow functions, no let/const, no template literals, no fetch.
   ================================================================ */
(function () {
  "use strict";

  /* ---------- tiny DOM helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function on(el, ev, fn) { if (el) { el.addEventListener(ev, fn, false); } }
  function hasClass(el, c) { return (" " + el.className + " ").indexOf(" " + c + " ") > -1; }
  function addClass(el, c) { if (!hasClass(el, c)) { el.className = el.className + " " + c; } }
  function removeClass(el, c) {
    el.className = (" " + el.className + " ").replace(" " + c + " ", " ").replace(/^\s+|\s+$/g, "");
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- storage keys ---------- */
  var K_THEME = "ventec_theme";
  var K_FONT  = "ventec_font";
  var K_SCAN  = "ventec_scan";
  var K_IMPORTS = "ventec_imports";

  function lsGet(k, d) {
    try { var v = window.localStorage.getItem(k); return v === null ? d : v; }
    catch (e) { return d; }
  }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }

  function getImports() {
    try { return JSON.parse(lsGet(K_IMPORTS, "[]")) || []; }
    catch (e) { return []; }
  }
  function saveImports(arr) { lsSet(K_IMPORTS, JSON.stringify(arr)); }

  /* ================= BOOT SEQUENCE ================= */
  var bootLines = [
    "VEN-TEC INDUSTRIES (C) 2077",
    "PERSONAL INFORMATION PROCESSOR",
    "",
    "> INITIALIZING PIP-READER 3000 ...",
    "> LOADING NUCLEAR CELL ......... OK",
    "> MOUNTING SURVIVAL DATABANK ... OK",
    "> DECRYPTING FIELD MANUALS ..... OK",
    "> RAD-SHIELD ................... NOMINAL",
    "",
    "> WELCOME, OPERATOR.",
    "> STAY ALIVE."
  ];

  function runBoot(done) {
    var out = $("bootText");
    var li = 0, ci = 0, buf = "";
    function tick() {
      if (li >= bootLines.length) {
        setTimeout(done, 550);
        return;
      }
      var line = bootLines[li];
      if (ci < line.length) {
        buf += line.charAt(ci);
        out.textContent = buf;
        ci++;
        setTimeout(tick, 12);
      } else {
        buf += "\n";
        out.textContent = buf;
        li++; ci = 0;
        setTimeout(tick, 90);
      }
    }
    tick();
  }

  /* ================= SCREEN ROUTING ================= */
  var screens = ["library", "reader", "settings", "about"];
  function showScreen(name) {
    var i;
    for (i = 0; i < screens.length; i++) {
      var el = $("screen-" + screens[i]);
      if (el) {
        if (screens[i] === name) { removeClass(el, "hidden"); }
        else { addClass(el, "hidden"); }
      }
    }
    // nav highlight (reader has no nav button; keep archive lit)
    var btns = document.getElementsByClassName("nav-btn");
    for (i = 0; i < btns.length; i++) {
      var target = btns[i].getAttribute("data-screen");
      if (target === name) { addClass(btns[i], "nav-active"); }
      else { removeClass(btns[i], "nav-active"); }
    }
  }

  /* ================= LIBRARY RENDER ================= */
  function renderLibrary() {
    var list = $("bookList");
    list.innerHTML = "";
    var i, li, html;

    // bundled
    for (i = 0; i < VENTEC_BOOKS.length; i++) {
      var b = VENTEC_BOOKS[i];
      li = document.createElement("li");
      li.setAttribute("data-src", "bundled");
      li.setAttribute("data-idx", String(i));
      html = '<span class="bk-title">' + esc(b.title) + '</span>' +
             '<span class="bk-meta">' + esc(b.meta) + '</span>' +
             '<span class="bk-tag">' + esc(b.tag) + '</span>';
      li.innerHTML = html;
      list.appendChild(li);
    }

    // imported
    var imports = getImports();
    for (i = 0; i < imports.length; i++) {
      li = document.createElement("li");
      li.setAttribute("data-src", "import");
      li.setAttribute("data-idx", String(i));
      html = '<span class="bk-title">' + esc(imports[i].title) + '</span>' +
             '<span class="bk-meta">Imported field manual</span>' +
             '<span class="bk-tag">USER-DATA</span>';
      li.innerHTML = html;
      list.appendChild(li);
    }
  }

  // event delegation on the list
  function onListClick(e) {
    var t = e.target;
    while (t && t.tagName !== "LI") { t = t.parentNode; }
    if (!t) { return; }
    var src = t.getAttribute("data-src");
    var idx = parseInt(t.getAttribute("data-idx"), 10);
    if (src === "bundled") {
      openBook(VENTEC_BOOKS[idx].title, VENTEC_BOOKS[idx].body);
    } else {
      var imp = getImports()[idx];
      if (imp) { openBook(imp.title, imp.body); }
    }
  }

  /* ================= READER ================= */
  function renderBody(text) {
    var lines = String(text).split(/\r\n|\r|\n/);
    var i, out = [];
    for (i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (ln.substring(0, 3) === "## ") {
        out.push("<h2>" + esc(ln.substring(3)) + "</h2>");
      } else {
        out.push(esc(ln));
      }
    }
    return out.join("\n");
  }

  function openBook(title, body) {
    $("readerTitle").innerHTML = esc(title);
    $("readerBody").innerHTML = renderBody(body);
    $("readerBody").scrollTop = 0;
    showScreen("reader");
  }

  /* ================= IMPORT ================= */
  function onFile(e) {
    var files = e.target.files;
    if (!files || !files.length) { return; }
    var f = files[0];
    var reader = new FileReader();
    reader.onload = function (ev) {
      var text = ev.target.result || "";
      var name = f.name.replace(/\.[^.]+$/, "").toUpperCase();
      var imports = getImports();
      imports.push({ title: name, body: text });
      saveImports(imports);
      renderLibrary();
      var msg = $("importMsg");
      msg.textContent = "LOADED: " + name;
      setTimeout(function () { msg.textContent = ""; }, 3500);
    };
    reader.onerror = function () {
      $("importMsg").textContent = "READ ERROR";
    };
    reader.readAsText(f);
    // reset so same file can be re-imported
    e.target.value = "";
  }

  /* ================= SETTINGS ================= */
  function applyTheme(theme) {
    document.body.className = "theme-" + theme;
    lsSet(K_THEME, theme);
    setActive("btnAmber", theme === "amber");
    setActive("btnGreen", theme === "green");
  }
  function setActive(id, isOn) {
    var el = $(id);
    if (!el) { return; }
    if (isOn) { addClass(el, "active"); } else { removeClass(el, "active"); }
  }

  var fontPct = 100;
  function applyFont(pct) {
    fontPct = Math.max(70, Math.min(180, pct));
    lsSet(K_FONT, String(fontPct));
    var px = (15 * fontPct / 100);
    $("readerBody").style.fontSize = px + "px";
    $("fontVal").textContent = fontPct + "%";
  }

  function applyScan(isOn) {
    lsSet(K_SCAN, isOn ? "1" : "0");
    var sc = $("scanlines");
    if (isOn) { removeClass(sc, "hidden"); $("btnScan").textContent = "ON"; setActive("btnScan", true); }
    else { addClass(sc, "hidden"); $("btnScan").textContent = "OFF"; setActive("btnScan", false); }
  }

  /* ================= CLOCK ================= */
  function tickClock() {
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes();
    var s = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    var c = $("clock");
    if (c) { c.textContent = s; }
  }

  /* ================= WIRE UP ================= */
  function init() {
    // restore settings
    applyTheme(lsGet(K_THEME, "amber"));
    applyFont(parseInt(lsGet(K_FONT, "100"), 10));
    applyScan(lsGet(K_SCAN, "1") === "1");

    renderLibrary();

    // nav
    var btns = document.getElementsByClassName("nav-btn");
    for (var i = 0; i < btns.length; i++) {
      on(btns[i], "click", function () {
        showScreen(this.getAttribute("data-screen"));
      });
    }

    on($("bookList"), "click", onListClick);
    on($("btnBack"), "click", function () { showScreen("library"); });
    on($("fileInput"), "change", onFile);

    on($("btnAmber"), "click", function () { applyTheme("amber"); });
    on($("btnGreen"), "click", function () { applyTheme("green"); });
    on($("btnFontUp"), "click", function () { applyFont(fontPct + 10); });
    on($("btnFontDown"), "click", function () { applyFont(fontPct - 10); });
    on($("btnScan"), "click", function () { applyScan(hasClass($("scanlines"), "hidden")); });
    on($("btnClearImports"), "click", function () {
      saveImports([]);
      renderLibrary();
      $("importMsg").textContent = "IMPORTS PURGED";
      setTimeout(function () { $("importMsg").textContent = ""; }, 3000);
    });

    tickClock();
    setInterval(tickClock, 15000);

    showScreen("library");
  }

  /* ================= START ================= */
  function start() {
    runBoot(function () {
      addClass($("boot"), "hidden");
      removeClass($("app"), "hidden");
      init();
    });
  }

  // Cordova fires deviceready; browsers fire load. Support both.
  var started = false;
  function safeStart() { if (!started) { started = true; start(); } }
  document.addEventListener("deviceready", safeStart, false);
  window.addEventListener("load", function () {
    // give cordova a moment; if no deviceready, start anyway
    setTimeout(safeStart, 400);
  }, false);
})();
