/**
 * Detects the programming language of a code snippet using heuristics.
 * Returns { language, confidence }
 */

const DETECTORS = [
  {
    language: 'python',
    tests: [
      { regex: /\bdef\s+\w+\s*\(/,        weight: 0.35 },
      { regex: /:\s*$/m,                   weight: 0.15 },
      { regex: /\bprint\s*\(/,             weight: 0.15 },
      { regex: /\bimport\s+\w+/,           weight: 0.10 },
      { regex: /\bNone\b|\bTrue\b|\bFalse\b/, weight: 0.15 },
      { regex: /\belif\b/,                 weight: 0.10 },
    ],
  },
  {
    language: 'java',
    tests: [
      { regex: /\bpublic\s+class\b/,       weight: 0.35 },
      { regex: /System\.out\.print/,        weight: 0.25 },
      { regex: /\bvoid\s+main\b/,           weight: 0.20 },
      { regex: /\bpublic\b|\bprivate\b|\bprotected\b/, weight: 0.10 },
      { regex: /\bnew\s+\w+\s*\(/,         weight: 0.10 },
    ],
  },
  {
    language: 'cpp',
    tests: [
      { regex: /#include\s*</,             weight: 0.35 },
      { regex: /\bcout\b|\bcin\b/,         weight: 0.30 },
      { regex: /::/,                        weight: 0.15 },
      { regex: /->/,                        weight: 0.10 },
      { regex: /\bstd::/,                  weight: 0.10 },
    ],
  },
  {
    language: 'javascript',
    tests: [
      { regex: /\b(const|let|var)\s+\w+\s*=/, weight: 0.30 },
      { regex: /=>/,                           weight: 0.20 },
      { regex: /console\.log/,                 weight: 0.20 },
      { regex: /===|!==|typeof/,               weight: 0.15 },
      { regex: /\bfunction\s*\(/,              weight: 0.15 },
    ],
  },
];

function detectLanguage(code) {
  if (!code || typeof code !== 'string') {
    return { language: 'unknown', confidence: 0 };
  }

  const scores = DETECTORS.map(({ language, tests }) => {
    const score = tests.reduce((sum, { regex, weight }) => {
      return sum + (regex.test(code) ? weight : 0);
    }, 0);
    return { language, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  if (best.score < 0.15) {
    return { language: 'unknown', confidence: best.score };
  }

  return { language: best.language, confidence: Math.min(best.score, 1.0) };
}

module.exports = { detectLanguage };
