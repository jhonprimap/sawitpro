const fs=require('fs');const p='app/page.tsx';let s=fs.readFileSync(p,'utf8');
// Finance: maintenance is activity tracking only. All monetary costs belong in Operasional.
s=s.replace(/\+fc\.reduce\(\(a:number,c:any\)=>a\+Number\(c\.cost\),0\)/g,'');
s=s.replace(/\+pc\.reduce\(\(a:number,c:any\)=>a\+Number\(c\.cost\),0\)/g,'');
// Remove maintenance cost KPI/card.
s=s.replace(/<K t="Total Biaya Perawatan" v=\{money\([^}]+\)\}\/>/g,'');
// Remove cost inputs robustly, including input attributes in any order.
s=s.replace(/<F l="Biaya(?: \(Rp\))?">[\s\S]*?<\/F>/g,(m)=>m.includes('cost')?'' : m);
// New/edited maintenance records keep DB cost at zero for compatibility.
s=s.replace(/cost\s*:\s*Number\([^)]*cost[^)]*\)/g,'cost:0');
s=s.replace(/cost\s*:\s*Number\([^)]*f\.cost[^)]*\)/g,'cost:0');
// Remove cost column and cells from maintenance table.
s=s.replace(/<th>Biaya<\/th>/g,'');
s=s.replace(/<td>\{money\(c\.cost\)\}<\/td>/g,'');
// Update wording so Perawatan no longer suggests recording costs.
s=s.replace(/Catat kegiatan kebun dan biaya perawatannya\./g,'Catat dan jadwalkan kegiatan perawatan kebun.');
fs.writeFileSync(p,s);