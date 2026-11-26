# Fire Hydrant & Sprinkler – Landing Page

Landing page for **MSD Engineering – The Fire Wala** Meta (Facebook / Instagram) ad campaigns promoting **Fire Hydrant** and **Fire Sprinkler** system installation.

Live URL (target): **https://www.thefirewala.in/hydrant-sprinkler/**
Vercel project: `hydrant_service` (team THE FIRE WALA) – auto-deploys from `main`.

Single static page, no build step.

```
hydrant-sprinkler/index.html     ← the whole page (HTML + CSS + JS)
hydrant-sprinkler/assets/img/    ← photos (WebP), flame logo, favicon
hydrant-sprinkler/assets/clients/← client logos (from www.thefirewala.in)
vercel.json                      ← "/" redirects to "/hydrant-sprinkler/", asset caching
google-apps-script.gs            ← optional: a separate lead sheet just for this page
```

Asset paths are absolute (`/hydrant-sprinkler/assets/...`), so the page works both on the Vercel URL and when served under `www.thefirewala.in/hydrant-sprinkler/`.

## Serving it at www.thefirewala.in/hydrant-sprinkler
The main website (`www.thefirewala.in`) is a different Vercel project. Add this to the **main website's** `vercel.json` (merge into its existing `rewrites` array if it has one) and redeploy it:

```json
{
  "rewrites": [
    { "source": "/hydrant-sprinkler", "destination": "https://hydrantservice.vercel.app/hydrant-sprinkler/" },
    { "source": "/hydrant-sprinkler/:path*", "destination": "https://hydrantservice.vercel.app/hydrant-sprinkler/:path*" }
  ]
}
```

The `hydrant_service` project must have Vercel Authentication limited to **preview deployments only** (Settings → Deployment Protection), otherwise the rewrite hits a Vercel login page.

## Page sections
Short, services-focused page styled like www.thefirewala.in.
1. Offer bar (FREE site survey · 24-hr call-back) + navy header with the real logo
2. Hero – headline, trust pills, Call / WhatsApp, real team photo, **lead form**
3. Stats strip – 10+ years, 700+ clients, 50+ team, 24-hr call-back
4. **Services** – Fire Hydrant / Fire Sprinkler tabs with **3D pop-up parts** (`assets/3d/*.svg`: yard hydrant, fire pump, landing valve, hose reel, gauge, sprinkler head, alarm valve)
4b. **Industries we serve** – 8 photo cards (hospitals, schools, factories, residential, hotels, malls, warehouses, offices)
4c. **From our sites – follow the pipeline** – 5 real project photos (`assets/sites/`, colour-corrected) in a horizontal swipe track under a main pipe that fills with water as you swipe; click to enlarge
5. **How we work** – 3D technician illustration + 6 steps with 3D icons
6. Trusted by – auto-scrolling client logos + 3 Google reviews
7. FAQ (4) · final call section · footer
Floating WhatsApp / "Get a FREE Survey" (desktop), sticky Call / WhatsApp / Free Survey bar (mobile).

The 3D illustrations are hand-built SVGs (light, ~33 KB total). Replace any of them with real product photos / renders later by keeping the same file names (PNG/WebP also fine – update the `src`).

## Lead form – how it works
On submit the form:
1. Validates name, 10-digit Indian mobile, service, property type and city.
2. Saves the lead to the **"Hydrant & Sprinkler Leads" Google Sheet** (`CONFIG.HYDRANT_SHEET_URL`) – one column per field, plus Status / Sales Owner / Follow-up columns for the sales team.
   While `HYDRANT_SHEET_URL` is empty, it falls back to the main website's script (`LEGACY_SHEET_URL`).
3. Fires the Meta Pixel **Lead** event and a GTM `generate_lead` event.
4. Shows a thank-you screen with a **"Send on WhatsApp"** button that opens WhatsApp to 77720 78610 with all details pre-filled.

UTM parameters and `fbclid` from the ad URL are captured automatically, so you can see which ad each lead came from.

### Set up the "Hydrant & Sprinkler Leads" Google Sheet (one time, ~5 min)
1. Go to **sheets.google.com** → Blank spreadsheet → name it **Hydrant & Sprinkler Leads** (put it in the shared company drive).
2. In the sheet: **Extensions → Apps Script**. Delete the sample code, paste all of `google-apps-script.gs`, click **Save** (💾).
3. Optional: set `NOTIFY_EMAIL` to get an email for each lead, then Save again.
4. **Deploy → New deployment →** ⚙ **Select type → Web app**.
   *Description:* Hydrant leads · *Execute as:* **Me** · *Who has access:* **Anyone** → **Deploy**.
5. **Authorize access** → pick your account → if Google warns "app isn't verified": **Advanced → Go to (project) → Allow**.
6. Copy the **Web app URL** (ends with `/exec`). Open it in a browser – it should say *"Hydrant leads endpoint is working"*.
7. Put the URL in `hydrant-sprinkler/index.html` → `HYDRANT_SHEET_URL: "…"` and deploy. The **Hydrant Leads** tab is created automatically with the first lead.

If you edit the script later: **Deploy → Manage deployments → ✏ Edit → Version: New version → Deploy** (keeps the same URL).

### Tracking
Google Tag Manager `GTM-KWG9BTJZ` (same container as the main site) is installed. The page pushes `generate_lead` (form submit) and `contact_click` (call / WhatsApp taps) to the dataLayer – add GTM triggers on these events for your Meta Pixel / Google Ads tags.

If the Meta Pixel is **not** already in GTM: in `<head>` of `hydrant-sprinkler/index.html`, find the `Meta Pixel` comment block, replace `YOUR_PIXEL_ID` (2 places) with your Pixel ID and remove the `<!--` / `-->` wrapper lines.
Events tracked: `PageView`, `Lead` (form submit), `Contact` (every call / WhatsApp click).

## Replacing photos
The current photos are free stock images from Unsplash (Unsplash License – free for commercial use, no attribution required). Replace them with your own project photos anytime: keep the same file name in `hydrant-sprinkler/assets/` (WebP or JPG, ~1200px wide).

| File | Used for |
|---|---|
| `img/hero-pipes.webp` | Hero background |
| `proof/team-van.webp` | Hero "Our own trained team" card (from www.thefirewala.in) |
| `img/ind-*.webp` | Industries we serve cards (Unsplash) |
| `3d/*.svg` | 3D-style part illustrations, technician and process icons |

Best replacements per brand guidelines: your red-polo technicians at a real pump room, hydrant valve / hose reel close-ups, sprinkler installation on site.

## Meta ad destination URL
`https://www.thefirewala.in/hydrant-sprinkler/?utm_source=facebook&utm_medium=paid&utm_campaign=hydrant_sprinkler&utm_content={{ad.name}}`
