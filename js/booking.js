const BOOKING_KEY = 'kaseniaDateBooking';

function getBooking() {
  try {
    return JSON.parse(sessionStorage.getItem(BOOKING_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveBooking(partial) {
  const current = getBooking();
  const updated = { ...current, ...partial };
  sessionStorage.setItem(BOOKING_KEY, JSON.stringify(updated));
  return updated;
}

function saveRestaurant(cuisine, restaurantName) {
  return saveBooking({ cuisine, restaurant: restaurantName });
}

function savePickupTime(time) {
  return saveBooking({ pickupTime: time });
}

async function sendBookingToServer() {
  const data = getBooking();
  if (!data.cuisine || !data.restaurant || !data.pickupTime) {
    throw new Error('חסרים נתונים לשמירה');
  }

  const response = await fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cuisine: data.cuisine,
      restaurant: data.restaurant,
      pickupTime: data.pickupTime,
      createdAt: new Date().toISOString()
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(function () { return {}; });
    throw new Error(err.error || 'שגיאה בשמירה לשרת');
  }
  return response.json();
}
