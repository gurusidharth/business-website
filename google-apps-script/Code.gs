/**
 * Backend for the "Let's Talk" contact form on the One Solutions website.
 *
 * What it does when the form is submitted:
 *   1. Appends the enquiry as a new row in this spreadsheet.
 *   2. Emails a notification to NOTIFY_EMAIL.
 *
 * Setup (one-time):
 *   1. Create a new Google Sheet (sheets.google.com -> Blank spreadsheet).
 *   2. In the sheet, go to Extensions -> Apps Script.
 *   3. Delete the placeholder code and paste this entire file in.
 *   4. Change NOTIFY_EMAIL below to the email address that should receive enquiries.
 *   5. Click Deploy -> New deployment.
 *        - Type: "Web app"
 *        - Execute as: "Me"
 *        - Who has access: "Anyone"
 *   6. Click Deploy, then Authorize access (choose your Google account, click
 *      "Advanced" -> "Go to <project name> (unsafe)" -> Allow). This warning is
 *      normal for a script you wrote yourself.
 *   7. Copy the Web app URL it gives you (ends in /exec).
 *   8. Paste that URL into GOOGLE_SCRIPT_URL near the top of script.js on the
 *      website, replacing the PASTE_YOUR_... placeholder.
 *
 * If you ever change the form's fields, update the field list below to match.
 */

const NOTIFY_EMAIL = "siddarthmahi007@gmail.com"; // <-- change this to your real inbox
const SHEET_NAME = "Enquiries";

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Name", "Phone", "Country", "City", "Message"]);
  }

  const p = e.parameter;
  const name = p.name || "";
  const phone = ((p.countryCode || "") + " " + (p.phone || "")).trim();
  const country = p.country || "";
  const city = p.city || "";
  const message = p.message || "";
  const timestamp = new Date();

  sheet.appendRow([timestamp, name, phone, country, city, message]);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "New website enquiry from " + name,
    body:
      "New enquiry from the One Solutions website:\n\n" +
      "Name: " + name + "\n" +
      "Phone: " + phone + "\n" +
      "Country: " + country + "\n" +
      "City: " + city + "\n" +
      "Message: " + message + "\n\n" +
      "Received: " + timestamp
  });

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
