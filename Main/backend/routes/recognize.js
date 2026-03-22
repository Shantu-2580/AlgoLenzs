const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { recognizeLimiter } = require('../middleware/rateLimiter');
const { detectLanguage }   = require('../engine/languageDetector');
const { patternMatcher }   = require('../engine/patternMatcher');
const { analyzeWithGemini } = require('../engine/geminiClient');
const supabase              = require('../db/supabase');

// ── Trace generator map ───────────────────────────────────────────────────────
const { bubbleSortTrace, selectionSortTrace, insertionSortTrace, mergeSortTrace, quickSortTrace } = require('../engine/traceGenerators/sorting');
const { bstInsertTrace, bstSearchTrace, inorderTrace, preorderTrace }                            = require('../engine/traceGenerators/trees');
const { bfsTrace, dfsTrace }                                                                      = require('../engine/traceGenerators/graphs');
const { linkedListTrace, stackOpsTrace, queueOpsTrace }                                           = require('../engine/traceGenerators/linear');

const TRACE_GENERATORS = {
  bubble_sort:    bubbleSortTrace,
  selection_sort: selectionSortTrace,
  insertion_sort: insertionSortTrace,
  merge_sort:     mergeSortTrace,
  quick_sort:     quickSortTrace,
  bst_insert:     bstInsertTrace,
  bst_search:     bstSearchTrace,
  tree_inorder:   inorderTrace,
  tree_preorder:  preorderTrace,
  bfs:            bfsTrace,
  dfs:            dfsTrace,
  linked_list:    linkedListTrace,
  stack_ops:      stackOpsTrace,
  queue_ops:      queueOpsTrace,
};

// Detect common language built-in sort calls when manual algorithm patterns are absent.
function detectBuiltinSort(code = '') {
  const patterns = [
    /\bArrays\.sort\s*\(/,          // Java
    /\bCollections\.sort\s*\(/,     // Java
    /\bsorted\s*\(/,                // Python
    /\.sort\s*\(/,                  // JS/Python list
    /\bstable_sort\s*\(/,           // C++
    /\bsort\s*\(.*\)/,             // Generic C++/other
  ];

  return patterns.some((re) => re.test(code));
}

// ── Fire-and-forget logging ───────────────────────────────────────────────────
function logToSupabase(data) {
  if (!supabase) return;
  supabase
    .from('visualizations')
    .insert([data])
    .then(({ error }) => {
      if (error) console.warn('[Supabase log error]', error.message);
    });
}

// ── POST /api/recognize ───────────────────────────────────────────────────────
router.post(
  '/recognize',
  recognizeLimiter,
  [
    body('code')
      .exists().withMessage('Code is required')
      .isString().withMessage('Code must be a string')
      .trim()
      .notEmpty().withMessage('Code cannot be empty')
      .isLength({ max: 10000 }).withMessage('Code too long (max 10000 chars)'),
    body('language')
      .optional()
      .isString()
      .isIn(['python', 'java', 'cpp', 'javascript', 'auto', 'unknown', ''])
      .withMessage('Invalid language'),
  ],
  async (req, res) => {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const first = errors.array()[0];
      const status = first.msg.includes('required') || first.msg.includes('empty') ? 400 : 400;
      return res.status(status).json({ error: first.msg });
    }

    const { code, language: providedLang } = req.body;

    try {
      // 1. Detect language
      const langResult = (!providedLang || providedLang === 'auto' || providedLang === '')
        ? detectLanguage(code)
        : { language: providedLang, confidence: 1.0 };

      const language = langResult.language;

      // 2. Run pattern matcher
      const match = patternMatcher(code, language);

      let result;

      if (match.confidence >= 0.30) {
        // 3a. Pattern matched — generate trace
        const generator = TRACE_GENERATORS[match.algorithm];
        const trace = generator ? generator() : [];

        result = {
          algorithm:   match.algorithm,
          displayName: match.displayName,
          category:    match.category,
          confidence:  match.confidence,
          source:      'pattern',
          language,
          trace,
          complexity:  match.complexity,
          description: match.description,
        };
      } else {
        if (detectBuiltinSort(code)) {
          result = {
            algorithm: 'quick_sort',
            displayName: 'Built-in Sort',
            category: 'Sorting',
            confidence: 0.65,
            source: 'heuristic',
            language,
            trace: quickSortTrace(),
            complexity: { time: 'O(n log n)', space: 'O(log n)' },
            description: 'Detected a built-in sorting call. Visualization uses a representative quick sort trace.',
          };
        } else {
        // 3b. Low confidence — call Gemini
        try {
          const geminiResult = await analyzeWithGemini(code);

          if (geminiResult.algorithm === 'unknown' || geminiResult.confidence < 0.4) {
            return res.status(422).json({
              error: 'Algorithm not supported',
              suggestion: 'Try one of the supported algorithms: sorting, BST, BFS/DFS, linked list, stack, or queue.',
            });
          }

          result = { ...geminiResult, language };
        } catch (geminiErr) {
          console.warn('[Gemini fallback failed]', geminiErr.message);
          return res.status(422).json({
            error: 'Algorithm not recognized',
            suggestion: 'Could not identify this algorithm. Supported: Bubble/Selection/Insertion/Merge/Quick Sort, BST, BFS, DFS, Linked List, Stack, Queue.',
          });
        }
        }
      }

      // 4. Log to Supabase (non-blocking)
      logToSupabase({
        algorithm:  result.algorithm,
        category:   result.category,
        language:   result.language,
        confidence: result.confidence,
        source:     result.source,
      });

      return res.json(result);

    } catch (err) {
      console.error('[/api/recognize error]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
