/* Feature stack rolodex: while the section is pinned, scroll progress flips the
   front row up and brings the next row into the focus slot. Desktop + motion only;
   mobile and reduced-motion fall back to the plain stacked list (no rolodex-on class). */
(function () {
  var track = document.getElementById('featTrack');
  var rolodex = document.getElementById('featRolodex');
  if (!track || !rolodex) return;

  var stage = track.querySelector('.feat-stage');
  var rows = Array.prototype.slice.call(rolodex.querySelectorAll('.feat-row'));
  var N = rows.length;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var wide = window.matchMedia('(min-width: 761px)');

  function active() { return wide.matches && !reduce.matches; }

  function clearRows() {
    rows.forEach(function (r) {
      r.style.transform = '';
      r.style.opacity = '';
      r.style.zIndex = '';
    });
  }

  // place every row given the fractional focused index (0 .. N-1)
  function layout(focus) {
    var rh = rolodex.clientHeight || stage.clientHeight;
    var focusY = rh * 0.06;
    var step = Math.min(150, rh * 0.155);
    for (var i = 0; i < N; i++) {
      var off = i - focus, ty, sc, op, z;
      if (off >= 0) {                 // focus slot + receding tail below
        ty = focusY + off * step;
        sc = Math.pow(0.86, off);
        op = off < 0.001 ? 1 : Math.pow(0.6, off);
        z = 100 - Math.round(off * 10);
      } else {                        // already passed: fly up + fade out
        ty = focusY + off * step * 1.7;
        sc = 1 + Math.min(1.2, -off) * 0.05;
        op = Math.max(0, 1 + off * 1.7);
        z = 100 + Math.round(off * 10);
      }
      var s = rows[i].style;
      s.transform = 'translate(-50%,' + ty.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')';
      s.opacity = op.toFixed(3);
      s.zIndex = String(z);
    }
  }

  function update() {
    if (!active()) { track.classList.remove('rolodex-on'); clearRows(); return; }
    track.classList.add('rolodex-on');
    var total = track.offsetHeight - stage.offsetHeight;
    if (total <= 0) { layout(0); return; }
    var p = -track.getBoundingClientRect().top / total;
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    layout(p * (N - 1));
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  (reduce.addEventListener ? reduce.addEventListener('change', update) : reduce.addListener(update));
  (wide.addEventListener ? wide.addEventListener('change', update) : wide.addListener(update));
  window.addEventListener('load', update);
  update();
})();
