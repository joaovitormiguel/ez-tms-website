/* EZ Blaster: clicking the footer foam finger opens the standalone game in a modal
   (loaded in an iframe so its styles/scripts stay isolated). Loaded lazily on first
   open; the iframe is cleared on close so the game stops. */
(function () {
  var SRC = 'ez-blaster.html';

  var modal = document.createElement('div');
  modal.className = 'game-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="game-overlay" data-close></div>' +
    '<div class="game-dialog" role="dialog" aria-modal="true" aria-label="EZ Blaster game">' +
      '<button class="game-close" type="button" aria-label="Close game" data-close>&times;</button>' +
      '<iframe class="game-frame" title="EZ Blaster" allow="autoplay; fullscreen"></iframe>' +
    '</div>';
  document.body.appendChild(modal);

  var frame = modal.querySelector('.game-frame');
  var lastFocus = null;

  function open(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    if (frame.getAttribute('src') !== SRC) frame.setAttribute('src', SRC);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.game-close').focus();
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    frame.setAttribute('src', 'about:blank');   // stop the game
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  var finger = document.querySelector('.foot-finger');
  if (finger) {
    finger.setAttribute('role', 'button');
    finger.setAttribute('tabindex', '0');
    finger.setAttribute('aria-label', 'Play EZ Blaster');
    finger.addEventListener('click', open);
    finger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }
})();
