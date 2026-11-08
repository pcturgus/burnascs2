const STEAM64 = process.env.STEAM64_ID || '76561197970987115';
const KNOWN_PEAK = Number(process.env.PREMIER_PEAK || 26958);

module.exports = async (req, res) => {
  try {
    const headers = { Accept: 'application/json' };
    if (process.env.LEETIFY_API_KEY) headers._leetify_key = process.env.LEETIFY_API_KEY;
    const url = 'https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=' + encodeURIComponent(STEAM64);
    let r = await fetch(url, { headers });
    if (!r.ok) { await new Promise((ok) => setTimeout(ok, 800)); r = await fetch(url, { headers }); }
    if (!r.ok) throw new Error('Leetify responded with HTTP ' + r.status);
    const d = await r.json();
    const pr = (d.recent_matches || []).filter((m) => m.rank_type === 11 && typeof m.rank === 'number').map((m) => m.rank);
    const peak = Math.max(KNOWN_PEAK, (d.ranks && d.ranks.premier) || 0, ...pr);
    const s = d.stats || {};
    const out = {
      fetchedAt: new Date().toISOString(),
      winrate: d.winrate,
      total_matches: d.total_matches,
      ranks: { leetify: d.ranks && d.ranks.leetify, premier: d.ranks && d.ranks.premier, faceit: d.ranks && d.ranks.faceit, faceit_elo: d.ranks && d.ranks.faceit_elo },
      premier_peak: peak,
      rating: { aim: d.rating && d.rating.aim, positioning: d.rating && d.rating.positioning, utility: d.rating && d.rating.utility },
      recent_matches: (d.recent_matches || []).slice(0, 100).map((m) => ({ t: m.finished_at, o: m.outcome, r: m.rank, rt: m.rank_type, m: m.map_name, s: m.score, l: m.leetify_rating })),
      stats: {
        reaction_time_ms: s.reaction_time_ms, preaim: s.preaim, accuracy_enemy_spotted: s.accuracy_enemy_spotted, accuracy_head: s.accuracy_head,
        spray_accuracy: s.spray_accuracy, counter_strafing_good_shots_ratio: s.counter_strafing_good_shots_ratio,
        ct_opening_duel_success_percentage: s.ct_opening_duel_success_percentage, t_opening_duel_success_percentage: s.t_opening_duel_success_percentage,
      },
    };
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
    res.status(200).json(out);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
