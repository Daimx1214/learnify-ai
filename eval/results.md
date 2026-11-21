# Samajh — evaluation results (measured 21 November 2026)

Offline engine only (PROVIDER=none). 3 sample passages × 3 languages = 9 runs. Each run timed 5 times; the median is shown.

| Sample | Language | Median time (ms) | Quiz items | Verified | Terms | Numbers changed |
|---|---|---|---|---|---|---|
| ohm | english | 2.84 | 5 | 5 | 8 | 0 |
| ohm | roman | 1.76 | 5 | 5 | 8 | 0 |
| ohm | urdu | 1.26 | 5 | 5 | 8 | 0 |
| photosynthesis | english | 1.53 | 5 | 5 | 8 | 0 |
| photosynthesis | roman | 1.15 | 5 | 5 | 8 | 0 |
| photosynthesis | urdu | 1.29 | 5 | 5 | 8 | 0 |
| newton2 | english | 1.24 | 5 | 5 | 8 | 0 |
| newton2 | roman | 1.24 | 5 | 5 | 8 | 0 |
| newton2 | urdu | 1.25 | 5 | 5 | 8 | 0 |

## Summary (measured)

- Quiz items with evidence verified: **45 of 45 (100.0%)**
- Quiz answers manually checked as correct: **45 of 45 (100%)** — I read every item in eval/quiz_dump.md and checked that the marked answer is the only sensible word for the blank, given the evidence sentence.
- Explanations that changed a number or formula: **0 of 9 runs**
- Median time to result (median of the 9 run-medians): **1.26 ms** (in-process engine time only; excludes the 400 ms skeleton pause in the UI)
- Student clarity rating (1–5): **not measured** (no student test was run before the deadline)
- AI mode: **not measured** (no AI provider is connected; PROVIDER=none)

## What the numbers mean

- Evidence is verified by design in the offline engine: each quiz item blanks a word out of its own evidence sentence, so the sentence is always found in the passage. The check still runs on every item and would flag a fake sentence (see the unit tests).
- Numbers and formulas are copied from the passage, never reworded, so none changed in any run.
