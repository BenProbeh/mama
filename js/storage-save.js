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
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(entry)
  });

  if (!res.ok) throw new Error(await res.text());
  return { ok: true, via: 'supabase' };
}

async function saveBookingToFormspree(data) {
  const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      cuisine: data.cuisine,
      restaurant: data.restaurant,
      pickupTime: data.pickupTime,
      createdAt: data.createdAt || new Date().toISOString(),
      _subject: 'דייט חדש – ' + data.cuisine + ' – ' + data.restaurant
    })
  });

  if (!res.ok) throw new Error('Formspree error');
  return { ok: true, via: 'formspree' };
}

async function saveBookingToGoogleScript(data) {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error(await res.text());
  return { ok: true, via: 'google' };
}

async function saveBookingToCloud(data) {
  if (isSupabaseConfigured()) {
    return saveBookingToSupabase(data);
  }
  if (isFormspreeConfigured()) {
    return saveBookingToFormspree(data);
  }
  if (isGoogleScriptConfigured()) {
    return saveBookingToGoogleScript(data);
  }

  const response = await fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cuisine: data.cuisine,
      restaurant: data.restaurant,
      pickupTime: data.pickupTime,
      createdAt: data.createdAt || new Date().toISOString()
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(function () { return {}; });
    throw new Error(err.error || 'אין שמירה מוגדרת');
  }
  return { ok: true, via: 'api' };
}

async function loadBookingsFromSupabase() {
  const base = SUPABASE_URL.replace(/\/$/, '');
  const res = await fetch(
    base + '/rest/v1/bookings?select=*&order=created_at.desc',
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY
      }
    }
  );

  if (!res.ok) throw new Error(await res.text());

  return (await res.json()).map(function (row) {
    return {
      id: row.id,
      cuisine: row.cuisine,
      restaurant: row.restaurant,
      pickupTime: row.pickup_time,
      createdAt: row.created_at
    };
  });
}

async function loadAllBookings() {
  if (isSupabaseConfigured()) {
    return loadBookingsFromSupabase();
  }
  throw new Error('טעינה לאדמין דורשת Supabase – Formspree שולח מייל על כל בחירה');
}
