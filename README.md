# SawitPro V1

Prototype web app manajemen kebun sawit berdasarkan spesifikasi: kebun dinamis, panen sederhana, biaya bongkar, biaya operasional, jadwal manual, role Owner/Admin/Mandor, laporan performa.

## Menjalankan
1. Install Node.js 20+.
2. `npm install`
3. `npm run dev`
4. Buka http://localhost:3000

Saat ini UI memakai data demo di browser agar langsung dapat dicoba. `supabase/schema.sql` sudah disertakan sebagai fondasi database produksi. Langkah produksi berikutnya adalah menghubungkan CRUD ke Supabase Auth/PostgreSQL, menambahkan RLS, validasi server-side, dan deployment.

## Rumus
- Pendapatan kotor = tonase kg × harga/kg
- Pendapatan bersih = pendapatan kotor − biaya bongkar
- Laba = pendapatan bersih − biaya operasional
- Ton/ha = tonase ton ÷ luas aktif

Tidak ada fitur blok, nomor tiket timbang, bruto/potongan kg, atau upload slip.
