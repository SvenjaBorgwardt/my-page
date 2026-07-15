/* effects.js — Svenja Borgwardt portfolio
   A foundation · B split-flap · C pronunciation · D compass demo */

(function () {
  'use strict';

  // ── Motion & performance detection ─────────────────────────
  var prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lowPerf = !prefersReduced && navigator.hardwareConcurrency < 4;

  document.documentElement.dataset.motion = prefersReduced ? 'reduced' : 'full';
  if (lowPerf) document.documentElement.dataset.perf = 'low';

  if (!prefersReduced && !lowPerf) {
    var slow = 0;
    var last = performance.now();
    var measuring = true;
    var tick = function (now) {
      if (!measuring) return;
      if (now - last > 20) slow++;
      last = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(function () {
      measuring = false;
      if (slow > 5) {
        lowPerf = true;
        document.documentElement.dataset.perf = 'low';
      }
    }, 800);
  }

  // ── Split-Flap roller (Phase B) ─────────────────────────────
  var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var REEL_SIZE = 6;

  function randomChar(exclude) {
    var c;
    do { c = ALPHA[Math.floor(Math.random() * ALPHA.length)]; } while (c === exclude);
    return c;
  }

  function collectLetters(h1) {
    var letters = [];
    function walk(node, italic) {
      if (node.nodeType === 3) {
        for (var i = 0; i < node.textContent.length; i++) {
          var ch = node.textContent[i];
          if (ch !== ' ' && ch !== '\n' && ch !== '\t') {
            letters.push({ node: node, index: i, char: ch, italic: italic });
          }
        }
      } else if (node.tagName === 'EM') {
        for (var j = 0; j < node.childNodes.length; j++) walk(node.childNodes[j], true);
      } else if (node.nodeType === 1 && !node.classList.contains('sep') && !node.classList.contains('pronounce-btn')) {
        for (var k = 0; k < node.childNodes.length; k++) walk(node.childNodes[k], italic);
      }
    }
    for (var i = 0; i < h1.childNodes.length; i++) walk(h1.childNodes[i], false);
    return letters;
  }

  function animateLetter(letter, nameBlock, h1, done) {
    var range = document.createRange();
    range.setStart(letter.node, letter.index);
    range.setEnd(letter.node, letter.index + 1);
    var charRect = range.getBoundingClientRect();

    var hiddenSpan = document.createElement('span');
    hiddenSpan.style.visibility = 'hidden';
    range.surroundContents(hiddenSpan);
    range.detach();

    var containerRect = nameBlock.getBoundingClientRect();
    var cs = getComputedStyle(h1);

    var overlay = document.createElement('div');
    overlay.className = 'flip-overlay';
    var oLeft = charRect.left - containerRect.left;
    var oTop = charRect.top - containerRect.top;
    var oW = charRect.width;
    var oH = charRect.height;

    overlay.style.left = oLeft + 'px';
    overlay.style.top = oTop + 'px';
    overlay.style.width = oW + 'px';
    overlay.style.height = oH + 'px';
    overlay.style.fontFamily = cs.fontFamily;
    overlay.style.fontSize = cs.fontSize;
    overlay.style.fontWeight = cs.fontWeight;
    overlay.style.letterSpacing = cs.letterSpacing;
    overlay.style.webkitFontSmoothing = cs.webkitFontSmoothing;
    overlay.style.color = cs.color;
    overlay.style.lineHeight = oH + 'px';
    /* Belt-and-suspenders clipping — pixel-exact rect prevents any reel leak */
    overlay.style.clip = 'rect(0, ' + oW + 'px, ' + oH + 'px, 0)';
    if (letter.italic) overlay.style.fontStyle = 'italic';

    var mid = Math.floor(REEL_SIZE / 2);
    var reel = document.createElement('div');

    for (var i = 0; i < REEL_SIZE; i++) {
      var slot = document.createElement('div');
      slot.style.height = charRect.height + 'px';
      slot.style.lineHeight = charRect.height + 'px';
      slot.textContent = (i === mid) ? letter.char : randomChar(letter.char.toUpperCase());
      reel.appendChild(slot);
    }

    var startY = -(REEL_SIZE - 1) * charRect.height;
    var endY = -mid * charRect.height;

    reel.style.transform = 'translateY(' + startY + 'px)';
    overlay.appendChild(reel);
    nameBlock.appendChild(overlay);

    var duration = 550 + Math.random() * 150;
    reel.style.transition = 'transform ' + duration + 'ms cubic-bezier(0.22, 1, 0.36, 1)';

    void reel.offsetHeight;
    reel.style.transform = 'translateY(' + endY + 'px)';

    function cleanup() {
      reel.removeEventListener('transitionend', cleanup);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      var parent = hiddenSpan.parentNode;
      if (parent) {
        var text = document.createTextNode(hiddenSpan.textContent);
        parent.replaceChild(text, hiddenSpan);
        parent.normalize();
      }
      if (done) done();
    }

    reel.addEventListener('transitionend', cleanup);
  }

  function initSplitFlap() {
    var h1 = document.querySelector('.masthead h1');
    var nameBlock = document.querySelector('.name-block');
    if (!h1 || !nameBlock) return;

    var running = false;

    function scheduleNext() {
      var delay = 3000 + Math.random() * 2000;
      setTimeout(function () {
        if (running) { scheduleNext(); return; }
        running = true;
        var letters = collectLetters(h1);
        if (!letters.length) { running = false; scheduleNext(); return; }
        var idx = Math.floor(Math.random() * letters.length);
        animateLetter(letters[idx], nameBlock, h1, function () {
          running = false;
          scheduleNext();
        });
      }, delay);
    }

    scheduleNext();
  }

  // ── Photo parallax tilt ─────────────────────────────────────
  function initPhotoTilt() {
    var frame = document.querySelector('.photo-frame');
    if (!frame) return;

    var MAX = 4;

    frame.addEventListener('mousemove', function (e) {
      var rect = frame.getBoundingClientRect();
      var nx = (e.clientX - rect.left) / rect.width - 0.5;
      var ny = (e.clientY - rect.top) / rect.height - 0.5;
      var rx = (ny * 2 * MAX).toFixed(2);
      var ry = (-nx * 2 * MAX).toFixed(2);
      frame.style.transform =
        'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });

    frame.addEventListener('mouseleave', function () {
      frame.style.transform = '';
    });
  }

  // ── Photo easter egg — one click, one line, and it stays ───
  // Runs OUTSIDE the prefersReduced guard (unlike the tilt): the reveal is
  // content, not decoration. The CSS drops the fade under reduced motion.
  function initPhotoQuote() {
    var btn = document.getElementById('photo-egg');
    var quote = document.getElementById('photo-quote');
    if (!btn || !quote) return;

    btn.addEventListener('click', function () {
      if (!quote.hidden) return;
      quote.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      // Two frames so the un-hide is committed before the transition starts.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          quote.classList.add('shown');
        });
      });
    });
  }

  // ── Story figure lightbox — click a screenshot to read it full size ──
  // Content, not decoration, so it runs regardless of reduced motion (the CSS
  // drops the fade). Wraps every figure <img> in a button and opens a single
  // reused overlay; <video> figures are left alone (they have their own
  // fullscreen). Works with the lazy-mounted Dojo image: we wrap the element,
  // mountLazyMedia still fills its src later.
  function initFigureZoom() {
    var figs = document.querySelectorAll('.et-figure img');
    if (!figs.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Enlarged image');
    box.hidden = true;

    var big = document.createElement('img');
    big.className = 'lightbox-img';
    big.alt = '';

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'lightbox-close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';

    box.appendChild(big);
    box.appendChild(close);
    document.body.appendChild(box);

    var lastFocus = null;

    // ── Zoom + pan — pinch on touch, drag to pan, tap toggles ──────
    // The fit view already ~doubles the image on desktop; on a phone the
    // landscape screenshot only fills the width, so this lets you pinch in to
    // native pixels and drag around. Desktop has no pinch, so it stays at fit
    // and a tap closes (the behaviour Svenja already approved).
    var scale = 1, tx = 0, ty = 0;
    var pointers = new Map();
    var pinchStart = null;   // {dist, scale, mid, tx, ty}
    var panStart = null;     // {x, y, tx, ty} — also the tap-down reference
    var moved = false;

    function maxZoom() {
      // up to native pixels, but always worth a pinch (min 2.5×), never absurd.
      return Math.min(6, Math.max(2.5, big.naturalWidth / (big.offsetWidth || 1)));
    }
    function applyTransform() {
      big.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
      big.classList.toggle('zoomed', scale > 1.01);
    }
    function hardReset() {
      scale = 1; tx = 0; ty = 0;
      big.style.transition = ''; big.style.transform = '';
      big.classList.remove('zoomed');
    }
    function animateToFit() {
      if (!prefersReduced) big.style.transition = 'transform .28s cubic-bezier(.16,1,.3,1)';
      scale = 1; tx = 0; ty = 0; applyTransform();
    }
    function clampPan() {
      var maxX = Math.max(0, (big.offsetWidth * scale - box.clientWidth) / 2);
      var maxY = Math.max(0, (big.offsetHeight * scale - box.clientHeight) / 2);
      tx = Math.max(-maxX, Math.min(maxX, tx));
      ty = Math.max(-maxY, Math.min(maxY, ty));
    }
    function boxCenter() {
      var r = box.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    function mid(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }

    function open(sourceImg) {
      hardReset();
      // currentSrc resolves the actually-loaded file; src is the fallback.
      big.src = sourceImg.currentSrc || sourceImg.src;
      big.alt = sourceImg.alt || '';
      lastFocus = document.activeElement;
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      // Two frames so [hidden] is gone before the opacity transition starts.
      // Focus only once .open lands: while closed the box is visibility:hidden,
      // where the close button cannot take focus.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          box.classList.add('open');
          close.focus();
        });
      });
    }

    function hide() {
      if (box.hidden) return;
      box.classList.remove('open');
      document.body.style.overflow = '';
      hardReset();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
      // Re-hide after the fade, with a timeout net for the no-transition path.
      // Guard on target so the image's own transform transition can't trip it.
      var done = function (e) {
        if (e && e.target !== box) return;
        box.hidden = true;
        big.removeAttribute('src');
        box.removeEventListener('transitionend', done);
      };
      box.addEventListener('transitionend', done);
      setTimeout(done, 350);
    }

    figs.forEach(function (el) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'et-figure-zoom';
      el.parentNode.insertBefore(btn, el);
      btn.appendChild(el);
      btn.addEventListener('click', function () { open(el); });
    });

    close.addEventListener('click', hide);

    // Gestures live on the box so a finger that strays onto the scrim still
    // pinches/pans; the transform stays on the image. setPointerCapture is
    // wrapped because a synthetic/edge pointer can make it throw.
    box.addEventListener('pointerdown', function (e) {
      if (close.contains(e.target)) return;   // let the × button handle itself
      big.style.transition = '';              // gestures are instant
      try { box.setPointerCapture(e.pointerId); } catch (err) {}
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved = false;
      if (pointers.size === 2) {
        var p = Array.from(pointers.values());
        pinchStart = { dist: dist(p[0], p[1]), scale: scale, mid: mid(p[0], p[1]), tx: tx, ty: ty };
        panStart = null;
      } else {
        panStart = { x: e.clientX, y: e.clientY, tx: tx, ty: ty };
      }
    });
    box.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinchStart) {
        var p = Array.from(pointers.values());
        var ns = Math.max(1, Math.min(maxZoom(), pinchStart.scale * (dist(p[0], p[1]) / pinchStart.dist)));
        var m = mid(p[0], p[1]);
        var c = boxCenter();
        // Keep the image point under the original pinch midpoint fixed.
        var u = { x: (pinchStart.mid.x - (c.x + pinchStart.tx)) / pinchStart.scale,
                  y: (pinchStart.mid.y - (c.y + pinchStart.ty)) / pinchStart.scale };
        scale = ns;
        tx = m.x - c.x - u.x * scale;
        ty = m.y - c.y - u.y * scale;
        clampPan(); applyTransform();
        moved = true;
      } else if (pointers.size === 1 && panStart) {
        if (scale > 1.01) {
          tx = panStart.tx + (e.clientX - panStart.x);
          ty = panStart.ty + (e.clientY - panStart.y);
          clampPan(); applyTransform();
        }
        if (Math.hypot(e.clientX - panStart.x, e.clientY - panStart.y) > 8) moved = true;
      }
    });
    function endPointer(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      try { box.releasePointerCapture(e.pointerId); } catch (err) {}
      if (pointers.size === 1) {
        var p = Array.from(pointers.values())[0];
        panStart = { x: p.x, y: p.y, tx: tx, ty: ty };
        pinchStart = null;
      } else if (pointers.size === 0) {
        pinchStart = null; panStart = null;
        if (scale <= 1.01) animateToFit();   // snap back if pinched below fit
      }
    }
    box.addEventListener('pointerup', endPointer);
    box.addEventListener('pointercancel', endPointer);

    // A clean tap: while zoomed it steps back to fit, at fit it closes.
    box.addEventListener('click', function (e) {
      if (close.contains(e.target)) return;
      if (moved) { moved = false; return; }   // a drag/pinch, not a tap
      if (scale > 1.01) animateToFit();
      else hide();
    });
    // Only the close button is focusable inside — trap Tab on it.
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') { e.preventDefault(); close.focus(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !box.hidden) hide();
    });
  }

  // ── Compass demo (Phase D) ──────────────────────────────────
  function initCompassDemo() {
    var demo = document.getElementById('compass-demo');
    if (!demo) return;

    var questionEl = demo.querySelector('.compass-question');
    var optionsEl = demo.querySelector('.compass-options');
    var responseEl = demo.querySelector('.compass-response');
    var buttons = demo.querySelectorAll('.compass-opt');

    var questionText =
      '“I don’t understand why central banks raise interest rates during inflation. Higher rates make loans more expensive, so how does that help people afford things?”';

    var responses = {
      standard:
        '“Higher rates cool demand by making borrowing more expensive. Less demand against the same supply slows price increases. That’s how rate hikes fight inflation.”',
      socratic:
        '“What is inflation? What causes prices to rise? What role does demand play? How do interest rates affect consumer behaviour?”',
      vision:
        '“You’re right that loans get more expensive — that’s exactly the plan. Think about it: if saving suddenly earns you 4% and a loan costs 6%, what do you do — buy the new car on credit now, or wait? And if lots of people do the same, what happens to demand? And to prices, when fewer people want to buy?”',
    };

    var typed = false;
    var activeKey = null;
    var responseRun = 0;

    /* Typewriter. Types into a span the screen reader ignores, then hands
       the aria-live region the finished text in one piece — per-character
       inserts would be announced one by one. `isCurrent` lets a newer run
       cancel this one (clicking another option mid-answer). */
    function typewriter(el, text, speed, done, isCurrent) {
      var i = 0;
      var sink = document.createElement('span');
      sink.setAttribute('aria-hidden', 'true');
      var cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      el.textContent = '';
      sink.appendChild(cursor);
      el.appendChild(sink);

      function tick() {
        if (isCurrent && !isCurrent()) return;
        if (i < text.length) {
          sink.insertBefore(document.createTextNode(text[i]), cursor);
          i++;
          setTimeout(tick, speed);
        } else {
          if (done) done();
          setTimeout(function () {
            if (isCurrent && !isCurrent()) return;
            el.textContent = text;
          }, 600);
        }
      }
      tick();
    }

    function showInstant() {
      questionEl.textContent = questionText;
      optionsEl.classList.add('visible');
      typed = true;
    }

    function startDemo() {
      if (typed) return;
      typed = true;

      if (prefersReduced) {
        showInstant();
        return;
      }

      typewriter(questionEl, questionText, 28, function () {
        optionsEl.classList.add('visible');
      });
    }

    /* Intersection Observer: start when element reaches viewport center */
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              startDemo();
              observer.disconnect();
            }
          });
        },
        { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
      );
      observer.observe(demo);
    } else {
      showInstant();
    }

    /* Button clicks */
    function showResponse(key) {
      if (activeKey === key) return;
      activeKey = key;

      buttons.forEach(function (btn) {
        var on = btn.getAttribute('data-key') === key;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      if (prefersReduced) {
        responseEl.textContent = responses[key];
        responseEl.classList.add('visible');
        return;
      }

      responseRun++;
      var run = responseRun;
      responseEl.classList.remove('visible');
      setTimeout(function () {
        if (run !== responseRun) return;
        responseEl.classList.add('visible');
        typewriter(responseEl, responses[key], 14, null, function () {
          return run === responseRun;
        });
      }, responseEl.textContent ? 300 : 10);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        showResponse(btn.getAttribute('data-key'));
      });
    });
  }

  // ── UTE animated demo ────────────────────────────────────────
  function initUteDemo() {
    var demo = document.getElementById('ute-demo');
    if (!demo) return;

    var chatEl    = document.getElementById('ute-chat');
    var statusEl  = document.getElementById('ute-status');
    var gridEl    = document.getElementById('ute-grid');
    var cartEl    = document.getElementById('ute-cart');
    var cartWrap  = document.getElementById('ute-cart-wrap');
    var totalVal  = document.getElementById('ute-total-val');
    var recEl     = document.getElementById('ute-rec');
    var customerEl = document.getElementById('ute-customer');
    var posEl     = demo.querySelector('.ute-demo-pos');
    var runningTotal = 0;

    // ── Eye guidance: focus one side, blur the other ──
    function focusChat() {
      chatEl.classList.remove('inactive');
      posEl.classList.add('inactive');
    }
    function focusPos() {
      posEl.classList.remove('inactive');
      chatEl.classList.add('inactive');
    }
    function focusBoth() {
      chatEl.classList.remove('inactive');
      posEl.classList.remove('inactive');
    }

    var PRODUCTS = [
      {name:'Sourdough',      price:'3.80', img:'img/sourdough.webp',       vegan:true,  sesame:false},
      {name:'Rye bread',      price:'3.20', img:'img/rye-bread.webp',       vegan:true,  sesame:false},
      {name:'Sesame bagel',   price:'1.40', img:'img/sesame-bagel.webp',    vegan:true,  sesame:true},
      {name:'Pretzel',        price:'1.60', img:'img/pretzel.webp',         vegan:false, sesame:true},
      {name:'Croissant',      price:'1.90', img:'img/croissant.webp',       vegan:false, sesame:false},
      {name:'Apple turnover', price:'2.50', img:'img/apple-turnover.webp',  vegan:true,  sesame:false},
      {name:'Vegan quiche',   price:'3.90', img:'img/vegan-quiche.webp',    vegan:true,  sesame:false},
      {name:'Ciabatta',       price:'2.80', img:'img/ciabatta.webp',        vegan:true,  sesame:false},
      {name:'Cinnamon roll',  price:'2.80', img:'img/cinnamon-roll.webp',   vegan:false, sesame:false},
    ];

    // Each scene: dialog exchange → POS actions → annotation → fade
    // KEY: UTE only transcribes the ASSISTANT, never the customer.
    // The assistant repeats everything — that's the confirmation.
    var SCENES = [
      {
        dialog: [
          // Greeting → the register reacts at once: profile loads, sesame greys out.
          {who:'assistant', text:'Good morning, Mrs. Schmidt! How are you today?', kw:['Mrs. Schmidt'],
            then: [
              {type:'customer', name:'Mrs. Schmidt', badge:'Sesame allergy'},
              {type:'filter', rule:'sesame'},
            ]},
        ],
        notes: [
          'Regular customer recognised by name — her profile loads, with allergies and intolerances on file.',
          'Sesame allergy on file → UTE greys out every item with sesame, automatically.',
        ],
      },
      {
        dialog: [
          // "The usual" → UTE prefills her regular order behind glass,
          // BEFORE the assistant can read it back. Confirmation makes it real.
          {who:'mrs. schmidt', text:'Morning! Very well, thank you. The usual, please.',
            then: [{type:'prefill', items:[
              {name:'2\xD7 Rye bread', price:'6.40'},
              {name:'1\xD7 Sourdough', price:'3.80'},
            ]}]},
          {who:'assistant', text:'Two rye breads and a sourdough, right?', kw:['Two rye breads','sourdough']},
        ],
        actions: [
          {type:'confirm'},
        ],
        notes: ['“The usual” — UTE knows it from her profile and lays the order behind glass, like the counter display. The assistant reads it off, and her spoken confirmation is what rings it up.'],
      },
      {
        dialog: [
          {who:'mrs. schmidt', text:'Exactly! And my sister is visiting — she\'d love something vegan.'},
          {who:'assistant', text:'Of course! Let me show you the vegan options.', kw:['vegan']},
        ],
        actions: [
          {type:'badge', text:'Vegan', cls:'vegan'},
          {type:'filter', rule:'vegan'},
        ],
        notes: ['The assistant says “vegan” → the catalogue narrows to vegan items only. No menu, no searching.'],
      },
      {
        dialog: [
          {who:'mrs. schmidt', text:'The apple turnover looks wonderful.'},
          {who:'assistant', text:'One apple turnover — lovely choice.', kw:['apple turnover']},
        ],
        actions: [
          {type:'select',    name:'Apple turnover'},
          {type:'cart',      name:'1\xD7 Apple turnover', price:'2.50'},
          {type:'crosssell', product:'Vegan quiche — €3.90', reason:'Pairs well \xB7 vegan-friendly \xB7 popular combo'},
          {type:'highlight', name:'Vegan quiche'},
        ],
        notes: ['UTE surfaces a pairing the assistant can offer naturally — vegan quiche, matching her sister’s vegan choice.'],
      },
      {
        dialog: [
          {who:'assistant', text:'Something savory too? The vegan quiche pairs nicely.'},
          {who:'mrs. schmidt', text:'Oh, good idea — yes please!'},
          // The spoken confirmation rings the quiche up right away.
          {who:'assistant', text:'One vegan quiche, then.', kw:['vegan quiche'],
            then: [
              {type:'select', name:'Vegan quiche'},
              {type:'cart',   name:'1\xD7 Vegan quiche', price:'3.90'},
            ]},
          {who:'mrs. schmidt', text:'That\'s everything, thank you!'},
          {who:'assistant', text:'Perfect — that comes to €16.60. I wish you a wonderful day, Mrs. Schmidt!'},
        ],
        actions: [
          {type:'complete'},
        ],
        notes: ['Order closed and paid — the total settles automatically. Ready for the next customer.'],
      }
    ];

    var tileEls = [];

    // The mobile chat is a short scroll box, so a long line can push the sentence
    // being "spoken" out of sight. Keep the newest line in view. Mobile only —
    // on desktop the chat is 440px tall and this must not move anything.
    // Read the query fresh each call, not once at init: a device rotated after
    // init (portrait↔landscape across the 600px line) would otherwise keep a
    // stale value and stop scrolling the newest line.
    function keepChatInView() {
      if (!matchMedia('(max-width:600px)').matches) return;
      chatEl.scrollTop = chatEl.scrollHeight;
    }

    function addMsg(who, text, keywords) {
      var d = document.createElement('div');
      d.className = 'dm';
      var rendered = text;
      var hasKw = keywords && keywords.length;
      if (hasKw) {
        for (var k = 0; k < keywords.length; k++) {
          rendered = rendered.replace(keywords[k], '<span class="kw">' + keywords[k] + '</span>');
        }
      }
      var fullHTML = '"' + rendered + '"';
      d.innerHTML = '<div class="dm-label">' + who + '</div><div class="dm-text"></div>';
      chatEl.appendChild(d);
      void d.offsetHeight;
      d.classList.add('show');
      keepChatInView();

      // Typewriter: strip tags to get plain text, type char by char
      var textEl = d.querySelector('.dm-text');
      var plain = fullHTML.replace(/<[^>]+>/g, '');
      // Reduced motion: show the finished line at once, keywords included.
      if (prefersReduced) {
        textEl.innerHTML = fullHTML;
        keepChatInView();
        return Promise.resolve();
      }
      var i = 0;
      return new Promise(function(resolve) {
        function tick() {
          if (cancelRequested) { resolve(); return; }
          if (i >= plain.length) {
            // Sentence finished — show it plain first (no colour yet).
            textEl.textContent = plain;
            if (hasKw) {
              // After a beat, the keyword lights up red (animates ink → rust).
              setTimeout(function() {
                textEl.innerHTML = fullHTML;
                setTimeout(resolve, 350); // let the red register before the explanation
              }, 200);
            } else {
              resolve();
            }
            return;
          }
          i++;
          textEl.textContent = plain.substring(0, i);
          keepChatInView();          // the line grows as it types; follow it
          setTimeout(tick, 22);
        }
        tick();
      });
    }

    function addNote(text) {
      // Add annotation to the last .dm in chat — a calm caption:
      // a small live dot + label, then the plain-words explanation.
      var msgs = chatEl.querySelectorAll('.dm');
      var last = msgs[msgs.length - 1];
      if (!last) return;
      var n = document.createElement('div');
      n.className = 'dm-note';
      var head = document.createElement('div');
      head.className = 'dm-note-head';
      head.innerHTML = '<span class="dm-note-dot"></span><span class="dm-note-label">UTE &middot; live</span>';
      var body = document.createElement('div');
      body.className = 'dm-note-body';
      body.textContent = text;
      n.appendChild(head);
      n.appendChild(body);
      last.appendChild(n);
      void n.offsetHeight;
      n.classList.add('show');
      keepChatInView();
    }

    function fadeAllMessages() {
      var msgs = chatEl.querySelectorAll('.dm');
      for (var m = 0; m < msgs.length; m++) {
        msgs[m].classList.add('fade-out');
      }
    }

    function setCustomer(name, badge) {
      if (customerEl) {
        var html = '<span class="cust-name">' + name + '</span>';
        if (badge) html += '<span class="cust-badge">' + badge + '</span>';
        customerEl.innerHTML = html;
        flashGlow(customerEl);
      }
    }

    function addBadge(text, cls) {
      if (!customerEl) return;
      var b = document.createElement('span');
      b.className = 'cust-badge badge-enter' + (cls ? ' ' + cls : '');
      b.textContent = text;
      customerEl.appendChild(b);
      void b.offsetHeight;
      b.classList.remove('badge-enter');
      b.classList.add('badge-show');
      flashGlow(b);
    }

    function flashGlow(el) {
      if (!el) return;
      el.classList.remove('glow');
      void el.offsetHeight;
      el.classList.add('glow');
      el.addEventListener('animationend', function handler() {
        el.classList.remove('glow');
        el.removeEventListener('animationend', handler);
      });
    }

    function buildTiles() {
      tileEls = [];
      gridEl.innerHTML = '';
      for (var i = 0; i < PRODUCTS.length; i++) {
        var p = PRODUCTS[i];
        var d = document.createElement('div');
        d.className = 'pos-tile show';
        d.dataset.name = p.name;
        d.dataset.vegan = p.vegan ? '1' : '0';
        d.dataset.sesame = p.sesame ? '1' : '0';
        d.innerHTML =
          '<img class="tile-icon" decoding="async" src="' + p.img + '" alt="' + p.name + '">' +
          '<span class="tile-name">' + p.name + '</span>' +
          '<span class="tile-price">€' + p.price + '</span>';
        gridEl.appendChild(d);
        tileEls.push(d);
      }
    }

    function filterBy(rule) {
      for (var i = 0; i < tileEls.length; i++) {
        var el = tileEls[i];
        if (rule === 'sesame' && el.dataset.sesame === '1') el.classList.add('disabled');
        if (rule === 'vegan' && el.dataset.vegan === '0') el.classList.add('disabled');
      }
    }

    function selectTile(name) {
      for (var i = 0; i < tileEls.length; i++) {
        if (tileEls[i].dataset.name === name) {
          tileEls[i].classList.add('selected');
          flashGlow(tileEls[i]);
        }
      }
    }

    function highlightTile(name) {
      for (var i = 0; i < tileEls.length; i++) {
        if (tileEls[i].dataset.name === name) {
          tileEls[i].classList.add('suggest');
          flashGlow(tileEls[i]);
        }
      }
    }

    function cartItemEl(name, price) {
      var d = document.createElement('div');
      d.className = 'pos-cart-item';
      d.innerHTML = '<span class="cart-name">' + name + '</span><span class="cart-leader"></span><span class="cart-price">' + price + '</span>';
      return d;
    }

    function addCartItem(name, price) {
      var d = cartItemEl(name, price);
      cartEl.appendChild(d);
      void d.offsetHeight;
      d.classList.add('show');
      flashGlow(d);
      runningTotal += parseFloat(price);
      totalVal.textContent = '€' + runningTotal.toFixed(2);
      flashGlow(totalVal.parentNode);
    }

    // UTE's guess waits behind the counter glass: items are on the bon
    // but greyed, under a translucent pane — visible, not yet rung up.
    function prefillPending(items) {
      var wrap = document.createElement('div');
      wrap.className = 'pos-pending';
      for (var i = 0; i < items.length; i++) {
        var d = cartItemEl(items[i].name, items[i].price);
        d.classList.add('pending', 'show');
        d.dataset.price = items[i].price;
        wrap.appendChild(d);
      }
      var glass = document.createElement('div');
      glass.className = 'pos-glass';
      glass.innerHTML = '<span class="pos-glass-label">prefilled</span>';
      wrap.appendChild(glass);
      cartEl.appendChild(wrap);
      void glass.offsetHeight;
      glass.classList.add('show');
    }

    // The assistant's spoken confirmation lifts the pane; the items print
    // for real and the total counts them.
    async function confirmPending() {
      var wrap = cartEl.querySelector('.pos-pending');
      if (!wrap) return;
      var glass = wrap.querySelector('.pos-glass');
      if (glass) {
        glass.classList.add('lift');
        await sleep(prefersReduced ? 300 : 550);
        glass.remove();
      }
      wrap.classList.add('confirmed');
      var items = wrap.querySelectorAll('.pos-cart-item.pending');
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('pending');
        flashGlow(items[i]);
        runningTotal += parseFloat(items[i].dataset.price || '0');
      }
      totalVal.textContent = '€' + runningTotal.toFixed(2);
      flashGlow(totalVal.parentNode);
    }

    function showCrossSell(product, reason) {
      var d = document.createElement('div');
      d.className = 'pos-crosssell';
      d.innerHTML =
        '<div class="pos-crosssell-label">Suggestion</div>' +
        '<div class="pos-crosssell-text">' + product + '</div>' +
        '<div class="pos-crosssell-reason">' + reason + '</div>';
      var footer = cartWrap.querySelector('.pos-footer');
      if (footer) {
        cartWrap.insertBefore(d, footer);
      } else {
        cartWrap.appendChild(d);
      }
      void d.offsetHeight;
      d.classList.add('show');
      flashGlow(d);
    }

    function showComplete() {
      var footer = cartWrap.querySelector('.pos-footer');
      if (!footer) return;
      var total = footer.querySelector('.pos-total');
      if (total) { total.classList.add('paid'); flashGlow(total); }
      var d = document.createElement('div');
      d.className = 'pos-complete';
      d.innerHTML = '<span class="pos-check" aria-hidden="true">✓</span> Paid';
      footer.appendChild(d);
      void d.offsetHeight;
      d.classList.add('show');
    }

    // Cancellable sleep: stop/replay wakes every pending timer at once, so
    // the run unwinds immediately instead of after the longest pause.
    var cancelRequested = false;
    var sleepWakers = [];
    function sleep(ms) {
      return new Promise(function(resolve) {
        var t = setTimeout(function() { unregister(); resolve(); }, ms);
        function waker() { clearTimeout(t); resolve(); }
        function unregister() {
          var i = sleepWakers.indexOf(waker);
          if (i > -1) sleepWakers.splice(i, 1);
        }
        sleepWakers.push(waker);
      }).then(function() {
        if (cancelRequested) throw {__cancel: true};
      });
    }
    function cancelRun() {
      cancelRequested = true;
      sleepWakers.splice(0).forEach(function(w) { w(); });
    }

    // Reading time scaled to text length, at a natural reading pace
    // (~52 ms per character ≈ 230 wpm, with a small base for the eye to land).
    function readMs(text) {
      var len = (text || '').length;
      return Math.max(1300, Math.min(len * 28 + 400, 3400));
    }

    async function applyAction(act) {
      if (act.type === 'customer')        setCustomer(act.name, act.badge);
      else if (act.type === 'badge')     addBadge(act.text, act.cls);
      else if (act.type === 'filter')    filterBy(act.rule);
      else if (act.type === 'select')    selectTile(act.name);
      else if (act.type === 'crosssell') showCrossSell(act.product, act.reason);
      else if (act.type === 'highlight') highlightTile(act.name);
      else if (act.type === 'cart')      addCartItem(act.name, act.price);
      else if (act.type === 'prefill')   prefillPending(act.items);
      else if (act.type === 'confirm')   await confirmPending();
      else if (act.type === 'complete')  showComplete();
    }

    async function runScene(idx) {
      var scene = SCENES[idx];
      var hasDialog  = scene.dialog && scene.dialog.length > 0;
      var hasActions = scene.actions && scene.actions.length > 0;
      var notes = scene.notes || (scene.note ? [scene.note] : []);

      // Phase: dialog — focus chat, blur POS, reader watches the conversation.
      // A line with `then` triggers register actions mid-dialog (both sides
      // sharp): UTE reacts to what was said before the next line lands.
      async function playDialog() {
        if (!hasDialog) return;
        focusChat();
        await sleep(450); // let the blur transition settle
        for (var d = 0; d < scene.dialog.length; d++) {
          var line = scene.dialog[d];
          await addMsg(line.who, line.text, line.kw);
          if (line.then) {
            await sleep(500);
            focusBoth();
            await sleep(450);
            for (var t = 0; t < line.then.length; t++) {
              if (t > 0) await sleep(500);
              await applyAction(line.then[t]);
            }
            await sleep(950); // let the register moment land
            if (d < scene.dialog.length - 1) {
              focusChat();
              await sleep(450);
            }
          }
          await sleep(Math.max(750, line.text.length * 14));
        }
      }

      // Phase: actions — focus POS, blur chat, reader watches the register
      async function playActions() {
        if (!hasActions) return;
        focusPos();
        await sleep(600); // let the blur transition settle
        for (var a = 0; a < scene.actions.length; a++) {
          await sleep(550);
          await applyAction(scene.actions[a]);
        }
      }

      // Phase: notes — both sides sharp, the plain-words explanation
      async function playNotes() {
        if (!notes.length) return;
        focusBoth();
        await sleep(450);
        for (var ni = 0; ni < notes.length; ni++) {
          addNote(notes[ni]);
          await sleep(readMs(notes[ni]));
        }
      }

      // The rule of the piece: something is said, the register reacts,
      // then the plain-words explanation. Reactions tied to a specific
      // line ride along via `then`; scene-level actions follow the dialog.
      await playDialog();
      await playActions();
      await playNotes();

      // Let reader absorb the final state with both sides visible
      focusBoth();
      await sleep(950);

      // Fade out messages (except last scene)
      if (idx < SCENES.length - 1) {
        await sleep(300);
        fadeAllMessages();
        await sleep(700);
      }
    }

    function resetAll() {
      running = false;
      tileEls = [];
      buildTiles();
      resetToIdle();
    }

    function showPrompt() {
      chatEl.innerHTML =
        '<div class="chat-prompt">' +
          '<div class="chat-prompt-text">Press record<br>to try UTE</div>' +
          '<div class="chat-prompt-arrow">→</div>' +
        '</div>';
    }

    function resetToIdle() {
      focusBoth();
      chatEl.innerHTML = '';
      statusEl.textContent = 'ready';
      statusEl.classList.remove('active');
      if (customerEl) {
        customerEl.innerHTML = '<span class="cust-placeholder" style="color:var(--ink-dim);font-style:italic">Customer</span>';
      }
      cartWrap.querySelectorAll('.pos-complete,.pos-crosssell').forEach(function(el) { el.remove(); });
      cartEl.innerHTML = '';
      runningTotal = 0;
      totalVal.textContent = '€0.00';
      var paidTotal = cartWrap.querySelector('.pos-total');
      if (paidTotal) paidTotal.classList.remove('paid');
      for (var j = 0; j < tileEls.length; j++) {
        tileEls[j].classList.remove('disabled','selected','suggest');
      }
      if (recEl) {
        recEl.classList.remove('on');
        recEl.classList.add('idle');
        recEl.querySelector('.pos-rec-label').textContent = 'Record';
      }
      showPrompt();
    }

    var running = false;
    var currentRun = null;

    async function runDemo() {
      if (running) return;
      running = true;
      cancelRequested = false;

      try {
        // activate recording
        chatEl.innerHTML = '';
        if (recEl) {
          recEl.classList.remove('idle');
          recEl.classList.add('on');
          recEl.querySelector('.pos-rec-label').textContent = 'Listening';
        }
        statusEl.textContent = 'listening';
        statusEl.classList.add('active');
        await sleep(500);

        // run all scenes
        for (var i = 0; i < SCENES.length; i++) {
          await runScene(i);
        }

        // stop recording, reveal both sides for final moment
        focusBoth();
        if (recEl) {
          recEl.classList.remove('on');
        }
        statusEl.textContent = 'ready';
        statusEl.classList.remove('active');

        // hold final state, then reset
        await sleep(2600);
        resetToIdle();
      } catch (e) {
        if (!(e && e.__cancel)) throw e; // cancelled: the caller resets
      } finally {
        running = false;
      }
    }

    var restarting = false; // guards the cancel→reset window against double clicks

    function startDemo() {
      if (running || restarting) return;
      currentRun = runDemo();
    }

    // Stop mid-run: unwind the scene chain, back to the idle prompt.
    function stopDemo() {
      if (!running || restarting) return;
      restarting = true;
      cancelRun();
      (currentRun || Promise.resolve()).then(function() {
        resetAll();
        restarting = false;
      });
    }

    // Replay mid-run: unwind, reset, and start over from scene one.
    function replayDemo() {
      if (!running || restarting) return;
      restarting = true;
      cancelRun();
      (currentRun || Promise.resolve()).then(function() {
        resetAll();
        restarting = false;
        startDemo();
      });
    }

    // Click handlers: record starts; replay/stop only exist while running
    if (recEl) {
      recEl.addEventListener('click', function() {
        if (recEl.classList.contains('idle')) {
          startDemo();
        }
      });
    }
    var replayBtn = document.getElementById('ute-replay');
    var stopBtn = document.getElementById('ute-stop');
    if (replayBtn) replayBtn.addEventListener('click', replayDemo);
    if (stopBtn) stopBtn.addEventListener('click', stopDemo);

    // Show initial state when demo scrolls into view
    var inited = false;
    function initOnce() {
      if (inited) return;
      inited = true;
      buildTiles();
      showPrompt();
    }
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            initOnce();
            obs.disconnect();
            break;
          }
        }
      }, { rootMargin: '-20% 0px -20% 0px', threshold: 0 });
      obs.observe(demo);
    } else {
      initOnce();
    }
  }

  // ── Init ────────────────────────────────────────────────────
  if (!prefersReduced) {
    initSplitFlap();
    initPhotoTilt();
  }

  initPhotoQuote();
  initFigureZoom();
  initCompassDemo();
  initUteDemo();
})();
