/* ================================================================
   VEN-READ  -  application logic (ES5, legacy WebView safe)
   - In-memory library model (fixes import viewing)
   - Multi-format import: TXT, MD, HTML/HTM, EPUB
   - Survival protocols compiled into one library entry
   - Loading screen + main menu hub
   ================================================================ */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function on(el, ev, fn) { if (el) { el.addEventListener(ev, fn, false); } }
  function hasClass(el, c) { return (" " + el.className + " ").indexOf(" " + c + " ") > -1; }
  function addClass(el, c) { if (el && !hasClass(el, c)) { el.className = el.className + " " + c; } }
  function removeClass(el, c) {
    if (el) { el.className = (" " + el.className + " ").replace(" " + c + " ", " ").replace(/^\s+|\s+$/g, ""); }
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- storage ---------- */
  var K_THEME = "venread_theme";
  var K_FONT  = "venread_font";
  var K_SCAN  = "venread_scan";
  var K_IMPORTS = "venread_imports";

  function lsGet(k, d) {
    try { var v = window.localStorage.getItem(k); return v === null ? d : v; }
    catch (e) { return d; }
  }
  function lsSet(k, v) {
    try { window.localStorage.setItem(k, v); return true; }
    catch (e) { return false; }
  }

  /* ================= LIBRARY MODEL (in memory) ================= */
  var model = [];      // { id, title, meta, tag, kind, body }
  var importSeq = 0;

  function buildCompilation() {
    var toc = "## FIELD LIBRARY CONTENTS\n";
    var i, body = "";
    for (i = 0; i < VENREAD_PROTOCOLS.length; i++) {
      toc += "  " + VENREAD_PROTOCOLS[i].num + ".  " + VENREAD_PROTOCOLS[i].title + "\n";
    }
    body += "# THE SURVIVOR'S FIELD COMPILATION\n\n";
    body += toc + "\n";
    for (i = 0; i < VENREAD_PROTOCOLS.length; i++) {
      var p = VENREAD_PROTOCOLS[i];
      body += "\n# PROTOCOL " + p.num + " :: " + p.title + "\n\n" + p.body + "\n\n";
    }
    return {
      id: "compilation",
      title: "THE SURVIVOR'S FIELD COMPILATION",
      meta: "6 protocols - water, fire, shelter, aid, food, navigation",
      tag: "BUNDLED",
      kind: "bundled",
      body: body
    };
  }

  function loadImports() {
    var arr = [];
    try { arr = JSON.parse(lsGet(K_IMPORTS, "[]")) || []; } catch (e) { arr = []; }
    var i;
    for (i = 0; i < arr.length; i++) {
      importSeq++;
      model.push({
        id: "imp_" + importSeq,
        title: arr[i].title,
        meta: "Imported manual (" + (arr[i].fmt || "TXT") + ")",
        tag: "USER-DATA",
        kind: "import",
        body: arr[i].body
      });
    }
  }

  function persistImports() {
    var out = [], i;
    for (i = 0; i < model.length; i++) {
      if (model[i].kind === "import") {
        out.push({ title: model[i].title, body: model[i].body, fmt: model[i].fmt || "TXT" });
      }
    }
    return lsSet(K_IMPORTS, JSON.stringify(out));
  }

  function addImported(title, body, fmt) {
    importSeq++;
    var book = {
      id: "imp_" + importSeq,
      title: title,
      meta: "Imported manual (" + fmt + ")",
      tag: "USER-DATA",
      kind: "import",
      fmt: fmt,
      body: body
    };
    model.push(book);
    var saved = persistImports();
    renderLibrary();
    return saved;
  }

  function findBook(id) {
    var i;
    for (i = 0; i < model.length; i++) { if (model[i].id === id) { return model[i]; } }
    return null;
  }

  /* ================= RENDER LIBRARY ================= */
  function renderLibrary() {
    var list = $("bookList");
    list.innerHTML = "";
    var i;
    for (i = 0; i < model.length; i++) {
      var b = model[i];
      var li = document.createElement("li");
      li.setAttribute("data-id", b.id);
      li.innerHTML =
        '<span class="bk-title">' + esc(b.title) + '</span>' +
        '<span class="bk-meta">' + esc(b.meta) + '</span>' +
        '<span class="bk-tag">' + esc(b.tag) + '</span>';
      list.appendChild(li);
    }
  }

  function onListClick(e) {
    var t = e.target;
    while (t && t.tagName !== "LI") { t = t.parentNode; }
    if (!t) { return; }
    var b = findBook(t.getAttribute("data-id"));
    if (b) { openBook(b.title, b.body); }
  }

  /* ================= READER ================= */
  function renderBody(text) {
    var lines = String(text).split(/\r\n|\r|\n/);
    var i, out = [];
    for (i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (ln.substring(0, 3) === "## ") { out.push("<h2>" + esc(ln.substring(3)) + "</h2>"); }
      else if (ln.substring(0, 2) === "# ") { out.push("<h1>" + esc(ln.substring(2)) + "</h1>"); }
      else { out.push(esc(ln)); }
    }
    return out.join("\n");
  }

  function openBook(title, body) {
    $("readerTitle").innerHTML = esc(title);
    $("readerBody").innerHTML = renderBody(body);
    $("readerBody").scrollTop = 0;
    showScreen("reader");
  }

  /* ================= IMPORT (multi-format) ================= */
  function extOf(name) {
    var m = /\.([a-z0-9]+)$/i.exec(name || "");
    return m ? m[1].toLowerCase() : "";
  }
  function baseName(name) { return String(name).replace(/\.[^.]+$/, "").toUpperCase(); }

  function htmlToText(raw) {
    return String(raw)
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<\/(p|div|h[1-6]|li|tr|section|article|header|footer)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/gi, '"')
      .replace(/\n{3,}/g, "\n\n");
  }

  function importMsg(txt) { $("importMsg").textContent = txt; }
  function importMsgTimed(txt, ms) {
    importMsg(txt);
    setTimeout(function () { if ($("importMsg").textContent === txt) { importMsg(""); } }, ms || 4000);
  }

  function onFile(e) {
    var files = e.target.files;
    if (!files || !files.length) { return; }
    var f = files[0];
    var ext = extOf(f.name);
    importMsg("READING " + f.name.toUpperCase() + " ...");

    if (ext === "epub") {
      importEpub(f);
      e.target.value = "";
      return;
    }

    var reader = new FileReader();
    reader.onload = function (ev) {
      var raw = ev.target.result || "";
      var body, fmt;
      if (ext === "html" || ext === "htm") { body = htmlToText(raw); fmt = "HTML"; }
      else if (ext === "md" || ext === "markdown") { body = raw; fmt = "MD"; }
      else { body = raw; fmt = "TXT"; }
      var saved = addImported(baseName(f.name), body, fmt);
      importMsgTimed(saved ? ("LOADED: " + baseName(f.name)) : ("LOADED (session only, too big to save): " + baseName(f.name)), 5000);
    };
    reader.onerror = function () { importMsgTimed("READ ERROR", 4000); };
    reader.readAsText(f);
    e.target.value = "";
  }

  /* ---------- EPUB (lazy-loads JSZip when online) ---------- */
  function ensureJSZip(cb) {
    if (window.JSZip) { cb(true); return; }
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = function () { cb(!!window.JSZip); };
    s.onerror = function () { cb(false); };
    document.body.appendChild(s);
  }

  function joinPath(dir, href) {
    href = href.replace(/^\.\//, "");
    if (!dir) { return href; }
    // resolve simple ../ segments
    var base = dir.split("/");
    var parts = href.split("/");
    var i;
    for (i = 0; i < parts.length; i++) {
      if (parts[i] === "..") { base.pop(); }
      else if (parts[i] !== ".") { base.push(parts[i]); }
    }
    return base.join("/");
  }

  function importEpub(f) {
    ensureJSZip(function (ok) {
      if (!ok) {
        importMsgTimed("EPUB needs internet the first time (parser failed to load)", 6000);
        return;
      }
      var reader = new FileReader();
      reader.onload = function (ev) {
        window.JSZip.loadAsync(ev.target.result).then(function (zip) {
          return zip.file("META-INF/container.xml").async("string").then(function (container) {
            var m = /full-path="([^"]+)"/i.exec(container);
            var opfPath = m ? m[1] : "";
            var opfDir = opfPath.indexOf("/") > -1 ? opfPath.substring(0, opfPath.lastIndexOf("/")) : "";
            return zip.file(opfPath).async("string").then(function (opf) {
              var title = "EPUB";
              var tm = /<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i.exec(opf);
              if (tm) { title = htmlToText(tm[1]).replace(/\s+/g, " ").toUpperCase().substring(0, 60); }

              // manifest: id -> href
              var manifest = {}, mi;
              var reItem = /<item\b[^>]*>/gi;
              while ((mi = reItem.exec(opf))) {
                var tag = mi[0];
                var id = (/id="([^"]+)"/i.exec(tag) || [])[1];
                var href = (/href="([^"]+)"/i.exec(tag) || [])[1];
                if (id && href) { manifest[id] = href; }
              }
              // spine order
              var order = [], si;
              var reRef = /<itemref\b[^>]*idref="([^"]+)"/gi;
              while ((si = reRef.exec(opf))) { order.push(si[1]); }

              var chain = window.JSZip.external.Promise.resolve("");
              var acc = { text: "" };
              function readChapter(idref) {
                var href = manifest[idref];
                if (!href) { return window.JSZip.external.Promise.resolve(); }
                var full = joinPath(opfDir, href);
                var zf = zip.file(full);
                if (!zf) { return window.JSZip.external.Promise.resolve(); }
                return zf.async("string").then(function (xhtml) {
                  var t = htmlToText(xhtml).replace(/^\s+|\s+$/g, "");
                  if (t) { acc.text += t + "\n\n"; }
                });
              }
              var idx = 0;
              function next() {
                if (idx >= order.length) {
                  return window.JSZip.external.Promise.resolve();
                }
                var ref = order[idx++];
                return readChapter(ref).then(next);
              }
              return next().then(function () {
                var bodyText = "# " + title + "\n\n" + (acc.text || "(No readable text found in this EPUB.)");
                var saved = addImported(title, bodyText, "EPUB");
                importMsgTimed(saved ? ("LOADED: " + title) : ("LOADED (session only): " + title), 5000);
              });
            });
          });
        })["catch"](function () {
          importMsgTimed("EPUB PARSE ERROR (unsupported file?)", 6000);
        });
      };
      reader.onerror = function () { importMsgTimed("READ ERROR", 4000); };
      reader.readAsArrayBuffer(f);
    });
  }

  /* ================= SCREEN ROUTING ================= */
  var screens = ["menu", "library", "reader", "settings", "about"];
  function showScreen(name) {
    var i;
    for (i = 0; i < screens.length; i++) {
      var el = $("screen-" + screens[i]);
      if (el) { if (screens[i] === name) { removeClass(el, "hidden"); } else { addClass(el, "hidden"); } }
    }
    var btns = document.getElementsByClassName("nav-btn");
    for (i = 0; i < btns.length; i++) {
      var target = btns[i].getAttribute("data-screen");
      if (target === name) { addClass(btns[i], "nav-active"); } else { removeClass(btns[i], "nav-active"); }
    }
  }

  /* ================= SETTINGS ================= */
  function applyTheme(theme) {
    document.body.className = "theme-" + theme;
    lsSet(K_THEME, theme);
    setActive("btnAmber", theme === "amber");
    setActive("btnGreen", theme === "green");
  }
  function setActive(id, isOn) {
    var el = $(id); if (!el) { return; }
    if (isOn) { addClass(el, "active"); } else { removeClass(el, "active"); }
  }
  var fontPct = 100;
  function applyFont(pct) {
    fontPct = Math.max(70, Math.min(180, pct));
    lsSet(K_FONT, String(fontPct));
    $("readerBody").style.fontSize = (15 * fontPct / 100) + "px";
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
    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    var c = $("clock");
    if (c) { c.textContent = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m; }
  }

  /* ================= INIT (after loading) ================= */
  function init() {
    applyTheme(lsGet(K_THEME, "amber"));
    applyFont(parseInt(lsGet(K_FONT, "100"), 10));
    applyScan(lsGet(K_SCAN, "1") === "1");

    buildCompilation && model.push(buildCompilation());
    loadImports();
    renderLibrary();

    var btns = document.getElementsByClassName("nav-btn");
    var i;
    for (i = 0; i < btns.length; i++) {
      on(btns[i], "click", function () { showScreen(this.getAttribute("data-screen")); });
    }
    var mbtns = document.getElementsByClassName("menu-btn");
    for (i = 0; i < mbtns.length; i++) {
      on(mbtns[i], "click", function () {
        var go = this.getAttribute("data-go");
        if (go === "import") { showScreen("library"); setTimeout(function () { $("fileInput").click(); }, 60); }
        else { showScreen(go); }
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
      model = model.filter ? model.filter(function (b) { return b.kind !== "import"; }) : keepBundled();
      persistImports();
      renderLibrary();
      importMsgTimed("IMPORTS PURGED", 3000);
    });

    tickClock();
    setInterval(tickClock, 15000);
    showScreen("menu");
  }
  function keepBundled() {
    var out = [], i;
    for (i = 0; i < model.length; i++) { if (model[i].kind !== "import") { out.push(model[i]); } }
    return out;
  }

  /* ================= LOADING SCREEN ================= */
  var loadLines = [
    "> BOOT VEN-READ CORE ........... OK",
    "> MOUNT FIELD LIBRARY ......... OK",
    "> DECRYPT SURVIVAL PROTOCOLS .. OK",
    "> RAD-SHIELD ................. NOMINAL",
    "> READY."
  ];
  function runLoading(done) {
    var bar = $("loadBar");
    var out = $("loadText");
    var pct = 0;
    var barTimer = setInterval(function () {
      pct += 4;
      if (pct >= 100) { pct = 100; clearInterval(barTimer); }
      bar.style.width = pct + "%";
    }, 80);

    var li = 0, ci = 0, buf = "";
    function tick() {
      if (li >= loadLines.length) {
        setTimeout(function () { done(); }, 500);
        return;
      }
      var line = loadLines[li];
      if (ci < line.length) { buf += line.charAt(ci); out.textContent = buf; ci++; setTimeout(tick, 9); }
      else { buf += "\n"; out.textContent = buf; li++; ci = 0; setTimeout(tick, 130); }
    }
    tick();
  }

  function start() {
    runLoading(function () {
      addClass($("loading"), "hidden");
      removeClass($("app"), "hidden");
      init();
    });
  }

  var started = false;
  function safeStart() { if (!started) { started = true; start(); } }
  document.addEventListener("deviceready", safeStart, false);
  window.addEventListener("load", function () { setTimeout(safeStart, 500); }, false);
})();
