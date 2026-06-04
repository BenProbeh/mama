/**
 * שמירה וקריאה ישירות מ-Supabase – עובד ממובייל ו-Vercel
 */

function supabaseHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  };
}

function rowToBooking(row) {
  return {
    id: row.id,
    cuisine: row.cuisine,
    restaurant: row.restaurant,
    pickupTime: row.pickup_time,
    createdAt: row.created_at
  };
}

async function saveBookingToSupabase(data) {
  const base = SUPABASE_URL.replace(/\/$/, '');
  const entry = {
    id: Date.now(),
    cuisine: data.cuisine,
    restaurant: data.restaurant,
    pickup_time: data.pickupTime,
    created_at: data.createdAt || new Date().toISOString()
  };

  const res = await fetch(base + '/rest/v1/bookings', {
    method: 'POST',
    headers: {
      ...supabaseHeaders(),
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(entry)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'שגיאת שמירה ב-Supabase');
  }

  return {
    id: entry.id,
    cuisine: entry.cuisine,
    restaurant: entry.restaurant,
    pickupTime: entry.pickup_time,
    createdAt: entry.created_at
  };
}

async function loadBookingsFromSupabase() {
  const base = SUPABASE_URL.replace(/\/$/, '');
  const res = await fetch(
    base + '/rest/v1/bookings?select=*&order=created_at.desc',
    { headers: supabaseHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'שגיאת טעינה מ-Supabase');
  }

  const rows = await res.json();
  return rows.map(rowToBooking);
}
