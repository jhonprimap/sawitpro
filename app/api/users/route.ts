import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) return NextResponse.json({ error: 'Sesi login tidak ditemukan.' }, { status: 401 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !anonKey || !serviceKey) return NextResponse.json({ error: 'Konfigurasi server Supabase belum lengkap.' }, { status: 500 });

    const viewer = createClient(url, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
    const { data: userData, error: userError } = await viewer.auth.getUser(token);
    if (userError || !userData.user) return NextResponse.json({ error: 'Sesi tidak valid.' }, { status: 401 });

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: profile } = await admin.from('profiles').select('role').eq('id', userData.user.id).single();
    if (profile?.role !== 'owner') return NextResponse.json({ error: 'Hanya Owner yang dapat menambah pengguna.' }, { status: 403 });

    const body = await request.json();
    const fullName = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = ['owner','admin','mandor'].includes(body.role) ? body.role : 'mandor';
    if (!fullName || !email || password.length < 6) return NextResponse.json({ error: 'Nama dan email wajib diisi. Password minimal 6 karakter.' }, { status: 400 });

    const { data: created, error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: fullName } });
    if (createError || !created.user) return NextResponse.json({ error: createError?.message || 'Gagal membuat akun.' }, { status: 400 });

    const { error: profileError } = await admin.from('profiles').upsert({ id: created.user.id, full_name: fullName, role });
    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
