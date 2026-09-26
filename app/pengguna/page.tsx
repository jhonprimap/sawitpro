'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, Users } from 'lucide-react';
import { createClient } from '../../lib/supabase';

type Role='owner'|'admin'|'mandor';
type Profile={id:string;full_name:string|null;role:Role;created_at:string};

export default function PenggunaPage(){
 const [supabase]=useState(()=>createClient());
 const [me,setMe]=useState<any>(null),[role,setRole]=useState<Role|null>(null),[profiles,setProfiles]=useState<Profile[]>([]),[loading,setLoading]=useState(true),[message,setMessage]=useState('');
 useEffect(()=>{load()},[]);
 async function load(){
  setLoading(true);setMessage('');
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){window.location.href='/';return}
  setMe(user);
  const {data:mine}=await supabase.from('profiles').select('role').eq('id',user.id).single();
  setRole(mine?.role||null);
  if(mine?.role!=='owner'){setLoading(false);return}
  const {data,error}=await supabase.from('profiles').select('id,full_name,role,created_at').order('created_at',{ascending:true});
  if(error)setMessage(error.message); else setProfiles(data||[]);
  setLoading(false);
 }
 async function changeRole(id:string,newRole:Role){
  if(id===me?.id&&newRole!=='owner')return alert('Role akun Owner yang sedang dipakai tidak dapat diturunkan dari halaman ini. Ini mencegah kamu kehilangan akses pengelolaan pengguna.');
  if(!confirm(`Ubah role pengguna menjadi ${newRole.toUpperCase()}?`))return;
  const {error}=await supabase.from('profiles').update({role:newRole}).eq('id',id);
  if(error)alert(error.message);else{setMessage('Role berhasil diperbarui.');await load()}
 }
 if(loading)return <div className="main"><div className="card">Memuat pengguna…</div></div>;
 if(role!=='owner')return <div className="main"><div className="card"><h2>Akses dibatasi</h2><p>Halaman Manajemen Pengguna hanya dapat dibuka oleh Owner.</p><a className="btn" href="/"><ArrowLeft size={16}/> Kembali ke SawitPro</a></div></div>;
 return <main className="main" style={{maxWidth:1100,margin:'0 auto'}}><div className="top"><div><h1 style={{margin:0}}>Manajemen Pengguna</h1><div className="muted">Khusus Owner • atur hak akses SawitPro</div></div><a className="btn secondary" href="/"><ArrowLeft size={16}/> Dashboard</a></div><div className="grid4" style={{marginTop:20}}><div className="card kpi"><small>Total Pengguna</small><strong>{profiles.length}</strong></div><div className="card kpi"><small>Owner</small><strong>{profiles.filter(p=>p.role==='owner').length}</strong></div><div className="card kpi"><small>Admin</small><strong>{profiles.filter(p=>p.role==='admin').length}</strong></div><div className="card kpi"><small>Mandor</small><strong>{profiles.filter(p=>p.role==='mandor').length}</strong></div></div><div className="card" style={{marginTop:16}}><div className="editorHead"><div><h3 style={{marginBottom:4}}><Users size={19} style={{verticalAlign:'middle',marginRight:8}}/>Daftar Pengguna</h3><small className="muted">Akun baru otomatis mendapat role Mandor. Owner dapat mengubahnya menjadi Admin atau Owner.</small></div></div>{message&&<div className="alert"><ShieldCheck size={16} style={{verticalAlign:'middle',marginRight:6}}/>{message}</div>}<div className="tableWrap"><table className="table"><thead><tr><th>Nama</th><th>Role Saat Ini</th><th>Ubah Hak Akses</th><th>ID Pengguna</th></tr></thead><tbody>{profiles.map(p=><tr key={p.id}><td><b>{p.full_name||'Tanpa nama'}</b>{p.id===me?.id&&<><br/><small className="muted">Akun kamu</small></>}</td><td><span className="pill">{p.role.toUpperCase()}</span></td><td><select value={p.role} onChange={e=>changeRole(p.id,e.target.value as Role)} disabled={p.id===me?.id}><option value="owner">Owner</option><option value="admin">Admin</option><option value="mandor">Mandor</option></select></td><td><small className="muted">{p.id.slice(0,8)}…</small></td></tr>)}{profiles.length===0&&<tr><td colSpan={4}>Belum ada pengguna.</td></tr>}</tbody></table></div><div className="alert" style={{marginTop:16}}><b>Hak akses:</b> Owner mengelola seluruh aplikasi dan role pengguna. Admin mengelola data operasional tetapi tidak dapat mengatur role. Mandor difokuskan untuk input lapangan dan tidak melihat keseluruhan data keuangan.</div></div></main>
}
