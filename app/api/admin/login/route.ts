import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, SESSION_COOKIE_OPTIONS, createSessionToken } from '@/lib/admin-session';

export async function POST(request: NextRequest) {
  let body: { password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: 'Server chưa cấu hình ADMIN_PASSWORD' },
      { status: 500 }
    );
  }

  if (!body.password || body.password !== adminPassword) {
    return NextResponse.json({ error: 'Sai mật khẩu' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), SESSION_COOKIE_OPTIONS);
  return response;
}
