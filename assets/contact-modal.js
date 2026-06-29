/* Contact modal. Injected once per page; every "Contact" link opens it. Self-hosted
   form (name, email, company, phone, message). No backend on this static host, so a
   valid submit composes an email to Sales@EZ-TMS.com. */
(function () {
  var MAILTO = 'Sales@EZ-TMS.com';

  function field(label, name, type, required, autocomplete, textarea) {
    var control = textarea
      ? '<textarea name="' + name + '"' + (required ? ' required' : '') + '></textarea>'
      : '<input type="' + type + '" name="' + name + '"' + (required ? ' required' : '') +
        (autocomplete ? ' autocomplete="' + autocomplete + '"' : '') + ' />';
    return '<label class="cf-field"><span class="cf-label">' + label +
      (required ? '<span class="req">*</span>' : '') + '</span>' + control + '</label>';
  }

  var modal = document.createElement('div');
  modal.className = 'demo-modal contact-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="demo-overlay" data-close></div>' +
    '<div class="demo-dialog" role="dialog" aria-modal="true" aria-labelledby="contactTitle">' +
      '<button class="demo-close" type="button" aria-label="Close" data-close>&times;</button>' +
      '<h2 id="contactTitle" class="demo-title">Contact <span class="r">us.</span></h2>' +
      '<p class="contact-lead">Send us a message and we&rsquo;ll get right back to you. ' +
        'Prefer to call? <a href="tel:8555948342">(855)&nbsp;594-8342</a></p>' +
      '<form class="contact-form">' +
        field('Name', 'name', 'text', true, 'name') +
        field('Email', 'email', 'email', true, 'email') +
        '<div class="cf-row">' +
          field('Company', 'company', 'text', false, 'organization') +
          field('Phone', 'phone', 'tel', false, 'tel') +
        '</div>' +
        field('Message', 'message', 'text', true, null, true) +
        '<button type="submit" class="contact-submit">Send message</button>' +
        '<p class="contact-thanks" hidden>Thanks! Your message is ready to send &mdash; we&rsquo;ll be in touch shortly.</p>' +
      '</form>';
  document.body.appendChild(modal);

  var dialog = modal.querySelector('.demo-dialog');
  var form = modal.querySelector('.contact-form');
  var thanks = modal.querySelector('.contact-thanks');
  var lastFocus = null;

  function open(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = form.querySelector('input, textarea');
    if (first) first.focus();
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') trapTab(e);
  });
  function trapTab(e) {
    var f = dialog.querySelectorAll('button, input, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    f = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form), g = function (k) { return (d.get(k) || '').toString().trim(); };
    var subject = 'Website contact — ' + g('name') + (g('company') ? ', ' + g('company') : '');
    var body = [
      'Name: ' + g('name'),
      'Email: ' + g('email'),
      'Company: ' + (g('company') || '—'),
      'Phone: ' + (g('phone') || '—'),
      '',
      'Message:',
      g('message')
    ].join('\n');
    window.location.href = 'mailto:' + MAILTO +
      '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    form.querySelectorAll('.cf-field, .cf-row, .contact-submit').forEach(function (n) { n.style.display = 'none'; });
    modal.querySelector('.contact-lead').style.display = 'none';
    thanks.hidden = false;
  });

  Array.prototype.forEach.call(document.querySelectorAll('a'), function (a) {
    if (/^contact$/i.test((a.textContent || '').trim())) a.addEventListener('click', open);
  });
})();
