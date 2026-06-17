/* =============================================================================
   EagleAir — Cookie Consent + Google Analytics 4 loader
   -----------------------------------------------------------------------------
   GA4 Measurement ID : G-PR41S77XSM
   GA4 Stream ID       : 15102057559   (reference only — gtag uses the measurement ID)

   Analytics scripts are loaded ONLY after the visitor accepts analytics
   cookies. The choice is stored in localStorage and respected on every page.
   Public API:
     window.eagleAirCookieConsent.openSettings()  — reopen the preferences modal
     window.eagleAirCookieConsent.revoke()        — clear the saved choice
   ============================================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'eagleair_cookie_consent';
  var GA_ID       = 'G-PR41S77XSM';
  var PRIVACY_URL = 'privacy-policy.html';

  /* ── Consent state ─────────────────────────────────────── */

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
  }

  function saveConsent(analytics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: analytics, ts: Date.now() }));
    } catch (e) { /* storage unavailable — choice applies for this page load only */ }
  }

  /* ── Google Analytics 4 loader ─────────────────────────── */

  function loadGA() {
    if (window._gaLoaded) return;
    window._gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* ── Render: banner ────────────────────────────────────── */

  function createBanner() {
    var el = document.createElement('div');
    el.id = 'cc-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'false');
    el.setAttribute('aria-label', 'Cookie preferences');
    el.innerHTML =
      '<div class="cc-inner">' +
        '<div class="cc-text">' +
          '<p class="cc-title">We value your privacy</p>' +
          '<p class="cc-body">We use essential cookies to make this site work and &mdash; with your consent &mdash; analytics cookies (Google Analytics) to understand how visitors use our site so we can improve it. You can accept all, decline non-essential cookies, or choose your preferences. Read more in our <a href="' + PRIVACY_URL + '" class="cc-link">Privacy Policy</a>.</p>' +
        '</div>' +
        '<div class="cc-actions">' +
          '<button class="cc-btn cc-btn--ghost" id="cc-settings-btn" type="button">Preferences</button>' +
          '<button class="cc-btn cc-btn--outline" id="cc-decline-btn" type="button">Decline</button>' +
          '<button class="cc-btn cc-btn--accent" id="cc-accept-btn" type="button">Accept all</button>' +
        '</div>' +
      '</div>';
    return el;
  }

  /* ── Render: preferences modal ─────────────────────────── */

  function createModal() {
    var el = document.createElement('div');
    el.id = 'cc-modal-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Manage cookie preferences');
    el.innerHTML =
      '<div class="cc-modal">' +
        '<div class="cc-modal__header">' +
          '<p class="cc-modal__title">Cookie preferences</p>' +
          '<button class="cc-modal__close" id="cc-modal-close" type="button" aria-label="Close">' +
            '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="cc-modal__body">' +
          '<div class="cc-category">' +
            '<div class="cc-category__info">' +
              '<p class="cc-category__name">Strictly necessary</p>' +
              '<p class="cc-category__desc">Required for the website to function — page navigation, security and remembering your cookie choice. These cannot be switched off.</p>' +
            '</div>' +
            '<div class="cc-toggle cc-toggle--locked" aria-label="Always active"><span class="cc-toggle__label">Always on</span></div>' +
          '</div>' +
          '<div class="cc-category">' +
            '<div class="cc-category__info">' +
              '<p class="cc-category__name">Analytics (Google Analytics)</p>' +
              '<p class="cc-category__desc">Help us understand how visitors interact with the site so we can improve it. IP addresses are anonymized. Provider: Google LLC. More in our <a href="' + PRIVACY_URL + '" class="cc-link">Privacy Policy</a>.</p>' +
            '</div>' +
            '<label class="cc-toggle" aria-label="Analytics cookies">' +
              '<input type="checkbox" id="cc-analytics-toggle" class="cc-toggle__input">' +
              '<span class="cc-toggle__track"><span class="cc-toggle__thumb"></span></span>' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div class="cc-modal__footer">' +
          '<button class="cc-btn cc-btn--outline" id="cc-save-btn" type="button">Save choices</button>' +
          '<button class="cc-btn cc-btn--accent" id="cc-accept-all-btn" type="button">Accept all</button>' +
        '</div>' +
      '</div>';
    return el;
  }

  /* ── Logic ─────────────────────────────────────────────── */

  function hideBanner(banner) {
    if (!banner) return;
    banner.classList.add('cc-banner--hidden');
    setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 400);
  }

  function closeModal(overlay) {
    overlay.classList.remove('cc-modal-overlay--visible');
    setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 300);
  }

  function showModal(banner) {
    if (document.getElementById('cc-modal-overlay')) return;

    var overlay = createModal();
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('cc-modal-overlay--visible'); });

    var analyticsToggle = overlay.querySelector('#cc-analytics-toggle');
    var consent = getConsent();
    if (consent && consent.analytics) analyticsToggle.checked = true;

    overlay.querySelector('#cc-modal-close').addEventListener('click', function () { closeModal(overlay); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(overlay); });
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape' && document.getElementById('cc-modal-overlay')) {
        closeModal(overlay);
        document.removeEventListener('keydown', escClose);
      }
    });

    overlay.querySelector('#cc-save-btn').addEventListener('click', function () {
      var allow = analyticsToggle.checked;
      saveConsent(allow);
      if (allow) loadGA();
      closeModal(overlay);
      hideBanner(banner);
    });

    overlay.querySelector('#cc-accept-all-btn').addEventListener('click', function () {
      saveConsent(true);
      loadGA();
      closeModal(overlay);
      hideBanner(banner);
    });
  }

  /* ── Init ──────────────────────────────────────────────── */

  function init() {
    var consent = getConsent();

    if (consent !== null) {
      if (consent.analytics) loadGA();
      return;
    }

    var banner = createBanner();
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add('cc-banner--visible'); });

    banner.querySelector('#cc-accept-btn').addEventListener('click', function () {
      saveConsent(true);
      loadGA();
      hideBanner(banner);
    });

    banner.querySelector('#cc-decline-btn').addEventListener('click', function () {
      saveConsent(false);
      hideBanner(banner);
    });

    banner.querySelector('#cc-settings-btn').addEventListener('click', function () {
      showModal(banner);
    });
  }

  /* ── Public API ────────────────────────────────────────── */

  window.eagleAirCookieConsent = {
    openSettings: function () {
      showModal(document.getElementById('cc-banner') || null);
    },
    revoke: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
