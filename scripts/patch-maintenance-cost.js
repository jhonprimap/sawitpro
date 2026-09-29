const fs=require('fs');
const p='app/page.tsx';
let s=fs.readFileSync(p,'utf8');

// Perawatan hanya mencatat aktivitas. Semua biaya keuangan dicatat di Operasional.
// Patch dibuat sempit agar tidak menghapus blok JSX lain saat Vercel build.
s=s.replace(/\+fc\.reduce\(\(a:number,c:any\)=>a\+Number\(c\.cost\),0\)/g,'');
s=s.replace(/\+pc\.reduce\(\(a:number,c:any\)=>a\+Number\(c\.cost\),0\)/g,'');
s=s.replace(/cost:Number\(f\.cost\|\|0\)/g,'cost:0');
s=s.replace(/cost:Number\(cost\|\|0\)/g,'cost:0');
s=s.replace(/Catat kegiatan kebun dan biaya perawatannya\./g,'Catat dan jadwalkan kegiatan perawatan kebun.');

// Hapus elemen biaya hanya pada bentuk JSX yang diketahui, tanpa regex lintas blok.
s=s.replace('<F l="Biaya"><input type="number" value={f.cost} onChange={e=>setF({...f,cost:e.target.value})}/></F>','');
s=s.replace('<F l="Biaya"><input type="number" value={cost} onChange={e=>setCost(e.target.value)}/></F>','');
s=s.replace('<th>Biaya</th>','');
s=s.replace('<td>{money(c.cost)}</td>','');
s=s.replace(/<K t="Total Biaya Perawatan" v=\{money\([^}]+\)\}\/>/g,'');

fs.writeFileSync(p,s);
console.log('[patch-maintenance-cost] Safe maintenance patch applied.');
