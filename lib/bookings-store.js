const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');
const STORE_KEY = 'bookings';
const BLOB_PATH = 'bookings/data.json';

function useSupabase() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
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
    pickupTime: row.pickup_time,
    createdAt: row.created_at
  };
}

async function readFromSupabase() {
  const base = process.env.SUPABASE_URL.replace(/\/$/, '');
  const res = await fetch(
    base + '/rest/v1/bookings?select=*&order=created_at.desc',
    { headers: supabaseHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Supabase read: ' + text);
  }

  const rows = await res.json();
  return rows.map(rowToBooking);
}

async function addToSupabase(entry) {
  const base = process.env.SUPABASE_URL.replace(/\/$/, '');
  const res = await fetch(base + '/rest/v1/bookings', {
    method: 'POST',
    headers: {
      ...supabaseHeaders(),
      Prefer: 'return=representation'
    },
    body: JSON.stringify({
      id: entry.id,
      cuisine: entry.cuisine,
      restaurant: entry.restaurant,
      pickup_time: entry.pickupTime,
      created_at: entry.createdAt
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Supabase write: ' + text);
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
  if (useRedis()) return readFromRedis();
  if (useBlob()) return readFromBlob();
  return readBookingsLocal();
}

async function writeBookings(bookings) {
  if (useSupabase()) {
    throw new Error('Supabase uses row insert only');
  }
  if (useRedis()) return writeToRedis(bookings);
  if (useBlob()) return writeToBlob(bookings);
  writeBookingsLocal(bookings);
}

async function addBooking(entry) {
  if (useSupabase()) {
    return addToSupabase(entry);
  }

  const bookings = await readBookings();
  bookings.push(entry);
  await writeBookings(bookings);
  return entry;
}

function storageStatus() {
  if (useSupabase()) {
    return { ok: true, type: 'supabase' };
  }
  if (useRedis()) {
    return {
      ok: true,
      type: process.env.UPSTASH_REDIS_REST_URL ? 'upstash' : 'kv'
    };
  }
  if (useBlob()) {
    return { ok: true, type: 'blob' };
  }
  if (process.env.VERCEL) {
    return {
      ok: false,
      type: 'none',
      message:
        'חסרה שמירה! הוסף Supabase (מומלץ) – ראה SETUP-SUPABASE.md בפרויקט'
    };
  }
  return { ok: true, type: 'file' };
}

module.exports = {
  readBookings,
  addBooking,
  storageStatus
};
