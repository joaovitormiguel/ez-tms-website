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

  if (prev) prev.addEventListener('click', function () { go(i - 1); });
  if (next) next.addEventListener('click', function () { go(i + 1); });
  if (n <= 1 && dotsBox) dotsBox.style.display = 'none';
})();
