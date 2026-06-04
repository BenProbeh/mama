const express = require('express');
const path = require('path');
const { readBookings, addBooking } = require('./lib/bookings-store');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/booking', async (req, res) => {
  const { cuisine, restaurant, pickupTime, createdAt } = req.body;
  if (!cuisine || !restaurant || !pickupTime) {
    return res.status(400).json({ error: 'חסרים שדות חובה' });
  }

  try {
    const entry = await addBooking({
      id: Date.now(),
      cuisine,
      restaurant,
      pickupTime,
      createdAt: createdAt || new Date().toISOString()
    });
    res.json({ success: true, booking: entry });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשמירה' });
  }
});

app.get('/api/bookings', async (_req, res) => {
  try {
    res.json(await readBookings());
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בטעינה' });
  }
});

app.listen(PORT, () => {
  console.log(`השרת רץ: http://localhost:${PORT}`);
  console.log(`מעקב: http://localhost:${PORT}/admin.html`);
});
