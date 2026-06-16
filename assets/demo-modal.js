/* Demo request modal. Injected once per page; every "Request a Demo" button opens it.
   No backend on this static host, so a valid submit composes an email to Sales@EZ-TMS.com
   (same approach as the campaign landing forms). Swap buildSubmit() for a real endpoint
   later if desired. */
(function () {
  var MAILTO = 'Sales@EZ-TMS.com';

  function field(label, name, type, required, autocomplete, value, full) {
    return '<label class="df-field' + (full ? ' df-full' : '') + '">' +
      '<span class="df-label">' + label + (required ? '<span class="req">*</span>' : '') + '</span>' +
      '<input type="' + type + '" name="' + name + '"' +
        (required ? ' required' : '') +
        (autocomplete ? ' autocomplete="' + autocomplete + '"' : '') +
        (type === 'number' ? ' min="0" inputmode="numeric"' : '') +
        (value != null ? ' value="' + value + '"' : '') + ' />' +
    '</label>';
  }

  var modal = document.createElement('div');
  modal.className = 'demo-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="demo-overlay" data-close></div>' +
    '<div class="demo-dialog" role="dialog" aria-modal="true" aria-labelledby="demoTitle">' +
      '<button class="demo-close" type="button" aria-label="Close" data-close>&times;</button>' +
      '<h2 id="demoTitle" class="demo-title">Request a <span class="r">demo.</span></h2>' +
      '<form class="demo-form">' +
        '<div class="df-row">' +
          field('First name', 'firstName', 'text', true, 'given-name') +
          field('Last name', 'lastName', 'text', true, 'family-name') +
        '</div>' +
        field('Company name', 'company', 'text', true, 'organization', null, true) +
        field('Phone number', 'phone', 'tel', true, 'tel', null, true) +
        field('Email', 'email', 'email', true, 'email', null, true) +
        '<div class="df-row">' +
          field('Number of employees', 'employees', 'number', true, '', '1') +
          field('Monthly Load Count', 'loads', 'number', false, '') +
        '</div>' +
        field('Current TMS Technology', 'currentTms', 'text', false, '', null, true) +
        field('MC #', 'mc', 'text', false, '', null, true) +
        '<button type="submit" class="demo-submit">Submit</button>' +
        '<p class="demo-thanks" hidden>Thanks! Your request is ready to send — we&rsquo;ll be in touch shortly.</p>' +
      '</form>' +
    '</div>';
  document.body.appendChild(modal);

  var dialog = modal.querySelector('.demo-dialog');
  var form = modal.querySelector('.demo-form');
  var thanks = modal.querySelector('.demo-thanks');
  var lastFocus = null;

  function open(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = form.querySelector('input');
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
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    if (e.key === 'Tab' && modal.classList.contains('is-open')) trapTab(e);
  });

  function trapTab(e) {
    var f = dialog.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();                       // valid (browser checked required fields)
    var d = new FormData(form), g = function (k) { return (d.get(k) || '').toString().trim(); };
    var subject = 'Demo request — ' + g('firstName') + ' ' + g('lastName') +
                  (g('company') ? ', ' + g('company') : '');
    var body = [
      'First name: ' + g('firstName'),
      'Last name: ' + g('lastName'),
      'Company: ' + g('company'),
      'Phone: ' + g('phone'),
      'Email: ' + g('email'),
      'Number of employees: ' + g('employees'),
      'Monthly load count: ' + (g('loads') || '—'),
      'Current TMS: ' + (g('currentTms') || '—'),
      'MC #: ' + (g('mc') || '—')
    ].join('\n');
    window.location.href = 'mailto:' + MAILTO +
      '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    form.querySelectorAll('.df-field, .df-row, .demo-submit').forEach(function (n) { n.style.display = 'none'; });
    thanks.hidden = false;
  });

  function isDemoTrigger(a) {
    return /request a demo/i.test((a.textContent || '').trim());
  }
  Array.prototype.forEach.call(document.querySelectorAll('a'), function (a) {
    if (isDemoTrigger(a)) a.addEventListener('click', open);
  });
})();
