const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

const GEMINI_PROMPT = (code) => `
You are a DSA algorithm analyzer. Analyze this code and respond ONLY with a valid JSON object.
No markdown, no code fences, no explanation — raw JSON only.

Code:
${code}

Respond with exactly this JSON structure:
{
  "algorithm": "snake_case_name",
  "displayName": "Human Readable Name",
  "category": "Sorting|Tree|Graph|LinkedList|Stack|Queue|Other",
  "confidence": 0.95,
  "complexity": { "time": "O(n²)", "space": "O(1)" },
  "description": "One sentence description of what this algorithm does.",
  "steps": [
    "Step 1 description",
    "Step 2 description",
    "Step 3 description"
  ]
}

Rules:
- algorithm must be snake_case (e.g. "bubble_sort", "binary_search")
- If you cannot identify the algorithm, set algorithm to "unknown" and confidence to 0.0
- confidence must be between 0.0 and 1.0
- steps should describe the algorithm's main operations in plain English
`;

// Convert Gemini steps[] into a simple trace[] format
function stepsToTrace(steps) {
  return steps.map((description, index) => ({
    step: index + 1,
    line: index + 1,
    action: 'step',
    highlight: [index + 1],
    state: { description, stepIndex: index },
  }));
}

async function analyzeWithGemini(code) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent(GEMINI_PROMPT(code));
  const text = result.response.text().trim();

  // Strip any accidental markdown fences
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Gemini returned invalid JSON');
  }

  if (!parsed.algorithm || !parsed.category) {
    throw new Error('Gemini response missing required fields');
  }

  return {
    algorithm:   parsed.algorithm,
    displayName: parsed.displayName  || parsed.algorithm,
    category:    parsed.category     || 'Other',
    confidence:  typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
    complexity:  parsed.complexity   || { time: 'Unknown', space: 'Unknown' },
    description: parsed.description  || '',
    trace:       stepsToTrace(parsed.steps || []),
    source:      'gemini',
  };
}

module.exports = { analyzeWithGemini };
