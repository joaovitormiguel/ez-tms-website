/* Feature stack: simple scroll focus. As you scroll, whichever row is nearest the
   vertical center of the viewport becomes "in focus" (bright, full scale); the others
   ease back (dimmed, slightly smaller). No scroll hijacking. */
(function () {
  var stack = document.getElementById('featStack');
  if (!stack) return;
  var rows = Array.prototype.slice.call(stack.querySelectorAll('.feat-row'));
  if (!rows.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function update() {
    if (reduce.matches) {
      stack.classList.remove('focus-ready');
      rows.forEach(function (r) { r.classList.remove('in-focus'); });
      return;
    }
    stack.classList.add('focus-ready');
    var mid = window.innerHeight / 2;
    var best = null, bestDist = Infinity;
    for (var i = 0; i < rows.length; i++) {
      var b = rows[i].getBoundingClientRect();
      var d = Math.abs(b.top + b.height / 2 - mid);
      if (d < bestDist) { bestDist = d; best = rows[i]; }
    }
    for (var j = 0; j < rows.length; j++) {
      rows[j].classList.toggle('in-focus', rows[j] === best);
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  (reduce.addEventListener ? reduce.addEventListener('change', update) : reduce.addListener(update));
  update();
})();
