/* effects.js — Compass demo interaction
   Typewriter for the student question, then reveal three clickable responses.
   Respects prefers-reduced-motion. */

(function () {
  'use strict';

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
      '“You’re treating prices as the problem. What if they’re the symptom?”',
  };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var typed = false;
  var activeKey = null;

  /* --- Typewriter ------------------------------------------------ */

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
        /* remove cursor after a short pause */
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

    if (reducedMotion) {
      showInstant();
      return;
    }

    typewriter(questionEl, questionText, 28, function () {
      optionsEl.classList.add('visible');
    });
  }

  /* --- Intersection Observer: start when scrolled into view ------ */

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
      { threshold: 0.4 }
    );
    observer.observe(demo);
  } else {
    /* fallback: just show everything */
    showInstant();
  }

  /* --- Button clicks --------------------------------------------- */

  function showResponse(key) {
    if (activeKey === key) return;
    activeKey = key;

    buttons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-key') === key);
    });

    if (reducedMotion) {
      responseEl.textContent = responses[key];
      responseEl.classList.add('visible');
      return;
    }

    /* fade out, swap text, fade in */
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
})();
