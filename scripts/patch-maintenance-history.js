const fs=require('fs');
const p='app/page.tsx';
let s=fs.readFileSync(p,'utf8');

// Pisahkan histori perawatan: jadwal aktif di atas, aktivitas selesai di bawah.
const oldFiltered="const filtered=cs.filter((c:any)=>(filterPlant==='all'||String(c.plantation_id)===filterPlant)&&(filterStatus==='all'||c.status===filterStatus));";
const newFiltered="const filtered=cs.filter((c:any)=>(filterPlant==='all'||String(c.plantation_id)===filterPlant)&&(filterStatus==='all'||c.status===filterStatus));const ongoing=filtered.filter((c:any)=>c.status==='scheduled').sort((a:any,b:any)=>a.scheduled_date.localeCompare(b.scheduled_date));const done=filtered.filter((c:any)=>c.status==='completed').sort((a:any,b:any)=>b.scheduled_date.localeCompare(a.scheduled_date));";
s=s.replace(oldFiltered,newFiltered);

const start='<div className="tableWrap"><table className="table"><thead><tr><th>Tanggal</th><th>Kebun</th><th>Kegiatan</th><th>Status</th><th>Keterangan</th><th>Aksi</th></tr></thead><tbody>{filtered.map((c:any)=>';
const startLegacy='<div className="tableWrap"><table className="table"><thead><tr><th>Tanggal</th><th>Kebun</th><th>Kegiatan</th><th>Status</th><th>Biaya</th><th>Keterangan</th><th>Aksi</th></tr></thead><tbody>{filtered.map((c:any)=>';
const row='<tr key={c.id}><td>{c.scheduled_date}</td><td><b>{ps.find((p:any)=>p.id===c.plantation_id)?.name||\'-\'}</b></td><td>{c.activity_type}</td><td><span className="pill">{c.status===\'scheduled\'?\'Dijadwalkan\':\'Selesai\'}</span></td><td>{c.notes||\'-\'}</td><td><div className="actionRow compact"><button className="btn secondary" onClick={()=>edit(c)}><Pencil size={15}/> Edit</button><button className="btn secondary" onClick={()=>toggle(c)}>{c.status===\'scheduled\'?\'Tandai Selesai\':\'Jadwalkan Lagi\'}</button>{role===\'owner\'&&<button className="btn danger" onClick={()=>remove(c)}><Trash2 size={15}/> Hapus</button>}</div></td></tr>';
const tail=')}{filtered.length===0&&<tr><td colSpan={6} className="muted">Belum ada data perawatan untuk filter ini.</td></tr>}</tbody></table></div>';
const replacement='<h3 style={{marginTop:24,marginBottom:8}}>Jadwal / Sedang Berjalan</h3><p className="muted" style={{marginTop:0}}>Diurutkan dari tanggal pengerjaan yang paling dekat.</p><div className="tableWrap"><table className="table"><thead><tr><th>Tanggal</th><th>Kebun</th><th>Kegiatan</th><th>Status</th><th>Keterangan</th><th>Aksi</th></tr></thead><tbody>{ongoing.map((c:any)=>'+row+')}{ongoing.length===0&&<tr><td colSpan={6} className="muted">Tidak ada jadwal yang sedang berjalan.</td></tr>}</tbody></table></div><h3 style={{marginTop:28,marginBottom:8}}>Riwayat Selesai</h3><p className="muted" style={{marginTop:0}}>Aktivitas yang telah selesai, terbaru ditampilkan lebih dahulu.</p><div className="tableWrap"><table className="table"><thead><tr><th>Tanggal</th><th>Kebun</th><th>Kegiatan</th><th>Status</th><th>Keterangan</th><th>Aksi</th></tr></thead><tbody>{done.map((c:any)=>'+row+')}{done.length===0&&<tr><td colSpan={6} className="muted">Belum ada aktivitas selesai.</td></tr>}</tbody></table></div>';

if(s.includes(start+row+tail)) s=s.replace(start+row+tail,replacement);
else {
  // Bentuk sumber sebelum patch penghapusan biaya dijalankan saat build.
  const legacyRow='<tr key={c.id}><td>{c.scheduled_date}</td><td><b>{ps.find((p:any)=>p.id===c.plantation_id)?.name||\'-\'}</b></td><td>{c.activity_type}</td><td><span className="pill">{c.status===\'scheduled\'?\'Dijadwalkan\':\'Selesai\'}</span></td><td>{money(c.cost)}</td><td>{c.notes||\'-\'}</td><td><div className="actionRow compact"><button className="btn secondary" onClick={()=>edit(c)}><Pencil size={15}/> Edit</button><button className="btn secondary" onClick={()=>toggle(c)}>{c.status===\'scheduled\'?\'Tandai Selesai\':\'Jadwalkan Lagi\'}</button>{role===\'owner\'&&<button className="btn danger" onClick={()=>remove(c)}><Trash2 size={15}/> Hapus</button>}</div></td></tr>';
  const legacyTail=')}{filtered.length===0&&<tr><td colSpan={7} className="muted">Belum ada data perawatan untuk filter ini.</td></tr>}</tbody></table></div>';
  const legacyReplacement=replacement.replaceAll('<th>Keterangan</th><th>Aksi</th>','<th>Biaya</th><th>Keterangan</th><th>Aksi</th>').replaceAll(row,legacyRow).replaceAll('colSpan={6}','colSpan={7}');
  s=s.replace(startLegacy+legacyRow+legacyTail,legacyReplacement);
}

fs.writeFileSync(p,s);
console.log('[patch-maintenance-history] Ongoing and completed maintenance separated.');
