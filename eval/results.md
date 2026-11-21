# Samajh — evaluation results (measured 21 November 2026)

Offline engine only (PROVIDER=none). 3 sample passages × 13 languages = 39 runs. Each run timed 5 times; the median is shown.

| Sample | Language | Median time (ms) | Quiz items | Verified | Terms | Numbers changed |
|---|---|---|---|---|---|---|
| ohm | english | 2.94 | 5 | 5 | 8 | 0 |
| ohm | roman | 3.19 | 5 | 5 | 8 | 0 |
| ohm | urdu | 1.57 | 5 | 5 | 8 | 0 |
| ohm | hindi | 1.76 | 5 | 5 | 8 | 0 |
| ohm | bengali | 1.26 | 5 | 5 | 8 | 0 |
| ohm | arabic | 1.25 | 5 | 5 | 8 | 0 |
| ohm | spanish | 1.29 | 5 | 5 | 8 | 0 |
| ohm | french | 1.27 | 5 | 5 | 8 | 0 |
| ohm | portuguese | 1.09 | 5 | 5 | 8 | 0 |
| ohm | german | 1.25 | 5 | 5 | 8 | 0 |
| ohm | turkish | 1.15 | 5 | 5 | 8 | 0 |
| ohm | indonesian | 1.16 | 5 | 5 | 8 | 0 |
| ohm | chinese | 1.16 | 5 | 5 | 8 | 0 |
| photosynthesis | english | 1.28 | 5 | 5 | 8 | 0 |
| photosynthesis | roman | 1.05 | 5 | 5 | 8 | 0 |
| photosynthesis | urdu | 1.07 | 5 | 5 | 8 | 0 |
| photosynthesis | hindi | 1.15 | 5 | 5 | 8 | 0 |
| photosynthesis | bengali | 1.03 | 5 | 5 | 8 | 0 |
| photosynthesis | arabic | 1.07 | 5 | 5 | 8 | 0 |
| photosynthesis | spanish | 1.02 | 5 | 5 | 8 | 0 |
| photosynthesis | french | 1.22 | 5 | 5 | 8 | 0 |
| photosynthesis | portuguese | 1.25 | 5 | 5 | 8 | 0 |
| photosynthesis | german | 1.14 | 5 | 5 | 8 | 0 |
| photosynthesis | turkish | 1.02 | 5 | 5 | 8 | 0 |
| photosynthesis | indonesian | 1.12 | 5 | 5 | 8 | 0 |
| photosynthesis | chinese | 1.19 | 5 | 5 | 8 | 0 |
| newton2 | english | 1.09 | 5 | 5 | 8 | 0 |
| newton2 | roman | 1.13 | 5 | 5 | 8 | 0 |
| newton2 | urdu | 1.03 | 5 | 5 | 8 | 0 |
| newton2 | hindi | 1.05 | 5 | 5 | 8 | 0 |
| newton2 | bengali | 1.04 | 5 | 5 | 8 | 0 |
| newton2 | arabic | 1.03 | 5 | 5 | 8 | 0 |
| newton2 | spanish | 1.04 | 5 | 5 | 8 | 0 |
| newton2 | french | 1.09 | 5 | 5 | 8 | 0 |
| newton2 | portuguese | 1.24 | 5 | 5 | 8 | 0 |
| newton2 | german | 1.31 | 5 | 5 | 8 | 0 |
| newton2 | turkish | 1.22 | 5 | 5 | 8 | 0 |
| newton2 | indonesian | 0.97 | 5 | 5 | 8 | 0 |
| newton2 | chinese | 1.19 | 5 | 5 | 8 | 0 |

## Summary (measured)

- Quiz items with evidence verified: **195 of 195 (100.0%)**
- Quiz answers manually checked as correct: **45 of 45 unique items (100%)** — I read every item in eval/quiz_dump.md and checked that the marked answer is the only sensible word for the blank, given the evidence sentence. The 13-language runs reuse those same 45 items (195 total): only the question/reason wording is localized, options, answers and evidence are identical — spot-checked in Spanish, Arabic, French and Chinese in the new dump.
- Explanations that changed a number or formula: **0 of 39 runs**
- Median time to result (median of the 39 run-medians): **1.15 ms** (in-process engine time only; excludes the 400 ms skeleton pause in the UI)
- Student clarity rating (1–5): **not measured** (no student test was run before the deadline)
- AI mode: **measured live — see the AI mode section below**

## AI mode (measured live, 21 November 2026)

Same 3 passages, run with AI mode on (`node eval/run_ai_eval.mjs`). The AI writes only the explanation + takeaway; the quiz and glossary are always built offline, so the quiz numbers below are the same engine as the offline table.

| Run | Languages | AI used | Offline fallback | Numbers changed | Quiz verified |
|---|---|---|---|---|---|
| Run 1, ~17:20 PKT | 3 (en, roman, urdu) | 6/9 | 3/9 (all Roman Urdu, transient API failures ~200–300 ms; a Roman retry minutes later succeeded) | 0 | 45/45 |
| Run 2, ~18:00 PKT (re-check) | 3 (en, roman, urdu) | 8/9 | 1/9 (newton2 / roman) | 0 | 45/45 |
| Run 3, ~18:15 PKT (13 languages) | 13 (all) | 26/39 | 13/39 (transient API failures, spread across languages; fallback is instant and the offline explanation is shown) | 0 | 195/195 |
| **Total** | | **40/57** | **17/57** | **0** | **285/285** |

AI answer times in run 3: 0.2–7.3 s per explanation (fallback is instant). Every language produced an AI explanation in that language at least once (Hindi, Bengali, Arabic, Spanish, French, Portuguese, German, Turkish, Indonesian and Chinese all appear in the run-3 output). One Roman Urdu AI explanation (photosynthesis, runs 2 and 3) had a garbled phrase, but its numbers and formulas were still exact and the quiz (built offline) was unaffected — the number check would have discarded the AI text if a number had changed.

## What the numbers mean

- Evidence is verified by design in the offline engine: each quiz item blanks a word out of its own evidence sentence, so the sentence is always found in the passage. The check still runs on every item and would flag a fake sentence (see the unit tests).
- Numbers and formulas are copied from the passage, never reworded, so none changed in any run.
