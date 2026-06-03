const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'bookings.json');

app.use(express.json());
app.use(express.static(__dirname));

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function readBookings() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeBookings(bookings) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

app.post('/api/booking', (req, res) => {
  const { cuisine, restaurant, pickupTime, createdAt } = req.body;
  if (!cuisine || !restaurant || !pickupTime) {
    return res.status(400).json({ error: 'חסרים שדות חובה' });
  }

  const entry = {
    id: Date.now(),
    cuisine,
    restaurant,
    pickupTime,
    createdAt: createdAt || new Date().toISOString()
  };

  const bookings = readBookings();
  bookings.push(entry);
  writeBookings(bookings);

  res.json({ success: true, booking: entry });
});

app.get('/api/bookings', (_req, res) => {
  res.json(readBookings());
});

app.listen(PORT, () => {
  ensureDataFile();
  console.log(`השרת רץ: http://localhost:${PORT}`);
  console.log(`מעקב אחר הזמנות: http://localhost:${PORT}/admin.html`);
});
