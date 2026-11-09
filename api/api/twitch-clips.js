const CH = (process.env.TWITCH_CHANNEL || 'burnascs2').toLowerCase();
let tok = { v: null, exp: 0 };

async function token(id, secret) {
  if (tok.v && Date.now() < tok.exp) return tok.v;
  const r = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: id, client_secret: secret, grant_type: 'client_credentials' }),
  });
  if (!r.ok) throw new Error('Twitch token HTTP ' + r.status);
  const j = await r.json();
  tok = { v: j.access_token, exp: Date.now() + (j.expires_in - 600) * 1000 };
  return tok.v;
}

module.exports = async (req, res) => {
  try {
    const id = process.env.TWITCH_CLIENT_ID;
    const secret = process.env.TWITCH_CLIENT_SECRET;
    if (!id || !secret) throw new Error('TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET are not set');
    const h = { 'Client-Id': id, Authorization: 'Bearer ' + (await token(id, secret)) };
    const ur = await fetch('https://api.twitch.tv/helix/users?login=' + encodeURIComponent(CH), { headers: h });
    if (!ur.ok) throw new Error('Twitch users HTTP ' + ur.status);
    const user = ((await ur.json()).data || [])[0];
    if (!user) throw new Error('Twitch channel not found: ' + CH);
    const cr = await fetch('https://api.twitch.tv/helix/clips?broadcaster_id=' + user.id + '&first=30', { headers: h });
    if (!cr.ok) throw new Error('Twitch clips HTTP ' + cr.status);
    const clips = ((await cr.json()).data || []).map((c) => ({
      id: c.id, title: c.title, url: c.url, thumb: c.thumbnail_url,
      views: c.view_count, created: c.created_at, duration: c.duration,
    }));
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    res.status(200).json({ clips });
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
