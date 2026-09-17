import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12 giờ

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('Thiếu biến môi trường ADMIN_SESSION_SECRET');
  }
  return secret;
}

// Tạo token phiên: "<expiryTimestamp>.<hmacSignature>"
// Không chứa mật khẩu, chỉ chứa thời điểm hết hạn được ký để chống giả mạo.
export function createSessionToken(): string {
  const expiry = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(String(expiry))
    .digest('hex');
  return `${expiry}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const [expiryStr, signature] = token.split('.');
  if (!expiryStr || !signature) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const expectedSignature = crypto
    .createHmac('sha256', getSecret())
    .update(expiryStr)
    .digest('hex');

  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
