/* Screenshot fan carousel (homepage problem section). The current screenshot sits
   centered and on top; the previous/next peek behind it. Works with any number of
   <img> slides inside #shotFan. Auto-advances, supports arrows and touch swipe. */
(function () {
  var fan = document.getElementById('shotFan');
  if (!fan) return;
  var slides = fan.querySelectorAll('img');
  var n = slides.length;
  if (!n) return;
  var prev = document.getElementById('shotPrev');
  var next = document.getElementById('shotNext');
  var i = 0;

  function render() {
    for (var p = 0; p < n; p++) {
      var c = '';
      if (p === i) c = 'is-c';
      else if (n > 2 && p === (i - 1 + n) % n) c = 'is-l';
      else if (n > 1 && p === (i + 1) % n) c = 'is-r';
      slides[p].className = c;
    }
  }
  function go(x) { i = (x % n + n) % n; render(); }

  if (prev) prev.addEventListener('click', function () { go(i - 1); restart(); });
  if (next) next.addEventListener('click', function () { go(i + 1); restart(); });

  /* auto-advance (pauses on hover/focus and while the tab is hidden) */
  var DELAY = 5000, timer = null, paused = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function start() { stop(); if (n > 1) timer = setInterval(function () { if (!paused && !reduce.matches) go(i + 1); }, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { start(); }
  var box = fan.closest('.shot-cluster') || fan;
  box.addEventListener('mouseenter', function () { paused = true; });
  box.addEventListener('mouseleave', function () { paused = false; });
  box.addEventListener('focusin', function () { paused = true; });
  box.addEventListener('focusout', function () { paused = false; });
  document.addEventListener('visibilitychange', function () { paused = document.hidden; });

  /* touch swipe */
  var x0 = null, dx = 0;
  fan.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; dx = 0; paused = true; }, { passive: true });
  fan.addEventListener('touchmove', function (e) { if (x0 !== null) dx = e.touches[0].clientX - x0; }, { passive: true });
  fan.addEventListener('touchend', function () {
    if (x0 !== null && Math.abs(dx) > 40) { go(dx < 0 ? i + 1 : i - 1); restart(); }
    x0 = null; paused = false;
  });

  render();
  start();
})();
