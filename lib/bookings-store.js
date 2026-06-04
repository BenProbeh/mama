const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');
const STORE_KEY = 'bookings';
const BLOB_PATH = 'bookings/data.json';

function useSupabase() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

function useJsonBin() {
  return !!(process.env.JSONBIN_BIN_ID && process.env.JSONBIN_API_KEY);
}

function useGoogleScript() {
  return !!(
    process.env.GOOGLE_SCRIPT_URL &&
    process.env.GOOGLE_SCRIPT_URL.indexOf('script.google.com') > -1
  );
}

function useRedis() {
  return !!(
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );
}

function useBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function jsonBinHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Master-Key': process.env.JSONBIN_API_KEY
  };
}

async function readFromJsonBin() {
  const res = await fetch(
    'https://api.jsonbin.io/v3/b/' + process.env.JSONBIN_BIN_ID + '/latest',
    { headers: jsonBinHeaders() }
  );
  if (!res.ok) {
    throw new Error('JSONBin read: ' + res.status);
  }
  const body = await res.json();
  const list = body.record;
  return Array.isArray(list) ? list : [];
}

async function writeToJsonBin(bookings) {
  const res = await fetch('https://api.jsonbin.io/v3/b/' + process.env.JSONBIN_BIN_ID, {
    method: 'PUT',
    headers: jsonBinHeaders(),
    body: JSON.stringify(bookings)
  });
  if (!res.ok) {
    throw new Error('JSONBin write: ' + res.status);
  }
}

async function readFromGoogle() {
  const url =
    process.env.GOOGLE_SCRIPT_URL +
    (process.env.GOOGLE_SCRIPT_URL.indexOf('?') > -1 ? '&' : '?') +
    't=' +
    Date.now();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Google read: ' + res.status);
  }
  const list = await res.json();
  return Array.isArray(list) ? list : [];
}

async function addToGoogle(entry) {
  const res = await fetch(process.env.GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(entry)
  });
  if (!res.ok) {
    throw new Error('Google write: ' + (await res.text()));
  }
  return entry;
}

function supabaseHeaders() {
  const key = process.env.SUPABASE_ANON_KEY;
  return {
    apikey: key,
    Authorization: 'Bearer ' + key,
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

async function readFromSupabase() {
  const base = process.env.SUPABASE_URL.replace(/\/$/, '');
  const res = await fetch(
    base + '/rest/v1/bookings?select=*&order=created_at.desc',
    { headers: supabaseHeaders() }
  );

  if (!res.ok) {
    throw new Error('Supabase read: ' + (await res.text()));
  }

  const rows = await res.json();
  return rows.map(rowToBooking);
}

async function addToSupabase(entry) {
  const base = process.env.SUPABASE_URL.replace(/\/$/, '');
  const res = await fetch(base + '/rest/v1/bookings', {
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
    throw new Error('Supabase write: ' + (await res.text()));
  }

  const rows = await res.json();
  return rows.length ? rowToBooking(rows[0]) : entry;
}

function readBookingsLocal() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error('readBookingsLocal', err);
  }
  return [];
}

function writeBookingsLocal(bookings) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

async function readFromRedis() {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const { Redis } = require('@upstash/redis');
    const redis = Redis.fromEnv();
    const data = await redis.get(STORE_KEY);
    return Array.isArray(data) ? data : [];
  }

  const { kv } = require('@vercel/kv');
  const data = await kv.get(STORE_KEY);
  return Array.isArray(data) ? data : [];
}

async function writeToRedis(bookings) {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const { Redis } = require('@upstash/redis');
    const redis = Redis.fromEnv();
    await redis.set(STORE_KEY, bookings);
    return;
  }

  const { kv } = require('@vercel/kv');
  await kv.set(STORE_KEY, bookings);
}

async function readFromBlob() {
  const { list } = require('@vercel/blob');
  const { blobs } = await list({ prefix: BLOB_PATH });

  if (!blobs.length) return [];

  const res = await fetch(blobs[0].url);
  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function writeToBlob(bookings) {
  const { put } = require('@vercel/blob');
  await put(BLOB_PATH, JSON.stringify(bookings), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}

async function readBookings() {
  if (useSupabase()) return readFromSupabase();
  if (useJsonBin()) return readFromJsonBin();
  if (useGoogleScript()) return readFromGoogle();
  if (useRedis()) return readFromRedis();
  if (useBlob()) return readFromBlob();
  return readBookingsLocal();
}

async function writeBookings(bookings) {
  if (useSupabase()) {
    throw new Error('Supabase uses row insert only');
  }
  if (useJsonBin()) return writeToJsonBin(bookings);
  if (useRedis()) return writeToRedis(bookings);
  if (useBlob()) return writeToBlob(bookings);
  writeBookingsLocal(bookings);
}

async function addBooking(entry) {
  if (useSupabase()) return addToSupabase(entry);
  if (useGoogleScript()) return addToGoogle(entry);

  const bookings = await readBookings();
  bookings.push(entry);
  await writeBookings(bookings);
  return entry;
}

function storageStatus() {
  if (useSupabase()) return { ok: true, type: 'supabase' };
  if (useJsonBin()) return { ok: true, type: 'jsonbin' };
  if (useGoogleScript()) return { ok: true, type: 'google' };
  if (useRedis()) {
    return {
      ok: true,
      type: process.env.UPSTASH_REDIS_REST_URL ? 'upstash' : 'kv'
    };
  }
  if (useBlob()) return { ok: true, type: 'blob' };
  if (process.env.VERCEL) {
    return {
      ok: false,
      type: 'none',
      message:
        'הוסף ב-Vercel: Settings → Environment Variables → JSONBIN_BIN_ID + JSONBIN_API_KEY (ראה connect.html)'
    };
  }
  return { ok: true, type: 'file' };
}

module.exports = {
  readBookings,
  addBooking,
  storageStatus
};
