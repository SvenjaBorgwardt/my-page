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

  // ── Pronunciation helper (Phase C) ──────────────────────────
  function initPronounce() {
    var btn = document.querySelector('.pronounce');
    if (!btn) return;

    var audio = new Audio('audio/svenja-borgwardt.mp3');

    btn.addEventListener('click', function () {
      audio.currentTime = 0;
      audio.play().catch(function (err) {
        console.warn('[pronounce] audio play failed:', err);
      });
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

    /* Typewriter */
    function typewriter(el, text, speed, done) {
      var i = 0;
      var cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      el.textContent = '';
      el.appendChild(cursor);

      function tick() {
        if (i < text.length) {
          el.insertBefore(document.createTextNode(text[i]), cursor);
          i++;
          setTimeout(tick, speed);
        } else {
          setTimeout(function () {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          }, 600);
          if (done) done();
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
        btn.classList.toggle('active', btn.getAttribute('data-key') === key);
      });

      if (prefersReduced) {
        responseEl.textContent = responses[key];
        responseEl.classList.add('visible');
        return;
      }

      responseEl.classList.remove('visible');
      setTimeout(function () {
        responseEl.textContent = responses[key];
        responseEl.classList.add('visible');
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
      {name:'Sourdough',      price:'3.80', img:'img/sourdough.png',       vegan:true,  sesame:false},
      {name:'Rye bread',      price:'3.20', img:'img/rye-bread.png',       vegan:true,  sesame:false},
      {name:'Sesame bagel',   price:'1.40', img:'img/sesame-bagel.png',    vegan:true,  sesame:true},
      {name:'Pretzel',        price:'1.60', img:'img/pretzel.png',         vegan:false, sesame:true},
      {name:'Croissant',      price:'1.90', img:'img/croissant.png',       vegan:false, sesame:false},
      {name:'Apple turnover', price:'2.50', img:'img/apple-turnover.png',  vegan:true,  sesame:false},
      {name:'Vegan quiche',   price:'3.90', img:'img/vegan-quiche.png',    vegan:true,  sesame:false},
      {name:'Ciabatta',       price:'2.80', img:'img/ciabatta.png',        vegan:true,  sesame:false},
      {name:'Cinnamon roll',  price:'2.80', img:'img/cinnamon-roll.png',   vegan:false, sesame:false},
      {name:'Blueberry muffin',price:'2.40',img:'img/blueberry-muffin.png',vegan:true,  sesame:false},
      {name:'Pain au chocolat',price:'2.20',img:'img/pain-au-chocolat.png',vegan:false, sesame:false},
      {name:'Lemon tart',     price:'3.50', img:'img/lemon-tart.png',      vegan:false, sesame:false},
    ];

    // Each scene: dialog exchange → POS actions → annotation → fade
    // KEY: UTE only transcribes the ASSISTANT, never the customer.
    // The assistant repeats everything — that's the confirmation.
    var SCENES = [
      {
        dialog: [
          {who:'assistant', text:'Good morning, Mrs. Schmidt! How are you today?', kw:['Mrs. Schmidt']},
        ],
        actions: [
          {type:'customer', name:'Mrs. Schmidt', badge:'Sesame allergy'},
          {type:'filter', rule:'sesame'},
        ],
        notes: [
          'Regular customer recognised by name — her profile loads, with allergies and intolerances on file.',
          'Sesame allergy on file → UTE greys out every item with sesame, automatically.',
        ],
      },
      {
        dialog: [
          {who:'mrs. schmidt', text:'Morning! Very well, thank you. The usual, please.'},
          {who:'assistant', text:'Two rye breads and a sourdough, right?', kw:['Two rye breads','sourdough']},
        ],
        actions: [
          {type:'cart',   name:'2\xD7 Rye bread', price:'6.40'},
          {type:'cart',   name:'1\xD7 Sourdough', price:'3.80'},
        ],
        notes: ['“The usual” — the assistant repeats it as items, and UTE rings up what it hears: 2× rye bread, 1× sourdough.'],
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
          {who:'assistant', text:'One vegan quiche, then.', kw:['vegan quiche']},
          {who:'mrs. schmidt', text:'That\'s everything, thank you!'},
          {who:'assistant', text:'Perfect — that comes to €16.60. I wish you a wonderful day, Mrs. Schmidt!'},
        ],
        actions: [
          {type:'select', name:'Vegan quiche'},
          {type:'cart',   name:'1\xD7 Vegan quiche', price:'3.90'},
          {type:'complete'},
        ],
        notes: ['Order closed and paid — the total settles automatically. Ready for the next customer.'],
      }
    ];

    var tileEls = [];

    function addMsg(who, text, keywords) {
      var d = document.createElement('div');
      d.className = 'dm';
      var rendered = text;
      if (keywords) {
        for (var k = 0; k < keywords.length; k++) {
          rendered = rendered.replace(keywords[k], '<span class="kw">' + keywords[k] + '</span>');
        }
      }
      var fullHTML = '"' + rendered + '"';
      d.innerHTML = '<div class="dm-label">' + who + '</div><div class="dm-text"></div>';
      chatEl.appendChild(d);
      void d.offsetHeight;
      d.classList.add('show');

      // Typewriter: strip tags to get plain text, type char by char
      var textEl = d.querySelector('.dm-text');
      var plain = fullHTML.replace(/<[^>]+>/g, '');
      var i = 0;
      return new Promise(function(resolve) {
        function tick() {
          if (i >= plain.length) {
            textEl.innerHTML = fullHTML;
            resolve();
            return;
          }
          i++;
          textEl.textContent = plain.substring(0, i);
          setTimeout(tick, 38);
        }
        tick();
      });
    }

    function addNote(text) {
      // Add annotation to the last .dm in chat
      var msgs = chatEl.querySelectorAll('.dm');
      var last = msgs[msgs.length - 1];
      if (!last) return;
      var n = document.createElement('div');
      n.className = 'dm-note';
      n.textContent = text;
      last.appendChild(n);
      void n.offsetHeight;
      n.classList.add('show');
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
          '<img class="tile-icon" src="' + p.img + '" alt="' + p.name + '">' +
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

    function addCartItem(name, price) {
      var d = document.createElement('div');
      d.className = 'pos-cart-item';
      d.innerHTML = '<span class="cart-name">' + name + '</span><span class="cart-price">' + price + '</span>';
      cartEl.appendChild(d);
      void d.offsetHeight;
      d.classList.add('show');
      flashGlow(d);
      runningTotal += parseFloat(price);
      totalVal.textContent = '€' + runningTotal.toFixed(2);
      flashGlow(totalVal.parentNode);
    }

    function addAlert(text) {
      var d = document.createElement('div');
      d.className = 'pos-alert';
      d.textContent = text;
      // Insert alert before the footer inside the sidebar
      var footer = cartWrap.querySelector('.pos-footer');
      if (footer) {
        cartWrap.insertBefore(d, footer);
      } else {
        cartWrap.appendChild(d);
      }
      void d.offsetHeight;
      d.classList.add('show');
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

    function sleep(ms) {
      return new Promise(function(resolve) { setTimeout(resolve, ms); });
    }

    // Reading time scaled to text length — long explanations linger.
    function readMs(text) {
      var len = (text || '').length;
      return Math.max(3600, Math.min(len * 70 + 1800, 10000));
    }

    async function runScene(idx) {
      var scene = SCENES[idx];
      var hasDialog  = scene.dialog && scene.dialog.length > 0;
      var hasActions = scene.actions && scene.actions.length > 0;

      // 1. Focus chat side, blur POS — reader watches the dialog
      if (hasDialog) {
        focusChat();
        await sleep(450); // let the blur transition settle

        for (var d = 0; d < scene.dialog.length; d++) {
          var line = scene.dialog[d];
          await addMsg(line.who, line.text, line.kw);
          await sleep(Math.max(1900, line.text.length * 26));
        }
      }

      // 2. Switch focus to POS side, blur chat — reader watches the register
      if (hasActions) {
        focusPos();
        await sleep(600); // let the blur transition settle

        for (var a = 0; a < scene.actions.length; a++) {
          var act = scene.actions[a];
          await sleep(550);
          if (act.type === 'customer')        setCustomer(act.name, act.badge);
          else if (act.type === 'badge')     addBadge(act.text, act.cls);
          else if (act.type === 'filter')    filterBy(act.rule);
          else if (act.type === 'select')    selectTile(act.name);
          else if (act.type === 'crosssell') showCrossSell(act.product, act.reason);
          else if (act.type === 'highlight') highlightTile(act.name);
          else if (act.type === 'cart')      addCartItem(act.name, act.price);
          else if (act.type === 'complete')  showComplete();
        }
      }

      // 3. Annotation — briefly show both sides so reader sees connection
      var notes = scene.notes || (scene.note ? [scene.note] : []);
      if (notes.length) {
        focusBoth();
        await sleep(450);
        for (var ni = 0; ni < notes.length; ni++) {
          addNote(notes[ni]);
          await sleep(readMs(notes[ni]));
        }
      }

      // 4. Let reader absorb the POS state
      await sleep(2600);

      // 5. Fade out messages (except last scene)
      if (idx < SCENES.length - 1) {
        focusBoth();
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
      cartWrap.querySelectorAll('.pos-alert,.pos-complete,.pos-crosssell').forEach(function(el) { el.remove(); });
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

    async function runDemo() {
      if (running) return;
      running = true;

      // activate recording
      chatEl.innerHTML = '';
      if (recEl) {
        recEl.classList.remove('idle');
        recEl.classList.add('on');
        recEl.querySelector('.pos-rec-label').textContent = 'Listening';
      }
      await sleep(800);

      // run all scenes
      for (var i = 0; i < SCENES.length; i++) {
        await runScene(i);
      }

      // stop recording, reveal both sides for final moment
      focusBoth();
      if (recEl) {
        recEl.classList.remove('on');
      }

      // hold final state, then reset
      await sleep(4500);
      resetToIdle();
      running = false;
    }

    // Click handler on record button
    if (recEl) {
      recEl.addEventListener('click', function() {
        if (recEl.classList.contains('idle')) {
          runDemo();
        }
      });
    }

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

  initPronounce();
  initCompassDemo();
  initUteDemo();

  console.log(
    '[effects.js] ready. motion: ' +
    (prefersReduced ? 'reduced' : 'full') +
    (lowPerf ? ' | perf: low' : '')
  );
})();
