const { readBookings, storageStatus } = require('../lib/bookings-store');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const status = storageStatus();
  if (!status.ok) {
    return res.status(503).json({
      error: status.message,
      storage: status,
      bookings: []
    });
  }

  try {
    const bookings = await readBookings();
    return res.status(200).json(bookings);
  } catch (err) {
    console.error('bookings GET', err);
    return res.status(500).json({ error: 'שגיאה בטעינה', detail: String(err.message) });
  }
};
