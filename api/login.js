import { COOKIE, MAX_AGE, makeToken, passcodeMatches } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Use POST' }); }
  if (!process.env.APP_PASSCODE || !process.env.SESSION_SECRET) return res.status(500).json({ error: 'The passcode is not set up on the server' });
  const given = req.body && req.body.passcode;
  if (!passcodeMatches(given)) {
    await new Promise(r => setTimeout(r, 800)); // slow down guessing
    return res.status(401).json({ error: 'That passcode is not right' });
  }
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(await makeToken())}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`);
  return res.status(200).json({ ok: true });
}
