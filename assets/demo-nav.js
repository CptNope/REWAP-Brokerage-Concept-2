/*
 * demo-nav.js — the "Atlas pages" navigator shown on every page of the GitHub Pages demo.
 * It is not part of the design; it only lets visitors move between the brand book sheets
 * and the website concept pages. Set <html data-page="Main"> (artboard name) on each page.
 */
(function () {
  'use strict';
  if (window.top !== window) return; // never inside the phone frame

  var script = document.currentScript;
  var ROOT = new URL('..', script.src).href; // assets/ -> site root
  var REPO = 'https://github.com/CptNope/REWAP-Brokerage-Concept-2';

  var GROUPS = [
    { name: 'Brand book', items: [
      { id: 'Main', code: 'A', title: 'Strategy and voice', path: 'pages/Main.html' },
      { id: 'Identity', code: 'B', title: 'Mark, color and type', path: 'pages/Identity.html' },
      { id: 'System', code: 'C', title: 'System and components', path: 'pages/System.html' }
    ] },
    { name: 'Website concept', items: [
      { id: 'Home', code: 'D1', title: 'Home', path: 'pages/Home.html' },
      { id: 'Area', code: 'D2', title: 'Area Sheet · Shrewsbury', path: 'pages/Area.html' },
      { id: 'Search', code: 'D3', title: 'Property search', path: 'pages/Search.html' },
      { id: 'Listing', code: 'D4', title: 'Listing · sample', path: 'pages/Listing.html' },
      { id: 'MobileSearch', code: 'D5', title: 'Mobile search', path: 'pages/MobileSearch.html' }
    ] },
    { name: 'Platform', items: [
      { id: 'Platform', code: 'E', title: 'Entities, URLs and structured data', path: 'pages/Platform.html' }
    ] }
  ];
  var FLAT = [];
  GROUPS.forEach(function (g) { g.items.forEach(function (it) { FLAT.push(it); }); });

  var current = document.documentElement.getAttribute('data-page') || 'index';
  var idx = -1;
  FLAT.forEach(function (it, i) { if (it.id === current) idx = i; });
  var here = idx >= 0 ? FLAT[idx] : null;
  var prev = idx > 0 ? FLAT[idx - 1] : (idx === 0 ? null : null);
  var next = idx >= 0 && idx < FLAT.length - 1 ? FLAT[idx + 1] : (idx === -1 ? FLAT[0] : null);

  var css = [
    '.dcx{position:fixed;left:16px;bottom:16px;z-index:2147483000;font-family:Archivo,system-ui,sans-serif;color:#F1F2EE;-webkit-font-smoothing:antialiased}',
    '.dcx *{box-sizing:border-box}',
    '.dcx-toggle{appearance:none;display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 16px 0 10px;border:0;border-left:4px solid #FAAF40;background:#0F2342;color:#F1F2EE;font:600 15px/1 Archivo,system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px rgba(15,35,66,.28)}',
    '.dcx-toggle img{width:28px;height:28px;border-radius:50%;background:#fff}',
    '.dcx-toggle .dcx-code{font:500 12px/1 "Azeret Mono",ui-monospace,monospace;color:#AFC0D6;letter-spacing:.04em}',
    '.dcx-toggle:hover{background:#193661}',
    '.dcx :focus-visible{outline:2px solid #FAAF40;outline-offset:3px;box-shadow:0 0 0 5px #193661}',
    '.dcx-panel{position:absolute;left:0;bottom:calc(100% + 8px);width:min(360px,calc(100vw - 32px));max-height:min(640px,calc(100vh - 96px));overflow:auto;background:#0F2342;border-top:4px solid #FAAF40;box-shadow:0 8px 24px rgba(15,35,66,.28)}',
    '.dcx-panel[hidden]{display:none}',
    '.dcx-head{padding:16px 18px 12px;border-bottom:1px solid rgba(175,192,214,.25)}',
    '.dcx-head b{display:block;font:600 19px/1.2 "Brygada 1918",Georgia,serif;color:#F1F2EE}',
    '.dcx-head span{display:block;margin-top:6px;font:400 12px/1.4 "Azeret Mono",ui-monospace,monospace;color:#AFC0D6}',
    '.dcx-group{padding:12px 0 4px}',
    '.dcx-group h2{margin:0;padding:0 18px 6px;font:700 11px/1 Archivo,system-ui,sans-serif;font-stretch:72%;letter-spacing:.12em;text-transform:uppercase;color:#AFC0D6}',
    '.dcx-group ul{list-style:none;margin:0;padding:0}',
    '.dcx-group a{display:grid;grid-template-columns:40px 1fr;align-items:center;min-height:44px;padding:0 18px;color:#F1F2EE;text-decoration:none;font:500 15px/1.25 Archivo,system-ui,sans-serif}',
    '.dcx-group a span{font:500 12px/1 "Azeret Mono",ui-monospace,monospace;color:#AFC0D6}',
    '.dcx-group a:hover{background:#193661}',
    '.dcx-group a[aria-current="page"]{background:#193661;box-shadow:inset 4px 0 0 #FAAF40}',
    '.dcx-group a[aria-current="page"] span{color:#FAAF40}',
    '.dcx-foot{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid rgba(175,192,214,.25)}',
    '.dcx-foot a{display:flex;flex-direction:column;justify-content:center;gap:4px;min-height:56px;padding:8px 18px;color:#F1F2EE;text-decoration:none;font:500 14px/1.2 Archivo,system-ui,sans-serif}',
    '.dcx-foot a + a{border-left:1px solid rgba(175,192,214,.25);text-align:right}',
    '.dcx-foot a small{font:400 11px/1 "Azeret Mono",ui-monospace,monospace;color:#AFC0D6}',
    '.dcx-foot a:hover{background:#193661}',
    '.dcx-links{display:flex;flex-wrap:wrap;gap:0;border-top:1px solid rgba(175,192,214,.25)}',
    '.dcx-links a{flex:1 1 50%;display:flex;align-items:center;min-height:44px;padding:0 18px;color:#FAAF40;font:600 14px/1.2 Archivo,system-ui,sans-serif;text-decoration:none}',
    '.dcx-links a:hover{text-decoration:underline;text-underline-offset:3px}',
    '.dcx-compact .dcx-toggle .dcx-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '@media (max-width:640px){.dcx{left:12px;bottom:12px}.dcx:not(.dcx-compact) .dcx-code{display:none}}',
    '@media print{.dcx{display:none}}'
  ].join('\n');

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function build() {
    document.head.appendChild(el('style', { 'data-dcx': '' }, css));
    var compact = document.documentElement.getAttribute('data-nav') === 'compact';
    var nav = el('nav', { class: compact ? 'dcx dcx-compact' : 'dcx', 'aria-label': 'Concept pages' });
    var btn = el('button', { class: 'dcx-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'dcx-panel' },
      '<img src="' + ROOT + 'assets/logo/rewap-mark.webp" alt="">' +
      '<span class="dcx-label">Atlas pages</span>' +
      '<span class="dcx-code">' + (here ? esc(here.code) : 'Index') + '</span>');

    var panel = el('div', { class: 'dcx-panel', id: 'dcx-panel', hidden: '' });
    var html = '<div class="dcx-head"><b>The Massachusetts Atlas</b><span>REWAP Brokerage · concept v0.1 · demo data labeled</span></div>';
    GROUPS.forEach(function (g) {
      html += '<div class="dcx-group"><h2>' + esc(g.name) + '</h2><ul>';
      g.items.forEach(function (it) {
        html += '<li><a href="' + ROOT + it.path + '"' + (it.id === current ? ' aria-current="page"' : '') + '><span>' + esc(it.code) + '</span>' + esc(it.title) + '</a></li>';
      });
      html += '</ul></div>';
    });
    if (prev || next) {
      html += '<div class="dcx-foot">' +
        (prev ? '<a href="' + ROOT + prev.path + '" rel="prev"><small>← Previous · ' + esc(prev.code) + '</small>' + esc(prev.title) + '</a>' : '<a href="' + ROOT + 'index.html"><small>← Overview</small>All pages</a>') +
        (next ? '<a href="' + ROOT + next.path + '" rel="next"><small>Next · ' + esc(next.code) + ' →</small>' + esc(next.title) + '</a>' : '<a href="' + ROOT + 'index.html"><small>Overview →</small>All pages</a>') +
        '</div>';
    }
    html += '<div class="dcx-links"><a href="' + ROOT + 'index.html"' + (current === 'index' ? ' aria-current="page"' : '') + '>Overview</a><a href="' + REPO + '#readme">README and design files</a></div>';
    panel.innerHTML = html;

    nav.appendChild(panel);
    nav.appendChild(btn);
    document.body.appendChild(nav);

    function setOpen(open, focusBack) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { panel.removeAttribute('hidden'); var cur = panel.querySelector('[aria-current="page"]') || panel.querySelector('a'); if (cur) cur.focus(); }
      else { panel.setAttribute('hidden', ''); if (focusBack) btn.focus(); }
    }
    btn.addEventListener('click', function () { setOpen(panel.hasAttribute('hidden')); });
    nav.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hasAttribute('hidden')) { e.stopPropagation(); setOpen(false, true); } });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target) && !panel.hasAttribute('hidden')) setOpen(false); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
