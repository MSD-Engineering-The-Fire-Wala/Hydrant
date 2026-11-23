/**
 * The Fire Wala – Hydrant & Sprinkler landing page → Google Sheet
 *
 * SETUP (one time, ~5 minutes) – full steps in README.md:
 * 1. Create a new Google Sheet: "Hydrant & Sprinkler Leads".
 * 2. In that sheet: Extensions → Apps Script. Delete everything, paste this whole file, Save.
 * 3. (Optional) Put an email in NOTIFY_EMAIL below to get an email for every new lead.
 * 4. Deploy → New deployment → ⚙ Select type → Web app
 *      Description: Hydrant leads   Execute as: Me   Who has access: Anyone
 *    → Deploy → Authorize access → choose your account → Advanced → Go to project → Allow.
 * 5. Copy the "Web app URL" (ends with /exec) and send it to the developer.
 *
 * Check it works: open the Web app URL in a browser – it should say "Hydrant leads endpoint is working".
 */

const SHEET_NAME = 'Hydrant Leads';
const NOTIFY_EMAIL = ''; // e.g. 'info@thefirewala.com' – leave empty for no emails

// [column header, key sent by the landing page]
const COLUMNS = [
  ['Timestamp (IST)', 'timestamp'],
  ['Name', 'name'],
  ['Phone', 'phone'],
  ['Service', 'service'],
  ['Property Type', 'property'],
  ['City / Location', 'city'],
  ['Project Stage', 'stage'],
  ['Built-up Area', 'area'],
  ['Message', 'message'],
  ['Status', null],          // filled with "NEW" – sales team updates it
  ['Sales Owner', null],
  ['Follow-up Remarks', null],
  ['UTM Source', 'utm_source'],
  ['UTM Medium', 'utm_medium'],
  ['UTM Campaign', 'utm_campaign'],
  ['UTM Content (Ad)', 'utm_content'],
  ['fbclid', 'fbclid'],
  ['Page URL', 'page']
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = parseBody_(e);
    if (data.website) return json_({ ok: true }); // honeypot – ignore bots
    if (!data.name || !/^[6-9]\d{9}$/.test(String(data.phone || ''))) {
      return json_({ ok: false, error: 'invalid' });
    }

    const sheet = getSheet_();
    const row = COLUMNS.map(([header, key]) => {
      if (header === 'Status') return 'NEW';
      if (!key) return '';
      return safe_(data[key]);
    });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New ' + (data.service || 'Hydrant/Sprinkler') + ' lead – ' + data.name + ' (' + (data.city || '') + ')',
        body: COLUMNS.filter(c => c[1]).map(([h, k]) => h + ': ' + (data[k] || '')).join('\n')
      });
    }
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Opening the Web app URL in a browser shows this – handy to check the deployment.
function doGet() {
  return ContentService.createTextOutput('Hydrant leads endpoint is working');
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) { /* fall through */ }
  }
  return (e && e.parameter) || {};
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
    sheet.appendRow(COLUMNS.map(c => c[0]));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length)
      .setFontWeight('bold').setBackground('#004890').setFontColor('#ffffff');
    sheet.setColumnWidths(1, COLUMNS.length, 150);
  }
  return sheet;
}

// Keep numbers like phone as text and stop formula injection (=, +, -, @).
function safe_(v) {
  const s = String(v == null ? '' : v).slice(0, 1000);
  if (s === '') return '';
  return /^[=+\-@0-9]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
