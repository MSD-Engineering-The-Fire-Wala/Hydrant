/**
 * The Fire Wala – Hydrant & Sprinkler landing page → Google Sheets lead capture
 *
 * Setup (5 minutes) – see README.md for screenshots-free steps:
 * 1. Create a Google Sheet named "Hydrant & Sprinkler Leads".
 * 2. Extensions → Apps Script. Delete the sample code and paste this whole file.
 * 3. (Optional) Put your email in NOTIFY_EMAIL to get an email for every new lead.
 * 4. Deploy → New deployment → type "Web app".
 *      Execute as: Me      Who has access: Anyone
 * 5. Copy the Web app URL and paste it into index.html → CONFIG.SHEET_URL.
 */

const SHEET_NAME = 'Leads';
const NOTIFY_EMAIL = ''; // e.g. 'info@thefirewala.com' – leave empty to disable

const COLUMNS = [
  'timestamp', 'service', 'name', 'phone', 'property', 'city', 'stage', 'area', 'message',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid', 'page'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(COLUMNS.map(c => c.replace(/_/g, ' ').toUpperCase()));
      sheet.setFrozenRows(1);
    }
    const p = (e && e.parameter) || {};
    // Prefix with ' so Sheets keeps numbers as text and never evaluates formulas
    const row = COLUMNS.map(c => "'" + String(p[c] || '').slice(0, 1000));
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New ' + (p.service || 'Hydrant/Sprinkler') + ' lead – ' + (p.name || '') + ' (' + (p.city || '') + ')',
        body: COLUMNS.map(c => c + ': ' + (p[c] || '')).join('\n')
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
