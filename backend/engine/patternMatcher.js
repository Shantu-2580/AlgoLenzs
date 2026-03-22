/**
 * Pattern Matcher Engine
 * Recognizes DSA algorithms from code using weighted signal scoring.
 * Returns { algorithm, category, displayName, confidence, complexity, description }
 */

const ALGORITHMS = [
  // ── SORTING ──────────────────────────────────────────────────────────────
  {
    algorithm: 'bubble_sort',
    displayName: 'Bubble Sort',
    category: 'Sorting',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    description: 'Repeatedly compares adjacent elements and swaps them if out of order.',
    signals: {
      keywords: { terms: ['swap', 'bubble'], weight: 0.30 },
      structure: [
        { regex: /for.+for/s,                       weight: 0.20 }, // nested loops
        { regex: /swap|temp\s*=.+\[.+\].+\[.+\]/s, weight: 0.20 }, // swap op
      ],
      variables: { terms: ['i', 'j', 'arr', 'temp'], weight: 0.20 },
      logic: [
        { regex: /\[j\]\s*[>]\s*\w+\[j\s*\+\s*1\]/, weight: 0.10 }, // arr[j] > arr[j+1]
      ],
    },
  },
  {
    algorithm: 'selection_sort',
    displayName: 'Selection Sort',
    category: 'Sorting',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    description: 'Finds the minimum element and places it at the beginning each pass.',
    signals: {
      keywords: { terms: ['min', 'minimum', 'minIndex', 'minIdx'], weight: 0.30 },
      structure: [
        { regex: /for.+for/s, weight: 0.20 },
        { regex: /min\w*\s*=\s*i/, weight: 0.20 },
      ],
      variables: { terms: ['minIdx', 'minIndex', 'min_idx', 'i', 'j'], weight: 0.20 },
      logic: [
        { regex: /\w+\[j\]\s*<\s*\w+\[\w*min\w*\]/i, weight: 0.10 },
      ],
    },
  },
  {
    algorithm: 'insertion_sort',
    displayName: 'Insertion Sort',
    category: 'Sorting',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    description: 'Builds a sorted array by inserting each element into its correct position.',
    signals: {
      keywords: { terms: ['key', 'insert', 'sorted'], weight: 0.30 },
      structure: [
        { regex: /for.+while/s,              weight: 0.25 },
        { regex: /while.+>\s*0.+>/s,         weight: 0.15 },
      ],
      variables: { terms: ['key', 'i', 'j'], weight: 0.20 },
      logic: [
        { regex: /key\s*=\s*\w+\[i\]/,       weight: 0.10 },
      ],
    },
  },
  {
    algorithm: 'merge_sort',
    displayName: 'Merge Sort',
    category: 'Sorting',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    description: 'Divides the array in half, recursively sorts, then merges the sorted halves.',
    signals: {
      keywords: { terms: ['merge', 'mid', 'left', 'right'], weight: 0.30 },
      structure: [
        { regex: /def\s+merge|function\s+merge|void\s+merge/i, weight: 0.20 },
        { regex: /mid\s*=.+(\/\s*2|>>\s*1)/,                   weight: 0.20 },
      ],
      variables: { terms: ['mid', 'left', 'right', 'merged', 'temp'], weight: 0.20 },
      logic: [
        { regex: /merge\w*\(.+mid.+\)/s, weight: 0.10 },
      ],
    },
  },
  {
    algorithm: 'quick_sort',
    displayName: 'Quick Sort',
    category: 'Sorting',
    complexity: { time: 'O(n log n)', space: 'O(log n)' },
    description: 'Selects a pivot and partitions elements around it, then recursively sorts.',
    signals: {
      keywords: { terms: ['pivot', 'partition'], weight: 0.30 },
      structure: [
        { regex: /def\s+partition|function\s+partition|int\s+partition/i, weight: 0.20 },
        { regex: /pivot/, weight: 0.20 },
      ],
      variables: { terms: ['pivot', 'low', 'high', 'pi', 'left', 'right'], weight: 0.20 },
      logic: [
        { regex: /\w+\[.+\]\s*[<>]=?\s*pivot/, weight: 0.10 },
      ],
    },
  },

  // ── TREES ─────────────────────────────────────────────────────────────────
  {
    algorithm: 'bst_insert',
    displayName: 'BST Insert',
    category: 'Tree',
    complexity: { time: 'O(h)', space: 'O(h)' },
    description: 'Inserts a value into a Binary Search Tree following BST ordering rules.',
    signals: {
      keywords: { terms: ['insert', 'node', 'root', 'left', 'right'], weight: 0.30 },
      structure: [
        { regex: /class\s+\w*[Nn]ode/,          weight: 0.15 },
        { regex: /\.left\s*=|\.right\s*=/,       weight: 0.15 },
      ],
      variables: { terms: ['root', 'node', 'val', 'key', 'left', 'right'], weight: 0.20 },
      logic: [
        { regex: /val\s*<\s*\w+\.(val|key|data).+left|key\s*<\s*\w+\.(val|key|data)/s, weight: 0.10 },
        { regex: /insert\w*\(.*root.*\)/i, weight: 0.10 },
      ],
    },
  },
  {
    algorithm: 'bst_search',
    displayName: 'BST Search',
    category: 'Tree',
    complexity: { time: 'O(h)', space: 'O(h)' },
    description: 'Searches for a value in a Binary Search Tree by comparing at each node.',
    signals: {
      keywords: { terms: ['search', 'find', 'root', 'left', 'right'], weight: 0.30 },
      structure: [
        { regex: /return\s+\w*(search|find)\w*\(.*(left|right)/i, weight: 0.25 },
        { regex: /if.+None|if.+null/i,                             weight: 0.15 },
      ],
      variables: { terms: ['root', 'key', 'val', 'target', 'node'], weight: 0.20 },
      logic: [
        { regex: /key\s*[<>]\s*\w+\.(val|key|data)/,              weight: 0.10 },
      ],
    },
  },
  {
    algorithm: 'tree_inorder',
    displayName: 'Inorder Traversal',
    category: 'Tree',
    complexity: { time: 'O(n)', space: 'O(h)' },
    description: 'Visits nodes in Left → Root → Right order, producing sorted output for BSTs.',
    signals: {
      keywords: { terms: ['inorder', 'in_order', 'left', 'right', 'root'], weight: 0.30 },
      structure: [
        { regex: /inorder\w*\(.+\.left\)/i,  weight: 0.25 },
        { regex: /inorder\w*\(.+\.right\)/i, weight: 0.25 },
      ],
      variables: { terms: ['root', 'node', 'result'], weight: 0.20 },
      logic: [],
    },
  },
  {
    algorithm: 'tree_preorder',
    displayName: 'Preorder Traversal',
    category: 'Tree',
    complexity: { time: 'O(n)', space: 'O(h)' },
    description: 'Visits nodes in Root → Left → Right order.',
    signals: {
      keywords: { terms: ['preorder', 'pre_order', 'left', 'right', 'root'], weight: 0.30 },
      structure: [
        { regex: /preorder\w*\(.+\.left\)/i,  weight: 0.25 },
        { regex: /preorder\w*\(.+\.right\)/i, weight: 0.25 },
      ],
      variables: { terms: ['root', 'node', 'result'], weight: 0.20 },
      logic: [],
    },
  },

  // ── GRAPHS ────────────────────────────────────────────────────────────────
  {
    algorithm: 'bfs',
    displayName: 'Breadth-First Search',
    category: 'Graph',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    description: 'Explores a graph level by level using a queue, visiting all neighbors before going deeper.',
    signals: {
      keywords: { terms: ['queue', 'visited', 'bfs', 'neighbors', 'adj'], weight: 0.30 },
      structure: [
        { regex: /queue\s*=\s*(\[\]|deque|Queue|new\s+\w*[Qq]ueue)/, weight: 0.20 },
        { regex: /\.append\(|\.push\(|enqueue/,                        weight: 0.10 },
        { regex: /while.+queue/s,                                       weight: 0.10 },
      ],
      variables: { terms: ['queue', 'visited', 'node', 'neighbors', 'adj', 'graph'], weight: 0.20 },
      logic: [
        { regex: /visited\[.+\]\s*=\s*(true|True|1)/, weight: 0.05 },
        { regex: /\.popleft\(\)|\.dequeue\(\)|\.shift\(\)/, weight: 0.05 },
      ],
    },
  },
  {
    algorithm: 'dfs',
    displayName: 'Depth-First Search',
    category: 'Graph',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    description: 'Explores a graph by going as deep as possible before backtracking.',
    signals: {
      keywords: { terms: ['stack', 'visited', 'dfs', 'neighbors', 'adj'], weight: 0.30 },
      structure: [
        { regex: /def\s+dfs|function\s+dfs/i,  weight: 0.20 },
        { regex: /dfs\w*\(.+(neighbor|adj)/i,  weight: 0.20 },
      ],
      variables: { terms: ['visited', 'stack', 'node', 'adj', 'graph'], weight: 0.20 },
      logic: [
        { regex: /visited\[.+\]\s*=\s*(true|True|1)/, weight: 0.10 },
      ],
    },
  },

  // ── LINEAR DATA STRUCTURES ────────────────────────────────────────────────
  {
    algorithm: 'linked_list',
    displayName: 'Linked List',
    category: 'LinkedList',
    complexity: { time: 'O(n)', space: 'O(n)' },
    description: 'A linear data structure where each node points to the next via a pointer.',
    signals: {
      keywords: { terms: ['node', 'next', 'head', 'tail', 'linked'], weight: 0.30 },
      structure: [
        { regex: /class\s+\w*[Nn]ode/,    weight: 0.20 },
        { regex: /self\.next\s*=|this\.next\s*=/, weight: 0.20 },
      ],
      variables: { terms: ['head', 'tail', 'current', 'next', 'prev', 'node'], weight: 0.20 },
      logic: [
        { regex: /\.next\s*=\s*(None|null|new)/, weight: 0.10 },
      ],
    },
  },
  {
    algorithm: 'stack_ops',
    displayName: 'Stack Operations',
    category: 'Stack',
    complexity: { time: 'O(1)', space: 'O(n)' },
    description: 'LIFO data structure supporting push, pop, and peek operations.',
    signals: {
      keywords: { terms: ['push', 'pop', 'stack', 'top', 'peek'], weight: 0.30 },
      structure: [
        { regex: /\.push\(|\.append\(/, weight: 0.15 },
        { regex: /\.pop\(\)/,           weight: 0.15 },
      ],
      variables: { terms: ['stack', 'top', 'item', 'peek'], weight: 0.20 },
      logic: [
        { regex: /stack\s*=\s*\[\]|stack\s*=\s*new\s+(Stack|Array)/i, weight: 0.10 },
        { regex: /isEmpty|is_empty|len\(stack\)\s*==\s*0/,             weight: 0.10 },
      ],
    },
  },
  {
    algorithm: 'queue_ops',
    displayName: 'Queue Operations',
    category: 'Queue',
    complexity: { time: 'O(1)', space: 'O(n)' },
    description: 'FIFO data structure supporting enqueue and dequeue operations.',
    signals: {
      keywords: { terms: ['enqueue', 'dequeue', 'front', 'rear', 'queue'], weight: 0.30 },
      structure: [
        { regex: /enqueue|\.append\(/,  weight: 0.15 },
        { regex: /dequeue|\.popleft\(\)|\.shift\(\)/, weight: 0.15 },
      ],
      variables: { terms: ['queue', 'front', 'rear', 'item'], weight: 0.20 },
      logic: [
        { regex: /front\s*=\s*(0|null|None)|rear\s*=\s*-1/, weight: 0.10 },
        { regex: /queue\s*=\s*(\[\]|deque)/,                weight: 0.10 },
      ],
    },
  },
];

// ── Scoring helpers ──────────────────────────────────────────────────────────

function scoreKeywords(code, { terms, weight }) {
  const normalized = code.toLowerCase();
  const hits = terms.filter(t => normalized.includes(t.toLowerCase())).length;
  return (hits / terms.length) * weight;
}

function scoreStructure(code, patterns) {
  return patterns.reduce((sum, { regex, weight }) => {
    return sum + (regex.test(code) ? weight : 0);
  }, 0);
}

function scoreVariables(code, { terms, weight }) {
  const hits = terms.filter(t => {
    const re = new RegExp(`\\b${t}\\b`, 'i');
    return re.test(code);
  }).length;
  return (hits / terms.length) * weight;
}

function scoreLogic(code, patterns) {
  return patterns.reduce((sum, { regex, weight }) => {
    return sum + (regex.test(code) ? weight : 0);
  }, 0);
}

// ── Main matcher ─────────────────────────────────────────────────────────────

function patternMatcher(code, language = 'unknown') {
  const results = ALGORITHMS.map(algo => {
    const { signals } = algo;
    const score =
      scoreKeywords(code, signals.keywords) +
      scoreStructure(code, signals.structure) +
      scoreVariables(code, signals.variables) +
      scoreLogic(code, signals.logic);

    return {
      algorithm:   algo.algorithm,
      displayName: algo.displayName,
      category:    algo.category,
      complexity:  algo.complexity,
      description: algo.description,
      confidence:  Math.min(parseFloat(score.toFixed(3)), 1.0),
    };
  });

  results.sort((a, b) => b.confidence - a.confidence);
  const best = results[0];

  return best;
}

module.exports = { patternMatcher, ALGORITHMS };
