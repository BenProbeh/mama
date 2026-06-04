const BOOKINGS_KEY = 'kasenia:bookings';

async function upstashCommand(command, ...args) {
  const res = await fetch(UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + UPSTASH_REDIS_REST_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([command, ...args])
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Upstash: ' + text);
  }

  return res.json();
}

async function saveBookingToUpstash(data) {
  const entry = {
    id: Date.now(),
    cuisine: data.cuisine,
    restaurant: data.restaurant,
    pickupTime: data.pickupTime,
    createdAt: data.createdAt || new Date().toISOString()
  };

  await upstashCommand('RPUSH', BOOKINGS_KEY, JSON.stringify(entry));
  return { ok: true, via: 'upstash', booking: entry };
}

async function loadBookingsFromUpstash() {
  const result = await upstashCommand('LRANGE', BOOKINGS_KEY, 0, -1);
  const list = result.result || [];

  return list
    .map(function (item) {
      try {
        return typeof item === 'string' ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .reverse();
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

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Formspree ID is wrong – use real ID from formspree.io');
    }
    throw new Error('Formspree error ' + res.status);
  }
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
  if (isUpstashConfigured()) {
    return saveBookingToUpstash(data);
  }
  if (isFormspreeConfigured()) {
    return saveBookingToFormspree(data);
  }
  if (isSupabaseConfigured()) {
    return saveBookingToSupabase(data);
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
    throw new Error(err.error || 'No storage configured – see SETUP-UPSTASH.md');
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
  if (isUpstashConfigured()) {
    return loadBookingsFromUpstash();
  }
  if (isSupabaseConfigured()) {
    return loadBookingsFromSupabase();
  }
  throw new Error('Admin table needs Upstash or Supabase – see SETUP-UPSTASH.md');
}
