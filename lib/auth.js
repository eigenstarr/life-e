// Signed session cookie shared by the middleware (edge) and the API functions (node).
// Token: "<expiry ms>.<base64url HMAC-SHA256>". Changing APP_PASSCODE or SESSION_SECRET signs everyone out.
export const COOKIE = 'life_session';
export const MAX_AGE = 60 * 60 * 24 * 365; // one year, in seconds

const enc = new TextEncoder();
const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function key() {
  const secret = `${process.env.SESSION_SECRET || ''}|${process.env.APP_PASSCODE || ''}`;
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}
async function sign(text) { return b64url(await crypto.subtle.sign('HMAC', await key(), enc.encode(text))); }

function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function makeToken() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${await sign(exp)}`;
}

export async function validToken(token) {
  if (!token || !process.env.APP_PASSCODE || !process.env.SESSION_SECRET) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return same(sig, await sign(exp));
}

export function readCookie(header, name = COOKIE) {
  const m = (header || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : '';
}

export function passcodeMatches(given) {
  const real = process.env.APP_PASSCODE || '';
  return !!real && typeof given === 'string' && same(given.trim(), real);
}
