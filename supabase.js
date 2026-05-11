// ─── SUPABASE.JS — file koneksi ke Supabase ──────────────────
// Kalau ganti project Supabase, edit 2 baris di bawah ini aja

const SUPABASE_URL  = 'https://hkhntwgurticesuwcmyz.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraG50d2d1cnRpY2VzdXdjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NzE1NjIsImV4cCI6MjA5NDA0NzU2Mn0.DSw0s6ik7ghdl947eEROgCQ00Qc6hA-h7sl3_RihcWc';

// Helper: fetch data dari tabel
async function dbGet(table, filter = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*${filter}&order=created_at.asc`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  });
  return res.json();
}

// Helper: insert data ke tabel
async function dbInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

// Helper: update data
async function dbUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

// Helper: delete data
async function dbDelete(table, id) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  });
}
