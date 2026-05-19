---
# Use default layout (not `page`) so content is not trapped in the narrow column.
layout: default
title: Newsletter
permalink: /navigation/newsletter/
hide: true
show_reading_time: false
---

<div class="pwc-section" style="max-width:var(--pwc-content-max); margin:0 auto; padding-top:var(--pwc-section-pad-y);">
  <span class="pwc-hero-kicker">Members &amp; community</span>
  <h2>Club Newsletter</h2>
  <hr class="pwc-rule">
  <p style="margin-top:0;">Recaps, upcoming events, scholarship news, and member spotlights — published regularly by club officers. Browse past issues below, or open any issue to read it in full and join the conversation.</p>
  <p class="pwc-home-hint">New issues are posted on the club blog with a title that starts with <strong>Newsletter:</strong> and appear here automatically, newest first. Officers and members with blog access can publish a new issue each week.</p>

  <div class="pwc-home-feed-actions">
    <a id="pwc-newsletter-new" class="pwc-btn pwc-btn-fill" href="{{ site.baseurl }}/navigation/blog" hidden>+ Add this week's issue</a>
    <a class="pwc-btn pwc-btn-border" href="{{ site.baseurl }}/navigation/login">Sign in to publish</a>
  </div>
</div>

<div class="pwc-section" style="max-width:var(--pwc-content-max); margin:0 auto;">
  <h3>Past issues</h3>
  <hr class="pwc-rule">
  <div id="pwc-newsletter-archive">
    <p class="pwc-home-feed-msg">Loading newsletter issues…</p>
  </div>
</div>

<script>
var API = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "{{ site.events_api_local_url | default: 'http://localhost:8327' | escape }}"
  : "{{ site.events_api_base_url | escape }}";
window.PWC_API_BASE_URL = API;
</script>
<script src="{{ '/assets/js/newsletter-feed.js' | relative_url }}"></script>
