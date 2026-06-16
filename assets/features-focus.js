/* Feature stack: simple scroll focus. As you scroll, whichever row is nearest the
   vertical center of the viewport becomes "in focus" (bright, full scale); the others
   ease back (dimmed, slightly smaller). No scroll hijacking. */
(function () {
  var stack = document.getElementById('featStack');
  if (!stack) return;
  var rows = Array.prototype.slice.call(stack.querySelectorAll('.feat-row'));
  if (!rows.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* inject the slanted red outline as an inline SVG (non-scaling-stroke keeps the
     stroke a constant width on every edge — a stretched background SVG does not) */
  var NS = 'http://www.w3.org/2000/svg';
  var D = 'M0 1.5L347.726 0.003C359.222 0.194 369.461 7.406 373.492 18.214L407.92 110.51L435.103 183.383C441.918 201.654 428.434 221.124 408.933 221.169L0 221.5';
  Array.prototype.forEach.call(stack.querySelectorAll('.feature-card'), function (card) {
    var body = card.querySelector('.body');
    if (!body || body.querySelector('.slant-svg')) return;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'slant-svg');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('viewBox', '0 0 436.893 222.111');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', D);
    path.setAttribute('stroke', '#EF151A');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    if (card.classList.contains('mir')) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(436.893,0) scale(-1,1)');
      g.appendChild(path);
      svg.appendChild(g);
    } else {
      svg.appendChild(path);
    }
    body.insertBefore(svg, body.firstChild);
  });

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
