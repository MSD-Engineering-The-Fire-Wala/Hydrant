# Fire Hydrant & Sprinkler – Landing Page

Landing page for **MSD Engineering – The Fire Wala** Meta (Facebook / Instagram) ad campaigns promoting **Fire Hydrant** and **Fire Sprinkler** system installation.

Single static page, no build step: open `index.html` in a browser, or upload the folder to any web host.

```
index.html               ← the whole page (HTML + CSS + JS)
assets/img/              ← photos (WebP), flame logo, favicon
google-apps-script.gs    ← paste into Google Apps Script to save leads to a Google Sheet
```

## Page sections
1. Sticky header – logo, both phone numbers, "Book Site Survey"
2. Hero – headline, key benefits, Call / WhatsApp buttons, **lead form**
3. Trust strip – 8+ years, 500+ projects, 50+ team, ISO 9001:2015, MSME/GeM, NBC/IS
4. Pain points – Fire NOC, insurance, non-working systems, new construction…
5. Service 01 – Fire Hydrant System (diagram, scope, tests, standards)
6. Service 02 – Fire Sprinkler System (diagram, myth vs reality, ESFR, hazard class)
7. Hydrant vs Sprinkler comparison
8. 6-step process
9. Industries (hospitals, hotels, warehouses, factories, high-rise, commercial)
10. Deliverables + Why The Fire Wala
11. Clients & certifications
12. FAQs
13. Final call-to-action with both numbers, footer
14. Mobile: sticky Call / WhatsApp / Get Quote bar. Desktop: floating WhatsApp button.

## Lead form – how it works
On submit the form:
1. Validates name, 10-digit Indian mobile, service, property type and city.
2. Sends the lead to your Google Sheet (once `CONFIG.SHEET_URL` is set).
3. Fires the Meta Pixel **Lead** event (once the Pixel is enabled).
4. Shows a thank-you screen with a **"Send on WhatsApp"** button that opens WhatsApp to 77720 78610 with all details pre-filled.

UTM parameters and `fbclid` from the ad URL are captured automatically, so you can see which ad each lead came from.

### Connect the form to Google Sheets
1. Create a new Google Sheet, e.g. "Hydrant & Sprinkler Leads".
2. **Extensions → Apps Script**, delete the sample code, paste all of `google-apps-script.gs`, click Save.
3. Optional: set `NOTIFY_EMAIL` to get an email for each lead.
4. **Deploy → New deployment →** select type **Web app** → *Execute as:* **Me**, *Who has access:* **Anyone** → Deploy → allow permissions.
5. Copy the **Web app URL** (ends with `/exec`).
6. In `index.html`, find `SHEET_URL: ""` near the bottom and paste the URL between the quotes.

### Enable Meta Pixel
In `<head>` of `index.html`, find the `Meta Pixel` comment block, replace `YOUR_PIXEL_ID` (2 places) with your Pixel ID and remove the `<!--` / `-->` wrapper lines.
Events tracked: `PageView`, `Lead` (form submit), `Contact` (every call / WhatsApp click).

## Replacing photos
The current photos are free stock images from Unsplash (Unsplash License – free for commercial use, no attribution required). Replace them with your own project photos anytime: keep the same file name in `assets/img/` (WebP or JPG, ~1200px wide).

| File | Used for |
|---|---|
| `hero-pipes.webp` | Hero background + deliverables panel (pump room / pipe header) |
| `install-crew.webp` | Hydrant section photo (installation team) |
| `ind-logistics.webp` | Sprinkler section photo (high-rack warehouse) |
| `ind-hospital.webp`, `ind-hotel.webp`, `ind-warehouse.webp`, `ind-factory.webp`, `ind-highrise.webp`, `site-team.webp` | Industry cards |

Best replacements per brand guidelines: your red-polo technicians at a real pump room, hydrant valve / hose reel close-ups, sprinkler installation on site.

## Publishing
Any static host works: Netlify / Vercel / GitHub Pages (drag-and-drop the folder) or your existing `thefirewala.com` hosting, e.g. `thefirewala.com/hydrant-sprinkler/`. Use that URL as the Meta ad destination.
