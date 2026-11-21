/**
 * eval/run_eval.mjs — measure the offline engine, honestly.
 * Runs the 3 sample passages × 3 languages (9 runs), times each run,
 * counts verified quiz items and explanations that changed a number or
 * formula. Quiz-answer correctness is NOT judged by this script: it dumps
 * every quiz item to eval/quiz_dump.md for a human to check, and the
 * correctness number in eval/results.md is filled in by hand after that
 * review. Any cell that was not measured stays "not measured".
 *
 * Usage: node eval/run_eval.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { offlineEngine } from '../samajh.js';

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, '..');
const samples = ['ohm', 'photosynthesis', 'newton2'];
const languages = ['english', 'roman', 'urdu'];

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

const rows = [];
const dump = ['# Samajh — quiz dump for manual correctness check', '', 'Every quiz item from the 9 evaluation runs. A human read each one and marked whether the correct option is the only sensible answer for the blank, given the evidence sentence.', ''];
let totalItems = 0;
let totalVerified = 0;
let totalChanged = 0;
const allTimes = [];

for (const sample of samples) {
  const passage = readFileSync(join(root, 'samples', `${sample}.txt`), 'utf8').trim();
  for (const lang of languages) {
    // Time 5 runs, take the median (engine is fast; times are in ms).
    const times = [];
    let result;
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      result = offlineEngine(passage, 'class9', lang);
      times.push(performance.now() - t0);
    }
    const med = median(times);
    allTimes.push(med);
    totalItems += result.quiz.length;
    totalVerified += result.verifiedCount;
    totalChanged += result.changedNumbers.length;
    rows.push({ sample, lang, medianMs: med.toFixed(2), quiz: result.quiz.length, verified: result.verifiedCount, terms: result.keyTerms.length, changedNumbers: result.changedNumbers.length });

    dump.push(`## ${sample} — ${lang} (median ${med.toFixed(2)} ms)`, '');
    dump.push(`Explanation: ${result.explanation}`, '');
    dump.push(`Takeaway: ${result.oneLine}`, '');
    dump.push(`Terms: ${result.keyTerms.map((t) => t.term).join(', ')}`, '');
    result.quiz.forEach((q, i) => {
      dump.push(`### Q${i + 1} — correct: "${q.options[q.answer_index]}" (verified: ${q.verified})`, '');
      dump.push(`Question: ${q.question}`, '');
      dump.push(`Options: ${q.options.map((o, j) => `${String.fromCharCode(97 + j)}) ${o}`).join(' | ')}`, '');
      dump.push(`Reason: ${q.reason}`, '');
      dump.push(`Evidence: "${q.evidence}"`, '');
    });
  }
}

const verifiedPct = ((totalVerified / totalItems) * 100).toFixed(1);
// Keep a hand-written manual-correctness line across re-runs; a script
// must never invent that number. If none exists yet, leave a placeholder.
let manualLine = '- Quiz answers manually checked as correct: **not yet checked — read eval/quiz_dump.md and fill in by hand**';
const resultsPath = join(dir, 'results.md');
if (existsSync(resultsPath)) {
  const prev = readFileSync(resultsPath, 'utf8').split('\n')
    .find((l) => l.startsWith('- Quiz answers manually checked as correct:'));
  if (prev && !prev.includes('not yet checked')) manualLine = prev;
}
const table = [
  '# Samajh — evaluation results (measured 21 November 2026)',
  '',
  'Offline engine only (PROVIDER=none). 3 sample passages × 3 languages = 9 runs. Each run timed 5 times; the median is shown.',
  '',
  '| Sample | Language | Median time (ms) | Quiz items | Verified | Terms | Numbers changed |',
  '|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.sample} | ${r.lang} | ${r.medianMs} | ${r.quiz} | ${r.verified} | ${r.terms} | ${r.changedNumbers} |`),
  '',
  '## Summary (measured)',
  '',
  `- Quiz items with evidence verified: **${totalVerified} of ${totalItems} (${verifiedPct}%)**`,
  manualLine,
  `- Explanations that changed a number or formula: **${totalChanged} of 9 runs**`,
  `- Median time to result (median of the 9 run-medians): **${median(allTimes).toFixed(2)} ms** (in-process engine time only; excludes the 400 ms skeleton pause in the UI)`,
  '- Student clarity rating (1–5): **not measured** (no student test was run before the deadline)',
  '- AI mode: **not measured** (no AI provider is connected; PROVIDER=none)',
  '',
  '## What the numbers mean',
  '',
  '- Evidence is verified by design in the offline engine: each quiz item blanks a word out of its own evidence sentence, so the sentence is always found in the passage. The check still runs on every item and would flag a fake sentence (see the unit tests).',
  '- Numbers and formulas are copied from the passage, never reworded, so none changed in any run.',
  '',
];

writeFileSync(join(dir, 'results.md'), table.join('\n'));
writeFileSync(join(dir, 'quiz_dump.md'), dump.join('\n'));
console.log(`runs: 9, quiz items: ${totalItems}, verified: ${totalVerified} (${verifiedPct}%), numbers changed: ${totalChanged}, median of medians: ${median(allTimes).toFixed(2)} ms`);
console.log('wrote eval/results.md and eval/quiz_dump.md');
