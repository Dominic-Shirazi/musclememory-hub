// Muscle Memory Hub browse page: reads index.json beside this page and lists its packages.
// No build step and no external scripts. All text goes in through textContent.
(function () {
  "use strict";

  var KIND_LABEL = { routine: "Routine", catalogue: "Menu map", site: "Site map", api: "API record" };
  var state = { packages: [], q: "", kind: "" };
  var listEl = document.getElementById("list");
  var statusEl = document.getElementById("status");
  var metaEl = document.getElementById("meta");
  var tpl = document.getElementById("card");

  function kindOf(pkg) {
    if (pkg.kind) return pkg.kind;
    if (pkg.routines) return "routine";
    if (pkg.site && pkg.catalogue) return "site";
    if (pkg.catalogue) return "catalogue";
    return "routine";
  }

  function target(pkg) {
    if (pkg.site && pkg.site.host) return pkg.site.host;
    var p = pkg.program;
    if (p && typeof p === "object") return p.label || p.process || "";
    if (p) return String(p);
    if (pkg.apis && pkg.apis.length) return pkg.apis.join(", ");
    return "";
  }

  function haystack(pkg) {
    return [pkg.id, pkg.name, pkg.summary, target(pkg), pkg.author, (pkg.routine_ids || []).join(" "),
      (pkg.apis || []).join(" ")].join(" ").toLowerCase();
  }

  function matches(pkg) {
    if (state.kind && kindOf(pkg) !== state.kind) return false;
    var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    var hay = haystack(pkg);
    return words.every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function fileLinks(ul, pkg, version) {
    ul.textContent = "";
    var rel = pkg.releases && pkg.releases[version];
    if (!rel || !rel.files) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "packages/" + encodeURIComponent(pkg.id + "-" + version) + ".musclemap";
      a.textContent = pkg.id + "-" + version + ".musclemap";
      li.appendChild(a);
      ul.appendChild(li);
      return;
    }
    Object.keys(rel.files).sort().forEach(function (name) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = rel.path.split("/").concat(name.split("/")).map(encodeURIComponent).join("/");
      a.textContent = name;
      var sha = document.createElement("span");
      sha.className = "sha";
      sha.textContent = String(rel.files[name]).replace("sha256:", "").slice(0, 12);
      sha.title = rel.files[name];
      li.appendChild(a);
      li.appendChild(sha);
      ul.appendChild(li);
    });
  }

  function card(pkg) {
    var node = tpl.content.firstElementChild.cloneNode(true);
    var q = function (sel) { return node.querySelector(sel); };
    q(".name").textContent = pkg.name || pkg.id;
    q(".kind").textContent = KIND_LABEL[kindOf(pkg)] || kindOf(pkg);
    q(".summary").textContent = pkg.summary || "";
    q(".id").textContent = pkg.id;
    q(".target").textContent = target(pkg) || "any";
    q(".os").textContent = (pkg.os || []).join(", ") || "any";
    q(".author").textContent = (pkg.author || "unknown") + (pkg.key_id ? " (" + pkg.key_id + ")" : "");
    q(".cmd").textContent = "musclememory hub pull " + pkg.id;
    var sel = q(".ver");
    var versions = (pkg.versions || [pkg.latest]).slice().reverse();
    versions.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v + (v === pkg.latest ? " (latest)" : "");
      sel.appendChild(opt);
    });
    sel.value = pkg.latest;
    sel.addEventListener("change", function () {
      q(".cmd").textContent = "musclememory hub pull " + pkg.id + (sel.value === pkg.latest ? "" : " --version " + sel.value);
      fileLinks(q(".filelist"), pkg, sel.value);
    });
    q(".copy").addEventListener("click", function () {
      var text = q(".cmd").textContent;
      var btn = q(".copy");
      var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { btn.textContent = "Select it"; });
      } else {
        btn.textContent = "Select it";
      }
    });
    fileLinks(q(".filelist"), pkg, pkg.latest);
    return node;
  }

  function render() {
    var shown = state.packages.filter(matches);
    listEl.textContent = "";
    shown.forEach(function (pkg) { listEl.appendChild(card(pkg)); });
    var total = state.packages.length;
    if (!total) statusEl.textContent = "No packages yet. Be the first: share a map from Muscle Memory.";
    else if (!shown.length) statusEl.textContent = "Nothing matches. Try fewer words or another kind.";
    else statusEl.textContent = shown.length === total ? total + " package(s)" : shown.length + " of " + total + " package(s)";
  }

  function readFilters() {
    var params = new URLSearchParams(location.search);
    state.q = params.get("q") || "";
    state.kind = params.get("kind") || "";
    document.getElementById("q").value = state.q;
    document.getElementById("kind").value = state.kind;
  }

  function writeFilters() {
    var params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.kind) params.set("kind", state.kind);
    var qs = params.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  document.getElementById("q").addEventListener("input", function (e) {
    state.q = e.target.value; writeFilters(); render();
  });
  document.getElementById("kind").addEventListener("change", function (e) {
    state.kind = e.target.value; writeFilters(); render();
  });

  readFilters();
  fetch("index.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (index) {
      state.packages = (index.packages || []).slice().sort(function (a, b) {
        return String(a.name || a.id).localeCompare(String(b.name || b.id));
      });
      metaEl.textContent = "Index updated " + (index.updated || "?") + ".";
      render();
    })
    .catch(function (err) {
      statusEl.textContent = "Could not load index.json (" + err.message + ").";
    });
})();
