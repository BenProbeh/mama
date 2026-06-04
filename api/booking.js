const { addBooking, storageStatus } = require('../lib/bookings-store');
const { parseBody } = require('../lib/parse-body');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const status = storageStatus();
  if (!status.ok) {
    return res.status(503).json({ error: status.message, storage: status });
  }

  const body = parseBody(req);
  const { cuisine, restaurant, pickupTime, createdAt } = body;

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

    return res.status(200).json({ success: true, booking: entry });
  } catch (err) {
    console.error('booking POST', err);
    return res.status(500).json({ error: 'שגיאה בשמירה', detail: String(err.message) });
  }
};
