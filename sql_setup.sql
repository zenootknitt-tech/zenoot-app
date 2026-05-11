-- ═══════════════════════════════════════════════
-- ZENOOT APP — SQL SETUP
-- Jalankan di Supabase → SQL Editor → New query
-- Copy semua, paste, klik Run
-- ═══════════════════════════════════════════════

-- 1. TABEL CHANNEL
create table if not exists channels (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  tipe text not null check (tipe in ('ops', 'toko')),
  created_at timestamp default now()
);

-- Data default channel
insert into channels (nama, tipe) values
  ('Zenoot', 'ops'),
  ('BL-CS', 'ops'),
  ('Zenoot', 'toko'),
  ('Toko B', 'toko');

-- ───────────────────────────────────────────────

-- 2. TABEL STOK PRODUK
create table if not exists stok (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references channels(id),
  sku_variasi text not null,
  katalog text,
  boss text,
  stok_masuk integer default 0,
  stok_keluar integer default 0,
  hpp integer default 0,
  created_at timestamp default now()
);

-- Data sample stok
insert into stok (sku_variasi, katalog, boss, stok_masuk, stok_keluar, hpp) values
  ('MAYRA_MAUVE',     'MAYRA',      'H Solah', 12, 9,  0),
  ('MAYRA_MARUN',     'MAYRA',      'H Solah', 12, 2,  0),
  ('MAYRA_KHAKI',     'MAYRA',      'H Solah', 12, 6,  0),
  ('LUNEA_MARUN',     'LUNEA',      'H Solah', 12, 11, 0),
  ('LAVINA_KREAM',    'LAVINA',     'G.CS',    12, 4,  0),
  ('TN_HITAM-L',      'TURTLENECK', 'Alan',    30, 16, 41000),
  ('TN_HITAM-M',      'TURTLENECK', 'Alan',    30, 18, 41000),
  ('YUNA_SOFT-YELLOW','YUNA POLO',  'H Solah', 12, 12, 0);

-- ───────────────────────────────────────────────

-- 3. TABEL HPP PRODUK
create table if not exists hpp (
  id uuid default gen_random_uuid() primary key,
  sku_induk text not null,
  nomor_referensi text,
  nama_variasi text,
  harga integer default 0,
  created_at timestamp default now()
);

-- Data sample HPP
insert into hpp (sku_induk, nomor_referensi, nama_variasi, harga) values
  ('Turtleneck', 'Turtleneck_HITAM-XL',    'Hitam,XL',          41000),
  ('Turtleneck', 'Turtleneck_MARUN-L',     'Maroon,L',          41000),
  ('Turtleneck', 'Turtleneck_NEVI-S',      'Nevi,S',            41000),
  ('Turtleneck', 'Turtleneck_HITAM-L',     'Hitam,L',           41000),
  ('Turtleneck', 'Turtleneck_PUTIH-M',     'Putih,M',           41000),
  ('Turtleneck', 'Turtleneck_Abu muda-XL', 'Abu Muda Misty,XL', 41000),
  ('TURTLENECK', 'Turtleneck_Hitam',       'Hitam,All Size',    41000),
  ('TURTLENECK', 'Turtleneck_Nevi',        'Nevy,All Size',     41000);

-- ───────────────────────────────────────────────

-- 4. TABEL KAS & JURNAL
create table if not exists jurnal (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references channels(id),
  tanggal date not null,
  keterangan text,
  debit bigint default 0,
  kredit bigint default 0,
  created_at timestamp default now()
);

-- Data sample jurnal
insert into jurnal (tanggal, keterangan, debit, kredit) values
  ('2026-05-10', 'Penghasilan Shopee Mar', 8908588, 0),
  ('2026-05-10', 'Operasional',            0, 4000000),
  ('2026-05-10', 'Iklan Shopee',           0, 1390424),
  ('2026-05-10', 'HPP (116 pcs)',          0, 4756000);

-- ───────────────────────────────────────────────

-- 5. AKTIFKAN ROW LEVEL SECURITY (RLS) — biar aman
alter table channels enable row level security;
alter table stok      enable row level security;
alter table hpp       enable row level security;
alter table jurnal    enable row level security;

-- Policy: allow read semua (public)
create policy "allow read" on channels for select using (true);
create policy "allow read" on stok      for select using (true);
create policy "allow read" on hpp       for select using (true);
create policy "allow read" on jurnal    for select using (true);

-- Policy: allow insert/update/delete semua (untuk sekarang)
create policy "allow write" on channels for all using (true);
create policy "allow write" on stok     for all using (true);
create policy "allow write" on hpp      for all using (true);
create policy "allow write" on jurnal   for all using (true);
