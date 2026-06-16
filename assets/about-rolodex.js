/* About hero: cycle the highlighted verb (Built / Tested / Used) like a rolodex. */
(function () {
  var box = document.getElementById('whyVerbs');
  if (!box) return;
  var verbs = box.querySelectorAll('.verb');
  if (verbs.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var i = 0;
  setInterval(function () {
    verbs[i].classList.remove('is-active');
    i = (i + 1) % verbs.length;
    verbs[i].classList.add('is-active');
  }, 1600);
})();
