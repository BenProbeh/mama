/**
 * Google Apps Script – הדבק ב-Google Sheet → Extensions → Apps Script
 * Deploy → New deployment → Web app → Anyone → העתק URL ל-js/storage-config.js
 */
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var bookings = [];

  if (data.length < 2) {
    return jsonOut(bookings);
  }

  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    bookings.push({
      id: data[i][0],
      cuisine: data[i][1],
      restaurant: data[i][2],
      pickupTime: data[i][3],
      createdAt: data[i][4]
    });
  }

  bookings.sort(function (a, b) {
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });

  return jsonOut(bookings);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id', 'cuisine', 'restaurant', 'pickupTime', 'createdAt']);
  }

  var body = JSON.parse(e.postData.contents);
  var entry = {
    id: body.id || Date.now(),
    cuisine: body.cuisine,
    restaurant: body.restaurant,
    pickupTime: body.pickupTime,
    createdAt: body.createdAt || new Date().toISOString()
  };

  sheet.appendRow([
    entry.id,
    entry.cuisine,
    entry.restaurant,
    entry.pickupTime,
    entry.createdAt
  ]);

  return jsonOut({ ok: true, booking: entry });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
