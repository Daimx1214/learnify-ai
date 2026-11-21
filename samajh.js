/**
 * Samajh — core logic (offline, rule-based engine).
 *
 * No network, no API key, no external calls. Everything here runs in the
 * browser (or in Node for the tests). The provider adapter at the bottom is
 * a documented stub: PROVIDER = 'none'. A future LLM can plug in there;
 * nothing in this file calls any external API.
 *
 * Honest limits: the offline engine is EXTRACTIVE. It re-uses sentences
 * from the passage itself, so it cannot translate a whole passage into
 * Roman Urdu or Urdu script. What it does in the chosen language is the
 * glossary (checked seed translations) and the quiz wording. The UI says
 * this plainly. Numbers and formulas are never reworded: they are copied
 * from the passage, so they cannot change.
 */

export const MIN_CHARS = 30;
export const MAX_CHARS = 2500;
export const PROVIDER = 'none';

// ---------------------------------------------------------------------------
// Small word lists
// ---------------------------------------------------------------------------

export const STOPWORDS = new Set(
  'a an the and or but if then else when while of in on at to for with by from as is are was were be been being it its this that these those there here what which who whom how why not no yes do does did can could will would should may might must have has had i you he she we they them his her their our your my me him us one two first second also more most other others same such than then so very just only own into over under between through during before after above below up down out off again further once here there all any both each few more most other some such no nor not only own same so than too very can will just don should now'.split(' ')
);

// Verbs / generic words that are not glossary terms on their own.
const GENERIC = new Set(
  'states measured multiplied equals acting flowing connected drives doubling keeping halves overall requires released stored used turn make makes described related simple green tiny called inside while first second gives give given acts act light'.split(' ')
);

const STEM_KEYWORDS = [
  'current', 'voltage', 'resistance', 'resistor', 'circuit', 'battery', 'ohm', 'volt', 'ampere',
  'force', 'mass', 'acceleration', 'velocity', 'speed', 'gravity', 'newton', 'kilogram', 'energy',
  'power', 'work', 'friction', 'momentum', 'pressure', 'temperature', 'heat', 'atom', 'molecule',
  'electron', 'proton', 'neutron', 'cell', 'plant', 'photosynthesis', 'chlorophyll', 'chloroplast',
  'glucose', 'oxygen', 'carbon dioxide', 'stomata', 'enzyme', 'dna', 'gene', 'protein', 'organism',
  'ecosystem', 'climate', 'law', 'equation', 'formula', 'reaction', 'chemical', 'acid', 'base',
  'solution', 'mixture', 'compound', 'element', 'metal', 'wire', 'magnet', 'wave', 'light', 'sound',
  'frequency', 'wavelength', 'orbit', 'planet', 'star', 'solar', 'electric', 'magnetic', 'field',
  'motion', 'distance', 'time', 'volume', 'density', 'liquid', 'gas', 'solid', 'evaporation',
  'condensation', 'radiation', 'conduction', 'convection', 'trolley', 'object', 'soil', 'seed',
  'root', 'leaf', 'flower', 'water', 'hydrogen', 'nitrogen', 'calcium', 'iron', 'copper',
];

// Checked seed glossary. Roman Urdu spellings are the ones Daim uses in
// class (current = barqi rau, resistance = muzahmat, voltage = barqi dabao,
// force = quwwat, mass = kamiyat, acceleration = isra, energy = tawanai,
// photosynthesis = ziai taleef). Where a term is normally said in English
// in class, the local meaning keeps the English word. If a term is not in
// this seed, the app shows the English meaning only — it never guesses a
// translation.
export const GLOSSARY_SEED = {
  'current': { en: 'The flow of electric charge through a wire, measured in amperes.', roman: 'barqi rau — bijli ka bahao, ampere mein naapa jata hai', urdu: 'برقی رو — بجلی کا بہاؤ، ایمپیئر میں ناپا جاتا ہے' },
  'voltage': { en: 'The push that drives electric current through a circuit, measured in volts.', roman: 'barqi dabao (voltage) — woh dabao jo current ko chalata hai, volt mein', urdu: 'برقی دباؤ (voltage) — وہ دباؤ جو کرنٹ کو چلاتا ہے، وولٹ میں' },
  'resistance': { en: 'How much a material opposes the flow of current, measured in ohms.', roman: 'muzahmat — woh rukawat jo current ko rokti hai, ohm mein', urdu: 'مزاحمت — وہ رکاوٹ جو کرنٹ کو روکتی ہے، اوہم میں' },
  'resistor': { en: 'A part in a circuit that adds a known resistance.', roman: 'muzahim (resistor) — circuit ka woh hissa jo resistance deta hai', urdu: 'مزاحم (resistor) — سرکٹ کا وہ حصہ جو مزاحمت دیتا ہے' },
  'circuit': { en: 'A closed path that electric current can flow around.', roman: 'circuit — band rasta jis se current guzarta hai', urdu: 'سرکٹ — بند راستہ جس سے کرنٹ گزرتا ہے' },
  'battery': { en: 'A source that supplies voltage to a circuit.', roman: 'battery — voltage dene wala source', urdu: 'بیٹری — وولٹیج دینے والا ذریعہ' },
  'force': { en: 'A push or pull that can change how an object moves, measured in newtons.', roman: 'quwwat — dhakka ya khinchav jo harkat badal sakta hai, newton mein', urdu: 'قوت — دھکا یا کھنچاؤ جو حرکت بدل سکتا ہے، نیوٹن میں' },
  'mass': { en: 'How much matter an object contains, measured in kilograms.', roman: 'kamiyat (mass) — kisi cheez mein kitna maddeh hai, kilogram mein', urdu: 'کمیت (mass) — کسی چیز میں کتنا مادہ ہے، کلوگرام میں' },
  'acceleration': { en: 'How quickly velocity changes, measured in metres per second squared.', roman: 'isra (acceleration) — raftaar kitni jaldi badalti hai', urdu: 'اسراع (acceleration) — رفتار کتنی جلدی بدلتی ہے' },
  'energy': { en: 'The ability to do work or cause change.', roman: 'tawanai — kaam karne ki salahiyat', urdu: 'توانائی — کام کرنے کی صلاحیت' },
  'photosynthesis': { en: 'How green plants make food from sunlight, water and carbon dioxide.', roman: 'ziai taleef — hare poday roshni, paani aur carbon dioxide se khana banate hain', urdu: 'ضیائی تالیف — ہرے پودے روشنی، پانی اور کاربن ڈائی آکسائیڈ سے کھانا بناتے ہیں' },
  'chlorophyll': { en: 'The green pigment in leaves that absorbs sunlight.', roman: 'chlorophyll — patton mein sabz rang jo roshni jazb karta hai', urdu: 'کلوروفل — پتوں میں سبز رنگ جو روشنی جذب کرتا ہے' },
  'chloroplast': { en: 'The part of a plant cell where photosynthesis happens.', roman: 'chloroplast — poday ke cell ka woh hissa jahan photosynthesis hoti hai', urdu: 'کلوروپلاسٹ — پودے کے خلیے کا وہ حصہ جہاں ضیائی تالیف ہوتی ہے' },
  'chloroplasts': { en: 'The parts of a plant cell where photosynthesis happens.', roman: 'chloroplasts — poday ke cell ke woh hisse jahan photosynthesis hoti hai', urdu: 'کلوروپلاسٹ — پودے کے خلیے کے وہ حصے جہاں ضیائی تالیف ہوتی ہے' },
  'glucose': { en: 'A simple sugar plants make in photosynthesis; food for the plant.', roman: 'glucose — woh cheeni jo poday photosynthesis mein banate hain', urdu: 'گلوکوز — وہ چینی جو پودے ضیائی تالیف میں بناتے ہیں' },
  'oxygen': { en: 'A gas released by plants in photosynthesis; the gas we breathe in.', roman: 'oxygen — woh gas jo poday chorte hain, aur hum saans mein lete hain', urdu: 'آکسیجن — وہ گیس جو پودے چھوڑتے ہیں، اور ہم سانس میں لیتے ہیں' },
  'carbon dioxide': { en: 'A gas in the air that plants take in for photosynthesis.', roman: 'carbon dioxide — hawa ki woh gas jo poday photosynthesis ke liye lete hain', urdu: 'کاربن ڈائی آکسائیڈ — ہوا کی وہ گیس جو پودے ضیائی تالیف کے لیے لیتے ہیں' },
  'water': { en: 'The liquid plants take from the soil for photosynthesis.', roman: 'paani — woh liquid jo poday mitti se lete hain', urdu: 'پانی — وہ مائع جو پودے مٹی سے لیتے ہیں' },
  'sunlight': { en: 'Light from the sun; the energy source for photosynthesis.', roman: 'suraj ki roshni — photosynthesis ke liye tawanai ka zariya', urdu: 'سورج کی روشنی — ضیائی تالیف کے لیے توانائی کا ذریعہ' },
  'light': { en: 'The part of the sun’s energy that plants and eyes can use.', roman: 'roshni — suraj ki tawanai', urdu: 'روشنی — سورج کی توانائی' },
  'plant': { en: 'A living thing that grows in soil and can make its own food.', roman: 'poda — zinda cheez jo mitti mein ugta hai', urdu: 'پودا — زندہ چیز جو مٹی میں اگتا ہے' },
  'stomata': { en: 'Tiny pores in a leaf that let gases in and out.', roman: 'stomata — patte ke chote surakh jin se gas andar bahar jati hai', urdu: 'سٹومیٹا — پتے کے چھوٹے سوراخ جن سے گیس اندر باہر جاتی ہے' },
  'temperature': { en: 'How hot or cold something is.', roman: 'darja hararat — kisi cheez ka garam ya thanda hona', urdu: 'درجہ حرارت — کسی چیز کا گرم یا ٹھنڈا ہونا' },
  'wire': { en: 'A thin metal thread that carries current.', roman: 'taar — patli dhaat jo current le jati hai', urdu: 'تار — پتلی دھات جو کرنٹ لے جاتی ہے' },
  'object': { en: 'A thing that a force can act on.', roman: 'cheez / jism — woh cheez jis par quwwat lag sakti hai', urdu: 'چیز / جسم — وہ چیز جس پر قوت لگ سکتی ہے' },
  'trolley': { en: 'A small wheeled cart used in the example.', roman: 'trolley — misaal mein choti pahiyon wali gari', urdu: 'ٹرالی — مثال میں چھوٹی پہیوں والی گاڑی' },
  'law': { en: 'A rule that describes how nature behaves, tested many times.', roman: 'qanoon — qudrat ka woh usool jo baar baar aazmaya gaya ho', urdu: 'قانون — قدرت کا وہ اصول جو بار بار آزمایا گیا ہو' },
  'newton': { en: 'The unit of force.', roman: 'newton — quwwat ki unit', urdu: 'نیوٹن — قوت کی اکائی' },
  'newtons': { en: 'The unit of force.', roman: 'newton — quwwat ki unit', urdu: 'نیوٹن — قوت کی اکائی' },
  'food': { en: 'What a plant makes for itself to grow.', roman: 'khana — jo poda apne liye banata hai', urdu: 'خوراک — جو پودا اپنے لیے بناتا ہے' },
  'growth': { en: 'Getting bigger; what glucose is used for.', roman: 'barhna — glucose isi kaam aata hai', urdu: 'بڑھنا — گلوکوز اسی کام آتا ہے' },
  'starch': { en: 'Stored food in a plant.', roman: 'starch — poday mein mehfooz khana', urdu: 'نشاستہ — پودے میں محفوظ خوراک' },
  'reaction': { en: 'A change in which substances turn into other substances.', roman: 'reaction — tabdeeli jis mein ek cheez doosri ban jati hai', urdu: 'تعامل — تبدیلی جس میں ایک چیز دوسری بن جاتی ہے' },
};

// ---------------------------------------------------------------------------
// Validation (F1)
// ---------------------------------------------------------------------------

export function validateInput(rawText, level, language) {
  const text = (rawText ?? '').trim();
  if (!text) {
    return { ok: false, code: 'empty', message: 'Paste a paragraph first — the box is empty.' };
  }
  if (text.length < MIN_CHARS) {
    return { ok: false, code: 'too_short', message: `Too short: ${text.length} characters. Paste at least ${MIN_CHARS} characters (about two sentences).` };
  }
  if (text.length > MAX_CHARS) {
    return { ok: false, code: 'too_long', message: `Too long: ${text.length} characters. Keep it under ${MAX_CHARS} characters — cut it to one paragraph.` };
  }
  // T5: a passage mostly in Urdu script is rejected with a clear message,
  // never crashed on. Samajh explains English STEM paragraphs; the Urdu
  // choice is for the glossary and quiz wording, not for the input text.
  // A few Urdu words in an otherwise English paragraph are fine.
  const urduChars = (text.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  const letters = (text.match(/[A-Za-z\u0600-\u06FF\u0750-\u077F]/g) || []).length;
  if (letters > 0 && urduChars / letters > 0.5) {
    return { ok: false, code: 'urdu_script', message: 'This passage is written in Urdu script. Samajh explains English STEM paragraphs — paste the English paragraph, then choose Roman Urdu or Urdu script for the terms and quiz.' };
  }
  if (!['class9', 'intermediate', 'university'].includes(level)) {
    return { ok: false, code: 'bad_level', message: 'Pick a level: Class 9–10, Intermediate or University.' };
  }
  if (!['english', 'roman', 'urdu'].includes(language)) {
    return { ok: false, code: 'bad_language', message: 'Pick a language: Simple English, Roman Urdu or Urdu script.' };
  }
  const lower = text.toLowerCase();
  const foundKeywords = STEM_KEYWORDS.filter((k) => lower.includes(k));
  const hasFormula = /[A-Za-z]\s*=\s*[A-Za-z0-9]/.test(text) || text.includes('→') || text.includes('×');
  const hasNumberWithUnit = /\d+\s*(V|A|ohm|ohms|kg|g|N|m\/s|volts|amperes|newtons|kilograms|metres|seconds|°C|cm|mm|km)/i.test(text);
  const stemLike = foundKeywords.length >= 2 || hasFormula || (/\d/.test(text) && hasNumberWithUnit);
  if (!stemLike) {
    return { ok: false, code: 'not_stem', message: 'This does not look like a STEM paragraph. Paste a science, maths or technology paragraph — with a concept, a number or a formula in it.' };
  }
  return { ok: true, code: 'ok', message: '', text };
}

// ---------------------------------------------------------------------------
// Evidence check (F6)
// ---------------------------------------------------------------------------

export function normalise(s) {
  return (s ?? '')
    .toLowerCase()
    .replace(/["“”‘’'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function checkEvidence(passage, evidence) {
  const nPassage = normalise(passage);
  const nEvidence = normalise(evidence);
  const verified = nEvidence.length > 0 && nPassage.includes(nEvidence);
  return { verified, evidence: (evidence ?? '').trim() };
}

// ---------------------------------------------------------------------------
// Number warning — numbers/formulas in an explanation that are not in the
// passage. In offline mode the explanation is extractive, so this cannot
// trigger there; it exists for the future AI provider, whose output IS
// checked the same way. Pure, so the UI warning path is unit-testable with
// a hand-built result.
// ---------------------------------------------------------------------------

export function checkNumbers(passage, explanationText) {
  const numbersIn = (s) => s.match(/\d+(?:\.\d+)?/g) || [];
  const passageNumbers = new Set(numbersIn(passage ?? ''));
  return [...new Set(numbersIn(explanationText ?? ''))].filter((n) => !passageNumbers.has(n));
}

export function numberWarningText(result) {
  if (!result) return null;
  const parts = [];
  const changed = result.changedNumbers || [];
  if (changed.length > 0) {
    parts.push(`Check ${changed.length === 1 ? 'this number' : 'these numbers'} — ${changed.join(', ')} ${changed.length === 1 ? 'does' : 'do'} not appear in your passage.`);
  }
  if (result.formulaPreserved === false) {
    parts.push('Check the formula — it does not appear in your passage as written.');
  }
  return parts.length ? `⚠ ${parts.join(' ')}` : null;
}

// ---------------------------------------------------------------------------
// Quiz scoring — pure, so it is unit-testable without the DOM.
// `answers` is an array of chosen option indexes, one per quiz item.
// ---------------------------------------------------------------------------

export function scoreQuiz(quiz, answers) {
  if (!Array.isArray(quiz) || !Array.isArray(answers)) return 0;
  let score = 0;
  for (let i = 0; i < quiz.length; i++) {
    if (answers[i] !== null && answers[i] !== undefined && answers[i] === quiz[i].answer_index) score++;
  }
  return score;
}

// ---------------------------------------------------------------------------
// Flashcard deck — pure state, so the reset-on-re-run rule is unit-testable.
// The UI creates a fresh deck per run and calls resetDeck() on re-run; the
// "Know it" marks and the card position must never carry over.
// ---------------------------------------------------------------------------

export function createFlashcardDeck(terms) {
  return { terms: [...(terms || [])], index: 0, known: new Set() };
}

export function resetDeck(deck) {
  if (!deck) return deck;
  deck.index = 0;
  deck.known = new Set();
  return deck;
}

export function deckProgress(deck) {
  if (!deck || !deck.terms.length) return 'No terms found.';
  return `Know ${deck.known.size} of ${deck.terms.length} · Card ${deck.index + 1} of ${deck.terms.length} · session only`;
}

// ---------------------------------------------------------------------------
// Sentence handling
// ---------------------------------------------------------------------------

export function splitSentences(text) {
  const protectedText = text
    .replace(/(\d)\.(\d)/g, '$1<DEC>$2')
    .replace(/\be\.g\./gi, 'e<ABBR>g')
    .replace(/\bi\.e\./gi, 'i<ABBR>e');
  const parts = protectedText.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) || [];
  return parts
    .map((p) => p.replace(/<DEC>/g, '.').replace(/<ABBR>/g, '.').trim())
    .filter(Boolean);
}

function contentWords(text) {
  return (text.toLowerCase().match(/[a-z][a-z'’-]+/g) || [])
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !GENERIC.has(w));
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function seededShuffle(arr, seed) {
  const out = [...arr];
  let s = seed >>> 0 || 1;
  const rand = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function singularKey(lower) {
  if (lower.endsWith('ies')) return lower.slice(0, -3) + 'y';
  if (lower.endsWith('ses') || lower.endsWith('xes')) return lower.slice(0, -2);
  if (lower.endsWith('s') && !lower.endsWith('ss')) return lower.slice(0, -1);
  return lower;
}

function seedFor(termLower) {
  return GLOSSARY_SEED[termLower]
    || GLOSSARY_SEED[singularKey(termLower)]
    || GLOSSARY_SEED[termLower.replace(/s$/, '')]
    || null;
}

// ---------------------------------------------------------------------------
// Key terms (F3)
// ---------------------------------------------------------------------------

export function extractKeyTerms(passage, sentences) {
  const freq = new Map();
  for (const w of contentWords(passage)) freq.set(w, (freq.get(w) ?? 0) + 1);

  // Bigrams that repeat or are in the seed glossary.
  const bigramFreq = new Map();
  const words = contentWords(passage);
  for (let i = 0; i < words.length - 1; i++) {
    const b = `${words[i]} ${words[i + 1]}`;
    bigramFreq.set(b, (bigramFreq.get(b) ?? 0) + 1);
  }

  const candidates = new Map(); // key -> {term, score}
  const add = (term, score) => {
    const key = term.toLowerCase();
    if (candidates.has(key)) candidates.get(key).score += score;
    else candidates.set(key, { term, score });
  };

  for (const [w, n] of freq) {
    let score = n * 2;
    if (seedFor(w)) score += 4;
    if (w.length >= 8) score += 1;
    if (STEM_KEYWORDS.includes(w)) score += 1;
    add(w, score);
  }
  for (const [b, n] of bigramFreq) {
    if (n >= 2 || seedFor(b)) add(b, n * 3 + (seedFor(b) ? 4 : 0));
  }
  // Formula tokens, e.g. V = I × R / F = m × a — kept as glossary terms.
  for (const m of passage.match(/[A-Z]\s*=\s*[A-Za-z]\s*×\s*[A-Za-z]/g) || []) {
    add(m.replace(/\s+/g, ' '), 6);
  }

  // Display form: first occurrence in the passage, as written.
  const ranked = [...candidates.values()]
    .filter((c) => c.term.length >= 3 && !STOPWORDS.has(c.term.toLowerCase()))
    .sort((a, b) => b.score - a.score || a.term.localeCompare(b.term));

  const seen = new Set();
  const terms = [];
  for (const c of ranked) {
    const key = singularKey(c.term.toLowerCase());
    if (seen.has(key)) continue;
    seen.add(key);
    const idx = passage.toLowerCase().indexOf(c.term.toLowerCase());
    const display = idx >= 0 ? passage.slice(idx, idx + c.term.length) : c.term;
    const firstSentence = sentences.find((s) => s.toLowerCase().includes(c.term.toLowerCase())) || sentences[0] || '';
    const seed = seedFor(c.term.toLowerCase());
    terms.push({
      term: display,
      lower: c.term.toLowerCase(),
      meaning_en: seed ? seed.en : `Used in the passage: “${firstSentence}”`,
      meaning_roman: seed ? seed.roman : null,
      meaning_urdu: seed ? seed.urdu : null,
      firstSentence,
    });
    if (terms.length >= 8) break;
  }
  return terms;
}

// ---------------------------------------------------------------------------
// Offline engine (F7) — extractive, deterministic
// ---------------------------------------------------------------------------

export function offlineEngine(passage, level = 'class9', language = 'english') {
  const validation = validateInput(passage, level, language);
  if (!validation.ok) throw new Error(validation.message);
  const text = validation.text;
  const sentences = splitSentences(text);
  if (sentences.length === 0) throw new Error('No sentences found in the passage.');

  // Score sentences by non-stopword term frequency.
  const freq = new Map();
  for (const w of contentWords(text)) freq.set(w, (freq.get(w) ?? 0) + 1);
  const scored = sentences.map((s, i) => ({
    sentence: s,
    index: i,
    // Bonus for sentences carrying a number or a formula: in these short
    // passages the worked example is usually the most useful sentence.
    score: contentWords(s).reduce((sum, w) => sum + (freq.get(w) ?? 0), 0)
      + (/\d/.test(s) ? 4 : 0) + (/=|→/.test(s) ? 2 : 0),
  }));
  const top = [...scored].sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 3);
  const chosen = new Map(top.map((t) => [t.index, t]));
  // A worked example (a sentence carrying a number) is usually the most
  // useful sentence for a student, so include the best one if the top 3
  // missed it. Explanation is then 3 sentences, or 4 when an example is added.
  const numeric = scored.filter((t) => /\d/.test(t.sentence) && !chosen.has(t.index))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0];
  if (numeric) chosen.set(numeric.index, numeric);
  // The opening sentence is usually the definition ("Photosynthesis is
  // the process..."), so it belongs in the explanation even when it scores
  // lower than the worked examples.
  if (!chosen.has(0)) chosen.set(0, scored.find((t) => t.index === 0));
  const explanationSentences = [...chosen.values()].sort((a, b) => a.index - b.index).map((t) => t.sentence);
  const oneLine = explanationSentences[0];

  const keyTerms = extractKeyTerms(text, sentences);

  // Quiz (F4): cloze questions, one per key term, evidence = the sentence.
  const quiz = buildQuiz(text, sentences, keyTerms, language);

  // Numbers/formulas in the explanation that are not in the passage (should be none).
  const changedNumbers = checkNumbers(text, explanationSentences.join(' '));
  const formulaInExplanation = /[A-Z]\s*=\s*[A-Za-z]\s*×\s*[A-Za-z]/.test(explanationSentences.join(' '));
  const formulaInPassage = /[A-Z]\s*=\s*[A-Za-z]\s*×\s*[A-Za-z]/.test(text);

  const verifiedCount = quiz.filter((q) => q.verified).length;

  return {
    mode: 'offline',
    reason: 'no API key — works without one',
    level,
    language,
    oneLine,
    explanation: explanationSentences.join(' '),
    explanationSentences,
    keyTerms,
    quiz,
    verifiedCount,
    totalQuiz: quiz.length,
    changedNumbers,
    formulaPreserved: !formulaInExplanation || formulaInPassage,
  };
}

function termPattern(termLower) {
  // Matches the term or its simple plural, e.g. object / objects.
  const base = escapeRegExp(termLower);
  return termLower.endsWith('s') ? new RegExp(`\\b${base}\\b`, 'i')
    : new RegExp(`\\b${base}s?\\b`, 'i');
}

function buildQuiz(passage, sentences, keyTerms, language) {
  const quizTerms = keyTerms.filter((t) => !t.term.includes('=') && !t.term.includes('×'));
  // How many questions already blank a word from each sentence. Two passes:
  // first use a fresh sentence per question; second pass may reuse a
  // sentence (short passages have fewer sentences than questions), but it
  // reuses the LEAST-used sentence first, so the same sentence is never
  // the obvious fallback — e.g. Newton has 4 sentences for 5 questions,
  // so exactly one sentence is used twice, and it is not Q1's sentence.
  const sentenceUseCount = new Map();
  const usedTerms = new Set();
  const items = [];

  for (const allowReuse of [false, true]) {
    for (const term of quizTerms) {
      if (items.length >= 5) break;
      if (usedTerms.has(term.lower)) continue;
      const pattern = termPattern(term.lower);
      const options = sentences
        .map((s, i) => ({ s, i, others: quizTerms.filter((t) => t !== term && termPattern(t.lower).test(s)).length }))
        .filter((o) => pattern.test(o.s) && (allowReuse || !sentenceUseCount.has(o.i)));
      if (!options.length) continue;
      // Pass 1: fewest other key terms in the sentence (least ambiguous
      // cloze), then earliest sentence. Pass 2: least-used sentence first,
      // then earliest — spread the reuse instead of repeating one sentence.
      if (allowReuse) options.sort((a, b) => (sentenceUseCount.get(a.i) || 0) - (sentenceUseCount.get(b.i) || 0) || a.i - b.i);
      else options.sort((a, b) => a.others - b.others || a.i - b.i);
      const evidence = options[0].s;
      sentenceUseCount.set(options[0].i, (sentenceUseCount.get(options[0].i) || 0) + 1);
      usedTerms.add(term.lower);
      // The correct answer is the word as written in the evidence sentence
      // (so "objects" stays "objects", not the singular glossary form).
      const correctAnswer = evidence.match(pattern)[0];

      // Distractors: other key terms NOT in the evidence sentence.
      // Generic words (object, law) are never distractors: they can fit
      // almost any blank ("a 2 kg object" is also sensible), which would
      // make the question ambiguous. They can still be correct answers.
      const GENERIC_DISTRACTORS = new Set(['object', 'law']);
      let distractors = quizTerms
        .filter((t) => t !== term && !GENERIC_DISTRACTORS.has(t.lower) && !termPattern(t.lower).test(evidence))
        .map((t) => t.term);
      if (distractors.length < 3) {
        const extra = contentWords(passage)
          .filter((w) => w.length >= 4 && w !== term.lower && !w.includes("'") && !GENERIC_DISTRACTORS.has(w) && !termPattern(w).test(evidence));
        for (const w of [...new Set(extra)]) {
          if (distractors.length >= 3) break;
          if (!distractors.some((d) => d.toLowerCase() === w)) distractors.push(w);
        }
      }
      distractors = [...new Set(distractors.map((d) => d.toLowerCase()))]
        .filter((d) => d !== correctAnswer.toLowerCase())
        .slice(0, 3)
        .map((d) => {
          const hit = quizTerms.find((t) => t.lower === d);
          return hit ? hit.term : d;
        });
      if (distractors.length < 3) { usedTerms.delete(term.lower); continue; }

      const cloze = evidence.replace(pattern, '______');
      const allOptions = seededShuffle([correctAnswer, ...distractors], hashString(passage + term.lower));
      const answerIndex = allOptions.findIndex((o) => o.toLowerCase() === correctAnswer.toLowerCase());
      if (answerIndex < 0) continue;

      const question =
        language === 'roman' ? `Khaali jagah bharein: “${cloze}”`
        : language === 'urdu' ? `خالی جگہ بھریں: “${cloze}”`
        : `Fill in the blank: “${cloze}”`;
      const reason =
        language === 'roman' ? `Passage mein khaali jagah par “${correctAnswer}” hai.`
        : language === 'urdu' ? `عبارت میں خالی جگہ پر “${correctAnswer}” ہے۔`
        : `The passage says the missing word is “${correctAnswer}”.`;

      items.push({
        question,
        options: allOptions,
        answer_index: answerIndex,
        reason,
        evidence,
        verified: checkEvidence(passage, evidence).verified,
      });
    }
    if (items.length >= 5) break;
  }
  return items;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Study sheet (F10)
// ---------------------------------------------------------------------------

export function buildStudySheet(result, passage, level, language) {
  const lines = [
    '# Samajh — study sheet',
    '',
    `Level: ${level} · Language: ${language} · Mode: ${result.mode} (${result.reason})`,
    '',
    '## Original passage',
    '',
    passage.trim(),
    '',
    '## Simple explanation',
    '',
    result.oneLine,
    '',
    result.explanation,
    '',
    '## Key terms',
    '',
    ...result.keyTerms.map((t) => {
      const local = language === 'urdu' ? t.meaning_urdu : language === 'roman' ? t.meaning_roman : null;
      return `- **${t.term}** — ${t.meaning_en}${local ? ` / ${local}` : ''}`;
    }),
    '',
    '## Quiz',
    '',
    ...result.quiz.flatMap((q, i) => [
      `${i + 1}. ${q.question}`,
      ...q.options.map((o, j) => `   ${String.fromCharCode(97 + j)}) ${o}`),
      `   Answer: ${q.options[q.answer_index]} — ${q.reason}`,
      `   Evidence: “${q.evidence}” (${q.verified ? 'Found in passage' : 'Could not verify — check yourself'})`,
      '',
    ]),
    '---',
    'Made with Samajh (STEM2Connect AI Hackathon 2026, Education track). Offline mode: no API key was used.',
  ];
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Provider adapter stub (F7) — documented, never called with a key
// ---------------------------------------------------------------------------

export function getProviderInfo() {
  return {
    provider: PROVIDER, // 'none' — see README / docs/AI_LOG.md
    model: null,
    reason: 'no API key — works without one',
    callsExternalApi: false,
    // To plug in a future LLM, implement callProvider() to return the same
    // shape offlineEngine() returns, then set PROVIDER and validate its
    // output with checkEvidence() before rendering. No key is stored here.
  };
}

export async function callProvider() {
  throw new Error('No AI provider configured (PROVIDER=none). Use offlineEngine() instead.');
}

export function runPipeline(passage, level, language) {
  // Single entry point the UI uses. With PROVIDER=none this always takes
  // the offline path — the hackathon's API-credit exception, stated honestly.
  const info = getProviderInfo();
  if (info.provider === 'none') {
    return { result: offlineEngine(passage, level, language), mode: 'offline', reason: info.reason };
  }
  throw new Error(`Provider "${info.provider}" is not implemented in this build.`);
}
