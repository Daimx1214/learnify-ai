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

## AI-mode eval (measured 21 November 2026, ~17:20 PKT, live Pollinations API)

Same 3 samples × 3 languages = 9 runs, real API calls via `aiEngine()` (`eval/run_ai_eval.mjs`).

| Sample | Language | Mode | Time (ms) | Quiz verified | Numbers changed |
|---|---|---|---|---|---|
| ohm | english | ai | 5,593 | 5/5 | 0 |
| ohm | roman | offline (AI failed, fallback) | 298 | 5/5 | 0 |
| ohm | urdu | ai | 6,567 | 5/5 | 0 |
| photosynthesis | english | ai | 4,707 | 5/5 | 0 |
| photosynthesis | roman | offline (AI failed, fallback) | 215 | 5/5 | 0 |
| photosynthesis | urdu | ai | 5,909 | 5/5 | 0 |
| newton2 | english | ai | 5,497 | 5/5 | 0 |
| newton2 | roman | offline (AI failed, fallback) | 246 | 5/5 | 0 |
| newton2 | urdu | ai | 5,002 | 5/5 | 0 |

- AI mode used: **6 of 9 runs**; fallback to offline: **3 of 9** (all three were Roman Urdu, all failed fast in ~200–300 ms — a transient API failure, not a validation rejection; a single Roman Urdu call retried minutes later succeeded). The fallback is the design working as intended: the student still gets a correct, evidence-checked result.
- Explanations that changed a number or formula: **0 of 9 runs** (the number check rejected nothing this run; the rejection path is unit-tested with a hand-built bad AI reply).
- Quiz verified: **45 of 45 (100%)** in both modes — the quiz is always built offline.
- AI explanation time: about **5–7 seconds** per run when the API answers (network time, not engine time).

## Summary (measured)

- Quiz items with evidence verified: **45 of 45 (100.0%)**
- Quiz answers manually checked as correct: **45 of 45 (100%)** — I read every item in eval/quiz_dump.md and checked that the marked answer is the only sensible word for the blank, given the evidence sentence.
- Explanations that changed a number or formula: **0 of 9 runs** (offline) and **0 of 9 runs** (AI mode)
- Median time to result (median of the 9 run-medians): **1.26 ms** (offline engine only; AI mode takes about 5–7 s per run over the network)
- Student clarity rating (1–5): **not measured** (no student test was run before the deadline)
- AI mode: **measured — 6 of 9 runs used AI, 3 fell back to offline** (see above)

## What the numbers mean

- Evidence is verified by design in the offline engine: each quiz item blanks a word out of its own evidence sentence, so the sentence is always found in the passage. The check still runs on every item and would flag a fake sentence (see the unit tests).
- Numbers and formulas are copied from the passage, never reworded, so none changed in any run.
