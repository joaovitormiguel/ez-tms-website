/* Logo marquee: clone the single set of logos once so the strip can scroll seamlessly
   (animation runs translateX(0 -> -50%)), and set the duration from the measured width
   so every marquee scrolls at the same speed regardless of how many logos it has. */
(function () {
  var SPEED = 70; // pixels per second

  Array.prototype.forEach.call(document.querySelectorAll('.marquee-track'), function (track) {
    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length) return;

    originals.forEach(function (node) {
      var c = node.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
    var firstClone = track.children[originals.length];

    function setDuration() {
      var copyWidth = firstClone.offsetLeft;            // width of one full set incl. trailing gap
      if (copyWidth) track.style.animationDuration = (copyWidth / SPEED) + 's';
    }

    var imgs = track.querySelectorAll('img');
    var pending = imgs.length;
    function done() { if (--pending <= 0) setDuration(); }
    if (!pending) setDuration();
    Array.prototype.forEach.call(imgs, function (im) {
      if (im.complete) done();
      else { im.addEventListener('load', done); im.addEventListener('error', done); }
    });
    window.addEventListener('resize', setDuration);
  });
})();
