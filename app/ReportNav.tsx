'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { createClient } from '../lib/supabase';

export default function ReportNav(){
  const pathname=usePathname();
  const [signedIn,setSignedIn]=useState(false);
  useEffect(()=>{
    const supabase=createClient();
    supabase.auth.getUser().then(({data}:any)=>setSignedIn(!!data.user));
    const {data:listener}=supabase.auth.onAuthStateChange((_event:any,session:any)=>setSignedIn(!!session?.user));
    return ()=>listener.subscription.unsubscribe();
  },[]);
  if(!signedIn || pathname==='/laporan' || pathname.startsWith('/pengguna')) return null;
  return <Link href="/laporan" style={{position:'fixed',right:22,bottom:22,zIndex:50,display:'flex',alignItems:'center',gap:8,padding:'12px 16px',borderRadius:14,background:'linear-gradient(135deg,#087d58,#0a9367)',color:'#fff',textDecoration:'none',fontWeight:800,boxShadow:'0 10px 28px rgba(8,125,88,.28)'}}><FileText size={18}/> Laporan PDF</Link>;
}
