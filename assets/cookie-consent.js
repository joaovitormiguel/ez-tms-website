/* Cookie consent banner. Shows once until the visitor accepts or declines; the choice
   is stored in localStorage so it won't reappear. Injected on every page. */
(function () {
  var KEY = 'ez_cookie_consent';
  try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }

  var bar = document.createElement('div');
  bar.className = 'cookie-bar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Cookie consent');
  bar.innerHTML =
    '<p class="cookie-text">We use cookies to give you the best experience on our site. ' +
    'See our <a href="privacy.html">Privacy Policy</a>.</p>' +
    '<div class="cookie-actions">' +
      '<button type="button" class="cookie-btn decline" data-consent="declined">Decline</button>' +
      '<button type="button" class="cookie-btn accept" data-consent="accepted">Accept</button>' +
    '</div>';
  document.body.appendChild(bar);
  requestAnimationFrame(function () { bar.classList.add('is-in'); });

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-consent]');
    if (!btn) return;
    try { localStorage.setItem(KEY, btn.getAttribute('data-consent')); } catch (e) {}
    bar.classList.remove('is-in');
    setTimeout(function () { bar.remove(); }, 320);
  });
})();
