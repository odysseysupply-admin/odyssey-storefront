import { createCookie } from '@remix-run/node';

let secret = process.env.COOKIE_SECRET || 'default';
if (secret === 'default') {
  console.warn('No COOKIE_SECRET Set. The App is insecure.');
  secret = 'default_secret';
}

export const medusa_cookie = createCookie('medusa', {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secrets: [secret],
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 30,
});
