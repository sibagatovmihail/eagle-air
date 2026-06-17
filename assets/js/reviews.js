/* =============================================================================
   EagleAir — Reviews slider (Google Places ready)
   -----------------------------------------------------------------------------
   The slider renders from a JS data array and is ready to be wired to the
   Google Maps Places API. Until the two keys below are filled in, it shows the
   static fallback reviews. Once filled, it pulls live Google reviews, updates
   the rating badge and the "Write a review" link automatically.

   ► To go live: set REVIEWS_PLACE_ID and REVIEWS_API_KEY below.
     See GOOGLE-REVIEWS-SETUP.md for the step-by-step guide.
   ============================================================================= */
(function () {
  'use strict';

  /* ── Config — fill in before going live (see GOOGLE-REVIEWS-SETUP.md) ─────── */
  var REVIEWS_PLACE_ID = '';   // e.g. 'ChIJN1t_tDeuEmsRUsoyG83frY4'
  var REVIEWS_API_KEY  = '';   // e.g. 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFh3l4'

  /* ── Static fallback reviews (replaced by live Google reviews once wired) ── */
  var REVIEWS_STATIC = [
    {
      author_name: 'David Mitchell',
      rating: 5,
      text: 'EagleAir installed our new central air system last month. Ruben was professional, showed up right on time, and the installation was flawless. Our home has never been more comfortable, even during the hottest part of summer.',
      relative_time_description: 'Sarasota, Florida',
      profile_photo_url: '',
      author_url: ''
    },
    {
      author_name: 'Jennifer Caldwell',
      rating: 5,
      text: 'When our AC broke down on the hottest day of the year, EagleAir came to our rescue within two hours. Ruben diagnosed the issue quickly and had it running again the same afternoon. Excellent emergency service and very fair pricing.',
      relative_time_description: 'Bradenton, Florida',
      profile_photo_url: '',
      author_url: ''
    },
    {
      author_name: 'Robert Tanner',
      rating: 5,
      text: "I've been using EagleAir for maintenance on our office building for three years now. Ruben is reliable, knowledgeable, and always delivers quality service. The annual tune-ups have kept our system running perfectly. Highly recommended!",
      relative_time_description: 'Lakewood Ranch, Florida',
      profile_photo_url: '',
      author_url: ''
    },
    {
      author_name: 'Maria Gonzalez',
      rating: 5,
      text: 'Ruben was courteous and explained everything he was doing step by step. The repair was completed quickly and our system is running better than it has in years. Outstanding customer service from start to finish.',
      relative_time_description: 'Venice, Florida',
      profile_photo_url: '',
      author_url: ''
    },
    {
      author_name: 'Thomas Whitfield',
      rating: 5,
      text: 'Booked a maintenance visit and a duct cleaning. The team showed up on schedule, wore shoe covers, and left everything spotless. Airflow throughout the house is noticeably better. Fair, honest and professional.',
      relative_time_description: 'Osprey, Florida',
      profile_photo_url: '',
      author_url: ''
    },
    {
      author_name: 'Karen Russo',
      rating: 5,
      text: 'We replaced an aging mini-split with EagleAir and could not be happier. They walked us through the options without any pressure, gave a clear upfront quote, and the new unit is whisper quiet. Will use them again.',
      relative_time_description: 'Nokomis, Florida',
      profile_photo_url: '',
      author_url: ''
    }
  ];

  var reviewsData       = [];
  var reviewsCurrentIdx = 0;
  var reviewsModalIdx   = 0;

  var rvTrack    = document.getElementById('reviews-track');
  var rvViewport = document.getElementById('reviews-viewport');
  var rvPrev     = document.getElementById('reviews-prev');
  var rvNext     = document.getElementById('reviews-next');
  var rvDots     = document.getElementById('reviews-dots');

  var rvModal         = document.getElementById('review-modal');
  var rvModalBody     = document.getElementById('review-modal-body');
  var rvModalClose    = document.getElementById('review-modal-close');
  var rvModalBackdrop = document.getElementById('review-modal-backdrop');

  if (!rvTrack) return;

  /* ── Helpers ───────────────────────────────────────────── */
  var STAR_PATH = 'm8 1.333 2.06 4.174 4.607.674-3.334 3.248.787 4.588L8 11.513l-4.12 2.504.787-4.588L1.333 6.18l4.607-.674L8 1.333Z';

  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function buildStars(rating) {
    var html = '<div class="rv-stars" aria-label="' + rating + ' out of 5 stars">';
    for (var i = 1; i <= 5; i++) {
      var op = i <= rating ? '1' : '0.25';
      html += '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="' + STAR_PATH + '" fill="#ef7d1f" opacity="' + op + '"/></svg>';
    }
    return html + '</div>';
  }

  function buildAvatar(review) {
    var initial = esc(review.author_name.charAt(0).toUpperCase());
    if (review.profile_photo_url) {
      return '<img src="' + esc(review.profile_photo_url) + '" alt="' + esc(review.author_name) + '" class="rv-card__avatar" loading="lazy" referrerpolicy="no-referrer">';
    }
    return '<div class="rv-card__avatar rv-card__avatar--initials">' + initial + '</div>';
  }

  function buildAuthorBlock(review) {
    return '<div class="rv-card__author">'
      + buildAvatar(review)
      + '<div class="rv-card__author-info">'
      +   '<div class="rv-card__name-cover"><span class="rv-card__name">' + esc(review.author_name) + '</span></div>'
      +   '<div class="rv-card__date-cover"><span class="rv-card__date">' + esc(review.relative_time_description) + '</span></div>'
      + '</div>'
      + '</div>';
  }

  var GOOGLE_G = '<svg class="rv-card__google" width="20" height="20" viewBox="0 0 24 24" aria-label="Google" role="img"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"/></svg>';

  var CARD_PREVIEW_LEN = 165;

  function buildReviewCard(review, idx) {
    var isLong  = review.text.length > CARD_PREVIEW_LEN;
    var preview = isLong
      ? esc(review.text.slice(0, CARD_PREVIEW_LEN).replace(/\s\S*$/, '')) + '…'
      : esc(review.text);

    return '<article class="rv-card">'
      + '<div class="rv-card__header">'
      +   buildAuthorBlock(review)
      +   GOOGLE_G
      + '</div>'
      + '<div class="rv-card__stars">' + buildStars(review.rating) + '</div>'
      + '<div class="rv-card__text-cover"><p class="rv-card__text">&ldquo;' + preview + '&rdquo;</p></div>'
      + (isLong
          ? '<div class="rv-card__link-cover"><button type="button" class="rv-card__link js-open-review" data-idx="' + idx + '">Read full review</button></div>'
          : '')
      + '</article>';
  }

  /* ── Slider geometry ───────────────────────────────────── */
  var GAP = 16;

  function rvVisibleCount() {
    if (window.innerWidth > 1024) return 3;
    if (window.innerWidth > 640)  return 2;
    return 1;
  }

  function rvMaxIndex() {
    return Math.max(0, reviewsData.length - rvVisibleCount());
  }

  function rvSlideWidth() {
    if (!rvViewport) return 0;
    var count = rvVisibleCount();
    return (rvViewport.offsetWidth - GAP * (count - 1)) / count;
  }

  function rvApplyWidths() {
    var sw = rvSlideWidth() + 'px';
    Array.prototype.forEach.call(rvTrack.querySelectorAll('.rv-slide'), function (s) {
      s.style.width = sw;
    });
  }

  function rvGoTo(idx, animate) {
    var max = rvMaxIndex();
    if (idx < 0)   idx = max;   /* wrap for looping */
    if (idx > max) idx = 0;
    reviewsCurrentIdx = idx;
    var sw = rvSlideWidth();
    rvTrack.style.transition = animate === false ? 'none' : 'transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)';
    rvTrack.style.transform  = 'translateX(-' + (reviewsCurrentIdx * (sw + GAP)) + 'px)';
    rvUpdateUI();
  }

  function rvUpdateUI() {
    if (rvDots) {
      Array.prototype.forEach.call(rvDots.querySelectorAll('.reviews__dot'), function (dot, i) {
        dot.classList.toggle('reviews__dot--active', i === reviewsCurrentIdx);
      });
    }
  }

  /* ── Render ────────────────────────────────────────────── */
  function rvRender() {
    var html = '';
    reviewsData.forEach(function (r, i) {
      html += '<div class="rv-slide">' + buildReviewCard(r, i) + '</div>';
    });
    rvTrack.innerHTML = html;
    rvApplyWidths();

    if (rvDots) {
      var maxIdx = rvMaxIndex(), dotsHtml = '';
      for (var i = 0; i <= maxIdx; i++) {
        dotsHtml += '<button class="reviews__dot" type="button" aria-label="Go to review ' + (i + 1) + '"></button>';
      }
      rvDots.innerHTML = dotsHtml;
      Array.prototype.forEach.call(rvDots.querySelectorAll('.reviews__dot'), function (dot, i) {
        dot.addEventListener('click', function () { rvGoTo(i, true); });
      });
    }

    rvGoTo(Math.min(reviewsCurrentIdx, rvMaxIndex()), false);
  }

  /* ── Modal — full text of every review; clicked one renders first ──────── */
  function rvModalRender() {
    if (!rvModalBody) return;
    var total = reviewsData.length;
    var html = '';
    for (var j = 0; j < total; j++) {
      var r = reviewsData[(reviewsModalIdx + j) % total];
      html += '<article class="rv-card">'
        + '<div class="rv-card__header">' + buildAuthorBlock(r) + GOOGLE_G + '</div>'
        + '<div class="rv-card__stars">' + buildStars(r.rating) + '</div>'
        + '<div class="rv-card__text-cover"><p class="rv-card__text">&ldquo;' + esc(r.text) + '&rdquo;</p></div>'
        + (r.author_url ? '<div class="rv-card__link-cover"><a href="' + esc(r.author_url) + '" target="_blank" rel="noopener" class="rv-card__link">View on Google &rarr;</a></div>' : '')
        + '</article>';
    }
    rvModalBody.innerHTML = html;
  }

  function rvModalOpen(idx) {
    if (!rvModal || !reviewsData.length) return;
    reviewsModalIdx = Math.max(0, Math.min(idx, reviewsData.length - 1));
    rvModalRender();
    rvModal.hidden = false;
    document.body.classList.add('rv-scroll-locked');
    if (rvModalBody) rvModalBody.scrollTop = 0; /* clicked review (first) at top */
    if (rvModalClose) rvModalClose.focus();
  }

  function rvModalDismiss() {
    if (!rvModal) return;
    rvModal.hidden = true;
    document.body.classList.remove('rv-scroll-locked');
  }

  /* ── Google Places loader (falls back to static) ───────── */
  function rvLoadData() {
    if (!REVIEWS_PLACE_ID || !REVIEWS_API_KEY) {
      reviewsData = REVIEWS_STATIC;
      rvRender();
      return;
    }

    window._rvMapsReady = function () {
      var service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails({
        placeId: REVIEWS_PLACE_ID,
        fields: ['reviews', 'rating', 'user_ratings_total']
      }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews && place.reviews.length) {
          reviewsData = place.reviews.map(function (r) {
            return {
              author_name:               r.author_name,
              rating:                    r.rating,
              text:                      r.text,
              relative_time_description: r.relative_time_description,
              profile_photo_url:         r.profile_photo_url,
              author_url:                r.author_url
            };
          });
          var scoreEl = document.querySelector('.reviews-badge__score');
          var countEl = document.querySelector('.reviews-badge__count');
          if (scoreEl && place.rating)             scoreEl.textContent = place.rating.toFixed(1);
          if (countEl && place.user_ratings_total) countEl.textContent = place.user_ratings_total + ' reviews';
          var writeBtn = document.querySelector('.reviews__cta');
          if (writeBtn) writeBtn.setAttribute('href', 'https://search.google.com/local/writereview?placeid=' + REVIEWS_PLACE_ID);
        } else {
          reviewsData = REVIEWS_STATIC;
        }
        rvRender();
      });
    };

    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + REVIEWS_API_KEY + '&libraries=places&callback=_rvMapsReady';
    s.async = true;
    s.defer = true;
    s.onerror = function () { reviewsData = REVIEWS_STATIC; rvRender(); };
    document.head.appendChild(s);
  }

  /* ── Init ──────────────────────────────────────────────── */
  if (rvPrev) rvPrev.addEventListener('click', function () { rvGoTo(reviewsCurrentIdx - 1, true); });
  if (rvNext) rvNext.addEventListener('click', function () { rvGoTo(reviewsCurrentIdx + 1, true); });

  rvTrack.addEventListener('click', function (e) {
    var link = e.target.closest('.js-open-review');
    if (!link) return;
    e.preventDefault();
    rvModalOpen(parseInt(link.getAttribute('data-idx'), 10));
  });

  if (rvModalClose)    rvModalClose.addEventListener('click', rvModalDismiss);
  if (rvModalBackdrop) rvModalBackdrop.addEventListener('click', rvModalDismiss);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && rvModal && !rvModal.hidden) rvModalDismiss();
  });

  /* ── Touch drag ────────────────────────────────────────── */
  var rvTouchX = 0, rvTouchBase = 0, rvDragging = false;

  if (rvViewport) {
    rvViewport.addEventListener('touchstart', function (e) {
      rvTouchX    = e.touches[0].clientX;
      rvTouchBase = -(reviewsCurrentIdx * (rvSlideWidth() + GAP));
      rvDragging  = true;
      rvTrack.style.transition = 'none';
    }, { passive: true });

    rvViewport.addEventListener('touchmove', function (e) {
      if (!rvDragging) return;
      var dx = e.touches[0].clientX - rvTouchX;
      rvTrack.style.transform = 'translateX(' + (rvTouchBase + dx) + 'px)';
    }, { passive: true });

    rvViewport.addEventListener('touchend', function (e) {
      if (!rvDragging) return;
      rvDragging = false;
      var dx = e.changedTouches[0].clientX - rvTouchX;
      if (Math.abs(dx) > 50) {
        rvGoTo(reviewsCurrentIdx + (dx < 0 ? 1 : -1), true);
      } else {
        rvGoTo(reviewsCurrentIdx, true);
      }
    });
  }

  var rvResizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(rvResizeTimer);
    rvResizeTimer = setTimeout(function () {
      rvApplyWidths();
      rvGoTo(Math.min(reviewsCurrentIdx, rvMaxIndex()), false);
    }, 150);
  });

  rvLoadData();
})();
