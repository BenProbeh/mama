const BOOKINGS_KEY = 'kasenia:bookings';

function makeBookingEntry(data) {
  return {
    id: data.id || Date.now(),
    cuisine: data.cuisine,
    restaurant: data.restaurant,
    pickupTime: data.pickupTime,
    createdAt: data.createdAt || new Date().toISOString()
  };
}

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
    pickupTime: row.pickup_time || row.pickupTime,
    createdAt: row.created_at || row.createdAt
  };
}

async function saveBookingToSupabase(data) {
  const entry = makeBookingEntry(data);
  const res = await fetch(SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/bookings', {
    method: 'POST',
    headers: { ...supabaseHeaders(), Prefer: 'return=representation' },
    body: JSON.stringify({
      id: entry.id,
      cuisine: entry.cuisine,
      restaurant: entry.restaurant,
      pickup_time: entry.pickupTime,
      created_at: entry.createdAt
    })
  });

  if (!res.ok) {
    throw new Error('Supabase: ' + (await res.text()));
  }
  const rows = await res.json();
  return { ok: true, via: 'supabase', booking: rows.length ? rowToBooking(rows[0]) : entry };
}

async function loadBookingsFromSupabase() {
  const res = await fetch(
    SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/bookings?select=*&order=created_at.desc',
    { headers: supabaseHeaders() }
  );
  if (!res.ok) {
    throw new Error('Supabase: ' + (await res.text()));
  }
  const rows = await res.json();
  return rows.map(rowToBooking);
}

async function loadBookingsFromJsonBin() {
  const res = await fetch('https://api.jsonbin.io/v3/b/' + JSONBIN_BIN_ID + '/latest', {
    headers: { 'X-Master-Key': JSONBIN_API_KEY }
  });
  if (!res.ok) {
    throw new Error('JSONBin: ' + res.status);
  }
  const body = await res.json();
  const list = body.record;
  return Array.isArray(list) ? list.slice().reverse() : [];
}

async function saveBookingToJsonBin(data) {
  const entry = makeBookingEntry(data);
  let list = [];
  try {
    list = await loadBookingsFromJsonBin();
    list.reverse();
  } catch {
    list = [];
  }
  list.push(entry);

  const res = await fetch('https://api.jsonbin.io/v3/b/' + JSONBIN_BIN_ID, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY
    },
    body: JSON.stringify(list)
  });
  if (!res.ok) {
    throw new Error('JSONBin save: ' + res.status);
  }
  return { ok: true, via: 'jsonbin', booking: entry };
}

async function saveBookingToGoogle(data) {
  const entry = makeBookingEntry(data);
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(entry)
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error('Google: ' + text);
  }
  try {
    const parsed = JSON.parse(text);
    if (parsed.error) throw new Error(parsed.error);
  } catch (e) {
    if (e.message && e.message.indexOf('Google') === 0) throw e;
  }
  return { ok: true, via: 'google', booking: entry };
}

async function loadBookingsFromGoogle() {
  const url = GOOGLE_SCRIPT_URL + (GOOGLE_SCRIPT_URL.indexOf('?') > -1 ? '&' : '?') + 't=' + Date.now();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Google load: ' + res.status);
  }
  const list = await res.json();
  return Array.isArray(list) ? list : [];
}

async function upstashCommand(url, token, command, ...args) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([command, ...args])
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function saveBookingToUpstash(data) {
  const entry = makeBookingEntry(data);
  await upstashCommand(
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    'RPUSH',
    BOOKINGS_KEY,
    JSON.stringify(entry)
  );
  return { ok: true, via: 'upstash', booking: entry };
}

async function loadBookingsFromUpstash() {
  const result = await upstashCommand(
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    'LRANGE',
    BOOKINGS_KEY,
    0,
    -1
  );
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

async function saveViaApi(data) {
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
  const body = await response.json().catch(function () { return {}; });
  if (!response.ok) {
    throw new Error(body.error || 'API save failed');
  }
  return { ok: true, via: 'api', booking: body.booking };
}

async function loadViaApi() {
  const res = await fetch('/api/bookings');
  const data = await res.json().catch(function () { return []; });
  if (!res.ok) {
    throw new Error(data.error || 'API load failed');
  }
  return Array.isArray(data) ? data : [];
}

async function saveBookingToFormspree(data) {
  const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      cuisine: data.cuisine,
      restaurant: data.restaurant,
      pickupTime: data.pickupTime,
      createdAt: data.createdAt || new Date().toISOString(),
      _subject: 'דייט – ' + data.cuisine
    })
  });
  if (!res.ok) throw new Error('Formspree ' + res.status);
  return { ok: true, via: 'formspree' };
}

function isLiveSite() {
  var h = location.hostname || '';
  return h.indexOf('vercel.app') > -1 || h.indexOf('mama-') > -1;
}

async function saveBookingToCloud(data) {
  if (isSupabaseConfigured()) return saveBookingToSupabase(data);
  if (isJsonBinConfigured()) return saveBookingToJsonBin(data);
  if (isGoogleScriptConfigured()) return saveBookingToGoogle(data);
  if (isUpstashConfigured()) return saveBookingToUpstash(data);
  if (isFormspreeConfigured()) return saveBookingToFormspree(data);
  if (isLiveSite()) {
    try {
      return await saveViaApi(data);
    } catch (apiErr) {
      throw new Error(
        (apiErr.message || apiErr) + ' · פתח connect.html להגדרה'
      );
    }
  }
  return saveViaApi(data);
}

async function loadAllBookings() {
  if (
    isFormspreeConfigured() &&
    !isSupabaseConfigured() &&
    !isJsonBinConfigured() &&
    !isGoogleScriptConfigured() &&
    !isUpstashConfigured()
  ) {
    throw new Error('Formspree = מייל בלבד. השתמש ב-JSONBin (connect.html)');
  }
  if (isSupabaseConfigured()) return loadBookingsFromSupabase();
  if (isJsonBinConfigured()) return loadBookingsFromJsonBin();
  if (isGoogleScriptConfigured()) return loadBookingsFromGoogle();
  if (isUpstashConfigured()) return loadBookingsFromUpstash();
  if (isLiveSite()) {
    return loadViaApi();
  }
  if (!hasAnyStorage()) {
    return loadViaApi();
  }
  return loadViaApi();
}
