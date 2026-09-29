const fs=require('fs');
const p='app/page.tsx';
let s=fs.readFileSync(p,'utf8');

// Perawatan hanya mencatat aktivitas. Semua biaya keuangan dicatat di Operasional.
s=s.replace(/\+fc\.reduce\(\(a:number,c:any\)=>a\+Number\(c\.cost\),0\)/g,'');
s=s.replace(/\+pc\.reduce\(\(a:number,c:any\)=>a\+Number\(c\.cost\),0\)/g,'');
s=s.replace(/cost:Number\(f\.cost\|\|0\)/g,'cost:0');
s=s.replace(/cost:Number\(cost\|\|0\)/g,'cost:0');
s=s.replace(/Catat kegiatan kebun dan biaya perawatannya\./g,'Catat dan jadwalkan kegiatan perawatan kebun.');

// Hapus field biaya pada form Perawatan (termasuk variasi label Biaya (Rp)).
s=s.replace('<F l="Biaya"><input type="number" value={f.cost} onChange={e=>setF({...f,cost:e.target.value})}/></F>','');
s=s.replace('<F l="Biaya"><input type="number" value={cost} onChange={e=>setCost(e.target.value)}/></F>','');
s=s.replace('<F l="Biaya (Rp)"><input type="number" min="0" value={f.cost} onChange={e=>setF({...f,cost:e.target.value})}/></F>','');

// Hapus kolom biaya pada histori Perawatan saja.
s=s.replace('<th>Biaya</th><th>Keterangan</th><th>Aksi</th>','<th>Keterangan</th><th>Aksi</th>');
s=s.replace('<td>{money(c.cost)}</td><td>{c.notes||\'-\'}</td>','<td>{c.notes||\'-\'}</td>');
s=s.replace('colSpan={7} className="muted">Belum ada data perawatan','colSpan={6} className="muted">Belum ada data perawatan');

// Jangan menghapus kartu JSX secara generik karena dapat menyisakan operator ternary yang invalid.
// Ubah kartu biaya menjadi Kebun Aktif agar grid tetap valid untuk semua role.
s=s.replace('<K t="Total Biaya Perawatan" v={money(totalCost)}/>','<K t="Kebun Aktif" v={active.length}/>');

fs.writeFileSync(p,s);
console.log('[patch-maintenance-cost] Safe maintenance patch applied.');
