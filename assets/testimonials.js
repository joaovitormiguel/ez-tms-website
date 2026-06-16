/* Testimonial slider: one quote at a time. The arrow advances (and loops); it also
   auto-advances on a comfortable interval, pausing on hover / when the tab is hidden,
   and supports touch swipe. Respects prefers-reduced-motion (no auto-advance). */
(function () {
  var slider = document.getElementById('testSlider');
  if (!slider) return;
  var slides = Array.prototype.slice.call(slider.querySelectorAll('.test-slide'));
  if (slides.length < 2) return;
  var next = document.getElementById('testNext');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var i = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('active'); }));
  var paused = false, timer = null;

  function show(n) {
    slides[i].classList.remove('active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('active');
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() { stop(); if (!reduce.matches) timer = setInterval(function () { if (!paused) show(i + 1); }, 9000); }
  function restart() { start(); }

  if (next) next.addEventListener('click', function () { show(i + 1); restart(); });

  var section = slider.closest('.testimonial') || slider;
  section.addEventListener('mouseenter', function () { paused = true; });
  section.addEventListener('mouseleave', function () { paused = false; });
  document.addEventListener('visibilitychange', function () { paused = document.hidden; });

  var x0 = null;
  slider.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; paused = true; }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
    x0 = null; paused = false; restart();
  }, { passive: true });

  start();
})();
