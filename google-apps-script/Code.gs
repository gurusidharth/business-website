/**
 * Backend for the "Let's Talk" contact form on the One Solutions website.
 *
 * What it does when the form is submitted:
 *   Emails the enquiry to NOTIFY_EMAIL.
 *
 * Setup (one-time):
 *   1. Go to script.google.com -> New project (or reuse an existing one).
 *   2. Delete the placeholder code and paste this entire file in.
 *   3. Change NOTIFY_EMAIL below to the email address that should receive enquiries.
 *   4. Click Deploy -> New deployment.
 *        - Type: "Web app"
 *        - Execute as: "Me"
 *        - Who has access: "Anyone"
 *   5. Click Deploy, then Authorize access (choose your Google account, click
 *      "Advanced" -> "Go to <project name> (unsafe)" -> Allow). This warning is
 *      normal for a script you wrote yourself.
 *   6. Copy the Web app URL it gives you (ends in /exec).
 *   7. Paste that URL into GOOGLE_SCRIPT_URL near the top of script.js on the
 *      website, replacing the PASTE_YOUR_... placeholder.
 *
 * If you ever change the form's fields, update the field list below to match.
 */

const NOTIFY_EMAIL = "siddarthmahi007@gmail.com"; // <-- change this to your real inbox

function doPost(e) {
  const p = e.parameter;
  const name = p.name || "";
  const phone = ((p.countryCode || "") + " " + (p.phone || "")).trim();
  const country = p.country || "";
  const city = p.city || "";
  const message = p.message || "";
  const timestamp = new Date();

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
