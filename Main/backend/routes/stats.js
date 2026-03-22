const express = require('express');
const router  = express.Router();

const { statsLimiter } = require('../middleware/rateLimiter');
const supabase          = require('../db/supabase');

const DISPLAY_NAMES = {
  bubble_sort:    'Bubble Sort',
  selection_sort: 'Selection Sort',
  insertion_sort: 'Insertion Sort',
  merge_sort:     'Merge Sort',
  quick_sort:     'Quick Sort',
  bst_insert:     'BST Insert',
  bst_search:     'BST Search',
  tree_inorder:   'Inorder Traversal',
  tree_preorder:  'Preorder Traversal',
  bfs:            'BFS',
  dfs:            'DFS',
  linked_list:    'Linked List',
  stack_ops:      'Stack',
  queue_ops:      'Queue',
};

// ── GET /api/stats ────────────────────────────────────────────────────────────
router.get('/stats', statsLimiter, async (req, res) => {
  if (!supabase) {
    return res.json(getMockStats());
  }

  try {
    const now       = new Date();
    const todayStr  = now.toISOString().split('T')[0];
    const twoWeeks  = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();

    // Run all queries in parallel
    const [
      totalResult,
      todayResult,
      algoResult,
      langResult,
      dailyResult,
      recentResult,
    ] = await Promise.all([
      supabase.from('visualizations').select('id', { count: 'exact', head: true }),
      supabase.from('visualizations').select('id', { count: 'exact', head: true })
        .gte('created_at', `${todayStr}T00:00:00Z`),
      supabase.from('visualizations').select('algorithm').order('algorithm'),
      supabase.from('visualizations').select('language').order('language'),
      supabase.from('visualizations').select('created_at').gte('created_at', twoWeeks),
      supabase.from('visualizations')
        .select('algorithm, category, language, confidence, source, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    // Algorithm counts
    const algoCounts = {};
    (algoResult.data || []).forEach(({ algorithm }) => {
      algoCounts[algorithm] = (algoCounts[algorithm] || 0) + 1;
    });
    const topAlgorithms = Object.entries(algoCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        displayName: DISPLAY_NAMES[name] || name,
        count,
      }));

    // Language counts
    const langCounts = {};
    (langResult.data || []).forEach(({ language }) => {
      if (language) langCounts[language] = (langCounts[language] || 0) + 1;
    });
    const languages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // Daily usage (last 14 days)
    const dailyCounts = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      dailyCounts[d.toISOString().split('T')[0]] = 0;
    }
    (dailyResult.data || []).forEach(({ created_at }) => {
      const date = created_at.split('T')[0];
      if (dailyCounts[date] !== undefined) dailyCounts[date]++;
    });
    const daily = Object.entries(dailyCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));

    // Recent entries
    const recent = (recentResult.data || []).map(r => ({
      algorithm:   r.algorithm,
      displayName: DISPLAY_NAMES[r.algorithm] || r.algorithm,
      language:    r.language,
      confidence:  r.confidence,
      source:      r.source,
      createdAt:   r.created_at,
    }));

    return res.json({
      total:        totalResult.count || 0,
      today:        todayResult.count || 0,
      topAlgorithm: topAlgorithms[0]?.displayName || '—',
      topLanguage:  languages[0]?.name || '—',
      daily,
      algorithms:   topAlgorithms,
      languages,
      recent,
    });

  } catch (err) {
    console.error('[/api/stats error]', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ── Mock stats (when Supabase not configured) ─────────────────────────────────
function getMockStats() {
  const today = new Date();
  const daily = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today - (13 - i) * 24 * 60 * 60 * 1000);
    return { date: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 20) };
  });

  return {
    total: 0,
    today: 0,
    topAlgorithm: '—',
    topLanguage: '—',
    daily,
    algorithms: [],
    languages: [],
    recent: [],
  };
}

module.exports = router;
