/* Feature stack: simple scroll focus. As you scroll, whichever row is nearest the
   vertical center of the viewport becomes "in focus" (bright, full scale); the others
   ease back (dimmed, slightly smaller). No scroll hijacking. */
(function () {
  var stack = document.getElementById('featStack');
  if (!stack) return;
  var rows = Array.prototype.slice.call(stack.querySelectorAll('.feat-row'));
  if (!rows.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var NS = 'http://www.w3.org/2000/svg';

  /* The slanted red outline is drawn in the body's REAL pixel space (viewBox = its
     measured size), so it never stretches: corners stay circular and the stroke is a
     uniform width on every edge regardless of the card's aspect ratio. We redraw on
     resize. Open on the left; a single clean slant leans the right edge outward. */
  function buildPath(W, H) {
    var i = 1.5;                       // stroke inset so the line isn't clipped
    var r = Math.min(20, (H - 2 * i) / 2);
    var lean = H * 0.17;               // how far the right edge leans out, top→bottom
    var xb = W - i;                    // bottom-right x
    var xt = xb - lean;                // top-right x
    var dx = xb - xt, dy = (H - i) - i;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / len, uy = dy / len;  // unit vector down the slant
    var bx = xt + ux * r, by = i + uy * r;            // top corner, after the round
    var ex = xb - ux * r, ey = (H - i) - uy * r;      // bottom corner, before the round
    return 'M0 ' + i +
           ' L' + (xt - r) + ' ' + i +
           ' Q' + xt + ' ' + i + ' ' + bx + ' ' + by +
           ' L' + ex + ' ' + ey +
           ' Q' + xb + ' ' + (H - i) + ' ' + (xb - r) + ' ' + (H - i) +
           ' L0 ' + (H - i);
  }

  var bodies = Array.prototype.slice.call(stack.querySelectorAll('.feature-card .body'));
  bodies.forEach(function (body) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'slant-svg');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    var holder = document.createElementNS(NS, 'g');     // mirrored for .mir cards
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('stroke', '#EF151A');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap', 'round');
    holder.appendChild(path);
    svg.appendChild(holder);
    body.insertBefore(svg, body.firstChild);
    body._slant = { svg: svg, holder: holder, path: path,
                    mir: body.closest('.feature-card').classList.contains('mir') };
  });

  function redraw() {
    bodies.forEach(function (body) {
      var s = body._slant;
      var W = body.offsetWidth, H = body.offsetHeight;   // layout size, ignores scale()
      if (!W || !H) return;
      s.svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      s.path.setAttribute('d', buildPath(W, H));
      s.holder.setAttribute('transform', s.mir ? 'translate(' + W + ',0) scale(-1,1)' : '');
    });
  }

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
  window.addEventListener('resize', function () { redraw(); onScroll(); });
  window.addEventListener('load', redraw);
  (reduce.addEventListener ? reduce.addEventListener('change', update) : reduce.addListener(update));
  redraw();
  update();
})();
