import { validateInput, runPipeline, buildStudySheet, normalise, splitSentences, numberWarningText, scoreQuiz, createFlashcardDeck, resetDeck, deckProgress, languageMeta, explainIntro } from './samajh.js';

// Fallback copies of the samples, used only if fetch() cannot read the
// samples/ files (e.g. when index.html is opened directly from disk).
const SAMPLE_FALLBACK = {
  ohm: "Ohm's law describes how current, voltage and resistance are related in a simple circuit. If the temperature of a metal wire stays constant, the current flowing through it is directly proportional to the voltage across it. This relationship is written as V = I × R, where V is voltage in volts, I is current in amperes and R is resistance in ohms. For example, a 12 V battery connected across a 4 ohm resistor drives a current of 3 A. Doubling the resistance while keeping the voltage the same halves the current.",
  photosynthesis: 'Photosynthesis is the process by which green plants make their own food. Inside the chloroplasts, chlorophyll absorbs sunlight. The plant uses this energy to turn carbon dioxide from the air and water from the soil into glucose and oxygen. The overall reaction is 6CO2 + 6H2O → C6H12O6 + 6O2, which requires light. Oxygen is released through tiny pores called stomata, while glucose is used for growth or stored as starch.',
  newton2: "Newton's second law states that the net force acting on an object equals its mass multiplied by its acceleration, F = m × a. Force is measured in newtons, mass in kilograms and acceleration in metres per second squared. If the same force acts on two objects, the lighter object accelerates more. For example, a net force of 10 N on a 2 kg trolley gives an acceleration of 5 m/s².",
};

const $ = (id) => document.getElementById(id);
const passageEl = $('passage');
const errorEl = $('input-error');
const explainBtn = $('explain-btn');

let current = null; // { result, passage, level, language }
let quizAnswers = [];
let deck = null; // flashcard deck { terms, index, known } — see samajh.js
let cardFlipped = false;

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function highlightTerms(text, terms) {
  let out = escapeHtml(text);
  for (const t of terms) {
    const re = new RegExp(`\\b(${t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
    out = out.replace(re, '<span class="term">$1</span>');
  }
  return out;
}

function showError(message) {
  if (!message) { errorEl.hidden = true; errorEl.textContent = ''; passageEl.setAttribute('aria-invalid', 'false'); return; }
  errorEl.hidden = false; errorEl.textContent = message;
  passageEl.setAttribute('aria-invalid', 'true');
}

function updateCount() { $('char-count').textContent = passageEl.value.length; }
passageEl.addEventListener('input', updateCount);

async function loadSample(name) {
  try {
    const res = await fetch(`samples/${name}.txt`);
    if (res.ok) return (await res.text()).trim();
  } catch { /* fall through to the embedded copy */ }
  return SAMPLE_FALLBACK[name];
}

document.querySelectorAll('.sample-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    passageEl.value = await loadSample(btn.dataset.sample);
    updateCount(); showError('');
    passageEl.focus();
  });
});

$('hero-sample').addEventListener('click', async () => {
  passageEl.value = await loadSample('ohm');
  updateCount();
  document.getElementById('tool').scrollIntoView({ behavior: 'smooth' });
  runExplain();
});

explainBtn.addEventListener('click', runExplain);

async function runExplain() {
  const level = $('level').value;
  const language = $('language').value;
  const validation = validateInput(passageEl.value, level, language);
  if (!validation.ok) { showError(validation.message); return; }
  showError('');
  explainBtn.disabled = true;
  explainBtn.textContent = 'Working…';
  $('empty-state').hidden = true;
  $('results').hidden = true;
  $('loading').hidden = false;
  try {
    const useAI = $('ai-toggle') ? $('ai-toggle').checked : true;
    const { result, mode, reason } = await runPipeline(validation.text, level, language, { useAI });
    current = { result, passage: validation.text, level, language };
    render(result, mode, reason);
  } catch (e) {
    showError(e.message || 'Something went wrong. Try a shorter passage.');
    $('loading').hidden = true;
    $('empty-state').hidden = false;
  } finally {
    explainBtn.disabled = false;
    explainBtn.textContent = 'Explain';
  }
}

function render(result, mode, reason) {
  $('loading').hidden = true;
  $('results').hidden = false;
  $('results').classList.add('fade-in');
  const chip = $('mode-chip');
  chip.textContent = mode === 'ai'
    ? '✓ AI mode — Pollinations (free, no key)'
    : '⚠ Offline mode — AI off or unavailable';
  chip.className = mode === 'ai' ? 'chip ai' : 'chip offline';
  $('mode-note').textContent = reason
    + (result.aiRejected ? ` (${result.aiRejected})` : '')
    + (result.mode === 'ai' ? ' Quiz and glossary are still checked offline against your passage.' : '');

  const lang = result.language;
  const meta = languageMeta(lang);
  const introEl = $('explain-intro');
  introEl.textContent = explainIntro(lang);
  if (meta.dir === 'rtl') { introEl.setAttribute('dir', 'rtl'); introEl.setAttribute('lang', meta.lang); }
  else { introEl.removeAttribute('dir'); introEl.removeAttribute('lang'); }

  $('takeaway').textContent = result.oneLine;
  $('explanation').innerHTML = result.explanationSentences
    .map((s) => `<p>${highlightTerms(s, result.keyTerms)}</p>`).join('');

  // Number warning: if the explanation contains a number or formula that
  // is not in the passage, say so in amber (icon + words). It cannot
  // trigger in offline mode — the explanation is extractive — but the
  // same check guards a future AI provider's output, and the path is
  // unit-tested with a hand-built result (see tests).
  const warning = numberWarningText(result);
  const warningEl = $('number-warning');
  if (warning) { warningEl.hidden = false; warningEl.textContent = warning; }
  else { warningEl.hidden = true; warningEl.textContent = ''; }

  // Original passage, sentence by sentence, so evidence can be highlighted.
  $('original').innerHTML = splitSentences(current.passage)
    .map((s) => `<span class="sent" data-norm="${escapeHtml(normalise(s))}">${escapeHtml(s)}</span> `).join('');

  renderGlossary(result);
  renderQuiz(result);
  // A new run starts a fresh deck: do not carry "Know it" marks or the
  // card position over from the previous passage.
  deck = createFlashcardDeck(result.keyTerms);
  resetDeck(deck);
  renderCard();
  selectTab('explain');
}

function localMeaning(term, language) {
  if (term.meanings) return term.meanings[language] || null;
  if (language === 'roman') return term.meaning_roman;
  if (language === 'urdu') return term.meaning_urdu;
  return null;
}

function localAttrs(language) {
  // dir + lang for the local-meaning text, so RTL languages (Urdu, Arabic)
  // lay out correctly and non-Latin scripts get the right font.
  const meta = languageMeta(language);
  if (language === 'english') return '';
  return meta.dir === 'rtl' ? ` dir="rtl" lang="${meta.lang}"` : ` lang="${meta.lang}"`;
}

function renderGlossary(result) {
  const lang = result.language;
  $('glossary').innerHTML = result.keyTerms.map((t) => {
    const local = localMeaning(t, lang);
    const localHtml = local
      ? `<p${localAttrs(lang)}${lang === 'urdu' ? ' class="urdu"' : ''}>${escapeHtml(local)}</p>`
      : '<p class="muted">English meaning only — this term is not in the checked glossary, so no translation is guessed.</p>';
    return `<article><h3>${escapeHtml(t.term)}</h3><p>${escapeHtml(t.meaning_en)}</p>${localHtml}</article>`;
  }).join('');
}

function renderQuiz(result) {
  quizAnswers = new Array(result.quiz.length).fill(null);
  $('quiz-verified').textContent = `${result.verifiedCount} of ${result.totalQuiz} answers verified in the passage`;
  $('quiz-score').hidden = true;
  $('quiz').innerHTML = result.quiz.map((q, i) => {
    const badge = q.verified
      ? '<span class="badge ok">✓ Found in passage</span>'
      : '<span class="badge warn">⚠ Could not verify — check yourself</span>';
    return `<div class="quiz-item" id="quiz-item-${i}">
      <p><strong>Q${i + 1}.</strong> ${escapeHtml(q.question)}</p>
      <div class="options" role="group" aria-label="Question ${i + 1} options">
        ${q.options.map((o, j) => `<button class="option" type="button" data-q="${i}" data-o="${j}">${escapeHtml(o)}</button>`).join('')}
      </div>
      <div class="feedback" id="feedback-${i}" hidden>
        <p id="feedback-text-${i}"></p>
        <p class="muted" id="feedback-reason-${i}"></p>
        <p class="evidence">Evidence: “<span id="feedback-evidence-${i}"></span>” ${badge}</p>
        <p><button class="link-btn" type="button" data-show-evidence="${i}">Show in passage ↑</button></p>
      </div>
    </div>`;
  }).join('');
  $('quiz-progress').textContent = 'Question 1 of 5 — answer any question to begin';
  document.querySelectorAll('.option').forEach((btn) => btn.addEventListener('click', () => answerQuiz(btn)));
  document.querySelectorAll('[data-show-evidence]').forEach((btn) => btn.addEventListener('click', () => {
    const q = current.result.quiz[Number(btn.dataset.showEvidence)];
    showInPassage(q.evidence);
  }));
}

function answerQuiz(btn) {
  const qi = Number(btn.dataset.q);
  const oi = Number(btn.dataset.o);
  if (quizAnswers[qi] !== null) return;
  const q = current.result.quiz[qi];
  quizAnswers[qi] = oi;
  const item = $(`quiz-item-${qi}`);
  const correct = oi === q.answer_index;
  item.classList.add(correct ? 'answered-correct' : 'answered-wrong');
  item.querySelectorAll('.option').forEach((b) => {
    b.disabled = true;
    const j = Number(b.dataset.o);
    if (j === q.answer_index) b.classList.add('correct');
    else if (j === oi) b.classList.add('wrong');
  });
  $(`feedback-${qi}`).hidden = false;
  $(`feedback-text-${qi}`).textContent = correct ? '✓ Correct.' : `✕ Not quite — the answer is “${q.options[q.answer_index]}”.`;
  $(`feedback-reason-${qi}`).textContent = q.reason;
  $(`feedback-evidence-${qi}`).textContent = q.evidence;
  const answered = quizAnswers.filter((a) => a !== null).length;
  $('quiz-progress').textContent = `Answered ${answered} of ${current.result.quiz.length}`;
  if (answered === current.result.quiz.length) {
    const score = scoreQuiz(current.result.quiz, quizAnswers);
    $('quiz-score').hidden = false;
    $('score-text').textContent = `${score} of ${current.result.quiz.length}`;
    $('score-ring').style.setProperty('--score', String((score / current.result.quiz.length) * 100));
    $('score-note').textContent = score === 5 ? 'Full marks — every answer is backed by a sentence in your passage.'
      : 'Check the ones you missed: each one shows the sentence that proves the answer.';
  }
}

function showInPassage(evidence) {
  selectTab('explain');
  const norm = normalise(evidence);
  const span = [...document.querySelectorAll('#original .sent')].find((s) => s.dataset.norm === norm);
  if (span) {
    document.querySelectorAll('#original .sent').forEach((s) => s.classList.remove('hl'));
    span.classList.add('hl');
    span.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// --- Tabs -------------------------------------------------------------------
const TABS = ['explain', 'terms', 'quiz', 'cards'];
function selectTab(name) {
  TABS.forEach((t) => {
    const tab = $(`tab-${t}`);
    const panel = $(`panel-${t}`);
    const selected = t === name;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panel.hidden = !selected;
  });
}
TABS.forEach((t) => $(`tab-${t}`).addEventListener('click', () => selectTab(t)));
document.querySelector('.tabs').addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const i = TABS.findIndex((t) => $(`tab-${t}`).getAttribute('aria-selected') === 'true');
  const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
  selectTab(next); $(`tab-${next}`).focus();
});

// --- Flashcards ---------------------------------------------------------------
function renderCard() {
  if (!current || !deck) return;
  const terms = deck.terms;
  if (!terms.length) { $('card-front').textContent = 'No terms found.'; return; }
  deck.index = Math.min(deck.index, terms.length - 1);
  const t = terms[deck.index];
  cardFlipped = false;
  $('flashcard').classList.remove('flipped');
  $('card-front').textContent = t.term;
  $('card-back').textContent = t.meaning_en;
  const local = localMeaning(t, current.language);
  const backLocal = $('card-back-local');
  backLocal.textContent = local || '';
  backLocal.className = current.language === 'urdu' ? 'urdu' : 'muted';
  const meta = languageMeta(current.language);
  if (meta.dir === 'rtl') { backLocal.setAttribute('dir', 'rtl'); backLocal.setAttribute('lang', meta.lang); }
  else if (current.language !== 'english') { backLocal.setAttribute('lang', meta.lang); backLocal.removeAttribute('dir'); }
  else { backLocal.removeAttribute('dir'); backLocal.removeAttribute('lang'); }
  $('card-progress').textContent = deckProgress(deck, current.language);
}
$('flashcard').addEventListener('click', () => {
  cardFlipped = !cardFlipped;
  $('flashcard').classList.toggle('flipped', cardFlipped);
});
function nextCard() { if (!current || !deck) return; deck.index = (deck.index + 1) % deck.terms.length; renderCard(); }
$('card-next').addEventListener('click', nextCard);
$('card-prev').addEventListener('click', () => {
  if (!current || !deck) return;
  deck.index = (deck.index - 1 + deck.terms.length) % deck.terms.length;
  renderCard();
});
$('card-know').addEventListener('click', () => {
  if (!current || !deck) return;
  deck.known.add(deck.index);
  renderCard(); nextCard();
});
$('card-again').addEventListener('click', () => { nextCard(); });

// --- Download -----------------------------------------------------------------
$('download-btn').addEventListener('click', () => {
  if (!current) return;
  const md = buildStudySheet(current.result, current.passage, current.level, current.language);
  const blob = new Blob([md], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'samajh-study-sheet.md';
  a.click();
  URL.revokeObjectURL(a.href);
});

updateCount();
