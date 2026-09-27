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
  return <Link href="/laporan" className="reportNav" aria-label="Buka Laporan PDF"><FileText size={18}/><span>Laporan PDF</span></Link>;
}
