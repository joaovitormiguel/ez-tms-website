/* Feature stack: simple scroll focus. As you scroll, whichever row is nearest the
   vertical center of the viewport becomes "in focus" (bright, full scale); the others
   ease back (dimmed, shrunk). No scroll hijacking. */
(function () {
  var stack = document.getElementById('featStack');
  if (!stack) return;
  var rows = Array.prototype.slice.call(stack.querySelectorAll('.feat-row'));
  if (!rows.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var NS = 'http://www.w3.org/2000/svg';

  /* The slanted red outline is drawn in the body's REAL pixel space (viewBox = its
     measured size), so it never stretches: corners stay circular and the stroke is a
     uniform width on every edge regardless of the card's aspect ratio. Rows alternate
     the slant direction (peak at the top, then peak at the bottom, …) and .mir cards
     mirror left↔right, so each row reads as a symmetric pair around the center aisle.
     Open on the left; the right edge leans. Redrawn on resize. */
  function buildPath(W, H, topWide) {
    var i = 1.5;                       // stroke inset so the line isn't clipped
    var r = Math.min(20, (H - 2 * i) / 2);
    var lean = H * 0.17;               // horizontal lean of the slanted edge
    var xTop = topWide ? (W - i) : (W - i - lean);   // top-right corner x
    var xBot = topWide ? (W - i - lean) : (W - i);   // bottom-right corner x
    var dx = xBot - xTop, dy = (H - i) - i;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / len, uy = dy / len;                // unit vector down the slant
    var bx = xTop + ux * r, by = i + uy * r;         // top corner, after the round
    var ex = xBot - ux * r, ey = (H - i) - uy * r;   // bottom corner, before the round
    return 'M0 ' + i +
           ' L' + (xTop - r) + ' ' + i +
           ' Q' + xTop + ' ' + i + ' ' + bx + ' ' + by +
           ' L' + ex + ' ' + ey +
           ' Q' + xBot + ' ' + (H - i) + ' ' + (xBot - r) + ' ' + (H - i) +
           ' L0 ' + (H - i);
  }

  var bodies = [];
  rows.forEach(function (row, ri) {
    var topWide = (ri % 2 === 0);      // alternate the slant peak row by row
    Array.prototype.forEach.call(row.querySelectorAll('.feature-card .body'), function (body) {
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
      body._slant = { svg: svg, holder: holder, path: path, topWide: topWide,
                      mir: body.closest('.feature-card').classList.contains('mir') };
      bodies.push(body);
    });
  });

  /* gray sparkle divider, centered in the aisle BETWEEN each set of four cards (i.e.
     between every pair of rows). Absolutely positioned so it adds no vertical space —
     the rows keep their uniform gap. */
  var STAR = 'M50 2 C53 33 67 47 98 50 C67 53 53 67 50 98 C47 67 33 53 2 50 C33 47 47 33 50 2 Z';
  var stars = [];
  for (var g = 0; g + 1 < rows.length; g += 2) {     // pinch in the middle of each set of four
    var star = document.createElement('div');
    star.className = 'feat-star';
    star.setAttribute('aria-hidden', 'true');
    star.innerHTML = '<svg viewBox="0 0 100 100"><path d="' + STAR + '" fill="currentColor"/></svg>';
    stack.appendChild(star);
    stars.push({ el: star, g: g });
  }
  function placeStars() {
    stars.forEach(function (s) {
      var a = rows[s.g], b = rows[s.g + 1];          // gap between this row and the next
      s.el.style.top = ((a.offsetTop + a.offsetHeight + b.offsetTop) / 2) + 'px';
    });
  }

  function redraw() {
    bodies.forEach(function (body) {
      var s = body._slant;
      var W = body.offsetWidth, H = body.offsetHeight;   // layout size, ignores scale()
      if (!W || !H) return;
      s.svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      s.path.setAttribute('d', buildPath(W, H, s.topWide));
      s.holder.setAttribute('transform', s.mir ? 'translate(' + W + ',0) scale(-1,1)' : '');
    });
    placeStars();
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
