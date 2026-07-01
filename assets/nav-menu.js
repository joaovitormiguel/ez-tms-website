/* Mobile navigation: injects a hamburger button into the header and toggles the nav
   as a slide-down panel. On small screens the Discover item becomes a tap-to-expand
   accordion (no hover). */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var inner = header.querySelector('.header-inner');
  var nav = header.querySelector('.nav');
  if (!inner || !nav) return;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  inner.appendChild(btn);

  function setOpen(open) {
    header.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', function () {
    setOpen(!header.classList.contains('nav-open'));
  });

  nav.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.classList.contains('nav-dd-trigger')) {
      if (window.matchMedia('(max-width:760px)').matches) {
        e.preventDefault();
        a.closest('.nav-dd').classList.toggle('dd-open');
      }
      return;
    }
    setOpen(false);          // a real destination link closes the menu
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) setOpen(false);
  });
})();
