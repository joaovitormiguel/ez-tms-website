/* Screenshot carousel (homepage problem section). Works with any number of
   <img> slides inside #shotTrack — dots are generated automatically. */
(function () {
  var track = document.getElementById('shotTrack');
  if (!track) return;
  var slides = track.querySelectorAll('img');
  var n = slides.length;
  var dotsBox = document.getElementById('shotDots');
  var prev = document.getElementById('shotPrev');
  var next = document.getElementById('shotNext');
  var i = 0;

  // one dot per slide
  for (var k = 0; k < n; k++) {
    var dot = document.createElement('span');
    if (k === 0) dot.className = 'on';
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', 'Go to screenshot ' + (k + 1));
    (function (idx) { dot.addEventListener('click', function () { go(idx); }); })(k);
    if (dotsBox) dotsBox.appendChild(dot);
  }

  function go(x) {
    i = (x + n) % n;
    track.style.transform = 'translateX(' + (-i * 100) + '%)';
    if (dotsBox) {
      var ds = dotsBox.children;
      for (var j = 0; j < ds.length; j++) ds[j].className = (j === i ? 'on' : '');
    }
  }

  if (prev) prev.addEventListener('click', function () { go(i - 1); user(); });
  if (next) next.addEventListener('click', function () { go(i + 1); user(); });
  if (n <= 1 && dotsBox) dotsBox.style.display = 'none';

  // auto-advance (pauses on hover/focus and for ~10s after a manual interaction)
  var DELAY = 5000, timer = null, paused = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function tick() { if (!paused && !reduce.matches && n > 1) go(i + 1); }
  function start() { stop(); if (n > 1) timer = setInterval(tick, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function user() { start(); } // restart the clock after a manual move
  var box = track.closest('.shot-cluster') || track;
  box.addEventListener('mouseenter', function () { paused = true; });
  box.addEventListener('mouseleave', function () { paused = false; });
  box.addEventListener('focusin', function () { paused = true; });
  box.addEventListener('focusout', function () { paused = false; });
  document.addEventListener('visibilitychange', function () { paused = document.hidden; });

  // touch swipe
  var x0 = null, y0 = null, dx = 0;
  var vp = track.parentNode;
  vp.addEventListener('touchstart', function (e) {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dx = 0; paused = true;
  }, { passive: true });
  vp.addEventListener('touchmove', function (e) {
    if (x0 === null) return;
    dx = e.touches[0].clientX - x0;
  }, { passive: true });
  vp.addEventListener('touchend', function () {
    if (x0 !== null && Math.abs(dx) > 40) { go(dx < 0 ? i + 1 : i - 1); user(); }
    x0 = null; paused = false;
  });

  start();
})();
