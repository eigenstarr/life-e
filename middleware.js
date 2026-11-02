// Vercel Routing Middleware: every page and file needs a valid session, except the login page and its assets.
import { COOKIE, readCookie, validToken } from './lib/auth.js';

export const config = {
  matcher: ['/((?!login\\.html|api/login|icons/|manifest\\.webmanifest|favicon\\.ico).*)'],
};

export default async function middleware(request) {
  if (await validToken(readCookie(request.headers.get('cookie'), COOKIE))) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'Sign in first' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }
  return Response.redirect(new URL('/login.html', url), 302);
}
