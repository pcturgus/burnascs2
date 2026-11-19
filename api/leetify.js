const STEAM64 = process.env.STEAM64_ID || '76561197970987115';
const KNOWN_PEAK = Number(process.env.PREMIER_PEAK || 26958);

module.exports = async (req, res) => {
  try {
    const headers = { Accept: 'application/json' };
    if (process.env.LEETIFY_API_KEY) headers._leetify_key = process.env.LEETIFY_API_KEY;
    const base = 'https://api-public.cs-prod.leetify.com/v3/profile';
    const q = '?steam64_id=' + encodeURIComponent(STEAM64);

    let r = await fetch(base + q, { headers });
    if (!r.ok) {
      await new Promise((ok) => setTimeout(ok, 800));
      r = await fetch(base + q, { headers });
    }
    if (!r.ok) throw new Error('Leetify responded with HTTP ' + r.status);
    const d = await r.json();

    // detailed per-match stats (kills, deaths, ADR ...) - optional, the page still works without them
    const extra = {};
    try {
      const mr = await fetch(base + '/matches' + q, { headers });
      if (mr.ok) {
        const list = await mr.json();
        (Array.isArray(list) ? list : []).forEach((mt) => {
          const st = (mt.stats || []).find((x) => String(x.steam64_id) === String(STEAM64)) || (mt.stats || [])[0];
          if (!st) return;
          extra[mt.id] = {
            k: st.total_kills, d: st.total_deaths, a: st.total_assists, adr: st.dpr, dmg: st.total_damage,
            mvp: st.mvps, hsk: st.total_hs_kills, mk: [st.multi2k, st.multi3k, st.multi4k, st.multi5k],
            trd: st.trade_kills_succeed, tro: st.trade_kill_opportunities,
            flh: st.flashbang_hit_foe, flt: st.flashbang_thrown, he: st.he_foes_damage_avg,
            ctl: st.ct_leetify_rating, tl: st.t_leetify_rating, rs: st.rounds_survived_percentage,
            cs: st.counter_strafing_shots_good_ratio, rc: st.rounds_count,
          };
        });
      }
    } catch (e) { /* ignore */ }

    const pr = (d.recent_matches || [])
      .filter((m) => m.rank_type === 11 && typeof m.rank === 'number')
      .map((m) => m.rank);
    const peak = Math.max(KNOWN_PEAK, (d.ranks && d.ranks.premier) || 0, ...pr);
    const s = d.stats || {};

    const out = {
      fetchedAt: new Date().toISOString(),
      name: d.name,
      winrate: d.winrate,
      total_matches: d.total_matches,
      ranks: {
        leetify: d.ranks && d.ranks.leetify,
        premier: d.ranks && d.ranks.premier,
        faceit: d.ranks && d.ranks.faceit,
        faceit_elo: d.ranks && d.ranks.faceit_elo,
      },
      premier_peak: peak,
      rating: {
        aim: d.rating && d.rating.aim,
        positioning: d.rating && d.rating.positioning,
        utility: d.rating && d.rating.utility,
      },
      recent_matches: (d.recent_matches || []).slice(0, 100).map((m) => ({
        i: m.id, t: m.finished_at, o: m.outcome, r: m.rank, rt: m.rank_type, m: m.map_name, s: m.score,
        l: m.leetify_rating, rx: m.reaction_time_ms, pa: m.preaim, ac: m.accuracy_enemy_spotted,
        hs: m.accuracy_head, sp: m.spray_accuracy,
        ...(extra[m.id] || {}),
      })),
      stats: {
        reaction_time_ms: s.reaction_time_ms,
        preaim: s.preaim,
        accuracy_enemy_spotted: s.accuracy_enemy_spotted,
        accuracy_head: s.accuracy_head,
        spray_accuracy: s.spray_accuracy,
        counter_strafing_good_shots_ratio: s.counter_strafing_good_shots_ratio,
        ct_opening_duel_success_percentage: s.ct_opening_duel_success_percentage,
        t_opening_duel_success_percentage: s.t_opening_duel_success_percentage,
      },
    };

    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
    res.status(200).json(out);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
