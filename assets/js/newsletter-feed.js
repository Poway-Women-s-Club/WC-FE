/* Newsletter page: archive of past issues, sourced from the live blog API.
 *
 * Admins/officers add a new issue weekly using the normal Blog "+ New Post"
 * editor (the same workflow as "What we do:" posts) — any post whose title
 * starts with "Newsletter:" is rendered here as a dated issue, newest first.
 * The "Add this week's issue" button deep-links straight into the blog
 * composer with the title prefix pre-filled.
 */

(function () {
  "use strict";

  var PREFIX_RE = /^newsletter\s*:\s*/i;

  /* Always use the configured site base (set in head.html). The
     home-feeds.js style of reading the canonical link returns the
     *current page's* path on non-home pages, which produced links like
     /navigation/newsletter/navigation/blog?... → 404. */
  function siteBase() {
    var b = (typeof window.PWC_BASE === "string") ? window.PWC_BASE : "";
    return b.replace(/\/$/, "");
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
    } catch (e) {
      return "";
    }
  }

  function resolveApi() {
    if (typeof window.API !== "undefined" && window.API) {
      return String(window.API).replace(/\/$/, "");
    }
    if (typeof window.PWC_API_BASE_URL !== "undefined" && window.PWC_API_BASE_URL) {
      return String(window.PWC_API_BASE_URL).replace(/\/$/, "");
    }
    return "";
  }

  /* Show the "Add this week's issue" button to any signed-in member. */
  function setupComposeButton() {
    var btn = document.getElementById("pwc-newsletter-new");
    if (!btn) return;
    var u = null;
    try { u = JSON.parse(sessionStorage.getItem("pwc_user") || "null"); } catch (e) {}
    if (!u) return;
    var sb = siteBase();
    btn.href =
      sb + "/navigation/blog?compose=1&title=" + encodeURIComponent("Newsletter: ");
    btn.hidden = false;
  }

  function loadIssues() {
    var el = document.getElementById("pwc-newsletter-archive");
    if (!el) return;
    var base = resolveApi();
    if (!base) {
      el.innerHTML =
        '<p class="pwc-home-feed-msg">Set the site API URL so newsletter issues can load.</p>';
      return;
    }
    var params = new URLSearchParams();
    params.set("page", "1");
    params.set("per_page", "60");
    params.set("sort", "newest");
    fetch(base + "/api/blog/posts?" + params.toString(), { credentials: "include" })
      .then(function (r) {
        return r.ok ? r.json() : Promise.reject();
      })
      .then(function (data) {
        var posts = (data && data.posts) || [];
        var issues = posts.filter(function (p) {
          return PREFIX_RE.test((p.title || "").trim());
        });
        if (!issues.length) {
          el.innerHTML =
            '<p class="pwc-home-feed-msg">No issues published yet. Officers and members with blog access can add one from the <strong>Blog</strong> using a title that starts with <strong>Newsletter:</strong> — it will appear here automatically.</p>';
          return;
        }
        var sb = siteBase();
        var viewer = null;
        try { viewer = JSON.parse(sessionStorage.getItem("pwc_user") || "null"); } catch (e) {}
        var html = '<div class="pwc-home-ww-grid">';
        issues.forEach(function (p) {
          var shortTitle =
            (p.title || "").replace(PREFIX_RE, "").trim() || p.title || "Untitled issue";
          var prev = (p.body || "").replace(/\s+/g, " ").trim();
          if (prev.length > 180) prev = prev.slice(0, 177) + "…";
          var canManage = !!(
            viewer &&
            (viewer.role === "admin" || String(viewer.id) === String(p.author_id))
          );
          var link = esc(sb + "/navigation/blog?post=" + p.id);
          html +=
            '<article class="pwc-home-ww-card">' +
            '<a class="pwc-home-ww-link" href="' + link + '">' +
            esc(shortTitle) +
            "</a>" +
            '<span class="pwc-home-ww-meta">' +
            esc(fmtDate(p.created_at)) +
            " · By " +
            esc(p.author || "Member") +
            "</span>" +
            '<p class="pwc-home-ww-preview">' +
            esc(prev) +
            "</p>" +
            '<div class="pwc-home-ww-actions">' +
            '<a class="pwc-btn pwc-btn-fill pwc-btn-sm" href="' + link + '">Read issue</a>' +
            (canManage
              ? '<a class="pwc-btn pwc-btn-border pwc-btn-sm" href="' + link + '">Manage</a>'
              : "") +
            "</div>" +
            "</article>";
        });
        html += "</div>";
        el.innerHTML = html;
      })
      .catch(function () {
        el.innerHTML =
          '<p class="pwc-home-feed-msg">Could not load newsletter issues. Try again later.</p>';
      });
  }

  function init() {
    setupComposeButton();
    loadIssues();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
