/* About hero: rotate the verbs (Built / Tested / Used) through a single slot,
   one at a time, as the prefix to "by brokers." — a vertical rolodex.
   #whyVerbs is the .verb-track; its last .verb is a clone of the first for a
   seamless loop. */
(function () {
  var track = document.getElementById('whyVerbs');
  if (!track) return;
  var verbs = track.querySelectorAll('.verb');
  var N = verbs.length - 1;            // original verbs (last one is a clone)
  if (N < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var i = 0;
  function setY(idx, animate) {
    var h = verbs[0].getBoundingClientRect().height;
    track.style.transition = animate ? 'transform .6s cubic-bezier(.5,0,.2,1)' : 'none';
    track.style.transform = 'translateY(' + (-idx * h) + 'px)';
  }

  setInterval(function () {
    i += 1;
    setY(i, true);
    if (i === N) {                     // showing the clone — snap back to the real first
      setTimeout(function () { i = 0; setY(0, false); }, 640);
    }
  }, 1900);
})();
