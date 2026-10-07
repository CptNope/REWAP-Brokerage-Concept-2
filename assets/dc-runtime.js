/*
 * dc-runtime.js — renders a Claude Design artboard (.dc.html) as a live page.
 *
 * The artboards in /design/project are the original Claude design files. Each one holds:
 *   <x-dc> … </x-dc>                markup with {{holes}}, <sc-for> loops and <sc-if> conditionals
 *   <helmet> … </helmet>            page-level <title>, fonts and CSS
 *   <script type="text/x-dc">       a `class Component extends DCLogic` with renderVals()
 *
 * This file is a small, dependency-free interpreter for that format so the artboards can be
 * hosted as a static site (GitHub Pages). It renders once, then patches the DOM in place on
 * every setState(), which keeps focus, typed text and CSS transitions intact.
 *
 * Usage:  DCRuntime.mount('../design/project/Home.dc.html');
 */
(function () {
  'use strict';

  // Uploaded canvas assets are referenced as /_blob/<id>; map them to the copies in /assets.
  var BLOB = {
    '3affeedba6a8e06ff490ab248ea48c72': 'rewap-logo-horizontal.png',
    '95565ea2cf60cff46df98f6f8649de9f': 'rewap-mark.webp'
  };

  var EVENTS = {
    onclick: 'click', onmouseenter: 'mouseenter', onmouseleave: 'mouseleave',
    onfocus: 'focusin', onblur: 'focusout', onsubmit: 'submit',
    oninput: 'input', onchange: 'change', onkeydown: 'keydown', onkeyup: 'keyup'
  };
  var BUBBLING = ['click', 'submit', 'input', 'change', 'focusin', 'focusout', 'keydown', 'keyup'];
  var DIRECT = ['mouseenter', 'mouseleave'];
  var BOOLEAN_ATTR = /^(checked|disabled|selected|open|hidden|readonly|required|multiple)$/;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function lookup(path, scopes) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var parts = path.split('.');
    for (var i = scopes.length - 1; i >= 0; i--) {
      var sc = scopes[i];
      if (sc && Object.prototype.hasOwnProperty.call(sc, parts[0])) {
        var v = sc[parts[0]];
        for (var j = 1; j < parts.length; j++) v = v == null ? undefined : v[parts[j]];
        return v;
      }
    }
    return undefined;
  }

  function interpolate(str, scopes) {
    return str.replace(/\{\{\s*([^}]+?)\s*\}\}/g, function (_, p) {
      var v = lookup(p, scopes);
      return v == null ? '' : String(v);
    });
  }

  function mount(src, opts) {
    opts = opts || {};
    var assetBase = opts.assetBase || '../assets/logo/';
    var inFrame = window.top !== window;

    var fixBlobs = function (s) {
      return s.replace(/\/_blob\/([0-9a-f]{32})/g, function (m, id) {
        return BLOB[id] ? assetBase + BLOB[id] : m;
      });
    };

    // Links between artboards (Area.dc.html) point at their viewer pages (Area.html).
    var fixHref = function (v) {
      return v.replace(/^([A-Za-z0-9_-]+)\.dc\.html/, function (_, name) {
        return (opts.pageMap && opts.pageMap[name]) || name + '.html';
      });
    };

    return fetch(src, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('Could not load ' + src + ' (' + r.status + ')');
        return r.text();
      })
      .then(function (SRC) {
        var helmet = (SRC.match(/<helmet>([\s\S]*?)<\/helmet>/) || [, ''])[1];
        var body = SRC.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '');
        var code = SRC.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
        var propsAttr = (SRC.match(/<script type="text\/x-dc"[^>]*data-props='([^']*)'/) || [, '{}'])[1];

        // Head: title, font links and page CSS from <helmet>.
        var head = document.createElement('template');
        head.innerHTML = fixBlobs(helmet);
        Array.prototype.slice.call(head.content.childNodes).forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.localName === 'title') { document.title = n.textContent; return; }
          document.head.appendChild(n);
        });

        var root = document.getElementById('root') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'root' }));

        var pending = false;
        function schedule() {
          if (pending) return;
          pending = true;
          requestAnimationFrame(function () { pending = false; paint(); });
        }

        function DCLogic(props) { this.props = props || {}; this.state = {}; }
        DCLogic.prototype.setState = function (p) {
          var next = typeof p === 'function' ? p(this.state, this.props) : p;
          this.state = Object.assign({}, this.state, next);
          schedule();
        };
        DCLogic.prototype.forceUpdate = function () { schedule(); };

        var props = {};
        try { props = JSON.parse(propsAttr); } catch (e) { /* ignore */ }
        // eslint-disable-next-line no-new-func
        var Component = new Function('DCLogic', code + '\n;return Component;')(DCLogic);
        var inst = new Component(props);
        if (!inst.state) inst.state = {};

        var tpl = document.createElement('template');
        tpl.innerHTML = fixBlobs(body);

        // ---- render: template + values -> fresh DOM tree -------------------------------
        function render(node, scopes, out) {
          if (node.nodeType === 3) { out.appendChild(document.createTextNode(interpolate(node.nodeValue, scopes))); return; }
          if (node.nodeType !== 1) return;
          var tag = node.localName;
          var kids = node.content ? node.content.childNodes : node.childNodes;

          if (tag === 'sc-for') {
            var lm = (node.getAttribute('list') || '').match(WHOLE);
            var list = (lm && lookup(lm[1], scopes)) || [];
            var as = node.getAttribute('as') || 'item';
            list.forEach(function (item, i) {
              var frame = {}; frame[as] = item; frame.$index = i;
              var sc = scopes.concat([frame]);
              kids.forEach(function (k) { render(k, sc, out); });
            });
            return;
          }
          if (tag === 'sc-if') {
            var vm = (node.getAttribute('value') || '').match(WHOLE);
            if (vm && lookup(vm[1], scopes)) kids.forEach(function (k) { render(k, scopes, out); });
            return;
          }

          var el = node.namespaceURI === SVG_NS ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
          Array.prototype.forEach.call(node.attributes, function (a) {
            var whole = a.value.match(WHOLE);
            var lname = a.name.toLowerCase();
            if (EVENTS[lname]) {
              if (whole) {
                var fn = lookup(whole[1], scopes);
                if (typeof fn === 'function') { el.__dc = el.__dc || {}; el.__dc[EVENTS[lname]] = fn; }
              }
              return;
            }
            if (whole && BOOLEAN_ATTR.test(lname)) {
              var on = !!lookup(whole[1], scopes);
              if (on) el.setAttribute(a.name, '');
              if (lname === 'checked') { el.checked = on; el.__ctlChecked = true; }
              return;
            }
            var v = whole ? lookup(whole[1], scopes) : interpolate(a.value, scopes);
            if (v === undefined || v === null || v === false) return;
            v = String(v);
            if (lname === 'href') {
              v = fixHref(v);
              if (inFrame && /\.html(#|$)/.test(v)) el.setAttribute('target', '_top');
            }
            try { el.setAttribute(a.name, v); } catch (e) { /* invalid attribute name */ }
          });
          var target = tag === 'template' ? el.content : el;
          kids.forEach(function (k) { render(k, scopes, target); });
          out.appendChild(el);
        }

        // ---- patch: update the live DOM to match a fresh tree --------------------------
        function patchNode(a, b) {
          if (a.nodeType === 3) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
          var i, at;
          for (i = a.attributes.length - 1; i >= 0; i--) {
            at = a.attributes[i];
            if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);
          }
          for (i = 0; i < b.attributes.length; i++) {
            at = b.attributes[i];
            if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
          }
          a.__dc = b.__dc;
          if (b.__ctlChecked) { a.checked = b.checked; a.__ctlChecked = true; }
          if ((a.localName === 'input' || a.localName === 'textarea') && b.hasAttribute('value') && document.activeElement !== a) a.value = b.getAttribute('value');
          patchChildren(a, b);
        }

        function patchChildren(a, b) {
          var an = Array.prototype.slice.call(a.childNodes);
          var bn = Array.prototype.slice.call(b.childNodes);
          for (var i = 0; i < bn.length; i++) {
            var x = an[i], y = bn[i];
            if (!x) { a.appendChild(y); continue; }
            if (x.nodeType !== y.nodeType || x.nodeName !== y.nodeName) { a.replaceChild(y, x); continue; }
            patchNode(x, y);
          }
          for (var j = bn.length; j < an.length; j++) a.removeChild(an[j]);
        }

        var first = true;
        function paint() {
          var vals = inst.renderVals();
          var holder = document.createElement('div');
          tpl.content.childNodes.forEach(function (n) { render(n, [vals], holder); });
          if (first) { root.replaceChildren.apply(root, Array.prototype.slice.call(holder.childNodes)); first = false; }
          else patchChildren(root, holder);
        }

        // ---- events: delegated, so patched nodes always call the latest handler --------
        BUBBLING.forEach(function (type) {
          root.addEventListener(type, function (e) {
            if (type === 'submit') e.preventDefault();
            for (var n = e.target; n && n !== root; n = n.parentNode) {
              var h = n.__dc && n.__dc[type];
              if (h) { h(e); if (e.cancelBubble) break; }
            }
          });
        });
        DIRECT.forEach(function (type) {
          root.addEventListener(type, function (e) {
            var h = e.target && e.target.__dc && e.target.__dc[type];
            if (h) h(e);
          }, true);
        });

        paint();
        if (typeof inst.componentDidMount === 'function') setTimeout(function () { inst.componentDidMount(); }, 0);
        window.addEventListener('pagehide', function () {
          if (typeof inst.componentWillUnmount === 'function') inst.componentWillUnmount();
        });
        document.documentElement.setAttribute('data-dc-ready', '');
        window.__dc = inst;
        return inst;
      })
      .catch(function (err) {
        var msg = document.createElement('div');
        msg.setAttribute('role', 'alert');
        msg.style.cssText = 'font:16px/1.5 system-ui,sans-serif;max-width:640px;margin:15vh auto;padding:24px;border:1px solid #A3402B;color:#121A2B;background:#fff';
        msg.textContent = 'This page could not be rendered. ' + err.message +
          (location.protocol === 'file:' ? ' Open the site through a web server (for example GitHub Pages or `python3 -m http.server`), not straight from the file system.' : '');
        document.body.appendChild(msg);
        throw err;
      });
  }

  window.DCRuntime = { mount: mount };
})();
