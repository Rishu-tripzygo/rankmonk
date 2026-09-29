/**
 * RankMonk website → Google Sheets.
 *
 * Paste this into the sheet's Extensions → Apps Script editor, set the SECRET
 * script property, and deploy as a web app (see README "Google Sheets setup").
 * The website POSTs { secret, sheet, row } and this appends one row to the tab
 * named `sheet`, creating the tab and header row on first use.
 */

var ALLOWED_SHEETS = ["Demo requests", "Newsletter"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || body.secret !== secret) return json_({ ok: false, error: "unauthorized" });
    if (ALLOWED_SHEETS.indexOf(body.sheet) === -1 || !body.row || typeof body.row !== "object") return json_({ ok: false, error: "bad request" });

    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(body.sheet) || ss.insertSheet(body.sheet);
    var keys = Object.keys(body.row);

    // Header row: create it, and append any new columns the website sends later.
    var headers = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
    keys.forEach(function (k) { if (headers.indexOf(k) === -1) headers.push(k); });
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sh.setFrozenRows(1);

    // Newsletter: skip emails that are already on the list.
    if (body.sheet === "Newsletter" && sh.getLastRow() > 1) {
      var col = headers.indexOf("Email") + 1;
      var existing = sh.getRange(2, col, sh.getLastRow() - 1, 1).getValues();
      var email = String(body.row["Email"] || "").toLowerCase();
      for (var i = 0; i < existing.length; i++) if (String(existing[i][0]).toLowerCase() === email) return json_({ ok: true, duplicate: true });
    }

    var values = headers.map(function (h) { return safe_(body.row[h]); });
    sh.appendRow(values);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "server error" });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

// Prevent formula injection: text starting with = + - @ is stored as plain text.
function safe_(v) {
  var s = v === undefined || v === null ? "" : String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
