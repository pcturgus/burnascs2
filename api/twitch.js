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
    const r = await fetch('https://api.twitch.tv/helix/streams?user_login=' + encodeURIComponent(CH), { headers: h });
    if (!r.ok) throw new Error('Twitch streams HTTP ' + r.status);
    const st = ((await r.json()).data || [])[0];
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    res.status(200).json(
      st ? { live: true, viewers: st.viewer_count, title: st.title, game: st.game_name, startedAt: st.started_at } : { live: false }
    );
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
