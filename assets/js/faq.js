/* FAQ accordion.
   The markup is <h3><button aria-expanded> + a .faq__panel that animates via
   grid-template-rows in CSS, so this only toggles a class and keeps ARIA in
   sync — no height measurement, no inline styles. Opening one item closes the
   others. Works without JS too: the panel is collapsed but the answer text
   stays in the DOM for search and AI crawlers. */
(function () {
  'use strict';

  function initFaq() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.faq__q');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var willOpen = !item.classList.contains('is-open');

        items.forEach(function (other) {
          other.classList.remove('is-open');
          var b = other.querySelector('.faq__q');
          if (b) b.setAttribute('aria-expanded', 'false');
        });

        if (willOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    /* Open the first item so the section never reads as an empty list. */
    var first = items[0];
    var firstBtn = first.querySelector('.faq__q');
    if (firstBtn) {
      first.classList.add('is-open');
      firstBtn.setAttribute('aria-expanded', 'true');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaq);
  } else {
    initFaq();
  }
})();
