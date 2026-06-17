# Google Reviews — Setup Guide

The reviews slider on the homepage is already built and shows placeholder
reviews. Follow these steps to switch it over to your **real Google reviews**.
No coding experience required.

---

## What you need

- A Google account with access to Google Cloud
- The business listed on Google Maps (EagleAir, Sarasota)
- About 15–20 minutes

---

## Step 1 — Get your Google Place ID

1. Open: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
2. Type your business name in the search box (e.g. "EagleAir Sarasota")
3. Click your business in the results
4. Copy the **Place ID** — it looks like: `ChIJN1t_tDeuEmsRUsoyG83frY4`
5. Keep it handy for Step 3

---

## Step 2 — Create a Google Maps API key

1. Go to: https://console.cloud.google.com
2. Sign in with your Google account
3. Click **"Select a project"** at the top → **"New Project"**
4. Name it anything (e.g. "EagleAir Reviews") → **Create**
5. Left menu → **APIs & Services → Library**
6. Search **"Places API"** → click it → **Enable**
7. Left menu → **APIs & Services → Credentials**
8. Click **"+ Create Credentials"** → **"API Key"**
9. Copy the API key — it looks like: `AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFh3l4`

### Restrict the key (important for security)

10. Click the key you just created → **Edit**
11. **Application restrictions** → select **"HTTP referrers (websites)"**
12. **Website restrictions** → add: `eagleair-hvac.com/*`  (and `*.eagleair-hvac.com/*`)
13. **API restrictions** → select **"Restrict key"** → choose **Places API**
14. **Save**

---

## Step 3 — Add the keys to the website

Open the file: **`assets/js/reviews.js`**

Near the top you'll find these two lines:

```js
var REVIEWS_PLACE_ID = '';   // e.g. 'ChIJN1t_tDeuEmsRUsoyG83frY4'
var REVIEWS_API_KEY  = '';   // e.g. 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFh3l4'
```

Paste your values between the quotes:

```js
var REVIEWS_PLACE_ID = 'YOUR_PLACE_ID_HERE';
var REVIEWS_API_KEY  = 'YOUR_API_KEY_HERE';
```

Save the file.

---

## Step 4 — Deploy

Commit and push the change (or upload `assets/js/reviews.js`). Vercel redeploys
automatically within ~30 seconds.

```bash
git add assets/js/reviews.js
git commit -m "Connect Google Reviews API"
git push origin main
```

---

## Step 5 — Verify it works

1. Open the live website
2. Scroll to the **"What Our Customers Say"** section
3. The slider now shows real Google reviews with names, dates and ratings
4. The star rating and review count in the badge update automatically
5. The **"Write a review"** button now links straight to your Google review form

---

## Troubleshooting

**Still showing placeholder reviews (David Mitchell etc.)**
- Double-check the Place ID and API key (no extra spaces)
- Make sure the **Places API** is enabled in Google Cloud Console
- Open the browser console (F12 → Console) and look for error messages

**"This page can't load Google Maps correctly"**
- The API key is wrong or the Places API isn't enabled
- The website restriction doesn't match — confirm you added `eagleair-hvac.com/*`

**Billing note**
- Google requires a credit card for the Places API but gives **$200 free credit
  every month** — far more than a small business site uses.
- The Places API costs ~$17 per 1,000 requests; your traffic will stay well
  inside the free tier. Set a budget alert in Cloud Console → Billing to be safe.

---

## Notes

- The Google Places API returns the **5 most relevant** reviews — this is a
  Google limitation, not a site limitation.
- Reviews are read-only and managed in your Google Business Profile. The site
  always shows whatever Google currently serves for your Place ID.
