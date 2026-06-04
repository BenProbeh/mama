const { storageStatus, readBookings } = require('../lib/bookings-store');

module.exports = async function handler(_req, res) {
  const storage = storageStatus();

  try {
    const bookings = storage.ok ? await readBookings() : [];
    return res.status(200).json({
      ok: storage.ok,
      storage,
      bookingsCount: bookings.length
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      storage,
      error: String(err.message)
    });
  }
};
