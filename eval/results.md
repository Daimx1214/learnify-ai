# Samajh — evaluation results (measured 21 November 2026)

Offline engine only (PROVIDER=none). 3 sample passages × 3 languages = 9 runs. Each run timed 5 times; the median is shown.

| Sample | Language | Median time (ms) | Quiz items | Verified | Terms | Numbers changed |
|---|---|---|---|---|---|---|
| ohm | english | 2.73 | 5 | 5 | 8 | 0 |
| ohm | roman | 1.83 | 5 | 5 | 8 | 0 |
| ohm | urdu | 1.27 | 5 | 5 | 8 | 0 |
| photosynthesis | english | 1.23 | 5 | 5 | 8 | 0 |
| photosynthesis | roman | 1.06 | 5 | 5 | 8 | 0 |
| photosynthesis | urdu | 1.07 | 5 | 5 | 8 | 0 |
| newton2 | english | 1.28 | 5 | 5 | 8 | 0 |
| newton2 | roman | 1.21 | 5 | 5 | 8 | 0 |
| newton2 | urdu | 1.25 | 5 | 5 | 8 | 0 |

## Summary (measured)

- Quiz items with evidence verified: **45 of 45 (100.0%)**
- Quiz answers manually checked as correct: **45 of 45 (100%)** — I read every item in eval/quiz_dump.md and checked that the marked answer is the only sensible word for the blank, given the evidence sentence.
- Explanations that changed a number or formula: **0 of 9 runs**
- Median time to result (median of the 9 run-medians): **1.25 ms** (in-process engine time only; excludes the 400 ms skeleton pause in the UI)
- Student clarity rating (1–5): **not measured** (no student test was run before the deadline)
- AI mode: **measured live, see below** (Pollinations text API, free, no key)

## AI mode (measured live, 21 November 2026)

Same 3 passages × 3 languages, run with AI mode on (`node eval/run_ai_eval.mjs`). The AI writes only the explanation + takeaway; the quiz and glossary are always built offline, so the quiz numbers below are the same engine as the offline table.

| Run | AI used | Offline fallback | Numbers changed | Quiz verified |
|---|---|---|---|---|
| Run 1, ~17:20 PKT | 6/9 | 3/9 (all Roman Urdu, transient API failures ~200–300 ms; a Roman retry minutes later succeeded) | 0 | 45/45 |
| Run 2, ~18:00 PKT (re-check) | 8/9 | 1/9 (newton2 / roman) | 0 | 45/45 |
| **Total** | **14/18** | **4/18** | **0** | **90/90** |

AI answer times in run 2: 0.27–5.4 s per explanation (fallback is instant). One Roman Urdu AI explanation in run 2 had a garbled phrase, but its numbers and formulas were still exact and the quiz (built offline) was unaffected — the number check would have discarded the AI text if a number had changed.

## What the numbers mean

- Evidence is verified by design in the offline engine: each quiz item blanks a word out of its own evidence sentence, so the sentence is always found in the passage. The check still runs on every item and would flag a fake sentence (see the unit tests).
- Numbers and formulas are copied from the passage, never reworded, so none changed in any run.
