const fs=require('fs');const p='app/page.tsx';let s=fs.readFileSync(p,'utf8');
// Kontrol adalah RIWAYAT aktivitas yang benar-benar selesai.
// Jadwal berstatus scheduled/dijadwalkan tetap muncul di kalender/jadwal, tetapi tidak dihitung sebagai aktivitas terlaksana.
s=s.replace("const completed=cs.filter((c:any)=>inPeriod(c.scheduled_date));","const completed=cs.filter((c:any)=>c.status==='completed'&&inPeriod(c.scheduled_date));");
s=s.replace("const completed=cs.filter((c:any)=>c.status==='selesai'&&inPeriod(c.scheduled_date));","const completed=cs.filter((c:any)=>(c.status==='completed'||c.status==='selesai')&&inPeriod(c.scheduled_date));");

// Samakan kategori Kontrol dengan pilihan Jenis Kegiatan di Perawatan.
const oldClassify="const classify=(v:string)=>{const x=(v||'').toLowerCase();if(x.includes('pupuk'))return'pupuk';if(x.includes('semprot')||x.includes('herbisida')||x.includes('racun'))return'semprot';if(x.includes('babat')||x.includes('bersih')||x.includes('piringan')||x.includes('gawangan'))return'bersih';return'lain'};";
const newClassify="const classify=(v:string)=>{const x=(v||'').trim().toLowerCase();if(x==='pemupukan')return'pupuk';if(x==='penyemprotan gulma')return'semprot';if(x==='pembersihan piringan')return'piringan';if(x==='pruning / tunas'||x==='pruning/tunas')return'pruning';if(x==='perawatan jalan')return'jalan';if(x==='pengendalian hama')return'hama';if(x==='panen')return'panenrawat';return'lain'};";
s=s.replace(oldClassify,newClassify);
s=s.replace("const classify=(v:string)=>{const x=(v||'').toLowerCase();if(x.includes('pupuk'))return'pupuk';if(x.includes('semprot')||x.includes('penyemprot')||x.includes('herbisida')||x.includes('racun')||x.includes('gulma'))return'semprot';if(x.includes('pruning')||x.includes('tunas')||x.includes('penunasan'))return'bersih';return'lain'};",newClassify);

s=s.replace("bersih:pc.filter((c:any)=>classify(c.activity_type)==='bersih').length,lain:pc.filter((c:any)=>classify(c.activity_type)==='lain').length", "piringan:pc.filter((c:any)=>classify(c.activity_type)==='piringan').length,pruning:pc.filter((c:any)=>classify(c.activity_type)==='pruning').length,jalan:pc.filter((c:any)=>classify(c.activity_type)==='jalan').length,hama:pc.filter((c:any)=>classify(c.activity_type)==='hama').length,panenrawat:pc.filter((c:any)=>classify(c.activity_type)==='panenrawat').length,lain:pc.filter((c:any)=>classify(c.activity_type)==='lain').length");

s=s.replace('<K t="Panen" v={total(\'panen\')+\'×\'}/><K t="Pemupukan" v={total(\'pupuk\')+\'×\'}/><K t="Penyemprotan" v={total(\'semprot\')+\'×\'}/><K t="Pruning / Tunas" v={total(\'bersih\')+\'×\'}/>', '<K t="Panen" v={(total(\'panen\')+total(\'panenrawat\'))+\'×\'}/><K t="Pemupukan" v={total(\'pupuk\')+\'×\'}/><K t="Penyemprotan Gulma" v={total(\'semprot\')+\'×\'}/><K t="Pruning / Tunas" v={total(\'pruning\')+\'×\'}/>');
s=s.replace('<K t="Panen" v={total(\'panen\')+\'×\'}/><K t="Pemupukan" v={total(\'pupuk\')+\'×\'}/><K t="Penyemprotan" v={total(\'semprot\')+\'×\'}/><K t="Babat / Pembersihan" v={total(\'bersih\')+\'×\'}/>', '<K t="Panen" v={(total(\'panen\')+total(\'panenrawat\'))+\'×\'}/><K t="Pemupukan" v={total(\'pupuk\')+\'×\'}/><K t="Penyemprotan Gulma" v={total(\'semprot\')+\'×\'}/><K t="Pruning / Tunas" v={total(\'pruning\')+\'×\'}/>');

s=s.replace('<th>Kebun</th><th>Panen</th><th>Pemupukan</th><th>Penyemprotan</th><th>Pruning / Tunas</th><th>Lainnya</th><th>Aktivitas Terakhir</th>', '<th>Kebun</th><th>Panen</th><th>Pemupukan</th><th>Penyemprotan Gulma</th><th>Pembersihan Piringan</th><th>Pruning / Tunas</th><th>Perawatan Jalan</th><th>Pengendalian Hama</th><th>Lainnya</th><th>Aktivitas Terakhir</th>');
s=s.replace('<th>Kebun</th><th>Panen</th><th>Pemupukan</th><th>Penyemprotan</th><th>Babat / Bersih</th><th>Lainnya</th><th>Aktivitas Terakhir</th>', '<th>Kebun</th><th>Panen</th><th>Pemupukan</th><th>Penyemprotan Gulma</th><th>Pembersihan Piringan</th><th>Pruning / Tunas</th><th>Perawatan Jalan</th><th>Pengendalian Hama</th><th>Lainnya</th><th>Aktivitas Terakhir</th>');
s=s.replace('<td><b>{r.panen}×</b></td><td>{r.pupuk}×</td><td>{r.semprot}×</td><td>{r.bersih}×</td><td>{r.lain}×</td>', '<td><b>{r.panen+r.panenrawat}×</b></td><td>{r.pupuk}×</td><td>{r.semprot}×</td><td>{r.piringan}×</td><td>{r.pruning}×</td><td>{r.jalan}×</td><td>{r.hama}×</td><td>{r.lain}×</td>');

fs.writeFileSync(p,s);
console.log('[patch-kontrol-activity] Only completed maintenance is counted in activity history.');
